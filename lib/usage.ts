import { redis } from "@/lib/redis";

const FREE_INVOICE_LIMIT = 3; // Per month
const HOURLY_RATE_LIMIT = 3;
const MONTHLY_TTL = 31 * 24 * 60 * 60; // ~31 days
const HOURLY_TTL = 60 * 60;

export type Plan = "free" | "pro" | "business";

interface UsageRecord {
  count: number;
  firstSeen: number;
  monthKey: string; // "2026-03" format to track monthly limits
}

interface RateLimitRecord {
  count: number;
  windowStart: number;
}

interface PlanRecord {
  plan: Plan;
  purchasedAt: number;
  expiresAt: number;
  monthly: boolean;
}

export interface UsageCheckResult {
  allowed: boolean;
  reason?: "limit_reached" | "rate_limited" | "server_error";
  usedCount: number;
  limit: number;
  remaining: number;
  upgradeRequired: boolean;
  plan: Plan;
}

function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function usageKey(fp: string): string {
  return `usage:${fp}`;
}

function hourlyKey(fp: string): string {
  return `hourly:${fp}`;
}

function planKey(fp: string): string {
  return `plan:${fp}`;
}

function parseUsage(raw: unknown): UsageRecord {
  if (typeof raw === "object" && raw !== null && "count" in raw && "monthKey" in raw) {
    return raw as UsageRecord;
  }
  return { count: 0, firstSeen: Date.now(), monthKey: getCurrentMonthKey() };
}

function parseHourly(raw: unknown): RateLimitRecord {
  if (typeof raw === "object" && raw !== null && "count" in raw && "windowStart" in raw) {
    return raw as RateLimitRecord;
  }
  return { count: 0, windowStart: Date.now() };
}

function parsePlan(raw: unknown): PlanRecord | null {
  if (typeof raw === "object" && raw !== null && "plan" in raw && "expiresAt" in raw) {
    const record = raw as PlanRecord;
    // Check if expired
    if (record.expiresAt < Date.now()) {
      return null;
    }
    return record;
  }
  return null;
}

export async function checkAndIncrementUsage(fingerprint: string): Promise<UsageCheckResult> {
  try {
    const [usageRaw, hourlyRaw, planRaw] = await Promise.all([
      redis.get<UsageRecord>(usageKey(fingerprint)),
      redis.get<RateLimitRecord>(hourlyKey(fingerprint)),
      redis.get<PlanRecord>(planKey(fingerprint)),
    ]);

    const usage = parseUsage(usageRaw);
    const hourly = parseHourly(hourlyRaw);
    const plan = parsePlan(planRaw);
    const now = Date.now();
    const currentMonthKey = getCurrentMonthKey();

    // Determine user's plan
    const userPlan: Plan = plan?.plan || "free";

    // For Pro/Business, no limits
    if (userPlan !== "free") {
      return {
        allowed: true,
        usedCount: 0,
        limit: -1, // Unlimited
        remaining: -1,
        upgradeRequired: false,
        plan: userPlan,
      };
    }

    // Rate limiting check
    if (hourly.count >= HOURLY_RATE_LIMIT) {
      const retryAfter = Math.ceil((hourly.windowStart + HOURLY_TTL - now) / 1000);
      return {
        allowed: false,
        reason: "rate_limited",
        usedCount: usage.count,
        limit: FREE_INVOICE_LIMIT,
        remaining: Math.max(0, FREE_INVOICE_LIMIT - usage.count),
        upgradeRequired: usage.count >= FREE_INVOICE_LIMIT,
        plan: "free",
        ...(retryAfter > 0 ? { retryAfter } : {}),
      } as UsageCheckResult & { retryAfter?: number };
    }

    // Check if we need to reset for new month
    let monthUsageCount = usage.count;
    if (usage.monthKey !== currentMonthKey) {
      monthUsageCount = 0; // New month, reset count
    }

    // Monthly limit check
    if (monthUsageCount >= FREE_INVOICE_LIMIT) {
      return {
        allowed: false,
        reason: "limit_reached",
        usedCount: monthUsageCount,
        limit: FREE_INVOICE_LIMIT,
        remaining: 0,
        upgradeRequired: true,
        plan: "free",
      };
    }

    const newCount = monthUsageCount + 1;
    const newHourlyCount = hourly.count + 1;
    const newHourlyWindow = hourly.count === 0 ? now : hourly.windowStart;

    await Promise.all([
      redis.set<UsageRecord>(usageKey(fingerprint), {
        count: newCount,
        firstSeen: usage.firstSeen || now,
        monthKey: currentMonthKey,
      }, { ex: MONTHLY_TTL }),
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
      plan: "free",
    };
  } catch (err) {
    console.error("Redis error in checkAndIncrementUsage:", err);
    return {
      allowed: true,
      usedCount: 0,
      limit: FREE_INVOICE_LIMIT,
      remaining: FREE_INVOICE_LIMIT,
      upgradeRequired: false,
      plan: "free",
    };
  }
}

export async function getUsageCount(fingerprint: string): Promise<{
  usedCount: number;
  limit: number;
  remaining: number;
  plan: Plan;
}> {
  try {
    const [usageRaw, planRaw] = await Promise.all([
      redis.get<UsageRecord>(usageKey(fingerprint)),
      redis.get<PlanRecord>(planKey(fingerprint)),
    ]);

    const usage = parseUsage(usageRaw);
    const plan = parsePlan(planRaw);
    const userPlan: Plan = plan?.plan || "free";

    if (userPlan !== "free") {
      return { usedCount: 0, limit: -1, remaining: -1, plan: userPlan };
    }

    const currentMonthKey = getCurrentMonthKey();
    const count = usage.monthKey === currentMonthKey ? usage.count : 0;

    return {
      usedCount: count,
      limit: FREE_INVOICE_LIMIT,
      remaining: Math.max(0, FREE_INVOICE_LIMIT - count),
      plan: "free",
    };
  } catch {
    return { usedCount: 0, limit: FREE_INVOICE_LIMIT, remaining: FREE_INVOICE_LIMIT, plan: "free" };
  }
}

// Set a user's plan (called after payment)
export async function setUserPlan(
  fingerprint: string,
  plan: Plan,
  monthly: boolean
): Promise<boolean> {
  try {
    const now = Date.now();
    const duration = monthly ? 30 * 24 * 60 * 60 * 1000 : 365 * 24 * 60 * 60 * 1000;
    
    await redis.set<PlanRecord>(planKey(fingerprint), {
      plan,
      purchasedAt: now,
      expiresAt: now + duration,
      monthly,
    }, { ex: Math.ceil(duration / 1000) });

    return true;
  } catch (err) {
    console.error("Error setting user plan:", err);
    return false;
  }
}

// Get user's current plan
export async function getUserPlan(fingerprint: string): Promise<Plan> {
  try {
    const planRaw = await redis.get<PlanRecord>(planKey(fingerprint));
    const plan = parsePlan(planRaw);
    return plan?.plan || "free";
  } catch {
    return "free";
  }
}

// Check if user has paid plan (for client-side checks)
export function isPaidPlan(plan: Plan): boolean {
  return plan === "pro" || plan === "business";
}