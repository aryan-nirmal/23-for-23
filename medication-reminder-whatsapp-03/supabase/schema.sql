create extension if not exists pgcrypto;

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  owner_name text not null,
  email text not null unique,
  account_type text not null check (account_type in ('family', 'clinic')),
  created_at timestamptz not null default now()
);

create table if not exists public.caregivers (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null,
  whatsapp_opt_in boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  caregiver_id uuid not null references public.caregivers(id) on delete cascade,
  name text not null,
  phone text not null,
  timezone text not null default 'Asia/Kolkata',
  preferred_language text not null default 'English',
  status text not null default 'active' check (status in ('active', 'paused')),
  created_at timestamptz not null default now()
);

create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  name text not null,
  dose_text text not null,
  instructions text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.medication_schedules (
  id uuid primary key default gen_random_uuid(),
  medication_id uuid not null references public.medications(id) on delete cascade,
  reminder_time text not null,
  recurrence_rule text not null default 'FREQ=DAILY',
  grace_minutes integer not null default 30,
  created_at timestamptz not null default now()
);

create table if not exists public.reminder_events (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  medication_id uuid not null references public.medications(id) on delete cascade,
  schedule_id uuid not null references public.medication_schedules(id) on delete cascade,
  due_at timestamptz not null,
  local_date_key text not null,
  status text not null check (status in ('scheduled', 'sent', 'taken', 'snoozed', 'missed', 'escalated', 'failed')),
  sent_at timestamptz,
  acknowledged_at timestamptz,
  escalated_at timestamptz,
  reply_text text,
  was_delayed boolean not null default false,
  created_at timestamptz not null default now(),
  unique (schedule_id, local_date_key)
);

create table if not exists public.consent_events (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  caregiver_id uuid not null references public.caregivers(id) on delete cascade,
  type text not null check (type in ('patient_opt_in', 'caregiver_opt_in', 'health_disclaimer')),
  note text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.message_logs (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  patient_id uuid references public.patients(id) on delete cascade,
  caregiver_id uuid references public.caregivers(id) on delete cascade,
  reminder_event_id uuid references public.reminder_events(id) on delete cascade,
  direction text not null check (direction in ('inbound', 'outbound')),
  kind text not null check (kind in ('reminder', 'escalation', 'summary', 'reply', 'system')),
  channel text not null default 'mock_whatsapp',
  content text not null,
  payload jsonb not null default '{}'::jsonb,
  delivery_status text not null check (delivery_status in ('queued', 'delivered', 'failed')),
  created_at timestamptz not null default now()
);

create table if not exists public.adherence_summaries (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  week_start timestamptz not null,
  taken_count integer not null default 0,
  missed_count integer not null default 0,
  delayed_count integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.accounts enable row level security;
alter table public.caregivers enable row level security;
alter table public.patients enable row level security;
alter table public.medications enable row level security;
alter table public.medication_schedules enable row level security;
alter table public.reminder_events enable row level security;
alter table public.consent_events enable row level security;
alter table public.message_logs enable row level security;
alter table public.adherence_summaries enable row level security;

create policy "accounts selectable by owner"
on public.accounts
for select
using (auth.jwt() ->> 'email' = email);

create policy "caregivers scoped by account"
on public.caregivers
for all
using (
  exists (
    select 1 from public.accounts
    where accounts.id = caregivers.account_id
      and accounts.email = auth.jwt() ->> 'email'
  )
)
with check (
  exists (
    select 1 from public.accounts
    where accounts.id = caregivers.account_id
      and accounts.email = auth.jwt() ->> 'email'
  )
);

create policy "patients scoped by account"
on public.patients
for all
using (
  exists (
    select 1 from public.accounts
    where accounts.id = patients.account_id
      and accounts.email = auth.jwt() ->> 'email'
  )
)
with check (
  exists (
    select 1 from public.accounts
    where accounts.id = patients.account_id
      and accounts.email = auth.jwt() ->> 'email'
  )
);

create policy "medications scoped by patient account"
on public.medications
for all
using (
  exists (
    select 1
    from public.patients
    join public.accounts on accounts.id = patients.account_id
    where patients.id = medications.patient_id
      and accounts.email = auth.jwt() ->> 'email'
  )
)
with check (
  exists (
    select 1
    from public.patients
    join public.accounts on accounts.id = patients.account_id
    where patients.id = medications.patient_id
      and accounts.email = auth.jwt() ->> 'email'
  )
);

create policy "schedules scoped by medication account"
on public.medication_schedules
for all
using (
  exists (
    select 1
    from public.medications
    join public.patients on patients.id = medications.patient_id
    join public.accounts on accounts.id = patients.account_id
    where medications.id = medication_schedules.medication_id
      and accounts.email = auth.jwt() ->> 'email'
  )
)
with check (
  exists (
    select 1
    from public.medications
    join public.patients on patients.id = medications.patient_id
    join public.accounts on accounts.id = patients.account_id
    where medications.id = medication_schedules.medication_id
      and accounts.email = auth.jwt() ->> 'email'
  )
);

create policy "events scoped by patient account"
on public.reminder_events
for all
using (
  exists (
    select 1
    from public.patients
    join public.accounts on accounts.id = patients.account_id
    where patients.id = reminder_events.patient_id
      and accounts.email = auth.jwt() ->> 'email'
  )
)
with check (
  exists (
    select 1
    from public.patients
    join public.accounts on accounts.id = patients.account_id
    where patients.id = reminder_events.patient_id
      and accounts.email = auth.jwt() ->> 'email'
  )
);

create policy "consents scoped by patient account"
on public.consent_events
for all
using (
  exists (
    select 1
    from public.patients
    join public.accounts on accounts.id = patients.account_id
    where patients.id = consent_events.patient_id
      and accounts.email = auth.jwt() ->> 'email'
  )
)
with check (
  exists (
    select 1
    from public.patients
    join public.accounts on accounts.id = patients.account_id
    where patients.id = consent_events.patient_id
      and accounts.email = auth.jwt() ->> 'email'
  )
);

create policy "message logs scoped by account"
on public.message_logs
for all
using (
  exists (
    select 1 from public.accounts
    where accounts.id = message_logs.account_id
      and accounts.email = auth.jwt() ->> 'email'
  )
)
with check (
  exists (
    select 1 from public.accounts
    where accounts.id = message_logs.account_id
      and accounts.email = auth.jwt() ->> 'email'
  )
);

create policy "summaries scoped by patient account"
on public.adherence_summaries
for all
using (
  exists (
    select 1
    from public.patients
    join public.accounts on accounts.id = patients.account_id
    where patients.id = adherence_summaries.patient_id
      and accounts.email = auth.jwt() ->> 'email'
  )
)
with check (
  exists (
    select 1
    from public.patients
    join public.accounts on accounts.id = patients.account_id
    where patients.id = adherence_summaries.patient_id
      and accounts.email = auth.jwt() ->> 'email'
  )
);
