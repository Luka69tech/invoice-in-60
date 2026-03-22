import { createHash } from "crypto";

export interface FingerprintData {
  userAgent: string;
  screenResolution: string;
  timezone: string;
}

export function generateLightFingerprint(data: FingerprintData): string {
  const raw = `${data.userAgent}|${data.screenResolution}|${data.timezone}`;
  return createHash("sha256").update(raw).digest("hex");
}

export function extractFingerprintFromRequest(request: Request): string | null {
  const ua = request.headers.get("user-agent") || "";
  const cfTimezone = request.headers.get("cf-ipTimezone") ||
    request.headers.get("x-vercel-ip-timezone") ||
    "UTC";

  const data: FingerprintData = {
    userAgent: ua,
    screenResolution: "unknown",
    timezone: cfTimezone,
  };

  return generateLightFingerprint(data);
}
