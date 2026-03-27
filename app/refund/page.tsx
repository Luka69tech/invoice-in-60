import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Refund Policy for InvoiceGen - No refunds after purchase",
};

export default function RefundPage() {
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
        <h1 className="mb-8 text-3xl font-bold text-white">Refund Policy</h1>
        
        <div className="space-y-6 text-sm leading-relaxed">
          <p className="text-lg text-white font-medium">All sales are final. We do not offer refunds.</p>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">Why No Refunds?</h2>
            <p>InvoiceGen is a digital product with immediate delivery. Once you complete a purchase and receive access to Pro features, we cannot &quot;take back&quot; that access. Additionally:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Our free tier allows you to fully test the service before purchasing</li>
              <li>Pro features are delivered instantly upon payment confirmation</li>
              <li>We offer a one-time payment model (not subscription)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">Before You Purchase</h2>
            <p>We strongly recommend:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Use the free version to ensure it meets your needs</li>
              <li>Verify the features you need are available in Pro</li>
              <li>Contact support with any questions before purchasing</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">Payment Issues</h2>
            <p>If you believe a payment was made in error or you were charged incorrectly, please contact us immediately at support@invoicegen.com with:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Your order/transaction ID</li>
              <li>The email or wallet address used</li>
              <li>A description of the issue</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">Chargebacks</h2>
            <p>We reserve the right to suspend or terminate accounts that initiate chargebacks or disputes without first attempting to resolve the issue through our support team.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">Contact</h2>
            <p>For payment-related issues, contact us at support@invoicegen.com</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800">
          <Link href="/" className="text-brand-400 hover:text-brand-300">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}