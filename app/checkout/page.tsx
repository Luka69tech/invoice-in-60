"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Coins, Loader2, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

const PLANS = {
  pro: {
    name: "Pro",
    monthly: 9,
    annual: 79,
    features: [
      "35 invoices per month",
      "No watermark",
      "Custom logo + brand colors",
      "Email PDF delivery",
      "Invoice history",
      "Crypto payment acceptance",
      "Priority support",
    ],
  },
  business: {
    name: "Business",
    monthly: 19,
    annual: 159,
    features: [
      "Everything in Pro",
      "Up to 3 team members",
      "Client portal",
      "Auto payment reminders",
      "Recurring invoices",
      "API access",
      "Dedicated support",
    ],
  },
};

type PaymentState = "idle" | "loading" | "redirecting" | "error";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const planParam = searchParams.get("plan") || "pro";
  
  const plan = PLANS[planParam as keyof typeof PLANS] || PLANS.pro;
  
  const [isAnnual, setIsAnnual] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");

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

  const price = isAnnual ? plan.annual : plan.monthly;
  const savings = isAnnual ? (plan.monthly * 12 - plan.annual) : 0;

  const handlePayment = async () => {
    if (!email.trim()) {
      setErrorMessage("Please enter your email address");
      setPaymentState("error");
      return;
    }
    
    setPaymentState("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: `INV-${Date.now()}`,
          fiatAmount: price.toString(),
          fiatCurrency: "USD",
          returnUrl: `${window.location.origin}/checkout?success=true&orderId=${orderId}`,
          customerEmail: email,
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
              Thank you for your purchase. You now have {plan.name} access.
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
            <span className="font-bold text-white">Invoice In 60</span>
          </Link>
          <Link href="/pricing" className="text-sm text-slate-400 hover:text-white transition-colors">
            View all plans →
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-5 py-16">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-600/20 bg-brand-600/10">
            <Coins className="h-7 w-7 text-brand-500" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">Upgrade to {plan.name}</h1>
          <p className="text-slate-400">
            Unlock all {plan.name} features
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className={`text-sm ${!isAnnual ? "text-white" : "text-slate-500"}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative h-8 w-14 rounded-full transition-colors ${
              isAnnual ? "bg-sky-600" : "bg-slate-700"
            }`}
          >
            <span
              className="absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200"
              style={{ transform: isAnnual ? "translateX(4px)" : "translateX(28px)" }}
            />
          </button>
          <span className={`text-sm ${isAnnual ? "text-white" : "text-slate-500"}`}>
            Annual <span className="text-sky-400">(Save ${savings})</span>
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400">{plan.name} Plan</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-white">${price}</span>
              <span className="text-sm text-slate-500 ml-1">{isAnnual ? "/year" : "/month"}</span>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {plan.features.map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                {feature}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-4 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Total</span>
              <div className="text-right">
                <span className="text-lg font-bold text-white">${price}</span>
                <span className="text-sm text-slate-500 ml-1">USD {isAnnual ? "/year" : "/month"}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Email for receipt</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
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