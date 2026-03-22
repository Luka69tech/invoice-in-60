/**
 * Input Validation Schemas — Zod-based
 * All user input MUST be validated through these schemas before processing.
 *
 * OWASP A03:2021 — Injection
 * OWASP A05:2021 — Security Misconfiguration
 */

import { z } from "zod";

// ─── Line Item ───────────────────────────────────────────────────────────────

const lineItemSchema = z.object({
  id: z.string().min(1).max(36),
  description: z.string().max(500),
  quantity: z.string().regex(/^\d*\.?\d+$/, "Must be a valid number"),
  rate: z.string().regex(/^\d*\.?\d+$/, "Must be a valid number"),
  amount: z.string().regex(/^\d*\.?\d+$/, "Must be a valid number"),
});

// ─── Invoice Data ────────────────────────────────────────────────────────────

const ALLOWED_CURRENCIES = [
  "USD", "EUR", "GBP", "CAD", "AUD", "JPY", "INR", "BRL", "CHF", "MXN",
  "SGD", "DKK", "NOK", "SEK", "NZD", "HKD", "CNY", "KRW", "RUB", "ZAR",
] as const;

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INVOICE_NUMBER_REGEX = /^[A-Za-z0-9_\-]{1,20}$/;

const MAX_STRING_LENGTH = 500;
const MAX_ADDRESS_LENGTH = 300;

export const invoiceSchema = z.object({
  fromName: z.string().min(0).max(MAX_STRING_LENGTH).trim(),
  fromEmail: z
    .string()
    .max(MAX_STRING_LENGTH)
    .regex(EMAIL_REGEX, "Invalid email format")
    .default(""),
  fromAddress: z.string().max(MAX_ADDRESS_LENGTH).trim().default(""),
  toName: z.string().min(1).max(MAX_STRING_LENGTH).trim(),
  toEmail: z
    .string()
    .max(MAX_STRING_LENGTH)
    .regex(EMAIL_REGEX, "Invalid email format")
    .default(""),
  toAddress: z.string().max(MAX_ADDRESS_LENGTH).trim().default(""),
  invoiceNumber: z.string().regex(INVOICE_NUMBER_REGEX, "Invalid invoice number format"),
  issueDate: z.string().regex(DATE_REGEX, "Invalid date format (YYYY-MM-DD)"),
  dueDate: z.string().regex(DATE_REGEX, "Invalid date format (YYYY-MM-DD)"),
  currency: z.enum(ALLOWED_CURRENCIES),
  notes: z.string().max(1000).trim().default(""),
  items: z
    .array(lineItemSchema)
    .min(1, "At least one line item is required")
    .max(100, "Maximum 100 line items allowed"),
  brandColor: z.string().regex(HEX_COLOR, "Invalid hex color format").default("#10b981"),
  logoUrl: z.string().default(""),
});

export type ValidatedInvoice = z.infer<typeof invoiceSchema>;

// ─── AI Suggest Request ────────────────────────────────────────────────────────

export const aiSuggestSchema = z.object({
  prompt: z
    .string()
    .min(5, "Prompt too short — minimum 5 characters")
    .max(1000, "Prompt too long — maximum 1000 characters")
    .trim()
    .refine(
      (val) => !/<script|javascript:|on\w+=/i.test(val),
      "Invalid characters detected in prompt"
    ),
  currency: z.enum(ALLOWED_CURRENCIES).default("USD"),
});

export type ValidatedAiSuggest = z.infer<typeof aiSuggestSchema>;

// ─── PDF Generation Request ────────────────────────────────────────────────────

export const pdfRequestSchema = z.object({
  invoice: invoiceSchema,
  currency: z.object({
    code: z.string().length(3),
    symbol: z.string().max(5),
    name: z.string().max(50),
  }),
  fingerprintHash: z.string().length(64).optional(),
});

export type ValidatedPdfRequest = z.infer<typeof pdfRequestSchema>;

// ─── Error helpers ────────────────────────────────────────────────────────────

/**
 * Format Zod validation errors into a safe, user-friendly message.
 * Never expose raw schema details to the client.
 */
export function formatZodError(error: z.ZodError): string {
  const issues = error.issues;
  if (issues.length === 0) return "Invalid input";
  const first = issues[0];
  const path = first.path.join(".");
  return path ? `Invalid value for "${path}": ${first.message}` : first.message;
}

/**
 * Validate and parse body with schema.
 * Returns { success, data?, error? }
 * Safe to use in API routes.
 */
export function validateBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(body);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: formatZodError(result.error) };
}
