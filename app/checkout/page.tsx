"use client";

import { useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, ExternalLink, Coins, Shield, AlertCircle } from "lucide-react";

const PRICE_IN_USD = 29;

const STATIC_PRICES: Record<string, number> = {
  BTC: 0.00055,
  ETH: 0.011,
  SOL: 0.18,
  BNB: 0.09,
  USDT_ERC20: 29.1,
  USDT_TRC20: 29.0,
  USDT_BSC: 29.0,
  USDC_ERC20: 29.0,
  USDC_SOL: 29.0,
  TRX: 290,
  MATIC: 22,
  AVAX: 1.1,
  DOGE: 380,
  LTC: 0.38,
  XRP: 58,
  TON: 18,
  ADA: 82,
};

const COINS = [
  { id: "BTC", name: "Bitcoin", symbol: "BTC", network: "BTC", color: "#F7931A" },
  { id: "ETH", name: "Ethereum", symbol: "ETH", network: "Ethereum (ERC-20)", color: "#627EEA" },
  { id: "SOL", name: "Solana", symbol: "SOL", network: "Solana", color: "#9945FF" },
  { id: "BNB", name: "BNB", symbol: "BNB", network: "BNB Smart Chain (BEP-20)", color: "#F3BA2F" },
  { id: "USDT_ERC20", name: "USDT", symbol: "USDT", network: "Ethereum (ERC-20)", color: "#26A17B" },
  { id: "USDT_TRC20", name: "USDT", symbol: "USDT", network: "TRON (TRC-20)", color: "#26A17B" },
  { id: "USDT_BSC", name: "USDT", symbol: "USDT", network: "BNB Smart Chain (BEP-20)", color: "#26A17B" },
  { id: "USDC_ERC20", name: "USDC", symbol: "USDC", network: "Ethereum (ERC-20)", color: "#2775CA" },
  { id: "USDC_SOL", name: "USDC", symbol: "USDC", network: "Solana", color: "#2775CA" },
  { id: "TRX", name: "TRON", symbol: "TRX", network: "TRON (TRC-20)", color: "#EB0029" },
  { id: "MATIC", name: "Polygon", symbol: "MATIC", network: "Polygon", color: "#8247E5" },
  { id: "AVAX", name: "Avalanche", symbol: "AVAX", network: "Avalanche C-Chain", color: "#E84142" },
  { id: "DOGE", name: "Dogecoin", symbol: "DOGE", network: "Dogecoin", color: "#C2A633" },
  { id: "LTC", name: "Litecoin", symbol: "LTC", network: "Litecoin (LTC)", color: "#345D9D" },
  { id: "XRP", name: "XRP", symbol: "XRP", network: "XRP Ledger", color: "#23292F" },
  { id: "TON", name: "Toncoin", symbol: "TON", network: "The Open Network", color: "#0098EA" },
  { id: "ADA", name: "Cardano", symbol: "ADA", network: "Cardano", color: "#0033AD" },
];

function getCoinAddress(id: string): string {
  const key = `NEXT_PUBLIC_CRYPTO_${id}`;
  const addr = process.env[key];
  if (!addr || addr === "YOUR_WALLET_ADDRESS") {
    return "Wallet address not configured yet";
  }
  return addr;
}

function getCryptoAmount(id: string): string {
  const price = STATIC_PRICES[id];
  if (!price) return "—";
  if (price < 1) return price.toFixed(6);
  if (price < 100) return price.toFixed(4);
  return price.toFixed(2);
}

function formatCryptoAmount(id: string): string {
  const price = STATIC_PRICES[id];
  if (!price) return "—";
  if (price < 1) return `${price.toFixed(6)} ${id.split("_")[0]}`;
  if (price < 100) return `${price.toFixed(4)} ${id.split("_")[0]}`;
  return `${price.toFixed(2)} ${id.split("_")[0]}`;
}

function getQRData(id: string, address: string): string {
  const amount = getCryptoAmount(id);
  const symbol = id.split("_")[0];
  if (["USDT_ERC20", "USDC_ERC20", "ETH"].includes(id)) {
    return `ethereum:${address}?amount=${amount}`;
  }
  if (["USDT_TRC20", "TRX"].includes(id)) {
    return `tron:${address}?amount=${amount}`;
  }
  if (["USDT_BSC", "BNB"].includes(id)) {
    return `binancecoin:${address}?amount=${amount}`;
  }
  if (["SOL", "USDC_SOL"].includes(id)) {
    return `solana:${address}?amount=${amount}`;
  }
  if (id === "BTC") {
    return `bitcoin:${address}?amount=${amount}`;
  }
  if (id === "XRP") {
    return `ripple:${address}?amount=${amount}&dt=0`;
  }
  if (id === "ADA") {
    return `cardano:${address}?amount=${amount}`;
  }
  return address;
}

