"use client";

import Link from "next/link";
import { useState } from "react";

const features = [
  {
    icon: "⚡",
    title: "AI Line Items",
    desc: "Describe your project and watch AI auto-fill professional line items with rates and descriptions.",
  },
  {
    icon: "🎨",
    title: "Brand Customization",
    desc: "Upload your logo, set brand colors, and every invoice looks like it came from a design agency.",
  },
  {
    icon: "📄",
    title: "PDF Export",
    desc: "One click exports a pixel-perfect, print-ready PDF your clients will actually want to pay.",
  },
  {
    icon: "🌍",
    title: "Multi-Currency",
    desc: "Invoice in USD, EUR, GBP, CAD, AUD and 10+ more. Auto-format with locale-appropriate number styles.",
  },
  {
    icon: "🔒",
    title: "Private & Secure",
    desc: "Everything runs in your browser. No accounts, no data stored on our servers. Ever.",
  },
  {
    icon: "💳",
    title: "Zero Friction",
    desc: "Create your first invoice free. Pay $29 one-time to unlock unlimited invoices and AI features.",
  },
];

const testimonials = [
  {
    quote:
      "I used to spend 20 minutes formatting invoices in Google Docs. Now I do it in 45 seconds.",
    name: "Sarah Chen",
    role: "Freelance Designer",
    avatar: "SC",
  },
  {
    quote:
      "The AI line item feature is scary good. Described my project, got a perfect invoice in one click.",
    name: "Marcus Rivera",
    role: "Marketing Consultant",
    avatar: "MR",
  },
  {
    quote:
      "My clients comment on how professional my invoices look. Worth every penny.",
    name: "Emma Kowalski",
    role: "Copywriter & Strategist",
    avatar: "EK",
  },
];

