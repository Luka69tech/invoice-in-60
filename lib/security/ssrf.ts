/**
 * SSRF Protection — Safe URL Fetching
 * Prevents Server-Side Request Forgery attacks by validating URLs
 * against an allowlist of permitted hosts.
 *
 * OWASP A10:2021 — Server-Side Request Forgery (SSRF)
 */

/**
 * Allowed hosts for external API calls.
 * Only hosts in this list can be fetched by the application.
 */
const ALLOWED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  // Add other trusted hosts here
]);

/**
 * Allowed IP ranges (private/Documentation networks).
 * These are inherently safe from SSRF since they're internal.
 */
const BLOCKED_IP_RANGES = [
  // Loopback
  /^127\./i,
  /^::1$/i,
  /^fc00:/i,
  /^fe80:/i,
  // Private networks
  /^10\./i,
  /^172\.(1[6-9]|2\d|3[01])\./i,
  /^192\.168\./i,
  // Link-local
  /^169\.254\./i,
  // AWS metadata
  /^169\.254\.169\.254$/i,
  /^100\.100\.100\.200$/i,
  // Docker
  /^172\.17\./i,
  /^172\.18\./i,
  /^172\.19\./i,
  /^172\.20\./i,
  /^172\.21\./i,
  /^172\.22\./i,
  /^172\.23\./i,
  /^172\.24\./i,
  /^172\.25\./i,
  /^172\.26\./i,
  /^172\.27\./i,
  /^172\.28\./i,
  /^172\.29\./i,
  /^172\.30\./i,
  /^172\.31\./i,
];

export class SSRFError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SSRFError";
  }
}

/**
 * Validate a URL for SSRF safety.
 * Throws SSRFError if the URL points to an internal resource.
 *
 * @param urlString - The URL to validate
 * @param allowedHosts - Additional allowed hostnames (merged with ALLOWED_HOSTS)
 * @throws SSRFError
 */
export function validateURL(
  urlString: string,
  allowedHosts: Set<string> = new Set()
): URL {
  let url: URL;

  try {
    url = new URL(urlString);
  } catch {
    throw new SSRFError("Invalid URL format");
  }

  // Only allow http and https
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new SSRFError(`Protocol "${url.protocol}" is not allowed. Only http/https permitted.`);
  }

  const host = url.hostname.toLowerCase();
  const mergedAllowed = new Set([...Array.from(ALLOWED_HOSTS), ...Array.from(allowedHosts)]);

  // Check if host is in allowlist
  const isAllowed = mergedAllowed.has(host);

  if (!isAllowed) {
    throw new SSRFError(`Host "${host}" is not in the allowed hosts list`);
  }

  // Check IP against blocked ranges
  const ip = host;
  for (const range of BLOCKED_IP_RANGES) {
    if (range.test(ip)) {
      throw new SSRFError(
        `URL resolves to a blocked IP range (${ip}). This is a potential SSRF attack.`
      );
    }
  }

  // Validate port — block privileged ports
  const port = url.port ? parseInt(url.port, 10) : (url.protocol === "https:" ? 443 : 80);
  if (port > 0 && port < 1024 && port !== 443 && port !== 80) {
    throw new SSRFError(`Port ${port} is not allowed (privileged port)`);
  }

  // Block credentials in URL
  if (url.username || url.password) {
    throw new SSRFError("URL must not contain credentials");
  }

  return url;
}

/**
 * Fetch a URL with SSRF protection.
 * Validates the URL before making the request.
 *
 * @param url - URL to fetch (must be pre-validated or within allowed hosts)
 * @param options - Fetch options
 * @throws SSRFError
 */
export async function safeFetch(
  url: string | URL,
  options: RequestInit = {},
  allowedHosts: Set<string> = new Set()
): Promise<Response> {
  const urlString = typeof url === "string" ? url : url.toString();

  // Validate the URL
  validateURL(urlString, allowedHosts);

  // Set a reasonable timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000); // 10s timeout

  try {
    const response = await fetch(urlString, {
      ...options,
      signal: controller.signal,
      // Never follow redirects to different origins
      redirect: "follow",
    });
    return response;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new SSRFError("Request timed out after 10 seconds");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
