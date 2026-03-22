"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { use } from "react";

interface LineItem {
  id: string;
  description: string;
  quantity: string;
  rate: string;
  amount: string;
}

interface InvoiceData {
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  toName: string;
  toEmail: string;
  toAddress: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  notes: string;
  items: LineItem[];
  brandColor: string;
  logoUrl: string;
}

const currencies: Record<string, { code: string; symbol: string; name: string }> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar" },
  EUR: { code: "EUR", symbol: "€", name: "Euro" },
  GBP: { code: "GBP", symbol: "£", name: "British Pound" },
  CAD: { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  JPY: { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee" },
  BRL: { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  CHF: { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  MXN: { code: "MXN", symbol: "MX$", name: "Mexican Peso" },
  SGD: { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  DKK: { code: "DKK", symbol: "DKK", name: "Danish Krone" },
  NOK: { code: "NOK", symbol: "NOK", name: "Norwegian Krone" },
  SEK: { code: "SEK", symbol: "SEK", name: "Swedish Krona" },
  NZD: { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
  HKD: { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  CNY: { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  KRW: { code: "KRW", symbol: "₩", name: "South Korean Won" },
  RUB: { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  ZAR: { code: "ZAR", symbol: "R", name: "South African Rand" },
};

function encodeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default function SharePage({ params }: { params: Promise<{ data: string }> }) {
  const { data } = use(params);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const decoded = atob(data);
      const parsed = JSON.parse(decoded);
      if (parsed.fromName && parsed.toName && Array.isArray(parsed.items)) {
        setInvoice(parsed);
      } else {
        setError("Invalid invoice data");
      }
    } catch {
      setError("Could not load shared invoice. The link may be invalid or corrupted.");
    }
  }, [data]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="card max-w-md text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-2xl">
            ✕
          </div>
          <h1 className="mb-2 text-xl font-bold text-slate-900">Unable to Load Invoice</h1>
          <p className="mb-6 text-sm text-slate-600">{error}</p>
          <Link href="/builder" className="btn-primary">
            Create Your Own Invoice →
          </Link>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-slate-500">Loading invoice...</p>
        </div>
      </div>
    );
  }

  const currency = currencies[invoice.currency] || currencies.USD;
  const subtotal = invoice.items.reduce((sum, item) => sum + parseFloat(item.amount || "0"), 0);
  const total = subtotal;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              I
            </div>
            <span className="font-bold text-slate-900">InvoiceGen</span>
          </Link>
          <Link href="/builder" className="btn-primary text-sm">
            Create Your Invoice →
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="card">
          <div
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            style={{ fontSize: "13px" }}
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {invoice.fromName ? encodeHTML(invoice.fromName) : "Your Name"}
                </h3>
                {invoice.fromEmail && (
                  <p className="text-sm text-slate-500">{encodeHTML(invoice.fromEmail)}</p>
                )}
                {invoice.fromAddress && (
                  <p className="whitespace-pre-line text-sm text-slate-500">
                    {encodeHTML(invoice.fromAddress)}
                  </p>
                )}
              </div>
              <div className="h-12 w-12 rounded-lg" style={{ backgroundColor: invoice.brandColor }} />
            </div>

            <div className="mb-6 flex items-end justify-between">
              <div>
                <h1
                  className="text-3xl font-bold uppercase tracking-widest"
                  style={{ color: invoice.brandColor }}
                >
                  Invoice
                </h1>
              </div>
              <div className="text-right text-sm text-slate-500">
                <p>
                  <span className="font-medium text-slate-700">
                    #{invoice.invoiceNumber || "—"}
                  </span>
                </p>
                <p>Date: {invoice.issueDate || "—"}</p>
                <p>Due: {invoice.dueDate || "—"}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Bill To</p>
              <p className="font-semibold text-slate-900">
                {invoice.toName ? encodeHTML(invoice.toName) : "Client Name"}
              </p>
              {invoice.toEmail && (
                <p className="text-sm text-slate-500">{encodeHTML(invoice.toEmail)}</p>
              )}
              {invoice.toAddress && (
                <p className="whitespace-pre-line text-sm text-slate-500">
                  {encodeHTML(invoice.toAddress)}
                </p>
              )}
            </div>

            <div className="mb-6">
              <div
                className="mb-2 grid grid-cols-12 gap-2 border-b-2 pb-2 text-xs font-semibold uppercase tracking-wider"
                style={{ borderColor: invoice.brandColor + "40" }}
              >
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-right">Qty</div>
                <div className="col-span-2 text-right">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
              {invoice.items.map((item) => (
                <div key={item.id} className="mb-2 grid grid-cols-12 gap-2 border-b border-slate-100 pb-2 text-sm">
                  <div className="col-span-6 text-slate-700">
                    {item.description ? encodeHTML(item.description) : "—"}
                  </div>
                  <div className="col-span-2 text-right font-mono text-slate-600">
                    {item.quantity || "0"}
                  </div>
                  <div className="col-span-2 text-right font-mono text-slate-600">
                    {currency.symbol}{item.rate || "0.00"}
                  </div>
                  <div className="col-span-2 text-right font-mono font-semibold text-slate-900">
                    {currency.symbol}{item.amount}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <div className="w-64">
                <div className="mb-1 flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono">{currency.symbol}{subtotal.toFixed(2)}</span>
                </div>
                <div className="mb-2 flex justify-between border-b border-slate-200 pb-2 text-sm text-slate-600">
                  <span>Tax (0%)</span>
                  <span className="font-mono">{currency.symbol}0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-slate-900">Total</span>
                  <span className="text-xl font-bold" style={{ color: invoice.brandColor }}>
                    {currency.symbol}{total.toFixed(2)} {currency.code}
                  </span>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mt-6 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Notes</p>
                <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
                  {encodeHTML(invoice.notes)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="mb-3 text-sm text-slate-500">Create your own professional invoices in 60 seconds</p>
          <Link href="/builder" className="btn-primary">
            Make Your Own Invoice — Free →
          </Link>
        </div>
      </main>
    </div>
  );
}
