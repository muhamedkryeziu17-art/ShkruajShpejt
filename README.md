# ShkruajShpejt

ShkruajShpejt is a full-stack Albanian typing trainer for timed tests, lessons, weak-key drills, bigram practice, progress charts, and Google sign-in through Supabase.

All app UI copy is written in Albanian using plain ASCII letters.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Recharts, animejs
- Backend: C# ASP.NET Core Minimal API
- Data access: Dapper with Npgsql
- Auth: Supabase Auth with Google OAuth
- Database: Supabase PostgreSQL
- Tests: Vitest for typing math, xUnit for backend typing math

## Project Structure

```text
/frontend   React TypeScript app
/backend    ASP.NET Core Minimal API
/backend.Tests
/database   schema, seed data, RLS policies
```

## Local Setup

1. Install dependencies:

```bash
cd frontend
npm install
cd ..
dotnet restore backend
dotnet restore backend.Tests
```

2. Copy env examples:

```bash
copy frontend\.env.example frontend\.env
copy backend\.env.example backend\.env
```

PowerShell users can set backend env vars before running:

```powershell
$env:SUPABASE_URL="https://your-project.supabase.co"
$env:SUPABASE_JWT_SECRET="your-jwt-secret"
$env:DATABASE_URL="postgresql://postgres:password@host:5432/postgres?sslmode=require"
$env:CORS_ALLOWED_ORIGINS="http://localhost:5173"
```

## Environment Variables

Frontend:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_BASE_URL=http://localhost:5000
```

Backend:

```text
SUPABASE_URL=
SUPABASE_JWT_SECRET=
DATABASE_URL=
ASPNETCORE_ENVIRONMENT=Development
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## Supabase Setup

1. Create a Supabase project.
2. In SQL Editor, run:

```text
database/schema.sql
database/seed.sql
database/rls-policies.sql
```

3. In Project Settings, copy:

- Project URL to `SUPABASE_URL` and `VITE_SUPABASE_URL`
- Anon public key to `VITE_SUPABASE_ANON_KEY`
- JWT secret to `SUPABASE_JWT_SECRET`
- Postgres connection string to `DATABASE_URL`

## Google OAuth Setup

1. In Google Cloud Console, create OAuth client credentials.
2. Add Supabase callback URL from Supabase Auth provider settings.
3. In Supabase Dashboard, enable Google provider and paste client id plus secret.
4. Add local redirect URL:

```text
http://localhost:5173/dashboard
```

## Run Locally

Backend:

```bash
cd backend
dotnet run --urls http://localhost:5000
```

Frontend:

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

## Test and Build

Frontend:

```bash
cd frontend
npm test
npm run build
```

Backend:

```bash
dotnet test backend.Tests
dotnet build backend
```

## Main Features

- Google sign-in with Supabase Auth
- Guest typing test mode without permanent save
- Timed tests from 30 seconds to 10 minutes
- Difficulty and category selection
- Live WPM, raw WPM, accuracy, timer, and errors
- Result screen with speed chart and weak keys
- Structured lessons with unlock state and targets
- Virtual QWERTY keyboard with finger zones
- Weak-key practice generator
- Bigram practice page
- Dashboard and statistics charts
- Light and dark mode
- Motion with animejs and reduced-motion support

## Deployment Notes

Recommended simple setup:

- Frontend: Vercel static Vite app from `/frontend`.
- Backend: Render Web Service from `/backend` using `backend/Dockerfile`.
- Database and Auth: Supabase hosted project.

Production frontend env:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_API_BASE_URL=https://your-backend.onrender.com
```

Production backend env:

```text
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_JWT_SECRET=your-supabase-jwt-secret
DATABASE_URL=postgresql://...
ASPNETCORE_ENVIRONMENT=Production
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-custom-domain.com
```

Render backend settings:

```text
Root Directory: backend
Environment: Docker
Dockerfile Path: Dockerfile
Health Check Path: /api/health
```

Vercel frontend settings:

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

After both deploys:

- Put the Render backend URL into `VITE_API_BASE_URL` on Vercel and redeploy frontend.
- Put the Vercel frontend origin into `CORS_ALLOWED_ORIGINS` on Render and redeploy backend.
- In Supabase Auth URL Configuration, set Site URL to the production frontend URL.
- Add `https://your-frontend-domain/dashboard` to Supabase Redirect URLs.
- In Google Cloud OAuth, add the Supabase callback URL shown in Supabase Google provider settings.
- Do not commit `.env` files or backend secrets.

## Troubleshooting

- If login opens but profile is not created, check `SUPABASE_JWT_SECRET` and `SUPABASE_URL`.
- If API calls fail in browser, check `VITE_API_BASE_URL` and CORS.
- If database inserts fail, run schema, seed, and RLS SQL in order.
- If guest mode works but saving does not, confirm the user is logged in and the bearer token reaches the API.
"# ShkruajShpejt" 
