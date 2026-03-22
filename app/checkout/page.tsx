"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  Copy,
  Check,
  ExternalLink,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Coins,
  ShieldCheck,
  ChevronRight,
  Zap,
  Clock3,
  RefreshCw,
  CircleDot,
} from "lucide-react";
import { usePrices } from "@/lib/hooks/usePrices";

const PRICE_IN_USD = 29;

const COIN_COLORS: Record<string, string> = {
  BTC: "#f7931a",
  ETH: "#627eea",
  SOL: "#9945ff",
  BNB: "#f3ba2f",
  USDT: "#26a17b",
  USDC: "#2775ca",
  MATIC: "#8247e5",
  AVAX: "#e84142",
  TRX: "#eb0029",
  TON: "#0098ea",
  XRP: "#346aa9",
  DOGE: "#c2a633",
  LTC: "#bfbbbb",
  ADA: "#0033ad",
  ALGO: "#fbcc5c",
};

function CoinSvg({ symbol, size = 32 }: { symbol: string; size?: number }) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const s = symbol.toLowerCase();

  useEffect(() => {
    fetch(`/cryptocurrency-icons/svg/color/${s}.svg`)
      .then((r) => {
        if (r.ok) return r.text();
        throw new Error("not found");
      })
      .then(setSvgContent)
      .catch(() => setSvgContent(null));
  }, [s]);

  if (!svgContent) return null;

  return (
    <div
      style={{ width: size, height: size, flexShrink: 0 }}
      dangerouslySetInnerHTML={{ __html: svgContent.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "").replace(/width="[^"]*"/, "").replace(/height="[^"]*"/, "") }}
    />
  );
}

const COIN_CATEGORIES = [
  {
    label: "Stablecoins",
    popular: true,
    coins: [
      {
        id: "USDT",
        name: "Tether",
        symbol: "USDT",
        icon: "usdt",
        popular: true,
        badge: "Most Popular",
        networks: [
          { id: "usdt_trc20", name: "TRON", shortName: "TRC-20", icon: "trx" },
          { id: "usdt_erc20", name: "Ethereum", shortName: "ERC-20", icon: "eth" },
          { id: "usdt_bsc", name: "BNB Chain", shortName: "BEP-20", icon: "bnb" },
          { id: "usdt_sol", name: "Solana", shortName: "SPL", icon: "sol" },
          { id: "usdt_polygon", name: "Polygon", shortName: "Polygon", icon: "polygon" },
          { id: "usdt_avax", name: "Avalanche", shortName: "C-Chain", icon: "avax" },
          { id: "usdt_arbitrum", name: "Arbitrum", shortName: "Arbitrum", icon: "arbitrum" },
          { id: "usdt_optimism", name: "Optimism", shortName: "Optimism", icon: "optimism" },
          { id: "usdt_base", name: "Base", shortName: "Base", icon: "base" },
        ],
      },
      {
        id: "USDC",
        name: "USD Coin",
        symbol: "USDC",
        icon: "usdc",
        popular: false,
        networks: [
          { id: "usdc_erc20", name: "Ethereum", shortName: "ERC-20", icon: "eth" },
          { id: "usdc_sol", name: "Solana", shortName: "SPL", icon: "sol" },
          { id: "usdc_bsc", name: "BNB Chain", shortName: "BEP-20", icon: "bnb" },
          { id: "usdc_polygon", name: "Polygon", shortName: "Polygon", icon: "polygon" },
          { id: "usdc_avax", name: "Avalanche", shortName: "C-Chain", icon: "avax" },
          { id: "usdc_arbitrum", name: "Arbitrum", shortName: "Arbitrum", icon: "arbitrum" },
          { id: "usdc_optimism", name: "Optimism", shortName: "Optimism", icon: "optimism" },
          { id: "usdc_base", name: "Base", shortName: "Base", icon: "base" },
          { id: "usdc_stellar", name: "Stellar", shortName: "Stellar", icon: "stellar" },
        ],
      },
    ],
  },
  {
    label: "Major",
    popular: false,
    coins: [
      { id: "BTC", name: "Bitcoin", symbol: "BTC", icon: "btc", network: "Bitcoin", badge: null },
      { id: "ETH", name: "Ethereum", symbol: "ETH", icon: "eth", network: "ERC-20", badge: "Most Popular" },
      { id: "SOL", name: "Solana", symbol: "SOL", icon: "sol", network: "Solana", badge: null },
      { id: "BNB", name: "BNB", symbol: "BNB", icon: "bnb", network: "BEP-20", badge: null },
    ],
  },
  {
    label: "Altcoins",
    popular: false,
    coins: [
      { id: "MATIC", name: "Polygon", symbol: "MATIC", icon: "matic", network: "Polygon", badge: null },
      { id: "AVAX", name: "Avalanche", symbol: "AVAX", icon: "avax", network: "C-Chain", badge: null },
      { id: "TRX", name: "TRON", symbol: "TRX", icon: "trx", network: "TRC-20", badge: null },
      { id: "TON", name: "Toncoin", symbol: "TON", icon: "ton", network: "TON", badge: null },
      { id: "XRP", name: "XRP", symbol: "XRP", icon: "xrp", network: "XRP Ledger", badge: null },
      { id: "DOGE", name: "Dogecoin", symbol: "DOGE", icon: "doge", network: "Dogecoin", badge: null },
      { id: "LTC", name: "Litecoin", symbol: "LTC", icon: "ltc", network: "Litecoin", badge: null },
      { id: "ADA", name: "Cardano", symbol: "ADA", icon: "ada", network: "Cardano", badge: null },
      { id: "ALGO", name: "Algorand", symbol: "ALGO", icon: "algo", network: "Algorand", badge: null },
    ],
  },
];

