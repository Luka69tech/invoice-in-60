import { PRODUCT, REDDIT_SUBREDDITS, TWITTER_HANDLES, SEO_KEYWORDS } from "./config";

function buildUTMLink(
  base: string,
  params: { source: string; medium: string; campaign: string; term?: string; content?: string }
): string {
  const url = new URL(base);
  Object.entries(params).forEach(([k, v]) => {
    if (v) url.searchParams.set(`utm_${k}`, v);
  });
  return url.toString();
}

function generateRedditPost(subreddit: (typeof REDDIT_SUBREDDITS)[number]): string {
  const url = buildUTMLink(PRODUCT.url, {
    source: "reddit",
    medium: "social",
    campaign: `r_${subreddit.name.replace("r/", "")}`,
  });

  const templates: Record<string, string> = {
    "r/freelance": `Title: I built an AI invoice generator that creates professional PDFs in 45 seconds — no signup, no subscription

Body:
I was tired of spending 20+ minutes formatting invoices in Google Docs. So I built this.

Describe your project once, AI fills in professional line items with rates and descriptions. One click → pixel-perfect PDF.

No signup required. 3 free invoices. Then $29 one-time.

What makes it different:
• AI auto-generates line items from a plain English description
• Upload your logo, set brand colors — every invoice looks custom
• Pay with USDT, USDC, BTC, ETH, SOL, or 14 other cryptos (no payment processor)
• Everything runs in-browser. No data stored anywhere.
• Multi-currency: USD, EUR, GBP, CAD, AUD + 10 more

For comparison:
• FreshBooks: $19/month = $228/year
• Wave: free but requires account + they own your data
• This: $29 one-time, never pay again

Looking for honest feedback. Is this useful? What would make it better?

Link: ${url}`,
    "r/Entrepreneur": `Title: $29 one-time vs $19/month: I built an invoice tool that pays for itself in 2 months

Body:
Most invoice software is either:
(a) Expensive subscriptions ($15-30/mo) that nickel-and-dime you
(b) Free tools that require accounts and sell your data

I wanted something simpler. Built an AI invoice generator where you pay once ($29) and it's done forever.

Key features:
• AI generates line items from a project description
• Professional PDF export
• 17 crypto payment options (USDT, USDC, BTC, ETH, SOL + more)
• No accounts, no data stored
• Multi-currency support

Math: FreshBooks at $19/mo costs $228/year. This costs $29 forever.

Would love feedback from fellow entrepreneurs on whether this pricing model makes sense, or if I'm leaving money on the table.

Link: ${url}`,
    "r/smallbusiness": `Title: Created a free-to-try invoice generator with AI — no signup, pays with crypto

Body:
Running a small business means invoicing. And most tools are either:
• Too expensive (monthly fees)
• Too complex (enterprise features you never use)
• Too invasive (requires account, stores your data)

Built an alternative: describe your project → AI fills in the details → export PDF.

No signup. 3 free invoices. $29 one-time to unlock unlimited.

Specific for small business:
• Multi-currency: USD, EUR, GBP, CAD, AUD, + 10 more with locale formatting
• Brand customization: logo + colors so your invoices look professional
• Crypto payments: 17 options including USDT/USDC stablecoins
• PDF export: print-ready, pixel-perfect

Link: ${url}`,
    "r/SideProject": `Title: Just launched: Invoice In 60 Seconds — AI-powered PDF invoices, pay with crypto

Body:
Shipped another weekend project: ${PRODUCT.url}

The pitch: instead of using a spreadsheet or a clunky SaaS tool, just describe your project and the AI generates professional line items.

Tech stack:
• Next.js + Tailwind
• Ollama (local AI) for line item generation
• PDF export via jsPDF
• Crypto payments (17 chains)

Since it's open-source-adjacent (runs on your own Ollama instance), privacy-conscious users can self-host.

I'm curious: would anyone actually use a self-hosted version, or is cloud-hosted fine for an invoicing tool?

Link: ${url}`,
    "r/startups": `Title: Built an invoice tool that costs $29 one-time (not $19/mo) — and accepts 17 cryptos

Body:
Every SaaS tool wants a monthly subscription. I'm trying something different.

Invoice In 60 Seconds: $29, pay once, never think about invoicing software bills again.

Built because I was paying $19/month for FreshBooks just to send 5 invoices a month.

Features:
• AI line item generation
• PDF export
• 17 crypto payment options
• No data stored on servers
• Multi-currency

For bootstrapped startups: this saves ~$200/year vs FreshBooks.

Questions for the community:
1. Does the one-time pricing model appeal to you, or do you prefer "free tier + paid" that most tools use?
2. Would you trust a smaller tool with your invoicing, or do you need enterprise backing?

Link: ${url}`,
    "r/cryptocurrency": `Title: Just added 17 crypto payment options to my invoice tool — no intermediary, no KYC

Body:
Most invoice tools don't accept crypto, or they use a payment processor that converts it immediately (defeating the purpose).

Built ${PRODUCT.url} to let clients pay freelancers directly in crypto — the full amount goes to your wallet, no middleman.

Accepted coins: USDT, USDC, BTC, ETH, SOL, BNB, MATIC, AVAX, TRX, TON, XRP, DOGE, LTC, ADA, ALGO (ERC-20, TRC-20, BEP-20, SPL, C-Chain, and more)

For freelancers who want to:
• Receive payment without a payment processor taking a cut
• Avoid KYC requirements
• Get paid in stablecoins to avoid volatility

No accounts. No intermediary. Just your wallet address.

Link: ${url}`,
    "r/accounting": `Title: Looking for feedback: invoice tool that exports clean PDFs and accepts crypto

Body:
Built ${PRODUCT.url} for freelancers who need professional invoices without the bloat.

Key features for accounting-friendly use:
• Clean PDF output (suitable for record-keeping)
• Multi-currency with locale-appropriate number formatting
• Crypto payment trail is public on-chain (easy verification)
• No data stored — client data stays private

Curious if any accountants here have clients who prefer crypto invoicing?

Link: ${url}`,
    "r/graphic_design": `Title: Invoice generator with brand customization — logo, colors, professional PDFs

Body:
Designers know: a sloppy invoice undermines an otherwise professional relationship.

Built ${PRODUCT.url} so you can:
• Upload your logo → appears on every invoice
• Set your brand colors → consistent professional look
• Describe your project → AI generates line items
• Export a PDF that looks like it came from a design agency

Free to try (3 invoices). $29 one-time for unlimited.

The goal: your invoice should be as polished as your work.

Link: ${url}`,
    "r/webdev": `Title: Built an invoice tool — describe your project, AI generates the line items

Body:
Inspired by how Cursor/GitHub Copilot changed coding: I wanted the same for invoicing.

${PRODUCT.url}

Instead of manually typing:
"Website development — 20 hours @ $150/hr = $3,000"

You just type: "Built a 5-page portfolio website with contact form and SEO"

And the AI generates professional line items.

Tech: Next.js frontend, Ollama (local LLM) for generation, jsPDF for export.

Runs entirely in-browser. No data stored. Pay once ($29) or 3 free invoices.

Link: ${url}`,
    "r/indiehackers": `Title: $29 one-time vs $19/month SaaS — does a one-off purchase model work for B2B SaaS?

Body:
Built ${PRODUCT.url} — an invoice generator with a $29 one-time price tag instead of the usual subscription.

Reasoning: freelancers and indie hackers hate monthly bills. $29 feels less risky than committing to $19/month.

But I'm wondering: does anyone actually prefer buying software this way, or do subscriptions feel "safer" because you can cancel?

Currently doing ~$0 MRR (just launched). Curious if anyone has thoughts on this pricing model for bootstrapped tools.

Link: ${url}`,
  };

  const template = templates[subreddit.name];
  if (!template) {
    return `Post to ${subreddit.name}: No specific template — use general template`;
  }
  return template;
}

