# FreelanceOS

All-in-one freelance workspace built with Next.js 16. Manage projects, clients, invoices, and contracts from a single dark-themed dashboard.

## Features

- **Landing Page** — Marketing homepage with feature overview
- **Dashboard** (`/dashboard`) — Active projects, pending invoices, upcoming deadlines
- **Projects** (`/projects`) — Project list with status badges (active, completed, on_hold)
- **Project Detail** (`/projects/[id]`) — Tasks, timeline, files placeholder, client info
- **Clients** (`/clients`) — Client CRM with contact details and linked projects
- **Invoices** (`/invoices`) — Invoice list with status tracking and create invoice form
- **Contracts** (`/contracts`) — Contract template library with preview modal
- **Client Portal** (`/portal/[clientId]`) — Read-only project status view for clients

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- lucide-react (icons)
- clsx (class utilities)
- date-fns (date formatting)
- In-memory data store (`src/lib/store.ts`)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page, or go directly to [http://localhost:3000/dashboard](http://localhost:3000/dashboard).

## Sample Data

The app ships with seed data for 4 clients, 5 projects, 5 invoices, and 3 contract templates. Try these portal links:

- [Northwind Digital portal](/portal/client-1)
- [Lumina Studio portal](/portal/client-2)

## Project Structure

```
src/
├── app/
│   ├── (app)/          # Dashboard layout with sidebar
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── clients/
│   │   ├── invoices/
│   │   └── contracts/
│   ├── portal/         # Client-facing portal (no sidebar)
│   ├── actions.ts      # Server actions for invoice creation
│   └── page.tsx        # Landing page
├── components/         # Shared UI components
└── lib/
    ├── store.ts        # In-memory data store + seed data
    └── utils.ts        # Formatting helpers
```

## Build

```bash
npm run build
npm start
```