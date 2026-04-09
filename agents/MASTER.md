# Invoice In 60 — Agent Team Master

## Mission
**$500 revenue in 16 days** (April 8–24, 2026) from https://invoice-in-60.vercel.app

## Product
- Free tier: AI invoice generator (limited)
- Pro: $9/month
- Business: $19/month

## Revenue Target Phases
| Phase | Days | Target |
|-------|------|--------|
| 1 | 1–3 | $0 → $50 |
| 2 | 4–7 | $50 → $150 |
| 3 | 8–12 | $150 → $350 |
| 4 | 13–16 | $350 → $500 |

## Team
- **CEO Agent** — Strategic decisions, Telegram morning reports, reads all reports
- **Marketing Agent** — Reddit, Twitter/X, cold email
- **SEO Agent** — Blog posts, keyword targeting, backlinks
- **Analytics Agent** — Traffic, conversions, revenue tracking
- **Growth Agent** — Cold outreach, Twitter DMs, Reddit DMs
- **Pivot Agent** — Activates Day 8 if behind <50% of target

## Communication Protocol
All agents write daily reports to: `agents/reports/AGENT-NAME-YYYY-MM-DD.md`
Agents leave messages in: `agents/messages/TO_AGENT-MESSAGE.md`
CEO reads all reports at 8am, sends Telegram digest at 9am

## Shared Files
- `agents/revenue.md` — Revenue tracker (updated daily)
- `agents/decisions.md` — CEO decision log
- `agents/wins.md` — What worked
- `agents/failures.md` — What failed and why

## Tools Available
- OpenClaw: `sessions_spawn` for sub-agents
- Claude Code: `claude --print --permission-mode bypassPermissions`
- OpenCode: `opencode run`
- Both `claude` and `opencode` are installed

## Starting State
- Today: April 8, 2026 (Day 1)
- Revenue so far: $0
- Site: Live at https://invoice-in-60.vercel.app
- Marketing: NOT started
- Analytics: Basic (Vercel built-in)