function generateTwitterThread(): string[] {
  const url = buildUTMLink(PRODUCT.url, {
    source: "twitter",
    medium: "social",
    campaign: "thread_60_second_invoice",
  });

  return [
    `I spent 20 minutes formatting an invoice in Google Docs last week.

So I built an AI invoice generator that does it in 45 seconds.`,
    `Introducing Invoice In 60 Seconds.

Describe your project → AI fills in professional line items → Export PDF.

Free to try. $29 one-time.`,
    `Here's the workflow:

1. Go to ${PRODUCT.url}
2. Describe your project in plain English
3. AI auto-generates line items with rates
4. Upload your logo + set brand colors
5. One click → PDF export

No signup. No data stored.`,
    `For freelancers who invoice frequently, this saves ~2-3 hours/month.

At $50/hr freelance rate, that's $100-150/month in time savings.

Cost: $29 one-time.`,
    `Comparison with existing tools:

FreshBooks: $19/month = $228/year
Wave: free but account required
This: $29 one-time

Pays for itself in 2 months.`,
    `Payment options:
• Credit card (via crypto conversion)
• USDT, USDC, BTC, ETH, SOL
• 14 other cryptocurrencies

No payment processor middleman. Direct to your wallet.`,
    `Tech stack: Next.js + Ollama (local LLM) + jsPDF.

Runs in-browser. Your invoice data never touches my servers.

Privacy-first by design.`,
    `Try it free: ${PRODUCT.url}

3 free invoices. No credit card. No signup.

Would love your feedback. 🙏`,
  ];
}

