export interface ClientFingerprintData {
  hash: string;
  userAgent: string;
  screenResolution: string;
  timezone: string;
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function generateClientFingerprint(): Promise<ClientFingerprintData> {
  if (typeof window === "undefined") {
    return { hash: "", userAgent: "", screenResolution: "", timezone: "" };
  }

  const userAgent = navigator.userAgent;
  const screenResolution = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const raw = `${userAgent}|${screenResolution}|${timezone}`;
  const hash = await sha256(raw);

  return { hash, userAgent, screenResolution, timezone };
}
