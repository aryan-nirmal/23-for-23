# Cold Email Personalizer

## MRD

### Executive Summary
Cold Email Personalizer targets a clear wedge inside the crowded sales-tech market: founders, SDRs, and small outbound teams that need high-quality personalization but cannot justify a full sales-engagement platform. LinkedIn reports more than 1 billion members worldwide, making it the default prospect-research surface for modern B2B outreach, while HubSpot's 2025 sales research shows research and personalization remain core outbound skills and that many reps still rely on social profiles before contact.[^linkedin-members][^hubspot-cold-calling] The opportunity is not to replace Apollo or lemlist, but to remove the last manual step those tools still leave to the user: turning prospect context into a credible first-touch email in under one minute.

### Target Market
Primary persona: SMB sales rep
- Demographics: 24-38 years old, works at a B2B SaaS, agency, or IT services firm with 2-50 sellers; typically US, UK, India, Canada, or Australia; active on LinkedIn daily.
- Behaviors: builds lists in Apollo or manually from LinkedIn, sends 30-150 cold emails per week, uses ChatGPT informally, and edits templates heavily to avoid sounding automated.
- Goals: increase reply rate, reduce research time per lead, maintain personalization without hiring more SDRs.

Primary persona: founder-led seller
- Demographics: 25-45 years old, founder or solo operator at a bootstrapped or pre-seed company.
- Behaviors: does outreach personally, has a small budget, alternates between copy-pasting templates and manually researching high-value leads.
- Goals: book meetings without paying for a full RevOps stack, sound credible to senior buyers, and move quickly.

Secondary persona: outbound agency operator
- Demographics: agency owner or campaign manager serving 5-30 clients.
- Behaviors: runs high-volume outbound, uses spreadsheets and enrichment tools, needs first-line personalization at scale.
- Goals: improve client campaign performance while keeping analyst time flat.

### Market Size
The addressable market is best estimated bottom-up because there is no clean public category called "AI cold-email personalization only."

- TAM estimate: 6.4 million global users.
Basis: the U.S. Bureau of Labor Statistics reports about 1.61 million wholesale and manufacturing sales representative jobs in 2024 in the U.S. alone.[^bls-sales] Assuming the U.S. represents roughly 25% of the serviceable B2B outbound workforce for English-language tools, the implied global base is about 6.4 million sellers. At a $19/month entry plan, TAM is about $1.46 billion annualized revenue. This is an estimate, not a reported market figure.
- SAM estimate: 510,000 users.
Basis: restrict TAM to English-speaking founder-led and SMB outbound users that rely on LinkedIn and email as primary channels. Using 8% of TAM as a realistic near-term reachable slice gives about 510,000 users, or about $116 million annualized at $19/month. This is an estimate.
- SOM estimate: 2,500 paid users in 36 months.
Basis: an early-stage product with low ACV, self-serve onboarding, and no enterprise motion can reasonably target 2,500 paid users if it captures about 0.5% of SAM. At blended ARPU of $23/month, that implies about $690,000 ARR. This is an estimate.

### Problem Statement
Existing outbound tools solve contact discovery, sequencing, and analytics, but still expect users to perform manual prospect research and write the final message. That creates a productivity gap for small teams: high-quality personalization is too slow to do manually and too expensive to buy through enterprise-first platforms. Users need a focused workflow where a LinkedIn URL and a short product pitch produce a usable subject line, opening email, and follow-up without the complexity of a complete engagement suite.

### Competitive Landscape
| Competitor | Published pricing | Strengths | Weaknesses |
| --- | --- | --- | --- |
| Apollo | Free; Basic $49/user/month annual; Professional $79; Organization $119 with 3-user minimum[^apollo-pricing] | Large B2B database, sequencing, CRM features, broad workflow coverage | Overbuilt for solo users; personalization is one feature inside a much larger system |
| lemlist | Email Pro from $63/user/month annual; Multichannel Expert from $87/user/month annual[^lemlist-pricing] | Mature outbound workflows, deliverability tooling, multichannel automation | Price point is high for founders; setup is campaign-centric, not instant single-email generation |
| Lavender | Starter $27/month annual; Individual Pro $45; Team $89/seat/month[^lavender-pricing] | Strong email coaching, in-compose guidance, analytics | Optimizes writing quality but does not start from a LinkedIn URL and prospect snapshot alone |
| Lyne.ai | Pay-as-you-go and custom plan listed at $120/month; LinkedIn scraper add-on at $39/month[^lyne-pricing] | Personalization-first positioning, built for outbound agencies | Credit model and review workflow still assume batch operations; product trust depends on scrape quality |

