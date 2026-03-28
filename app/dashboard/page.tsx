"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SavedInvoice {
  id: string;
  name: string;
  client: string;
  amount: string;
  currency: string;
  date: string;
  status: "draft" | "sent" | "paid";
}

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<SavedInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const pro = !!localStorage.getItem("invoicegen_pro");
    setIsPro(pro);

    if (!pro) {
      setLoading(false);
      return;
    }

    const saved = localStorage.getItem("invoicegen_invoices");
    setInvoices(saved ? JSON.parse(saved) : []);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (!isPro) {
    return (
      <div className="py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold text-slate-900">Pro Dashboard</h1>
        <p className="mb-6 text-slate-600">
          Upgrade to Pro to access your saved invoices and 35 invoices/month.
        </p>
        <Link href="/checkout?plan=pro" className="btn-primary">
          Upgrade to Pro — $9/mo
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Invoices</h1>
          <p className="text-sm text-slate-500">All your created invoices, in one place.</p>
        </div>
        <Link href="/builder" className="btn-primary">
          + New Invoice
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
          <div className="mb-4 text-5xl">📄</div>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">No invoices yet</h2>
          <p className="mb-6 text-sm text-slate-500">
            Create your first invoice and it will appear here.
          </p>
          <Link href="/builder" className="btn-primary">
            Create Invoice →
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                {["Invoice", "Client", "Amount", "Date", "Status", ""].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-slate-900">
                      {inv.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{inv.client}</td>
                  <td className="px-6 py-4 font-mono text-sm font-medium text-slate-900">
                    {inv.amount} {inv.currency}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{inv.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        inv.status === "paid"
                          ? "bg-brand-100 text-brand-700"
                          : inv.status === "sent"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/builder?load=${inv.id}`}
                      className="text-sm font-medium text-brand-600 hover:text-brand-700"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
