# Final Deployment Steps

This is the path from local testing to public website launch for ShkruajShpejt.

Target free frontend URL:

```text
https://shkruajshpejt.vercel.app
```

## 1. Rotate Shared Secrets

Rotate anything that was shared during setup before public launch.

1. Supabase database password:
   - Open Supabase Dashboard.
   - Go to Project Settings > Database.
   - Reset database password.
   - Copy the new connection string.
   - Update backend `DATABASE_URL` on the backend host.

2. Supabase JWT secret or signing key:
   - Open Supabase Dashboard.
   - Go to Project Settings > API or Auth settings.
   - Rotate the JWT secret/signing key if the dashboard allows it.
   - Update backend `SUPABASE_JWT_SECRET`.
   - Ask test users to sign out and sign in again.

3. Google OAuth client secret:
   - Open Google Cloud Console.
   - Go to APIs & Services > Credentials.
   - Open the OAuth client used by Supabase.
   - Reset/regenerate the client secret.
   - Update Supabase Google provider settings.

4. Payment/webhook secrets:
   - Only needed when payments go live.
   - Never put these in frontend env.

## 2. Apply Supabase SQL

Run these in Supabase SQL Editor in this exact order:

```text
database/schema.sql
database/indexes.sql
database/seed.sql
database/rls-policies.sql
```

If the database already has old rows, review and run this after checking null user rows:

```text
database/migrations/production_ready.sql
```

Do not run destructive cleanup unless you have a backup.

## 3. Verify Supabase

Run the verification queries from `SUPABASE_LIVE_SETUP.md`.

Minimum checks:

- Tables exist.
- RLS is enabled.
- Policies exist.
- Lessons are seeded.
- A logged-in user can read only their own private rows.
- `payment_events` has no anon/authenticated policies.

## 4. Deploy Backend

Use Render, Railway, Azure App Service, Fly.io, or another host that supports ASP.NET Core/Docker.

Recommended Docker setup:

```text
Root Directory: backend
Dockerfile Path: Dockerfile
Health Check Path: /api/health
```

Set backend env variables:

```text
ASPNETCORE_ENVIRONMENT=Production
DATABASE_URL
SUPABASE_URL
SUPABASE_JWT_SECRET
CORS_ALLOWED_ORIGINS=https://shkruajshpejt.vercel.app
FRONTEND_SITE_URL=https://shkruajshpejt.vercel.app
PORT
```

After deploy, open:

```text
https://YOUR-BACKEND-URL/api/health
```

Public launch requires `status` to be `ok`, not only `degraded`.

## 5. Deploy Frontend To Vercel

1. Push project to GitHub.
2. Open Vercel.
3. Import the repository.
4. Set Root Directory:

```text
frontend
```

5. Use these build settings:

```text
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

6. Set Vercel env variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_API_BASE_URL=https://YOUR-BACKEND-URL
VITE_SITE_URL=https://shkruajshpejt.vercel.app
VITE_SUPPORT_EMAIL=shkruajshpejt@gmail.com
```

7. Deploy.
8. If the Vercel URL is not exactly `https://shkruajshpejt.vercel.app`, use the exact URL Vercel gives you in Supabase and backend CORS.

## 6. Add Supabase Redirect URLs

Open Supabase Dashboard > Authentication > URL Configuration.

Set Site URL:

```text
https://shkruajshpejt.vercel.app
```

Add redirect URLs:

```text
https://shkruajshpejt.vercel.app/**
http://localhost:5173/**
shkruajshpejt://**
```

Only keep `shkruajshpejt://**` if mobile testing remains active.

## 7. Set Backend CORS

On the backend host:

```text
CORS_ALLOWED_ORIGINS=https://shkruajshpejt.vercel.app
FRONTEND_SITE_URL=https://shkruajshpejt.vercel.app
```

Redeploy/restart backend after changing env vars.

## 8. Replace Legal Placeholders

For free Vercel launch:

```text
VITE_SITE_URL=https://shkruajshpejt.vercel.app
VITE_SUPPORT_EMAIL=shkruajshpejt@gmail.com
```

Also update mobile env later:

```text
EXPO_PUBLIC_SITE_URL=https://shkruajshpejt.vercel.app
```

## 9. Production Tests

Run the full checklist in `FINAL_PUBLIC_TEST_PLAN.md`.

Must pass before public launch:

- Google login.
- Profile sync.
- Typing result save.
- Stats load.
- Guest mode.
- RLS/user isolation.
- No failed production API calls.
- Legal pages open.

## 10. Launch Decision

Launch only after:

- Backend health is `ok`.
- Frontend Vercel build passes.
- Supabase redirect URLs work.
- CORS works from Vercel URL.
- Database RLS is verified.
- Secrets have been rotated.
- Legal placeholders are replaced.
