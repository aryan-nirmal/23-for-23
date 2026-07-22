# TurfBook – Turf Booking Platform

A cross-platform **iOS & Android** turf booking application built with Flutter & Supabase.

> 🏟️ Book a turf slot as easily as movie tickets.

---

## Tech Stack

| Layer | Tech | Notes |
|---|---|---|
| Frontend | Flutter 3.41.8 | Single codebase → iOS + Android |
| Backend | Supabase (Free Tier) | Auth + PostgreSQL + Realtime |
| Payments | Razorpay (Test Mode) | Mock MVP integration |
| State | Flutter Riverpod | Reactive state management |
| Navigation | GoRouter | Declarative routing |
| Animations | flutter_animate | Micro-animations |

---

## Features

### Player (Demand Side)
- 🔍 Discover turfs by city and sport
- 📅 Real-time availability calendar
- ⚡ Instant slot booking with Razorpay
- ✅ Booking confirmation + WhatsApp notification
- 📱 View booking history (upcoming & past)

### Owner (Supply Side)
- 🏟️ Venue dashboard with revenue stats
- 🗓️ Slot management (weekly calendar view)
- 🔒 Block/unblock slots
- 📊 Booking overview and analytics

---

## Setup

### 1. Flutter
```bash
flutter pub get
flutter run
```

### 2. Supabase
1. Create a free project at [supabase.com](https://supabase.com)
2. Run `supabase_migration.sql` in the SQL Editor
3. Update `lib/core/constants/app_constants.dart`:
   ```dart
   static const String supabaseUrl = 'YOUR_SUPABASE_URL';
   static const String supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
   ```

### 3. Razorpay Test Key
Update in `app_constants.dart`:
```dart
static const String razorpayTestKey = 'rzp_test_YOUR_KEY';
```
Get your test key from [dashboard.razorpay.com](https://dashboard.razorpay.com)

---

## Project Structure

```
lib/
├── core/
│   ├── constants/     # App-wide constants + theme tokens
│   ├── router/        # GoRouter navigation
│   ├── theme/         # Dark turf theme
│   └── utils/         # Mock data provider
├── features/
│   ├── auth/          # Splash, Onboarding, Login, Register
│   ├── home/          # Home screen + bottom nav shell
│   ├── venues/        # Venue list + venue detail
│   ├── booking/       # Booking flow + confirmation + my bookings
│   ├── owner/         # Owner dashboard + slot manager
│   └── profile/       # Player profile
└── shared/
    └── widgets/       # AppTextField, GradientButton
```

---

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| Primary Green | `#00E676` | CTAs, active states |
| Background Dark | `#0A0E14` | App background |
| Surface Dark | `#111827` | Cards |
| Text Primary | `#F1F5F9` | Headlines |
| Text Secondary | `#94A3B8` | Captions |

---

## Business Model
- SaaS: ₹999/month per venue
- Commission: 2% per booking
- Premium listing placement

## License
MIT © TurfBook 2026
