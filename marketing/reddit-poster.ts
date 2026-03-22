// @ts-nocheck
/**
 * Reddit Marketing Automation Script
 * 
 * Posts marketing content to Reddit subreddits.
 * Requires: reddit username, password, client ID, and client secret.
 * 
 * Setup:
 * 1. Go to https://www.reddit.com/prefs/apps
 * 2. Create a script app
 * 3. Set REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD env vars
 * 
 * Usage:
 *   node reddit-poster.js                    # Post to all configured subreddits
 *   node reddit-poster.js --dry-run          # Preview posts without posting
 *   node reddit-poster.js --subreddit=r/freelance  # Post to specific subreddit
 */

import { readFileSync } from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const TARGET_SUB = args.find((a) => a.startsWith("--subreddit="))?.split("=")[1];

const PRODUCT_URL = "https://invoice-in-60.vercel.app";
const SUBREDDITS = [
  { name: "r/freelance", karmaReq: 50, type: "share" },
  { name: "r/smallbusiness", karmaReq: 100, type: "share" },
  { name: "r/SideProject", karmaReq: 50, type: "showhn" },
  { name: "r/Entrepreneur", karmaReq: 100, type: "discussion" },
  { name: "r/webdev", karmaReq: 50, type: "show" },
  { name: "r/indiehackers", karmaReq: 100, type: "feedback" },
];

const POSTS = {
  "r/freelance": {
    title: "I built an AI invoice generator that creates professional PDFs in 45 seconds — no signup, no subscription",
    type: "text",
    body: `I was tired of spending 20+ minutes formatting invoices in Google Docs. So I built this.

**Describe your project once, AI fills in professional line items with rates and descriptions. One click → pixel-perfect PDF.**

No signup required. 3 free invoices. Then $29 one-time.

**What makes it different:**
• AI auto-generates line items from a plain English description
• Upload your logo, set brand colors — every invoice looks custom
• Pay with USDT, USDC, BTC, ETH, SOL, or 14 other cryptos
• Everything runs in-browser. No data stored anywhere.
• Multi-currency: USD, EUR, GBP, CAD, AUD + 10 more

**For comparison:**
• FreshBooks: $19/month = $228/year
• Wave: free but requires account
• This: $29 one-time, never pay again

Looking for honest feedback. Is this useful? What would make it better?

[Try it free](${PRODUCT_URL})`,
  },
  "r/smallbusiness": {
    title: "Created a free-to-try invoice generator with AI — no signup, pays with crypto",
    type: "text",
    body: `Running a small business means invoicing. Most tools are either too expensive, too complex, or too invasive.

I built an alternative: **describe your project → AI fills in the details → export PDF.**

No signup. 3 free invoices. $29 one-time to unlock unlimited.

**Specific for small business:**
• Multi-currency: USD, EUR, GBP, CAD, AUD + 10 more with locale formatting
• Brand customization: logo + colors so your invoices look professional
• Crypto payments: 17 options including USDT/USDC stablecoins
• PDF export: print-ready, pixel-perfect

[Try it free](${PRODUCT_URL})`,
  },
  "r/SideProject": {
    title: "Just launched: Invoice In 60 Seconds — AI-powered PDF invoices, pay with crypto",
    type: "text",
    body: `Shipped another weekend project: ${PRODUCT_URL}

**The pitch:** instead of using a spreadsheet or a clunky SaaS tool, just describe your project and the AI generates professional line items.

**Tech stack:**
• Next.js + Tailwind
• Ollama (local AI) for line item generation  
• jsPDF for export
• Crypto payments (17 chains)

Since it runs on your own Ollama instance, privacy-conscious users can self-host.

I'm curious: would anyone actually use a self-hosted version, or is cloud-hosted fine for an invoicing tool?

[Try it free](${PRODUCT_URL})`,
  },
  "r/Entrepreneur": {
    title: "$29 one-time vs $19/month: I built an invoice tool that pays for itself in 2 months",
    type: "text",
    body: `Most invoice software is either expensive subscriptions or free tools that require accounts.

I wanted something simpler. Built an AI invoice generator where you pay once ($29) and it's done forever.

**Key features:**
• AI generates line items from a project description
• Professional PDF export
• 17 crypto payment options (USDT, USDC, BTC, ETH, SOL + more)
• No accounts, no data stored
• Multi-currency support

**Math:** FreshBooks at $19/mo costs $228/year. This costs $29 forever.

Would love feedback from fellow entrepreneurs on whether this pricing model makes sense.

[Try it free](${PRODUCT_URL})`,
  },
  "r/webdev": {
    title: "Built an invoice tool — describe your project, AI generates the line items",
    type: "text",
    body: `Inspired by how Cursor/GitHub Copilot changed coding: I wanted the same for invoicing.

**${PRODUCT_URL}**

Instead of manually typing:
"Website development — 20 hours @ $150/hr = $3,000"

You just type: **"Built a 5-page portfolio website with contact form and SEO"**

And the AI generates professional line items.

**Tech:** Next.js frontend, Ollama (local LLM) for generation, jsPDF for export.

Runs entirely in-browser. No data stored. Pay once ($29) or 3 free invoices.

[Try it free](${PRODUCT_URL})`,
  },
  "r/indiehackers": {
    title: "$29 one-time vs $19/month SaaS — does a one-off purchase model work for B2B SaaS?",
    type: "text",
    body: `Built ${PRODUCT_URL} — an invoice generator with a $29 one-time price tag instead of the usual subscription.

**Reasoning:** freelancers and indie hackers hate monthly bills. $29 feels less risky than committing to $19/month.

But I'm wondering: does anyone actually prefer buying software this way, or do subscriptions feel "safer"?

Currently doing ~$0 MRR (just launched). Curious if anyone has thoughts on this pricing model for bootstrapped tools.

[Try it free](${PRODUCT_URL})`,
  },
};

