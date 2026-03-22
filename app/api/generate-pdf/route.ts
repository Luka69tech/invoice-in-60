import { NextRequest, NextResponse } from "next/server";
import { generateInvoicePdf } from "@/lib/pdf-generator";

export async function POST(req: NextRequest) {
  try {
    const { invoice, currency } = await req.json();

    if (!invoice) {
      return NextResponse.json({ error: "Invoice data required" }, { status: 400 });
    }

    const pdfBuffer = await generateInvoicePdf(invoice, currency);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${invoice.invoiceNumber || "export"}.pdf"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json(
      { error: "PDF generation failed. Make sure you're running the build server (not dev)." },
      { status: 500 }
    );
  }
}
