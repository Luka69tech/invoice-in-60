import { NextResponse } from "next/server";
import { checkRateLimit, buildRateLimitHeaders } from "@/lib/security/rate-limit";
import { NextRequest } from "next/server";

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

export async function GET(req: NextRequest) {
  const rl = checkRateLimit(req, { maxRequests: 60, windowMs: 60_000, keyPrefix: "prices" });

  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before trying again." },
      { status: 429, headers: buildRateLimitHeaders(rl) }
    );
  }

  try {
    const ids = COINGECKO_IDS.join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;

    const res = await fetch(url, {
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      throw new Error(`CoinGecko API returned ${res.status}`);
    }

    const data = await res.json();

    const prices: Record<string, number> = {};

    for (const [symbol, id] of Object.entries(SYMBOL_TO_ID)) {
      if (symbol === "USDT" || symbol === "USDC") {
        prices[symbol] = 1;
      } else if (data[id]) {
        prices[symbol] = data[id].usd ?? 0;
      } else {
        prices[symbol] = 0;
      }
    }

    const headers = {
      ...buildRateLimitHeaders(rl),
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
    };

    return NextResponse.json(
      { prices, fetchedAt: Date.now() },
      { headers }
    );
  } catch (err) {
    console.error("Price fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500, headers: buildRateLimitHeaders(rl) }
    );
  }
}
