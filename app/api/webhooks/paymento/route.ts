import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paymento";
import { redis } from "@/lib/redis";
import { PAYMENTO_STATUS, isPaidStatus } from "@/lib/paymento";
import { incrementRateLimit, shouldAlert } from "@/lib/monitoring";
import { sendTelegram } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("cf-connecting-ip")?.trim()
      || "unknown";

    // Rate limiting: 50+ requests/minute = suspicious
    const requestCount = await incrementRateLimit(ip, 60000);
    if (requestCount >= 50) {
      const canAlert = await shouldAlert(`rate_limit_${ip}`, 300);
      if (canAlert) {
        await sendTelegram(`🚨 *RATE LIMIT TRIGGERED*\n\nIP: \`${ip}\`\n${requestCount} requests in the last minute\n\nEndpoint: /api/webhooks/paymento`);
      }
      console.error(`[webhook] Rate limit exceeded from IP: ${ip} (${requestCount} req/min)`);
    }

    const rawBody = await req.text();
    const signature = req.headers.get("paymento-signature") || req.headers.get("x-paymento-signature");

    // Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature || "")) {
      // Track invalid signature attempts
      const key = "monitor:webhook:invalid_sigs";
      const now = Date.now();
      const windowStart = now - 5 * 60 * 1000;

      await redis.zadd(key, { score: now, member: JSON.stringify({ ts: now, ip }) });
      await redis.zremrangebyrank(key, 0, -(10001));

      // Count invalid sigs in last 5 minutes - use zrange with byScore
      const allInvalidSigs: Array<string | number> = await redis.zrange(key, 0, -1);
      let errorCount = 0;
      for (const raw of allInvalidSigs) {
        try {
          const e = JSON.parse(raw as string);
          if (e.ts >= windowStart) errorCount++;
        } catch {}
      }
      if (errorCount >= 3) {
        const canAlert = await shouldAlert("invalid_sig_flood", 600);
        if (canAlert) {
          await sendTelegram(`⚠️ *WEBHOOK SIGNATURE ATTACK*\n\n${errorCount} invalid signature attempts in the last 5 minutes\n\nLast IP: \`${ip}\`\nTime: ${new Date().toISOString()}`);
        }
      }

      console.error("[paymento-webhook] Invalid signature from IP:", ip);
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const { OrderId, OrderStatus, Token, PaymentId, AdditionalData } = payload;

    console.log(`[paymento-webhook] Order ${OrderId} status: ${OrderStatus} (${PAYMENTO_STATUS[OrderStatus] || "unknown"})`);

    if (isPaidStatus(OrderStatus)) {
      // Determine plan from additional data or order
      const source = AdditionalData?.find((a: { key: string; value: string }) => a.key === "source");
      const planType = OrderId?.includes("business") ? "business" : "pro";

      await redis.set(`paymento_payment_${OrderId}`, JSON.stringify({
        paid: true,
        orderId: OrderId,
        paymentId: PaymentId,
        token: Token,
        status: OrderStatus,
        timestamp: Date.now(),
        plan: planType,
        additionalData: AdditionalData,
      }), { ex: 60 * 60 * 24 * 30 });

      // Update payment stats
      await redis.incr("stats:payments:total");
      if (planType === "pro") {
        await redis.incr("stats:payments:pro");
      } else if (planType === "business") {
        await redis.incr("stats:payments:business");
      }

      // Send payment notification
      const planLabel = planType === "business" ? "Business" : "Pro";
      await sendTelegram(`💰 *PAYMENT RECEIVED*\n\nPlan: *${planLabel}*\nOrder: \`${OrderId}\`\nAmount: $${planType === "business" ? "19" : "9"}\n\nTime: ${new Date().toLocaleString()}`);

      console.log(`[paymento-webhook] Payment confirmed for order ${OrderId}`);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("[paymento-webhook] Error:", err);
    return new NextResponse("OK", { status: 200 });
  }
}