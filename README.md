# InvoiceGen — AI-Powered PDF Invoice Generator

Create professional PDF invoices in under 60 seconds with AI-powered line item suggestions. No signup required.

**Stack:** Next.js 14 · Tailwind CSS · Stripe · Ollama (AI) · Vercel

## Features

- ⚡ **AI Line Items** — Describe your project in plain English, AI auto-fills professional line items
- 🎨 **Brand Customization** — Logo, colors, custom fields
- 📄 **PDF Export** — Pixel-perfect, print-ready PDF in one click
- 🌍 **Multi-Currency** — USD, EUR, GBP, CAD, AUD, JPY, INR, BRL + more
- 🔒 **Privacy First** — No accounts, no data stored on servers
- 💳 **Stripe Checkout** — One-time payment, instant access

## Quick Start

```bash
git clone <repo-url>
cd invoice-in-60
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in your Stripe keys from https://dashboard.stripe.com/test/apikeys

# Optional: Run Ollama locally for AI features
ollama serve
ollama pull minimax-m2.5:cloud

# Development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (pk_test_...) |
| `STRIPE_SECRET_KEY` | Stripe secret key (sk_test_...) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret (whsec_...) |
| `NEXT_PUBLIC_PRICE_STARTER` | Stripe price ID for Starter ($29) |
| `NEXT_PUBLIC_PRICE_PRO` | Stripe price ID for Pro ($49) |
| `NEXT_PUBLIC_OLLAMA_URL` | Ollama API URL (default: http://localhost:11434) |
| `NEXT_PUBLIC_APP_URL` | Production URL for Stripe redirects |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Custom Domain

Add your domain in Vercel project settings → Domains. DNS configuration:
```
A record: @ → 76.76.21.21
CNAME: www → cname.vercel-dns.com
```

## Stripe Setup

1. Create a product in [Stripe Dashboard](https://dashboard.stripe.com/test/products)
2. Create two prices: $29 (Starter) and $49 (Pro)
3. Add price IDs to environment variables
4. Set up webhook endpoint: `https://yourdomain.com/api/webhook`
5. Enable events: `checkout.session.completed`

## AI Setup

Uses Ollama with `minimax-m2.5:cloud` model. For production, replace with OpenAI:

```typescript
// lib/ai.ts — swap to OpenAI
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
```

## Project Structure

```
├── app/
│   ├── page.tsx           # Landing page
│   ├── builder/page.tsx   # Invoice builder (core feature)
│   ├── checkout/          # Stripe checkout
│   ├── success/          # Post-payment confirmation
│   ├── dashboard/        # Pro user dashboard
│   └── api/
│       ├── checkout/    # Stripe checkout session
│       ├── webhook/    # Stripe webhook handler
│       ├── generate-pdf/# Server-side PDF generation
│       └── ai-suggest/ # Ollama AI line item suggestions
├── lib/
│   ├── pdf-generator.ts  # HTML → PDF conversion
│   └── utils.ts         # Shared utilities
├── .github/workflows/ci.yml  # GitHub Actions CI/CD
└── vercel.json         # Vercel deployment config
```

## License

MIT — do whatever you want with it.
