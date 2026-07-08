# AI-Powered SOPs Generator

## MRD

### Executive Summary
AI-Powered SOPs Generator helps SMEs, agencies, and operations teams convert informal process knowledge into structured Standard Operating Procedures quickly. The market need is straightforward: most small businesses know what their repeatable processes are, but they do not document them because documentation is slow, formatting is tedious, and quality varies by writer. The product packages LLM generation, document structure, and export formatting into a single workflow aimed at operational teams that need usable SOPs, not general-purpose chat output.

### Target Market
Primary persona: operations manager at an SME
- Company size 10-200 employees
- Responsible for onboarding, quality consistency, and internal documentation
- Goal: document recurring workflows without hiring consultants

Primary persona: agency founder or team lead
- Needs SOPs for service delivery, handoffs, QA, and onboarding
- Goal: reduce tribal knowledge and speed up hiring

Secondary persona: compliance-heavy small business
- Healthcare, food, manufacturing support, logistics
- Goal: generate first drafts that can be reviewed by domain experts

### Market Size
- TAM estimate: 15 million SMBs globally that regularly formalize or should formalize recurring processes.
- SAM estimate: 1.2 million English-language SMEs and agencies already willing to pay for workflow software.
- SOM estimate: 8,000 paid accounts in 3 years with focused SMB distribution.
These are bottom-up estimates based on workflow-software adoption, not a directly published "SOP generator" category.

### Problem Statement
Businesses fail to document processes not because they lack processes, but because documentation is too expensive relative to perceived value. Chat models can produce text, but not necessarily consistent SOP structure, role definitions, revision flows, or export-ready output. The gap is a structured SOP product that turns process descriptions into professional artifacts fast enough to fit a normal operating cadence.

### Competitive Landscape
| Competitor | Pricing | Strengths | Weaknesses |
| --- | --- | --- | --- |
| Notion AI | Workspace subscription plus AI usage | Familiar workspace, collaborative editing | Not SOP-specific; structure and templates still manual |
| Process Street | BPM-focused pricing | Strong workflow and checklist products | Heavier than needed for quick document generation |
| Scribe | Documentation automation focus | Great for click-by-click process capture | Better for screen recording than plain-English process synthesis |

### Differentiation Strategy
- Start from plain-English process input, not workflow software setup.
- Produce structured SOPs with section-level regeneration.
- Offer domain templates and output formatting from day one.
- Serve teams that need documents first, workflow automation later.

### Business Model
- Free: 3 SOP generations/month with PDF watermark
- Pro: $19/month, unlimited drafts, DOCX/PDF export, brand logo
- Team: $79/month, 5 seats, shared templates, approval workflow
- Agency: $199/month, client workspaces and branded exports

Estimated revenue
- Month 6: 80 Pro, 15 Team, 3 Agency, about $2,892 MRR
- Month 12: 300 Pro, 60 Team, 10 Agency, about $8,630 MRR

### Go-to-Market Strategy
- Launch through agency operators, ops consultants, and startup communities
- Publish "SOP in 5 minutes" demo content
- Create SEO pages for process-specific templates
- Acquire first 100 users via direct outreach to agencies and operations freelancers

## PRD

### Purpose and Vision
Vision statement: turn undocumented business know-how into clean, repeatable SOPs in minutes.

The product solves the blank-page problem for process documentation. Users know the work but need help structuring purpose, scope, responsibilities, and steps into a document that teams can actually use.

### Target Audience
Persona 1: Priya Menon, operations manager at a 40-person D2C company
- Goals: reduce training inconsistency and document handoffs
- Frustrations: process docs get postponed and written unevenly
- Day-in-the-life: coordinates customer-support, fulfillment, and vendor workflows; needs quick drafts for team review

Persona 2: Alex Moore, agency founder
- Goals: create client delivery SOPs and onboarding docs
- Frustrations: writing repetitive docs wastes billable time
- Day-in-the-life: juggles delivery, hiring, QA, and sales and needs SOPs across all of them

### Feature List
- Must-have: free-text process description input
- Must-have: industry selector
- Must-have: SOP generation with purpose, scope, roles, procedure, QA checks
- Must-have: section-by-section editing and regeneration
- Must-have: PDF export
- Must-have: DOCX-ready structured markdown or document output
- Must-have: logo upload for branded header
- Should-have: saved templates
- Should-have: approval status
- Could-have: version compare and change tracking
- Won't-have for v1: enterprise SSO

