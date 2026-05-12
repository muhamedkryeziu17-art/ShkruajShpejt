# Deploy Frontend To Vercel

This project uses a Vite React frontend in `frontend`. Deploy only the frontend to Vercel. The ASP.NET Core backend should be deployed to a service that supports long-running .NET apps, such as Render, Railway, Azure App Service, Fly.io, or another .NET host.

Official docs:

- Vercel Vite: https://vercel.com/docs/frameworks/frontend/vite
- Vercel environment variables: https://vercel.com/docs/environment-variables
- Vercel rewrites: https://vercel.com/docs/rewrites
- Supabase redirect URLs: https://supabase.com/docs/guides/auth/redirect-urls

## A) Push Project To GitHub

1. Create a GitHub repository.
2. Push this project.
3. Make sure `.env` files are not committed.

## B) Import In Vercel

1. Open Vercel.
2. Choose Add New > Project.
3. Import the GitHub repository.
4. Set Root Directory to:

```text
frontend
```

Recommended setup is Root Directory `frontend`. Do not combine Root Directory `frontend` with `--prefix frontend`; that makes Vercel look for `frontend/frontend/package.json`.

If you already imported the repository with Root Directory as the project root, either change Root Directory to `frontend`, or use these root-level commands:

```text
Install Command: npm install --prefix frontend
Build Command: npm run build --prefix frontend
Output Directory: frontend/dist
```

If Vercel does not let you change the old settings and the project still has Root Directory `frontend` plus `--prefix frontend`, the compatibility wrapper in `frontend/frontend` redirects the build to the real app and copies the final files to the output path Vercel expects.

## C) Vercel Build Settings

Use these settings:

```text
Framework Preset: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

`frontend/vercel.json` includes the SPA fallback rewrite to `index.html`.

## D) Vercel Environment Variables

Add these variables in Vercel Project Settings > Environment Variables for Production and Preview:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_API_BASE_URL
VITE_SITE_URL
VITE_SUPPORT_EMAIL
```

For this project, your Supabase URL is:

```text
VITE_SUPABASE_URL=https://swgbonmiugmlklpuiett.supabase.co
```

Use the Supabase anon key you copied from Supabase for `VITE_SUPABASE_ANON_KEY`. It is public client config, but do not put database URLs, JWT secrets, or service role keys in Vercel frontend env.

Use the free Vercel subdomain first:

```text
VITE_SITE_URL=https://YOUR-VERCEL-APP.vercel.app
```

Set the public support email used by legal/contact pages:

```text
VITE_SUPPORT_EMAIL=support@YOUR-DOMAIN.com
```

Set the backend API to your deployed ASP.NET Core API:

```text
VITE_API_BASE_URL=https://YOUR-BACKEND-URL.com
```

Do not use a local machine URL for Vercel Production or Preview.

If `VITE_API_BASE_URL` is empty, the site can build but saved results and stats will not work.

## E) Deploy

1. Click Deploy in Vercel.
2. Wait for the build to finish.
3. Copy the Vercel URL, for example:

```text
https://shkruajshpejt.vercel.app
```

If Vercel gives a different URL, use the exact URL Vercel gives you.

## F) Supabase Redirect URLs

Open Supabase Dashboard > Authentication > URL Configuration.

Set Site URL to the production Vercel URL:

```text
https://YOUR-VERCEL-APP.vercel.app
```

Add redirect URLs:

```text
https://YOUR-VERCEL-APP.vercel.app/**
http://localhost:5173/**
```

If mobile remains active, keep this mobile deep link too:

```text
shkruajshpejt://**
```

Supabase recommends exact production URLs and wildcard URLs for local or preview flows.

## G) Backend Deployment Reminder

Do not deploy the ASP.NET Core backend to Vercel unless it is rewritten for Vercel serverless. Keep this split:

- Frontend: Vercel free plan.
- Backend: Render, Railway, Azure App Service, Fly.io, or another ASP.NET Core host.
- Database/Auth: Supabase.

Backend production env must include:

```text
CORS_ALLOWED_ORIGINS=https://YOUR-VERCEL-APP.vercel.app
ASPNETCORE_ENVIRONMENT=Production
```

If you use Vercel Preview URLs, add the exact preview origin to `CORS_ALLOWED_ORIGINS` while testing.

See `backend/DEPLOY_BACKEND.md` for backend hosting steps.

## H) Test After Deploy

1. Open the Vercel URL.
2. Confirm landing page loads.
3. Click `Kycu me Google`.
4. Confirm Google returns to the Vercel dashboard route.
5. Start a typing test.
6. Finish the test.
7. Save the result.
8. Open `Statistikat`.
9. Confirm the saved result appears.
10. Open browser devtools and confirm no API request goes to a local URL.

## I) Common Fixes

- Google redirects to local URL: update Supabase Site URL and redirect URLs.
- API request fails with CORS: set backend `CORS_ALLOWED_ORIGINS` to the Vercel origin and redeploy backend.
- API request fails with 401: backend Supabase JWT settings do not match the Supabase project.
- API request fails with 500: backend database env or Supabase database schema is not ready.
- Vercel build cannot find scripts: Root Directory must be `frontend`.
