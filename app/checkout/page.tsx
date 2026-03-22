"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { QRCodeSVG } from "qrcode.react";
import {
  Copy,
  Check,
  ExternalLink,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Zap,
  Coins,
  ShieldCheck,
  X,
} from "lucide-react";

const PRICE_IN_USD = 29;

function CoinIcon({ icon, size = 24 }: { icon: string; size?: number }) {
  if (icon === "ton") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="16" fill="#0098EA"/>
        <path d="M20 44V20h8l16 16 16-16h-8V44h-8V28l-16-16-16 16v16h-8z" fill="white"/>
      </svg>
    );
  }
  if (icon === "xrp") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="16" fill="#23292F"/>
        <path d="M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8zm10.5 35.5c0 2.485-4.5 4.5-10.5 4.5s-10.5-2.015-10.5-4.5v-7c0-2.485 4.5-4.5 10.5-4.5s10.5 2.015 10.5 4.5v7zm0-17c0 2.485-4.5 4.5-10.5 4.5s-10.5-2.015-10.5-4.5v-7c0-2.485 4.5-4.5 10.5-4.5s10.5 2.015 10.5 4.5v7z" fill="white"/>
      </svg>
    );
  }
  if (icon === "algo") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="16" fill="#000"/>
        <path d="M32 12L52 44H12L32 12Z" fill="white"/>
        <path d="M32 52L12 20H52L32 52Z" fill="white" fillOpacity="0.5"/>
      </svg>
    );
  }
  return (
    <Icon
      icon={`cryptocurrency:${icon}`}
      style={{ width: size, height: size }}
    />
  );
}

const COIN_CATEGORIES = [
  {
    label: "Stablecoins",
    popular: true,
    coins: [
      {
        id: "USDT_TRC20",
        name: "Tether",
        symbol: "USDT",
        network: "TRC-20",
        networkFull: "TRON",
        icon: "usdt",
        popular: true,
      },
      {
        id: "USDT_ERC20",
        name: "Tether",
        symbol: "USDT",
        network: "ERC-20",
        networkFull: "Ethereum",
        icon: "usdt",
      },
      {
        id: "USDT_BSC",
        name: "Tether",
        symbol: "USDT",
        network: "BEP-20",
        networkFull: "BNB Chain",
        icon: "usdt",
      },
      {
        id: "USDC_ERC20",
        name: "USD Coin",
        symbol: "USDC",
        network: "ERC-20",
        networkFull: "Ethereum",
        icon: "usdc",
      },
      {
        id: "USDC_SOL",
        name: "USD Coin",
        symbol: "USDC",
        network: "SOL",
        networkFull: "Solana",
        icon: "usdc",
      },
    ],
  },
  {
    label: "Major",
    popular: false,
    coins: [
      {
        id: "BTC",
        name: "Bitcoin",
        symbol: "BTC",
        network: "BTC",
        networkFull: "Bitcoin",
        icon: "btc",
      },
      {
        id: "ETH",
        name: "Ethereum",
        symbol: "ETH",
        network: "ERC-20",
        networkFull: "Ethereum",
        icon: "eth",
        popular: true,
      },
      {
        id: "SOL",
        name: "Solana",
        symbol: "SOL",
        network: "SOL",
        networkFull: "Solana",
        icon: "sol",
      },
      {
        id: "BNB",
        name: "BNB",
        symbol: "BNB",
        network: "BEP-20",
        networkFull: "BNB Chain",
        icon: "bnb",
      },
    ],
  },
  {
    label: "Altcoins",
    popular: false,
    coins: [
      { id: "MATIC", name: "Polygon", symbol: "MATIC", network: "MATIC", networkFull: "Polygon", icon: "matic" },
      { id: "AVAX", name: "Avalanche", symbol: "AVAX", network: "AVAX", networkFull: "Avalanche", icon: "avax" },
      { id: "TRX", name: "TRON", symbol: "TRX", network: "TRC-20", networkFull: "TRON", icon: "trx" },
      { id: "TON", name: "Toncoin", symbol: "TON", network: "TON", networkFull: "The Open Network", icon: "ton" },
      { id: "XRP", name: "XRP", symbol: "XRP", network: "XRP", networkFull: "XRP Ledger", icon: "xrp" },
      { id: "DOGE", name: "Dogecoin", symbol: "DOGE", network: "DOGE", networkFull: "Dogecoin", icon: "doge" },
      { id: "LTC", name: "Litecoin", symbol: "LTC", network: "LTC", networkFull: "Litecoin", icon: "ltc" },
      { id: "ADA", name: "Cardano", symbol: "ADA", network: "ADA", networkFull: "Cardano", icon: "ada" },
      { id: "ALGO", name: "Algorand", symbol: "ALGO", network: "ALGO", networkFull: "Algorand", icon: "algo" },
    ],
  },
];

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
  ALGO: 58,
};

