# Invoice In 60 — Agent Team Master

## Mission
**$500 revenue in 16 days** (April 8–24, 2026)
Product: https://invoice-in-60.vercel.app
Pricing: Free / Pro $9/mo / Business $19/mo

---

## Team & Schedule

| Agent | Model | Schedule | Status |
|-------|-------|----------|--------|
| 🎯 CEO | deepseek-r1:7b | 8:00 AM | READY |
| 📝 Marketing | qwen2.5:7b | 10:00 AM | READY |
| 🔍 SEO | deepseek-r1:7b | 9:00 AM | READY |
| 📊 Analytics | qwen2.5:7b | 6AM/12PM/6PM/12AM | READY |
| 🚀 Growth | qwen2.5:7b | 11:00 AM | READY |
| 🔄 Pivot | deepseek-r1:7b | 8:45 AM | ACTIVE (if behind) |
| 💰 Sales | qwen2.5:7b | 12PM + 6PM | READY |
| 🤝 Support | qwen2.5:7b | 9AM/1PM/5PM | READY |

---

## Revenue Phases
| Phase | Days | Target | Actual |
|-------|------|--------|--------|
| 1 | 1–3 | $50 | $0 |
| 2 | 4–7 | $150 | — |
| 3 | 8–12 | $350 | — |
| 4 | 13–16 | $500 | — |

---

## Model Routing
- **Qwen2.5-7B Q4_K_M** → fast tasks: Reddit, Twitter, emails, DMs, git, coordination, file ops
- **DeepSeek-R1-7B Q4_K_M** → thinking tasks: CEO strategy, SEO writing, root cause analysis, debugging

---

## Communication Protocol
- All reports: `agents/reports/AGENT-YYYY-MM-DD.md`
- Messages between agents: `agents/messages/FROM-TO-DATE.md`
- Leads tracking: `agents/leads/SOURCE-YYYY-MM-DD.md`
- Revenue: `agents/revenue.md` (updated daily by Analytics)
- Decisions: `agents/decisions.md`
- Wins: `agents/wins.md`
- Failures: `agents/failures.md`

---

## Tools
- OpenClaw: `sessions_spawn` for sub-agents
- Claude Code: `claude --print --permission-mode bypassPermissions`
- OpenCode: `opencode run`
- Both `claude` and `opencode` installed

---

## Starting State
- Today: April 9, 2026 (Day 2)
- Revenue so far: $0
- Site: Live at https://invoice-in-60.vercel.app
- Marketing: Content ready, needs posting
- SEO: Blog posts ready to write
- Analytics: Basic (Vercel built-in)

---

## Pending
- Set up cron jobs to auto-run agents (OpenClaw cron or shell loop)
- Set up Telegram morning digest (CEO → Luka)
- Set up lead databases (sales-leads.md, support-leads.md)
