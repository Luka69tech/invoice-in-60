export const PRODUCT = {
  name: "Invoice In 60 Seconds",
  tagline: "AI-Powered PDF Invoices",
  url: "https://invoice-in-60.vercel.app",
  price: 29,
  priceLabel: "$29 one-time",
  freeLimit: "3 free invoices",
  description:
    "Stop wasting hours on clunky invoicing tools. Describe your project once — AI fills in the rest. Export a stunning PDF your clients will actually pay faster.",
  keyValueProps: [
    "AI fills in professional line items from a plain description",
    "No signup required — free to try",
    "Runs entirely in-browser. No data stored on servers.",
    "PDF export in one click",
    "Multi-currency support (USD, EUR, GBP, CAD, AUD + 10 more)",
    "Brand customization with logo upload and color picker",
    "$29 one-time payment — no subscription",
    "Pay with crypto (USDT, USDC, BTC, ETH, SOL + 14 more)",
  ],
  targetAudiences: [
    "Freelance designers, developers, and writers",
    "Solopreneurs and indie hackers",
    "Small agencies (1-5 people)",
    "Privacy-conscious users who hate accounts",
    "Crypto users who prefer paying with crypto",
  ],
  competitors: [
    "FreshBooks — $19/mo subscription model",
    "Wave — free but requires account",
    "Hectic — $21/mo, complex for simple invoices",
    "Stripe Invoicing — 0.5% + $0.50 per invoice",
    "And.co — limited AI features",
  ],
} as const;

export const REDDIT_SUBREDDITS = [
  {
    name: "r/freelance",
    description: "Freelancers discussing rates, clients, tools",
    bestAngle: "Time savings + no signup",
    postingFrequency: "1x per week",
    karmaReq: 50,
  },
  {
    name: "r/Entrepreneur",
    description: "Entrepreneurs and small business owners",
    bestAngle: "One-time payment vs subscription + AI efficiency",
    postingFrequency: "1x per 2 weeks",
    karmaReq: 100,
  },
  {
    name: "r/smallbusiness",
    description: "Small business owners and operators",
    bestAngle: "Professional invoices = faster payments + brand",
    postingFrequency: "1x per week",
    karmaReq: 100,
  },
  {
    name: "r/SideProject",
    description: "Indie hackers building products",
    bestAngle: "Built with AI (Ollama), runs locally, crypto payments",
    postingFrequency: "1x per week",
    karmaReq: 50,
  },
  {
    name: "r/startups",
    description: "Early-stage startup founders",
    bestAngle: "Built fast, pays for itself, AI-powered",
    postingFrequency: "1x per 2 weeks",
    karmaReq: 100,
  },
  {
    name: "r/cryptocurrency",
    description: "Crypto community — relevant for crypto payment",
    bestAngle: "Pay with 17 different cryptos, no intermediaries",
    postingFrequency: "1x per month",
    karmaReq: 500,
  },
  {
    name: "r/accounting",
    description: "Accountants and bookkeepers",
    bestAngle: "Clean PDF output, multi-currency",
    postingFrequency: "1x per 2 weeks",
    karmaReq: 50,
  },
  {
    name: "r/graphic_design",
    description: "Designers who need professional invoices",
    bestAngle: "Brand-customizable, print-ready PDFs",
    postingFrequency: "1x per week",
    karmaReq: 50,
  },
  {
    name: "r/webdev",
    description: "Web developers who freelance",
    bestAngle: "Describe project → AI generates line items",
    postingFrequency: "1x per week",
    karmaReq: 50,
  },
  {
    name: "r/indiehackers",
    description: "Bootstrapped entrepreneurs",
    bestAngle: "Pays for itself vs monthly subscriptions",
    postingFrequency: "1x per 2 weeks",
    karmaReq: 100,
  },
] as const;

export const TWITTER_HANDLES = [
  "@levelsio",
  "@naval",
  "@alexandsros",
  "@AndrewChenVC",
  "@mmayot",
  "@lennysan",
  "@sarah_oro",
  "@bootr",
  "@producthunt",
  "@IndieHackers",
];

export const COLD_EMAIL_TARGETS = [
  {
    segment: "Freelance designers on LinkedIn",
    searchQuery: "site:linkedin.com freelancer designer open to work",
    outreachAngle: "Invoice in 45 seconds instead of 20 minutes in Google Docs",
  },
  {
    segment: "Solopreneurs on indie hacker communities",
    searchQuery: "site:indiehackers.com/freelancing",
    outreachAngle: "One-time $29 vs $19/mo FreshBooks — saves $197/year",
  },
  {
    segment: "Small agencies on Twitter",
    searchQuery: "twitter search: agency owner freelance",
    outreachAngle: "Pay with crypto — no payment processor fees",
  },
];

export const SEO_KEYWORDS = [
  {
    keyword: "free invoice generator AI",
    intent: "informational",
    difficulty: "medium",
    volume: "medium",
    priority: 1,
  },
  {
    keyword: "how to create invoice PDF",
    intent: "informational",
    difficulty: "low",
    volume: "high",
    priority: 2,
  },
  {
    keyword: "best invoice generator for freelancers",
    intent: "commercial",
    difficulty: "medium",
    volume: "high",
    priority: 1,
  },
  {
    keyword: "invoice template free download",
    intent: "informational",
    difficulty: "high",
    volume: "very high",
    priority: 3,
  },
  {
    keyword: "crypto invoice payment",
    intent: "transactional",
    difficulty: "low",
    volume: "low",
    priority: 1,
  },
  {
    keyword: "AI invoice generator",
    intent: "commercial",
    difficulty: "medium",
    volume: "medium",
    priority: 1,
  },
  {
    keyword: "one time invoice software",
    intent: "commercial",
    difficulty: "low",
    volume: "low",
    priority: 1,
  },
  {
    keyword: "invoice PDF generator no signup",
    intent: "transactional",
    difficulty: "low",
    volume: "low",
    priority: 2,
  },
] as const;

export const CONTENT_CALENDAR = [
  { day: 1, channel: "reddit", action: "Post to r/freelance — Show HN style" },
  { day: 1, channel: "twitter", action: "Thread: 10x faster invoicing" },
  { day: 2, channel: "cold_email", action: "Send 20 emails to freelancers" },
  { day: 2, channel: "reddit", action: "Post to r/smallbusiness" },
  { day: 3, channel: "twitter", action: "Single tweet: crypto payments angle" },
  { day: 3, channel: "reddit", action: "Post to r/Entrepreneur" },
  { day: 4, channel: "cold_email", action: "Send 20 more emails" },
  { day: 4, channel: "reddit", action: "Post to r/SideProject" },
  { day: 5, channel: "twitter", action: "Thread: One-time vs subscription" },
  { day: 5, channel: "cold_email", action: "Follow up on day 1 emails" },
  { day: 6, channel: "reddit", action: "Post to r/webdev" },
  { day: 7, channel: "twitter", action: "Engagement thread: invoicing pain points" },
  { day: 7, channel: "cold_email", action: "Follow up + new batch" },
];