function getCoinAddress(id: string): string {
  const key = `NEXT_PUBLIC_CRYPTO_${id}`;
  const addr = process.env[key];
  if (!addr || addr === "YOUR_WALLET_ADDRESS" || addr === "YOUR_WALLET_ADDRESS") {
    return "";
  }
  return addr;
}

function getCryptoAmount(id: string): string {
  const symbol = id.split("_")[0];
  const price = STATIC_PRICES[id];
  if (!price) return "—";
  if (price < 0.001) return `${(price).toFixed(8)} ${symbol}`;
  if (price < 1) return `${price.toFixed(6)} ${symbol}`;
  if (price < 100) return `${price.toFixed(4)} ${symbol}`;
  return `${price.toFixed(2)} ${symbol}`;
}

function getQRData(id: string, address: string): string {
  const amount = STATIC_PRICES[id] || 0;
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
  return address;
}

function getExplorer(id: string, address: string): string {
  const explorers: Record<string, string> = {
    BTC: `https://blockstream.info/address/${address}`,
    ETH: `https://etherscan.io/address/${address}`,
    SOL: `https://solscan.io/account/${address}`,
    BNB: `https://bscscan.com/address/${address}`,
    USDT_ERC20: `https://etherscan.io/address/${address}`,
    USDC_ERC20: `https://etherscan.io/address/${address}`,
    USDT_TRC20: `https://tronscan.org/#/address/${address}`,
    TRX: `https://tronscan.org/#/address/${address}`,
    USDT_BSC: `https://bscscan.com/address/${address}`,
    USDC_SOL: `https://solscan.io/account/${address}`,
    MATIC: `https://polygonscan.com/address/${address}`,
    AVAX: `https://snowtrace.io/address/${address}`,
    DOGE: `https://dogechain.info/address/${address}`,
    LTC: `https://litecoinblockexplorer.net/address/${address}`,
    XRP: `https://xrpscan.com/account/${address}`,
    TON: `https://tonscan.org/address/${address}`,
    ADA: `https://cardanoscan.io/address/${address}`,
    ALGO: `https://algoexplorer.io/address/${address}`,
  };
  return explorers[id] || "#";
}

const ICON_COLORS: Record<string, string> = {
  btc: "#F7931A",
  eth: "#627EEA",
  sol: "#9945FF",
  bnb: "#F3BA2F",
  usdt: "#26A17B",
  usdc: "#2775CA",
  trx: "#EB0029",
  matic: "#8247E5",
  avax: "#E84142",
  doge: "#C2A633",
  ltc: "#345D9D",
  xrp: "#23292F",
  ton: "#0098EA",
  ada: "#0033AD",
  algo: "#000000",
};

