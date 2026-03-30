"use client";

import Link from "next/link";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    description: "Perfect for trying things out",
    price: { monthly: 0, annual: 0 },
    features: [
      "3 invoices per month",
      "Watermark on PDF",
      "Standard templates",
      "PDF download only",
      "Community support",
    ],
    cta: "Start Free",
    href: "/builder",
    popular: false,
  },
  {
    name: "Pro",
    description: "For growing freelancers",
    price: { monthly: 9, annual: 79 },
    features: [
      "35 invoices per month",
      "No watermark",
      "Custom logo + brand colors",
      "Email PDF delivery",
      "Invoice history",
      "Crypto payment acceptance",
      "Priority support",
    ],
    cta: "Get Pro",
    href: "/checkout?plan=pro",
    popular: true,
  },
  {
    name: "Business",
    description: "For teams and agencies",
    price: { monthly: 19, annual: 159 },
    features: [
      "Everything in Pro",
      "Up to 3 team members",
      "Client portal",
      "Auto payment reminders",
      "Recurring invoices",
      "API access",
      "Dedicated support",
    ],
    cta: "Get Business",
    href: "/checkout?plan=business",
    popular: false,
  },
];

// Feature comparison: true = yes/green, false = no/red, "partial" = partial
const featureComparison = [
  { feature: "Invoices per month", free: "3", pro: "35", business: "Unlimited" },
  { feature: "Watermark", free: true, pro: false, business: false },
  { feature: "Custom branding", free: false, pro: true, business: true },
  { feature: "Email PDF delivery", free: false, pro: true, business: true },
  { feature: "Invoice history", free: false, pro: true, business: true },
  { feature: "Crypto payments", free: false, pro: true, business: true },
  { feature: "Team members", free: "1", pro: "1", business: "Up to 3" },
  { feature: "Client portal", free: false, pro: false, business: true },
  { feature: "Auto reminders", free: false, pro: false, business: true },
  { feature: "Recurring invoices", free: false, pro: false, business: true },
  { feature: "API access", free: false, pro: false, business: true },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const formatPrice = (price: number, isMonthly: boolean) => {
    if (price === 0) return "Free";
    return `$${price}${isMonthly ? "/mo" : ""}`;
  };

  const savingsPercent = (monthly: number, annual: number) => {
    if (monthly === 0 || annual === 0) return null;
    const yearlyMonthly = monthly * 12;
    const pct = Math.round(((yearlyMonthly - annual) / yearlyMonthly) * 100);
    return pct;
  };

  const renderCheck = (value: boolean | string) => {
    if (value === true) {
      return (
        <svg className="h-5 w-5 text-emerald-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    if (value === false) {
      return (
        <svg className="h-5 w-5 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    }
    return <span className="text-sm text-slate-500">{value}</span>;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-violet-600 text-white font-bold">
              I
            </div>
            <span className="text-xl font-bold text-slate-900">Invoice In 60</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/#features" className="text-sm text-slate-600 hover:text-slate-900">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-slate-900">
              Pricing
            </Link>
            <Link href="/builder" className="text-sm text-slate-600 hover:text-slate-900">
              Create Invoice
            </Link>
            <Link href="/checkout?plan=pro" className="btn-primary text-sm">
              Upgrade
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        {/* Title */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-slate-600">
            Choose the plan that fits your needs. Upgrade anytime.
          </p>
        </div>

        {/* Toggle */}
        <div className="mb-12 flex items-center justify-center gap-4">
          <span className={`text-sm font-medium transition-colors ${!isAnnual ? "text-slate-900" : "text-slate-400"}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              width: '44px',
              height: '24px',
              borderRadius: '12px',
              backgroundColor: isAnnual ? '#10b981' : '#6b7280',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              padding: 0
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: isAnnual ? '22px' : '2px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'white',
                transition: 'left 0.2s'
              }}
            />
          </button>
          <span className={`text-sm font-medium transition-colors ${isAnnual ? "text-slate-900" : "text-slate-400"}`}>
            Annual
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-2 p-6 transition-all ${
                plan.name === "Pro" && !isAnnual
                  ? "border-sky-500 shadow-xl shadow-sky-500/10"
                  : plan.name === "Business" && isAnnual
                  ? "border-emerald-500 shadow-xl shadow-emerald-500/10"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {plan.name === "Pro" && !isAnnual && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-sky-600 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}
              {plan.name === "Business" && isAnnual && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-emerald-500 px-4 py-1 text-xs font-semibold text-white">
                    Best Value
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="mb-2 text-xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-sm text-slate-500">{plan.description}</p>
              </div>

              <div className="mb-6">
                {/* Price display with animation */}
                <div className="transition-all duration-300">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-900">
                      {plan.price.monthly === 0 ? "Free" : `$${isAnnual ? plan.price.annual : plan.price.monthly}`}
                    </span>
                    <span className="text-slate-500">
                      {plan.price.monthly === 0 ? "" : isAnnual ? "/year" : "/month"}
                    </span>
                  </div>
                  {/* Monthly equivalent for annual */}
                  {isAnnual && plan.price.monthly > 0 && (
                    <p className="text-xs text-slate-400 mt-1 transition-all duration-300">
                      ${Math.round(plan.price.annual / 12)}/month billed annually
                    </p>
                  )}
                  {/* Savings badge */}
                  {isAnnual && plan.price.monthly > 0 && (
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 transition-all duration-300">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      Save {savingsPercent(plan.price.monthly, plan.price.annual)}%
                    </div>
                  )}
                </div>
              </div>

              <ul className="mb-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="h-5 w-5 shrink-0 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full rounded-xl py-3 text-center font-semibold transition-colors ${
                  plan.popular
                    ? "bg-sky-600 text-white hover:bg-sky-700"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Comparison Table with Green/Red ticks */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">Compare plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-4 text-left text-sm font-medium text-slate-500">Feature</th>
                  <th className="pb-4 text-center text-sm font-medium text-slate-500">Free</th>
                  <th className="pb-4 text-center text-sm font-medium text-slate-500">Pro</th>
                  <th className="pb-4 text-center text-sm font-medium text-slate-500">Business</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((row) => (
                  <tr key={row.feature} className="border-b border-slate-100">
                    <td className="py-4 text-sm text-slate-600">{row.feature}</td>
                    <td className="py-4 text-center">{renderCheck(row.free)}</td>
                    <td className="py-4 text-center">{renderCheck(row.pro)}</td>
                    <td className="py-4 text-center">{renderCheck(row.business)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">Frequently asked questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I switch plans later?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "How does the free plan work?",
                a: "The free plan gives you 3 invoices per month with a small watermark on each PDF. No signup required — just start creating invoices.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major cryptocurrencies including BTC, ETH, SOL, USDT, USDC, and more. Simple, private, no intermediaries.",
              },
              {
                q: "Is there a refund policy?",
                a: "Yes, we offer a 30-day money-back guarantee on all paid plans. No questions asked.",
              },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-900">{faq.q}</h3>
                <p className="mt-2 text-sm text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <p className="text-sm text-slate-500">© 2026 Invoice In 60. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-slate-500 hover:text-slate-900">Terms</Link>
            <Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-900">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}