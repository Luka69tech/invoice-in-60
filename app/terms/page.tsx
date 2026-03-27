import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for InvoiceGen - AI-Powered Invoice Generator",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <header className="border-b border-slate-800/50 px-5 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white text-sm font-bold">
              I
            </div>
            <span className="font-bold text-white">InvoiceGen</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="mb-8 text-3xl font-bold text-white">Terms of Service</h1>
        
        <div className="space-y-6 text-sm leading-relaxed">
          <p>Last updated: March 2026</p>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">1. Acceptance of Terms</h2>
            <p>By accessing and using InvoiceGen (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">2. Description of Service</h2>
            <p>InvoiceGen provides an AI-powered tool for creating professional PDF invoices. The Service is provided &quot;as is&quot; and we reserve the right to modify or discontinue the Service at any time.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">3. Payment and Billing</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Pro plans are one-time payments with lifetime access</li>
              <li>All payments are processed through secure cryptocurrency payment gateways</li>
              <li>Once a payment is confirmed, access is granted immediately</li>
              <li>No refunds are offered after purchase (see Refund Policy)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">4. User Responsibilities</h2>
            <p>You agree to use the Service only for lawful purposes. You may not:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Use the Service to generate fraudulent or illegal invoices</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Interfere with or disrupt the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">5. Limitation of Liability</h2>
            <p>In no event shall InvoiceGen be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">6. Contact</h2>
            <p>For questions about these Terms, contact us at support@invoicegen.com</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800">
          <Link href="/" className="text-brand-400 hover:text-brand-300">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}