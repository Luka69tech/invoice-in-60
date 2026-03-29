import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL_PROD || "https://invoice-in-60.vercel.app";
const HEALTH_URL = `${APP_URL}/api/health`;

async function getSSLCertExpiry(): Promise<number | null> {
  // Vercel manages SSL automatically
  return null;
}

async function sendTelegram(msg: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: "Markdown" }),
    });
  } catch (err) {
    console.error("[cron/monitor] Telegram error:", err);
  }
}

export async function GET() {
  try {
    // 1. Run health check
    const start = Date.now();
    let status: "UP" | "DOWN" = "DOWN";
    let responseTime = 0;
    let statusCode: number | undefined;
    let errorMsg: string | undefined;

    try {
      const response = await fetch(HEALTH_URL, {
        method: "GET",
        signal: AbortSignal.timeout(10000),
      });
      responseTime = Date.now() - start;
      statusCode = response.status;
      status = response.ok && response.status === 200 ? "UP" : "DOWN";
      if (!response.ok) errorMsg = `Status ${response.status}`;
    } catch (err) {
      responseTime = Date.now() - start;
      status = "DOWN";
      errorMsg = err instanceof Error ? err.message : "Unknown error";
    }

    // 2. Store health check in Redis
    const checkData = JSON.stringify({ timestamp: start, status, responseTime, statusCode, error: errorMsg });
    await redis.zadd("monitor:health:checks", { score: start, member: checkData });
    const card = await redis.zcard("monitor:health:checks");
    if (card > 10000) {
      await redis.zremrangebyrank("monitor:health:checks", 0, card - 10000 - 1);
    }

    // 3. Check last status for state transitions
    const lastRaw = await redis.zrange("monitor:health:checks", -2, -1);
    let lastStatus: "UP" | "DOWN" | undefined;
    if (lastRaw.length >= 1) {
      try { lastStatus = JSON.parse(lastRaw[0] as string).status; } catch {}
    }

    if (status === "DOWN" && lastStatus === "UP") {
      // Site down - open incident + alert
      await redis.set("monitor:incidents:active", JSON.stringify({ id: `inc_${start}`, start, acknowledged: false }));
      const cooldown = await redis.get("alert:site_down");
      if (!cooldown) {
        await redis.set("alert:site_down", "1", { ex: 300 });
        await sendTelegram([
          "🔴 *INVOICE IN 60 — SITE DOWN*",
          "",
          `⏰ ${new Date(start).toISOString()}`,
          `❌ Error: ${errorMsg || "Unknown"}`,
          `⏱ Response time: ${responseTime}ms`,
          "",
          "Investigating...",
        ].join("\n"));
      }
    } else if (status === "UP" && lastStatus === "DOWN") {
      // Site recovered
      const activeRaw = await redis.get("monitor:incidents:active");
      if (activeRaw) {
        const active = JSON.parse(activeRaw as string);
        const downtime = start - active.start;
        await redis.del("monitor:incidents:active");
        await redis.zadd("monitor:incidents:resolved", { score: start, member: JSON.stringify({ ...active, end: start, duration: downtime }) });
        const cooldown = await redis.get("alert:site_recovery");
        if (!cooldown) {
          await redis.set("alert:site_recovery", "1", { ex: 600 });
          const dur = formatDuration(downtime);
          await sendTelegram([
            "🟢 *INVOICE IN 60 — BACK ONLINE*",
            "",
            `⏰ Recovered at ${new Date(start).toLocaleString()}`,
            `📉 Downtime: *${dur}*`,
            `⏱ Response time: ${responseTime}ms`,
          ].join("\n"));
        }
      }
    }

    // 4. Slow response alert
    if (status === "UP" && responseTime > 3000) {
      const cooldown = await redis.get("alert:slow_response");
      if (!cooldown) {
        await redis.set("alert:slow_response", "1", { ex: 300 });
        await sendTelegram(`🐢 *SLOW RESPONSE*\n\nResponse time: *${responseTime}ms* (>3000ms threshold)\n${new Date().toISOString()}`);
      }
    }

    // 5. 5xx error spike tracking
    if (status === "DOWN" || (statusCode && statusCode >= 500)) {
      const now = Date.now();
      const errData = JSON.stringify({ ts: now, code: statusCode || 0, error: errorMsg });
      await redis.zadd("monitor:errors:5xx", { score: now, member: errData });
      await redis.zremrangebyrank("monitor:errors:5xx", 0, -10001);

      // Count errors in last 5 minutes
      const allErrors: Array<string | number> = await redis.zrange("monitor:errors:5xx", 0, -1);
      const windowStart = now - 5 * 60 * 1000;
      let errorCount = 0;
      for (const raw of allErrors) {
        try {
          const err = JSON.parse(raw as string);
          if (err.ts >= windowStart) errorCount++;
        } catch {}
      }

      if (errorCount >= 3) {
        const cooldown = await redis.get("alert:500_spike");
        if (!cooldown) {
          await redis.set("alert:500_spike", "1", { ex: 600 });
          await sendTelegram([
            "⚠️ *ERROR SPIKE DETECTED*",
            "",
            `❌ ${errorCount} errors in the last 5 minutes`,
            `Last error: ${errorMsg || `HTTP ${statusCode}`}`,
            `Time: ${new Date().toLocaleString()}`,
          ].join("\n"));
        }
      }
    }

    // 6. Cleanup old errors
    const cutoff = Date.now() - 10 * 60 * 1000;
    const allErrs: Array<string | number> = await redis.zrange("monitor:errors:5xx", 0, -1);
    for (const raw of allErrs) {
      try {
        const e = JSON.parse(raw as string);
        if (e.ts < cutoff) {
          // Can't easily remove by score, let it naturally expire via trim on next run
        }
      } catch {}
    }

    return NextResponse.json({
      ok: true,
      status,
      responseTime,
      timestamp: start,
    });
  } catch (err) {
    console.error("[cron/monitor] Error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}