### Differentiation Strategy
The product wins by being narrower, faster, and cheaper than general-purpose outbound tools:
- Narrower: one job, one screen, one output. Users do not need sequences, CRM, deliverability, or enrichment to get value.
- Faster: target time-to-first-email under 30 seconds for a public profile or pasted profile text.
- Cheaper: entry plan below the cost of a full outbound seat, making it viable for solo founders.
- More resilient: support two inputs from day one, LinkedIn URL when parsing succeeds and pasted profile text when it does not.
- Safer: output is editable before export, which reduces spammy or inaccurate sends.

### Business Model
Pricing tiers
- Free: 5 generations/day, watermark on exported CSV, no batch export.
- Pro: $19/month, 300 generations/month, CSV export, saved product pitches, follow-up variants.
- Team: $79/month for up to 5 seats, pooled quota, shared prompt templates, admin dashboard.
- Credit pack: $15 for 200 extra generations.

Monetization mechanics
- Self-serve SaaS subscription billed monthly or annually.
- Usage-based top-ups for heavy users.
- Low-friction free tier to drive SEO and word-of-mouth acquisition.

Revenue projection
- Month 6: 800 monthly active users, 32 Pro accounts, 6 Team accounts, 4 credit-pack purchases/month. Projected MRR about $1,124.
- Month 12: 4,000 monthly active users, 160 Pro accounts, 25 Team accounts, 20 credit-pack purchases/month. Projected MRR about $5,935.
These are operating estimates based on 4-5% free-to-paid conversion and early-stage self-serve benchmarks, not historical results.

### Go-to-Market Strategy
Acquisition channels
- Founder and SDR communities on LinkedIn, Reddit, Slack, and Discord.
- SEO pages for intent terms such as "personalized cold email from LinkedIn" and "AI cold email opener."
- Chrome extension and lightweight web tool directories.
- Short-form video demos showing before/after personalization quality.

Launch plan
1. Launch a no-login free web tool.
2. Run live demos in founder and sales communities.
3. Publish 10 comparison pages against Apollo, Lavender, and generic ChatGPT prompting.
4. Add saved pitches and CSV export after first 50 active users.

First 100 users strategy
- Recruit 30 founder-led sellers from public communities.
- Recruit 30 SDRs via LinkedIn outbound and offer free Pro access for feedback.
- Recruit 10 boutique agencies that can generate repeated usage quickly.
- Instrument activation around one metric: first accepted output copied within the first session.

## PRD

### Purpose and Vision
Vision statement: Generate a credible first-touch cold email from a prospect's LinkedIn context in under one minute.

The product solves the gap between prospect discovery and message creation. Users already know who they want to contact; they do not need another CRM or sequencing engine. They need a focused assistant that transforms public professional context and their own pitch into a tailored email they can trust enough to send after a quick review.

### Target Audience
Persona 1: Aisha Khan, SDR at a 12-person SaaS company
- Goals: hit meeting targets, personalize faster, keep reply rates healthy.
- Frustrations: templates feel generic, manual research is slow, her manager wants more output without harming quality.
- Day in the life: Aisha spends the morning sourcing 40 leads, then opens 15 LinkedIn profiles, company sites, and notes tabs to write intros. She loses time switching contexts and often falls back to generic copy by late afternoon.

Persona 2: Daniel Ross, founder selling a niche B2B tool
- Goals: reach decision-makers personally, sound informed, book high-quality demos.
- Frustrations: cannot afford an expensive sales stack, dislikes spending evenings writing outreach, worries AI text sounds fake.
- Day in the life: Daniel identifies a short target list every day, reviews LinkedIn for buying signals, writes a few custom emails, and stops once the effort becomes too time-consuming.

### Feature List
- Must-have: LinkedIn URL input with public-profile extraction.
- Must-have: pasted-profile-text input as fallback when URL parsing fails.
- Must-have: product pitch input with optional CTA.
- Must-have: tone selector with at least Formal, Casual, and Startup-friendly modes.
- Must-have: output subject line, full email body, and one follow-up email.
- Must-have: edit-before-copy experience.
- Must-have: copy-to-clipboard and CSV export.
- Must-have: IP and session-based rate limiting.
- Should-have: saved pitch templates.
- Should-have: generation history for the current session.
- Should-have: alternate versions button for subject line and opener.
- Could-have: Chrome extension on LinkedIn pages.
- Could-have: batch CSV processing for agencies.
- Won't-have for v1: native send-from-mailbox workflow.
- Won't-have for v1: CRM sync.
- Won't-have for v1: enterprise approval or team workflows.

