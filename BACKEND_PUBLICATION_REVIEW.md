# Backend Publication Review

Date: 2026-05-11

## Working Endpoints In Code

- `GET /api/health`
- `GET /api/auth/status`
- `GET /api/me`
- `POST /api/profile/sync`
- `GET /api/tests`
- `POST /api/tests`
- `GET /api/stats/summary`
- `GET /api/stats/progress`
- `GET /api/lessons`
- `GET /api/lessons/{slug}`
- `POST /api/lessons/{lessonId}/attempt`
- `GET /api/weak-keys`
- `POST /api/weak-keys/practice`
- `GET /api/billing/status`
- `POST /api/billing/create-checkout`
- `POST /api/billing/webhook`
- `POST /api/billing/manual-activate`

## Auth Review

- User data endpoints require JWT auth.
- Public endpoints are health, auth status, lessons read, and billing webhook.
- Billing manual activation is protected by `X-Billing-Admin-Token`.
- JWT validation uses Supabase URL/JWKS and JWT secret fallback support.
- Production now fails fast if JWT env is missing.

## CORS Review

- CORS uses `CORS_ALLOWED_ORIGINS`.
- No wildcard CORS is configured.
- Production now fails fast when CORS origins are missing.
- You must set the exact Vercel origin in backend hosting env.

## Database Review

- Uses Dapper and PostgreSQL through `DATABASE_URL`.
- API queries filter by authenticated user ID.
- `POST /api/tests` saves test result, key stats, and daily stats in one transaction.
- `POST /api/lessons/{lessonId}/attempt` saves progress and practice time.

## Problems

- Live database connection was not tested in this audit.
- Debug build can fail if local backend exe is already running.
- Payment checkout/webhooks are not live until provider env vars are added.

## Production Blockers

- Backend must be deployed to Render, Railway, Azure App Service, Fly.io, or another .NET host.
- Backend env vars must be set.
- `/api/health` must return `ok`.
- CORS must allow the deployed frontend URL.
