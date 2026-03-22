import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-02-25.clover",
  });
}

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();

    const priceMap: Record<string, { amount: number; name: string; description: string }> = {
      starter: {
        amount: 2900,
        name: "InvoiceGen Pro — One-Time",
        description: "Unlimited invoices, AI suggestions, multi-currency, brand customization",
      },
      pro: {
        amount: 4900,
        name: "InvoiceGen Pro Plus — One-Time",
        description: "Everything in Pro + priority support + future updates",
      },
    };

    const priceData = priceMap[plan] || priceMap.starter;
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: priceData.name,
              description: priceData.description,
            },
            unit_amount: priceData.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        plan,
        type: "one_time",
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/builder`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
