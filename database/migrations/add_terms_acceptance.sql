alter table public.profiles add column if not exists terms_accepted_at timestamptz;
alter table public.profiles add column if not exists terms_version text;
alter table public.profiles add column if not exists privacy_accepted_at timestamptz;
alter table public.profiles add column if not exists privacy_version text;

comment on column public.profiles.terms_accepted_at is 'Timestamp when the user accepted the current terms.';
comment on column public.profiles.terms_version is 'Terms version accepted by the user.';
comment on column public.profiles.privacy_accepted_at is 'Timestamp when the user accepted the current privacy policy.';
comment on column public.profiles.privacy_version is 'Privacy policy version accepted by the user.';
