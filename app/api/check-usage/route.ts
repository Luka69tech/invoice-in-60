import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { checkAndIncrementUsage, getUsageCount } from "@/lib/usage";
import { SECURITY_HEADERS } from "@/lib/security/headers";

function hashFingerprint(userAgent: string, screenResolution: string, timezone: string): string {
  return createHash("sha256").update(`${userAgent}|${screenResolution}|${timezone}`).digest("hex");
}

export async function GET(req: NextRequest) {
  const userAgent = req.nextUrl.searchParams.get("ua") || "";
  const screenResolution = req.nextUrl.searchParams.get("sr") || "";
  const timezone = req.nextUrl.searchParams.get("tz") || "";
  const increment = req.nextUrl.searchParams.get("increment") === "true";

  if (!userAgent || !screenResolution || !timezone) {
    return NextResponse.json(
      { error: "Missing fingerprint parameters" },
      { status: 400, headers: SECURITY_HEADERS }
    );
  }

  const fingerprint = hashFingerprint(userAgent, screenResolution, timezone);

  if (increment) {
    const result = await checkAndIncrementUsage(fingerprint);
    return NextResponse.json(
      {
        usedCount: result.usedCount,
        limit: result.limit,
        remaining: result.remaining,
        upgradeRequired: result.upgradeRequired,
        reason: result.reason,
        retryAfter: "retryAfter" in result ? result.retryAfter : undefined,
      },
      { headers: SECURITY_HEADERS }
    );
  }

  const usage = await getUsageCount(fingerprint);
  return NextResponse.json(
    {
      usedCount: usage.usedCount,
      limit: usage.limit,
      remaining: usage.remaining,
      upgradeRequired: usage.remaining === 0,
    },
    { headers: SECURITY_HEADERS }
  );
}
