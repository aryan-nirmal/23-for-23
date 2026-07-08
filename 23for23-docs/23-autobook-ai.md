# AutoBook AI

## MRD

### Executive Summary
AutoBook AI is an AI booking agent that handles inbound scheduling inquiries over email, proposes time slots based on calendar availability, confirms bookings, and follows up automatically. It targets service providers who do not need a full CRM but do need more than a booking link. The product lives in the gap between simple schedulers like Calendly and expensive conversational sales agents: it interprets natural inbound requests and drives them to a confirmed appointment.

### Target Market
Primary persona: solo service professional
- consultant, tutor, photographer, fitness coach, therapist-like non-clinical service
- handles inbound leads directly via Gmail
- loses time to scheduling back-and-forth

Primary persona: small service business owner
- needs staff or client bookings coordinated via email
- wants automated follow-up on undecided leads

Secondary persona: admin assistant or VA managing multiple calendars

### Market Size
- TAM estimate: millions of service providers globally who schedule appointments via email and messaging.
- SAM estimate: 500,000 English-speaking solo operators and small firms likely to pay for automation.
- SOM estimate: 8,000 paying accounts in 3 years.

### Problem Statement
Booking workflows contain more nuance than picking a slot. Prospects ask questions, state constraints, go silent, or ask to reschedule. Calendly handles the final step but not the conversational lead-to-booking process. The market gap is a lightweight agent that interprets inbound booking intent, proposes relevant slots, confirms appointments, and nudges inactive leads.

### Competitive Landscape
| Competitor | Pricing | Strengths | Weaknesses |
| --- | --- | --- | --- |
| Calendly | strong booking-link product | simple and trusted scheduling | does not handle conversational inbox qualification or follow-up |
| Motion / scheduling assistants | workflow automation | richer productivity tooling | broader than solo service-provider needs |
| AI phone/sales agents | conversational automation | handles more modalities | too expensive and complex for small service providers |

### Differentiation Strategy
- inbox-native booking flow
- AI agent only for one job: convert booking inquiry to confirmed event
- strong fit for solo operators with Gmail and Google Calendar
- cheaper and simpler than full AI sales agents

### Business Model
- Starter: $19/month for one inbox and one calendar
- Pro: $49/month with follow-up automation and team inbox support
- Agency/Studio: $149/month for multiple operators

### Go-to-Market Strategy
- target solo service businesses and creators
- demo using real inbound inquiry examples
- first 100 users via concierge onboarding with Gmail-connected beta users

## PRD

### Purpose and Vision
Vision statement: convert inbound booking emails into confirmed calendar events without manual back-and-forth.

The product automates a narrow but repetitive workflow. It reads booking intent, proposes slots, handles confirmation and reminders, and escalates ambiguous cases when confidence is low.

### Target Audience
Persona 1: Priya, freelance consultant
- Goals: stop losing hours to scheduling admin
- Frustrations: prospects email vague availability and then disappear
- Day-in-the-life: juggles client work while answering repetitive scheduling messages from Gmail

Persona 2: Jordan, photography studio owner
- Goals: qualify inquiries and book sessions faster
- Frustrations: staff spends too much time coordinating slots manually
- Day-in-the-life: reviews many inquiries that should become appointments but require multiple replies

### Feature List
- Must-have: Gmail inbox integration
- Must-have: booking-intent detection
- Must-have: Google Calendar availability lookup
- Must-have: AI-generated slot proposal email
- Must-have: confirmation detection and calendar event creation
- Must-have: automated follow-up for non-response
- Must-have: human-review fallback on low confidence
- Should-have: booking dashboard with lead status
- Could-have: WhatsApp booking agent v2
- Won't-have for v1: phone-call booking

### User Stories
1. As a service provider, I want booking emails detected automatically.
2. As a user, I want the agent to propose relevant slots from my calendar.
3. As a user, I want confirmed replies turned into calendar events.
4. As a user, I want follow-up emails sent when prospects stop replying.
5. As a user, I want ambiguous emails flagged for manual review.
6. As an admin, I want conversation history and booking status in one dashboard.
7. As a user, I want reschedule handling for booked appointments.
8. As a user, I want to configure working hours and buffer times.

### Acceptance Criteria
- inbox integration reads only authorized messages
- booking-intent classifier identifies eligible emails with confidence score
- slot proposal respects working hours, calendar conflicts, and buffers
- confirmation emails create calendar events with attendees
- low-confidence cases enter review queue instead of auto-send
- follow-up jobs stop once booking is confirmed or user intervenes

