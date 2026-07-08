# Micro-SME Invoice Manager

## MRD

### Executive Summary
Micro-SME Invoice Manager targets India's underserved micro-business segment that still runs invoicing and receivables through paper, WhatsApp, or spreadsheets. Existing accounting products are either too complex, too expensive, or built for trained operators. The product aims to be a simple invoicing and collections layer with GST-friendly formatting and WhatsApp reminder support.

### Target Market
Primary persona: kirana or local service business owner
- annual revenue roughly INR 5 lakh to INR 50 lakh
- handles billing personally
- uses WhatsApp daily and rarely uses formal accounting software

Primary persona: small contractor or freelancer-like local business
- issues recurring invoices and struggles with collections
- needs cash-flow visibility

Secondary persona: accountant or CA assistant supporting multiple micro-clients

### Market Size
- TAM estimate: tens of millions of Indian micro-businesses that do not use modern invoicing software.
- SAM estimate: 5 million WhatsApp-first businesses likely to adopt simple digital invoicing.
- SOM estimate: 30,000 paying businesses in 3 years.
These are pragmatic product estimates grounded in the very large Indian micro-business base rather than a narrow invoicing-software category.

### Problem Statement
Micro-businesses are digitally reachable but operationally under-tooled. They need invoices, tax breakdowns, overdue tracking, and reminders, but not full accounting suites. The gap is a minimal product with invoice generation, status tracking, and WhatsApp sharing that can be learned in one sitting.

### Competitive Landscape
| Competitor | Pricing | Strengths | Weaknesses |
| --- | --- | --- | --- |
| Vyapar | SMB accounting focus in India | Localized invoicing and business workflows | Broader than necessary for the smallest operators |
| Zoho Invoice / Zoho Books | Established SMB finance tooling | Strong invoicing and ecosystem support | More setup and accounting complexity |
| Tally | Trusted in India | Familiar to accountants | Too complex for many micro-owners |

### Differentiation Strategy
- mobile-first and WhatsApp-first
- minimal feature set for owners, not accountants
- GST-friendly invoice generation without full bookkeeping complexity
- collections visibility as a core value proposition

### Business Model
- Free: 5 invoices/month
- Basic: INR 199/month for unlimited invoices and reminders
- Growth: INR 499/month for multi-user and accountant access

Estimated revenue
- Month 6: 250 paying accounts
- Month 12: 1,500 paying accounts

### Go-to-Market Strategy
- offline onboarding via CAs, business groups, and local associations
- WhatsApp demo videos in Hindi and English
- first 100 users via concierge onboarding in one city cluster

## PRD

### Purpose and Vision
Vision statement: make invoicing and payment follow-up simple enough for India's smallest businesses.

The product gives owners a clear loop: create invoice, send invoice, track payment, remind customer. It intentionally avoids full accounting depth in v1.

### Target Audience
Persona 1: Ramesh, electrical contractor
- Goals: create GST invoice quickly and track unpaid jobs
- Frustrations: paper invoices, forgotten dues, manual follow-up
- Day-in-the-life: finishes work, sends invoice on WhatsApp, later forgets which clients still owe money

Persona 2: Shalini, CA assistant managing small clients
- Goals: standardize invoices for micro-clients
- Frustrations: clients send inconsistent billing details over chat
- Day-in-the-life: supports business owners who need simple receivables visibility

### Feature List
- Must-have: invoice creation
- Must-have: GST fields and tax breakdown
- Must-have: PDF invoice export
- Must-have: WhatsApp share link
- Must-have: payment status tracking
- Must-have: overdue reminders
- Must-have: dashboard with receivables and overdue amount
- Should-have: recurring invoice templates
- Could-have: UPI payment links
- Won't-have for v1: full ledger accounting

### User Stories
1. As an owner, I want to create an invoice in under 3 minutes.
2. As an owner, I want GST formatted correctly so that customers accept the invoice.
3. As an owner, I want to share the PDF over WhatsApp in one tap.
4. As an owner, I want unpaid invoices flagged automatically.
5. As an owner, I want reminders sent after a due date.
6. As an accountant assistant, I want client invoice templates so that repeat work is faster.
7. As a business owner, I want a dashboard of dues so that cash flow is visible.
8. As an admin, I want invoice numbers unique and sequential.

