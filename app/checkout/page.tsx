"use client";

export default function CheckoutPage() {
  const handleClick = () => {
    const productId = process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_ID || "your-product-id";
    if (window.Gumroad?.Product) {
      window.Gumroad.Product.Show({ productId });
    } else {
      window.open(`https://gumroad.com/l/${productId}`, "_blank");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="card max-w-md text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl">
          💳
        </div>
        <h1 className="mb-2 text-xl font-bold text-slate-900">Upgrade to Pro</h1>
        <p className="mb-6 text-slate-600">
          Get unlimited invoices, AI suggestions, and brand customization for a one-time payment.
        </p>
        <button onClick={handleClick} className="btn-primary w-full">
          Buy Pro — $29
        </button>
        <p className="mt-3 text-xs text-slate-500">
          Secure payment via Gumroad · 14-day money-back guarantee
        </p>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    Gumroad?: {
      Product?: {
        Show: (opts: { productId: string }) => void;
      };
    };
  }
}