const NETWORK_EXPLORERS: Record<string, (addr: string) => string> = {
  BTC: (a) => `https://blockstream.info/address/${a}`,
  ETH: (a) => `https://etherscan.io/address/${a}`,
  SOL: (a) => `https://solscan.io/account/${a}`,
  BNB: (a) => `https://bscscan.com/address/${a}`,
  USDT_ERC20: (a) => `https://etherscan.io/address/${a}`,
  USDC_ERC20: (a) => `https://etherscan.io/address/${a}`,
  USDT_TRC20: (a) => `https://tronscan.org/#/address/${a}`,
  TRX: (a) => `https://tronscan.org/#/address/${a}`,
  USDT_BSC: (a) => `https://bscscan.com/address/${a}`,
  USDC_BSC: (a) => `https://bscscan.com/address/${a}`,
  USDT_SOL: (a) => `https://solscan.io/account/${a}`,
  USDC_SOL: (a) => `https://solscan.io/account/${a}`,
  USDT_POLYGON: (a) => `https://polygonscan.com/address/${a}`,
  USDC_POLYGON: (a) => `https://polygonscan.com/address/${a}`,
  MATIC: (a) => `https://polygonscan.com/address/${a}`,
  USDT_AVAX: (a) => `https://snowtrace.io/address/${a}`,
  USDC_AVAX: (a) => `https://snowtrace.io/address/${a}`,
  AVAX: (a) => `https://snowtrace.io/address/${a}`,
  USDT_ARBITRUM: (a) => `https://arbiscan.io/address/${a}`,
  USDC_ARBITRUM: (a) => `https://arbiscan.io/address/${a}`,
  USDT_OPTIMISM: (a) => `https://optimistic.etherscan.io/address/${a}`,
  USDC_OPTIMISM: (a) => `https://optimistic.etherscan.io/address/${a}`,
  USDT_BASE: (a) => `https://basescan.org/address/${a}`,
  USDC_BASE: (a) => `https://basescan.org/address/${a}`,
  DOGE: (a) => `https://dogechain.info/address/${a}`,
  LTC: (a) => `https://litecoinblockexplorer.net/address/${a}`,
  XRP: (a) => `https://xrpscan.com/account/${a}`,
  TON: (a) => `https://tonscan.org/address/${a}`,
  ADA: (a) => `https://cardanoscan.io/address/${a}`,
  ALGO: (a) => `https://algoexplorer.io/address/${a}`,
  USDC_STELLAR: (a) => `https://stellar.expert/explorer/public/account/${a}`,
};

