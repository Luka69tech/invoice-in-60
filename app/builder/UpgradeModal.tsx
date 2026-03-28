"use client";

import Link from "next/link";
import { useState } from "react";

interface UpgradeModalProps {
  usedCount: number;
  limit: number;
  onClose?: () => void;
}

export function UpgradeModal({ usedCount, limit, onClose }: UpgradeModalProps) {
  const [isAnnual, setIsAnnual] = useState(true);

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

        {/* Billing Toggle */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className={`text-xs ${!isAnnual ? "text-white" : "text-slate-500"}`}>Monthly</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative h-6 w-10 rounded-full transition-colors ${isAnnual ? "bg-sky-600" : "bg-slate-600"}`}
          >
            <span
              className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
              style={{ left: isAnnual ? "20px" : "2px" }}
            />
          </button>
          <span className={`text-xs ${isAnnual ? "text-white" : "text-slate-500"}`}>
            Annual <span className="text-sky-400">(Save 27%)</span>
          </span>
        </div>

        <div className="mt-4 rounded-xl border border-slate-700 bg-slate-800 p-4">
          <div className="mb-3 text-center text-2xl font-bold text-white">
            ${isAnnual ? 79 : 9}
            <span className="text-sm font-normal text-slate-400">{isAnnual ? "/year" : "/month"}</span>
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Unlimited invoice generations
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> AI-powered line items
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Remove watermark
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Custom logo & brand colors
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Email PDF delivery
            </li>
          </ul>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Link 
            href={`/checkout?plan=pro${isAnnual ? "&annual=true" : ""}`} 
            className="block w-full rounded-lg bg-sky-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            {isAnnual ? "Get Pro — $79/year" : "Get Pro — $9/month"}
          </Link>
          <Link 
            href="/pricing" 
            className="text-center text-xs text-slate-500 hover:text-slate-400"
          >
            View all plans
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
          Secure crypto payment · Cancel anytime
        </p>
      </div>
    </div>
  );
}