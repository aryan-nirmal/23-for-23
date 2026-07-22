-- TurfBook Database Schema
-- Run this in your Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Venues table
CREATE TABLE IF NOT EXISTS public.venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT DEFAULT '',
  sport_types TEXT[] DEFAULT '{}',
  image_urls TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 4.0,
  review_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive','pending')),
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  amenities JSONB DEFAULT '{}',
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  phone TEXT,
  whatsapp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Slots table
CREATE TABLE IF NOT EXISTS public.slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available','booked','locked','blocked')),
  sport_type TEXT,
  locked_at TIMESTAMPTZ,
  locked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT no_overlap EXCLUDE USING gist (
    venue_id WITH =,
    tstzrange(start_at, end_at) WITH &&
  )
);

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slot_id UUID NOT NULL REFERENCES public.slots(id),
  venue_id UUID NOT NULL REFERENCES public.venues(id),
  player_id UUID REFERENCES auth.users(id),
  player_name TEXT NOT NULL,
  player_phone TEXT NOT NULL,
  player_email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed')),
  total_amount DECIMAL(10,2) NOT NULL,
  payment_id TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  refund_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Venues
CREATE POLICY "Venues are publicly viewable" ON public.venues
  FOR SELECT USING (status = 'active');

CREATE POLICY "Owners can manage their venues" ON public.venues
  FOR ALL USING (auth.uid() = owner_id);

-- RLS Policies: Slots
CREATE POLICY "Slots are publicly viewable" ON public.slots
  FOR SELECT USING (true);

CREATE POLICY "Venue owners can manage slots" ON public.slots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.venues
      WHERE venues.id = slots.venue_id
      AND venues.owner_id = auth.uid()
    )
  );

-- RLS Policies: Bookings
CREATE POLICY "Players can view their bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = player_id);

CREATE POLICY "Players can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = player_id OR player_id IS NULL);

CREATE POLICY "Owners can view bookings for their venues" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.venues
      WHERE venues.id = bookings.venue_id
      AND venues.owner_id = auth.uid()
    )
  );

-- Realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE public.slots;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_venues_city ON public.venues(city);
CREATE INDEX IF NOT EXISTS idx_slots_venue_date ON public.slots(venue_id, start_at);
CREATE INDEX IF NOT EXISTS idx_bookings_player ON public.bookings(player_id);
CREATE INDEX IF NOT EXISTS idx_bookings_venue ON public.bookings(venue_id);
