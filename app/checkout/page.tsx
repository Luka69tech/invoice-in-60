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
  ChevronRight,
} from "lucide-react";

const PRICE_IN_USD = 29;

function CoinIcon({ icon, size = 24 }: { icon: string; size?: number }) {
  if (icon === "ton") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <rect width="64" height="64" rx="16" fill="#0098EA"/>
        <path d="M20 44V20h8l16 16 16-16h-8V44h-8V28l-16-16-16 16v16h-8z" fill="white"/>
      </svg>
    );
  }
  if (icon === "xrp") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <rect width="64" height="64" rx="16" fill="#23292F"/>
        <path d="M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8zm10.5 35.5c0 2.485-4.5 4.5-10.5 4.5s-10.5-2.015-10.5-4.5v-7c0-2.485 4.5-4.5 10.5-4.5s10.5 2.015 10.5 4.5v7zm0-17c0 2.485-4.5 4.5-10.5 4.5s-10.5-2.015-10.5-4.5v-7c0-2.485 4.5-4.5 10.5-4.5s10.5 2.015 10.5 4.5v7z" fill="white"/>
      </svg>
    );
  }
  if (icon === "algo") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <rect width="64" height="64" rx="16" fill="#000"/>
        <path d="M32 12L52 44H12L32 12Z" fill="white"/>
        <path d="M32 52L12 20H52L32 52Z" fill="white" fillOpacity="0.5"/>
      </svg>
    );
  }
  if (icon === "stellar") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <rect width="64" height="64" rx="16" fill="#14B8E6"/>
        <path d="M44 20l-8 12 8 12M20 44l8-12-8-12M32 14c-2 4-6 6-10 6 4 0 8 2 10 6M32 50c2-4 6-6 10-6-4 0-8-2-10-6" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    );
  }
  if (icon === "polygon") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <rect width="64" height="64" rx="16" fill="#8247E5"/>
        <path d="M44 24l-8 4v8l8 4M20 24l8 4v8l-8 4M32 32l8-4M32 32l-8-4M32 32v8M32 40l-8-4M32 40l8-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (icon === "arbitrum") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <rect width="64" height="64" rx="16" fill="#28A0F0"/>
        <path d="M32 16l16 8-16 24-16-24 16-8z" fill="white" fillOpacity="0.9"/>
        <path d="M32 32l8 4-8 12-8-12 8-4z" fill="white"/>
      </svg>
    );
  }
  if (icon === "optimism") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <rect width="64" height="64" rx="16" fill="#FF0420"/>
        <circle cx="32" cy="32" r="12" fill="white"/>
      </svg>
    );
  }
  if (icon === "base") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <rect width="64" height="64" rx="16" fill="#0052FF"/>
        <path d="M40 24H24l8 8-8 8h16l8-8-8-8z" fill="white"/>
        <circle cx="24" cy="24" r="3" fill="white"/>
        <circle cx="40" cy="24" r="3" fill="white"/>
        <circle cx="24" cy="40" r="3" fill="white"/>
        <circle cx="40" cy="40" r="3" fill="white"/>
      </svg>
    );
  }
  if (icon === "usdt") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <rect width="64" height="64" rx="16" fill="#26A17B"/>
        <path d="M42 18H22c-1.1 0-2 .9-2 2v24c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V20c0-1.1-.9-2-2-2z" fill="white" fillOpacity="0.15"/>
        <path d="M37 28c-.6-1-1.7-1.7-3.3-1.7-2.2 0-3.7 1.7-3.7 4.2 0 2.4 1.5 4 3.8 4 1.5 0 2.7-.7 3.2-1.6v-4.6h-3.3v1.4h2v3.3c-.8.7-1.8 1-3 1-2.6 0-4.7-2-4.7-5s2-5 4.7-5c1.4 0 2.4.4 3.2 1.4l-1.2 1.5z" fill="white"/>
        <path d="M27.5 30c-.6-1.2-1.7-2-3.3-2s-2.8.8-3.3 2l-1.2-.5c.7-1.8 2.3-3 4.5-3s3.8 1.2 4.5 3l-1.2.5zm8 4h-3.3V23.5h3.3V34zm4 0h-3.3V27h3.3V34z" fill="white"/>
      </svg>
    );
  }
  if (icon === "usdc") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <rect width="64" height="64" rx="16" fill="#2775CA"/>
        <circle cx="32" cy="32" r="14" fill="white" fillOpacity="0.2"/>
        <path d="M22 36.5V27.5l6 4.5 6-4.5v9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 32l6-4.5 6 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  return (
    <Icon icon={`cryptocurrency:${icon}`} style={{ width: size, height: size }} />
  );
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
  stellar: "#14B8E6",
  polygon: "#8247E5",
  arbitrum: "#28A0F0",
  optimism: "#FF0420",
  base: "#0052FF",
};

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
      { id: "BTC", name: "Bitcoin", symbol: "BTC", icon: "btc", network: "Bitcoin" },
      { id: "ETH", name: "Ethereum", symbol: "ETH", icon: "eth", network: "ERC-20" },
      { id: "SOL", name: "Solana", symbol: "SOL", icon: "sol", network: "Solana" },
      { id: "BNB", name: "BNB", symbol: "BNB", icon: "bnb", network: "BEP-20" },
    ],
  },
  {
    label: "Altcoins",
    popular: false,
    coins: [
      { id: "MATIC", name: "Polygon", symbol: "MATIC", icon: "matic", network: "Polygon" },
      { id: "AVAX", name: "Avalanche", symbol: "AVAX", icon: "avax", network: "C-Chain" },
      { id: "TRX", name: "TRON", symbol: "TRX", icon: "trx", network: "TRC-20" },
      { id: "TON", name: "Toncoin", symbol: "TON", icon: "ton", network: "TON" },
      { id: "XRP", name: "XRP", symbol: "XRP", icon: "xrp", network: "XRP Ledger" },
      { id: "DOGE", name: "Dogecoin", symbol: "DOGE", icon: "doge", network: "Dogecoin" },
      { id: "LTC", name: "Litecoin", symbol: "LTC", icon: "ltc", network: "Litecoin" },
      { id: "ADA", name: "Cardano", symbol: "ADA", icon: "ada", network: "Cardano" },
      { id: "ALGO", name: "Algorand", symbol: "ALGO", icon: "algo", network: "Algorand" },
    ],
  },
];

