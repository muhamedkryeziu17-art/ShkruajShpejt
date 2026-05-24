# Publication Audit

Date: 2026-05-11

Verdict: not ready for public launch until live Supabase, backend hosting, Vercel env, CORS, redirect URLs, and legal placeholders are completed and verified.

## What Exists

- `frontend`: Vite React TypeScript app with landing page, login, dashboard, typing test, lessons, stats, weak keys, bigrams, settings, pricing, and legal routes.
- `backend`: ASP.NET Core Minimal API with JWT auth, PostgreSQL access through Dapper, CORS config, health endpoint, profile sync, tests, stats, lessons, weak keys, and billing endpoints.
- `database`: SQL schema, seed data, RLS policies, index file, and production hardening migration.
- `mobile`: Expo app exists, but mobile store launch is separate from web launch.
- Deployment docs exist for Vercel frontend and backend hosting.

## What Is Missing

- Public backend URL is not confirmed.
- Vercel production URL is not confirmed.
- Supabase live database migration was not run from this audit.
- Supabase Auth redirect URLs must be updated with the production frontend URL.
- Backend production `CORS_ALLOWED_ORIGINS` must include the exact Vercel origin.
- Real legal domain and support email are still placeholders until you set production env.
- Payment provider products, keys, and webhooks are not configured.

## What Is Broken Or Risky

- Local `.env` files exist. They are ignored by `.gitignore`, but do not commit them.
- Secrets were shared during setup. Rotate the database password and JWT secret before launch.
- Backend Debug build can fail while the local API exe is running because Windows locks the file. Release build passes.
- Live database RLS was not verified because this audit did not connect to Supabase.
- Production backend now fails fast if required env vars are missing, which is safer but requires proper hosting env setup.

## Must Fix Before Public Launch

1. Deploy backend to a .NET host and confirm `/api/health` returns `status: ok`.
2. Run `database/schema.sql`, `database/indexes.sql`, `database/seed.sql`, and `database/rls-policies.sql` in Supabase.
3. If the database already has data, run `database/migrations/production_ready.sql` after checking there are no null `user_id` rows.
4. Deploy frontend to Vercel with production env vars.
5. Add frontend URL to Supabase Auth redirect URLs.
6. Add frontend URL to backend `CORS_ALLOWED_ORIGINS`.
7. Test Google login on the deployed URL.
8. Test saving a typing result and loading stats with a real logged-in account.
9. Replace `YOUR_DOMAIN`; support email is set to `shkruajshpejt@gmail.com`.
10. Rotate secrets that were shared or used during development.

## Public Access Verdict

- Can public users open website? Yes after Vercel deployment if env vars are set.
- Can public users create/login account? Not verified live; depends on Supabase Google provider and redirect URLs.
- Can public users use guest mode? Yes for frontend typing flows, but permanent save requires login.
- Can logged-in users save data? Code supports it; live save must be tested after backend/database deployment.
- Can users access other users' data? SQL RLS and backend user filters are designed to prevent this, but live Supabase policies must be applied and verified.
- Is the database safe for public users? Prepared, but not proven live until migrations/RLS are applied and tested.