function generateSingleTweets(): string[] {
  const url = buildUTMLink(PRODUCT.url, {
    source: "twitter",
    medium: "social",
    campaign: "single_tweet_crypto",
  });

  return [
    `Invoice in 45 seconds with AI → ${PRODUCT.url}

Pay with USDT, USDC, BTC, ETH, SOL + 14 other cryptos.

$29 one-time. No subscription. No signup.`,
    `Built an invoice generator where AI fills in the line items.

Describe: "5-page website with blog"

AI generates: Itemized scope with professional rates.

45 seconds. No signup. → ${PRODUCT.url}`,
    `Hot take: Most invoice software is overpriced.

$15-30/month for something you use 5 minutes a week.

I built a $29 one-time alternative → ${PRODUCT.url}

AI-powered. No subscription. Pay with crypto.`,
    `Freelancers: if you're still using Google Docs for invoices, you're leaving time on the table.

I built ${PRODUCT.url}

Describe your project once. AI handles the rest. PDF export in one click.`,
    `The best invoice tool is the one you actually use.

Most people avoid invoicing because it's tedious.

I made it 45 seconds: ${PRODUCT.url}

AI auto-generates everything. Pay with 17 cryptos. $29 once.`,
  ];
}

function generateColdEmails(): Array<{ subject: string; body: string; type: string }> {
  const url = buildUTMLink(PRODUCT.url, {
    source: "cold_email",
    medium: "email",
    campaign: "outreach_freelancers",
  });

  return [
    {
      type: "Initial outreach",
      subject: "Quick question about your invoicing",
      body: `Hi,

I'll keep this short — I built an AI invoice generator that creates professional PDFs in 45 seconds.

Instead of manually filling in line items, you just describe your project and AI handles the rest.

Free to try (3 invoices). Then $29 one-time.

Curious: how are you currently handling invoices?

${url}

Best,
Lukito`,
    },
    {
      type: "Follow up (3 days later)",
      subject: "Re: Quick question about your invoicing",
      body: `Hi,

Following up on my last note — just wanted to make sure it didn't get buried.

If invoicing is already solved for you, no worries.

If you're spending more than 5 minutes per invoice, this might help: ${url}

45 seconds to a professional PDF.

Best,
Lukito`,
    },
    {
      type: "Value-add outreach",
      subject: "Invoice tool that pays for itself in 2 months",
      body: `Hi,

Quick math: FreshBooks is $19/month = $228/year.

I built an alternative for $29 one-time — same features (AI line items, PDF export, multi-currency) but you pay once and never think about it again.

No signup required to try.

${url}

Would love your honest feedback.

Best,
Lukito`,
    },
    {
      type: "Crypto-angle outreach",
      subject: "Get paid in crypto without a payment processor",
      body: `Hi,

Built an invoice tool that accepts 17 different cryptocurrencies directly — USDT, USDC, BTC, ETH, SOL, and more.

Your clients pay. The full amount hits your wallet. No intermediary taking a cut.

Useful if any of your clients prefer paying in crypto.

Free to try: ${url}

Best,
Lukito`,
    },
    {
      type: "Comparison outreach",
      subject: "Replacing Google Docs invoicing",
      body: `Hi,

If you're still using Google Docs or spreadsheets for invoices, this might be worth 2 minutes of your time.

${PRODUCT.url}

Describe your project → AI fills in professional line items → One-click PDF export.

No signup. No account. No monthly fee.

3 free invoices to try it.

${url}

Best,
Lukito`,
    },
  ];
}