### User Stories
1. As a founder, I want to paste a LinkedIn URL so that I do not need to copy profile details manually.
2. As an SDR, I want to add my product pitch so that the generated email reflects my offer and target outcome.
3. As a user, I want to choose a tone so that the message fits my brand and audience.
4. As a user, I want the tool to provide a subject line, opener, and follow-up so that I can complete a basic outreach sequence quickly.
5. As a user, I want to edit the draft before copying so that I can remove anything inaccurate or awkward.
6. As a user, I want a fallback text-input mode so that I can still use the product if LinkedIn blocks extraction.
7. As a growth agency operator, I want CSV export so that I can move generated drafts into my sending workflow.
8. As a platform owner, I want rate limits so that the free product is not abused for spam.
9. As a repeat user, I want saved pitches so that I can regenerate faster across similar prospects.

### Acceptance Criteria
LinkedIn URL input
- Pass if the system accepts a valid LinkedIn profile URL and returns a normalized prospect snapshot within 15 seconds for supported public profiles.
- Fail if malformed URLs are accepted without validation or if the system returns empty fields without an explicit fallback prompt.

Pasted-profile fallback
- Pass if a user can paste free text and generate an email without a LinkedIn fetch step.
- Fail if generation is blocked when parsing fails.

Pitch input
- Pass if generation requires a non-empty pitch field between 20 and 600 characters.
- Fail if empty or over-limit pitches proceed without validation.

Tone selector
- Pass if tone choice changes lexical style and CTA phrasing while preserving factual content.
- Fail if outputs are materially identical across all tones.

Email generation
- Pass if the system returns one subject line, one email under 180 words by default, and one follow-up under 120 words.
- Fail if any required output component is missing.

Edit-before-copy
- Pass if users can modify every output field prior to copy or export.
- Fail if output is copy-only and locked.

Copy and export
- Pass if users can copy individual sections and export the subject, body, and follow-up in CSV format.
- Fail if export omits one of the generated components.

Rate limiting
- Pass if anonymous users are capped by IP and session and receive a clear upgrade or retry message once the cap is reached.
- Fail if unlimited anonymous generations are possible.

### User Flow
1. User lands on the homepage and sees a single-job value proposition.
2. User pastes a LinkedIn URL or profile text.
3. User enters product pitch and optional CTA.
4. User selects tone.
5. User clicks Generate.
6. Backend fetches or parses profile context, then sends a structured prompt to the LLM.
7. User reviews subject line, email, and follow-up.
8. User edits text inline.
9. User copies the draft or exports CSV.
10. User is prompted to save the pitch or upgrade after repeated usage.

### Non-Functional Requirements
- Performance: first contentful paint under 2.0 seconds on broadband; generation completion under 20 seconds p95.
- Availability: 99.5% monthly uptime SLA for paid plans.
- Security: TLS 1.2+ in transit, AES-256 encryption at rest for stored prompts and outputs, OWASP ASVS Level 1 controls for MVP.
- Scalability: support 100 concurrent generation jobs at launch and 10x growth without architectural rewrite.
- Accessibility: WCAG 2.1 AA for core flows, full keyboard navigation, sufficient color contrast, and ARIA labels for form controls.

### Constraints and Dependencies
- Technology constraints: LinkedIn pages are anti-bot and may block direct parsing; the product must support fallback manual input.
- Third-party dependencies: LLM inference provider, browser automation or proxy provider, analytics, optional abuse-detection service.
- Regulatory constraints: comply with GDPR for EU users and CAN-SPAM style guidance by avoiding direct sending in v1.
- Team assumptions: one full-stack engineer, one product-minded founder, one contract designer, and one part-time QA resource over the 90-day sprint.

## TRD

### System Architecture
For MVP, use a modular monolith with asynchronous workers. The frontend is a Next.js web app serving the landing page, generator UI, and lightweight session history. The backend exposes authenticated and anonymous API routes for profile ingestion, prompt assembly, generation, exports, and rate-limit checks. A worker process handles slow tasks such as browser-based profile fetching and retry logic. PostgreSQL stores anonymous sessions, prospect snapshots, output records, quotas, and audit logs. Redis is used for queues, caching, and rate-limit counters. External services include an LLM API for generation, a browser automation or proxy layer for public page extraction, and an email/analytics service for operational events. A monolith is the right choice because product risk is in workflow validation, not service decomposition; it minimizes deployment complexity while still allowing async processing boundaries.

