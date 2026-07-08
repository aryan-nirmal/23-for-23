# FreelanceOS

## MRD

### Executive Summary
FreelanceOS is an all-in-one freelancer workflow platform that combines client portal, contracts, invoicing, and project tracking. It targets freelancers who currently stitch together Notion, Google Drive, contract templates, spreadsheets, and invoicing tools. The core opportunity is convenience and reduced context-switching for solo operators and small agencies.

### Target Market
Primary persona: established freelancer with 3-15 concurrent clients
- sells project-based or retainer services
- wants one place for delivery operations

Primary persona: micro-agency founder
- needs both internal tracking and client-facing transparency

Secondary persona: new freelancer upgrading from ad hoc tools

### Market Size
- TAM estimate: millions of active independent knowledge workers globally.
- SAM estimate: 1 million freelancers and micro-agencies already paying for some mix of workflow tools.
- SOM estimate: 6,000 paid accounts in 3 years.

### Problem Statement
Freelancers run a mini business but rarely have integrated operations. Existing tools solve isolated problems: contracts, invoicing, tasks, or client comms. The gap is an opinionated workspace for the freelance service lifecycle from onboarding to payment.

### Competitive Landscape
| Competitor | Pricing | Strengths | Weaknesses |
| --- | --- | --- | --- |
| Bonsai | strong freelancer suite | mature brand and broad workflow | can feel heavier or more expensive for early-stage users |
| HoneyBook | client services platform | polished client flows | stronger fit for certain creative-service segments |
| Notion + Stripe + DocuSign stack | flexible | customizable and familiar | fragmented and maintenance-heavy |

### Differentiation Strategy
- opinionated freelancer workflow instead of generic work software
- tight integration across contracts, invoices, task tracking, and client portal
- simpler than assembling a stack manually

### Business Model
- Solo: $19/month
- Pro: $39/month with white-label portal and automations
- Studio: $99/month for up to 5 team members

### Go-to-Market Strategy
- target freelancer educators and communities
- templates for common services
- first 100 users via direct outreach and migration concierge

## PRD

### Purpose and Vision
Vision statement: run a freelance business from one operating system, not five disconnected tools.

The product centralizes the client journey: proposal, contract, portal, project status, invoice, and payment.

### Target Audience
Persona 1: Olivia, freelance marketer
- Goals: present professionally and reduce admin time
- Frustrations: tools are fragmented and repetitive
- Day-in-the-life: sends proposals, tracks deliverables, invoices monthly, and answers status questions constantly

Persona 2: Harsh, founder of a 3-person web studio
- Goals: keep clients informed while managing internal tasks
- Frustrations: email threads, scattered docs, and invoice follow-up
- Day-in-the-life: manages multiple client workspaces with inconsistent process

### Feature List
- Must-have: client portal
- Must-have: contract template and sending
- Must-have: project task/status tracking
- Must-have: invoice creation and payment status
- Must-have: file sharing
- Must-have: project timeline view
- Should-have: proposal templates
- Should-have: recurring retainers
- Could-have: client messaging and meeting notes
- Won't-have for v1: payroll and HR modules

### User Stories
1. As a freelancer, I want one client portal per project.
2. As a freelancer, I want contracts generated from templates.
3. As a freelancer, I want invoices tied to project milestones.
4. As a client, I want visibility into project status.
5. As a freelancer, I want files and deliverables in one place.
6. As a studio owner, I want multi-user collaboration.
7. As a client, I want to review invoices and documents easily.
8. As a freelancer, I want repeatable onboarding workflows.

### Acceptance Criteria
- client portal is shareable and permission-scoped
- contract generation supports template variables
- invoice status updates reflect payment events
- project board updates are visible to authorized clients
- files upload and associate correctly with projects

### User Flow
1. Freelancer creates workspace
2. Adds client and project
3. Sends proposal/contract
4. Client signs and enters portal
5. Freelancer tracks tasks and milestones
6. System generates invoice
7. Client pays and project progresses

### Non-Functional Requirements
- 99.5% uptime
- secure client data isolation
- responsive portal performance under 2 seconds
- audit logs for client-visible changes

### Constraints and Dependencies
- payment, e-sign, and file storage integrations increase scope quickly
- v1 should prioritize the core portal workflow over breadth

## TRD

### System Architecture
Modular monolith with account-scoped workspaces. Frontend handles dashboard, client portal, projects, invoices, and contract views. Backend stores clients, projects, templates, invoices, and files. PostgreSQL stores structured data, object storage handles files, and workers process reminders and exports.

### Technology Stack
| Layer | Recommendation | Justification |
| --- | --- | --- |
| Frontend | Next.js | portal and dashboard UX |
| Backend | Node.js/NestJS | auth, templates, API orchestration |
| Database | PostgreSQL | relational business workflow |
| Storage | S3-compatible | file uploads |
| Queue | Redis/BullMQ | reminders and exports |

### API Design
| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/clients` | client payload | client id | Bearer |
| POST | `/api/v1/projects` | project payload | project id | Bearer |
| POST | `/api/v1/contracts` | template + variables | contract id | Bearer |
| POST | `/api/v1/invoices` | project/billing payload | invoice id | Bearer |
| GET | `/api/v1/portal/{token}` | none | portal payload | Signed token |
| PATCH | `/api/v1/projects/{id}` | task/status updates | project object | Bearer |
| POST | `/api/v1/files` | multipart upload | file ref | Bearer |

### Data Models
| Table | Fields | Relationships |
| --- | --- | --- |
| `accounts` | id, name, plan | one-to-many users |
| `clients` | id, account_id, name, email, company | belongs to account |
| `projects` | id, account_id, client_id, title, status, start_date, due_date | belongs to client |
| `tasks` | id, project_id, title, status, assignee_id | belongs to project |
| `contracts` | id, project_id, template_key, status, signed_at | belongs to project |
| `invoices` | id, project_id, amount, due_date, status | belongs to project |
| `files` | id, project_id, storage_key, visibility | belongs to project |

### Third-Party Integrations
- payment processor
- e-sign provider
- object storage
- transactional email

### Security Architecture
- account-level RBAC
- signed portal links
- encrypted storage and secret management
- audit trail for contracts and invoices

### Infrastructure and DevOps
- app plus worker services
- monitoring on portal and invoice events
- automated backups
- CI for contract templating and invoice logic

### Scalability Plan
At 10x growth, isolate file-processing workers, use caching for portal reads, and move notification workloads out of request paths. The account-centric monolith should remain enough for the early product stage.

## Production Requirements

### Required Backend Components
- `Supabase Postgres` for accounts, clients, projects, tasks, contracts, invoices, and portal records
- `Supabase Storage` for files and deliverables
- RBAC and client-visibility controls

### Recommended Free Stack
- `Vercel` + `Supabase`
- `Resend` for client notifications
- `Sentry` and `PostHog` for ops and product visibility

### Production Notes
- Row-level security is strongly recommended
- Signed file URLs are required for client-facing assets
- Portal tokens and invite flows should be carefully scoped
