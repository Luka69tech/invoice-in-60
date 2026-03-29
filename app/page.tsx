"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "AI Line Items",
    desc: "Describe your project and watch AI auto-fill professional line items with rates and descriptions.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: "Brand Customization",
    desc: "Upload your logo, set brand colors, and every invoice looks like it came from a design agency.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "PDF Export",
    desc: "One click exports a pixel-perfect, print-ready PDF your clients will actually want to pay.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Multi-Currency",
    desc: "Invoice in USD, EUR, GBP, CAD, AUD and 10+ more. Auto-format with locale-appropriate number styles.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Private & Secure",
    desc: "Everything runs in your browser. No accounts, no data stored on our servers. Ever.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    title: "Zero Friction",
    desc: "Create your first invoice free. Upgrade to Pro ($9/mo) for 35 invoices/month + AI features.",
  },
];

const testimonials = [
  {
    quote: "I used to spend 20 minutes formatting invoices in Google Docs. Now I do it in 45 seconds.",
    name: "Sarah Chen",
    role: "Freelance Designer",
    avatar: "SC",
  },
  {
    quote: "The AI line item feature is scary good. Described my project, got a perfect invoice in one click.",
    name: "Marcus Rivera",
    role: "Marketing Consultant",
    avatar: "MR",
  },
  {
    quote: "My clients comment on how professional my invoices look. Worth every penny.",
    name: "Emma Kowalski",
    role: "Copywriter & Strategist",
    avatar: "EK",
  },
];

const faqs = [
  {
    q: "Do I need to create an account?",
    a: "No. The free version works entirely in your browser with no signup. Pay only when you want more invoices or AI features.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Crypto only — BTC, ETH, SOL, USDT, USDC, TRX, MATIC, AVAX, DOGE, LTC, XRP, TON, ADA and more. Fast, private, no intermediaries.",
  },
  {
    q: "Is this a subscription?",
    a: "Yes, monthly or annual. Pro is $9/month or $79/year. Business is $19/month or $159/year with unlimited invoices.",
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
    a: "All sales are final. Please try the free version first to ensure it meets your needs.",
  },
];

