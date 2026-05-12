# Supabase Live Setup

Use this file to prepare the live Supabase project for real users.

## SQL Run Order

Run these files in Supabase SQL Editor in this exact order:

```text
database/schema.sql
database/indexes.sql
database/seed.sql
database/rls-policies.sql
```

If the database already existed before this audit, first check for null user rows:

```sql
select 'typing_tests' as table_name, count(*) from public.typing_tests where user_id is null
union all
select 'lesson_progress', count(*) from public.lesson_progress where user_id is null
union all
select 'key_stats', count(*) from public.key_stats where user_id is null
union all
select 'daily_stats', count(*) from public.daily_stats where user_id is null
union all
select 'subscriptions', count(*) from public.subscriptions where user_id is null;
```

If all counts are `0`, you can run:

```text
database/migrations/production_ready.sql
```

## Verify Tables Exist

Run:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'profiles',
    'typing_tests',
    'lessons',
    'lesson_progress',
    'key_stats',
    'daily_stats',
    'subscriptions',
    'payment_events'
  )
order by table_name;
```

Expected: all 8 table names appear.

## Verify RLS Is Enabled

Run:

```sql
select c.relname as table_name, c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in (
    'profiles',
    'typing_tests',
    'lessons',
    'lesson_progress',
    'key_stats',
    'daily_stats',
    'subscriptions',
    'payment_events'
  )
order by c.relname;
```

Expected: `rls_enabled` is true for every table.

## Verify Policies Exist

Run:

```sql
select tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

Expected:

- `profiles` has own select/insert/update policies.
- `typing_tests` has own select/insert policies.
- `lesson_progress`, `key_stats`, `daily_stats` have own select/insert/update policies.
- `lessons` has public select policy.
- `subscriptions` has own select policy.
- `payment_events` has no anon/authenticated policy.

## Verify Lessons Are Seeded

Run:

```sql
select slug, title, order_index
from public.lessons
order by order_index;
```

Expected: lesson rows from `database/seed.sql`.

## Test User Isolation With Real Accounts

Best live test:

1. Create/login as User A in the deployed website.
2. Complete and save one typing test.
3. Logout.
4. Create/login as User B in the deployed website.
5. Open dashboard/stats.
6. User B must not see User A result.
7. Save a User B result.
8. Login again as User A.
9. User A must not see User B result.

SQL verification:

```sql
select user_id, count(*)
from public.typing_tests
group by user_id;
```

Expected: rows are separated by different `user_id` values.

## Optional SQL RLS Simulation

Use two real profile IDs from `public.profiles`. Replace the UUIDs below.

```sql
begin;
set local role authenticated;
select set_config('request.jwt.claim.sub', 'USER_A_UUID', true);

select count(*) as visible_user_a_tests
from public.typing_tests;

select count(*) as leaked_user_b_tests
from public.typing_tests
where user_id = 'USER_B_UUID';

rollback;
```

Expected:

- User A sees only User A rows.
- `leaked_user_b_tests` is `0`.

## Never Expose To Frontend

Never put these in Vercel frontend env or mobile env:

- `DATABASE_URL`
- `SUPABASE_JWT_SECRET`
- Supabase service role key
- PostgreSQL password
- Payment API keys
- Webhook secrets

Allowed in frontend:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
