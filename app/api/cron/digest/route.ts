import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

interface Stats {
  uptimePercent: number;
  avgResponseTime: number;
  totalChecks: number;
  downChecks: number;
  totalInvoices: number;
  totalPayments: number;
  proPayments: number;
  businessPayments: number;
  errors: Array<{ timestamp: number; message: string; count: number }>;
}

async function getStats(): Promise<Stats> {
  // Get all recent checks and filter client-side
  const checksKey = "monitor:health:checks";
  const now = Date.now();
  const twoHoursAgo = now - 2 * 60 * 60 * 1000;
  const allRaw = await redis.zrange(checksKey, -10000, -1);
  const checks: Array<{ timestamp: number; status: string; responseTime: number; error?: string }> = [];
  for (const r of allRaw) {
    try {
      const parsed = JSON.parse(r as string);
      if (parsed.timestamp >= twoHoursAgo) checks.push(parsed);
    } catch {}
  }

  const totalChecks = checks.length;
  const downChecks = checks.filter((c) => c.status === "DOWN").length;
  const uptimePercent = totalChecks > 0 ? Math.round(((totalChecks - downChecks) / totalChecks) * 100) : 100;

  const responseTimes = checks.filter((c) => c.status === "UP").map((c) => c.responseTime);
  const avgResponseTime = responseTimes.length > 0
    ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
    : 0;

  // Get invoice count
  let totalInvoices = 0;
  const invoiceCountRaw = await redis.get("stats:invoices:total");
  if (invoiceCountRaw != null) totalInvoices = parseInt(String(invoiceCountRaw));

  // Get payment counts
  let totalPayments = 0;
  let proPayments = 0;
  let businessPayments = 0;

  const totalPaymentsRaw = await redis.get("stats:payments:total");
  if (totalPaymentsRaw != null) totalPayments = parseInt(String(totalPaymentsRaw));

  const proPaymentsRaw = await redis.get("stats:payments:pro");
  if (proPaymentsRaw != null) proPayments = parseInt(String(proPaymentsRaw));

  const businessPaymentsRaw = await redis.get("stats:payments:business");
  if (businessPaymentsRaw != null) businessPayments = parseInt(String(businessPaymentsRaw));

  // Get recent errors
  const errorKey = "monitor:errors:5xx";
  const windowStart = now - 2 * 60 * 60 * 1000;
  const allErrors = await redis.zrange(errorKey, 0, -1);

  const errorMap: Record<string, { timestamp: number; message: string; count: number }> = {};
  for (const raw of allErrors) {
    try {
      const err = JSON.parse(raw as string);
      if (err.ts >= windowStart) {
        const msg = err.error || `HTTP ${err.code}`;
        if (!errorMap[msg]) {
          errorMap[msg] = { timestamp: err.ts, message: msg, count: 0 };
        }
        errorMap[msg].count++;
      }
    } catch {}
  }

  const errors = Object.values(errorMap).sort((a, b) => b.count - a.count);

  return { uptimePercent, avgResponseTime, totalChecks, downChecks, totalInvoices, totalPayments, proPayments, businessPayments, errors };
}

async function sendDigest(stats: Stats): Promise<void> {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

  const statusEmoji = stats.uptimePercent === 100 ? "🟢" : stats.uptimePercent >= 95 ? "🟡" : "🔴";
  const estimatedRevenue = (stats.proPayments * 9) + (stats.businessPayments * 19);

  const lines = [
    `📊 *Invoice In 60 — 2h Digest*`,
    `🕐 ${new Date().toISOString()}`,
    "",
    `${statusEmoji} *Status:* ${stats.uptimePercent === 100 ? "ALL SYSTEMS UP" : `${stats.uptimePercent}% uptime`}`,
    `⏱ Avg response: ${stats.avgResponseTime}ms`,
    `📈 Total checks: ${stats.totalChecks}`,
    "",
    "📄 *Invoices*",
    `  Total generated: ${stats.totalInvoices}`,
    "",
    "💳 *Payments*",
    `  Total successful: ${stats.totalPayments}`,
    `  Pro (×$9): ${stats.proPayments}`,
    `  Business (×$19): ${stats.businessPayments}`,
    `  💰 Est. revenue: $${estimatedRevenue}`,
    "",
  ];

  if (stats.errors.length > 0) {
    lines.push("⚠️ *Errors (last 2h)*");
    for (const err of stats.errors.slice(0, 5)) {
      lines.push(`  • ${err.message} (×${err.count})`);
    }
  } else {
    lines.push("✅ *No errors in last 2 hours*");
  }

  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: lines.join("\n"),
      parse_mode: "Markdown",
    }),
  });
}

const CRON_SECRET = process.env.CRON_SECRET;

async function verifyCronAuth(req: NextRequest): Promise<boolean> {
  if (!CRON_SECRET) return false;
  const authHeader = req.headers.get("authorization");
  return authHeader === `Bearer ${CRON_SECRET}`;
}

export async function GET(req: NextRequest) {
  if (!await verifyCronAuth(req)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const stats = await getStats();
    await sendDigest(stats);

    return NextResponse.json({
      ok: true,
      stats,
      digestSent: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
    });
  } catch (err) {
    console.error("[cron/digest] Error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}