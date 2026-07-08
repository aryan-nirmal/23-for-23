# Environment Variable Manager for Teams

## MRD

### Executive Summary
Environment Variable Manager for Teams is a developer tool for securely storing, sharing, and auditing secrets across projects and environments. It addresses a persistent workflow problem in small teams: secrets are passed via Slack, shared docs, or local `.env` files, creating leak risk and poor onboarding. The product aims at teams too small for enterprise secret-management complexity but mature enough to need role-based access and audit trails.

### Target Market
Primary persona: startup engineering team lead
- 2-20 developers
- manages multiple repos and environments
- wants simple secret access control

Primary persona: agency or consultancy engineering manager
- supports multiple client environments
- wants project and teammate isolation

Secondary persona: student or indie team that has outgrown shared `.env` files

### Market Size
- TAM estimate: millions of small software teams globally.
- SAM estimate: 300,000 teams already using CI/CD and hosted software tools.
- SOM estimate: 5,000 paid teams in 3 years.

### Problem Statement
Secrets management is a security-critical workflow, but existing products can feel too complex or too expensive for small teams. Teams need one secure system for per-project, per-environment secrets with auditability and easy local retrieval.

### Competitive Landscape
| Competitor | Pricing | Strengths | Weaknesses |
| --- | --- | --- | --- |
| Doppler | mature secrets workflow | strong DX and integrations | cost can rise with seats and advanced needs |
| HashiCorp Vault | highly capable | enterprise-grade controls | operationally heavy for small teams |
| 1Password Secrets Automation | trusted vendor | good secret-sharing posture | less opinionated around dev env pull workflow |

### Differentiation Strategy
- optimized for small teams, not enterprise platform teams
- simple web UI plus CLI
- audit logs and leak-detection integration from day one
- lower, flatter pricing for small groups

### Business Model
- Free: 1 project, 2 users
- Team: $8/month per project or $15/month for up to 5 users and 3 projects
- Growth: $49/month with unlimited projects, RBAC, and GitHub alerts

### Go-to-Market Strategy
- dev communities, GitHub, and startup engineering groups
- direct comparison content against shared `.env` anti-patterns and complex vault setups
- first 100 users via founder-engineer networks and agency teams

## PRD

### Purpose and Vision
Vision statement: make secure secret sharing easy enough that small teams stop using Slack and plaintext docs.

The product combines secret storage, environment separation, access control, and a CLI pull path suitable for everyday development.

### Target Audience
Persona 1: Asha, engineering manager at a 6-person startup
- Goals: speed up onboarding and reduce secret sprawl
- Frustrations: secrets shared in chats and stale `.env` files
- Day-in-the-life: fields requests for credentials across projects and environments

Persona 2: Matt, agency lead developer
- Goals: isolate client secrets and track access by teammate
- Frustrations: people copy secrets across projects by mistake
- Day-in-the-life: supports many projects with shifting team access

### Feature List
- Must-have: encrypted secret storage
- Must-have: project and environment separation
- Must-have: team invites and roles
- Must-have: CLI pull to local `.env`
- Must-have: audit logs
- Must-have: GitHub leak detection webhook workflow
- Should-have: secret versioning and rollback
- Could-have: temporary access links and rotation reminders
- Won't-have for v1: enterprise SSO and SCIM

### User Stories
1. As an admin, I want to create projects and environments.
2. As an admin, I want to add secrets securely.
3. As a developer, I want to pull secrets locally through a CLI.
4. As an admin, I want to grant read-only or edit access.
5. As an admin, I want audit logs for reads and writes.
6. As a team, I want separate dev, staging, and prod secrets.
7. As a security-conscious user, I want leak alerts from GitHub events.
8. As an admin, I want secret changes versioned.

### Acceptance Criteria
- secrets are encrypted before persistence
- CLI pull produces correct `.env` content for permitted environment only
- unauthorized users cannot read secret values
- audit log records read, write, delete, and export events
- GitHub leak event creates alert record and notification

### User Flow
1. Admin creates project and environments
2. Adds team members and roles
3. Adds secrets
4. Developer installs CLI and authenticates
5. Developer pulls environment secrets locally
6. Access and changes appear in audit log

### Non-Functional Requirements
- 99.9% uptime for read operations
- secret read latency under 500 ms for dashboard and CLI metadata
- cryptographic hygiene and strong key-management practices
- WCAG-friendly dashboard for admin use

### Constraints and Dependencies
- trust barrier is high; security posture must be credible
- leak scanning depends on GitHub integration and detection rules
- key-management design is core to product risk

## TRD

### System Architecture
Modular monolith with API, web UI, CLI auth endpoints, and crypto service layer. Secret values are encrypted client-side or server-side with envelope encryption before being stored in PostgreSQL or a secrets table. Metadata remains queryable without exposing values. Audit events are append-only. CLI authenticates via device code or token and fetches only authorized environment secrets.

### Technology Stack
| Layer | Recommendation | Justification |
| --- | --- | --- |
| Frontend | Next.js | admin dashboard |
| Backend | Go or Node.js | strong API and CLI support |
| Database | PostgreSQL | project/team metadata and encrypted blobs |
| CLI | Go | portable single-binary developer experience |
| Hosting | Fly.io/Render + managed Postgres | manageable ops footprint |

### API Design
| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/projects` | name | project id | Bearer |
| POST | `/api/v1/projects/{id}/secrets` | key, value, environment | secret id | Bearer |
| GET | `/api/v1/projects/{id}/secrets` | environment | secret metadata list | Bearer |
| POST | `/api/v1/cli/pull` | project, environment | encrypted secret bundle | CLI token |
| GET | `/api/v1/audit` | filters | event list | Bearer |
| POST | `/api/v1/integrations/github/webhook` | event payload | ack | Signature |
| POST | `/api/v1/projects/{id}/members` | email, role | member id | Bearer |

### Data Models
| Table | Fields | Relationships |
| --- | --- | --- |
| `accounts` | id, name, plan | one-to-many projects |
| `projects` | id, account_id, name | one-to-many environments |
| `environments` | id, project_id, name | one-to-many secrets |
| `secrets` | id, environment_id, key_name, ciphertext, nonce, key_version | belongs to environment |
| `memberships` | id, account_id, user_id, role | account RBAC |
| `audit_events` | id, actor_id, action, resource_type, resource_id, metadata, created_at | append-only log |

### Third-Party Integrations
- GitHub webhook events for leak detection
- email/Slack notifications
- optional KMS provider for envelope keys

### Security Architecture
- RBAC and least-privilege access
- envelope encryption with key rotation
- TLS in transit, encryption at rest
- immutable audit log
- secret masking in UI and logs

### Infrastructure and DevOps
- isolated environments and secrets per deployment stage
- CI includes security tests and secret-handling regression tests
- monitoring on unauthorized attempts and webhook failures

### Scalability Plan
At 10x growth, move crypto operations into dedicated workers or a KMS-backed service, add read replicas for metadata queries, and separate audit-log storage. Secret access paths should remain minimal and strongly tested.

## Production Requirements

### Required Backend Components
- `Supabase Postgres` for projects, environments, memberships, audit logs, and encrypted secret metadata
- `Supabase Auth` for user and team access
- Secure CLI auth and pull endpoint

### Recommended Free Stack
- `Supabase` as primary backend
- `Vercel` for admin UI
- `Sentry` for security-sensitive failure visibility

### Production Notes
- This project requires a database from day one
- Encryption design and audit logging are mandatory
- CLI distribution and token lifecycle management are core product requirements
