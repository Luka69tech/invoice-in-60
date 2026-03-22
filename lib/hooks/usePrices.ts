"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface PricesData {
  prices: Record<string, number>;
  fetchedAt: number;
  cached: boolean;
  error?: string;
}

export type PriceStatus = "loading" | "live" | "stale" | "error";

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

export function usePrices(enabled = true) {
  const [pricesData, setPricesData] = useState<PricesData | null>(null);
  const [status, setStatus] = useState<PriceStatus>("loading");
  const [timeAgoStr, setTimeAgoStr] = useState("—");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const refreshCountdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [refreshIn, setRefreshIn] = useState(30);
  const fetchedAtRef = useRef<number>(0);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);

  const fetchPrices = useCallback(async (isRetry = false) => {
    if (!enabled) return;
    try {
      const res = await fetch("/api/prices", { signal: AbortSignal.timeout(8000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: PricesData = await res.json();

      setPricesData(data);
      fetchedAtRef.current = data.fetchedAt;
      retryCountRef.current = 0;

      const age = (Date.now() - data.fetchedAt) / 1000;
      if (data.cached || age > 60) {
        setStatus("stale");
      } else if (data.error) {
        setStatus("error");
      } else {
        setStatus("live");
      }
    } catch {
      retryCountRef.current++;
      if (retryCountRef.current >= 3) {
        setStatus("error");
        setPricesData((prev) =>
          prev
            ? { ...prev, error: "Price fetch failed", cached: true }
            : null
        );
      } else if (!isRetry) {
        retryRef.current = setTimeout(() => fetchPrices(true), 2000);
      }
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    fetchPrices();

    refreshCountdownRef.current = setInterval(() => {
      setRefreshIn((prev) => {
        if (prev <= 1) return 30;
        return prev - 1;
      });
    }, 1000);

    intervalRef.current = setInterval(() => {
      fetchPrices();
      setRefreshIn(30);
    }, 30000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (refreshCountdownRef.current) clearInterval(refreshCountdownRef.current);
      if (retryRef.current) clearTimeout(retryRef.current);
    };
  }, [enabled, fetchPrices]);

  useEffect(() => {
    if (!pricesData?.fetchedAt) return;
    const tick = setInterval(() => {
      setTimeAgoStr(timeAgo(pricesData.fetchedAt));
      const age = (Date.now() - pricesData.fetchedAt) / 1000;
      if (pricesData.cached || age > 60) {
        setStatus("stale");
      } else if (!pricesData.error) {
        setStatus("live");
      }
    }, 1000);
    setTimeAgoStr(timeAgo(pricesData.fetchedAt));
    return () => clearInterval(tick);
  }, [pricesData?.fetchedAt, pricesData?.cached, pricesData?.error]);

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

  const refresh = useCallback(() => {
    setRefreshIn(30);
    fetchPrices();
  }, [fetchPrices]);

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

const PRICE_IN_USD = 29;
