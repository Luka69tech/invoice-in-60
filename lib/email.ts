import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendInvoiceEmailParams {
  to: string;
  invoiceNumber: string;
  customerName: string;
  amount: string;
  currency: string;
  pdfBase64: string;
}

export async function sendInvoiceEmail({
  to,
  invoiceNumber,
  customerName,
  amount,
  currency,
  pdfBase64,
}: SendInvoiceEmailParams) {
  try {
    const result = await resend.emails.send({
      from: "InvoiceGen <noreply@invoicein60.com>",
      to: [to],
      subject: `Invoice ${invoiceNumber} - Payment Confirmed`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 32px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">InvoiceGen</h1>
                <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Professional Invoicing Made Simple</p>
              </td>
            </tr>
            
            <!-- Content -->
            <tr>
              <td style="padding: 32px;">
                <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 20px; font-weight: 600;">Payment Confirmed! ✅</h2>
                
                <p style="margin: 0 0 24px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                  Hi ${customerName || "there"},
                </p>
                
                <p style="margin: 0 0 24px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                  Your payment has been successfully processed. Thank you for your purchase!
                </p>
                
                <!-- Order Details -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8fafc; border-radius: 8px; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 20px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Invoice Number</td>
                          <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: right;">${invoiceNumber}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Amount Paid</td>
                          <td style="padding: 8px 0; color: #22c55e; font-size: 14px; font-weight: 700; text-align: right;">${currency}${amount}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Status</td>
                          <td style="padding: 8px 0; color: #22c55e; font-size: 14px; font-weight: 600; text-align: right;">✓ Paid</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                
                <!-- CTA -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0;">
                      <a href="https://invoice-in-60.vercel.app/builder" style="display: inline-block; background: #22c55e; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                        Start Creating Invoices →
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background: #f1f5f9; padding: 24px; text-align: center;">
                <p style="margin: 0; color: #64748b; font-size: 12px;">
                  © 2026 InvoiceGen. All rights reserved.<br>
                  <a href="https://invoice-in-60.vercel.app/terms" style="color: #22c55e; text-decoration: none;">Terms</a> · 
                  <a href="https://invoice-in-60.vercel.app/privacy" style="color: #22c55e; text-decoration: none;">Privacy</a>
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `invoice-${invoiceNumber}.pdf`,
          content: pdfBase64,
        },
      ],
    });

    console.log("[email] Resend response:", result);
    return { success: true, data: result };
  } catch (error) {
    console.error("[email] Failed to send invoice email:", error);
    return { success: false, error };
  }
}