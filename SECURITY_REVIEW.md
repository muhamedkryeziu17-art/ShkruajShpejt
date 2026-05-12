# Security Review

Date: 2026-05-11

## Secret Exposure

- `.env` files exist locally and are ignored by `.gitignore`.
- Do not commit `.env` files.
- Supabase anon key is public client config and can be used in frontend.
- Service role keys, database URLs, JWT secrets, webhook secrets, and payment API keys must stay server-side only.
- Real credentials were shared during setup. Rotate them before public launch.

## Frontend Scan

No frontend source matches were found for:

- `service_role`
- `SUPABASE_SERVICE`
- `JWT_SECRET`
- `DATABASE_URL`
- `postgresql://`
- `sk_live`
- `sk_test`

The mobile scan found only documentation placeholders, not real secrets.

## Backend Security

- Protected endpoints require JWT auth.
- Backend now fails fast in Production when required auth/database/CORS env vars are missing.
- Error handler returns generic `Gabim ne server` to clients.
- Runtime errors are written to a local log file; do not expose that file from hosting.

## Database Security

- RLS files enable RLS on public tables.
- User-owned policies use authenticated user ID.
- Payment events have no frontend-readable policy.
- Live RLS must still be verified in Supabase after applying SQL.

## Deployment Security

- CORS must list exact production frontend origins.
- Supabase redirect URLs must list exact frontend origins.
- Legal placeholders must be replaced before public launch.

## Required Rotations Before Launch

- Supabase database password if it was shared.
- Supabase JWT secret if it was shared.
- Any Google OAuth secret that was shared in chat or docs.
- Any future payment webhook/API secret if exposed.
