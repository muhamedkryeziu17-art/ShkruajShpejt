begin;

create extension if not exists pgcrypto;

alter table public.typing_tests alter column user_id set not null;
alter table public.lesson_progress alter column user_id set not null;
alter table public.lesson_progress alter column lesson_id set not null;
alter table public.key_stats alter column user_id set not null;
alter table public.daily_stats alter column user_id set not null;
alter table public.subscriptions alter column user_id set not null;

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

alter table public.profiles enable row level security;
alter table public.typing_tests enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.key_stats enable row level security;
alter table public.daily_stats enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payment_events enable row level security;

commit;
