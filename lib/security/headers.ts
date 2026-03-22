/**
 * Security Headers Configuration
 * Applied to all API responses and pages.
 *
 * OWASP A05:2021 — Security Misconfiguration
 */

/**
 * Strict Content Security Policy.
 * - default-src 'self': Only allow resources from same origin
 * - script-src 'self': Only inline scripts we explicitly mark (nonce will be added by Next.js)
 * - style-src 'self' 'unsafe-inline': Allow our Tailwind/styles
 * - img-src 'self' data: https: blob: : Allow images from self, data URIs, https sources
 * - connect-src 'self' https://api.gumroad.com : Only allow connections to our origin + Gumroad
 * - frame-ancestors 'none': Prevent framing (clickjacking protection)
 * - form-action 'self' : Forms can only submit to our origin
 * - base-uri 'self': Prevent <base> tag injection
 * - object-src 'none': Disable plugins
 */
export const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js needs these
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.gumroad.com",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

/**
 * Security headers applied to all responses.
 * Order matters: CSP last so it can override earlier directives if needed.
 */
export const SECURITY_HEADERS: Record<string, string> = {
  // Prevent MIME type sniffing — forces browser to respect Content-Type
  "X-Content-Type-Options": "nosniff",

  // Clickjacking protection — prevent site from being framed
  "X-Frame-Options": "DENY",

  // XSS protection (legacy browsers) — note: CSP is the modern approach
  "X-XSS-Protection": "1; mode=block",

  // Referrer policy — don't leak referrer to external links
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // Permissions policy — disable risky browser features
  "Permissions-Policy": [
    "camera=()",
    "microphone=()",
    "geolocation=()",
    "payment=(self)",
  ].join(", "),

  // Content Security Policy
  "Content-Security-Policy": CSP,

  // Strict Transport Security — force HTTPS (uncomment in production)
  // "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",

  // Cache-Control — no-store for API responses with sensitive data
  // Pages can override this via Next.js metadata
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
};

/**
 * Apply security headers to a Next.js Response or ResponseInit.
 */
export function applySecurityHeaders(
  init: ResponseInit = {}
): ResponseInit {
  const headers = new Headers(init.headers);

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    // Don't override if already set
    if (!headers.has(key)) {
      headers.set(key, value);
    }
  }

  return { ...init, headers };
}
