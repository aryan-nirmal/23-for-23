# PulsePrompt

Medication Reminder with WhatsApp MVP for project 3 in the `23 for 23` workspace.

This build is intentionally free-first:
- local demo auth works without Supabase
- mock WhatsApp messaging works without Twilio or WATI
- reminder, escalation, and summary flows are still fully testable

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Supabase-ready schema and client helpers
- In-memory demo store for zero-cost local testing
- Vitest for unit coverage on reminder logic

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Use the login page to enter the demo workspace. No email provider is required in local demo mode.

## Useful routes

- `/` marketing landing page
- `/login` demo login + optional Supabase magic-link trigger
- `/dashboard` caregiver operations view
- `/patients` roster
- `/patients/new` onboarding
- `/patients/[id]` patient record
- `/patients/[id]/summary` adherence view
- `/simulator` mock WhatsApp control room

## API routes

- `POST /api/patients`
- `POST /api/patients/:id/medications`
- `PUT /api/medications/:id`
- `GET /api/patients/:id/adherence`
- `POST /api/reminders/test`
- `POST /api/webhooks/whatsapp`
- `POST /api/webhooks/mock-whatsapp`
- `POST /api/internal/jobs/process-reminders`
- `POST /api/internal/jobs/process-escalations`
- `POST /api/internal/jobs/generate-weekly-summaries`

## Demo flow

1. Log in with the demo account.
2. Create a patient.
3. Add at least one medication and reminder time.
4. Open `/simulator`.
5. Run `Process reminders`.
6. Inject a `YES` or `SNOOZE` reply.
7. Run escalation or summary jobs to validate the rest of the loop.

## Supabase setup

1. Copy `.env.example` to `.env.local`.
2. Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Run the SQL in:
   - [schema.sql](/Users/aryannirmal/Desktop/23 for 23/final projects/medication-reminder-whatsapp/supabase/schema.sql)
   - [seed.sql](/Users/aryannirmal/Desktop/23 for 23/final projects/medication-reminder-whatsapp/supabase/seed.sql)

The current UI defaults to demo auth. The Supabase browser/server helpers and schema are in place for the next step of replacing the in-memory store with database-backed repositories.

## Testing

```bash
npm run test
npm run lint
```

## Future provider swap

The provider boundary lives in `src/lib/services/messaging.ts`.

To move from the mock channel to a real provider later:
- keep the route surfaces the same
- replace `MockMessagingProvider`
- map outbound reminders, escalations, and summaries to provider templates
- map inbound webhook payloads into `parseInboundReply`
