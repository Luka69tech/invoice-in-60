import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

interface HealthCheck {
  timestamp: number;
  status: "UP" | "DOWN";
  responseTime: number;
  error?: string;
}

interface Incident {
  id: string;
  start: number;
  end?: number;
  duration?: number;
}

export async function GET(req: NextRequest) {
  // Simple password check via header
  const passHeader = req.headers.get("x-admin-password");
  if (passHeader !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch health checks - zrange with withScores returns [value, score, value, score, ...]
    const checksKey = "monitor:health:checks";
    const now = Date.now();

    // Get all checks and filter client-side
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const allRaw: Array<string | number> = await redis.zrange(checksKey, 0, -1, { withScores: true });

    const checks24h: HealthCheck[] = [];
    const checks7d: HealthCheck[] = [];
    const allChecks: HealthCheck[] = [];

    for (let i = 0; i < allRaw.length; i += 2) {
      const rawScore = allRaw[i + 1];
      const timestamp = typeof rawScore === 'number' ? rawScore : parseInt(String(rawScore), 10);
      if (Number.isNaN(timestamp)) continue;

      let parsed: HealthCheck | null = null;
      try {
        parsed = JSON.parse(String(allRaw[i])) as HealthCheck;
      } catch {}

      if (parsed) {
        parsed.timestamp = timestamp;
        allChecks.push(parsed);
        if (timestamp >= now - 24 * 60 * 60 * 1000) checks24h.push(parsed);
        if (timestamp >= now - 7 * 24 * 60 * 60 * 1000) checks7d.push(parsed);
      }
    }

    const calcUptime = (checks: HealthCheck[]) => {
      if (checks.length === 0) return 100;
      const down = checks.filter((c) => c.status === "DOWN").length;
      return Math.round(((checks.length - down) / checks.length) * 100 * 10) / 10;
    };

    const calcAvgResponse = (checks: HealthCheck[]) => {
      const up = checks.filter((c) => c.status === "UP");
      if (up.length === 0) return 0;
      return Math.round(up.reduce((a, b) => a + b.responseTime, 0) / up.length);
    };

    // Fetch incidents
    const resolvedKey = "monitor:incidents:resolved";
    const resolvedRaw: Array<string | number> = await redis.zrange(resolvedKey, 0, -1);
    const incidents: Incident[] = [];
    for (const r of resolvedRaw) {
      try {
        const inc = JSON.parse(String(r)) as Incident;
        if (inc.start) incidents.push(inc);
      } catch {}
    }

    // Fetch stats
    const invoicesRaw = await redis.get("stats:invoices:total");
    const totalPaymentsRaw = await redis.get("stats:payments:total");
    const proPaymentsRaw = await redis.get("stats:payments:pro");
    const businessPaymentsRaw = await redis.get("stats:payments:business");

    const invoices = invoicesRaw != null ? parseInt(String(invoicesRaw)) : 0;
    const totalPayments = totalPaymentsRaw != null ? parseInt(String(totalPaymentsRaw)) : 0;
    const proPayments = proPaymentsRaw != null ? parseInt(String(proPaymentsRaw)) : 0;
    const businessPayments = businessPaymentsRaw != null ? parseInt(String(businessPaymentsRaw)) : 0;

    // Current status from latest check
    const latestCheck = allChecks.length > 0 ? allChecks[allChecks.length - 1] : null;

    return NextResponse.json({
      currentStatus: latestCheck?.status || "UNKNOWN",
      recentChecks: checks24h.slice(-50).map(c => ({ timestamp: c.timestamp, status: c.status, responseTime: c.responseTime, error: c.error })),
      incidents: incidents.slice(-20),
      stats: {
        invoices,
        payments: { total: totalPayments, pro: proPayments, business: businessPayments },
        revenue: proPayments * 9 + businessPayments * 19,
      },
      uptime: {
        h24: calcUptime(checks24h),
        d7: calcUptime(checks7d),
        d30: calcUptime(allChecks),
      },
      avgResponse: {
        h24: calcAvgResponse(checks24h),
        d7: calcAvgResponse(checks7d),
        d30: calcAvgResponse(allChecks),
      },
    });
  } catch (err) {
    console.error("[admin/monitoring-data] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";