"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan") || "starter";

    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error(data.error || "Checkout failed");
        }
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Something went wrong");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          <p className="text-slate-600">Redirecting to secure checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="card max-w-md text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
          ✕
        </div>
        <h1 className="mb-2 text-xl font-bold text-slate-900">Checkout Error</h1>
        <p className="mb-6 text-slate-600">{error}</p>
        <Link href="/builder" className="btn-primary">
          Back to Builder
        </Link>
      </div>
    </div>
  );
}
