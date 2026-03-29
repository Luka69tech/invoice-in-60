import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paymento";
import { redis } from "@/lib/redis";
import { PAYMENTO_STATUS, isPaidStatus } from "@/lib/paymento";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("paymento-signature") || req.headers.get("x-paymento-signature");

    // Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature || "")) {
      console.error("[paymento-webhook] Invalid signature");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    // Paymento sends: Token, PaymentId, OrderId, OrderStatus, AdditionalData
    const { OrderId, OrderStatus, Token, PaymentId, AdditionalData } = payload;

    console.log(`[paymento-webhook] Order ${OrderId} status: ${OrderStatus} (${PAYMENTO_STATUS[OrderStatus] || "unknown"})`);

    if (isPaidStatus(OrderStatus)) {
      // Store payment confirmation in Redis
      await redis.set(`paymento_payment_${OrderId}`, JSON.stringify({
        paid: true,
        orderId: OrderId,
        paymentId: PaymentId,
        token: Token,
        status: OrderStatus,
        timestamp: Date.now(),
        additionalData: AdditionalData,
      }), { ex: 60 * 60 * 24 * 30 }); // 30 day expiry

      console.log(`[paymento-webhook] Payment confirmed for order ${OrderId}`);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("[paymento-webhook] Error:", err);
    // Still return 200 to prevent Paymento from retrying non-recoverable errors
    return new NextResponse("OK", { status: 200 });
  }
}