### Acceptance Criteria
- invoice saves only with required buyer and line-item data
- GST rate and tax values calculate correctly
- PDF export includes invoice number, seller info, buyer info, line items, tax totals
- status supports unpaid, partial, paid, overdue
- reminder schedule updates based on due date

### User Flow
1. User creates business profile
2. Adds client
3. Builds invoice with items and GST
4. Generates PDF
5. Shares via WhatsApp
6. Tracks status and due date
7. System sends reminder if unpaid

### Non-Functional Requirements
- invoice generation under 3 seconds
- PDF render under 5 seconds
- 99.5% uptime
- secure storage for invoice records

### Constraints and Dependencies
- GST formatting must be reviewed carefully
- automation depends on WhatsApp API or deep-link fallback
- MVP team should stay small and focus on reliability over accounting breadth

## TRD

### System Architecture
Modular monolith. Mobile-responsive web app handles businesses, clients, invoices, and reminders. Backend stores invoice records, tax calculations, status changes, and reminder schedules. PostgreSQL stores structured invoice data. PDF generation service renders invoices. Reminder worker handles WhatsApp or SMS notification jobs.

### Technology Stack
| Layer | Recommendation | Justification |
| --- | --- | --- |
| Frontend | Next.js | mobile-friendly form flow |
| Backend | Node.js/NestJS | form validation and PDF workflows |
| Database | PostgreSQL | invoice and customer records |
| PDF | server-side HTML to PDF renderer | invoice formatting |
| Queue | Redis/BullMQ | reminders and exports |
| Hosting | Railway/Render | fast MVP deployment |

### API Design
| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/businesses` | business profile | business id | Bearer |
| POST | `/api/v1/clients` | client payload | client id | Bearer |
| POST | `/api/v1/invoices` | invoice payload | invoice id | Bearer |
| GET | `/api/v1/invoices/{id}` | none | invoice object | Bearer |
| POST | `/api/v1/invoices/{id}/export` | none | pdf url | Bearer |
| PATCH | `/api/v1/invoices/{id}/status` | status | updated invoice | Bearer |
| GET | `/api/v1/dashboard/summary` | none | receivables totals | Bearer |

### Data Models
| Table | Fields | Relationships |
| --- | --- | --- |
| `businesses` | id, owner_id, name, gstin, address | one-to-many invoices |
| `clients` | id, business_id, name, phone, gstin, address | belongs to business |
| `invoices` | id, business_id, client_id, invoice_number, issue_date, due_date, subtotal, tax_total, total, status | belongs to business and client |
| `invoice_items` | id, invoice_id, description, qty, unit_price, gst_rate, line_total | belongs to invoice |
| `payment_events` | id, invoice_id, amount, paid_at, method | belongs to invoice |
| `reminder_jobs` | id, invoice_id, scheduled_at, channel, status | belongs to invoice |

### Third-Party Integrations
- WhatsApp share/deep-link or API provider
- optional Razorpay/UPI links in later version
- PDF renderer

### Security Architecture
- OTP or passwordless login
- encrypted invoice storage
- audit history for status changes
- secret management via hosting provider

### Infrastructure and DevOps
- managed Postgres
- CI with invoice-calculation tests
- monitoring on export and reminder jobs
- backups and invoice number integrity checks

### Scalability Plan
At 10x growth, isolate PDF workers and reminder workers, cache business settings, and add read replicas for dashboard queries. Accounting integrations should remain out of scope until invoice workflow is stable.

## Production Requirements

### Required Backend Components
- `Supabase Postgres` for businesses, clients, invoices, items, payments, and reminders
- `Supabase Storage` for generated invoice PDFs
- Tax-calculation layer with test coverage

### Recommended Free Stack
- `Vercel` frontend with `Supabase` backend
- `Supabase Auth` for business accounts
- `Sentry` for invoice-generation and reminder failures

### Production Notes
- Sequential invoice numbering is mandatory
- GST logic should be validated with fixtures
- Deep-link WhatsApp share can be the default before full API automation
