import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Invoice In 60 Seconds — AI-Powered PDF Invoices",
    template: "%s | InvoiceGen",
  },
  description:
    "Create stunning, professional PDF invoices in under 60 seconds. AI-powered line item suggestions, zero signup required. Free to try.",
  keywords: [
    "invoice generator",
    "free invoice maker",
    "PDF invoice",
    "freelancer invoice",
    "AI invoice",
    "invoice template",
  ],
  openGraph: {
    title: "Invoice In 60 Seconds — AI-Powered PDF Invoices",
    description:
      "Create stunning, professional PDF invoices in under 60 seconds. AI-powered suggestions. No signup.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Invoice In 60 Seconds",
    description: "Create professional PDF invoices with AI in 60 seconds.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${robotoMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
