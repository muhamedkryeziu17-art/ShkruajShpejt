# Production Environment Checklist

Use this before Vercel Preview, Vercel Production, TestFlight, or Google Play Internal Testing.

## Frontend Vercel Env

Set these in Vercel Project Settings > Environment Variables:

- [ ] `VITE_SUPABASE_URL=https://swgbonmiugmlklpuiett.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] `VITE_API_BASE_URL`
- [ ] `VITE_SITE_URL`
- [ ] `VITE_SUPPORT_EMAIL`

Rules:

- [ ] `VITE_API_BASE_URL` is a deployed HTTPS backend origin.
- [ ] `VITE_SITE_URL` is the Vercel app URL.
- [ ] `VITE_SUPPORT_EMAIL` is a real support email.
- [ ] No database URL, JWT secret, service role key, or payment secret is in frontend env.
- [ ] Supabase anon key is the only Supabase key exposed to the frontend.

## Backend Env

Set these on the backend host:

- [ ] `DATABASE_URL`
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_JWT_SECRET`
- [ ] `CORS_ALLOWED_ORIGINS`
- [ ] `ASPNETCORE_ENVIRONMENT=Production`

Rules:

- [ ] `CORS_ALLOWED_ORIGINS` includes the exact Vercel origin.
- [ ] CORS does not use wildcard origins in production.
- [ ] `DATABASE_URL` is only on the backend host.
- [ ] `SUPABASE_JWT_SECRET` is only on the backend host.

## Supabase

- [ ] Google OAuth provider is enabled.
- [ ] Supabase Site URL is the Vercel production URL.
- [ ] Redirect URL added: `https://YOUR-VERCEL-APP.vercel.app/**`
- [ ] Local redirect URL kept for dev: `http://localhost:5173/**`
- [ ] Mobile redirect URL kept if needed: `shkruajshpejt://**`
- [ ] Database tables created.
- [ ] Seed data inserted.
- [ ] RLS policies enabled.
- [ ] Users can only read/write their own saved progress.

## Frontend Verification

- [ ] Vercel build passes.
- [ ] Landing page loads.
- [ ] Google login returns to dashboard.
- [ ] Guest test mode works.
- [ ] Logged-in user can save a test result.
- [ ] Stats page shows saved data.
- [ ] Browser network tab shows API calls to production backend only.

## Backend Verification

- [ ] `/api/health` returns 200.
- [ ] `/api/me` returns the logged-in user with bearer token.
- [ ] `/api/tests` saves a typing result.
- [ ] `/api/stats/summary` returns updated stats.
- [ ] Backend logs have no database connection errors.

## Store And Mobile Cross-Check

- [ ] Mobile env uses the same production API origin.
- [ ] Mobile auth redirect remains documented separately.
- [ ] Store privacy text matches production data usage.
