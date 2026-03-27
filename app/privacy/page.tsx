import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for InvoiceGen - How we protect your data",
};

export default function PrivacyPage() {
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
        <h1 className="mb-8 text-3xl font-bold text-white">Privacy Policy</h1>
        
        <div className="space-y-6 text-sm leading-relaxed">
          <p>Last updated: March 2026</p>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">1. Data We Collect</h2>
            <p>InvoiceGen operates with a privacy-first approach:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>No user accounts:</strong> We don&apos;t require signup or store personal information</li>
              <li><strong>Local data:</strong> Invoice data is generated and stored locally in your browser</li>
              <li><strong>Payment data:</strong> We do not store your cryptocurrency payment information</li>
              <li><strong>Usage analytics:</strong> We collect anonymous usage data to improve our service</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">2. How We Use Data</h2>
            <p>We use collected data solely to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Provide the invoice generation service</li>
              <li>Process payments through third-party providers</li>
              <li>Improve our AI features</li>
              <li>Respond to support requests</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">3. Data Storage</h2>
            <p>All invoice data is stored locally on your device. We do not maintain a database of your invoices. Once you close your browser, your invoice data remains only on your device unless you export it.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">4. Third-Party Services</h2>
            <p>We use trusted third-party services for:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Payment processing:</strong> Paymento (cryptocurrency payments)</li>
              <li><strong>AI processing:</strong> Ollama (local AI model for suggestions)</li>
              <li><strong>Hosting:</strong> Vercel</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">5. Cookies</h2>
            <p>We use minimal cookies necessary for:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Rate limiting and abuse prevention</li>
              <li>Basic session management</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">6. Your Rights</h2>
            <p>Since we don&apos;t store your personal data, you have full control. You can:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Clear your browser data to remove any locally stored invoices</li>
              <li>Export your invoices as PDFs at any time</li>
              <li>Use the service without providing any personal information</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">7. Contact</h2>
            <p>For questions about this Privacy Policy, contact us at support@invoicegen.com</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800">
          <Link href="/" className="text-brand-400 hover:text-brand-300">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}