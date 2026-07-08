# ADA Compliance Checker

## MRD

### Executive Summary
ADA Compliance Checker is a website-audit product that turns WCAG-focused accessibility scanning into prioritized fix recommendations. The target user is not an accessibility specialist; it is a founder, agency, or small product team that needs actionable findings quickly. The market opportunity exists because accessibility compliance is material for legal risk, procurement, and user experience, but manual audits are expensive and automated scanners often produce raw issue lists rather than build-ready remediation guidance.

### Target Market
Primary persona: agency or freelance web developer
- manages multiple client websites
- needs pre-launch accessibility checks

Primary persona: SMB website owner or marketer
- worries about accessibility risk
- wants a report that developers can act on

Secondary persona: product manager at a small SaaS team

### Market Size
- TAM estimate: millions of business websites in regulated or public-facing contexts.
- SAM estimate: 300,000 SMBs and agencies likely to pay for self-serve accessibility audits.
- SOM estimate: 4,000 paying customers in 3 years.

### Problem Statement
Accessibility compliance is important but confusing. Automated scanners exist, yet many teams cannot translate issues into implementation tasks or prioritize fixes by severity and page impact. The gap is a URL-to-report workflow that pairs automated scanning with clear remediation guidance.

### Competitive Landscape
| Competitor | Pricing | Strengths | Weaknesses |
| --- | --- | --- | --- |
| accessiBe | accessibility product suite | Strong commercial presence | Broader positioning and controversial widget-centric perception |
| WAVE | respected accessibility testing tool | Useful scan output | More diagnostic than workflow/productized remediation |
| Siteimprove | enterprise digital experience tooling | Mature governance and reporting | Enterprise-oriented pricing and complexity |

### Differentiation Strategy
- simple paste-a-URL workflow
- report language optimized for developers and SMB buyers
- severity plus fix recommendation and code examples
- lower-cost self-serve positioning

### Business Model
- Free scan of one page with limited report
- Pro: $29/month for 50 scans and PDF export
- Agency: $99/month for white-labeled client reports

### Go-to-Market Strategy
- SEO around WCAG, ADA audit, and accessibility checker terms
- agency partnerships and website-audit bundles
- first 100 users from freelancers and small agencies

## PRD

### Purpose and Vision
Vision statement: make accessibility findings specific enough that small teams can actually fix them.

The product turns a URL into an understandable accessibility backlog, not just a technical score.

### Target Audience
Persona 1: Lauren, freelance web developer
- Goals: deliver more compliant sites and avoid surprise client issues
- Frustrations: manual accessibility review is time-intensive
- Day-in-the-life: audits pages before handoff and wants exportable reports

Persona 2: Imran, SMB marketing lead
- Goals: understand whether company site has obvious accessibility problems
- Frustrations: legal risk feels real but technical advice is opaque
- Day-in-the-life: owns website performance but depends on outside developers

### Feature List
- Must-have: URL scanner
- Must-have: WCAG issue detection
- Must-have: severity scoring
- Must-have: fix recommendations
- Must-have: PDF report export
- Must-have: page-level issue grouping
- Should-have: issue screenshots and DOM references
- Could-have: recurring scans and team collaboration
- Won't-have for v1: guaranteed legal certification

### User Stories
1. As a user, I want to scan a page with one URL.
2. As a developer, I want issue details tied to elements so that I can fix them.
3. As a marketer, I want severity labels so that I can prioritize.
4. As an agency, I want PDF export for clients.
5. As a team lead, I want repeated scans to confirm fixes.
6. As a platform owner, I want scanner errors handled gracefully.
7. As a user, I want recommendations written in plain language.
8. As a user, I want issue totals by category.

### Acceptance Criteria
- scanner validates and fetches public URL
- report contains categorized issues and severity labels
- each issue includes recommendation text
- export generates successfully for completed scans
- rescans create a new report version

### User Flow
1. User pastes URL
2. Scan job runs
3. Results populate categories
4. User views issues and recommendations
5. User exports report or shares with developer
6. User rescans after fixes

### Non-Functional Requirements
- scan kickoff under 5 seconds
- completion under 60 seconds for typical pages
- 99.5% uptime
- secure storage of reports and customer domains

### Constraints and Dependencies
- automated testing cannot replace manual accessibility review
- dynamic or authenticated pages may require later support
- legal positioning must avoid overpromising compliance certification

## TRD

### System Architecture
Web frontend with browser-based scanning worker. Backend stores scans, findings, exports, and users. Scan worker visits public URL, runs accessibility rules, captures metadata, and persists findings. Monolith plus workers is sufficient for MVP.

### Technology Stack
| Layer | Recommendation | Justification |
| --- | --- | --- |
| Frontend | Next.js | dashboard and result views |
| Backend | Node.js | easy integration with Playwright and axe-core |
| Scanner | Playwright + axe-core | standard accessibility audit approach |
| Database | PostgreSQL | scan reports and billing |
| Queue | Redis/BullMQ | async scan jobs |

### API Design
| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/scans` | url | scan id | Session/Bearer |
| GET | `/api/v1/scans/{id}` | none | scan result | Session/Bearer |
| GET | `/api/v1/scans/{id}/issues` | filters | issue list | Session/Bearer |
| POST | `/api/v1/scans/{id}/export/pdf` | none | download url | Session/Bearer |
| POST | `/api/v1/scans/{id}/rescan` | none | new scan id | Session/Bearer |
| GET | `/api/v1/account/usage` | none | usage counters | Bearer |

### Data Models
| Table | Fields | Relationships |
| --- | --- | --- |
| `scans` | id, account_id, url, status, started_at, completed_at | one-to-many findings |
| `findings` | id, scan_id, rule_id, severity, selector, summary, recommendation | belongs to scan |
| `exports` | id, scan_id, file_type, storage_key | belongs to scan |
| `accounts` | id, name, plan | one-to-many scans |

### Third-Party Integrations
- headless browser infrastructure
- PDF renderer
- optional email notifications

### Security Architecture
- account-scoped scan data
- encrypted storage for reports
- secure scan sandboxing to reduce browser abuse risk

### Infrastructure and DevOps
- worker isolation for scans
- error monitoring and queue alerts
- dev/staging/prod split

### Scalability Plan
At 10x growth, browser workers become the main scaling surface. Add pooled worker nodes, report caching, and quota-based concurrency control.

## Production Requirements

### Required Backend Components
- `Supabase Postgres` for scans, findings, exports, and account usage
- `Supabase Storage` for PDF reports and scan artifacts
- Headless-browser scan worker environment

### Recommended Free Stack
- `Vercel` frontend
- `Supabase` for state and auth
- `Sentry` for scan-job failures

### Production Notes
- Scan isolation and timeouts are mandatory
- Authenticated-page scanning can wait, but public scan versioning should not
- Findings should stay normalized for filtering and exports
