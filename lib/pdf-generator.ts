/**
 * PDF Generator — Invoice to PDF
 * Uses jsPDF for serverless-compatible PDF generation
 *
 * Security hardening:
 * - All user input is sanitized before PDF generation
 * - Invoice data validated with Zod schema before processing
 */

import { jsPDF } from "jspdf";

interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: string;
  rate: string;
  amount: string;
}

export interface InvoiceData {
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  toName: string;
  toEmail: string;
  toAddress: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  notes: string;
  items: LineItem[];
  brandColor: string;
  logoUrl: string;
}

function sanitizeText(str: unknown): string {
  if (str === null || str === undefined) return "";
  return String(str).slice(0, 500);
}

function safeNumber(value: unknown, fallback = 0): number {
  const n = parseFloat(String(value));
  if (isNaN(n) || n < 0) return fallback;
  return n;
}

function formatCurrency(amount: number, symbol: string): string {
  return `${symbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export async function generateInvoicePdf(
  invoice: InvoiceData,
  currency: CurrencyInfo,
  options?: { showWatermark?: boolean }
): Promise<Buffer> {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const brandColor = invoice.brandColor || "#10b981";
    const rgb = hexToRgb(brandColor);
    doc.setDrawColor(rgb.r, rgb.g, rgb.b);
    doc.setTextColor(rgb.r, rgb.g, rgb.b);

    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(sanitizeText(invoice.fromName || "Your Business"), margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    if (invoice.fromEmail) {
      doc.text(sanitizeText(invoice.fromEmail), margin, y);
      y += 5;
    }
    if (invoice.fromAddress) {
      const addressLines = doc.splitTextToSize(sanitizeText(invoice.fromAddress), contentWidth * 0.4);
      doc.text(addressLines, margin, y);
      y += addressLines.length * 4;
    }
    y += 10;

    doc.setFontSize(32);
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
    doc.text("INVOICE", pageWidth - margin, margin + 10, { align: "right" });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const metaY = margin + 20;
    doc.text(`#${sanitizeText(invoice.invoiceNumber || "000000")}`, pageWidth - margin, metaY, { align: "right" });
    doc.text(`Issue: ${sanitizeText(invoice.issueDate || "")}`, pageWidth - margin, metaY + 5, { align: "right" });
    doc.text(`Due: ${sanitizeText(invoice.dueDate || "")}`, pageWidth - margin, metaY + 10, { align: "right" });
    doc.text(`Currency: ${currency.code}`, pageWidth - margin, metaY + 15, { align: "right" });

    y = Math.max(y, metaY + 30);

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 15;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO", margin, y);
    y += 6;

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(sanitizeText(invoice.toName || "Client"), margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    if (invoice.toEmail) {
      doc.text(sanitizeText(invoice.toEmail), margin, y);
      y += 5;
    }
    if (invoice.toAddress) {
      const toAddressLines = doc.splitTextToSize(sanitizeText(invoice.toAddress), contentWidth * 0.4);
      doc.text(toAddressLines, margin, y);
      y += toAddressLines.length * 4;
    }

    y += 15;

    doc.setFillColor(245, 245, 245);
    doc.rect(margin, y - 3, contentWidth, 8, "F");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "bold");
    doc.text("DESCRIPTION", margin + 2, y + 2);
    doc.text("QTY", margin + contentWidth * 0.5, y + 2);
    doc.text("RATE", margin + contentWidth * 0.65, y + 2);
    doc.text("AMOUNT", pageWidth - margin - 2, y + 2, { align: "right" });
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    let subtotal = 0;
    for (const item of invoice.items.slice(0, 50)) {
      const qty = safeNumber(item.quantity);
      const rate = safeNumber(item.rate);
      const amount = safeNumber(item.amount);
      subtotal += amount;

      const descLines = doc.splitTextToSize(sanitizeText(item.description) || "—", contentWidth * 0.45);
      doc.text(descLines.slice(0, 2), margin, y);
      
      doc.text(String(qty), margin + contentWidth * 0.5, y);
      doc.text(formatCurrency(rate, currency.symbol), margin + contentWidth * 0.65, y);
      doc.text(formatCurrency(amount, currency.symbol), pageWidth - margin - 2, y, { align: "right" });
      
      y += Math.max(descLines.slice(0, 2).length * 4, 6);

      if (y > 250) {
        doc.addPage();
        y = margin;
      }
    }

    y += 5;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin + contentWidth * 0.6, y, pageWidth - margin, y);
    y += 8;

    doc.setFontSize(11);
    doc.text("Subtotal:", margin + contentWidth * 0.6, y);
    doc.text(formatCurrency(subtotal, currency.symbol), pageWidth - margin - 2, y, { align: "right" });
    y += 6;

    const tax = 0;
    doc.text("Tax (0%):", margin + contentWidth * 0.6, y);
    doc.text(formatCurrency(tax, currency.symbol), pageWidth - margin - 2, y, { align: "right" });
    y += 8;

    doc.setDrawColor(rgb.r, rgb.g, rgb.b);
    doc.setLineWidth(0.5);
    doc.line(margin + contentWidth * 0.6, y, pageWidth - margin, y);
    y += 6;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
    doc.text("Total:", margin + contentWidth * 0.6, y);
    doc.text(`${formatCurrency(subtotal + tax, currency.symbol)} ${currency.code}`, pageWidth - margin - 2, y, { align: "right" });

    if (invoice.notes) {
      y += 20;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "bold");
      doc.text("NOTES", margin, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      const notesLines = doc.splitTextToSize(sanitizeText(invoice.notes), contentWidth);
      doc.text(notesLines.slice(0, 10), margin, y);
    }

    y = 280;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    
    // Watermark for free plan
    if (!options?.showWatermark) {
      doc.text("Created with Invoice In 60 — Create yours free at InvoiceIn60.com", pageWidth / 2, y, { align: "center" });
    } else {
      doc.text("Generated with InvoiceGen", pageWidth / 2, y, { align: "center" });
    }

    const pdfBuffer = doc.output("arraybuffer");
    return Buffer.from(pdfBuffer);
  } catch (err) {
    console.error("PDF generation error:", err);
    throw new Error("PDF generation failed. Please try again.");
  }
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 16, g: 185, b: 129 };
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}