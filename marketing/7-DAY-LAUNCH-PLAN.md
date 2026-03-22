# Invoice In 60 Seconds — 7-Day Launch Plan

**Goal: $500 in 7 days via organic marketing**
**Product:** https://invoice-in-60.vercel.app
**Price:** $29 one-time (3 free invoices to try)

---

## The Math

- Need ~17-18 paying customers at $29
- Current conversion rate estimate: 1-3% of visitors
- Target: 500-1,000 unique visitors over 7 days
- Target: 20-50 email subscribers / Reddit upvoters

---

## Channel Strategy

### 1. Reddit (Highest ROI for bootstrapped projects)
- **6 subreddits** — staggered daily posts
- **Best time to post:** 6-9 AM EST (US daytime), Tuesday-Thursday
- **Format:** Show HN style, honest pitch, no spam
- **Karma requirements:** 50-100 (build up with genuine participation first)
- **Target:** 500-2,000 views per post = ~50-200 clicks

**Subreddits:**
1. `r/freelance` — "20 minutes → 45 seconds" angle
2. `r/smallbusiness` — "Professional invoices, no signup" angle
3. `r/SideProject` — Show HN / launch announcement
4. `r/Entrepreneur` — "One-time vs subscription" angle
5. `r/webdev` — "AI generates line items" angle
6. `r/indiehackers` — Pricing model discussion

**Reddit post formula:**
- Honest about what it is
- Show the specific problem solved
- Price transparency
- Ask for feedback (engagement = visibility)
- No affiliate links, no spam

### 2. Twitter/X (Tech + crypto audience)
- **Daily threads** for 7 days
- **Single tweets** between threads
- **Engagement:** Reply to trending convos about invoicing/freelancing
- **Target:** 10-50 followers gained, 200-500 impressions per post

**Thread topics:**
- Day 1: "I spent 20 minutes on an invoice last week..."
- Day 2: "Why I chose one-time pricing..."
- Day 3: "Pay with 17 cryptos — no middleman"
- Day 4: "The math: $29 vs $19/month"
- Day 5: "AI-generated line items demo"
- Day 6: "Privacy-first: runs in your browser"
- Day 7: "Results after 1 week — honest recap"

**Tweet formula:**
- Hook in first sentence (counterintuitive or relatable)
- Specific numbers/details
- CTA with URL
- No threads that are just promo

### 3. Cold Email (Direct outreach)
- **40-50 emails per day** over 3 days
- **Target segments:**
  1. Freelancers on LinkedIn (search: "open to work" + job title)
  2. Small agency owners on Twitter
  3. Indie hackers on IH/discourses
- **Tools:** None needed — manual Gmail outreach is fine for 50 emails
- **Follow-up:** 3 days after initial email
- **Personalization:** 1 sentence referencing their work

**Email templates** (see `marketing-content.txt`):
- Initial outreach: Value-add framing
- Follow up: Keep it short
- Value-add: Math comparison (FreshBooks vs this)
- Crypto angle: For crypto-native audiences
- Comparison: Google Docs alternative

**Avoid spam:**
- No BCC
- Real sender email (Gmail is fine for cold outreach)
- 50 emails/day is safe under Gmail's limit

### 4. SEO / Blog (Long-term compounding)
- **4 blog posts** targeting long-tail keywords
- These won't drive traffic in 7 days but set up for Month 2
- Publish on Medium (for backlinks) and own site

**Target keywords:**
1. "free invoice generator AI" — informational
2. "best invoice generator for freelancers" — commercial
3. "crypto invoice payment" — transactional
4. "AI invoice generator" — commercial

---

## Day-by-Day Execution

### Day 1 — Launch Day
- [ ] Post to `r/SideProject` (morning)
- [ ] Post to `r/Entrepreneur` (morning)
- [ ] Twitter thread: "I spent 20 minutes on an invoice..."
- [ ] Twitter single tweet: Crypto payment angle
- [ ] Send 20 cold emails to freelancers
- [ ] Post to Product Hunt (if launch is approved)

### Day 2 — Distribution
- [ ] Post to `r/freelance` (morning)
- [ ] Post to `r/smallbusiness` (afternoon)
- [ ] Twitter: "Why one-time pricing..."
- [ ] Send 20 cold emails
- [ ] Reply to all Reddit comments + Twitter replies

### Day 3 — Engagement
- [ ] Post to `r/webdev` (morning)
- [ ] Twitter: "17 cryptos, no middleman"
- [ ] Follow up on day 1 cold emails
- [ ] Send 20 new cold emails
- [ ] Engage on Reddit: reply to other people's posts

### Day 4 — Momentum
- [ ] Post to `r/indiehackers` (morning)
- [ ] Twitter thread: "The math: $29 vs $19/month"
- [ ] Follow up on day 2-3 emails
- [ ] Send 20 new cold emails

### Day 5 — Refinement
- [ ] Post to `r/accounting` or `r/graphic_design`
- [ ] Twitter: Single tweet about invoicing pain points
- [ ] Analyze: Which channels drove traffic?
- [ ] Double down on what works

### Day 6 — Outreach
- [ ] Twitter thread: "AI-generated line items demo"
- [ ] Send 30 cold emails (scaling up)
- [ ] Follow up on all previous emails
- [ ] Post to `r/startups` if not done

### Day 7 — Recap
- [ ] Twitter: "Honest recap after 1 week"
- [ ] Send 20 emails + all follow-ups
- [ ] Analyze results
- [ ] Publish SEO blog post #1

---

## Metrics to Track

| Metric | Target | How to Measure |
|---|---|---|
| Unique visitors | 500-1,000 | Vercel analytics / umami |
| Reddit upvotes | 10-50 per post | Manual |
| Twitter followers gained | 10-50 | Twitter analytics |
| Email opens | 30-50% | Open rate |
| Free invoice creations | 50-200 | Check /builder |
| Checkout page views | 20-50 | Vercel analytics |
| Paid conversions | 1-3% of checkout | Payment confirmations |

---

## Traffic Sources (Expected)

| Source | Expected Traffic | Conversion Rate |
|---|---|---|
| Reddit | 300-600 clicks | 1-2% |
| Twitter | 100-300 impressions | 0.5-1% |
| Cold email | 20-50 opens | 1-2% click |
| SEO/Organic | 0-50 (early) | 1-3% |
| Direct | 50-100 | 2-3% |

---

## What NOT to Do

- **Don't post the same content everywhere** — customize per subreddit
- **Don't delete critical comments** — respond honestly
- **Don't beg for upvotes** — let the content speak
- **Don't spam** — no DMs to strangers, no bot activity
- **Don't ignore feedback** — iterate quickly
- **Don't give up after Day 1** — compound effects kick in Day 3-5

---

## Quick Start Commands

```bash
# Generate all marketing content
cd marketing && npm run generate

# Preview Reddit posts (dry run)
npm run reddit:dry-run

# Post to Reddit (live)
npm run reddit:post

# Post to specific subreddit
npm run reddit:post:r/freelance
```

---

## Environment Variables Needed for Posting

```bash
# Reddit API (get from https://www.reddit.com/prefs/apps)
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_USERNAME=your_username
REDDIT_PASSWORD=your_password

# Optional: Email (for cold email tracking)
# Use Gmail with app password or a service like Resend
```

---

## Legal / Ethics Notes

- Reddit's self-promotion rules: contribute genuinely, don't only post your own stuff
- Cold email: Only email people who have publicly shared their email or shown interest
- Twitter: Don't use auto-follow/unfollow bots
- No fake reviews or testimonials
- Be honest about what the product does