### User Stories
1. As an ops manager, I want to describe a process in plain English so that I can get a first draft quickly.
2. As a team lead, I want consistent SOP sections so that team members know where to look.
3. As a user, I want to regenerate one section so that I do not lose the whole document.
4. As a business owner, I want my logo on the SOP so that the output looks professional.
5. As a manager, I want PDF export so that I can share docs immediately.
6. As a repeat user, I want templates so that I can reuse the same structure.
7. As a reviewer, I want edits preserved between regenerations.
8. As an admin, I want audit history so that approved SOPs are traceable.

### Acceptance Criteria
- Process input validates minimum content length before generation
- Generated document always contains all required sections
- Section regeneration only modifies targeted section
- Export preserves hierarchy and branding
- Saved drafts retain user edits after page refresh

### User Flow
1. User opens generator
2. Selects industry
3. Pastes process description
4. Uploads logo optionally
5. Generates SOP
6. Reviews sections and edits text
7. Regenerates weak sections if needed
8. Exports PDF or shares link internally

### Non-Functional Requirements
- generation under 20 seconds p95
- 99.5% uptime
- autosave draft every 5 seconds
- secure file handling for logos and exports
- accessible editor and export controls

### Constraints and Dependencies
- output quality depends on input quality
- some regulated industries still require legal or compliance review
- depends on LLM provider and export renderer
- MVP team: 1 full-stack engineer, 1 designer, founder-led QA

## TRD

### System Architecture
Modular monolith with document-generation worker. Frontend editor and dashboard on Next.js. Backend handles generation, draft persistence, export jobs, and template management. PostgreSQL stores accounts, templates, drafts, versions, and assets. Object storage keeps exported files and logos.

### Technology Stack
| Layer | Recommendation | Justification |
| --- | --- | --- |
| Frontend | Next.js + TypeScript | Rich editor and SEO landing pages |
| Backend | Node.js + NestJS | Clean APIs and auth support |
| Database | PostgreSQL | Structured drafts and versioning |
| Queue | Redis/BullMQ | export and generation jobs |
| AI | OpenAI Responses API | structured text generation |
| Hosting | Vercel + managed API host | simple deployment |

### API Design
| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/sops` | title, industry, process_text | sop id + generated sections | Bearer |
| GET | `/api/v1/sops/{id}` | none | full SOP document | Bearer |
| PATCH | `/api/v1/sops/{id}` | edited sections | updated doc | Bearer |
| POST | `/api/v1/sops/{id}/regenerate` | section name, instruction | regenerated section | Bearer |
| POST | `/api/v1/sops/{id}/export/pdf` | none | download url | Bearer |
| POST | `/api/v1/templates` | template payload | template id | Bearer |
| GET | `/api/v1/templates` | none | template list | Bearer |

### Data Models
| Table | Fields | Relationships |
| --- | --- | --- |
| `accounts` | id, name, plan, created_at | one-to-many users |
| `users` | id, account_id, email, role | belongs to account |
| `sops` | id, account_id, title, industry, status, created_by | belongs to account |
| `sop_sections` | id, sop_id, section_key, generated_text, edited_text | belongs to SOP |
| `templates` | id, account_id, name, industry, template_json | reusable structure |
| `exports` | id, sop_id, file_type, storage_key, created_at | exported files |

### Third-Party Integrations
- LLM provider for generation
- object storage for exports and branding files
- transactional email for share notifications

### Security Architecture
- email/passwordless auth or OAuth
- account-scoped RBAC
- encryption at rest and in transit
- audit logging for exports and approvals

### Infrastructure and DevOps
- Vercel frontend, API worker service, managed Postgres
- GitHub Actions CI
- Sentry and uptime monitoring
- separate dev/staging/prod

### Scalability Plan
At 10x growth, generation jobs move to dedicated workers, exports to object storage, and document retrieval to cached read paths. Account-level templates and approval flows can remain in the monolith until workflow automation features justify service separation.

## Production Requirements

### Required Backend Components
- `Supabase Postgres` for SOPs, sections, templates, versions, and approvals
- `Supabase Storage` for logos and generated exports
- Section-level regeneration and draft persistence

### Recommended Free Stack
- `Vercel` + `Supabase`
- `Sentry` for generation/export failures
- `PostHog` for funnel analysis

### Production Notes
- Store SOP sections separately rather than as one document blob
- Template versioning is required for consistent output
- Admin review tools help manage prompt/template quality
