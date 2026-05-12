# Frontend Publication Review

Date: 2026-05-11

## Routes Found

- `/`
- `/login`
- `/dashboard`
- `/test`
- `/lessons`
- `/lessons/:slug`
- `/weak-keys`
- `/bigrams`
- `/stats`
- `/settings`
- `/settings/billing`
- `/pricing`
- `/privacy`
- `/terms`
- `/refund`
- `/contact`
- `/delete-account`
- fallback route redirects to `/`

## Config Review

- API URL uses `VITE_API_BASE_URL`.
- Supabase URL uses `VITE_SUPABASE_URL`.
- Supabase anon key uses `VITE_SUPABASE_ANON_KEY`.
- Site URL uses `VITE_SITE_URL`.
- Support email now supports `VITE_SUPPORT_EMAIL`.
- Vite build output is `dist`.
- `frontend/vercel.json` has SPA fallback rewrite.

## Security Review

- No service role key found in frontend source scan.
- No database URL found in frontend source scan.
- No payment secret found in frontend source scan.
- Supabase anon key is allowed in frontend.

## Problems

- `YOUR_DOMAIN` and `support@YOUR_DOMAIN.com` remain placeholders unless production env vars are set.
- There is no dedicated 404 page; unknown routes redirect to the landing page.
- Live Google login, save result, and stats loading were not verified against deployed backend.

## Launch Blockers

- Set Vercel env vars.
- Replace legal/support placeholders.
- Test production auth redirect.
- Test production API save and stats flows.
