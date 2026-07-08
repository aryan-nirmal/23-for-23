# Turf Booking App

## MRD

### Executive Summary
Turf Booking App is a localized booking marketplace and operations tool for sports-turf owners in India. Turf businesses in many Tier-2 cities still manage slots through calls and WhatsApp, creating double-bookings, poor occupancy visibility, and inconsistent payment collection. The product solves both sides of the market: operators manage availability, and players book digitally with immediate confirmation.

### Target Market
Primary persona: turf owner or manager
- runs one or a few turfs
- handles bookings manually
- wants fewer disputes and more prepayments

Primary persona: player or team organizer
- wants to see available slots and book instantly

Secondary persona: small sports-facility chain expanding into multiple venues

### Market Size
- TAM estimate: thousands of active commercial turfs across Indian cities, with especially strong digitization need in Tier-2 markets.
- SAM estimate: 5,000-10,000 turf facilities and their booking demand in initial target geographies.
- SOM estimate: 200 venues and 30,000 annual bookings in 3 years in focused city expansion.

### Problem Statement
Supply and demand already exist, but the transaction layer is weak. Players cannot see live availability, owners overbook, and payments are unreliable. The gap is a simple real-time booking and payment stack for small operators.

### Competitive Landscape
| Competitor | Pricing | Strengths | Weaknesses |
| --- | --- | --- | --- |
| generic listing marketplaces | broad discovery | user familiarity | weak venue operations tooling |
| in-house WhatsApp booking | no software cost | familiar for operators | error-prone and not scalable |
| sports-facility management suites | richer features | stronger scheduling depth | too heavy or expensive for many single-venue owners |

### Differentiation Strategy
- built for small Indian turf operators
- combines owner dashboard and player flow
- digital payment + WhatsApp confirmation
- designed for one-city supply cold start

### Business Model
- venue SaaS fee: INR 999/month
- plus 2% booking commission
- optional premium placement for discovery

### Go-to-Market Strategy
- start in one city cluster
- manually onboard 5-10 venues
- use players to generate network effects through repeat bookings and referral codes

## PRD

### Purpose and Vision
Vision statement: let players book a turf slot as easily as movie tickets while helping owners stop managing calendars in chats.

The product creates a dependable digital booking loop with payments, confirmations, and cancellation rules.

### Target Audience
Persona 1: Vishal, turf owner in Pune
- Goals: stop double-bookings and get paid upfront
- Frustrations: too many WhatsApp requests, missed confirmations
- Day-in-the-life: manually tracks slots in a notebook or chat threads

Persona 2: Nikhil, amateur football organizer
- Goals: find and confirm an evening slot quickly
- Frustrations: must call multiple venues and check availability manually
- Day-in-the-life: coordinates a group and wants reliable instant booking

### Feature List
- Must-have: venue availability calendar
- Must-have: slot booking flow
- Must-have: Razorpay payment
- Must-have: owner dashboard for pricing and blocked slots
- Must-have: booking confirmations via WhatsApp/email
- Must-have: booking history
- Must-have: cancellation policy rules
- Should-have: multi-sport pricing
- Could-have: location-based discovery and reviews
- Won't-have for v1: league management

### User Stories
1. As an owner, I want to create slots and prices.
2. As a player, I want to view upcoming availability.
3. As a player, I want to pay online and confirm instantly.
4. As an owner, I want blocked slots to prevent overbooking.
5. As a player, I want booking confirmation on WhatsApp.
6. As an owner, I want cancellation policy enforced automatically.
7. As a player, I want my booking history.
8. As an admin, I want venue-level analytics later.

### Acceptance Criteria
- availability calendar shows only bookable slots
- payment success creates booking atomically
- owner can block slots and changes reflect immediately
- cancellation rule computes refund amount correctly
- confirmation is sent after successful booking

### User Flow
1. Player opens venue page
2. Chooses date and slot
3. Pays using Razorpay
4. Booking is confirmed
5. Notifications go to player and owner
6. Player can view or cancel booking under policy

### Non-Functional Requirements
- booking transaction consistency under concurrency
- payment-to-confirmation latency under 10 seconds
- 99.5% uptime
- mobile-first UX

### Constraints and Dependencies
- cold-start supply problem
- payment-provider onboarding for venues
- WhatsApp notifications may require approved templates

## TRD

### System Architecture
Monolith with realtime slot availability updates. Frontend handles venue discovery, slot selection, owner dashboard, and booking history. Backend manages venues, slots, bookings, payments, and notifications. PostgreSQL stores all structured data. Redis can be used for slot locks during checkout.

### Technology Stack
| Layer | Recommendation | Justification |
| --- | --- | --- |
| Frontend | Next.js | consumer and owner UX |
| Backend | Node.js/NestJS | payment and booking orchestration |
| Database | PostgreSQL | transactional slot and booking records |
| Queue | Redis/BullMQ | confirmations and reminders |
| Payments | Razorpay | India-friendly payment processing |

### API Design
| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/venues` | venue payload | venue id | Bearer |
| POST | `/api/v1/venues/{id}/slots` | slot config | slot ids | Bearer |
| GET | `/api/v1/venues/{id}/availability` | date | slots | Public |
| POST | `/api/v1/bookings` | slot id, player info | payment order | Session/Public |
| POST | `/api/v1/webhooks/razorpay` | webhook payload | ack | Provider sig |
| GET | `/api/v1/bookings/{id}` | none | booking detail | Bearer/Session |
| POST | `/api/v1/bookings/{id}/cancel` | none | refund result | Bearer/Session |

### Data Models
| Table | Fields | Relationships |
| --- | --- | --- |
| `venues` | id, owner_id, name, city, sport_type, status | one-to-many slots |
| `slots` | id, venue_id, start_at, end_at, price, status | belongs to venue |
| `bookings` | id, slot_id, player_name, phone, status, total_amount | belongs to slot |
| `payments` | id, booking_id, provider_ref, amount, status | belongs to booking |
| `notifications` | id, booking_id, channel, template_key, status | belongs to booking |

### Third-Party Integrations
- Razorpay
- WhatsApp provider or SMS/email fallback
- maps service in later discovery phase

### Security Architecture
- owner and venue RBAC
- signed payment webhooks
- slot-locking to prevent race conditions
- encrypted contact data at rest

### Infrastructure and DevOps
- web app plus background workers
- payment and booking dashboards
- monitoring on failed confirmations and slot contention

### Scalability Plan
At 10x growth, add read caching for venue availability, regionalize venue queries, and move booking notifications off the request path. Slot-locking becomes the key transactional component to harden early.

## Production Requirements

### Required Backend Components
- `Supabase Postgres` for venues, slots, bookings, payments, and notifications
- Slot-locking layer to prevent race conditions
- Payment webhook processing

### Recommended Free Stack
- `Vercel` + `Supabase`
- `Supabase Realtime` for live booking state
- `Supabase Edge Functions` for payment webhooks

### Production Notes
- Database-backed locking is mandatory
- Booking state transitions should be explicit and tested
- Venue- and city-level admin tools help early supply operations
