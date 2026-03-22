"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function SuccessPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success") === "true";
    const sessionId = params.get("session_id");
    if (success || sessionId) {
      localStorage.setItem("invoicegen_pro", "true");
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="card max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl">
          ✓
        </div>
        <h1 className="mb-3 text-2xl font-bold text-slate-900">
          You&apos;re a Pro! 🎉
        </h1>
        <p className="mb-2 text-slate-600">
          Payment confirmed. You now have unlimited access to all Pro features.
        </p>
        <p className="mb-8 text-sm text-slate-500">
          Payment will be verified manually. Pro access is instant.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/builder" className="btn-primary">
            Start Creating Invoices →
          </Link>
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