### User Flow
1. User connects Gmail and Google Calendar
2. Configures booking rules and working hours
3. Inbound inquiry arrives
4. System detects booking intent and drafts or sends slot proposal
5. Prospect replies with preferred slot
6. System confirms availability and creates event
7. Confirmation email and invite go out
8. If no reply, follow-up triggers on schedule

### Non-Functional Requirements
- email processing latency under 2 minutes
- 99.5% dashboard uptime
- strong privacy and consent messaging around email access
- auditable decision logs for agent actions

### Constraints and Dependencies
- Gmail API access and verification can be time-consuming
- AI confidence and escalation thresholds must be tuned carefully
- user trust depends on transparent review controls

## TRD

### System Architecture
Modular monolith with inbox-ingestion workers. Frontend provides onboarding, rules configuration, dashboard, and review queue. Backend handles Gmail sync, classification, slot proposal generation, event creation, and follow-up scheduling. PostgreSQL stores users, connected accounts, threads, booking intents, and events. Workers process inbox updates asynchronously. A monolith is appropriate for MVP because the main complexity is workflow orchestration, not service decomposition.

### Technology Stack
| Layer | Recommendation | Justification |
| --- | --- | --- |
| Frontend | Next.js | operator dashboard and onboarding |
| Backend | Node.js/NestJS | strong support for OAuth, job queues, and API orchestration |
| Database | PostgreSQL | threads, intents, and audit logs |
| Queue | Redis/BullMQ | inbox processing and follow-ups |
| AI | OpenAI Responses API | email classification and constrained response drafting |
| Hosting | Render/Fly.io + Vercel | easy split between web and workers |

### API Design
| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/integrations/google/connect` | oauth code | integration status | Bearer |
| GET | `/api/v1/threads` | filters | thread list | Bearer |
| POST | `/api/v1/threads/{id}/process` | none | intent status | Bearer/Worker |
| POST | `/api/v1/threads/{id}/propose` | none | draft or sent message status | Bearer/Worker |
| POST | `/api/v1/threads/{id}/confirm` | selected slot | booking result | Bearer/Worker |
| GET | `/api/v1/bookings` | filters | booking list | Bearer |
| PATCH | `/api/v1/settings/availability` | work hours, buffers | settings object | Bearer |

### Data Models
| Table | Fields | Relationships |
| --- | --- | --- |
| `users` | id, email, plan, timezone | one-to-many integrations |
| `integrations` | id, user_id, provider, refresh_token, scope_set | belongs to user |
| `email_threads` | id, user_id, provider_thread_id, subject, status, last_message_at | belongs to user |
| `booking_intents` | id, thread_id, confidence, extracted_constraints_json, state | belongs to thread |
| `slot_proposals` | id, intent_id, slots_json, sent_at | belongs to intent |
| `bookings` | id, intent_id, calendar_event_id, starts_at, ends_at, status | belongs to intent |
| `audit_events` | id, user_id, thread_id, action, metadata, created_at | agent action log |

### Third-Party Integrations
- Gmail API for email read/send under user consent
- Google Calendar API for availability and event creation
- optional email provider fallback for transactional notifications
- AI provider for classification and response drafting

### Security Architecture
- OAuth 2.0 with least-privilege scopes
- encrypted token storage
- audit trail for every agent decision and outbound message
- configurable human-review mode and safe defaults

### Infrastructure and DevOps
- separate dev/staging/prod Google apps where possible
- webhook or polling worker monitoring
- queue alerts for stuck inbox sync jobs
- secret rotation and backup strategy

### Scalability Plan
At 10x growth, inbox-processing workers and calendar-availability checks become the main scale surfaces. Split sync ingestion from AI processing, cache availability reads briefly, and keep event creation idempotent. Human-review queues should remain centralized until volume justifies role-based operations support.

## Production Requirements

### Required Backend Components
- `Supabase Postgres` for users, integrations, threads, booking intents, slot proposals, bookings, and audit logs
- OAuth token storage and refresh handling
- Async inbox-processing and follow-up job pipeline

### Recommended Free Stack
- `Vercel` frontend
- `Supabase` for auth, DB, and functions
- `Upstash Redis` for queueing and retry coordination

### Production Notes
- Database and async processing are mandatory
- Human-review tooling is part of production trust
- All agent actions should be logged for auditability
