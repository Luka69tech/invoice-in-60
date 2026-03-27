import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { SECURITY_HEADERS } from "@/lib/security/headers";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID required" },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    const paymentData = await redis.get(`paymento_payment_${orderId}`);

    if (paymentData) {
      const parsed = JSON.parse(paymentData as string);
      return NextResponse.json(
        { paid: true, data: parsed },
        { headers: SECURITY_HEADERS }
      );
    }

    return NextResponse.json(
      { paid: false },
      { headers: SECURITY_HEADERS }
    );
  } catch (err) {
    console.error("[check-payment] Error:", err);
    return NextResponse.json(
      { error: "Check failed" },
      { status: 500, headers: SECURITY_HEADERS }
    );
  }
}

export const dynamic = "force-dynamic";