function generateSEOContent(): Array<{
  keyword: string;
  intent: string;
  title: string;
  metaDescription: string;
  h1: string;
  outline: string[];
  urlSlug: string;
}> {
  return [
    {
      keyword: "free invoice generator AI",
      intent: "informational",
      title: "Free AI Invoice Generator — Create Professional PDFs in 60 Seconds",
      metaDescription:
        "Generate professional invoices with AI in under 60 seconds. Free to try, no signup required. Export to PDF instantly.",
      h1: "Free AI Invoice Generator",
      urlSlug: "free-ai-invoice-generator",
      outline: [
        "H2: What is an AI Invoice Generator?",
        "H2: How to Generate an Invoice in 60 Seconds",
        "H2: Key Features of Our Free AI Invoice Generator",
        "  - AI Line Item Generation",
        "  - Brand Customization",
        "  - Multi-Currency Support",
        "  - PDF Export",
        "H2: Why Use AI for Invoicing?",
        "  - Time Savings",
        "  - Professional Formatting",
        "  - Consistency",
        "H2: Pricing — Free to Start",
        "H2: FAQ",
        "  - Is it really free?",
        "  - Do I need an account?",
        "  - What currencies are supported?",
      ],
    },
    {
      keyword: "best invoice generator for freelancers",
      intent: "commercial",
      title: "Best Invoice Generator for Freelancers in 2026 — No Subscription",
      metaDescription:
        "Top invoice generators for freelancers compared. AI-powered, one-click PDF export, no monthly fees. Try free.",
      h1: "Best Invoice Generator for Freelancers",
      urlSlug: "best-invoice-generator-freelancers",
      outline: [
        "H2: What Makes a Great Invoice Generator for Freelancers?",
        "H2: Top Invoice Generators Compared",
        "  - FreshBooks ($19/mo)",
        "  - Wave (Free but requires account)",
        "  - Hectic ($21/mo)",
        "  - Invoice In 60 Seconds ($29 one-time) ← Best value",
        "H2: Why One-Time Payment Beats Subscription",
        "H2: How to Choose the Right Tool",
        "  - Volume of invoices",
        "  - Payment method preferences",
        "  - Brand customization needs",
        "H2: FAQ",
      ],
    },
    {
      keyword: "crypto invoice payment",
      intent: "transactional",
      title: "Pay Invoices with Crypto — 17 Chains Supported",
      metaDescription:
        "Pay any invoice with USDT, USDC, BTC, ETH, SOL and 13 more cryptos. No payment processor. Direct to wallet.",
      h1: "Pay Invoices with Crypto",
      urlSlug: "crypto-invoice-payment",
      outline: [
        "H2: Why Pay Invoices with Crypto?",
        "  - No payment processor fees",
        "  - No KYC required",
        "  - Instant settlement",
        "  - Borderless",
        "H2: Supported Cryptocurrencies",
        "  - Stablecoins: USDT, USDC",
        "  - L1: BTC, ETH, SOL",
        "  - L2/Ecosystems: BNB, MATIC, AVAX, TRX, TON",
        "  - Others: XRP, DOGE, LTC, ADA, ALGO",
        "H2: Supported Networks",
        "  - ERC-20, TRC-20, BEP-20, SPL, C-Chain, and more",
        "H2: How to Pay an Invoice with Crypto",
        "H2: FAQ",
      ],
    },
    {
      keyword: "AI invoice generator",
      intent: "commercial",
      title: "AI Invoice Generator — Describe Your Project, Get a PDF",
      metaDescription:
        "Describe your project in plain English. AI generates professional line items. Export a polished PDF invoice in one click.",
      h1: "AI Invoice Generator",
      urlSlug: "ai-invoice-generator",
      outline: [
        "H2: How AI Invoice Generation Works",
        "H2: Benefits of AI for Invoicing",
        "  - Faster creation",
        "  - Professional formatting",
        "  - Reduced human error",
        "H2: Features",
        "  - Natural language input",
        "  - Automatic rate calculation",
        "  - Brand customization",
        "  - Multi-currency",
        "H2: Privacy — Everything Runs in Your Browser",
        "H2: Pricing",
        "H2: FAQ",
      ],
    },
  ];
}

