import { NextRequest, NextResponse } from "next/server";
import { generateInvoicePdf } from "@/lib/pdf-generator";
import { checkRateLimit, buildRateLimitHeaders } from "@/lib/security/rate-limit";
import { pdfRequestSchema, formatZodError } from "@/lib/security/validation";
import { SECURITY_HEADERS } from "@/lib/security/headers";
import { checkAndIncrementUsage } from "@/lib/usage";
import { redis } from "@/lib/redis";

export async function POST(req: NextRequest) {
  const rateResult = checkRateLimit(req, { maxRequests: 20, windowMs: 60 * 1000, keyPrefix: "pdf" });

  if (!rateResult.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before trying again." },
      { status: 429, headers: { ...SECURITY_HEADERS, ...buildRateLimitHeaders(rateResult) } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400, headers: { ...SECURITY_HEADERS, ...buildRateLimitHeaders(rateResult) } }
    );
  }

  const parsed = pdfRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid invoice data", details: formatZodError(parsed.error) },
      { status: 400, headers: { ...SECURITY_HEADERS, ...buildRateLimitHeaders(rateResult) } }
    );
  }

  const { invoice, currency, fingerprintHash } = parsed.data;

  if (fingerprintHash) {
    const usageResult = await checkAndIncrementUsage(fingerprintHash);

    if (!usageResult.allowed) {
      return NextResponse.json(
        {
          error: "Free invoice limit reached",
          reason: usageResult.reason,
          usedCount: usageResult.usedCount,
          limit: usageResult.limit,
          remaining: usageResult.remaining,
          upgradeRequired: true,
        },
        {
          status: 403,
          headers: {
            ...SECURITY_HEADERS,
            ...buildRateLimitHeaders(rateResult),
          },
        }
      );
    }
  }

  try {
    const pdfBuffer = await generateInvoicePdf(invoice, currency);

    // Increment invoice stats (fire and forget)
    redis.incr("stats:invoices:total").catch(() => {});

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        ...SECURITY_HEADERS,
        ...buildRateLimitHeaders(rateResult),
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${invoice.invoiceNumber || "export"}.pdf"`,
        "Content-Length": String(pdfBuffer.length),
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json(
      { error: "PDF generation failed. Make sure you're running the build server (not dev)." },
      { status: 500, headers: { ...SECURITY_HEADERS, ...buildRateLimitHeaders(rateResult) } }
    );
  }
}
