# PingWatch — Website Uptime Monitor

> Know when your site goes down before your users do.

A simple, fast uptime monitoring tool built for indie hackers. Get alerted on Slack or email within 30 seconds of an outage.

## Features
- ✅ HTTP uptime checks (configurable 1–60 min intervals)
- ✅ Incident management with threshold-based alerting
- ✅ Slack & Email alerts (via Resend)
- ✅ Public status page (`/status/[slug]`)
- ✅ 30-day uptime history with response time chart
- ✅ SSL expiry monitoring
- ✅ Dark-mode dashboard

## Tech Stack
- **Frontend:** Next.js 14 (App Router)
- **Database:** Supabase (Postgres + Auth + RLS)
- **Email:** Resend (3k free/month)
- **Hosting:** Vercel (free tier)
- **Cron:** Vercel Cron (every minute)

## Setup

### 1. Clone & install
```bash
git clone <repo>
cd uptime-monitor
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL` — from Supabase dashboard
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase dashboard
- `SUPABASE_SERVICE_ROLE_KEY` — from Supabase → Settings → API
- `RESEND_API_KEY` — from [resend.com](https://resend.com) (free)
- `CRON_SECRET` — any random string

### 3. Run
```bash
npm run dev
```

### 4. Trigger checks manually
```bash
curl -X POST http://localhost:3000/api/check \
  -H "x-cron-secret: your_cron_secret"
```

## Deployment (Vercel)
1. Connect repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy — cron will auto-run every minute via `vercel.json`
# Uptime-Monitor-09
