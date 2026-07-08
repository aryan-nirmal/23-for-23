# Non-Prescription Sleep Solution Finder

## MRD

### Executive Summary
Non-Prescription Sleep Solution Finder is a quiz-based consumer health product that maps common sleep issues to evidence-based non-prescription interventions. It addresses a demand pattern seen across consumer health: users search for sleep advice online, receive generic and contradictory suggestions, and cannot determine whether they have poor sleep hygiene, circadian misalignment, anxiety-driven insomnia, or a clinical issue that warrants professional care. The product's value lies in structured triage and better-quality recommendations, not diagnosis.

### Target Market
Primary persona: adult with mild to moderate sleep difficulty
- age 22-45
- searches online for sleep tips and supplements
- wants non-prescription options before clinician consultation

Primary persona: health-conscious professional
- willing to pay for personalized guidance if grounded in evidence
- uses wellness apps but wants root-cause matching

Secondary persona: coach or wellness practitioner using the tool as intake support

### Market Size
- TAM estimate: 100+ million English-speaking adults actively searching for sleep solutions each year.
- SAM estimate: 8 million digital-health users likely to adopt a quiz-based sleep recommendation tool.
- SOM estimate: 20,000 paid users or coaching referrals in 3 years.

### Problem Statement
The sleep-advice market is saturated with generic content and product upsells, not user-specific problem matching. Users need a lightweight triage layer that classifies common sleep patterns, provides non-prescription interventions with evidence notes, and clearly flags when the situation is beyond self-help.

### Competitive Landscape
| Competitor | Pricing | Strengths | Weaknesses |
| --- | --- | --- | --- |
| Calm | Subscription meditation brand | Strong consumer wellness brand | Not built for root-cause classification |
| Sleep Cycle | Subscription sleep tracking | Good tracking and habit data | Focus on tracking, not intervention matching |
| CBT-i Coach | Clinical-adjacent support | Evidence-based orientation | Narrower experience and less consumer-friendly personalization |

### Differentiation Strategy
- quiz and classification first
- recommendation rationale and evidence notes
- explicit doctor-referral guardrails
- lightweight progress tracking instead of generic meditation content

### Business Model
- Free quiz and recommendation summary
- Premium plan at $9/month for sleep diary, progress tracking, and recommendation refreshes
- Affiliate or referral revenue from vetted products only where appropriate

### Go-to-Market Strategy
- SEO around specific sleep problems
- creator partnerships with therapists, coaches, and health educators
- first 100 users through online health communities and productivity audiences

## PRD

### Purpose and Vision
Vision statement: help people understand which non-prescription sleep interventions are most relevant to their pattern, quickly and safely.

The product is a guidance layer, not a diagnostic system. It converts a fragmented wellness search into a structured decision-support experience.

### Target Audience
Persona 1: Kavya, 29, marketing manager with sleep-onset insomnia
- Goals: fall asleep faster without medication
- Frustrations: too much conflicting advice online
- Day-in-the-life: works late, scrolls in bed, tries supplements inconsistently

Persona 2: Daniel, 38, software engineer with irregular sleep
- Goals: understand whether schedule or anxiety is the root issue
- Frustrations: tracking apps tell him what happened, not what to do
- Day-in-the-life: alternates between late-night work, travel, and weekend catch-up sleep

### Feature List
- Must-have: sleep intake quiz
- Must-have: issue classification engine
- Must-have: recommendation cards with rationale
- Must-have: evidence notes and source links
- Must-have: clinical escalation warnings
- Must-have: 2-week sleep diary
- Should-have: follow-up quiz
- Could-have: supplement tracker and coaching referrals
- Won't-have for v1: diagnosis claims or prescription support

### User Stories
1. As a user, I want a short quiz so that I can understand my likely sleep pattern.
2. As a user, I want non-prescription interventions matched to my answers.
3. As a user, I want to know why a recommendation was chosen.
4. As a user, I want warning signs clearly flagged so that I seek care when needed.
5. As a user, I want to track sleep for 2 weeks so that I can assess whether advice helped.
6. As a wellness coach, I want to export a summary so that I can review it with a client.
7. As a product owner, I want rules-based recommendations so that risky claims are controlled.
8. As a user, I want a progress view so that I stay engaged.

