# Competitor Monitoring Tool

## MRD

### Executive Summary
Competitor Monitoring Tool serves founders and product teams that need lightweight market intelligence without enterprise pricing. Monitoring competitor websites, pricing pages, changelogs, hiring signals, and social activity is operationally valuable but usually not valuable enough for a small company to justify an expensive competitive-intelligence platform. This product packages weekly monitoring into a digest-style workflow for early-stage teams.

### Target Market
Primary persona: founder or solo product marketer
- 1-20 person company
- monitors 3-10 competitors manually
- wants change alerts without a full intelligence stack

Primary persona: PM or growth lead
- tracks pricing, launches, and hiring signals
- wants signal over noise

Secondary persona: boutique product or growth consultant
- needs recurring updates for multiple client accounts

### Market Size
- TAM estimate: 3 million founder-led and early product teams globally using website and social competitor tracking.
- SAM estimate: 250,000 English-language startups and consultants already paying for SEO, analytics, or product software.
- SOM estimate: 5,000 paying accounts in 3 years.

### Problem Statement
Manual competitor tracking is inconsistent and noisy. Enterprise tools are expensive, while simple page-change tools lack semantic summarization and founder-friendly pricing. Users need one place to watch a small set of competitors and receive useful weekly summaries, not raw diff spam.

### Competitive Landscape
| Competitor | Pricing | Strengths | Weaknesses |
| --- | --- | --- | --- |
| Crayon | Enterprise sales-led | Broad intelligence coverage | Far beyond indie/startup budget |
| Klue | Enterprise pricing | Strong battlecards and GTM features | Built for larger sales orgs |
| Visualping | Lower-cost page monitoring | Simple page change tracking | No startup-specific competitor digest workflow |

### Differentiation Strategy
- Weekly digest instead of alert overload
- Focused on 3-10 competitors, not enterprise-scale intelligence
- Includes pricing-page and hiring-signal classification
- Lower price point and simpler setup for founders

### Business Model
- Starter: $15/month for 5 competitors
- Growth: $39/month for 20 competitors and team email digests
- Consultant: $99/month for 10 client workspaces

Estimated revenue
- Month 6: 70 Starter, 15 Growth, 3 Consultant
- Month 12: 250 Starter, 60 Growth, 10 Consultant

### Go-to-Market Strategy
- target indie hackers, founders, and PM communities
- publish examples of pricing changes and feature-launch digests
- first 100 users via direct outreach to founders already tracking rivals in spreadsheets

## PRD

### Purpose and Vision
Vision statement: give small teams a useful competitor brief every week without enterprise tooling.

The product converts public changes across websites and social channels into concise, categorized updates. It is not trying to be a full CI platform; it is trying to remove the weekly manual research loop.

### Target Audience
Persona 1: Sara, founder of a B2B SaaS startup
- Goals: keep track of competitor pricing and positioning
- Frustrations: forgets to check regularly, misses important updates
- Day-in-the-life: reviews pricing pages before sales calls and wants proactive alerts

Persona 2: Tom, growth consultant
- Goals: monitor multiple client competitor sets
- Frustrations: page trackers generate too many false positives
- Day-in-the-life: spends Monday mornings compiling update reports manually

### Feature List
- Must-have: competitor workspace creation
- Must-have: monitored URL setup
- Must-have: weekly content snapshots
- Must-have: semantic diff and change categorization
- Must-have: digest email delivery
- Must-have: history log of detected changes
- Should-have: keyword alerts and hiring signal detection
- Could-have: social-post monitoring
- Won't-have for v1: battlecards and sales enablement suite

### User Stories
1. As a founder, I want to add competitor URLs so that I can stop checking manually.
2. As a user, I want pricing changes categorized separately so that I can react quickly.
3. As a consultant, I want one digest for multiple competitors so that reporting is easy.
4. As a PM, I want historical changes stored so that I can see patterns over time.
5. As a user, I want noisy changes filtered out so that alerts stay useful.
6. As an operator, I want monitored pages to retry if a fetch fails.
7. As a team lead, I want digest emails sent on a schedule.
8. As an admin, I want workspace separation across clients.