async function getRedditToken() {
  const auth = Buffer.from(
    `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "InvoiceIn60Seconds/1.0 (contact@lukito.com)",
    },
    body: "grant_type=password&username=&password=",
  });

  const data = await res.json();
  return data.access_token;
}

async function postToReddit(token, subreddit, post) {
  const url = `https://oauth.reddit.com/r/${subreddit.replace("r/", "")}/submit`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "InvoiceIn60Seconds/1.0",
    },
    body: JSON.stringify({
      sr: subreddit.replace("r/", ""),
      title: post.title,
      text: post.body,
      kind: "self",
    }),
  });

  const data = await res.json();
  return data;
}

async function main() {
  const subs = TARGET_SUB ? SUBREDDITS.filter((s) => s.name === TARGET_SUB) : SUBREDDITS;

  console.log(`\nReddit Marketing — ${DRY_RUN ? "DRY RUN" : "LIVE MODE"}\n`);

  for (const sub of subs) {
    const post = POSTS[sub.name];
    if (!post) {
      console.log(`⏭️  Skipping ${sub.name} — no post template`);
      continue;
    }

    console.log(`\n${DRY_RUN ? "📝 Would post" : "📤 Posting"} to ${sub.name}:`);
    console.log(`   Title: ${post.title}`);
    console.log(`   Body preview: ${post.body.substring(0, 100)}...`);

    if (DRY_RUN) {
      console.log(`   Status: DRY RUN — not posted`);
      continue;
    }

    try {
      const token = await getRedditToken();
      const result = await postToReddit(token, sub.name, post);
      if (result.json?.errors?.length > 0) {
        console.log(`   ❌ Error: ${result.json.errors[0]}`);
      } else {
        console.log(`   ✅ Posted! ${result.json?.data?.url}`);
      }
    } catch (err) {
      console.log(`   ❌ Failed: ${err.message}`);
    }

    await new Promise((r) => setTimeout(r, 30000));
  }

  console.log("\n✅ Done!\n");
}

main().catch(console.error);
