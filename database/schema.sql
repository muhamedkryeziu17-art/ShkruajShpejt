create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  terms_accepted_at timestamptz,
  terms_version text,
  privacy_accepted_at timestamptz,
  privacy_version text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists terms_accepted_at timestamptz;
alter table public.profiles add column if not exists terms_version text;
alter table public.profiles add column if not exists privacy_accepted_at timestamptz;
alter table public.profiles add column if not exists privacy_version text;

create table if not exists public.typing_tests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mode_seconds int not null,
  difficulty text not null,
  category text not null,
  wpm numeric not null,
  raw_wpm numeric not null,
  accuracy numeric not null,
  correct_chars int not null,
  incorrect_chars int not null,
  total_chars int not null,
  errors jsonb not null default '{}'::jsonb,
  speed_timeline jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  target_keys text[] not null,
  exercise_text text not null,
  order_index int not null,
  required_accuracy numeric not null default 90,
  required_wpm numeric not null default 15,
  created_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  best_wpm numeric not null default 0,
  best_accuracy numeric not null default 0,
  completed boolean not null default false,
  attempts int not null default 0,
  updated_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

create table if not exists public.key_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  key text not null,
  correct_count int not null default 0,
  error_count int not null default 0,
  updated_at timestamptz not null default now(),
  unique(user_id, key)
);

create table if not exists public.daily_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  tests_completed int not null default 0,
  practice_seconds int not null default 0,
  avg_wpm numeric not null default 0,
  avg_accuracy numeric not null default 0,
  unique(user_id, date)
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null,
  provider_customer_id text,
  provider_subscription_id text,
  plan text not null,
  status text not null,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  lifetime boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_id text unique,
  event_type text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_typing_tests_user_created on public.typing_tests(user_id, created_at desc);
create index if not exists idx_typing_tests_user_category_created on public.typing_tests(user_id, category, created_at desc);
create index if not exists idx_lesson_progress_user on public.lesson_progress(user_id);
create index if not exists idx_lesson_progress_user_lesson on public.lesson_progress(user_id, lesson_id);
create index if not exists idx_lessons_order_index on public.lessons(order_index);
create index if not exists idx_key_stats_user_key on public.key_stats(user_id, key);
create index if not exists idx_key_stats_user_error on public.key_stats(user_id, error_count desc);
create index if not exists idx_daily_stats_user_date on public.daily_stats(user_id, date desc);
create index if not exists idx_subscriptions_user_status on public.subscriptions(user_id, status);
create index if not exists idx_subscriptions_provider_subscription on public.subscriptions(provider, provider_subscription_id);
create index if not exists idx_payment_events_provider_created on public.payment_events(provider, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists lesson_progress_updated_at on public.lesson_progress;
create trigger lesson_progress_updated_at
before update on public.lesson_progress
for each row execute function public.set_updated_at();

drop trigger if exists key_stats_updated_at on public.key_stats;
create trigger key_stats_updated_at
before update on public.key_stats
for each row execute function public.set_updated_at();

drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();
