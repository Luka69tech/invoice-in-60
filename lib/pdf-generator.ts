import fs from "fs";
import path from "path";

interface CurrencyInfo {
  code: string;
  symbol: string;
}

interface LineItem {
  id: string;
  description: string;
  quantity: string;
  rate: string;
  amount: string;
}

interface InvoiceData {
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

function formatCurrency(amount: number, currency: CurrencyInfo): string {
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${currency.symbol}${formatted}`;
}

function buildInvoiceHtml(invoice: InvoiceData, currency: CurrencyInfo): string {
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + parseFloat(item.amount || "0"),
    0
  );
  const tax = subtotal * 0;
  const total = subtotal + tax;
  const hex = invoice.brandColor || "#22c55e";
  const rgb = hexToRgb(hex);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #1e293b; padding: 48px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
  .brand { font-size: 28px; font-weight: 800; color: ${hex}; letter-spacing: -0.5px; }
  .logo-box { width: 48px; height: 48px; border-radius: 12px; background: ${hex}; }
  .invoice-title { font-size: 36px; font-weight: 800; color: ${hex}; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 8px; }
  .invoice-meta { text-align: right; font-size: 13px; color: #64748b; line-height: 1.8; }
  .invoice-meta strong { color: #334155; }
  .parties { display: flex; gap: 48px; margin-bottom: 40px; }
  .party-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; margin-bottom: 8px; }
  .party-name { font-weight: 700; font-size: 15px; color: #0f172a; margin-bottom: 4px; }
  .party-detail { font-size: 13px; color: #64748b; line-height: 1.6; white-space: pre-wrap; }
  .divider { height: 2px; background: ${hex}20; margin: 0 0 24px 0; border: none; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
  th { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; padding: 0 12px 12px 0; text-align: left; border-bottom: 2px solid ${hex}20; }
  th:last-child { text-align: right; }
  td { padding: 12px 12px 12px 0; border-bottom: 1px solid #f1f5f9; vertical-align: top; font-size: 13px; color: #334155; }
  td:last-child { text-align: right; font-family: 'Courier New', monospace; }
  .qty, .rate { text-align: center !important; font-family: 'Courier New', monospace; }
  .amount-col { text-align: right; font-weight: 600; color: #0f172a !important; font-family: 'Courier New', monospace; }
  .totals { display: flex; justify-content: flex-end; }
  .totals-table { width: 280px; }
  .totals-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
  .totals-row.total { border-bottom: none; border-top: 2px solid ${hex}; margin-top: 4px; padding-top: 12px; font-weight: 700; font-size: 16px; color: ${hex}; }
  .notes { margin-top: 32px; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid ${hex}; }
  .notes-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 6px; }
  .notes-text { font-size: 13px; color: #64748b; white-space: pre-wrap; line-height: 1.6; }
  .footer { margin-top: 48px; text-align: center; font-size: 11px; color: #94a3b8; }
</style>
</head>
<body>

<div class="header">
  <div>
    <div class="brand">${invoice.fromName || "Your Business"}</div>
    ${invoice.fromEmail ? `<div class="party-detail">${invoice.fromEmail}</div>` : ""}
    ${invoice.fromAddress ? `<div class="party-detail">${invoice.fromAddress}</div>` : ""}
  </div>
  <div class="logo-box"></div>
</div>

<div style="margin-bottom: 40px;">
  <div class="invoice-title">Invoice</div>
  <div class="invoice-meta">
    <div><strong>#${invoice.invoiceNumber}</strong></div>
    <div>Issue Date: ${invoice.issueDate}</div>
    <div>Due Date: ${invoice.dueDate}</div>
    <div>Currency: ${currency.code}</div>
  </div>
</div>

<div class="parties">
  <div>
    <div class="party-label">Bill To</div>
    <div class="party-name">${invoice.toName || "Client Name"}</div>
    ${invoice.toEmail ? `<div class="party-detail">${invoice.toEmail}</div>` : ""}
    ${invoice.toAddress ? `<div class="party-detail">${invoice.toAddress}</div>` : ""}
  </div>
</div>

<hr class="divider">

<table>
  <thead>
    <tr>
      <th style="width: 56%">Description</th>
      <th class="qty" style="width: 12%">Qty</th>
      <th class="rate" style="width: 16%">Rate</th>
      <th style="width: 16%">Amount</th>
    </tr>
  </thead>
  <tbody>
    ${invoice.items
      .map(
        (item) => `
    <tr>
      <td>${item.description || "—"}</td>
      <td class="qty" style="text-align:center">${item.quantity || "0"}</td>
      <td class="rate" style="text-align:right">${formatCurrency(parseFloat(item.rate || "0"), currency)}</td>
      <td class="amount-col">${formatCurrency(parseFloat(item.amount || "0"), currency)}</td>
    </tr>`
      )
      .join("")}
  </tbody>
</table>

<div class="totals">
  <div class="totals-table">
    <div class="totals-row">
      <span>Subtotal</span>
      <span>${formatCurrency(subtotal, currency)}</span>
    </div>
    <div class="totals-row">
      <span>Tax (0%)</span>
      <span>${formatCurrency(tax, currency)}</span>
    </div>
    <div class="totals-row total">
      <span>Total Due</span>
      <span>${formatCurrency(total, currency)} ${currency.code}</span>
    </div>
  </div>
</div>

${invoice.notes ? `
<div class="notes">
  <div class="notes-label">Notes &amp; Payment Terms</div>
  <div class="notes-text">${invoice.notes}</div>
</div>
` : ""}

<div class="footer">
  <p>Generated with InvoiceGen — invoicegen.com</p>
</div>

</body>
</html>`;
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "34, 197, 94";
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

export async function generateInvoicePdf(
  invoice: InvoiceData,
  currency: { code: string; symbol: string }
): Promise<Buffer> {
  const html = buildInvoiceHtml(invoice, currency);

  try {
    const htmlPdf = require("html-pdf-node");
    const file = { content: html };
    const options = {
      format: "A4",
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    };

    const pdfBufferArray = await htmlPdf.fileToPdf(file, options);
    return Buffer.from(pdfBufferArray);
  } catch {
    const puppeteer = require("puppeteer");
    const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
    await browser.close();
    return Buffer.from(pdfBuffer);
  }
}
