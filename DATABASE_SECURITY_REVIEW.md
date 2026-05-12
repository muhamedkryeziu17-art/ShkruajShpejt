# Database Security Review

Date: 2026-05-11

## Tables Reviewed

- `profiles`
- `typing_tests`
- `lessons`
- `lesson_progress`
- `key_stats`
- `daily_stats`
- `subscriptions`
- `payment_events`

## Schema Status

- Primary keys exist on all tables.
- Foreign keys connect user-owned rows to `profiles(id)`.
- `profiles(id)` references `auth.users(id)` with cascade delete.
- User-owned tables now define `user_id` as `not null` in the base schema.
- `lesson_progress.lesson_id` is now `not null`.
- Duplicate prevention exists through unique constraints on lesson progress, key stats, daily stats, lesson slugs, and payment event IDs.
- `created_at` exists where needed. `updated_at` exists on mutable tables and is managed by trigger where included.

## Indexes

Created or confirmed:

- `typing_tests(user_id, created_at desc)`
- `typing_tests(user_id, category, created_at desc)`
- `lesson_progress(user_id)`
- `lesson_progress(user_id, lesson_id)`
- `lessons(order_index)`
- `key_stats(user_id, key)`
- `key_stats(user_id, error_count desc)`
- `daily_stats(user_id, date desc)`
- `subscriptions(user_id, status)`
- `subscriptions(provider, provider_subscription_id)`
- `payment_events(provider, created_at desc)`

## RLS Enabled Tables

RLS is enabled for:

- `profiles`
- `typing_tests`
- `lessons`
- `lesson_progress`
- `key_stats`
- `daily_stats`
- `subscriptions`
- `payment_events`

## Safe Policies

- Authenticated users can read, insert, and update only their own profile.
- Authenticated users can read and insert only their own typing tests.
- Authenticated users can read, insert, and update only their own lesson progress.
- Authenticated users can read, insert, and update only their own key stats.
- Authenticated users can read, insert, and update only their own daily stats.
- Authenticated users can read only their own subscription status.
- Lessons are public read-only for anon and authenticated users.

## Payment/Admin Tables

- `payment_events` has RLS enabled and no anon/authenticated policies.
- Frontend users cannot directly write payment events.
- Subscription writes must happen through backend trusted database credentials.

## Unsafe Or Missing Items

- Live Supabase database was not queried in this audit, so applied policies are not verified.
- If old rows exist with null `user_id`, `production_ready.sql` will fail until those rows are removed or fixed.
- Backend direct PostgreSQL access bypasses RLS when using an owner connection. API code must keep filtering by authenticated user ID.

## Fixes Applied

- Added `not null` user relationships in `database/schema.sql`.
- Added `database/indexes.sql`.
- Added `database/migrations/production_ready.sql`.
- Updated RLS policies to explicitly target authenticated users for user-owned data.
