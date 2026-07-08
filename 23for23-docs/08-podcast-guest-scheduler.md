# Podcast Guest Scheduler

## MRD

### Executive Summary
Podcast Guest Scheduler is a vertical scheduling product for podcast hosts who need more than generic calendar links. Hosts spend time on outreach, topic alignment, guest prep, no-show prevention, and post-booking communication. The product's market position is between Calendly and full podcast CRM software: it is optimized for guest booking workflows, not just time-slot selection.

### Target Market
Primary persona: independent podcast host with 2-8 episodes per month
- solo or small-team creator
- books guests manually over email
- wants fewer no-shows and less coordination work

Primary persona: network producer or assistant
- manages multiple hosts or shows
- needs scheduling consistency and topic tracking

Secondary persona: B2B brand podcast operator
- needs guest pipeline visibility and prep automation

### Market Size
- TAM estimate: hundreds of thousands of active interview-style podcasts globally.
- SAM estimate: 100,000 hosts serious enough to use scheduling and guest-management software.
- SOM estimate: 3,000 paying creators or teams in 3 years.

### Problem Statement
Generic scheduling tools book time but ignore podcast-specific context: topic repetition, guest-status tracking, pre-show preparation, and reminder sequences tailored to recording. Hosts need a light CRM plus scheduler purpose-built for guest workflows.

### Competitive Landscape
| Competitor | Pricing | Strengths | Weaknesses |
| --- | --- | --- | --- |
| Calendly | Generic scheduling tiers | Excellent booking UX | No podcast guest pipeline or topic conflict logic |
| SavvyCal | Polished scheduling for professionals | Great recipient experience | Not verticalized for podcast ops |
| Airtable/Notion DIY setups | Flexible and customizable | Cheap if self-built | Manual and operationally brittle |

### Differentiation Strategy
- booking plus guest CRM in one product
- podcast-specific reminder and prep workflows
- topic conflict detection and guest metadata
- lower complexity than building CRM + scheduler manually

### Business Model
- Creator: $12/month
- Pro Host: $29/month with automation and guest CRM
- Team: $79/month with multi-show support

### Go-to-Market Strategy
- direct outreach to newsletter and creator communities
- integrations with podcast production agencies
- first 100 users from existing host communities and niche creator groups

## PRD

### Purpose and Vision
Vision statement: make booking a podcast guest feel like a reliable production workflow, not a chain of emails.

The product reduces scheduling overhead and guest drop-off while preserving the host's editorial control over who appears and when.

### Target Audience
Persona 1: Maya, independent business podcast host
- Goals: reduce back-and-forth and no-shows
- Frustrations: has topic overlap and forgets to send prep docs
- Day-in-the-life: emails prospects, coordinates time zones, and manually follows up

Persona 2: Chris, producer for two client podcasts
- Goals: track invited, booked, recorded, and published guests
- Frustrations: scattered email threads and spreadsheet maintenance
- Day-in-the-life: juggles multiple guest pipelines and recording calendars

### Feature List
- Must-have: booking page
- Must-have: calendar availability sync
- Must-have: guest metadata collection form
- Must-have: automated confirmation and reminder emails
- Must-have: guest pipeline statuses
- Must-have: topic conflict detection
- Should-have: pre-show checklist email
- Could-have: recording-platform links and CRM sync
- Won't-have for v1: full podcast publishing analytics

### User Stories
1. As a host, I want guests to pick from available slots so that booking becomes self-serve.
2. As a host, I want to collect bio and topic details so that prep is centralized.
3. As a producer, I want conflict alerts when topics repeat too closely.
4. As a host, I want automatic reminders so that no-shows decline.
5. As a producer, I want to move guests through pipeline stages.
6. As a host, I want calendar sync so that recording times stay accurate.
7. As an admin, I want one workspace for multiple shows.
8. As a user, I want pre-show instructions sent automatically.

### Acceptance Criteria
- booking page respects current calendar availability
- guest form captures required metadata before confirmation
- reminders trigger at configured intervals
- pipeline stage changes persist and are filterable
- conflict detection warns on overlapping topic keywords

### User Flow
1. Host creates show profile
2. Connects calendar
3. Publishes booking link
4. Guest selects time and fills pre-show form
5. System sends confirmation and reminders
6. Host reviews guest in CRM view
7. Producer updates status after recording

### Non-Functional Requirements
- 99.5% uptime
- timezone-safe scheduling
- email delivery rate above 98%
- accessible booking page

### Constraints and Dependencies
- depends on Google or Outlook calendar APIs
- conflict detection quality depends on form data quality
- MVP should avoid overbuilding beyond booking + CRM

## TRD

### System Architecture
Modular monolith. Frontend hosts booking pages, dashboard, and pipeline views. Backend stores shows, guest records, booking slots, reminders, and keyword matching. PostgreSQL stores all business data. Job worker handles reminder emails and conflict checks.

### Technology Stack
| Layer | Recommendation | Justification |
| --- | --- | --- |
| Frontend | Next.js | booking page SEO and dashboard |
| Backend | Node.js/NestJS | scheduling and calendar integration support |
| Database | PostgreSQL | booking and CRM records |
| Queue | Redis/BullMQ | reminder jobs |
| Email | Resend/Postmark | reliable transactional email |

### API Design
| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/shows` | show config | show id | Bearer |
| POST | `/api/v1/integrations/calendar/google` | oauth token | integration status | Bearer |
| GET | `/api/v1/booking/{slug}/availability` | date range | slots | Public |
| POST | `/api/v1/booking/{slug}/reserve` | slot + guest form | booking id | Public |
| GET | `/api/v1/guests` | filters | guest list | Bearer |
| PATCH | `/api/v1/guests/{id}` | stage update | guest object | Bearer |
| POST | `/api/v1/reminders/send` | booking id | status | Worker/Auth |

### Data Models
| Table | Fields | Relationships |
| --- | --- | --- |
| `shows` | id, owner_id, name, slug, timezone | one-to-many bookings |
| `calendar_integrations` | id, show_id, provider, refresh_token | belongs to show |
| `guests` | id, show_id, name, email, bio, topic_keywords, stage | belongs to show |
| `bookings` | id, guest_id, show_id, starts_at, ends_at, status | belongs to guest/show |
| `reminder_events` | id, booking_id, template_key, scheduled_at, sent_at | belongs to booking |

### Third-Party Integrations
- Google Calendar and Outlook
- email provider
- optional recording link service in later versions

### Security Architecture
- OAuth for calendar access
- encrypted token storage
- role separation for owner and producer seats
- audit logs for booking changes

### Infrastructure and DevOps
- standard web app plus worker
- monitoring on email sends and calendar sync failures
- backups and scheduled job visibility

### Scalability Plan
At 10x growth, isolate booking read paths, cache availability windows, and move reminder processing to dedicated workers. Keep CRM and show management inside the monolith until multi-tenant scale requires further separation.

## Production Requirements

### Required Backend Components
- `Supabase Postgres` for shows, guests, bookings, reminders, and CRM stages
- OAuth-backed calendar integration store
- Scheduled reminder workflow

### Recommended Free Stack
- `Vercel` + `Supabase`
- `Resend` for guest emails
- `Sentry` for calendar sync and booking failures

### Production Notes
- Timezone normalization is mandatory
- Calendar sync tokens need secure rotation and storage
- Booking and guest-form submissions should be auditable
