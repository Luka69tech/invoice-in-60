"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface PricesData {
  prices: Record<string, number>;
  fetchedAt: number;
}

export type PriceStatus = "loading" | "live" | "stale" | "error";

const PRICE_IN_USD = 29;

const DIRECT_FALLBACK_IDS = [
  ["BTC", "bitcoin"],
  ["ETH", "ethereum"],
  ["SOL", "solana"],
  ["BNB", "binancecoin"],
  ["MATIC", "matic-network"],
  ["AVAX", "avalanche-2"],
  ["TRX", "tron"],
  ["TON", "the-open-network"],
  ["XRP", "ripple"],
  ["DOGE", "dogecoin"],
  ["LTC", "litecoin"],
  ["ADA", "cardano"],
  ["ALGO", "algorand"],
];

function getDecimals(symbol: string): number {
  if (symbol === "BTC") return 8;
  if (["ETH", "SOL", "AVAX", "MATIC", "LTC"].includes(symbol)) return 6;
  return 2;
}

export function formatCryptoAmount(amount: number, symbol: string): string {
  if (amount === 0) return "—";
  const decimals = getDecimals(symbol);
  if (amount < 0.000001) return `${amount.toExponential(2)} ${symbol}`;
  return `${amount.toFixed(decimals)} ${symbol}`;
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
}

async function fetchPricesDirect(): Promise<PricesData> {
  const ids = DIRECT_FALLBACK_IDS.map(([, id]) => id).join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;

  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json();
  const prices: Record<string, number> = {};

  for (const [symbol, id] of DIRECT_FALLBACK_IDS) {
    if (symbol === "USDT" || symbol === "USDC") {
      prices[symbol] = 1;
    } else if (data[id]) {
      prices[symbol] = data[id].usd ?? 0;
    } else {
      prices[symbol] = 0;
    }
  }

  return { prices, fetchedAt: Date.now() };
}

export function usePrices(enabled = true) {
  const [pricesData, setPricesData] = useState<PricesData | null>(null);
  const [status, setStatus] = useState<PriceStatus>("loading");
  const [timeAgoStr, setTimeAgoStr] = useState("—");
  const [refreshIn, setRefreshIn] = useState(30);
  const fetchedAtRef = useRef<number>(0);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const setPrices = useCallback((data: PricesData) => {
    setPricesData(data);
    fetchedAtRef.current = data.fetchedAt;
    retryCountRef.current = 0;
    setStatus("live");
  }, []);

  const fetchFromRoute = useCallback(async () => {
    try {
      const res = await fetch("/api/prices", { signal: AbortSignal.timeout(8000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: PricesData = await res.json();
      if (!data.prices || !data.fetchedAt) throw new Error("Invalid response");
      setPrices(data);
      return true;
    } catch {
      return false;
    }
  }, [setPrices]);

  const fetchFallback = useCallback(async () => {
    try {
      const data = await fetchPricesDirect();
      setPrices(data);
      return true;
    } catch {
      return false;
    }
  }, [setPrices]);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    retryCountRef.current = 0;
    setRefreshIn(30);

    const ok = await fetchFromRoute();
    if (!ok) {
      const fallbackOk = await fetchFallback();
      if (!fallbackOk) {
        retryCountRef.current++;
        if (retryCountRef.current < 3) {
          retryTimerRef.current = setTimeout(refresh, 3000);
        } else {
          setStatus("error");
        }
      }
    }
  }, [enabled, fetchFromRoute, fetchFallback]);

  useEffect(() => {
    if (!enabled) return;

    refresh();

    countdownRef.current = setInterval(() => {
      setRefreshIn((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);

    intervalRef.current = setInterval(() => {
      refresh();
    }, 30000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, [enabled, refresh]);

  useEffect(() => {
    if (!pricesData?.fetchedAt) return;
    const tick = setInterval(() => {
      setTimeAgoStr(timeAgo(pricesData.fetchedAt));
      const age = (Date.now() - pricesData.fetchedAt) / 1000;
      if (age > 60 && status === "live") {
        setStatus("stale");
      }
    }, 1000);
    setTimeAgoStr(timeAgo(pricesData.fetchedAt));
    return () => clearInterval(tick);
  }, [pricesData?.fetchedAt, status]);

  const getAmount = useCallback(
    (symbol: string): string => {
      if (!pricesData?.prices) return `${PRICE_IN_USD} ${symbol}`;
      const price = pricesData.prices[symbol];
      if (!price || price === 0) return `${PRICE_IN_USD} ${symbol}`;
      const amount = PRICE_IN_USD / price;
      return formatCryptoAmount(amount, symbol);
    },
    [pricesData]
  );

  return {
    pricesData,
    status,
    timeAgoStr,
    refreshIn,
    getAmount,
    refresh,
    isLoading: status === "loading",
  };
}
