import { redis } from "@/lib/redis";

export async function incrementRateLimit(ip: string, windowMs = 60000): Promise<number> {
  const key = `ratelimit:${ip}:${Math.floor(Date.now() / windowMs)}`;
  const count = await redis.incr(key);
  await redis.expire(key, Math.ceil(windowMs / 1000) + 10);
  return count;
}

export async function getRateLimitCount(ip: string, windowMs = 60000): Promise<number> {
  const key = `ratelimit:${ip}:${Math.floor(Date.now() / windowMs)}`;
  const raw = await redis.get(key);
  return raw != null ? parseInt(String(raw)) : 0;
}

export async function shouldAlert(key: string, windowSeconds: number): Promise<boolean> {
  const k = `alert:${key}`;
  const existing = await redis.get(k);
  if (existing != null) return false;
  await redis.set(k, "1", { ex: windowSeconds });
  return true;
}