const QR_SCHEMES: Record<string, (addr: string, amount: number) => string> = {
  BTC: (a, amt) => `bitcoin:${a}?amount=${amt}`,
  ETH: (a, amt) => `ethereum:${a}?amount=${amt}`,
  USDT_ERC20: (a, amt) => `ethereum:${a}?amount=${amt}`,
  USDC_ERC20: (a, amt) => `ethereum:${a}?amount=${amt}`,
  USDT_TRC20: (a, amt) => `tron:${a}?amount=${amt}`,
  TRX: (a, amt) => `tron:${a}?amount=${amt}`,
  USDT_BSC: (a, amt) => `binancecoin:${a}?amount=${amt}`,
  BNB: (a, amt) => `binancecoin:${a}?amount=${amt}`,
  USDT_SOL: (a, amt) => `solana:${a}?amount=${amt}`,
  USDC_SOL: (a, amt) => `solana:${a}?amount=${amt}`,
  SOL: (a, amt) => `solana:${a}?amount=${amt}`,
  XRP: (a, amt) => `ripple:${a}?amount=${amt}&dt=0`,
  ADA: (a, amt) => `cardano:${a}?amount=${amt}`,
};

type CoinEntry = (typeof COIN_CATEGORIES)[number]["coins"][number];
type NetworkEntry = { id: string; name: string; shortName: string; icon: string };

function getWalletAddress(id: string): string {
  const addr = process.env[`NEXT_PUBLIC_CRYPTO_${id.toUpperCase().replace(/-/g, "_")}`];
  if (!addr || addr.startsWith("YOUR_")) return "";
  return addr;
}

