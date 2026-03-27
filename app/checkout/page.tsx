"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Coins, Loader2, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

const PRICE_IN_USD = 29;

type PaymentState = "idle" | "loading" | "redirecting" | "error";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const [isVerified, setIsVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (success && orderId) {
      setVerifying(true);
      fetch(`/api/check-payment?orderId=${orderId}`)
        .then(res => res.json())
        .then(data => {
          if (data.paid) {
            setIsVerified(true);
          }
        })
        .finally(() => setVerifying(false));
    }
  }, [success, orderId]);

  const handlePayment = async () => {
    setPaymentState("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: `INV-${Date.now()}`,
          fiatAmount: PRICE_IN_USD.toString(),
          fiatCurrency: "USD",
          returnUrl: `${window.location.origin}/checkout?success=true&orderId={orderId}`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create payment");
      }

      const data = await response.json();

      if (!data.paymentUrl) {
        throw new Error("No payment URL received");
      }

      setPaymentState("redirecting");
      window.location.href = data.paymentUrl;
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMessage(err instanceof Error ? err.message : "Payment failed");
      setPaymentState("error");
    }
  };

  if (success && orderId) {
    if (verifying) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-5">
          <div className="w-full max-w-md text-center">
            <Loader2 className="mx-auto mb-6 h-12 w-12 animate-spin text-emerald-400" />
            <h1 className="mb-3 text-2xl font-bold text-white">Verifying Payment...</h1>
            <p className="text-slate-400">Checking payment status</p>
          </div>
        </div>
      );
    }

    if (isVerified) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-5">
          <div className="w-full max-w-md text-center">
            <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle className="h-10 w-10 text-emerald-400" />
              </div>
            </div>

            <h1 className="mb-3 text-2xl font-bold text-white">Payment Confirmed!</h1>
            <p className="mb-8 text-slate-400">
              Thank you for your purchase. You now have Pro access.
            </p>

            <div className="space-y-3">
              <Link href="/builder" className="block w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors">
                Go to Invoice Builder
              </Link>
              <Link href="/" className="block w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800/50 px-5 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white text-sm font-bold">
              I
            </div>
            <span className="font-bold text-white">InvoiceGen</span>
          </Link>
          <Link href="/builder" className="text-sm text-slate-400 hover:text-white transition-colors">
            Try free →
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-5 py-16">
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-600/20 bg-brand-600/10">
            <Coins className="h-7 w-7 text-brand-500" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">Upgrade to Pro</h1>
          <p className="text-slate-400">
            Unlock unlimited AI-powered invoices
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400">Pro Plan</span>
            <span className="text-2xl font-bold text-white">${PRICE_IN_USD}</span>
          </div>

          <div className="space-y-2 mb-6">
            {[
              "Unlimited AI invoice generations",
              "Multi-currency support (15+ currencies)",
              "Brand customization (logo & colors)",
              "Premium PDF templates",
              "Priority support",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                {feature}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Total</span>
              <span className="text-lg font-bold text-white">${PRICE_IN_USD} USD</span>
            </div>
          </div>
        </div>

        {paymentState === "error" && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-400">Payment Error</p>
              <p className="text-xs text-red-300 mt-1">{errorMessage}</p>
            </div>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={paymentState === "loading" || paymentState === "redirecting"}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-4 font-semibold text-white transition-all hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {paymentState === "loading" || paymentState === "redirecting" ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {paymentState === "loading" ? "Creating payment..." : "Redirecting to payment..."}
            </>
          ) : (
            <>
              <span>Pay with Crypto</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>

        <p className="mt-4 text-center text-xs text-slate-500">
          Powered by Paymento • Secure crypto payment gateway
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-slate-400">Loading...</div></div>}>
      <CheckoutContent />
    </Suspense>
  );
}