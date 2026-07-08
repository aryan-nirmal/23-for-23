insert into public.accounts (id, owner_name, email, account_type)
values ('11111111-1111-1111-1111-111111111111', 'Rahul Sharma', 'rahul@pulseprompt.app', 'family')
on conflict (id) do nothing;

insert into public.caregivers (id, account_id, name, email, phone, whatsapp_opt_in)
values (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Rahul Sharma',
  'rahul@pulseprompt.app',
  '+91 98765 43210',
  true
)
on conflict (id) do nothing;

insert into public.patients (id, account_id, caregiver_id, name, phone, timezone, preferred_language, status)
values
  (
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'Meena Sharma',
    '+91 98111 22334',
    'Asia/Kolkata',
    'English',
    'active'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'Joseph D''Souza',
    '+91 98222 77441',
    'Asia/Kolkata',
    'English',
    'active'
  )
on conflict (id) do nothing;
