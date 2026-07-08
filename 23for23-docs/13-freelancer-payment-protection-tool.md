# Freelancer Payment Protection Tool

## MRD

### Executive Summary
Freelancer Payment Protection Tool is an escrow-style milestone payment workflow for direct freelancer-client relationships. Freelancers frequently face late payment, scope drift, and non-payment in off-platform deals. Marketplaces solve this through platform-controlled escrow, but many freelancers source work directly and lose those protections. The product adds milestone funding, release conditions, and dispute-light workflows to direct contracts.

### Target Market
Primary persona: independent freelancer closing direct clients
- design, development, marketing, consulting
- charges project fees rather than hourly platform jobs
- wants payment security without forcing clients onto a marketplace

Primary persona: small agency doing fixed-scope projects
- needs milestone funding before starting work

Secondary persona: startup client wanting a professional payment workflow without complex procurement

### Market Size
- TAM estimate: millions of freelancers globally working off-platform.
- SAM estimate: 500,000 freelancers in India and English-speaking markets willing to pay for payment protection.
- SOM estimate: 5,000 active projects/month through the platform in 3 years.

### Problem Statement
Direct freelancer deals are high-trust and low-protection. Contracts alone do not guarantee payment, and clients also fear paying too much upfront. The gap is a simple middle layer where funds are committed milestone by milestone and released against accepted deliverables.

### Competitive Landscape
| Competitor | Pricing | Strengths | Weaknesses |
| --- | --- | --- | --- |
| Upwork escrow flow | built into marketplace fees | trusted escrow mechanics | only works inside marketplace relationship |
| Bonsai | freelancer ops suite | contracts and invoicing support | not an escrow-style payment-protection product by default |
| Deel / contractor tools | contractor payments and compliance | strong business payments | heavier and more B2B/employer-centric |

### Differentiation Strategy
- built for direct deals, not marketplace jobs
- milestone-funding flow simple enough for small projects
- localized India-friendly payout path with Razorpay Route
- combines escrow-like protection with light workflow overhead

### Business Model
- 3% platform fee from funded milestones
- optional dispute-assist fee
- subscription plan for agencies with lower transaction rates

### Go-to-Market Strategy
- sell through freelancer communities and creator-business content
- partner with contract/invoice tools and freelancer educators
- first 100 users via concierge onboarding on real projects

## PRD

### Purpose and Vision
Vision statement: make direct freelancer payments feel as protected as marketplace jobs without the marketplace.

The product creates confidence on both sides by requiring milestone funding before work starts and by keeping release actions explicit.

### Target Audience
Persona 1: Neha, freelance designer
- Goals: avoid chasing clients after project delivery
- Frustrations: direct clients delay payments or renegotiate late
- Day-in-the-life: sends proposals and invoices manually, hopes clients pay on time

Persona 2: Evan, startup founder hiring freelancers directly
- Goals: pay against progress, not blind trust
- Frustrations: worries about paying too much upfront
- Day-in-the-life: hires specialists for short projects and wants a cleaner process

### Feature List
- Must-have: project and milestone creation
- Must-have: client funding of milestone
- Must-have: milestone submission and approval flow
- Must-have: payout release to freelancer
- Must-have: dashboard showing project payment status
- Must-have: transaction ledger and receipt history
- Should-have: dispute hold workflow
- Could-have: contract attachment and e-sign
- Won't-have for v1: full arbitration service

### User Stories
1. As a freelancer, I want a client to fund a milestone before I begin work.
2. As a client, I want to see milestone scope before funding.
3. As a freelancer, I want to mark a milestone submitted.
4. As a client, I want to approve and release payment easily.
5. As a freelancer, I want visibility into pending and released funds.
6. As a client, I want transaction receipts and audit history.
7. As a platform admin, I want to hold disputed payments.
8. As a repeat user, I want project templates.

### Acceptance Criteria
- milestone cannot move to active until funds are reserved
- freelancer can submit deliverable note and attachment
- client can release or raise issue within configured review window
- released payouts create ledger entries and payout jobs
- dispute hold prevents payout until resolved or cancelled

### User Flow
1. Freelancer creates project and milestones
2. Client receives link and funds first milestone
3. Funds are held
4. Freelancer completes work and submits
5. Client approves
6. System releases payout
7. Next milestone begins

### Non-Functional Requirements
- payment state consistency and idempotency
- 99.9% transaction reliability
- secure handling of financial and KYC-adjacent data
- detailed audit logs

### Constraints and Dependencies
- escrow-like structures depend on payment-provider capabilities and regulations
- dispute resolution needs clear policy even if lightweight
- payout timing must be transparent

## TRD

### System Architecture
Monolith with payment orchestration layer. Frontend supports projects, milestones, funding, submissions, and payout status. Backend coordinates payment intents, ledger updates, milestone state transitions, and payout jobs. PostgreSQL stores projects, transactions, and audit events. Payment webhooks are critical to state reconciliation.

### Technology Stack
| Layer | Recommendation | Justification |
| --- | --- | --- |
| Frontend | Next.js | clear project and milestone dashboard |
| Backend | Node.js/NestJS | payment workflow orchestration |
| Database | PostgreSQL | transactional consistency |
| Queue | Redis/BullMQ | webhook retries and payouts |
| Payments | Razorpay Route | split and hold-like marketplace/payment routing support |

### API Design
| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/projects` | project payload | project id | Bearer |
| POST | `/api/v1/projects/{id}/milestones` | milestone payload | milestone id | Bearer |
| POST | `/api/v1/milestones/{id}/fund` | payment method data | payment intent | Bearer |
| POST | `/api/v1/milestones/{id}/submit` | note, attachment refs | milestone state | Bearer |
| POST | `/api/v1/milestones/{id}/approve` | none | release status | Bearer |
| POST | `/api/v1/webhooks/payments` | provider payload | ack | Provider sig |
| GET | `/api/v1/projects/{id}/ledger` | none | ledger entries | Bearer |

### Data Models
| Table | Fields | Relationships |
| --- | --- | --- |
| `projects` | id, freelancer_id, client_id, title, currency, status | one-to-many milestones |
| `milestones` | id, project_id, title, amount, status, due_date | belongs to project |
| `payment_intents` | id, milestone_id, provider_ref, amount, status | belongs to milestone |
| `payouts` | id, milestone_id, payee_id, amount, status, released_at | belongs to milestone |
| `ledger_entries` | id, project_id, entry_type, amount, reference_id, created_at | belongs to project |
| `audit_events` | id, actor_id, entity_type, entity_id, action, metadata | global audit |

### Third-Party Integrations
- Razorpay Route for payment collection and payout
- storage for milestone attachments
- email notifications

### Security Architecture
- KYC-aware account setup
- signed webhooks and idempotent payment handling
- encryption at rest and in transit
- immutable audit logs for transaction changes

### Infrastructure and DevOps
- staging environment using test payment credentials
- webhook replay tooling
- transaction and payout monitoring dashboards

### Scalability Plan
At 10x volume, isolate payment event processing, use outbox patterns for ledger consistency, and add reconciliation jobs. The platform should remain a modular monolith until payment complexity or dispute volume justifies deeper service boundaries.

## Production Requirements

### Required Backend Components
- `Supabase Postgres` for projects, milestones, payment intents, payouts, ledger entries, and audit events
- Secure webhook handlers for payment state reconciliation
- Immutable ledger model

### Recommended Free Stack
- `Supabase` for DB and auth
- `Supabase Edge Functions` for webhooks
- `Sentry` for payment and payout failures

### Production Notes
- Idempotent payment handling is mandatory
- Ledger writes must be append-only
- Test and production payment environments should be separated
