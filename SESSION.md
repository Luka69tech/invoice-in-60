# Invoice In 60 — Session Notes
## 2026-03-29

---

## What was built / fixed today

### Monitoring System
- `lib/telegram.ts` — sendTelegram() function for alerts
- `lib/monitoring.ts` — health check helpers, rate limiting, shouldAlert()
- `app/api/cron/monitor/route.ts` — protected with CRON_SECRET, pings /api/health every run
- `app/api/cron/digest/route.ts` — protected with CRON_SECRET, sends Telegram digest
- `app/admin/monitoring/page.tsx` — dark admin dashboard, show/hide password toggle
- `app/api/admin/login/route.ts` — password auth
- `app/api/admin/monitoring-data/route.ts` — protected API for dashboard data

### Security Hardening
- Webhook signature verification restored in `app/api/webhooks/paymento/route.ts`
- ReturnUrl template literal fix in `app/checkout/page.tsx`
- CSP header added to `next.config.mjs`
- `CRON_SECRET` Bearer token auth for all cron endpoints
- Rate limiting on webhook (50 req/min per IP)
- Invalid webhook signature tracking → Telegram alert after 3+ in 5min
- `.env.example` fully documented with all required vars

### CI/CD
- `.eslintrc.json` created to prevent interactive prompts in CI
- GitHub Actions workflow: lint → build → deploy-production
- Vercel Hobby cron limit identified — removed crons from vercel.json
- Requires Vercel Pro for scheduled cron jobs

### Pricing Toggle (messy iteration — documented)
The pricing toggle went through ~15 iterations trying to get the dot to slide correctly.
Final working implementation:
- `useState(false)` → `const [isAnnual, setIsAnnual] = useState(false)`
- Button: `className="relative h-9 w-16 rounded-full..." style={{ backgroundColor: isAnnual ? '#10b981' : '#6b7280' }}`
- Dot: `style={{ transform: isAnnual ? 'translateX(32px)' : 'translateX(4px)' }}`
- Monthly = dot left (4px), Annual = dot right (32px)

### Pricing Page
- Monthly/Annual toggle with green "Save 27%/30%" badges
- Best Value badge swaps between Pro (monthly) and Business (annual)
- Both /pricing and homepage /#pricing sections now in sync

### Homepage Pricing Section Fixes
Badges were being cut off — tried many approaches:
1. `pt-4` on grid — not enough
2. `pt-10` on grid — not enough
3. `overflow-visible` on section — not enough
4. `overflow-visible` on grid + `relative` on section — not enough
5. Moved badges inside card with `mb-3` — INCONSISTENT with /pricing page
6. Final fix: `overflow-visible` on grid + kept absolute positioning + `relative` on section + `mt-10` on grid — but badges still might be clipped, need browser verification

### Other Fixes
- `lib/redis.ts` — Upstash Redis `zrange` with `withScores` fixed
- Admin password trailing newline issue — removed and re-added cleanly
- Vercel env vars set: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, ADMIN_PASSWORD, CRON_SECRET, RESEND_API_KEY
- Resend tested — email sent to luka17wisbq71@gmail.com successfully

---

## Current Feature Status

| Feature | Status |
|---------|--------|
| Site up & running | ✅ Production |
| PDF generation | ✅ Working |
| Paymento webhook | ✅ Signature verified |
| Email receipts (Resend) | ✅ Working |
| Telegram monitoring alerts | ✅ Working |
| Admin dashboard | ✅ Working (password protected) |
| Health endpoint | ✅ /api/health returns 200 |
| CI/CD pipeline | ✅ All green |
| Vercel crons (monitor every 5min) | ❌ Not scheduled (Hobby limit) |
| Vercel crons (digest every 2h) | ❌ Not scheduled (Hobby limit) |
| Pricing toggle | ✅ Working on /pricing |
| Homepage pricing section | ⚠️ May need browser check (badges) |
| Marketing (Reddit, Twitter) | ❌ Not done |
| Analytics (PostHog/Vercel) | ❌ Not done |
| Uptime monitoring setup | ⚠️ Routes exist, need external cron |

---

## Environment Variables on Vercel (Production)

```
TELEGRAM_BOT_TOKEN    = 8336102003:AAF4Wwp-CaqbUB7KUobaZ6EbC88h8q058vM
TELEGRAM_CHAT_ID      = 8767322823
ADMIN_PASSWORD        = Auh!*@2141Ddn!9Pawuj13
CRON_SECRET           = j4FaNqkxfYRnmPBbI2IRcWQvKw/WIc6bzo7iLkqeXc8=
RESEND_API_KEY        = re_dpPACdgY_FinKbdiTN1nxd8YQsrk2jdsT
UPSTASH_REDIS_REST_URL = [set]
UPSTASH_REDIS_REST_TOKEN = [set]
PAYMENTO_API_KEY       = [set]
PAYMENTO_SECRET_KEY    = [set]
```

---

## Cron Jobs (via cron-job.org — needs setup)

Monitor endpoint: `curl -H "Authorization: Bearer j4FaNqkxfYRnmPBbI2IRcWQvKw/WIc6bzo7iLkqeXc8=" https://invoice-in-60.vercel.app/api/cron/monitor`
Digest endpoint: `curl -H "Authorization: Bearer j4FaNqkxfYRnmPBbI2IRcWQvKw/WIc6bzo7iLkqeXc8=" https://invoice-in-60.vercel.app/api/cron/digest`

Schedule on cron-job.org:
- Monitor: every 5 minutes
- Digest: every 2 hours

---

## What Still Needs to Be Done

1. **Verify homepage pricing badges** — open in browser, check if "Most Popular" / "Best Value" are fully visible or still clipped
2. **Set up cron-job.org** — free service to call cron endpoints (monitor + digest)
3. **Marketing** — Reddit posts, Twitter thread about launch
4. **Analytics** — PostHog or Vercel Analytics
5. **Full checkout test** — Paymento test mode, complete end-to-end payment
6. **Mobile testing** — responsive check in browser/device
7. **Git garbage collection** — `git prune` warning keeps appearing, too many unreachable loose objects

---

## Git Log (last 20 commits)

a7e0526 chore: remove debug route, cron auth fixed
3181ef1 chore: add debug endpoint
6ab3ede chore: trigger redeploy for CRON_SECRET
7ff5d04 fix: move pricing cards down to show badges fully
2d5a209 fix: pricing section offset from navbar, scroll margin top
7b41269 fix: homepage pricing badges match /pricing page implementation
eecb972 fix: move badges inside cards instead of absolute positioned above
9467466 fix: pricing badges fully visible on homepage, remove overflow hidden
939e43c fix: pricing badges cut off on homepage section
1ccf341 fix: best value badge and outline switches between Pro/Business based on annual/monthly toggle
a0fceb2 fix: toggle dot direction fixed
a58f6fd fix: replace toggle with working inline style implementation
9ecf960 fix: toggle dot starts next to Monthly (left), slides right to Annual
154b75c fix: toggle dot slides right on annual, left on monthly (inverted)
b3ae0dc fix: unify toggle dot CSS across all pages (pricing, homepage, checkout)
ab44567 fix: pricing toggle direction and sync homepage pricing section
d55f0e7 fix: pricing toggle monthly/annual, add CRON_SECRET to env example
f4a20a8 fix: add Content-Security-Policy header
b3d8f07 fix: add CRON_SECRET auth to monitor and digest endpoints
a4e8342 fix: add eslintrc.json to prevent interactive prompt in CI

---

*Session ended: 2026-03-29 22:18 GMT+2*