### Acceptance Criteria
- quiz contains all required questions before classification
- classification returns one primary pattern and optional secondary contributors
- every recommendation includes rationale and safety note
- red-flag answers always show escalation messaging
- diary entries save and trend over time

### User Flow
1. User starts quiz
2. Answers behavioral and symptom questions
3. Engine classifies likely issue pattern
4. Recommendations are presented
5. User starts 2-week tracker
6. Follow-up view compares progress and recommends next step

### Non-Functional Requirements
- page load under 2 seconds
- quiz completion without account creation
- secure handling of health-adjacent personal data
- WCAG AA compliance

### Constraints and Dependencies
- strict non-diagnostic positioning
- recommendation library requires content review
- some supplement guidance varies by market and user history

## TRD

### System Architecture
Web app with rules engine and content library. Frontend handles quiz, results, and tracking. Backend stores users, answers, classifications, recommendations, and diary entries. PostgreSQL stores structured data. Recommendation engine is largely deterministic with optional LLM-generated explanation text reviewed through constrained templates.

### Technology Stack
| Layer | Recommendation | Justification |
| --- | --- | --- |
| Frontend | Next.js | consumer health quiz UX |
| Backend | Python FastAPI | simple rules engine and analytics |
| Database | PostgreSQL | structured questionnaire data |
| Hosting | Vercel + API host | low ops |
| Analytics | PostHog | funnel and retention tracking |

### API Design
| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/quiz-sessions` | start payload | session id | Anonymous |
| POST | `/api/v1/quiz-sessions/{id}/answers` | answer set | saved | Anonymous |
| POST | `/api/v1/quiz-sessions/{id}/classify` | none | classification result | Anonymous |
| GET | `/api/v1/recommendations/{resultId}` | none | recommendations | Anonymous |
| POST | `/api/v1/sleep-diary` | entry payload | entry id | Bearer |
| GET | `/api/v1/sleep-diary/summary` | date range | trends | Bearer |
| GET | `/api/v1/content/evidence` | recommendation ids | evidence notes | Anonymous |

### Data Models
| Table | Fields | Relationships |
| --- | --- | --- |
| `quiz_sessions` | id, user_id, created_at, status | one-to-many answers |
| `quiz_answers` | id, session_id, question_key, answer_value | belongs to session |
| `classifications` | id, session_id, primary_issue, secondary_issue, risk_flag | belongs to session |
| `recommendations` | id, classification_id, title, rationale, evidence_level, warning_text | belongs to classification |
| `sleep_diary_entries` | id, user_id, sleep_start, wake_time, latency_minutes, notes | belongs to user |

### Third-Party Integrations
- optional content CMS
- email provider for follow-up nudges
- analytics provider

### Security Architecture
- anonymized quiz path before account creation
- encrypted storage for retained user data
- no sharing without consent
- legal disclaimers at onboarding and results

### Infrastructure and DevOps
- standard web deployment
- content versioning for recommendation library
- incident monitoring and analytics dashboards

### Scalability Plan
At 10x growth, recommendation reads can be cached heavily and diary analytics moved to background jobs. Keep the rules engine deterministic; do not introduce opaque ML scoring until there is clinically reviewed data to support it.

## Production Requirements

### Required Backend Components
- `Supabase Postgres` for quiz sessions, classifications, recommendations, and diary entries
- Content library with versioned recommendation records
- Rules engine for classification and red-flag escalation

### Recommended Free Stack
- `Vercel` + `Supabase`
- `PostHog` for quiz conversion analytics
- `Sentry` for app and rules-engine failures

### Production Notes
- Keep recommendation logic rules-first, not LLM-first
- Evidence notes should be stored as structured content
- Red-flag flows must always override generic recommendations
