/**
 * Security Middleware — Rate Limiting
 * Implements sliding window rate limiting per IP address.
 * For Vercel serverless: uses in-memory Map with TTL cleanup.
 * For production scale: replace with Upstash Redis or similar.
 *
 * OWASP A04:2021 — Security Misconfiguration
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
  firstRequest: number;
}

const WINDOW_MS = 60 * 1000; // 1-minute sliding window

// In-memory store — resets on cold starts (acceptable for Vercel free tier)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Periodic cleanup of expired entries to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of Array.from(rateLimitStore.entries())) {
    if (now - entry.windowStart > WINDOW_MS * 2) {
      rateLimitStore.delete(key);
    }
  }
}, 60_000); // Run cleanup every minute

function getClientIP(request: Request): string {
  // Vercel: requests come from CDN, real IP is in headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  // Fallback
  return "unknown";
}

export interface RateLimitConfig {
  /** Max requests per window per IP */
  maxRequests: number;
  /** Window size in milliseconds */
  windowMs?: number;
  /** Custom key prefix */
  keyPrefix?: string;
  /** Extended key (e.g., user ID) to combine with IP */
  extendKey?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterMs?: number;
}

/**
 * Check rate limit for a request.
 * Returns { allowed, limit, remaining, resetAt, retryAfterMs }
 *
 * Usage:
 *   const result = checkRateLimit(request, { maxRequests: 10 });
 *   if (!result.allowed) {
 *     return new Response("Too Many Requests", {
 *       status: 429,
 *       headers: { "Retry-After": String(Math.ceil(result.retryAfterMs! / 1000)) }
 *     });
 *   }
 */
export function checkRateLimit(
  request: Request,
  config: RateLimitConfig
): RateLimitResult {
  const { maxRequests, windowMs = WINDOW_MS, keyPrefix = "rl", extendKey } = config;
  const ip = getClientIP(request);
  const key = extendKey ? `${keyPrefix}:${ip}:${extendKey}` : `${keyPrefix}:${ip}`;
  const now = Date.now();

  let entry = rateLimitStore.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    // Start new window
    entry = { count: 1, windowStart: now, firstRequest: now };
    rateLimitStore.set(key, entry);
    return {
      allowed: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetAt: now + windowMs,
    };
  }

  entry.count++;
  const resetAt = entry.windowStart + windowMs;
  const remaining = Math.max(0, maxRequests - entry.count);

  if (entry.count > maxRequests) {
    const retryAfterMs = resetAt - now;
    return {
      allowed: false,
      limit: maxRequests,
      remaining: 0,
      resetAt,
      retryAfterMs,
    };
  }

  return {
    allowed: true,
    limit: maxRequests,
    remaining,
    resetAt,
  };
}

/**
 * Build standard rate limit headers for a Response.
 */
export function buildRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
    ...(result.retryAfterMs !== undefined && {
      "Retry-After": String(Math.ceil(result.retryAfterMs / 1000)),
    }),
  };
}
