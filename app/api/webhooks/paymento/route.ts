import { NextRequest, NextResponse } from "next/server";

// Minimal handler to test if route is reachable
// Signature verification will be added back after confirming 200 response works

export async function GET() {
  return new Response("OK - Webhook endpoint active", { status: 200 });
}

export async function POST(req: Request) {
  return new Response("OK", { status: 200 });
}

export const dynamic = "force-dynamic";