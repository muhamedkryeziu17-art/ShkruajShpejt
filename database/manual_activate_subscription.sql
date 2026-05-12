-- Manual Pro activation for Paysera/bank payments.
-- Replace the email and plan before running in Supabase SQL Editor.

with target_user as (
  select id
  from public.profiles
  where lower(email) = lower('USER_EMAIL_HERE')
),
updated as (
  update public.subscriptions s
  set
    provider = 'paysera_manual',
    plan = 'lifetime',
    status = 'active',
    current_period_start = now(),
    current_period_end = null,
    cancel_at_period_end = false,
    lifetime = true,
    updated_at = now()
  from target_user u
  where s.user_id = u.id
    and s.provider in ('manual', 'paysera_manual')
    and s.provider_subscription_id is null
  returning s.id
)
insert into public.subscriptions (
  user_id,
  provider,
  plan,
  status,
  current_period_start,
  current_period_end,
  cancel_at_period_end,
  lifetime
)
select
  id,
  'paysera_manual',
  'lifetime',
  'active',
  now(),
  null,
  false,
  true
from target_user
where not exists (select 1 from updated);