const STATIC_PRICES: Record<string, number> = {
  BTC: 0.00055,
  ETH: 0.011,
  SOL: 0.18,
  BNB: 0.09,
  USDT_TRC20: 29.0,
  USDT_ERC20: 29.1,
  USDT_BSC: 29.0,
  USDT_SOL: 29.0,
  USDT_POLYGON: 29.0,
  USDT_AVAX: 29.0,
  USDT_ARBITRUM: 29.0,
  USDT_OPTIMISM: 29.0,
  USDT_BASE: 29.0,
  USDC_ERC20: 29.0,
  USDC_SOL: 29.0,
  USDC_BSC: 29.0,
  USDC_POLYGON: 29.0,
  USDC_AVAX: 29.0,
  USDC_ARBITRUM: 29.0,
  USDC_OPTIMISM: 29.0,
  USDC_BASE: 29.0,
  USDC_STELLAR: 29.0,
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

function getCryptoAmount(id: string): string {
  const symbol = id.split("_")[0];
  const upperId = id.toUpperCase().replace(/-/g, "_");
  const price = STATIC_PRICES[upperId];
  if (!price) return "—";
  if (price < 0.001) return `${price.toFixed(8)} ${symbol}`;
  if (price < 1) return `${price.toFixed(6)} ${symbol}`;
  if (price < 100) return `${price.toFixed(4)} ${symbol}`;
  return `${price.toFixed(2)} ${symbol}`;
}

export default function CheckoutPage() {
  const [selectedCoin, setSelectedCoin] = useState<CoinEntry | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkEntry | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  const paymentId = selectedNetwork ? selectedNetwork.id : selectedCoin?.id || "";
  const address = paymentId ? getWalletAddress(paymentId) : "";
  const isConfigured = !!address;
  const price = STATIC_PRICES[paymentId.toUpperCase().replace(/-/g, "_")] || 0;
  const qrScheme = QR_SCHEMES[paymentId] || ((a: string) => a);
  const qrData = isConfigured ? qrScheme(address, price) : "";
  const explorerUrl = isConfigured && NETWORK_EXPLORERS[paymentId]
    ? NETWORK_EXPLORERS[paymentId](address)
    : null;

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

  const getCoinConfiguredCount = (coin: CoinEntry) => {
    if ("networks" in coin) {
      return coin.networks.filter((n) => getWalletAddress(n.id)).length;
    }
    return getWalletAddress(coin.id) ? 1 : 0;
  };

  const getCoinTotal = (coin: CoinEntry) => {
    return "networks" in coin ? coin.networks.length : 1;
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-5">
        <div className="w-full max-w-md">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <ShieldCheck className="h-8 w-8 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Payment Submitted!</h1>
            <p className="text-slate-400 mb-2">Your payment is being verified. Pro access is now active.</p>
            <p className="text-xs text-slate-600 mb-8">Manual verification typically takes 10-30 minutes.</p>
            <div className="space-y-3">
              <Link href="/builder">
                <button className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors">
                  Start Creating Invoices
                </button>
              </Link>
              <Link href="/">
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

  if (selectedNetwork) {
    const coinIcon = selectedCoin?.icon || "usdt";
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <header className="border-b border-slate-800 px-5 py-4">
          <div className="mx-auto max-w-lg flex items-center justify-between">
            <button onClick={() => setSelectedNetwork(null)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" /><span className="text-sm font-medium">Back</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-brand-600 flex items-center justify-center text-white text-xs font-bold">I</div>
              <span className="font-semibold text-white text-sm">InvoiceGen</span>
            </div>
            <div className="w-16" />
          </div>
        </header>
        <div className="flex-1 flex items-start justify-center px-5 py-8">
          <div className="w-full max-w-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl overflow-hidden flex items-center justify-center" style={{ backgroundColor: `${ICON_COLORS[coinIcon]}20` }}>
                <CoinIcon icon={coinIcon} size={32} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">{selectedCoin?.name} ({selectedCoin?.symbol})</h1>
                <p className="text-sm text-slate-400">{selectedNetwork.name} · {selectedNetwork.shortName}</p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-slate-400">Complete within</span>
              </div>
              <span className={`text-sm font-mono font-bold ${timeLeft < 300 ? "text-red-400" : "text-amber-400"}`}>
                {formatTime(timeLeft)}
              </span>
            </div>

            <div className="bg-white rounded-2xl p-5 flex flex-col items-center mb-5">
              {!isConfigured ? (
                <div className="py-8 text-center">
                  <AlertTriangle className="h-8 w-8 text-amber-400 mx-auto mb-3" />
                  <p className="font-medium text-slate-900">Address not configured</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Add <code className="bg-slate-100 rounded px-1.5 py-0.5">NEXT_PUBLIC_CRYPTO_{paymentId.toUpperCase().replace(/-/g, "_")}</code> to your .env
                  </p>
                </div>
              ) : (
                <>
                  <div className="rounded-xl overflow-hidden">
                    <QRCodeSVG value={qrData} size={180} bgColor="#ffffff" fgColor="#0f172a" level="M" />
                  </div>
                  <p className="mt-3 text-xs text-slate-500">Scan with your {selectedNetwork.name} wallet</p>
                </>
              )}
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-4">
              <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-medium">Send exactly</p>
              <p className="text-2xl font-bold font-mono text-white">{isConfigured ? getCryptoAmount(paymentId) : "—"}</p>
              <p className="text-sm text-slate-400">≈ ${PRICE_IN_USD} USD</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-4">
              <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-medium">{selectedCoin?.symbol} Address ({selectedNetwork.name})</p>
              <div className="flex items-center gap-2">
                <p className={`text-sm font-mono break-all text-slate-300 flex-1 ${!isConfigured ? "italic text-slate-600" : ""}`}>
                  {isConfigured ? address : "Configure wallet address in .env"}
                </p>
                {isConfigured && (
                  <button onClick={handleCopy} className="shrink-0 p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors">
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-slate-400" />}
                  </button>
                )}
              </div>
              {explorerUrl && (
                <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-1 text-xs text-brand-500 hover:text-brand-400 transition-colors">
                  View on explorer <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-5 flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-300 leading-relaxed">
                <strong>Send only on {selectedNetwork.name} ({selectedNetwork.shortName}).</strong>{" "}
                {selectedCoin?.symbol.includes("USD") ? "Tokens sent on wrong networks are non-recoverable." : "Double-check the network before sending."}
              </p>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!isConfigured}
              className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="h-4 w-4" />
              I&apos;ve Sent the Payment
            </button>
            <p className="text-center text-xs text-slate-600 mt-3">Manual verification · Usually confirms in 10-30 min</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCoin && "networks" in selectedCoin) {
    const coin = selectedCoin;
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <header className="border-b border-slate-800 px-5 py-4">
          <div className="mx-auto max-w-lg flex items-center justify-between">
            <button onClick={() => setSelectedCoin(null)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" /><span className="text-sm font-medium">Back</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-brand-600 flex items-center justify-center text-white text-xs font-bold">I</div>
              <span className="font-semibold text-white text-sm">InvoiceGen</span>
            </div>
            <div className="w-16" />
          </div>
        </header>
        <div className="flex-1 flex items-start justify-center px-5 py-8">
          <div className="w-full max-w-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl overflow-hidden flex items-center justify-center" style={{ backgroundColor: `${ICON_COLORS[coin.icon]}20` }}>
                <CoinIcon icon={coin.icon} size={32} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">{coin.name} ({coin.symbol})</h1>
                <p className="text-sm text-slate-400">Select a network to continue</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {coin.networks.map((net) => {
                const addr = getWalletAddress(net.id);
                const configured = !!addr;
                return (
                  <button
                    key={net.id}
                    onClick={() => setSelectedNetwork(net)}
                    className="group bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 rounded-xl p-4 text-left transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-7 w-7 rounded-lg overflow-hidden flex items-center justify-center" style={{ backgroundColor: `${ICON_COLORS[net.icon] || "#666"}20` }}>
                        <CoinIcon icon={net.icon} size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{net.name}</p>
                        <p className="text-2xs text-slate-500 font-mono">{net.shortName}</p>
                      </div>
                    </div>
                    <span className={`text-2xs font-medium px-1.5 py-0.5 rounded ${configured ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-700 text-slate-500"}`}>
                      {configured ? "Ready" : "Setup required"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-300 leading-relaxed">
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
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-800 px-5 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center text-white text-sm font-bold">I</div>
            <span className="font-bold text-white">InvoiceGen</span>
          </Link>
          <Link href="/builder" className="text-sm text-slate-400 hover:text-white transition-colors">Try free →</Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-10">
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-brand-600/10 border border-brand-600/20 flex items-center justify-center">
            <Coins className="h-7 w-7 text-brand-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Select Payment Method</h1>
          <p className="text-slate-400">Choose a cryptocurrency to complete your $29 USD purchase</p>
        </div>

        {COIN_CATEGORIES.map((category) => (
          <div key={category.label} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{category.label}</h2>
              {category.popular && (
                <span className="inline-flex items-center gap-1 text-2xs font-medium bg-brand-600/10 text-brand-500 border border-brand-600/20 rounded-full px-2 py-0.5">
                  <Zap className="h-2.5 w-2.5" /> Popular
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {category.coins.map((coin) => {
                const cfgCount = getCoinConfiguredCount(coin);
                const total = getCoinTotal(coin);
                const allReady = cfgCount === total;
                const isMulti = "networks" in coin;
                return (
                  <button
                    key={coin.id}
                    onClick={() => setSelectedCoin(coin)}
                    className="group relative bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 rounded-xl p-4 text-left transition-all duration-200 hover:shadow-lg hover:shadow-brand-900/20 hover:-translate-y-0.5"
                  >
                    {"popular" in coin && coin.popular && (
                      <span className="absolute -top-2 -right-2 text-2xs font-medium bg-brand-500 text-white rounded-full px-1.5 py-0.5">Popular</span>
                    )}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-9 w-9 rounded-lg overflow-hidden flex items-center justify-center" style={{ backgroundColor: `${ICON_COLORS[coin.icon] || "#666"}20` }}>
                        <CoinIcon icon={coin.icon} size={24} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{coin.symbol}</p>
                        <p className="text-2xs text-slate-500 truncate">{coin.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-2xs font-medium px-1.5 py-0.5 rounded ${allReady ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : cfgCount > 0 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-slate-700 text-slate-500"}`}>
                        {cfgCount}/{total} ready
                      </span>
                      {isMulti && <ChevronRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-brand-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-white mb-1">Manual confirmation — no account needed</p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Send any amount to the address shown after selecting a coin and network. Click &ldquo;I&apos;ve Sent the Payment&rdquo; to instantly unlock Pro. Fast, private, no intermediaries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