### Acceptance Criteria
- users can add and validate competitor URLs
- snapshot job runs on schedule and stores baseline
- change summary includes added, removed, and reworded sections
- digest email groups changes by competitor and category
- failed crawls are retried and surfaced in dashboard

### User Flow
1. User creates workspace
2. Adds competitor and URLs
3. System takes baseline snapshots
4. Scheduler revisits pages weekly
5. Semantic diff detects changes
6. Digest email is generated
7. User clicks into history view for details

### Non-Functional Requirements
- crawl success rate above 95% for supported pages
- digest delivery within 30 minutes of scheduled window
- 99.5% uptime
- secure handling of stored page snapshots

### Constraints and Dependencies
- sites may block crawlers
- dynamic content causes false positives
- legal review needed around scraping terms and respectful crawl frequency

## TRD

### System Architecture
Modular monolith with crawler workers. Web app manages workspaces and change history. Backend stores competitors, pages, snapshots, diffs, and digest subscriptions. Workers fetch pages, normalize HTML, compute diffs, and send summaries. PostgreSQL stores metadata and diff records; object storage stores raw snapshots; Redis powers crawl queues.

### Technology Stack
| Layer | Recommendation | Justification |
| --- | --- | --- |
| Frontend | Next.js | dashboard and marketing site |
| Backend | Python FastAPI | strong scraping and text-processing ecosystem |
| Database | PostgreSQL | workspace and history data |
| Queue | Redis + Celery | scheduled crawl jobs |
| Diffing | trafilatura + semantic text diffing | useful page content extraction |
| Hosting | Render/Fly.io | easy worker deployment |

### API Design
| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/workspaces` | name | workspace id | Bearer |
| POST | `/api/v1/competitors` | workspace_id, name | competitor id | Bearer |
| POST | `/api/v1/pages` | competitor_id, url, label | page id | Bearer |
| GET | `/api/v1/changes` | filters | change list | Bearer |
| POST | `/api/v1/digests/send` | workspace_id | status | Bearer |
| GET | `/api/v1/competitors/{id}/history` | none | snapshot history | Bearer |
| DELETE | `/api/v1/pages/{id}` | none | success | Bearer |

### Data Models
| Table | Fields | Relationships |
| --- | --- | --- |
| `workspaces` | id, owner_id, name | one-to-many competitors |
| `competitors` | id, workspace_id, name | one-to-many pages |
| `pages` | id, competitor_id, url, label, active | one-to-many snapshots |
| `snapshots` | id, page_id, fetched_at, content_hash, storage_key | belongs to page |
| `change_events` | id, page_id, snapshot_from, snapshot_to, category, summary | belongs to page |
| `digest_subscriptions` | id, workspace_id, email, cadence | belongs to workspace |

### Third-Party Integrations
- email provider for digest delivery
- optional proxy provider for crawler reliability
- optional social APIs in later versions

### Security Architecture
- tenant-separated workspaces
- encrypted snapshot storage
- rate-limited crawls with allowlists/denylists
- audit trails for workspace sharing

### Infrastructure and DevOps
- scheduled workers
- content extraction monitoring
- CI for crawler regression tests
- backup of change history

### Scalability Plan
At 10x growth, separate crawl workers by domain queues, deduplicate repeated pages, and move heavy diffing to async workers. Keep dashboard and digest composition in the monolith until enterprise workflows appear.

## Production Requirements

### Required Backend Components
- `Supabase Postgres` for workspaces, competitors, pages, snapshots, and diffs
- `Supabase Storage` for raw page snapshots
- Scheduled crawl runner and digest pipeline

### Recommended Free Stack
- `Supabase` for data and auth
- `GitHub Actions` for weekly crawl jobs at MVP stage
- `Resend` for digest emails

### Production Notes
- Domain-level throttling and retry rules are required
- Snapshot deduplication should be added early
- Change classification should filter known noisy elements
