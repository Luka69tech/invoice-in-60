import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!ADMIN_PASSWORD) {
    return NextResponse.json({ success: false, error: "Admin password not configured" }, { status: 500 });
  }

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
  }

  // Return a simple token for session
  const token = Buffer.from(`${Date.now()}:admin`).toString("base64");

  return NextResponse.json({ success: true, token });
}

export const dynamic = "force-dynamic";