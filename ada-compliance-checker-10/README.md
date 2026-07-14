# ADA Compliance Checker

A dark-themed Next.js MVP for scanning websites against WCAG 2.1 accessibility guidelines. Enter any URL, get a detailed report of violations grouped by category with severity ratings, element selectors, and fix recommendations.

## Features

- **Landing page** — Overview of capabilities and WCAG check categories
- **URL scanning** — Submit any `http`/`https` URL at `/scan`
- **Mock WCAG audit** — Realistic axe-core-style violations (alt text, contrast, labels, headings, ARIA, etc.)
- **Severity classification** — Critical, serious, moderate, and minor issue levels
- **Detailed reports** — Violations grouped by category with CSS selectors and fix guidance
- **PDF export** — Download reports via jsPDF

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- lucide-react (icons)
- jsPDF (PDF export)
- clsx (class utilities)
- In-memory scan store (`src/lib/store.ts`)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

## Usage

1. Visit the landing page at `/`
2. Click **Start Free Scan** or go to `/scan`
3. Enter a website URL (e.g. `example.com` or `https://example.com`)
4. View the report at `/report/[id]` with issues grouped by category
5. Click **Export PDF** to download the report

## API

### `POST /api/scan`

Scan a URL for accessibility issues.

**Request:**

```json
{ "url": "https://example.com" }
```

**Response (201):**

```json
{
  "id": "uuid",
  "url": "https://example.com",
  "scannedAt": "2026-06-08T12:00:00.000Z",
  "violations": [...],
  "summary": {
    "critical": 2,
    "serious": 4,
    "moderate": 3,
    "minor": 2,
    "total": 11
  }
}
```

### `GET /api/scan/[id]`

Retrieve a previously stored scan by ID.

## Project Structure

```
src/
├── app/
│   ├── api/scan/          # Scan API routes
│   ├── report/[id]/       # Report page
│   ├── scan/              # Scan form page
│   ├── page.tsx           # Landing page
│   ├── layout.tsx
│   └── globals.css
├── components/            # UI components
└── lib/
    ├── store.ts           # In-memory scan storage
    ├── mock-scanner.ts    # Mock WCAG violation generator
    ├── pdf-export.ts      # PDF export utility
    ├── types.ts
    └── utils.ts
```

## Notes

- Scan results are stored in memory and will be lost on server restart.
- Violations are mock data for demonstration — not from a live axe-core crawl.