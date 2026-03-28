import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { redis } from "@/lib/redis";
import { SECURITY_HEADERS } from "@/lib/security/headers";

const PAYMENTO_STATUS: Record<number, string> = {
  0: "Initialize",
  1: "Pending",
  2: "PartialPaid",
  3: "WaitingToConfirm",
  4: "Timeout",
  5: "UserCanceled",
  7: "Paid",
  8: "Approve",
  9: "Reject",
};

function isPaidStatus(status: number): boolean {
  return status === 7 || status === 8;
}

function verifyWebhookSignature(payload: string, signature: string): boolean {
  const secretKey = process.env.PAYMENTO_SECRET_KEY;
  if (!secretKey) {
    console.error("[paymento-webhook] Secret key not configured");
    return false;
  }

  const calculatedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(payload)
    .digest("hex")
    .toUpperCase();

  return calculatedSignature === signature.toUpperCase();
}

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("X-Hmac-Sha256-Signature") || "";
    const rawBody = await req.text();

    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.log(`[paymento-webhook] INVALID signature - rejecting request`);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401, headers: SECURITY_HEADERS }
      );
    }
    console.log(`[paymento-webhook] Signature valid - processing webhook`);

    const body = JSON.parse(rawBody);
    const { OrderId, OrderStatus, AdditionalData = [] } = body;

    console.log(`[paymento-webhook] Order ${OrderId} status: ${PAYMENTO_STATUS[OrderStatus]} (${OrderStatus})`);

    if (isPaidStatus(OrderStatus)) {
      const additionalDataObj: Record<string, string> = {};
      AdditionalData.forEach((item: { key: string; value: string }) => {
        additionalDataObj[item.key] = item.value;
      });

      const invoiceId = additionalDataObj["invoiceId"] || OrderId;
      console.log(`[paymento-webhook] Payment confirmed for ${invoiceId}, marking as paid...`);

      try {
        const key = `paymento_payment_${invoiceId}`;
        await redis.set(key, JSON.stringify({
          orderId: OrderId,
          status: PAYMENTO_STATUS[OrderStatus],
          paidAt: Date.now(),
          rawBody,
        }));
        await redis.expire(key, 86400 * 7);

        console.log(`[paymento-webhook] Payment stored for ${invoiceId}`);
      } catch (redisErr) {
        console.error("[paymento-webhook] Redis error:", redisErr);
      }
    }

    return NextResponse.json(
      { success: true, message: "Webhook received" },
      { headers: SECURITY_HEADERS }
    );
  } catch (err) {
    console.error("[paymento-webhook] Error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500, headers: SECURITY_HEADERS }
    );
  }
}

export const dynamic = "force-dynamic";