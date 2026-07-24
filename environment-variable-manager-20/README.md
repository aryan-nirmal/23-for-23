# EnvVault — Team Environment Variable Manager

A Next.js 16 MVP for managing team environment variables across projects and environments (dev, staging, production).

## Features

- **Landing page** — Product overview with CLI preview
- **Dashboard** (`/dashboard`) — List and create projects
- **Project detail** (`/projects/[id]`) — Manage env vars per environment with masked secret display
- **Audit log** (`/audit`) — Track who changed what and when
- **CLI docs** (`/cli`) — Pull command reference and available tokens
- **Pull API** (`GET /api/pull`) — Returns `.env` format text for valid tokens

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- lucide-react icons
- clsx for class merging
- In-memory store with token-based auth

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Data

The app ships with 3 seeded projects:

| Project ID | Name |
|---|---|
| `proj_web_app` | Web Application |
| `proj_api_gateway` | API Gateway |
| `proj_mobile_backend` | Mobile Backend |

## CLI Pull

```bash
npx envpull --project=proj_web_app --env=production
```

Or call the API directly:

```bash
curl "http://localhost:3000/api/pull?project=proj_web_app&env=production&token=evm_prod_web_app_7f3a9c2e1b8d4f6a"
```

### Demo Tokens

| Token | Project | Environment |
|---|---|---|
| `evm_prod_web_app_7f3a9c2e1b8d4f6a` | proj_web_app | production |
| `evm_staging_web_app_2d5e8a1c9b7f3e4d` | proj_web_app | staging |
| `evm_prod_api_gateway_9a1b2c3d4e5f6a7b` | proj_api_gateway | production |
| `evm_dev_mobile_3c4d5e6f7a8b9c0d` | proj_mobile_backend | dev |

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Create a project |
| GET | `/api/projects/[id]` | Get project with env vars and tokens |
| POST | `/api/env-vars` | Add env var |
| PUT | `/api/env-vars` | Update env var |
| DELETE | `/api/env-vars` | Delete env var |
| GET | `/api/audit` | Get audit log |
| GET | `/api/tokens` | List pull tokens |
| GET | `/api/pull?project=&env=&token=` | Pull env vars as `.env` text |

## Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/            # Projects list
│   ├── projects/[id]/        # Environment variable management
│   ├── audit/                # Audit log
│   ├── cli/                  # CLI documentation
│   └── api/                  # REST API routes
├── components/               # UI components
└── lib/
    ├── store.ts              # In-memory data store
    ├── auth.ts               # Token validation
    ├── types.ts              # TypeScript types
    └── utils.ts              # Helpers (masking, formatting)
```