const faqs = [
  {
    q: "Do I need to create an account?",
    a: "No. The free version works entirely in your browser with no signup. Pay only when you want unlimited invoices + AI features.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Stripe one-time payment. Credit cards, debit cards, Apple Pay, Google Pay — whatever you already use.",
  },
  {
    q: "Is this a subscription?",
    a: "No. Pay once, use forever. $29 for the Starter pack, $49 for Pro with unlimited everything.",
  },
  {
    q: "Can I use this on mobile?",
    a: "Yes. The invoice builder is fully responsive and works great on phones, tablets, and desktop.",
  },
  {
    q: "What currencies are supported?",
    a: "USD, EUR, GBP, CAD, AUD, JPY, INR, BRL, MXN, CHF, SEK, NOK, DKK, NZD, SGD — with more on request.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes. If you're not satisfied within 14 days, email us and we'll refund you. No questions asked.",
  },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white text-sm font-bold">
              I
            </div>
            <span className="font-bold text-slate-900">InvoiceGen</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#features"
              className="hidden text-sm text-slate-600 hover:text-slate-900 sm:block"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="hidden text-sm text-slate-600 hover:text-slate-900 sm:block"
            >
              Pricing
            </a>
            <Link href="/builder" className="btn-primary text-sm">
              Create Free Invoice
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 via-white to-white" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-100/50 blur-3xl" />
        <div className="absolute top-20 -left-40 h-60 w-60 rounded-full bg-brand-100/30 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm text-brand-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
              </span>
              No signup required — free to try
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Professional invoices in{" "}
              <span className="text-brand-600">under 60 seconds</span>
            </h1>

            <p className="mb-10 text-lg text-slate-600 sm:text-xl">
              Stop wasting hours on clunky invoicing tools. Describe your project
              once — AI fills in the rest. Export a stunning PDF your clients will
              actually pay faster.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/builder" className="btn-primary w-full sm:w-auto sm:text-base">
                Create Your First Invoice Free →
              </Link>
              <a href="#demo" className="btn-secondary w-full sm:w-auto sm:text-base">
                See how it works
              </a>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              No credit card. No account. Just invoices.
            </p>
          </div>

          {/* Hero visual */}
          <div className="mt-16" id="demo">
            <div className="relative mx-auto max-w-5xl">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="rounded-md bg-slate-200 px-3 py-1 text-xs text-slate-500">
                      invoicegen.com/builder
                    </span>
                  </div>
                </div>
                <div className="grid md:grid-cols-2">
                  {/* Form side */}
                  <div className="border-r border-slate-100 p-6">
                    <div className="mb-4 h-2 w-24 rounded bg-brand-100" />
                    <div className="space-y-3">
                      <div className="h-3 w-3/4 rounded bg-slate-100" />
                      <div className="h-3 w-1/2 rounded bg-slate-100" />
                      <div className="mt-4 rounded border border-brand-200 bg-brand-50 p-3">
                        <div className="mb-1 h-2 w-16 rounded bg-brand-200" />
                        <div className="h-2 w-full rounded bg-brand-100" />
                        <div className="mt-2 h-2 w-3/4 rounded bg-brand-100" />
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-8 rounded bg-slate-100" />
                        ))}
                      </div>
                      <div className="h-10 rounded-lg bg-brand-600" />
                    </div>
                  </div>
                  {/* Preview side */}
                  <div className="bg-slate-50 p-6">
                    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <div className="h-4 w-20 rounded bg-slate-300" />
                          <div className="mt-1 h-2 w-32 rounded bg-slate-100" />
                        </div>
                        <div className="h-8 w-8 rounded bg-brand-600" />
                      </div>
                      <div className="mb-4 h-2 w-40 rounded bg-slate-200" />
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex justify-between">
                            <div className="h-2 w-24 rounded bg-slate-100" />
                            <div className="h-2 w-12 rounded bg-slate-100" />
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 border-t border-slate-100 pt-2">
                        <div className="flex justify-between">
                          <div className="h-2 w-10 rounded bg-slate-300" />
                          <div className="h-2 w-14 rounded bg-slate-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="border-y border-slate-100 bg-slate-50 py-8">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-6 text-center text-sm font-medium text-slate-500">
            Trusted by freelancers and solopreneurs worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400">
            {["Forbes", "TechCrunch", "Product Hunt", "Indie Hackers", "Hacker News"].map(
              (name) => (
                <span key={name} className="text-sm font-semibold uppercase tracking-wider">
                  {name}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <p className="section-label mb-3">Features</p>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Everything you need. Nothing you don&apos;t.
            </h2>
            <p className="mx-auto max-w-2xl text-slate-600">
              Built for the freelancer who values their time. No dashboard
              bloat, no monthly fees, no learning curve.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="card hover:border-brand-200 hover:shadow-md transition-all">
                <div className="mb-3 text-3xl">{f.icon}</div>
                <h3 className="mb-2 font-semibold text-slate-900">{f.title}</h3>
                <p className="text-sm text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <p className="section-label mb-3">Testimonials</p>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Loved by freelancers
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="card">
                <div className="mb-4 flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="h-4 w-4 fill-brand-500 text-brand-500" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-4 text-slate-700">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <p className="section-label mb-3">Pricing</p>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Pay once. Invoice forever.
            </h2>
            <p className="text-slate-600">
              No subscriptions. No hidden fees. One payment, yours forever.
            </p>
          </div>

          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
            {/* Free tier */}
            <div className="card">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Free</h3>
                <p className="mt-1 text-sm text-slate-500">For trying it out</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-slate-900">$0</span>
                </div>
              </div>
              <ul className="mb-8 space-y-3">
                {[
                  "3 invoices per month",
                  "Basic PDF export",
                  "Manual line item entry",
                  "Single currency (USD)",
                  "No branding customization",
                ].map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm text-slate-600">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href="/builder" className="btn-secondary w-full">
                Get Started Free
              </Link>
            </div>

            {/* Pro tier */}
            <div className="relative border-2 border-brand-500 card">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Pro</h3>
                <p className="mt-1 text-sm text-slate-500">For serious freelancers</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-slate-900">$29</span>
                  <span className="text-sm text-slate-500"> one-time</span>
                </div>
              </div>
              <ul className="mb-8 space-y-3">
                {[
                  "Unlimited invoices",
                  "AI line item suggestions",
                  "Multi-currency support",
                  "Logo & brand customization",
                  "Premium PDF templates",
                  "Auto-tax calculation",
                  "Share via link",
                  "Priority support",
                ].map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm text-slate-600">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href="/checkout?plan=starter" className="btn-primary w-full">
                Buy Pro — $29
              </Link>
              <p className="mt-3 text-center text-xs text-slate-500">
                14-day money-back guarantee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-2xl px-6">
          <div className="mb-12 text-center">
            <p className="section-label mb-3">FAQ</p>
            <h2 className="text-3xl font-bold text-slate-900">Questions? Answered.</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white">
                <button
                  className="flex w-full items-center justify-between p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-slate-900">{faq.q}</span>
                  <svg
                    className={`h-5 w-5 text-slate-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="border-t border-slate-100 px-5 pb-5 pt-3 text-sm text-slate-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Stop invoicing like it&apos;s 2010.
          </h2>
          <p className="mb-8 text-lg text-slate-600">
            Join thousands of freelancers who create professional invoices in
            seconds, not hours.
          </p>
          <Link href="/builder" className="btn-primary">
            Create Your First Invoice Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white text-sm font-bold">
                I
              </div>
              <span className="font-bold text-slate-900">InvoiceGen</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="/privacy" className="hover:text-slate-900">Privacy</a>
              <a href="/terms" className="hover:text-slate-900">Terms</a>
              <a href="mailto:hello@invoicegen.com" className="hover:text-slate-900">Contact</a>
            </div>
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} InvoiceGen. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