function CoinIcon({ icon, color, size = 32 }: { icon: string; color: string; size?: number }) {
  const s = icon.toLowerCase();
  const svgMap: Record<string, string> = {
    trx: `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="16" fill="${color}"/><path d="M16 42V22l16 10L48 22v20l-16-10-16 10z" fill="white"/></svg>`,
    ton: `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="16" fill="${color}"/><path d="M20 44V20h8l16 16 16-16h-8V44h-8V28l-16-16-16 16v16h-8z" fill="white"/></svg>`,
    xrp: `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="16" fill="#23292F"/><path d="M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8zm10.5 35.5c0 2.485-4.5 4.5-10.5 4.5s-10.5-2.015-10.5-4.5v-7c0-2.485 4.5-4.5 10.5-4.5s10.5 2.015 10.5 4.5v7zm0-17c0 2.485-4.5 4.5-10.5 4.5s-10.5-2.015-10.5-4.5v-7c0-2.485 4.5-4.5 10.5-4.5s10.5 2.015 10.5 4.5v7z" fill="white"/></svg>`,
    algo: `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="16" fill="${color}"/><path d="M32 12L52 44H12L32 12Z" fill="white"/><path d="M32 52L12 20H52L32 52Z" fill="white" fillOpacity="0.5"/></svg>`,
    stellar: `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="16" fill="${color}"/><path d="M44 20l-8 12 8 12M20 44l8-12-8-12M32 14c-2 4-6 6-10 6 4 0 8 2 10 6M32 50c2-4 6-6 10-6-4 0-8-2-10-6" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>`,
    polygon: `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="16" fill="${color}"/><path d="M44 24l-8 4v8l8 4M20 24l8 4v8l-8 4M32 32l8-4M32 32l-8-4M32 32v8M32 40l-8-4M32 40l8-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>`,
    arbitrum: `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="16" fill="#28A0F0"/><path d="M32 16l16 8-16 24-16-24 16-8z" fill="white" fillOpacity="0.9"/><path d="M32 32l8 4-8 12-8-12 8-4z" fill="white"/></svg>`,
    optimism: `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="16" fill="#FF0420"/><circle cx="32" cy="32" r="12" fill="white"/></svg>`,
    base: `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="16" fill="#0052FF"/><path d="M40 24H24l8 8-8 8h16l8-8-8-8z" fill="white"/><circle cx="24" cy="24" r="3" fill="white"/><circle cx="40" cy="24" r="3" fill="white"/><circle cx="24" cy="40" r="3" fill="white"/><circle cx="40" cy="40" r="3" fill="white"/></svg>`,
    usdt: `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="16" fill="${color}"/><path d="M37 28c-.6-1-1.7-1.7-3.3-1.7-2.2 0-3.7 1.7-3.7 4.2 0 2.4 1.5 4 3.8 4 1.5 0 2.7-.7 3.2-1.6v-4.6h-3.3v1.4h2v3.3c-.8.7-1.8 1-3 1-2.6 0-4.7-2-4.7-5s2-5 4.7-5c1.4 0 2.4.4 3.2 1.4l-1.2 1.5z" fill="white"/><path d="M27.5 30c-.6-1.2-1.7-2-3.3-2s-2.8.8-3.3 2l-1.2-.5c.7-1.8 2.3-3 4.5-3s3.8 1.2 4.5 3l-1.2.5z" fill="white"/><path d="M27.5 30c-.6-1.2-1.7-2-3.3-2s-2.8.8-3.3 2l-1.2-.5c.7-1.8 2.3-3 4.5-3s3.8 1.2 4.5 3l-1.2.5z" fill="white"/></svg>`,
    usdc: `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="16" fill="${color}"/><circle cx="32" cy="32" r="14" fill="white" fillOpacity="0.2"/><path d="M22 36.5V27.5l6 4.5 6-4.5v9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 32l6-4.5 6 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>`,
  };

  if (svgMap[s]) {
    return <div style={{ width: size, height: size, flexShrink: 0 }} dangerouslySetInnerHTML={{ __html: svgMap[s] }} />;
  }

  return <CoinSvg symbol={s} size={size} />;
}

