import { NextResponse } from "next/server";
import { SECURITY_HEADERS } from "@/lib/security/headers";

export async function GET() {
  return NextResponse.json(
    { 
      status: "ok", 
      timestamp: new Date().toISOString(),
      service: "invoice-in-60"
    },
    { headers: SECURITY_HEADERS }
  );
}

export const dynamic = "force-dynamic";