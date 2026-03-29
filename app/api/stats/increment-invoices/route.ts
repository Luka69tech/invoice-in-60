import { NextRequest, NextResponse } from "next/server";
import { generateClientFingerprint } from "@/lib/fingerprint-client";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Increment invoice count (called after successful PDF generation)
    const count = await redis.incr("stats:invoices:total");
    return NextResponse.json({ count });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}