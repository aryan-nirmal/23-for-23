# Rent Agreement Generator

## MRD

### Executive Summary
Rent Agreement Generator creates legally formatted Indian rental agreements quickly with state-sensitive clause templates and export-ready documents. The opportunity sits in a highly repetitive but poorly digitized workflow: landlords and tenants often copy outdated samples from the internet or rely on local typists. The product offers speed, structure, and localization while clearly positioning legal content as templated guidance requiring user review.

### Target Market
Primary persona: individual landlord
- owns 1-5 properties
- wants fast document generation without a lawyer for standard cases

Primary persona: tenant or broker
- needs a clean agreement to close occupancy quickly

Secondary persona: small property manager handling repeated rental paperwork

### Market Size
- TAM estimate: millions of recurring rental transactions in India each year.
- SAM estimate: 1 million digitally comfortable landlords, brokers, and tenants.
- SOM estimate: 20,000 paid document generations annually in 3 years.

### Problem Statement
Standard rent agreements are repetitive but locally variable. Users want documents fast, but generic templates omit state expectations, key clauses, or formatting details. Lawyers are still needed for edge cases; the product gap is standardized generation for common residential agreements.

### Competitive Landscape
| Competitor | Pricing | Strengths | Weaknesses |
| --- | --- | --- | --- |
| LegalDesk | India legal-document generation | Known consumer legal-doc brand | Broader flow, not only rental focus |
| eDrafter | legal document templates | Practical transaction-oriented products | Varies by state and service depth |
| Offline local drafting services | familiar local support | High trust and customization | Slow, inconsistent, offline-only |

### Differentiation Strategy
- ultra-fast residential-rental workflow
- state-sensitive clause packs
- cleaner UX than legal marketplaces
- useful for first-time landlords and brokers

### Business Model
- Pay-per-document: INR 299 per agreement
- Premium state pack + editable clauses: INR 499
- Broker plan: INR 1,999/month for volume generation

### Go-to-Market Strategy
- SEO around rent agreement terms by city and state
- partnerships with brokers and property managers
- first 100 users through one-city broker network and local landlord communities

## PRD

### Purpose and Vision
Vision statement: generate a clean Indian rent agreement in minutes for common residential use cases.

The product simplifies data collection, clause insertion, and formatted document output for standard rentals.

### Target Audience
Persona 1: Sunita, landlord in Pune
- Goals: issue agreement fast for a new tenant
- Frustrations: online templates are outdated and messy
- Day-in-the-life: coordinates with broker, wants document signed this week

Persona 2: Arjun, local broker
- Goals: create multiple agreements without repetitive drafting
- Frustrations: uses Word files and manual edits repeatedly
- Day-in-the-life: manages multiple move-ins and wants standardized paperwork

### Feature List
- Must-have: landlord/tenant detail capture
- Must-have: property detail capture
- Must-have: rent, deposit, duration, notice period clauses
- Must-have: state-specific clause presets
- Must-have: formatted PDF export
- Must-have: optional stamp-paper guidance notes
- Should-have: e-sign handoff links
- Could-have: renewal agreement generation
- Won't-have for v1: full legal advisory service

### User Stories
1. As a landlord, I want to answer a guided form instead of editing a raw template.
2. As a broker, I want state-specific defaults so that drafting is faster.
3. As a user, I want required clauses included automatically.
4. As a user, I want a professional PDF output.
5. As a broker, I want saved parties and properties for repeat use.
6. As a user, I want to know which fields are mandatory.
7. As an operator, I want template versioning by state.
8. As a user, I want a renewal shortcut for existing agreements.

### Acceptance Criteria
- form validates all mandatory tenancy data
- correct template version selected by state
- generated document includes all required user data and selected clauses
- PDF output preserves formatting and signature blocks
- saved records are reusable in later agreements

### User Flow
1. User selects state and agreement type
2. Enters landlord, tenant, and property details
3. Reviews key terms and optional clauses
4. Generates preview
5. Edits text if needed
6. Downloads PDF

### Non-Functional Requirements
- page loads under 2 seconds
- document generation under 10 seconds
- secure handling of personal identity information
- 99.5% uptime

### Constraints and Dependencies
- state laws and stamp rules vary
- product must avoid giving individualized legal advice
- template review needed periodically

## TRD

### System Architecture
Template-driven web app. Frontend captures form data and preview. Backend selects template based on state and agreement type, merges variables, and renders output. PostgreSQL stores users, parties, properties, and generated agreements. Templates are versioned and content-managed.

### Technology Stack
| Layer | Recommendation | Justification |
| --- | --- | --- |
| Frontend | Next.js | dynamic multi-step forms |
| Backend | Node.js | template rendering and export |
| Database | PostgreSQL | reusable form data and agreement records |
| PDF Renderer | server-side document render pipeline | consistent output |
| Hosting | Render/Railway | fast MVP hosting |

### API Design
| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/agreements` | state, parties, property, terms | agreement id | Session/Bearer |
| GET | `/api/v1/agreements/{id}` | none | agreement preview | Session/Bearer |
| PATCH | `/api/v1/agreements/{id}` | updated fields | agreement object | Session/Bearer |
| POST | `/api/v1/agreements/{id}/export` | none | pdf url | Session/Bearer |
| GET | `/api/v1/templates/states` | none | supported state list | Public |
| POST | `/api/v1/renewals` | prior agreement id + new terms | new agreement id | Bearer |

### Data Models
| Table | Fields | Relationships |
| --- | --- | --- |
| `users` | id, email, role | one-to-many agreements |
| `parties` | id, user_id, party_type, name, address, id_number | reusable profiles |
| `properties` | id, user_id, address, city, state, pincode | reusable properties |
| `agreements` | id, user_id, state, template_version, term_months, rent_amount, deposit_amount, status | belongs to user |
| `agreement_parties` | id, agreement_id, party_id, role_label | join table |

### Third-Party Integrations
- PDF generation
- optional e-sign provider later
- payment provider for pay-per-document

### Security Architecture
- PII encryption at rest
- secure session handling
- audit history for generated legal docs

### Infrastructure and DevOps
- template review pipeline
- CI for clause and render tests
- backups of user data and generated docs

### Scalability Plan
At 10x growth, document rendering moves to worker pool, template cache warms by state, and repeated landlord/broker data is optimized through reusable profiles.

## Production Requirements

### Required Backend Components
- `Supabase Postgres` for users, parties, properties, agreements, and template versions
- `Supabase Storage` for generated agreement files
- State-template library with metadata and version control

### Recommended Free Stack
- `Vercel` + `Supabase`
- `Sentry` for render failures
- `PostHog` for form completion analytics

### Production Notes
- Clause libraries should be versioned by state
- Reusable party/property records improve repeat usage
- Preview and export outputs should be stored separately from editable drafts
