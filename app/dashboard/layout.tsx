import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — InvoiceGen Pro",
  description: "Your saved invoices and Pro features.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              I
            </div>
            <span className="font-bold text-slate-900">InvoiceGen Pro</span>
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">
              PRO
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">
              Dashboard
            </a>
            <a href="/builder" className="text-sm text-slate-600 hover:text-slate-900">
              New Invoice
            </a>
            <a href="/" className="text-sm text-slate-500 hover:text-slate-700">
              ← Home
            </a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-6">{children}</main>
    </div>
  );
}
