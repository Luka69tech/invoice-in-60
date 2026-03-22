"use client";

import Link from "next/link";

interface UpgradeModalProps {
  usedCount: number;
  limit: number;
  onClose?: () => void;
}

export function UpgradeModal({ usedCount, limit, onClose }: UpgradeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-1 text-center text-4xl">💎</div>
        <h2 className="mt-3 text-center text-xl font-bold text-white">
          You&apos;ve Used All {limit} Free Invoices
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Upgrade to Pro for unlimited invoices, AI-powered line items, and custom branding.
        </p>

        <div className="mt-5 rounded-xl border border-slate-700 bg-slate-800 p-4">
          <div className="mb-3 text-center text-2xl font-bold text-white">$29</div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span> Unlimited invoice generations
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span> AI-powered line items
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span> Remove InvoiceGen branding
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span> Custom logo upload
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span> One-time payment, yours forever
            </li>
          </ul>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Link href="/checkout" className="block w-full rounded-lg bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-700">
            Upgrade to Pro — $29
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="w-full rounded-lg border border-slate-700 px-4 py-2 text-center text-sm text-slate-400 transition hover:border-slate-600 hover:text-slate-300"
            >
              Maybe later
            </button>
          )}
        </div>

        <p className="mt-3 text-center text-xs text-slate-500">
          Secure crypto payment · Instant access
        </p>
      </div>
    </div>
  );
}
