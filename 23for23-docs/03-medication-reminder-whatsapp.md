# Medication Reminder with WhatsApp

## MRD

### Executive Summary
Medication Reminder with WhatsApp addresses a high-frequency adherence problem in India and similar WhatsApp-first markets: elderly patients miss routine medication because reminder apps are too complex, caregivers are remote, and SMS lacks engagement. The product uses a familiar channel, WhatsApp, to send simple reminders, confirm doses, and escalate missed doses to caregivers. The commercial opportunity sits between consumer reminder apps and hospital-grade adherence platforms: a low-cost family and clinic tool for chronic medication management.

### Target Market
Primary persona: elderly patient with chronic medication routine
- Age 60-80, urban or semi-urban India, usually treated for diabetes, hypertension, thyroid, or cardiac conditions.
- Owns a smartphone primarily for calls, family photos, and WhatsApp.
- Goal: remember the right medicine at the right time without learning a new app.

Primary persona: adult caregiver
- Age 30-55, child or spouse of the patient, often living in another city.
- Goal: passive visibility into whether medicines are being taken without constant calling.

Secondary persona: small clinic or home-care operator
- Goal: improve adherence and reduce missed-dose complaints without building internal reminder software.

### Market Size
- TAM estimate: 40 million high-risk medication users in India.
Basis: India has a large elderly population and a high chronic-disease burden. This estimate models only elderly or chronic-condition users likely to benefit from daily reminders and is an internal estimate rather than an official count.
- SAM estimate: 8 million users.
Basis: urban and semi-urban smartphone users already active on WhatsApp and comfortable receiving reminders there.
- SOM estimate: 25,000 paying families or clinic-managed patients in 3 years.
Basis: focused rollout in India using caregiver-led acquisition, clinic pilots, and WhatsApp familiarity.

### Problem Statement
Medication adherence breaks down because reminder tools are designed like productivity apps rather than simple patient workflows. Elderly users forget doses, ignore alarms, or stop using complicated apps. Caregivers lack passive confirmation. Clinics cannot economically deploy enterprise adherence systems. The market gap is a low-friction conversational layer that works in the app elderly users already open every day.

### Competitive Landscape
| Competitor | Pricing | Strengths | Weaknesses |
| --- | --- | --- | --- |
| Medisafe | Free plus premium consumer model | Strong medication management features, known adherence brand | Requires separate app adoption; can be complex for older users |
| CareClinic | Subscription wellness and care-management model | Broader health tracking, reminders, caregiver features | App-heavy experience; less optimized for Indian WhatsApp-first usage |
| Twilio/WATI-based custom bots | Usage-based | Flexible infrastructure for clinics and operators | No productized patient/caregiver UX out of the box |

### Differentiation Strategy
- WhatsApp-native instead of app-native.
- Designed for elderly simplicity: one reminder, one reply, one caregiver escalation.
- Family purchase decision rather than patient-only purchase.
- Clinic add-on path for small providers that need adherence reporting without enterprise integration.

### Business Model
- Family plan: INR 149/month for one patient and one caregiver.
- Multi-patient family plan: INR 299/month for up to 4 patients.
- Clinic plan: INR 2,999/month for up to 100 active patients.
- Monetization comes from subscriptions, with SMS fallback as an add-on.

Revenue projection estimates
- Month 6: 300 family subscriptions and 3 clinic pilots, about INR 53,000 MRR.
- Month 12: 1,500 family subscriptions and 12 clinic accounts, about INR 2.6 lakh MRR.

### Go-to-Market Strategy
- Launch through caregiver communities, diabetes groups, and neighborhood clinics.
- Run pilots with geriatric physicians and home-care providers.
- First 100 users through direct concierge onboarding, not self-serve.
- Measure activation as the completion of 7 consecutive reminders with at least 80% response rate.

## PRD

### Purpose and Vision
Vision statement: make medication adherence as easy as replying "YES" on WhatsApp.

The product reduces medication non-adherence by replacing complicated reminder flows with a conversational confirmation loop. It serves both the patient, who needs a simple reminder, and the caregiver, who needs visibility when adherence breaks down.

### Target Audience
Persona 1: Meena Sharma, 68, diabetic and hypertensive
- Role: patient
- Goals: avoid missing morning and evening medicines
- Frustrations: forgets alarms, does not want to learn a new app
- Day-in-the-life: wakes up, checks family WhatsApp messages, receives reminder, replies after taking medicine

Persona 2: Rahul Sharma, 39, son living in Bengaluru
- Role: caregiver
- Goals: know whether his mother took medication without calling twice daily
- Frustrations: no reliable confirmation, worries when he gets no answer by phone
- Day-in-the-life: receives caregiver alerts only if reminder is missed, checks weekly adherence summary on Sunday

### Feature List
- Must-have: patient and caregiver registration
- Must-have: medication schedule creation with dosage time
- Must-have: WhatsApp reminder message
- Must-have: patient confirmation reply capture
- Must-have: missed-dose escalation to caregiver after time threshold
- Must-have: weekly adherence summary
- Must-have: support for multiple medications per patient
- Should-have: snooze reply option
- Should-have: caregiver dashboard
- Could-have: voice reminders and vernacular language prompts
- Won't-have for v1: EHR integration
- Won't-have for v1: insurance billing and claims support

