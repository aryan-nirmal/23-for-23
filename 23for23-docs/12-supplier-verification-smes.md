# Supplier Verification for SMEs

## MRD

### Executive Summary
Supplier Verification for SMEs is a trust-layer product for Indian B2B trade that combines GSTIN lookup and peer-signal collection to reduce supplier-risk decisions. Small businesses often buy from new vendors without reliable diligence. Enterprise procurement systems are overkill, while public registry searches do not capture reliability signals. This product combines public verification and community feedback into a lightweight trust score for SME procurement.

### Target Market
Primary persona: procurement owner at an SME
- sources from new vendors regularly
- wants to avoid fraud, non-delivery, or poor reliability

Primary persona: founder or finance operator at a trading or manufacturing SME
- checks GSTIN manually
- wants faster supplier qualification

Secondary persona: industry-specific B2B networks and associations

### Market Size
- TAM estimate: millions of SME procurement relationships in India.
- SAM estimate: 500,000 SMEs that transact with new suppliers and value vendor checks.
- SOM estimate: 8,000 paying businesses in 3 years.

### Problem Statement
SMEs need a practical supplier-trust workflow, but current options are fragmented. Public GST validation says a business exists; it does not say whether it pays on time, delivers consistently, or has been flagged by peers. The gap is a cheap verification layer for SME purchasing decisions.

### Competitive Landscape
| Competitor | Pricing | Strengths | Weaknesses |
| --- | --- | --- | --- |
| IndiaMART platform signals | broad supplier discovery | network effects and reviews | not purpose-built as a neutral verification utility |
| MCA/GST public checks | authoritative registration data | official public records | no operational trust layer |
| Trade-credit bureaus | richer commercial insight | stronger finance signals | harder access and cost for small businesses |

### Differentiation Strategy
- combines registration verification and peer feedback
- optimized for low-ticket but frequent SME decisions
- quick lookup flow instead of procurement-suite adoption

### Business Model
- Free verification basics
- Pro: INR 499/month for unlimited lookups and saved watchlists
- Team: INR 1,499/month with shared notes and reviewer access

### Go-to-Market Strategy
- partner with SME communities, chambers, and accountants
- launch in a few verticals first such as packaging, fabrication, and distributors
- first 100 users via founder and procurement WhatsApp groups

## PRD

### Purpose and Vision
Vision statement: help SMEs answer "can I trust this supplier?" with more than a GST search.

The product reduces vendor-risk uncertainty by putting formal registration and practical peer signals in one decision interface.

### Target Audience
Persona 1: Pooja, operations head at a small manufacturer
- Goals: verify new vendors faster
- Frustrations: inconsistent information across calls and documents
- Day-in-the-life: compares quotes and worries about supplier credibility

Persona 2: Sandeep, founder of a trading business
- Goals: avoid fraud and delayed shipments
- Frustrations: public websites only confirm registration, not reliability
- Day-in-the-life: vets several new suppliers each month with limited internal process

### Feature List
- Must-have: GSTIN lookup
- Must-have: supplier profile record
- Must-have: peer review and rating submission
- Must-have: trust score with visible components
- Must-have: saved supplier watchlist
- Must-have: verification history log
- Should-have: red-flag reporting workflow
- Could-have: payment term intelligence
- Won't-have for v1: trade financing

### User Stories
1. As a buyer, I want to verify a GSTIN quickly.
2. As a buyer, I want to save supplier profiles for later.
3. As a buyer, I want peer feedback to supplement public data.
4. As a user, I want trust score factors explained.
5. As an operator, I want suspicious profiles flagged.
6. As a team, I want internal notes on suppliers.
7. As a repeat user, I want watchlists for critical vendors.
8. As an admin, I want abuse controls on review submissions.

### Acceptance Criteria
- GSTIN search returns normalized supplier record or clear error
- user can save supplier to account
- trust score displays components and date stamps
- watchlist updates when profile status changes
- reviews require verified business context before publication

### User Flow
1. User searches GSTIN
2. System fetches public verification data
3. User views profile and score
4. User saves supplier or submits review
5. Team monitors watchlist changes

### Non-Functional Requirements
- lookup response under 5 seconds
- 99.5% uptime
- anti-abuse moderation on reviews
- encrypted storage for team notes

### Constraints and Dependencies
- trust signals are only as strong as network participation
- legal review required for review moderation and defamation handling
- official data-source reliability affects lookup freshness

## TRD

### System Architecture
Web app with verification adapter layer. Frontend provides search, supplier profile, review, and watchlist views. Backend integrates with GST/public data sources, computes scores, stores notes and reviews, and handles moderation. PostgreSQL stores account data, suppliers, lookups, and reviews.

### Technology Stack
| Layer | Recommendation | Justification |
| --- | --- | --- |
| Frontend | Next.js | fast search UI |
| Backend | Node.js | API composition and moderation workflows |
| Database | PostgreSQL | profile, review, and team data |
| Queue | Redis | refresh and moderation jobs |
| Hosting | Render/Railway | simple hosting |

### API Design
| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/suppliers/lookup?gstin=` | none | supplier profile | Bearer |
| POST | `/api/v1/suppliers/save` | supplier id | saved status | Bearer |
| GET | `/api/v1/suppliers/{id}` | none | full profile | Bearer |
| POST | `/api/v1/reviews` | supplier id, rating, note | review id | Bearer |
| GET | `/api/v1/watchlist` | none | supplier list | Bearer |
| POST | `/api/v1/reports` | supplier id, reason | report id | Bearer |
| GET | `/api/v1/history/lookups` | none | lookup history | Bearer |

### Data Models
| Table | Fields | Relationships |
| --- | --- | --- |
| `accounts` | id, name, plan | one-to-many users |
| `users` | id, account_id, email, role | belongs to account |
| `suppliers` | id, gstin, legal_name, state, status, metadata_json | reusable profiles |
| `supplier_reviews` | id, supplier_id, account_id, rating, note, moderation_status | belongs to supplier |
| `watchlist_entries` | id, account_id, supplier_id, created_at | join table |
| `lookup_events` | id, account_id, supplier_id, created_at | audit table |

### Third-Party Integrations
- GST/public verification source
- optional email alerts
- anti-spam moderation provider later

### Security Architecture
- RBAC for account teams
- encrypted internal notes
- moderation logs and immutable review actions
- rate limits on lookups and submissions

### Infrastructure and DevOps
- scheduled refresh jobs for watched suppliers
- moderation queue monitoring
- backup and restore plan

### Scalability Plan
At 10x growth, cache verification results, move score recomputation to async jobs, and add abuse-detection heuristics for reviews. Registry fetch adapters stay behind a single integration layer.

## Production Requirements

### Required Backend Components
- `Supabase Postgres` for supplier profiles, reviews, watchlists, notes, and lookup logs
- Moderation queue for reviews and red flags
- Adapter layer for GST/public verification lookups

### Recommended Free Stack
- `Supabase` for core data
- `Resend` for watchlist notifications
- `Sentry` for lookup and moderation failures

### Production Notes
- Score breakdown should be stored transparently
- Review moderation is mandatory before public scaling
- Lookup freshness timestamps should be visible in product