export default function CheckoutPage() {
  const [selectedCoin, setSelectedCoin] = useState<CoinEntry | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkEntry | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  const [lockedPrice, setLockedPrice] = useState<{
    symbol: string;
    amount: string;
    lockedAt: number;
  } | null>(null);
  const [priceLockCountdown, setPriceLockCountdown] = useState(0);

  const { pricesData, status, timeAgoStr, refreshIn, getAmount, refresh, isLoading } = usePrices();

  useEffect(() => {
    if (!selectedNetwork) return;
    setTimeLeft(30 * 60);
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setSelectedNetwork(null);
          return 30 * 60;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedNetwork]);

  const lockPrice = useCallback(
    (symbol: string) => {
      const amount = getAmount(symbol);
      const locked: typeof lockedPrice = { symbol, amount, lockedAt: Date.now() };
      setLockedPrice(locked);
      setPriceLockCountdown(15 * 60);
      try {
        sessionStorage.setItem("price_lock", JSON.stringify(locked));
      } catch {}
    },
    [getAmount]
  );

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("price_lock");
      if (stored) {
        const parsed = JSON.parse(stored);
        const elapsed = Math.floor((Date.now() - parsed.lockedAt) / 1000);
        const remaining = 15 * 60 - elapsed;
        if (remaining > 0) {
          setLockedPrice(parsed);
          setPriceLockCountdown(remaining);
        } else {
          sessionStorage.removeItem("price_lock");
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (priceLockCountdown <= 0 || !lockedPrice) return;
    const tick = setInterval(() => {
      setPriceLockCountdown((t) => {
        const next = t - 1;
        if (next <= 0) {
          setLockedPrice(null);
          try {
            sessionStorage.removeItem("price_lock");
          } catch {}
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [priceLockCountdown, lockedPrice]);

  const getCryptoAmount = useCallback(
    (symbol: string): string => {
      if (lockedPrice && lockedPrice.symbol === symbol) {
        return lockedPrice.amount;
      }
      return getAmount(symbol);
    },
    [getAmount, lockedPrice]
  );

  const paymentId = selectedNetwork ? selectedNetwork.id : selectedCoin?.id || "";
  const address = paymentId ? getWalletAddress(paymentId) : "";
  const isConfigured = !!address;
  const qrScheme = QR_SCHEMES[paymentId] || ((a: string) => a);
  const qrData = isConfigured ? qrScheme(address, PRICE_IN_USD) : "";
  const explorerUrl =
    isConfigured && NETWORK_EXPLORERS[paymentId] ? NETWORK_EXPLORERS[paymentId](address) : null;

  const coinColor = selectedCoin ? COIN_COLORS[selectedCoin.symbol] || "#666" : "#666";

  useEffect(() => {
    if (!selectedNetwork) return;
    setTimeLeft(30 * 60);
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setSelectedNetwork(null);
          return 30 * 60;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedNetwork]);

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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-5">
        <div className="w-full max-w-md">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 text-center">
            <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                <ShieldCheck className="h-8 w-8 text-emerald-400" />
              </div>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white">Payment Submitted!</h1>
            <p className="mb-2 text-slate-400">Your payment is being verified. Pro access is now active.</p>
            <p className="mb-8 text-xs text-slate-600">Manual verification typically takes 10-30 minutes.</p>
            <div className="space-y-3">
              <Link href="/builder">
                <button className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors">
                  Start Creating Invoices
                </button>
              </Link>
              <Link href="/">
                <button className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors">
                  Back to Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedNetwork) {
    const coinIcon = selectedCoin?.icon || "usdt";
    const color = COIN_COLORS[selectedCoin?.symbol || "USDT"] || "#666";
    const isReady = isConfigured;

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <header className="border-b border-slate-800/50 px-5 py-4">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            <button
              onClick={() => setSelectedNetwork(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-600 text-white text-xs font-bold">I</div>
              <span className="text-sm font-semibold text-white">InvoiceGen</span>
            </div>
            <div className="w-16" />
          </div>
        </header>

        <div className="flex-1 flex items-start justify-center px-5 py-8">
          <div className="w-full max-w-sm">
            <div className="mb-6 flex items-center gap-3">
              <div
                className="relative h-12 w-12 flex items-center justify-center rounded-xl"
                style={{ backgroundColor: `${color}20` }}
              >
                <CoinIcon icon={coinIcon} color={color} size={32} />
                {isReady && (
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  {selectedCoin?.name} ({selectedCoin?.symbol})
                </h1>
                <p className="text-sm text-slate-400">
                  {selectedNetwork.name} · {selectedNetwork.shortName}
                </p>
              </div>
            </div>

            <div className="mb-5 flex items-center justify-between rounded-xl border border-slate-800/50 bg-slate-900/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-slate-400">Complete within</span>
              </div>
              <span
                className={`text-sm font-mono font-bold ${
                  timeLeft < 300 ? "text-red-400" : "text-amber-400"
                }`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>

            {priceLockCountdown > 0 && (
              <div className="mb-4 flex items-center justify-between rounded-xl border border-brand-600/30 bg-brand-600/5 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex h-4 w-4 items-center justify-center">
                    <div className="absolute h-4 w-4 rounded-full bg-brand-500/20 animate-ping" />
                    <CircleDot className="relative h-4 w-4 text-brand-500" />
                  </div>
                  <span className="text-sm text-slate-400">Price locked for</span>
                </div>
                <span className="text-sm font-mono font-bold text-brand-400">
                  {formatTime(priceLockCountdown)}
                </span>
              </div>
            )}

            {priceLockCountdown === 0 && lockedPrice && (
              <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium text-amber-400">Price expired</span>
                </div>
                <button
                  onClick={() => {
                    if (selectedCoin) lockPrice(selectedCoin.symbol);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600/10 px-3 py-2 text-sm font-medium text-brand-400 transition-colors hover:bg-brand-600/20"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Refresh price
                </button>
              </div>
            )}

            <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    status === "live"
                      ? "bg-emerald-400 animate-pulse"
                      : status === "stale"
                      ? "bg-amber-400"
                      : "bg-red-400"
                  }`}
                />
                <span>
                  {status === "live"
                    ? `Live · Updates in ${refreshIn}s`
                    : status === "stale"
                    ? `Updated ${timeAgoStr}`
                    : "Error · Using cached"}
                </span>
              </div>
              <button
                onClick={refresh}
                className="flex items-center gap-1 text-brand-500 hover:text-brand-400 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Refresh
              </button>
            </div>

            {isReady ? (
              <>
                <div className="mb-5 flex flex-col items-center rounded-2xl bg-white p-5">
                  <div className="rounded-xl overflow-hidden">
                    <QRCodeSVG value={qrData} size={180} bgColor="#ffffff" fgColor="#0f172a" level="M" />
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    Scan with your {selectedNetwork.name} wallet
                  </p>
                </div>

                <div className="mb-4 rounded-xl border border-slate-800/50 bg-slate-900/50 p-4">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                    Send exactly
                  </p>
                  <p className="font-mono text-2xl font-bold text-white transition-all duration-300">
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2 text-slate-500">
                        <RefreshCw className="h-5 w-5 animate-spin" /> Fetching price...
                      </span>
                    ) : (
                      getCryptoAmount(paymentId.split("_")[0])
                    )}
                  </p>
                  <p className="text-sm text-slate-400">≈ ${PRICE_IN_USD} USD</p>
                </div>
              </>
            ) : (
              <div className="mb-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                  <AlertTriangle className="h-6 w-6 text-amber-400" />
                </div>
                <p className="font-semibold text-white">Wallet address coming soon</p>
                <p className="mt-1 text-sm text-slate-400">
                  This payment option is being set up. Try another coin or check back soon.
                </p>
                <div className="mt-4">
                  <p className="text-xs text-slate-500">
                    Env var:{" "}
                    <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-slate-300">
                      NEXT_PUBLIC_CRYPTO_{paymentId.toUpperCase().replace(/-/g, "_")}
                    </code>
                  </p>
                </div>
              </div>
            )}

            <div className="mb-4 rounded-xl border border-slate-800/50 bg-slate-900/50 p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                {selectedCoin?.symbol} Address ({selectedNetwork.name})
              </p>
              <div className="flex items-center gap-2">
                <p
                  className={`flex-1 break-all text-sm font-mono text-slate-300 ${
                    !isConfigured ? "italic text-slate-600" : ""
                  }`}
                >
                  {isConfigured ? address : "Address not configured"}
                </p>
                {isConfigured && (
                  <button
                    onClick={handleCopy}
                    className="shrink-0 rounded-lg bg-slate-800 p-2 transition-colors hover:bg-slate-700"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                )}
              </div>
              {explorerUrl && (
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center gap-1 text-xs text-brand-500 hover:text-brand-400 transition-colors"
                >
                  View on explorer <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <p className="text-xs leading-relaxed text-amber-300">
                <strong>
                  Send only on {selectedNetwork.name} ({selectedNetwork.shortName}).
                </strong>{" "}
                {selectedCoin?.symbol.includes("USD")
                  ? "Tokens sent on wrong networks are non-recoverable."
                  : "Double-check the network before sending."}
              </p>
            </div>

            <button
              onClick={handleConfirm}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 px-4 font-semibold text-white transition-all duration-200 hover:bg-emerald-600 active:scale-[0.98]"
            >
              <ShieldCheck className="h-4 w-4" />
              I&apos;ve Sent the Payment
            </button>
            <p className="mt-3 text-center text-xs text-slate-600">
              Manual verification · Usually confirms in 10-30 min
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCoin && "networks" in selectedCoin) {
    const coin = selectedCoin;
    const color = COIN_COLORS[coin.symbol] || "#666";

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <header className="border-b border-slate-800/50 px-5 py-4">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            <button
              onClick={() => setSelectedCoin(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-600 text-white text-xs font-bold">I</div>
              <span className="text-sm font-semibold text-white">InvoiceGen</span>
            </div>
            <div className="w-16" />
          </div>
        </header>

        <div className="flex-1 flex items-start justify-center px-5 py-8">
          <div className="w-full max-w-lg">
            <div className="mb-6 flex items-center gap-3">
              <div
                className="relative h-12 w-12 flex items-center justify-center rounded-xl"
                style={{ backgroundColor: `${color}20` }}
              >
                <CoinIcon icon={coin.icon} color={color} size={32} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  {coin.name} ({coin.symbol})
                </h1>
                <p className="text-sm text-slate-400">Select a network to continue</p>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {coin.networks.map((net, i) => {
                const addr = getWalletAddress(net.id);
                const configured = !!addr;
                const netColor = COIN_COLORS[net.icon.toUpperCase()] || "#666";
                return (
                  <button
                    key={net.id}
                    onClick={() => setSelectedNetwork(net)}
                    className="group relative rounded-xl border border-slate-800/50 bg-slate-900/50 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700"
                    style={{
                      boxShadow: "none",
                      transition: "all 200ms ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${netColor}40, 0 8px 16px rgba(0,0,0,0.3)`;
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px) scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                      (e.currentTarget as HTMLElement).style.transform = "";
                    }}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-lg overflow-hidden"
                        style={{ backgroundColor: `${netColor}20` }}
                      >
                        <CoinIcon icon={net.icon} color={netColor} size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{net.name}</p>
                        <p className="font-mono text-2xs text-slate-500">{net.shortName}</p>
                      </div>
                    </div>
                    <span
                      className={`text-2xs inline-flex items-center gap-1 font-medium rounded px-1.5 py-0.5 ${
                        configured
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {configured ? (
                        <>
                          <Check className="h-2.5 w-2.5" /> Ready
                        </>
                      ) : (
                        <>
                          <Clock3 className="h-2.5 w-2.5" /> Coming soon
                        </>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <p className="text-xs leading-relaxed text-amber-300">
                Make sure you send on the correct network.{" "}
                <strong>{coin.symbol} sent on the wrong network cannot be recovered.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-950">
      <style>{`
        @keyframes coinEntrance {
          from { opacity: 0; transform: translateY(16px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px var(--glow-color, #666), 0 0 40px var(--glow-color, #666); }
          50%       { box-shadow: 0 0 30px var(--glow-color, #666), 0 0 60px var(--glow-color, #666); }
        }
        @keyframes sparkle {
          0%   { transform: scale(0) rotate(0deg); opacity: 1; }
          100% { transform: scale(1.5) rotate(180deg); opacity: 0; }
        }
        .coin-card:hover { transform: translateY(-2px) scale(1.05); }
        .coin-card.selected-card { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>

      <header className="border-b border-slate-800/50 px-5 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white text-sm font-bold">
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
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-600/20 bg-brand-600/10">
            <Coins className="h-7 w-7 text-brand-500" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">Select Payment Method</h1>
          <p className="text-slate-400">
            Choose a cryptocurrency to complete your ${PRICE_IN_USD} USD purchase
          </p>
        </div>

        {COIN_CATEGORIES.map((category, catIdx) => (
          <div key={category.label} className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                {category.label}
              </h2>
              {category.popular && (
                <span className="inline-flex items-center gap-1 rounded-full border border-brand-600/20 bg-brand-600/10 px-2 py-0.5 text-2xs font-medium text-brand-500">
                  <Zap className="h-2.5 w-2.5" /> Popular
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {category.coins.map((coin, coinIdx) => {
                const color = COIN_COLORS[coin.symbol] || "#666";
                const isSelected = selectedCoin?.id === coin.id;
                const isMulti = "networks" in coin;
                const networkCount = isMulti ? coin.networks.length : 1;
                const hasPrice = !!(pricesData?.prices?.[coin.symbol]);
                const displayAmount = getCryptoAmount(coin.symbol);

                return (
                  <button
                    key={coin.id}
                    onClick={() => {
                      setSelectedCoin(coin);
                      lockPrice(coin.symbol);
                    }}
                    className="coin-card group relative rounded-xl border border-slate-800/50 bg-slate-900/50 p-4 text-left transition-all duration-200"
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 15px ${color}40, 0 8px 16px rgba(0,0,0,0.3)`;
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px) scale(1.03)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.boxShadow = "none";
                        (e.currentTarget as HTMLElement).style.transform = "";
                      }
                    }}
                    style={{
                      animation: `coinEntrance 400ms ease both`,
                      animationDelay: `${(catIdx * 5 + coinIdx) * 50}ms`,
                      ...(isSelected
                        ? ({
                            "--glow-color": color,
                            borderColor: `${color}80`,
                            boxShadow: `0 0 20px ${color}40, 0 0 40px ${color}20, 0 12px 24px rgba(0,0,0,0.4)`,
                            transform: "scale(1.05)",
                          } as React.CSSProperties)
                        : {}),
                    }}
                  >
                    {isSelected && (
                      <>
                        <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 shadow-lg">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        {[...Array(3)].map((_, si) => (
                          <div
                            key={si}
                            className="absolute pointer-events-none rounded-full"
                            style={{
                              inset: 0,
                              background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
                              animation: `sparkle ${1.5 + si * 0.3}s ease-out ${si * 0.2}s infinite`,
                            }}
                          />
                        ))}
                      </>
                    )}

                    {coin.badge && !isSelected && (
                      <span className="absolute -top-2 -right-2 rounded-full bg-amber-500 px-1.5 py-0.5 text-2xs font-medium text-white shadow">
                        {coin.badge}
                      </span>
                    )}

                    <div className="mb-2 flex items-center gap-2.5">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <CoinIcon icon={coin.icon} color={color} size={24} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-sm font-semibold text-white">{coin.symbol}</p>
                          {isMulti && (
                            <ChevronRight className="h-3 w-3 shrink-0 text-slate-600 group-hover:text-slate-400 transition-colors" />
                          )}
                        </div>
                        <p className="truncate text-2xs text-slate-500">{coin.name}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {isLoading ? (
                        <span className="inline-flex items-center gap-1 font-mono text-2xs text-slate-500">
                          <RefreshCw className="h-2.5 w-2.5 animate-spin" /> Loading...
                        </span>
                      ) : hasPrice ? (
                        <div className="flex items-center gap-1">
                          <div
                            className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                              status === "live"
                                ? "bg-emerald-400 animate-pulse"
                                : status === "stale"
                                ? "bg-amber-400"
                                : "bg-red-400"
                            }`}
                          />
                          <span className="font-mono text-2xs font-medium text-slate-300">
                            {displayAmount}
                          </span>
                        </div>
                      ) : (
                        <p className="font-mono text-2xs text-slate-500">
                          ${PRICE_IN_USD} USD
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        {isMulti ? (
                          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-2xs text-slate-400">
                            {networkCount} networks
                          </span>
                        ) : (
                          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-2xs text-slate-400">
                            {(coin as { network?: string }).network || ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mt-10 flex items-start gap-3 rounded-xl border border-slate-800/50 bg-slate-900/50 p-5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
          <div>
            <p className="mb-1 font-medium text-white">Manual confirmation — no account needed</p>
            <p className="text-sm leading-relaxed text-slate-400">
              Send any amount to the address shown after selecting a coin and network. Click &ldquo;I&apos;ve Sent
              the Payment&rdquo; to instantly unlock Pro. Fast, private, no intermediaries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
