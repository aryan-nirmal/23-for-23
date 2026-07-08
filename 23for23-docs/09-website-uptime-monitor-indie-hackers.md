# Website Uptime Monitor for Indie Hackers

## MRD

### Executive Summary
Website Uptime Monitor for Indie Hackers is a low-cost infrastructure utility for small SaaS builders who want confidence, not enterprise observability. Many indie founders need a simple answer to a simple question: is my site up, and if not, tell me quickly on the channels I actually use. Existing monitoring tools are powerful but can feel overfeatured or overpriced for tiny products. This product competes on simplicity, price, and WhatsApp/Slack alerts for small operators.

### Target Market
Primary persona: indie hacker or solo SaaS founder
- runs 1-5 apps
- wants fast outage alerts
- price-sensitive and self-serve oriented

Primary persona: freelancer managing client sites
- needs visibility across multiple small properties
- wants lightweight reporting

Secondary persona: small startup without DevOps staff

### Market Size
- TAM estimate: millions of small sites and apps run by founders, freelancers, and small teams.
- SAM estimate: 500,000 operators likely to pay for low-cost uptime monitoring.
- SOM estimate: 10,000 paying users in 3 years.

### Problem Statement
Small operators want monitoring but do not need full observability suites. The gap is a fast, affordable monitor with straightforward status pages and familiar alert channels that can be configured in minutes.

### Competitive Landscape
| Competitor | Pricing | Strengths | Weaknesses |
| --- | --- | --- | --- |
| UptimeRobot | Established low-cost monitor | Familiar product and free tier | Generic experience and crowded positioning |
| Better Stack / Better Uptime | richer alerting and incident tooling | More complete ops workflows | More than many indie users need |
| Pingdom | trusted infrastructure brand | Strong monitoring heritage | Higher perceived complexity and price |

### Differentiation Strategy
- narrower product surface
- WhatsApp alerting for founder workflows
- monthly price in the $5-$9 comfort zone
- no enterprise-first onboarding

### Business Model
- Hobby: $5/month for 10 monitors
- Growth: $9/month for 30 monitors and status page
- Agency: $29/month for client workspaces

### Go-to-Market Strategy
- Product Hunt, indie communities, startup newsletters
- comparison pages against UptimeRobot and Pingdom
- first 100 users through founder circles and direct outreach

## PRD

### Purpose and Vision
Vision statement: tell small founders when their product is down before their customers do.

The product focuses on fast setup, reliable checks, and practical alerting rather than deep telemetry.

### Target Audience
Persona 1: Noah, solo founder running a SaaS app
- Goals: know when app, landing page, or API goes down
- Frustrations: current tools feel noisy or overpriced
- Day-in-the-life: ships features, not infrastructure, and wants basic reassurance

Persona 2: Aditi, freelancer maintaining 12 client sites
- Goals: get notified and prove uptime value to clients
- Frustrations: scattered monitoring across multiple tools
- Day-in-the-life: handles many small websites and wants one dashboard

### Feature List
- Must-have: HTTP uptime checks
- Must-have: configurable intervals
- Must-have: incident creation after consecutive failures
- Must-have: Slack and email alerts
- Must-have: WhatsApp alerts
- Must-have: public status page
- Must-have: historical uptime reporting
- Should-have: SSL expiry checks
- Could-have: keyword-based content checks
- Won't-have for v1: full APM and log ingestion

### User Stories
1. As a founder, I want to add a URL and start checks quickly.
2. As a user, I want alert thresholds so that one-off blips do not spam me.
3. As a user, I want Slack and WhatsApp alerts where I already work.
4. As a freelancer, I want a public status page for client trust.
5. As a user, I want uptime history over 30 days.
6. As an admin, I want monitors grouped by project.
7. As a user, I want SSL expiry alerts.
8. As an operator, I want incident recovery notifications too.

### Acceptance Criteria
- monitor setup validates URL and interval
- failures only become incidents after configured threshold
- recovery closes incidents and sends recovery alert
- status page reflects current monitor state
- uptime report computes availability correctly

### User Flow
1. User signs up
2. Creates project
3. Adds one or more URLs
4. Configures check interval and alert channels
5. System starts checks
6. On failure threshold, incident and alerts fire
7. User reviews status page and history

### Non-Functional Requirements
- check scheduler reliability above 99.9%
- alert dispatch under 60 seconds after confirmed incident
- 99.9% dashboard uptime
- multi-region checker readiness as scale feature

### Constraints and Dependencies
- external sites may rate limit monitors
- WhatsApp alerting depends on messaging provider
- false positives must be minimized with retry logic

## TRD

### System Architecture
Backend-driven monitoring service with web dashboard. Frontend handles projects, monitors, incidents, and status pages. Scheduler dispatches HTTP checks to worker pool. Results are stored in time-series-like tables and incident tables. Monolith with worker processes is sufficient at MVP.

### Technology Stack
| Layer | Recommendation | Justification |
| --- | --- | --- |
| Frontend | Next.js | dashboard and public status pages |
| Backend | Go or Node.js | efficient I/O for check workers |
| Database | PostgreSQL | monitor config and incident history |
| Queue | Redis | check dispatch and alert jobs |
| Hosting | Fly.io/Render | easy worker deployment |

### API Design
| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/projects` | name | project id | Bearer |
| POST | `/api/v1/monitors` | project_id, url, interval | monitor id | Bearer |
| GET | `/api/v1/monitors/{id}` | none | monitor detail | Bearer |
| GET | `/api/v1/incidents` | filters | incidents | Bearer |
| POST | `/api/v1/alert-channels` | channel config | channel id | Bearer |
| GET | `/api/v1/status/{slug}` | none | public status payload | Public |
| PATCH | `/api/v1/monitors/{id}` | updates | monitor object | Bearer |

### Data Models
| Table | Fields | Relationships |
| --- | --- | --- |
| `projects` | id, owner_id, name | one-to-many monitors |
| `monitors` | id, project_id, url, interval_seconds, active | belongs to project |
| `check_results` | id, monitor_id, checked_at, status_code, response_ms, success | belongs to monitor |
| `incidents` | id, monitor_id, started_at, resolved_at, status | belongs to monitor |
| `alert_channels` | id, owner_id, type, config_json | owner channels |

### Third-Party Integrations
- Slack webhook
- email provider
- WhatsApp provider

### Security Architecture
- bearer auth
- encrypted alert secrets
- signed public status-page slugs
- audit logs for alert config changes

### Infrastructure and DevOps
- worker autoscaling
- regional health-check support later
- alert on queue backlog and failed notifications
- daily backups

### Scalability Plan
At 10x growth, split check workers from web/API, partition result tables by time, and introduce multi-region check nodes. Status pages remain cacheable and inexpensive.

## Production Requirements

### Required Backend Components
- `Supabase Postgres` for monitors, incidents, results, and alert channels
- Queue/lock layer for scheduled checks
- Public status-page publishing path

### Recommended Free Stack
- `Supabase` for monitor and incident data
- `Upstash Redis` for scheduling/locking
- `Resend` and Slack webhooks for alerting

### Production Notes
- Retry and debounce logic is required to reduce false positives
- Incident state transitions should be explicit and tested
- Status pages should be cached aggressively
