alter table public.profiles enable row level security;
alter table public.typing_tests enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.key_stats enable row level security;
alter table public.daily_stats enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payment_events enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- Terms/privacy acceptance is stored on profiles and follows the same owner-only policy.
-- Users cannot read or update another user's legal acceptance state.

drop policy if exists "typing_tests_select_own" on public.typing_tests;
create policy "typing_tests_select_own"
on public.typing_tests for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "typing_tests_insert_own" on public.typing_tests;
create policy "typing_tests_insert_own"
on public.typing_tests for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "lessons_select_all" on public.lessons;
create policy "lessons_select_all"
on public.lessons for select
to anon, authenticated
using (true);

drop policy if exists "lesson_progress_select_own" on public.lesson_progress;
create policy "lesson_progress_select_own"
on public.lesson_progress for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "lesson_progress_insert_own" on public.lesson_progress;
create policy "lesson_progress_insert_own"
on public.lesson_progress for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "lesson_progress_update_own" on public.lesson_progress;
create policy "lesson_progress_update_own"
on public.lesson_progress for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "key_stats_select_own" on public.key_stats;
create policy "key_stats_select_own"
on public.key_stats for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "key_stats_insert_own" on public.key_stats;
create policy "key_stats_insert_own"
on public.key_stats for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "key_stats_update_own" on public.key_stats;
create policy "key_stats_update_own"
on public.key_stats for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "daily_stats_select_own" on public.daily_stats;
create policy "daily_stats_select_own"
on public.daily_stats for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "daily_stats_insert_own" on public.daily_stats;
create policy "daily_stats_insert_own"
on public.daily_stats for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "daily_stats_update_own" on public.daily_stats;
create policy "daily_stats_update_own"
on public.daily_stats for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own"
on public.subscriptions for select
to authenticated
using ((select auth.uid()) = user_id);

-- payment_events intentionally has RLS enabled and no anon/authenticated policies.
-- Webhook writes must happen only through the backend using trusted database credentials.
