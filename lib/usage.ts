import { redis } from "@/lib/redis";

const FREE_INVOICE_LIMIT = 3;
const HOURLY_RATE_LIMIT = 3;
const USAGE_TTL = 30 * 24 * 60 * 60;
const HOURLY_TTL = 60 * 60;

interface UsageRecord {
  count: number;
  firstSeen: number;
}

interface RateLimitRecord {
  count: number;
  windowStart: number;
}

export interface UsageCheckResult {
  allowed: boolean;
  reason?: "limit_reached" | "rate_limited" | "server_error";
  usedCount: number;
  limit: number;
  remaining: number;
  upgradeRequired: boolean;
}

function usageKey(fp: string): string {
  return `usage:${fp}`;
}

function hourlyKey(fp: string): string {
  return `hourly:${fp}`;
}

function parseUsage(raw: unknown): UsageRecord {
  if (typeof raw === "object" && raw !== null && "count" in raw && "firstSeen" in raw) {
    return raw as UsageRecord;
  }
  return { count: 0, firstSeen: Date.now() };
}

function parseHourly(raw: unknown): RateLimitRecord {
  if (typeof raw === "object" && raw !== null && "count" in raw && "windowStart" in raw) {
    return raw as RateLimitRecord;
  }
  return { count: 0, windowStart: Date.now() };
}

export async function checkAndIncrementUsage(fingerprint: string): Promise<UsageCheckResult> {
  try {
    const [usageRaw, hourlyRaw] = await Promise.all([
      redis.get<UsageRecord>(usageKey(fingerprint)),
      redis.get<RateLimitRecord>(hourlyKey(fingerprint)),
    ]);

    const usage = parseUsage(usageRaw);
    const hourly = parseHourly(hourlyRaw);
    const now = Date.now();

    if (hourly.count >= HOURLY_RATE_LIMIT) {
      const retryAfter = Math.ceil((hourly.windowStart + HOURLY_TTL - now) / 1000);
      return {
        allowed: false,
        reason: "rate_limited",
        usedCount: usage.count,
        limit: FREE_INVOICE_LIMIT,
        remaining: Math.max(0, FREE_INVOICE_LIMIT - usage.count),
        upgradeRequired: usage.count >= FREE_INVOICE_LIMIT,
        ...(retryAfter > 0 ? { retryAfter } : {}),
      } as UsageCheckResult & { retryAfter?: number };
    }

    if (usage.count >= FREE_INVOICE_LIMIT) {
      return {
        allowed: false,
        reason: "limit_reached",
        usedCount: usage.count,
        limit: FREE_INVOICE_LIMIT,
        remaining: 0,
        upgradeRequired: true,
      };
    }

    const newCount = usage.count + 1;
    const newHourlyCount = hourly.count + 1;
    const newHourlyWindow = hourly.count === 0 ? now : hourly.windowStart;

    await Promise.all([
      redis.set<UsageRecord>(usageKey(fingerprint), {
        count: newCount,
        firstSeen: usage.firstSeen || now,
      }, { ex: USAGE_TTL }),
      redis.set<RateLimitRecord>(hourlyKey(fingerprint), {
        count: newHourlyCount,
        windowStart: newHourlyWindow,
      }, { ex: HOURLY_TTL }),
    ]);

    return {
      allowed: true,
      usedCount: newCount,
      limit: FREE_INVOICE_LIMIT,
      remaining: Math.max(0, FREE_INVOICE_LIMIT - newCount),
      upgradeRequired: newCount >= FREE_INVOICE_LIMIT,
    };
  } catch (err) {
    console.error("Redis error in checkAndIncrementUsage:", err);
    return {
      allowed: true,
      usedCount: 0,
      limit: FREE_INVOICE_LIMIT,
      remaining: FREE_INVOICE_LIMIT,
      upgradeRequired: false,
    };
  }
}

export async function getUsageCount(fingerprint: string): Promise<{
  usedCount: number;
  limit: number;
  remaining: number;
}> {
  try {
    const usageRaw = await redis.get<UsageRecord>(usageKey(fingerprint));
    const usage = parseUsage(usageRaw);
    return {
      usedCount: usage.count,
      limit: FREE_INVOICE_LIMIT,
      remaining: Math.max(0, FREE_INVOICE_LIMIT - usage.count),
    };
  } catch {
    return { usedCount: 0, limit: FREE_INVOICE_LIMIT, remaining: FREE_INVOICE_LIMIT };
  }
}
