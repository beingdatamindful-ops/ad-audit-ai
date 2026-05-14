# AdAudit AI

**An AI agent that audits Google Ads accounts in 90 seconds.**

The analysis that takes a senior media buyer 4 hours and costs 
$3,000 at an agency — automated for $0.40 in API costs.

## What it does

1. Upload a Google Ads CSV export
2. Six specialised AI agents analyse it simultaneously:
   - 💸 Wasted Spend Auditor
   - 🏗️ Structural Issues Auditor
   - 📊 Conversion Tracking Auditor
   - 🎯 Bidding Strategy Auditor
   - 🚫 Negative Keyword Auditor
   - 👥 Audience & Device Auditor
3. A prioritiser ranks findings by dollar impact × confidence
4. A report writer produces an executive summary

**Total time:** ~30 seconds | **Total cost:** ~$0.40 per audit

## Key architectural decisions

**Math in code, reasoning in LLMs.**
All metrics are computed deterministically in JavaScript 
before any LLM sees the data. Claude reasons about 
pre-computed results — never does arithmetic. 
This eliminates hallucinated numbers.

**Agent decomposition over monolithic prompts.**
Six focused agents beat one general prompt. Each agent 
has a single responsibility, a specific output schema, 
and calibrated confidence scoring.

**Defensive output parsing.**
Every Claude response is parsed defensively. 
The system degrades gracefully instead of crashing.

## Tech stack

| Layer | Technology |
|---|---|
| Orchestration | n8n |
| AI / LLM | Claude (Anthropic) |
| Frontend | React 19 + TanStack Start |
| Auth & Database | Supabase |
| Deployment | Cloudflare Pages |

## Running locally

1. Clone the repo
2. Copy .env.example to .env and fill in your keys
3. Run: bun install
4. Run: bun run dev

## About

Built by Jagruti — 7 years in paid media, now building 
AI automation tools for marketing and GTM teams.
