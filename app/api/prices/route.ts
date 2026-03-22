import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";

const COINGECKO_IDS = [
  "bitcoin",
  "ethereum",
  "solana",
  "binancecoin",
  "matic-network",
  "avalanche-2",
  "tron",
  "the-open-network",
  "ripple",
  "dogecoin",
  "litecoin",
  "cardano",
  "algorand",
];

const SYMBOL_TO_ID: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  BNB: "binancecoin",
  MATIC: "matic-network",
  AVAX: "avalanche-2",
  TRX: "tron",
  TON: "the-open-network",
  XRP: "ripple",
  DOGE: "dogecoin",
  LTC: "litecoin",
  ADA: "cardano",
  ALGO: "algorand",
  USDT: "tether",
  USDC: "usd-coin",
};

const CACHE_TTL = 30;

interface CoinGeckoResponse {
  [key: string]: { usd: number };
}

interface PricesResponse {
  prices: Record<string, number>;
  fetchedAt: number;
  cached: boolean;
}

function getDecimals(symbol: string): number {
  const btcLike = ["BTC"];
  const ethLike = ["ETH", "SOL", "AVAX", "MATIC"];
  if (btcLike.includes(symbol)) return 8;
  if (ethLike.includes(symbol)) return 6;
  return 2;
}

export async function GET() {
  const cacheKey = "prices:coingecko";

  try {
    const cached = await redis.get<PricesResponse>(cacheKey);

    if (cached && cached.prices && cached.prices.BTC) {
      return NextResponse.json(
        { ...cached, cached: true },
        {
          headers: {
            "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
          },
        }
      );
    }

    const ids = COINGECKO_IDS.join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;

    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`CoinGecko API returned ${res.status}`);
    }

    const data: CoinGeckoResponse = await res.json();

    const prices: Record<string, number> = {};

    for (const [symbol, id] of Object.entries(SYMBOL_TO_ID)) {
      if (symbol === "USDT" || symbol === "USDC") {
        prices[symbol] = 1;
      } else {
        const coinData = data[id];
        prices[symbol] = coinData?.usd ?? 0;
      }
    }

    const payload: PricesResponse = {
      prices,
      fetchedAt: Date.now(),
      cached: false,
    };

    await redis.set(cacheKey, payload, { ex: CACHE_TTL * 2 });

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (err) {
    console.error("Price fetch error:", err);

    try {
      const cached = await redis.get<PricesResponse>(cacheKey);
      if (cached && cached.prices && cached.prices.BTC) {
        return NextResponse.json(
          { ...cached, cached: true, error: "Using cached prices" },
          { status: 200 }
        );
      }
    } catch {
      // fall through
    }

    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
