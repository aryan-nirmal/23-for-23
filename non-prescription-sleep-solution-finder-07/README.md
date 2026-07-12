# RestPath — Non-Prescription Sleep Solution Finder

A Next.js 16 MVP that helps users understand their sleep patterns through a guided quiz, receive evidence-informed non-prescription recommendations, and track progress with a 2-week sleep diary.

## Features

- **Landing page** — Product overview and how-it-works flow
- **Sleep quiz** (`/quiz`) — 10-question multi-step intake covering sleep onset, schedule, anxiety, hygiene, and safety screening
- **Rules engine** (`src/lib/classifier.ts`) — Classifies into five patterns:
  - `sleep_onset_insomnia`
  - `circadian_misalignment`
  - `anxiety_driven`
  - `poor_hygiene`
  - `needs_clinical_review`
- **Results** (`/results`) — Recommendation cards with rationale, evidence notes, and red-flag safety warnings
- **Sleep diary** (`/diary`) — Log date, hours slept, quality (1–5), and notes with localStorage persistence
- **Progress** (`/progress`) — 14-day trend charts and summary stats from diary data

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- lucide-react (icons)
- clsx (class utilities)
- TypeScript

## Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── quiz/page.tsx     # Multi-step sleep quiz
│   ├── results/page.tsx  # Pattern + recommendations
│   ├── diary/page.tsx    # Sleep diary with localStorage
│   └── progress/page.tsx # Trend view
├── components/
│   ├── Nav.tsx           # Shared navigation
│   └── SafetyBanner.tsx  # Medical disclaimer
└── lib/
    ├── classifier.ts     # Rules engine
    ├── quiz-data.ts      # Quiz questions
    ├── recommendations.ts# Per-pattern recommendations
    ├── diary.ts          # localStorage helpers
    ├── types.ts          # Shared types
    └── utils.ts          # cn(), formatters
```

## Privacy

All quiz answers, results, and diary entries are stored in the browser's `localStorage`. No data is sent to a server.

## Disclaimer

This is an educational tool, not medical advice. Users with red-flag symptoms (e.g., breathing pauses, severe daytime sleepiness) are directed to seek clinical evaluation.