export default function CheckoutPage() {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  const coin = COIN_CATEGORIES.flatMap((c) => c.coins).find((c) => c.id === selectedCoin);
  const address = coin ? getCoinAddress(coin.id) : "";
  const isConfigured = !!address;
  const qrData = coin && isConfigured ? getQRData(coin.id, address) : "";

  useEffect(() => {
    if (selectedCoin) {
      setTimeLeft(30 * 60);
      const interval = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(interval);
            setSelectedCoin(null);
            return 30 * 60;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [selectedCoin]);

  const handleCopy = useCallback(() => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [address]);

  const handleConfirm = () => {
    localStorage.setItem("invoicegen_pro", "true");
    setConfirmed(true);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-5">
        <div className="w-full max-w-md">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <ShieldCheck className="h-8 w-8 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Payment Submitted!
            </h1>
            <p className="text-slate-400 mb-2">
              Your payment is being verified. Pro access is now active.
            </p>
            <p className="text-xs text-slate-500 mb-8">
              Manual verification typically takes 10-30 minutes. Receipt will be sent via email.
            </p>
            <div className="space-y-3">
              <Link href="/builder" className="block">
                <button className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                  Start Creating Invoices
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </Link>
              <Link href="/" className="block">
                <button className="w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium rounded-xl transition-colors">
                  Back to Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCoin && coin) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        {/* Header */}
        <header className="border-b border-slate-800 px-5 py-4">
          <div className="mx-auto max-w-lg flex items-center justify-between">
            <button
              onClick={() => setSelectedCoin(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
                I
              </div>
              <span className="font-semibold text-white text-sm">InvoiceGen</span>
            </div>
            <div className="w-16" />
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex items-start justify-center px-5 py-8">
          <div className="w-full max-w-sm">
            {/* Coin info */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: `${ICON_COLORS[coin.icon] || "#666"}20` }}
              >
                <CoinIcon icon={coin.icon} size={32} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  {coin.name} ({coin.symbol})
                </h1>
                <p className="text-sm text-slate-400">{coin.networkFull}</p>
              </div>
            </div>

            {/* Timer */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-slate-400">Complete within</span>
              </div>
              <span className={`text-sm font-mono font-bold ${timeLeft < 300 ? "text-red-400" : "text-amber-400"}`}>
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* QR Code */}
            <div className="bg-white rounded-2xl p-5 flex flex-col items-center mb-5">
              {!isConfigured ? (
                <div className="py-8 text-center">
                  <AlertTriangle className="h-8 w-8 text-amber-400 mx-auto mb-3" />
                  <p className="font-medium text-slate-900">Address not configured</p>
                  <p className="text-xs text-slate-500 mt-1">Add NEXT_PUBLIC_CRYPTO_{coin.id} to .env</p>
                </div>
              ) : (
                <>
                  <div className="rounded-xl overflow-hidden">
                    <QRCodeSVG
                      value={qrData}
                      size={180}
                      bgColor="#ffffff"
                      fgColor="#0f172a"
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                  <p className="mt-3 text-xs text-slate-500">Scan QR code or copy address below</p>
                </>
              )}
            </div>

            {/* Amount */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-4">
              <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-medium">Send exactly</p>
              <p className="text-2xl font-bold font-mono text-white">
                {isConfigured ? getCryptoAmount(coin.id) : "—"}
              </p>
              <p className="text-sm text-slate-400">≈ ${PRICE_IN_USD} USD</p>
            </div>

            {/* Address */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-4">
              <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-medium">
                {coin.name} Address
              </p>
              <div className="flex items-center gap-2">
                <p className={`text-sm font-mono break-all text-slate-300 flex-1 ${!isConfigured ? "italic text-slate-600" : ""}`}>
                  {isConfigured ? address : "Configure wallet address in .env"}
                </p>
                {isConfigured && (
                  <button
                    onClick={handleCopy}
                    className="shrink-0 p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                )}
              </div>
              {isConfigured && (
                <a
                  href={getExplorer(coin.id, address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center gap-1 text-xs text-brand-500 hover:text-brand-400 transition-colors"
                >
                  View on explorer <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            {/* Network Warning */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-5 flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-300 leading-relaxed">
                <strong>Important:</strong> Send only <span className="font-mono font-medium">{coin.symbol}</span> on the{" "}
                <span className="font-medium">{coin.networkFull}</span> network. Do not send from exchanges — use a personal wallet.
              </p>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              disabled={!isConfigured}
              className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="h-4 w-4" />
              I&apos;ve Sent the Payment
            </button>

            <p className="text-center text-xs text-slate-600 mt-3">
              Manual verification · Payment usually confirms within 10-30 min
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Coin selection screen
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 px-5 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center text-white text-sm font-bold">
              I
            </div>
            <span className="font-bold text-white">InvoiceGen</span>
          </Link>
          <Link href="/builder" className="text-sm text-slate-400 hover:text-white transition-colors">
            Try free →
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-10">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-brand-600/10 border border-brand-600/20 flex items-center justify-center">
            <Coins className="h-7 w-7 text-brand-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Select Payment Method</h1>
          <p className="text-slate-400">Choose a cryptocurrency to complete your $29 USD purchase</p>
        </div>

        {/* Coin Categories */}
        {COIN_CATEGORIES.map((category) => (
          <div key={category.label} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                {category.label}
              </h2>
              {category.popular && (
                <span className="inline-flex items-center gap-1 text-2xs font-medium bg-brand-600/10 text-brand-500 border border-brand-600/20 rounded-full px-2 py-0.5">
                  <Zap className="h-2.5 w-2.5" />
                  Popular
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {category.coins.map((c) => {
                const addr = getCoinAddress(c.id);
                const configured = !!addr;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCoin(c.id)}
                    className="group relative bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 rounded-xl p-4 text-left transition-all duration-200 hover:shadow-lg hover:shadow-brand-900/20 hover:-translate-y-0.5"
                  >
                    {c.popular && (
                      <span className="absolute -top-2 -right-2 text-2xs font-medium bg-brand-500 text-white rounded-full px-1.5 py-0.5">
                        Popular
                      </span>
                    )}
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="h-9 w-9 rounded-lg flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: `${ICON_COLORS[c.icon] || "#666"}20` }}
                      >
                        <CoinIcon icon={c.icon} size={24} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{c.symbol}</p>
                        <p className="text-2xs text-slate-500 truncate">{c.name}</p>
                      </div>
                    </div>
                    <span className={`text-2xs font-medium px-1.5 py-0.5 rounded ${configured ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-700 text-slate-500"}`}>
                      {configured ? "Ready" : "Setup"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Info box */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-brand-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-white mb-1">Manual confirmation — no account needed</p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Send any amount to the address shown after selecting a coin. Click &ldquo;I&apos;ve Sent the Payment&rdquo; 
              to instantly unlock Pro. Payments are verified manually — typically within 10-30 minutes. 
              Fast, private, no intermediaries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