const allRedditPosts = REDDIT_SUBREDDITS.map((sub) => ({
  subreddit: sub.name,
  content: generateRedditPost(sub),
  angle: sub.bestAngle,
}));

const twitterThreads = generateTwitterThread();
const singleTweets = generateSingleTweets();
const coldEmails = generateColdEmails();
const seoContent = generateSEOContent();

console.log("=".repeat(70));
console.log("MARKETING CONTENT — Invoice In 60 Seconds");
console.log(`Generated: ${new Date().toISOString()}`);
console.log("=".repeat(70));

console.log("\n## REDDIT POSTS\n");
allRedditPosts.forEach((post, i) => {
  console.log(`\n--- ${i + 1}. ${post.subreddit} ---`);
  console.log(`Angle: ${post.angle}`);
  console.log(`\n${post.content}`);
});

console.log("\n\n## TWITTER THREAD\n");
twitterThreads.forEach((tweet, i) => {
  console.log(`\nTweet ${i + 1}: ${tweet}`);
});

console.log("\n\n## SINGLE TWEETS\n");
singleTweets.forEach((tweet, i) => {
  console.log(`\n${i + 1}. ${tweet}`);
});

console.log("\n\n## COLD EMAILS\n");
coldEmails.forEach((email, i) => {
  console.log(`\n--- ${i + 1}. ${email.type} ---`);
  console.log(`Subject: ${email.subject}`);
  console.log(`\n${email.body}`);
});

console.log("\n\n## SEO CONTENT OUTLINES\n");
seoContent.forEach((page, i) => {
  console.log(`\n--- ${i + 1}. "${page.keyword}" (${page.intent}) ---`);
  console.log(`URL Slug: /${page.urlSlug}`);
  console.log(`Title: ${page.title}`);
  console.log(`Meta: ${page.metaDescription}`);
  console.log(`H1: ${page.h1}`);
  page.outline.forEach((h) => console.log(`  ${h}`));
});

console.log("\n\n## UTM LINK BUILDER\n");
const testLinks = [
  { source: "reddit", medium: "social", campaign: "launch_week" },
  { source: "twitter", medium: "social", campaign: "launch_week" },
  { source: "cold_email", medium: "email", campaign: "outreach_batch_1" },
  { source: "seo", medium: "organic", campaign: "blog_post_1" },
];
testLinks.forEach((params) => {
  console.log(`  ${buildUTMLink(PRODUCT.url, params)}`);
});
