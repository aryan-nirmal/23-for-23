# VerifySME — Indian Supplier Verification

A Next.js 16 MVP for Indian SMEs to verify supplier GSTINs, assess trustworthiness, and share peer reviews.

## Features

- **Landing Page** — Overview of the platform with feature highlights
- **GSTIN Verification** (`/verify`) — Validate 15-character GSTIN format and look up supplier details
- **Supplier Profile** (`/supplier/[gstin]`) — Trust score, registration info, and peer reviews
- **Watchlist** (`/watchlist`) — Save suppliers locally in browser storage
- **Peer Reviews** (`/review`) — Submit ratings (1–5) with category and notes
- **API** (`POST /api/verify`) — Mock GSTIN lookup with deterministic data based on GSTIN hash

## Trust Score Components

| Component | Source |
|-----------|--------|
| Registration Verified | GST status (Active = verified) |
| Peer Rating | Average of localStorage reviews |
| Delivery Score | Deterministic mock from GSTIN hash |
| Payment Reliability | Deterministic mock from GSTIN hash |

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- lucide-react (icons)
- clsx (class utilities)
- TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Sample GSTINs

Try these valid-format GSTINs:

- `27AABCU9603R1ZM` (Maharashtra)
- `09AAACH7409R1ZZ` (Uttar Pradesh)
- `24AABCA1234A1Z5` (Gujarat)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── verify/page.tsx       # GSTIN lookup form
│   ├── supplier/[gstin]/     # Supplier profile
│   ├── watchlist/page.tsx    # Saved suppliers
│   ├── review/page.tsx       # Submit peer review
│   └── api/verify/route.ts   # Mock verification API
├── components/
│   ├── Navbar.tsx
│   ├── TrustScoreCard.tsx
│   └── PeerReviewsList.tsx
└── lib/
    ├── gstin.ts              # GSTIN validation
    ├── mock-data.ts          # Deterministic mock generator
    ├── storage.ts            # localStorage helpers
    ├── trust-score.ts        # Score calculation
    └── types.ts
```

## Build

```bash
npm run build
npm start
```

## Notes

- All GSTIN data is **mocked** for demo purposes — not connected to the real GST portal
- Reviews and watchlist are stored in **browser localStorage**
- GSTIN format: `SS + PAN(10) + Entity(1) + Z + Checksum(1)` = 15 characters