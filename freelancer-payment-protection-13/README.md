# EscrowPay — Freelancer Payment Protection

A milestone-based escrow workflow MVP built with Next.js 16. Protect freelancers by holding client payments in escrow until work is approved and released.

## Features

- **Landing page** — Overview of the escrow workflow and value proposition
- **Projects** (`/projects`) — List all projects with milestone progress
- **Create project** (`/projects/new`) — Client name, milestones (title, amount, due date)
- **Project detail** (`/projects/[id]`) — Milestone status pipeline with actions:
  - `draft` → **Fund** (mock Razorpay) → `funded`
  - `funded` → **Start Work** → `in_progress`
  - `in_progress` → **Submit Work** → `submitted`
  - `submitted` → **Approve** → `approved`
  - `approved` → **Release Payment** (mock Razorpay) → `released`
- **Ledger** (`/ledger`) — Full transaction history for fund and release payments

## Tech Stack

- **Next.js 16** (App Router, Server Actions)
- **React 19**
- **Tailwind CSS 4**
- **Zod** — Form validation
- **clsx** — Conditional class names
- **lucide-react** — Icons
- **In-memory store** (`src/lib/store.ts`) — Persists during dev server runtime

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── actions.ts          # Server actions (CRUD + milestone workflow)
│   ├── page.tsx            # Landing page
│   ├── projects/
│   │   ├── page.tsx        # Project list
│   │   ├── new/page.tsx    # Create project form
│   │   └── [id]/page.tsx   # Project detail + milestone actions
│   └── ledger/page.tsx     # Transaction history
├── components/
│   ├── Nav.tsx
│   ├── ProjectCard.tsx
│   ├── MilestonePipeline.tsx
│   ├── MilestoneActions.tsx
│   ├── CreateProjectForm.tsx
│   └── Badge.tsx
└── lib/
    ├── store.ts            # In-memory data store
    ├── types.ts
    ├── validations.ts      # Zod schemas
    └── utils.ts
```

## Milestone Workflow

Each milestone moves through a six-stage pipeline:

| Status        | Action Available     | Description                          |
|---------------|----------------------|--------------------------------------|
| Draft         | Fund Milestone       | Client pays into escrow (Razorpay)   |
| Funded        | Start Work           | Freelancer begins milestone work     |
| In Progress   | Submit Work          | Freelancer delivers completed work   |
| Submitted     | Approve Work         | Client reviews and approves          |
| Approved      | Release Payment      | Funds released to freelancer         |
| Released      | —                    | Milestone complete                   |

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Notes

- Data is stored in-memory and resets when the server restarts
- Razorpay payments are mocked — fund/release actions generate fake payment IDs
- A demo project (Acme Corp) is seeded on first load