### User Stories
1. As a caregiver, I want to register a patient so that reminders start quickly.
2. As a caregiver, I want to define reminder times so that medicines are sent on schedule.
3. As a patient, I want to reply on WhatsApp when I take a dose so that I do not need a separate app.
4. As a caregiver, I want an alert when a dose is missed so that I can follow up.
5. As a patient, I want multiple medications tracked so that one tool covers my routine.
6. As a caregiver, I want a weekly summary so that I can identify adherence trends.
7. As a clinic manager, I want to monitor active patients so that staff can intervene selectively.
8. As a platform owner, I want reminder logs so that message disputes can be resolved.

### Acceptance Criteria
- Registration succeeds only when patient and caregiver phone numbers are verified.
- Reminder jobs send within 2 minutes of scheduled time.
- Patient reply updates dose status to `taken`.
- No reply within configured window triggers caregiver alert.
- Weekly summary aggregates taken, missed, and delayed confirmations accurately.
- Multi-medication view separates schedules and logs by medication.

### User Flow
1. Caregiver opens landing page and starts setup.
2. Adds patient details, medication name, time, and caregiver number.
3. System verifies WhatsApp opt-in.
4. Reminder is sent at scheduled time.
5. Patient replies `YES`, `TAKEN`, or taps quick reply.
6. Status is marked complete.
7. If no response, caregiver receives alert.
8. Weekly summary is generated and delivered.

### Non-Functional Requirements
- 99.9% scheduler reliability for queued reminders
- 99.5% monthly uptime
- message send latency under 2 minutes from schedule time
- encryption in transit and at rest
- accessible caregiver dashboard and large-text patient templates

### Constraints and Dependencies
- Depends on WhatsApp Business API provider approval and templates
- Health-tech disclaimers required; not a medical device
- Requires strong consent flow for caregiver and patient messaging
- Team assumption: 1 backend engineer, 1 frontend engineer, 1 designer, 1 QA/ops generalist

## TRD

### System Architecture
Use a modular monolith. A web admin frontend handles onboarding, schedules, and summaries. Backend services manage patient records, reminder schedules, inbound webhook processing, and escalation logic. PostgreSQL stores users, schedules, logs, and adherence summaries. A scheduler worker triggers reminder jobs. WhatsApp API provider handles outbound and inbound messages. This should remain a monolith at MVP because workflow reliability matters more than service decomposition.

### Technology Stack
| Layer | Recommendation | Justification |
| --- | --- | --- |
| Frontend | Next.js | Fast caregiver onboarding and dashboard development |
| Backend | Node.js with NestJS | Good webhook, queue, and scheduling ecosystem |
| Database | PostgreSQL | Reliable relational scheduling and audit history |
| Queue | Redis + BullMQ | Delayed jobs and retries for reminders |
| Hosting | Render or Railway | Fast MVP deployment |
| Messaging | Twilio WhatsApp or WATI | Mature WhatsApp Business integrations |

### API Design
| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/patients` | patient profile, caregiver number | patient id | Session or bearer |
| POST | `/api/v1/patients/{id}/medications` | medication, dosage, schedule | medication id | Session or bearer |
| GET | `/api/v1/patients/{id}` | none | patient with schedules | Session or bearer |
| POST | `/api/v1/reminders/test` | patient id | send status | Session or bearer |
| POST | `/api/v1/webhooks/whatsapp` | inbound reply payload | ack | Provider signature |
| GET | `/api/v1/patients/{id}/adherence` | date range | adherence summary | Session or bearer |
| PUT | `/api/v1/medications/{id}` | updated schedule | medication object | Session or bearer |

### Data Models
| Table | Fields | Relationships |
| --- | --- | --- |
| `caregivers` | id, name, phone, whatsapp_opt_in, created_at | one-to-many patients |
| `patients` | id, caregiver_id, name, timezone, preferred_language, status | belongs to caregiver |
| `medications` | id, patient_id, name, dose_text, instructions, active | belongs to patient |
| `medication_schedules` | id, medication_id, reminder_time, recurrence_rule, grace_minutes | belongs to medication |
| `reminder_events` | id, schedule_id, due_at, sent_at, status, reply_text | belongs to schedule |
| `adherence_summaries` | id, patient_id, week_start, taken_count, missed_count, delayed_count | belongs to patient |

### Third-Party Integrations
- Twilio or WATI WhatsApp APIs for template messages and webhook replies
- Optional SMS provider fallback for failed WhatsApp delivery
- Optional PDF generator for clinic summaries

Fallback strategy
- If WhatsApp delivery fails, retry once and optionally send SMS
- If webhook reply parsing fails, preserve raw payload and flag for review

### Security Architecture
- Phone-number-based caregiver accounts with OTP login
- Role-based access between family and clinic users
- AES-256 encryption at rest, TLS in transit
- Audit logs for message sends, edits, and access
- Health disclaimers and consent capture stored as immutable events

### Infrastructure and DevOps
- Separate dev, staging, and production
- GitHub Actions for tests and deploy
- Queue monitoring, uptime checks, webhook-failure alerts
- Daily database backups

### Scalability Plan
At 10x scale, split scheduler workers from web nodes, shard reminder queues by timezone, and move reporting workloads to read replicas. Template management and clinic dashboards can remain in the monolith until enterprise integrations emerge.

## Production Requirements

### Required Backend Components
- `Supabase Postgres` for patients, caregivers, medications, schedules, and adherence logs
- Webhook handlers for inbound WhatsApp replies
- Scheduler for reminders and missed-dose escalation

### Recommended Free Stack
- `Supabase` for DB and auth
- `Supabase Edge Functions` for webhook processing
- `Sentry` for operational monitoring

### Production Notes
- Verified opt-in and consent capture must be stored
- Delivery and reply events need immutable logs
- Caregiver escalation rules should be configurable per patient
