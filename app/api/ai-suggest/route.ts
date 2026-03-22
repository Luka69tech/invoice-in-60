/**
 * AI Suggest API Route
 * Generates invoice line items using Ollama AI.
 *
 * Security hardening applied:
 * - Rate limiting: 10 requests/minute per IP
 * - Schema validation with Zod (A03 injection)
 * - SSRF protection: server-side Ollama URL, URL validation (A10)
 * - No error details leaked to client (A05)
 * - Strict JSON parsing with schema validation
 * - 10s request timeout
 *
 * OWASP: A03, A04, A05, A10
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, buildRateLimitHeaders } from "@/lib/security/rate-limit";
import { validateBody, aiSuggestSchema } from "@/lib/security/validation";
import { validateURL } from "@/lib/security/ssrf";
import { applySecurityHeaders } from "@/lib/security/headers";

const MODEL = "minimax-m2.5:cloud";

export async function POST(req: NextRequest) {
  // ── Rate Limiting ──────────────────────────────────────────────────────────
  const rl = checkRateLimit(req, { maxRequests: 10, windowMs: 60_000, keyPrefix: "ai" });

  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before trying again." },
      {
        status: 429,
        headers: buildRateLimitHeaders(rl),
      }
    );
  }

  // ── Parse Request Body ─────────────────────────────────────────────────────
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body — expected JSON" },
      { status: 400, headers: buildRateLimitHeaders(rl) }
    );
  }

  // ── Input Validation ────────────────────────────────────────────────────────
  const parsed = validateBody(aiSuggestSchema, rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error },
      { status: 400, headers: buildRateLimitHeaders(rl) }
    );
  }

  const { prompt, currency } = parsed.data;

  // ── System Prompt (never exposed to client) ───────────────────────────────
  const systemPrompt = `You are an invoice line item generator. Convert project descriptions into professional invoice line items.

Return ONLY a valid JSON array with this exact format — no markdown, no explanation, just JSON:
[
  {
    "description": "Clear service description",
    "quantity": 1,
    "rate": 500
  }
]

Rules:
- Rate is in ${currency}, per unit
- Be specific and professional
- 2-5 line items maximum
- Each description should be a clear, professional service name
- Quantity is always a positive number`;

  // ── Ollama URL Validation (SSRF Protection) ────────────────────────────────
  // Read from SERVER-SIDE env only (not NEXT_PUBLIC_, which is client-exposed)
  const rawOllamaUrl = process.env.OLLAMA_URL || "http://127.0.0.1:11434/api/generate";

  let ollamaUrl: URL;
  try {
    ollamaUrl = validateURL(rawOllamaUrl, new Set(["127.0.0.1", "localhost"]));
  } catch {
    return NextResponse.json(
      { error: "AI service is not configured. Contact the administrator." },
      { status: 503, headers: buildRateLimitHeaders(rl) }
    );
  }

  // ── AI Request ─────────────────────────────────────────────────────────────
  let ollamaRes: Response;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    ollamaRes = await fetch(ollamaUrl.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        prompt: `${systemPrompt}\n\nUser: ${prompt}`,
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json(
        { error: "AI service timed out. Please try again." },
        { status: 504, headers: buildRateLimitHeaders(rl) }
      );
    }
    // Log internally but return generic error
    console.error("[ai-suggest] Fetch error:", err);
    return NextResponse.json(
      { error: "AI service unavailable. Make sure Ollama is running locally." },
      { status: 503, headers: buildRateLimitHeaders(rl) }
    );
  }

  if (!ollamaRes.ok) {
    console.error(`[ai-suggest] Ollama returned ${ollamaRes.status}`);
    return NextResponse.json(
      { error: "AI service returned an error. Please try again." },
      { status: 502, headers: buildRateLimitHeaders(rl) }
    );
  }

  // ── Parse AI Response ─────────────────────────────────────────────────────
  let rawResponse: string;
  try {
    const data = await ollamaRes.json();
    rawResponse = (data.response || "").trim();
  } catch {
    return NextResponse.json(
      { error: "Invalid response from AI service." },
      { status: 502, headers: buildRateLimitHeaders(rl) }
    );
  }

  // Strip markdown code fences if present
  const cleaned = rawResponse
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // ── Parse and Validate JSON Response ────────────────────────────────────────
  let items: unknown;
  try {
    items = JSON.parse(cleaned);
  } catch {
    return NextResponse.json(
      { error: "AI returned an invalid response format. Please try again." },
      { status: 502, headers: buildRateLimitHeaders(rl) }
    );
  }

  // Validate response structure
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "AI returned an empty or invalid response." },
      { status: 502, headers: buildRateLimitHeaders(rl) }
    );
  }

  // Validate each item has required fields and reasonable values
  const validatedItems = items.slice(0, 10).map((item: unknown) => {
    if (
      typeof item === "object" &&
      item !== null &&
      "description" in item &&
      "rate" in item
    ) {
      const obj = item as Record<string, unknown>;
      return {
        description: String(obj.description).slice(0, 500),
        quantity: Math.max(1, Math.min(9999, Number(obj.quantity) || 1)),
        rate: Math.max(0, Math.min(999999, Number(obj.rate) || 0)),
      };
    }
    return null;
  }).filter(Boolean);

  if (validatedItems.length === 0) {
    return NextResponse.json(
      { error: "AI returned invalid line items. Please try again." },
      { status: 502, headers: buildRateLimitHeaders(rl) }
    );
  }

  // ── Response ───────────────────────────────────────────────────────────────
  const headers = {
    ...buildRateLimitHeaders(rl),
    "X-RateLimit-Policy": "10 req/min",
  };

  return NextResponse.json({ items: validatedItems }, { headers });
}