const logos = [
  { name: "Forbes", text: "FORBES" },
  { name: "TechCrunch", text: "TechCrunch" },
  { name: "Product Hunt", text: "Product Hunt" },
  { name: "Indie Hackers", text: "IndieHackers" },
  { name: "Hacker News", text: "Hacker News" },
];

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal(0.1);
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const { ref, visible } = useReveal(0.2);
  
  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-2xl border border-slate-100/50 bg-white/80 backdrop-blur-xl p-8 shadow-lg shadow-slate-900/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-900/10"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-transparent to-violet-50/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      <div className="relative z-10">
        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-violet-600 text-white shadow-lg shadow-sky-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          {feature.icon}
        </div>
        
        <h3 className="mb-3 font-bold text-slate-900 text-lg">{feature.title}</h3>
        <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
      </div>
      
      <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-sky-400/20 to-violet-500/20 blur-2xl transition-all duration-500 group-hover:scale-150" />
    </div>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  const { ref, visible } = useReveal(0.2);
  
  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-2xl border border-slate-100/50 bg-white/80 backdrop-blur-xl p-8 shadow-lg shadow-slate-900/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${index * 150}ms`,
      }}
    >
      <div className="relative z-10">
        <div className="mb-5 flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <svg key={s} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="mb-6 text-slate-700 text-lg leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-600 text-sm font-bold text-white shadow-lg shadow-sky-500/30">
            {testimonial.avatar}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{testimonial.name}</p>
            <p className="text-sm text-slate-500">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const { ref, visible } = useReveal(0.2);
  
  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-xl border border-slate-200/50 bg-white/80 backdrop-blur-sm transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <button
        className="flex w-full items-center justify-between p-6 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-slate-900 pr-4">{faq.q}</span>
        <svg
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${open ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="px-6 pb-6 text-slate-600">{faq.a}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-[40%] -right-[20%] h-[80%] w-[60%] rounded-full bg-gradient-to-br from-sky-100/60 via-sky-50/40 to-violet-100/40 blur-3xl animate-blob-1"
          style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
        />
        <div 
          className="absolute top-[20%] -left-[20%] h-[60%] w-[50%] rounded-full bg-gradient-to-bl from-violet-100/50 via-sky-50/30 to-sky-100/50 blur-3xl animate-blob-2"
          style={{ transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)` }}
        />
        <div 
          className="absolute -bottom-[20%] right-[10%] h-[50%] w-[40%] rounded-full bg-gradient-to-tl from-sky-50/40 via-violet-50/30 to-sky-100/40 blur-3xl animate-blob-3"
          style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-100/80 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-violet-600 text-white font-bold shadow-lg shadow-sky-500/30">
              I
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">InvoiceGen</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Features
            </a>
            <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Pricing
            </Link>
            <Link href="/builder" className="btn-primary">
              Create Free Invoice
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal delay={0}>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-200/60 bg-sky-50/80 px-5 py-2 text-sm font-medium text-sky-700 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
                </span>
                No signup required — free to try
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="mb-8 text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] lg:text-7xl">
                Professional invoices in{" "}
                <span className="text-gradient bg-gradient-to-r from-sky-500 via-sky-600 to-violet-500 bg-clip-text text-transparent">
                  under 60 seconds
                </span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="mx-auto mb-10 max-w-2xl text-xl text-slate-600 leading-relaxed">
                Stop wasting hours on clunky invoicing tools. Describe your project
                once — AI fills in the rest. Export a stunning PDF your clients will
                actually pay faster.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/builder" className="btn-primary text-base px-8 py-4 btn-particles">
                  Create Your First Invoice Free →
                </Link>
                <a href="#demo" className="btn-secondary text-base px-8 py-4">
                  See how it works
                </a>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <p className="mt-6 text-sm text-slate-500">
                No credit card. No account. Just invoices.
              </p>
            </Reveal>
          </div>

          {/* Hero Visual */}
          <Reveal delay={500} className="mt-20">
            <div className="relative mx-auto max-w-5xl" id="demo">
              <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-2xl shadow-slate-900/10 overflow-hidden">
                <div className="flex items-center gap-3 border-b border-slate-100/80 bg-slate-50/80 px-5 py-4">
                  <div className="flex gap-2">
                    <div className="h-3.5 w-3.5 rounded-full bg-red-400/80" />
                    <div className="h-3.5 w-3.5 rounded-full bg-amber-400/80" />
                    <div className="h-3.5 w-3.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="rounded-lg bg-slate-200/60 px-4 py-1.5 text-xs font-medium text-slate-500">
                      invoicegen.com/builder
                    </span>
                  </div>
                </div>
                <div className="grid lg:grid-cols-2">
                  {/* Form side */}
                  <div className="border-r border-slate-100/60 p-8">
                    <div className="mb-6 h-2 w-28 rounded-full bg-sky-100" />
                    <div className="space-y-4">
                      <div className="h-4 w-3/4 rounded-lg bg-slate-100" />
                      <div className="h-4 w-1/2 rounded-lg bg-slate-100" />
                      <div className="mt-6 rounded-2xl border border-sky-200/50 bg-sky-50/50 p-5">
                        <div className="mb-3 h-3 w-20 rounded-full bg-sky-300" />
                        <div className="h-3 w-full rounded-full bg-sky-200" />
                        <div className="mt-3 h-3 w-3/4 rounded-full bg-sky-200" />
                      </div>
                      <div className="mt-6 grid grid-cols-3 gap-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-10 rounded-xl bg-slate-100" />
                        ))}
                      </div>
                      <div className="mt-6 h-12 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 shadow-lg shadow-sky-500/25" />
                    </div>
                  </div>
                  {/* Preview side */}
                  <div className="bg-gradient-to-br from-slate-50/80 to-sky-50/30 p-8">
                    <div className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-lg">
                      <div className="mb-6 flex items-start justify-between">
                        <div>
                          <div className="h-5 w-24 rounded-lg bg-slate-300" />
                          <div className="mt-2 h-3 w-40 rounded-lg bg-slate-100" />
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-violet-600 shadow-lg" />
                      </div>
                      <div className="mb-5 h-3 w-48 rounded-lg bg-slate-200" />
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex justify-between">
                            <div className="h-3 w-32 rounded-lg bg-slate-100" />
                            <div className="h-3 w-16 rounded-lg bg-slate-100" />
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 border-t border-slate-100 pt-4">
                        <div className="flex justify-between">
                          <div className="h-4 w-16 rounded-lg bg-slate-300" />
                          <div className="h-4 w-20 rounded-lg bg-slate-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-8 -right-8 h-16 w-16 rounded-2xl bg-gradient-to-br from-sky-500 to-violet-600 shadow-xl shadow-sky-500/30 animate-float flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="absolute -bottom-6 -left-6 h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl shadow-amber-500/30 animate-float-delayed flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-y border-slate-100/60 bg-slate-50/50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-slate-400">
            Trusted by freelancers and solopreneurs worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {logos.map((logo, i) => (
              <Reveal key={logo.name} delay={i * 100}>
                <span className="text-lg font-bold tracking-wider text-slate-300 transition-colors hover:text-slate-400">
                  {logo.text}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
            <Reveal>
              <p className="section-label mb-4">Features</p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="mb-6 text-4xl font-bold text-slate-900 lg:text-5xl">
                Everything you need. Nothing you don&apos;t.
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="mx-auto max-w-2xl text-lg text-slate-600">
                Built for the freelancer who values their time. No dashboard
                bloat, no monthly fees, no learning curve.
              </p>
            </Reveal>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <FeatureCard key={feature.title} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-b from-slate-50/50 to-white py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
            <Reveal>
              <p className="section-label mb-4">Testimonials</p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="text-4xl font-bold text-slate-900 lg:text-5xl">
                Loved by freelancers
              </h2>
            </Reveal>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <TestimonialCard key={testimonial.name} testimonial={testimonial} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <Reveal>
              <p className="section-label mb-4">Pricing</p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="mb-6 text-4xl font-bold text-slate-900 lg:text-5xl">
                Simple pricing, no surprises
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-lg text-slate-600">
                Start free, upgrade when you&apos;re ready. Cancel anytime.
              </p>
            </Reveal>
          </div>

          {/* Billing Toggle */}
          <div className="mb-12 flex items-center justify-center gap-4">
            <span className={`text-sm font-medium transition-colors ${!isAnnual ? "text-slate-900" : "text-slate-400"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative h-9 w-16 rounded-full transition-colors duration-300"
              style={{ backgroundColor: isAnnual ? '#10b981' : '#6b7280' }}
            >
              <span
                className="absolute top-1 h-7 w-7 rounded-full bg-white shadow-lg transition-transform duration-300 ease-out"
                style={{ transform: isAnnual ? 'translateX(24px)' : 'translateX(4px)' }}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${isAnnual ? "text-slate-900" : "text-slate-400"}`}>
              Annual
              <span className={`ml-1.5 text-xs font-medium ${isAnnual ? "text-emerald-600" : "text-slate-400"}`}>
                {isAnnual ? "Save up to 30%" : ""}
              </span>
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-3 overflow-visible">
            {/* Free tier */}
            <Reveal delay={300}>
              <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-xl p-6 shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl">
                {false && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-sky-600 px-4 py-1 text-xs font-semibold text-white">Most Popular</span>
                  </div>
                )}
                <div className="relative z-10">
                  <h3 className="mb-2 text-xl font-bold text-slate-900">Free</h3>
                  <p className="mb-4 text-sm text-slate-500">For trying it out</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-slate-900">$0</span>
                  </div>
                  <ul className="mb-6 space-y-3">
                    {["3 invoices per month", "Watermark on PDF", "Standard templates", "PDF download only"].map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-sm text-slate-600">
                        <svg className="h-4 w-4 shrink-0 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Link href="/builder" className="block w-full rounded-xl border border-slate-200 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                    Start Free
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Pro tier */}
            <Reveal delay={400}>
              <div className={`relative overflow-hidden rounded-2xl border-2 bg-white p-6 shadow-xl transition-all hover:-translate-y-2 ${
                !isAnnual
                  ? "border-sky-500 shadow-sky-500/20"
                  : "border-slate-200 shadow-slate-200/20"
              }`}>
                {!isAnnual && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-sky-600 px-4 py-1 text-xs font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="relative z-10">
                  <h3 className="mb-2 text-xl font-bold text-slate-900">Pro</h3>
                  <p className="mb-4 text-sm text-slate-500">For growing freelancers</p>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-slate-900">${isAnnual ? 79 : 9}</span>
                    <span className="ml-1 text-sm text-slate-500">{isAnnual ? "/year" : "/month"}</span>
                  </div>
                  {isAnnual && (
                    <div className="mb-4">
                      <p className="text-xs text-slate-400">${Math.round(79/12)}/mo billed annually</p>
                      <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                        Save 27%
                      </div>
                    </div>
                  )}
                  {!isAnnual && (
                    <p className="mb-4 text-sm text-slate-500">Save up to $90/year on annual</p>
                  )}
                  <ul className="mb-6 space-y-3">
                    {["35 invoices/month", "No watermark", "Custom branding", "Email PDF delivery", "Priority support"].map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-sm text-slate-600">
                        <svg className="h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Link href="/checkout?plan=pro" className="block w-full rounded-xl bg-sky-600 py-3 text-center font-semibold text-white hover:bg-sky-700 transition-colors">
                    Get Pro
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Business tier */}
            <Reveal delay={500}>
              <div className={`group relative overflow-hidden rounded-2xl border-2 bg-white p-6 shadow-xl transition-all hover:-translate-y-2 ${
                isAnnual
                  ? "border-emerald-500 shadow-emerald-500/20"
                  : "border-slate-200/60 shadow-lg"
              }`}>
                {isAnnual && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-emerald-500 px-4 py-1 text-xs font-semibold text-white">
                      Best Value
                    </span>
                  </div>
                )}
                <div className="relative z-10">
                  <h3 className="mb-2 text-xl font-bold text-slate-900">Business</h3>
                  <p className="mb-4 text-sm text-slate-500">For teams and agencies</p>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-slate-900">${isAnnual ? 159 : 19}</span>
                    <span className="ml-1 text-sm text-slate-500">{isAnnual ? "/year" : "/month"}</span>
                  </div>
                  {isAnnual && (
                    <div className="mb-4">
                      <p className="text-xs text-slate-400">${Math.round(159/12)}/mo billed annually</p>
                      <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                        Save 30%
                      </div>
                    </div>
                  )}
                  {!isAnnual && (
                    <p className="mb-4 text-sm text-slate-500">Save up to $190/year on annual</p>
                  )}
                  <ul className="mb-6 space-y-3">
                    {["Unlimited invoices", "Everything in Pro", "Up to 3 team members", "Client portal", "API access"].map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-sm text-slate-600">
                        <svg className="h-4 w-4 shrink-0 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Link href="/checkout?plan=business" className="block w-full rounded-xl border border-slate-200 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                    Get Business
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="mt-12 text-center">
            <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              View full comparison →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gradient-to-b from-slate-50/50 to-white py-28 lg:py-36">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-16 text-center">
            <Reveal>
              <p className="section-label mb-4">FAQ</p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="text-4xl font-bold text-slate-900">Questions? Answered.</h2>
            </Reveal>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FaqItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 lg:py-36">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <h2 className="mb-6 text-4xl font-bold text-slate-900 lg:text-5xl">
              Stop invoicing like it&apos;s 2010.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mb-10 text-xl text-slate-600 leading-relaxed">
              Join thousands of freelancers who create professional invoices in
              seconds, not hours.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <Link href="/builder" className="btn-primary text-base px-10 py-4 btn-particles">
              Create Your First Invoice Free →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100/60 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-violet-600 text-white font-bold shadow-lg shadow-sky-500/30">
                I
              </div>
              <span className="font-bold text-slate-900 text-lg">InvoiceGen</span>
            </div>
            <div className="flex gap-8 text-sm font-medium text-slate-500">
              <a href="/privacy" className="transition-colors hover:text-slate-900">Privacy</a>
              <a href="/terms" className="transition-colors hover:text-slate-900">Terms</a>
              <a href="/refund" className="transition-colors hover:text-slate-900">Refunds</a>
              <a href="mailto:hello@invoicegen.com" className="transition-colors hover:text-slate-900">Contact</a>
            </div>
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} InvoiceGen. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
