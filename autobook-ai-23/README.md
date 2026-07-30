# Autobook AI

AI-powered booking email agent that detects meeting requests in your inbox, proposes available time slots, and confirms bookings — all in one place.

## Features

- **Landing page** — product overview and quick navigation
- **Inbox** (`/inbox`) — list of mock emails with AI-detected booking intent
- **Email detail** (`/inbox/[id]`) — full email, intent analysis, slot selection, proposal generation, and booking confirmation
- **Calendar** (`/calendar`) — weekly Mon–Fri 9–5 availability grid with blocked and booked slots
- **Settings** (`/settings`) — mock Gmail connection status and working hours configuration
- **API routes**
  - `POST /api/propose` — generates a slot proposal email draft
  - `POST /api/confirm` — confirms a booking and adds it to the calendar store

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- lucide-react, clsx, date-fns
- Stateful in-memory database simulating transactional record persistence (resets on local server restart)

## Getting Started

### Prerequisites
- Node.js v18.0.0 or higher
- npm v9.0.0 or higher

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage Flow

1. Visit **Inbox** to see emails flagged with booking intent
2. Click an email to review AI-detected details and available slots
3. Select slots (optional) and click **Generate Proposal** to draft a reply
4. Click **Confirm** on a slot to book the meeting
5. View the confirmed event on the **Calendar** page

## API Examples

All endpoints operate on JSON request payloads and return unified JSON status structures.

### Propose slots

**Request Payload:**
```json
{
  "emailId": "string"
}
```

```bash
curl -X POST http://localhost:3000/api/propose \
  -H "Content-Type: application/json" \
  -d '{"emailId": "email-1"}'
```

### Confirm booking

**Request Payload:**
```json
{
  "emailId": "string",
  "slotStart": "ISO-8601 string"
}
```

```bash
curl -X POST http://localhost:3000/api/confirm \
  -H "Content-Type: application/json" \
  -d '{"emailId": "email-1", "slotStart": "2026-06-09T14:00:00.000Z"}'
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── inbox/                # Inbox list & detail
│   ├── calendar/             # Weekly availability view
│   ├── settings/             # Gmail & working hours
│   └── api/
│       ├── propose/          # Generate proposal text
│       ├── confirm/          # Confirm booking
│       └── settings/         # Update settings
├── components/               # UI components
└── lib/
    ├── store.ts              # In-memory data store
    ├── types.ts              # TypeScript types
    └── utils.ts              # Helpers
```

## Build

```bash
npm run build
npm start
```