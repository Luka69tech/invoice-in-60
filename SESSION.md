# Invoice In 60 — Project Summary

**Last Updated:** 2026-03-28
**Owner:** Lukito (solo founder, Georgia)
**Stack:** Next.js 14 + TypeScript + Tailwind + Paymento + Resend + Upstash Redis + Ollama

---

## Current State

### Live
- **URL:** https://invoice-in-60.vercel.app
- **Repo:** https://github.com/Luka69tech/invoice-in-60

### Pricing Model (Live)
| Plan | Invoices | Price |
|------|----------|-------|
| Free | 3/month | $0 |
| Pro | 35/month | $9/mo or $79/yr |
| Business | Unlimited | $19/mo or $159/yr |

### Recent Work
- Freemium pricing model implemented
- Paymento webhook fixed (signature verification)
- Resend email integration for payment confirmations
- Pricing pages: homepage, /pricing, /checkout updated
- Usage system: 3 free → 35 Pro → unlimited Business
- UI polish: toggle switches fixed, upgrade modal updated

### Known Issues Fixed
- Share URL Unicode handling
- Upgrade modal showing before field validation
- Old $29 one-time pricing removed everywhere

---

## Files & Locations
- **Project:** `~/invoice-in-60/`
- **Key files:** `lib/usage.ts`, `app/builder/page.tsx`, `app/pricing/page.tsx`, `app/checkout/page.tsx`

---

## Next Steps (If Continuing)
1. Test payment flow end-to-end
2. Marketing: Reddit posts, Twitter thread
3. Add analytics (PostHog or Vercel)
4. Set up uptime monitoring
