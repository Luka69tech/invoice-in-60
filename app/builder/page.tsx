"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

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

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
];

function generateId() {
  return crypto.randomUUID();
}

function formatDate(d: string) {
  return d || new Date().toISOString().split("T")[0];
}

function calcAmount(qty: string, rate: string) {
  const n = parseFloat(qty || "0") * parseFloat(rate || "0");
  return isNaN(n) ? "0.00" : n.toFixed(2);
}

export default function BuilderPage() {
  const [invoice, setInvoice] = useState<InvoiceData>({
    fromName: "",
    fromEmail: "",
    fromAddress: "",
    toName: "",
    toEmail: "",
    toAddress: "",
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    issueDate: formatDate(""),
    dueDate: formatDate(new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]),
    currency: "USD",
    notes: "Payment due within 30 days. Thank you for your business!",
    items: [{ id: generateId(), description: "", quantity: "1", rate: "", amount: "0.00" }],
    brandColor: "#22c55e",
    logoUrl: "",
  });

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const [showUpsell, setShowUpsell] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsPro(!!localStorage.getItem("invoicegen_pro"));
  }, []);

  const currency = currencies.find((c) => c.code === invoice.currency) || currencies[0];

  const subtotal = invoice.items.reduce((sum, item) => sum + parseFloat(item.amount || "0"), 0);
  const tax = subtotal * 0;
  const total = subtotal + tax;

  const updateItem = useCallback((id: string, field: keyof LineItem, value: string) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "quantity" || field === "rate") {
          updated.amount = calcAmount(
            field === "quantity" ? value : updated.quantity,
            field === "rate" ? value : updated.rate
          );
        }
        return updated;
      }),
    }));
  }, []);

  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: generateId(), description: "", quantity: "1", rate: "", amount: "0.00" },
      ],
    }));
  };

  const removeItem = (id: string) => {
    if (invoice.items.length === 1) return;
    setInvoice((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== id) }));
  };

  const handleAiSuggest = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          currency: invoice.currency,
        }),
      });
      const data = await res.json();
      if (data.items) {
        const newItems = data.items.map((item: { description: string; quantity: string; rate: string }) => ({
          id: generateId(),
          description: item.description,
          quantity: String(item.quantity || 1),
          rate: String(item.rate || ""),
          amount: calcAmount(String(item.quantity || 1), String(item.rate || "")),
        }));
        setInvoice((prev) => ({ ...prev, items: newItems }));
        setAiPrompt("");
      }
    } catch {
      alert("AI suggestion failed. Make sure Ollama is running locally on port 11434.");
    } finally {
      setAiLoading(false);
    }
  };

  const downloadPdf = async () => {
    setPdfError("");
    if (!invoice.fromName || !invoice.toName) {
      setPdfError("Please fill in at least your name and client name.");
      return;
    }
    setPdfLoading(true);
    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice, currency }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "PDF generation failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoice.invoiceNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      if (!isPro) {
        setShowUpsell(true);
      }
    } catch (e: unknown) {
      setPdfError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setPdfLoading(false);
    }
  };

  const copyShareLink = async () => {
    const data = btoa(JSON.stringify(invoice));
    const url = `${window.location.origin}/i/${data}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      alert("Copy the URL from the address bar");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              I
            </div>
            <span className="font-bold text-slate-900">InvoiceGen</span>
          </Link>
          <span className="hidden text-sm text-slate-400 sm:block">/ Builder</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={downloadPdf}
            disabled={pdfLoading}
            className="btn-primary text-sm"
          >
            {pdfLoading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </span>
            ) : (
              "Download PDF"
            )}
          </button>
          {!isPro && (
            <Link
              href="/checkout"
              className="hidden text-sm font-semibold text-brand-600 hover:text-brand-700 sm:block"
            >
              Upgrade to Pro →
            </Link>
          )}
        </div>
      </header>

      {pdfError && (
        <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {pdfError}
        </div>
      )}

      {showUpsell && (
        <div className="mx-6 mt-4 rounded-lg border border-brand-200 bg-brand-50 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-brand-800">Love it? Get unlimited invoices + AI.</p>
              <p className="text-sm text-brand-600">One-time $29 — never pay again.</p>
            </div>
            <Link href="/checkout" className="btn-primary shrink-0 text-sm">
              Buy Pro — $29
            </Link>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-6 p-6 lg:grid-cols-2">
        {/* LEFT: Form */}
        <div className="space-y-6">
          {/* AI Suggestor */}
          <div className="card">
            <div className="mb-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <span>⚡</span> AI Line Items
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Describe your project in plain English. AI fills in line items instantly.
              </p>
            </div>
            <div className="flex gap-2">
              <textarea
                className="input-field flex-1 resize-none"
                rows={2}
                placeholder="e.g. Brand identity design: logo, color palette, typography, 3 revision rounds"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleAiSuggest())}
              />
              <button
                onClick={handleAiSuggest}
                disabled={aiLoading || !aiPrompt.trim()}
                className="btn-primary shrink-0"
              >
                {aiLoading ? "Thinking..." : "Generate"}
              </button>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="card">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Invoice Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Invoice #</label>
                <input
                  className="input-field"
                  value={invoice.invoiceNumber}
                  onChange={(e) => setInvoice((p) => ({ ...p, invoiceNumber: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Currency</label>
                <select
                  className="input-field"
                  value={invoice.currency}
                  onChange={(e) => setInvoice((p) => ({ ...p, currency: e.target.value }))}
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Issue Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={invoice.issueDate}
                  onChange={(e) => setInvoice((p) => ({ ...p, issueDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Due Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={invoice.dueDate}
                  onChange={(e) => setInvoice((p) => ({ ...p, dueDate: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-500">Brand Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    className="h-10 w-16 cursor-pointer rounded border border-slate-300"
                    value={invoice.brandColor}
                    onChange={(e) => setInvoice((p) => ({ ...p, brandColor: e.target.value }))}
                  />
                  <input
                    className="input-field flex-1"
                    value={invoice.brandColor}
                    onChange={(e) => setInvoice((p) => ({ ...p, brandColor: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* From / To */}
          <div className="card">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">From &amp; To</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Your Details</p>
                <input
                  className="input-field"
                  placeholder="Your Name"
                  value={invoice.fromName}
                  onChange={(e) => setInvoice((p) => ({ ...p, fromName: e.target.value }))}
                />
                <input
                  className="input-field"
                  placeholder="Email"
                  type="email"
                  value={invoice.fromEmail}
                  onChange={(e) => setInvoice((p) => ({ ...p, fromEmail: e.target.value }))}
                />
                <textarea
                  className="input-field resize-none"
                  rows={2}
                  placeholder="Address, City, Country"
                  value={invoice.fromAddress}
                  onChange={(e) => setInvoice((p) => ({ ...p, fromAddress: e.target.value }))}
                />
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Bill To</p>
                <input
                  className="input-field"
                  placeholder="Client Name"
                  value={invoice.toName}
                  onChange={(e) => setInvoice((p) => ({ ...p, toName: e.target.value }))}
                />
                <input
                  className="input-field"
                  placeholder="Client Email"
                  type="email"
                  value={invoice.toEmail}
                  onChange={(e) => setInvoice((p) => ({ ...p, toEmail: e.target.value }))}
                />
                <textarea
                  className="input-field resize-none"
                  rows={2}
                  placeholder="Client Address, City, Country"
                  value={invoice.toAddress}
                  onChange={(e) => setInvoice((p) => ({ ...p, toAddress: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="card">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Line Items</h2>
            <div className="mb-3 grid grid-cols-12 gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-2">Rate ({currency.code})</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-1" />
            </div>
            <div className="space-y-2">
              {invoice.items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 items-center gap-2">
                  <input
                    className="input-field col-span-5"
                    placeholder="Service description"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  />
                  <input
                    className="input-field col-span-2"
                    placeholder="1"
                    type="number"
                    min="0"
                    step="0.5"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                  />
                  <input
                    className="input-field col-span-2"
                    placeholder="0.00"
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                  />
                  <div className="col-span-2 flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono text-slate-700">
                    {currency.symbol}{item.amount}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="col-span-1 flex h-9 w-9 items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-500"
                    disabled={invoice.items.length === 1}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addItem}
              className="mt-3 flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700"
            >
              <span>+</span> Add Line Item
            </button>
          </div>

          {/* Notes */}
          <div className="card">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Notes</h2>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Payment terms, thank you message, etc."
              value={invoice.notes}
              onChange={(e) => setInvoice((p) => ({ ...p, notes: e.target.value }))}
            />
          </div>
        </div>

        {/* RIGHT: Preview */}
        <div className="lg:sticky lg:top-20 lg:h-fit">
          <div className="card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Live Preview</h2>
              <button
                onClick={copyShareLink}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
              >
                {copySuccess ? "✓ Copied!" : "📋 Share"}
              </button>
            </div>
            <InvoicePreview invoice={invoice} currency={currency} subtotal={subtotal} tax={tax} total={total} previewRef={previewRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InvoicePreview({
  invoice,
  currency,
  subtotal,
  tax,
  total,
  previewRef,
}: {
  invoice: InvoiceData;
  currency: { code: string; symbol: string; name: string };
  subtotal: number;
  tax: number;
  total: number;
  previewRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div
      ref={previewRef}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      style={{ fontSize: "13px" }}
    >
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">{invoice.fromName || "Your Name"}</h3>
          {invoice.fromEmail && <p className="text-sm text-slate-500">{invoice.fromEmail}</p>}
          {invoice.fromAddress && (
            <p className="whitespace-pre-line text-sm text-slate-500">{invoice.fromAddress}</p>
          )}
        </div>
        <div
          className="h-12 w-12 rounded-lg"
          style={{ backgroundColor: invoice.brandColor }}
        />
      </div>

      {/* Title row */}
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
            <span className="font-medium text-slate-700">#{invoice.invoiceNumber}</span>
          </p>
          <p>Date: {invoice.issueDate}</p>
          <p>Due: {invoice.dueDate}</p>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Bill To</p>
        <p className="font-semibold text-slate-900">{invoice.toName || "Client Name"}</p>
        {invoice.toEmail && <p className="text-sm text-slate-500">{invoice.toEmail}</p>}
        {invoice.toAddress && (
          <p className="whitespace-pre-line text-sm text-slate-500">{invoice.toAddress}</p>
        )}
      </div>

      {/* Table */}
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
            <div className="col-span-6 text-slate-700">{item.description || "—"}</div>
            <div className="col-span-2 text-right font-mono text-slate-600">{item.quantity || "0"}</div>
            <div className="col-span-2 text-right font-mono text-slate-600">
              {currency.symbol}{item.rate || "0.00"}
            </div>
            <div className="col-span-2 text-right font-mono font-semibold text-slate-900">
              {currency.symbol}{item.amount}
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64">
          <div className="mb-1 flex justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span className="font-mono">{currency.symbol}{subtotal.toFixed(2)}</span>
          </div>
          <div className="mb-2 flex justify-between border-b border-slate-200 pb-2 text-sm text-slate-600">
            <span>Tax (0%)</span>
            <span className="font-mono">{currency.symbol}{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-base font-semibold text-slate-900">Total</span>
            <span
              className="text-xl font-bold"
              style={{ color: invoice.brandColor }}
            >
              {currency.symbol}{total.toFixed(2)} {currency.code}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mt-6 rounded-lg border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Notes</p>
          <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
}