### Technology Stack
| Layer | Recommendation | Justification |
| --- | --- | --- |
| Frontend | Next.js with TypeScript | Fast iteration, SEO-friendly landing pages, server actions and API colocation reduce MVP complexity |
| Backend | Node.js with NestJS or Next.js route handlers | One language across the stack, strong ecosystem for validation, queues, and auth |
| Database | PostgreSQL | Structured data, reliable relational modeling for usage, outputs, and billing |
| Queue/cache | Redis with BullMQ | Simple async jobs for profile fetch and generation retry |
| Hosting | Vercel for web plus Render/Fly.io for worker and Postgres | Low-ops deployment for a sprint-stage product |
| AI | OpenAI Responses API for generation | Strong text quality, structured output support, fast enough for interactive generation |
| Browser automation | Playwright running in isolated worker containers | More resilient than naive scraping and easier to manage than custom headless stacks |
| Analytics | PostHog | Product analytics and funnel measurement without a heavy RevOps setup |

### API Design
| Method | Path | Request body | Response schema | Auth |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/prospects/ingest` | `{ "linkedinUrl": "string" }` or `{ "profileText": "string" }` | `{ "prospectId": "uuid", "source": "linkedin|manual", "snapshot": { "name": "string", "headline": "string", "summary": "string", "highlights": ["string"] } }` | Anonymous session token |
| POST | `/api/v1/generations` | `{ "prospectId": "uuid", "pitch": "string", "cta": "string?", "tone": "formal|casual|startup" }` | `{ "generationId": "uuid", "status": "queued|completed", "output": { "subject": "string", "emailBody": "string", "followUp": "string" } }` | Anonymous session token |
| GET | `/api/v1/generations/{generationId}` | None | `{ "generationId": "uuid", "status": "queued|processing|completed|failed", "output": { ... } }` | Anonymous session token |
| POST | `/api/v1/generations/{generationId}/regenerate` | `{ "section": "subject|body|followup", "instruction": "string?" }` | `{ "generationId": "uuid", "output": { "subject": "string", "emailBody": "string", "followUp": "string" } }` | Anonymous session token |
| POST | `/api/v1/exports/csv` | `{ "generationIds": ["uuid"] }` | `{ "downloadUrl": "string", "expiresAt": "datetime" }` | Anonymous session token |
| GET | `/api/v1/usage/status` | None | `{ "remainingFreeGenerations": "number", "resetAt": "datetime", "upgradeRequired": "boolean" }` | Anonymous session token |
| POST | `/api/v1/feedback` | `{ "generationId": "uuid", "rating": 1-5, "notes": "string?" }` | `{ "saved": true }` | Anonymous session token |

### Data Models
| Table | Key fields | Notes / relationships |
| --- | --- | --- |
| `anonymous_sessions` | `id UUID PK`, `session_token VARCHAR(128) UNIQUE`, `ip_hash CHAR(64)`, `user_agent TEXT`, `created_at TIMESTAMP` | One session can create many prospect ingests and generations |
| `prospect_snapshots` | `id UUID PK`, `session_id UUID FK`, `source VARCHAR(16)`, `linkedin_url TEXT NULL`, `raw_text TEXT`, `name VARCHAR(255)`, `headline TEXT`, `summary TEXT`, `highlights JSONB`, `created_at TIMESTAMP` | Stores normalized prospect context used for prompt construction |
| `generation_requests` | `id UUID PK`, `session_id UUID FK`, `prospect_id UUID FK`, `pitch TEXT`, `cta TEXT NULL`, `tone VARCHAR(32)`, `status VARCHAR(16)`, `provider VARCHAR(32)`, `prompt_version VARCHAR(32)`, `created_at TIMESTAMP` | Parent record for each generation attempt |
| `email_outputs` | `id UUID PK`, `generation_id UUID FK UNIQUE`, `subject TEXT`, `email_body TEXT`, `follow_up TEXT`, `edited_subject TEXT NULL`, `edited_body TEXT NULL`, `edited_follow_up TEXT NULL`, `created_at TIMESTAMP` | Stores original and user-edited outputs |
| `usage_counters` | `id UUID PK`, `session_id UUID FK`, `day DATE`, `generation_count INT`, `export_count INT` | Enforces free-tier quotas |
| `audit_events` | `id UUID PK`, `session_id UUID FK`, `event_type VARCHAR(64)`, `metadata JSONB`, `created_at TIMESTAMP` | Security and abuse review trail |

### Third-Party Integrations
| Service | Endpoint(s) used | Auth method | Rate limits | Fallback strategy |
| --- | --- | --- | --- | --- |
| OpenAI Responses API | `POST /v1/responses` | Server-side API key | Provider-tier dependent | Retry once with shorter context; fall back to manual retry UI |
| Browser automation worker | Internal Playwright fetch job against public LinkedIn page URL | None to target page; internal worker auth only | Self-managed concurrency cap | Ask user to paste profile text if extraction fails |
| PostHog | `POST /capture/` | Project API key | Workspace-plan dependent | Queue events locally and drop non-critical analytics on failure |
| Resend or Postmark for ops email | event webhooks and transactional send endpoint | Server API key | Plan dependent | Log notification failure without blocking user generation |

### Security Architecture
- Authentication: anonymous signed session token for v1, with optional email sign-in for paid users in v1.1.
- Authorization: free-tier quota enforcement by session token and hashed IP; admin roles only required once Team plan ships.
- Encryption in transit: HTTPS everywhere with HSTS enabled.
- Encryption at rest: database volume encryption plus application-level encryption for stored pitch text if retained.
- Secret management: provider secrets stored in managed host secret stores; never in `.env` files on client builds.
- Compliance posture: GDPR-ready data deletion flow, privacy notice covering content retention, and clear acceptable-use policy to deter spam misuse.

### Infrastructure and DevOps
- Hosting setup: frontend on Vercel; API and worker on Render or Fly.io; managed PostgreSQL and Redis.
- Environments: separate `dev`, `staging`, and `production` projects with isolated databases and API keys.
- CI/CD: GitHub Actions for lint, unit tests, API contract tests, and deployment gates to staging before production promotion.
- Monitoring: Sentry for errors, PostHog for product analytics, uptime checks on public endpoints, and queue-depth alerts for worker backlogs.
- Backups: daily Postgres backups with seven-day point-in-time recovery on paid infrastructure.

### Scalability Plan
At 10x growth, the first pressure points will be generation latency, profile-fetch failure rate, and quota abuse. Scale by separating the worker from the web app, increasing Redis-backed job concurrency, and caching prospect snapshots for repeated generations. Introduce signed user accounts for paid customers, move exports to object storage, and shard rate-limiting from session-level counters to a dedicated abuse-prevention service. If batch use becomes meaningful, add a second generation pipeline optimized for CSV imports while keeping the interactive pipeline fast for single-prospect usage.

### Sources
[^linkedin-members]: LinkedIn company page, accessed April 19, 2026: https://www.linkedin.com/company/linkedin/
[^hubspot-cold-calling]: HubSpot, "State of Cold Calling Report," updated April 10, 2025: https://blog.hubspot.com/sales/state-of-cold-calling
[^bls-sales]: U.S. Bureau of Labor Statistics, Occupational Outlook Handbook, accessed April 19, 2026: https://www.bls.gov/ooh/sales/wholesale-and-manufacturing-sales-representatives.htm
[^apollo-pricing]: Apollo official pricing summary published via Apollo insights, accessed April 19, 2026: https://www.apollo.io/insights/best-prospecting-tool-with-flexible-pricing
[^lemlist-pricing]: lemlist pricing page, accessed April 19, 2026: https://www.lemlist.com/pricing/
[^lavender-pricing]: Lavender pricing page, accessed April 19, 2026: https://www.lavender.ai/coach
[^lyne-pricing]: Lyne.ai pricing page, accessed April 19, 2026: https://lyne.ai/pricing/

## Production Requirements

### Required Backend Components
- `Supabase Postgres` for sessions, prospect snapshots, generations, quotas, and feedback
- `Supabase Edge Functions` or `Vercel Functions` for orchestration and prompt handling
- `Upstash Redis` for rate limiting and lightweight job coordination

### Recommended Free Stack
- `Vercel` for frontend
- `Supabase` for backend and data
- `Sentry` and `PostHog` for monitoring and analytics

### Production Notes
- Keep pasted-profile fallback live from day one
- Add admin tooling for abuse review and quota overrides
- Store prompt versions so output quality can be audited
