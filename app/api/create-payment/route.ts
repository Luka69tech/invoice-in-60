import { NextRequest, NextResponse } from "next/server";
import { createPaymentRequest, getPaymentUrl } from "@/lib/paymento";
import { SECURITY_HEADERS } from "@/lib/security/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, fiatAmount, fiatCurrency, returnUrl } = body;

    if (!orderId || !fiatAmount || !fiatCurrency) {
      return NextResponse.json(
        { error: "Missing required fields: orderId, fiatAmount, fiatCurrency" },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    const actualReturnUrl = returnUrl.replace("{orderId}", orderId);

    const token = await createPaymentRequest({
      orderId,
      fiatAmount,
      fiatCurrency,
      returnUrl: actualReturnUrl,
      additionalData: {
        source: "invoicegen",
      },
      speed: 0,
    });

    const paymentUrl = getPaymentUrl(token);

    return NextResponse.json(
      { success: true, paymentUrl, token },
      { headers: SECURITY_HEADERS }
    );
  } catch (err) {
    console.error("[create-payment] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Payment creation failed" },
      { status: 500, headers: SECURITY_HEADERS }
    );
  }
}

export const dynamic = "force-dynamic";