export default function CheckoutPage() {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const coin = COINS.find((c) => c.id === selectedCoin);
  const address = coin ? getCoinAddress(coin.id) : "";
  const qrData = coin ? getQRData(coin.id, address) : "";
  const isConfigured = address && !address.includes("not configured");

  const handleCopy = () => {
    if (!address || !isConfigured) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    localStorage.setItem("invoicegen_pro", "true");
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="card max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl">
            ✓
          </div>
          <h1 className="mb-2 text-2xl font-bold text-slate-900">
            You&apos;re a Pro! 🎉
          </h1>
          <p className="mb-8 text-slate-600">
            Access granted! You now have unlimited invoices, AI suggestions, and brand customization.
          </p>
          <Link href="/builder" className="btn-primary w-full block text-center">
            Start Creating Invoices →
          </Link>
          <Link href="/" className="btn-secondary w-full block text-center mt-3">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (selectedCoin && coin) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                I
              </div>
              <span className="font-bold text-slate-900">InvoiceGen</span>
            </Link>
            <button
              onClick={() => setSelectedCoin(null)}
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              ← Back to coins
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-lg px-6 py-8">
          {/* Selected coin */}
          <div className="mb-6 flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold text-white"
              style={{ backgroundColor: coin.color }}
            >
              {coin.symbol.charAt(0)}
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                {coin.name} ({coin.symbol})
              </h1>
              <p className="text-sm text-slate-500">{coin.network}</p>
            </div>
          </div>

          {/* QR Code */}
          <div className="card mb-4 flex flex-col items-center p-6">
            {!isConfigured ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <AlertCircle className="h-8 w-8 text-yellow-500" />
                <p className="font-medium text-slate-900">Address not configured yet</p>
                <p className="text-sm text-slate-500">
                  Add <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">NEXT_PUBLIC_CRYPTO_{coin.id}</code> to your .env file.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
                  <QRCodeSVG
                    value={qrData}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#0f172a"
                    level="M"
                    includeMargin={false}
                  />
                </div>
                <p className="mb-1 text-xs text-slate-500">Scan with your wallet</p>
              </>
            )}
          </div>

          {/* Amount */}
          <div className="card mb-4 p-5">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-400">
              Send exactly
            </p>
            <p className="text-2xl font-bold text-slate-900 font-mono">
              {isConfigured ? formatCryptoAmount(coin.id) : "—"}
            </p>
            <p className="mt-0.5 text-sm text-slate-500">≈ ${PRICE_IN_USD} USD</p>
          </div>

          {/* Wallet Address */}
          <div className="card mb-4 p-5">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-400">
              {coin.name} Address
            </p>
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-mono break-all ${isConfigured ? "text-slate-900" : "text-slate-400 italic"}`}>
                  {isConfigured ? address : "Configure address in .env"}
                </p>
              </div>
              {isConfigured && (
                <button
                  onClick={handleCopy}
                  className="btn-secondary btn-sm shrink-0 gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>
            {isConfigured && (
              <a
                href={`${coin.network.toLowerCase().includes("solana") ? "https://solscan.io" : coin.network.toLowerCase().includes("bitcoin") ? "https://blockstream.info" : coin.network.toLowerCase().includes("tron") ? "https://tronscan.org" : coin.network.toLowerCase().includes("polygon") ? "https://polygonscan.com" : coin.network.toLowerCase().includes("avalanche") ? "https://snowtrace.io" : coin.network.toLowerCase().includes("ethereum") ? "https://etherscan.io" : "#"}/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700"
              >
                View on explorer <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {/* Network warning */}
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              <strong>Important:</strong> Only send {coin.symbol} on the {coin.network} network. 
              {coin.symbol.includes("USDT") || coin.symbol.includes("USDC") 
                ? ` Do not send on other networks — tokens sent on wrong networks are non-recoverable.`
                : ` Double-check the network before sending.`}
            </p>
          </div>

          {/* Confirm button */}
          <button
            onClick={handleConfirm}
            disabled={!isConfigured}
            className="btn-primary w-full text-base py-3 disabled:opacity-50"
          >
            I&apos;ve Paid — Unlock Pro
          </button>

          <p className="mt-3 text-center text-xs text-slate-500">
            Manual confirmation · Payment usually clears within 10-30 minutes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              I
            </div>
            <span className="font-bold text-slate-900">InvoiceGen</span>
          </Link>
          <Link href="/builder" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
            Try free first →
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-2 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-100">
            <Coins className="h-7 w-7 text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Crypto Checkout</h1>
          <p className="mt-2 text-slate-600">
            Select a cryptocurrency to pay for Pro — ${PRICE_IN_USD} USD
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {COINS.map((c) => {
            const addr = getCoinAddress(c.id);
            const configured = addr && !addr.includes("not configured");
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCoin(c.id)}
                className="card p-4 flex flex-col items-center gap-2 text-center hover:border-brand-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white"
                  style={{ backgroundColor: c.color }}
                >
                  {c.symbol.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.symbol}</p>
                </div>
                {configured ? (
                  <span className="badge-success text-2xs">Ready</span>
                ) : (
                  <span className="badge-default text-2xs">Setup</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
          <div>
            <p className="font-semibold text-slate-900">Manual confirmation — no account needed</p>
            <p className="mt-1 text-sm text-slate-600">
              After sending payment, click &ldquo;I&apos;ve Paid&rdquo; to instantly unlock Pro features. 
              Payments are manually verified. No blockchain API required — just send any amount 
              to the address above and confirm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
