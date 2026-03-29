import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const cron = process.env.CRON_SECRET;
  return NextResponse.json({
    received: auth,
    expected: cron ? `Bearer ${cron}` : "MISSING",
    match: auth === `Bearer ${cron}`,
    secretLen: cron ? cron.length : 0,
    secretStart: cron ? cron.substring(0, 5) : "MISSING",
    secretEnd: cron ? cron.substring(cron.length - 5) : "MISSING",
  });
}

export const dynamic = "force-dynamic";