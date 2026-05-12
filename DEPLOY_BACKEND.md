# Deploy Backend

The backend is ASP.NET Core Minimal API. Do not deploy it to Vercel as a static frontend. Use a .NET host.

## Recommended Hosts

- Render Web Service with Docker
- Railway with Docker
- Azure App Service
- Fly.io

## Build

```text
dotnet restore
dotnet publish -c Release
```

With Docker, use:

```text
backend/Dockerfile
```

## Start

The app reads `PORT` and binds to `0.0.0.0:{PORT}` when provided.

Health check path:

```text
/api/health
```

## Required Env Vars

```text
ASPNETCORE_ENVIRONMENT=Production
PORT=
DATABASE_URL=
SUPABASE_URL=
SUPABASE_JWT_SECRET=
CORS_ALLOWED_ORIGINS=
FRONTEND_SITE_URL=
```

Payment env vars are optional until payments are enabled.

## CORS

Set:

```text
CORS_ALLOWED_ORIGINS=https://YOUR-VERCEL-APP.vercel.app
```

Do not use `*` in production.

## Database

Use the Supabase PostgreSQL connection string in `DATABASE_URL`.

Before launch, run:

```text
database/schema.sql
database/indexes.sql
database/seed.sql
database/rls-policies.sql
```

If the database already exists, review and run:

```text
database/migrations/production_ready.sql
```

## Verification

1. Open `https://YOUR-BACKEND-URL.com/api/health`.
2. Confirm `status` is `ok`.
3. Open the Vercel frontend.
4. Login with Google.
5. Save a typing test.
6. Confirm stats update.
