# Deploy Backend

Frontend shkon ne Vercel. Backend-i eshte ASP.NET Core dhe duhet host qe suporton .NET ose Docker.

## Pse duhet backend URL

`VITE_API_BASE_URL` eshte URL qe merr pasi backend-i publikohet. Pa kete URL, hyrja mund te hapet, por ruajtja e rezultateve dhe statistikat nuk punojne ne prodhim.

Shembull:

```text
https://shkruajshpejt-api.onrender.com
```

Pastaj ne Vercel vendos:

```text
VITE_API_BASE_URL=https://shkruajshpejt-api.onrender.com
```

## Hostimi Me Docker

Ky folder ka `Dockerfile`, prandaj mund te perdoret ne hoste qe pranojne Docker.

Vendos Root Directory:

```text
backend
```

Vendos Dockerfile Path:

```text
Dockerfile
```

## Backend Env

Vendos keto env variables ne hostin e backend-it:

```text
DATABASE_URL=
SUPABASE_URL=https://swgbonmiugmlklpuiett.supabase.co
SUPABASE_JWT_SECRET=
ASPNETCORE_ENVIRONMENT=Production
PORT=
CORS_ALLOWED_ORIGINS=https://YOUR-VERCEL-APP.vercel.app
FRONTEND_SITE_URL=https://YOUR-VERCEL-APP.vercel.app
```

`DATABASE_URL` dhe `SUPABASE_JWT_SECRET` jane sekrete. Mos i vendos ne frontend ose Vercel frontend env.

## Pas Deploy

1. Kopjo URL e backend-it.
2. Hape:

```text
https://YOUR-BACKEND-URL.com/api/health
```

3. Nese kthen JSON dhe status `ok` ose `degraded`, backend-i po pergjigjet.
4. Vendos kete URL ne Vercel si `VITE_API_BASE_URL`.
5. Vendos Vercel URL ne backend si `CORS_ALLOWED_ORIGINS`.
6. Redeploy backend-in.
7. Redeploy frontend-in ne Vercel.

## Gabime Te Zakonshme

- CORS error: `CORS_ALLOWED_ORIGINS` nuk ka URL e Vercel.
- 401: JWT settings nuk jane nga i njejti Supabase project.
- 500: `DATABASE_URL`, schema, ose RLS nuk jane gati.
- API nuk hapet: hosti nuk po e starton Dockerfile ose porta nuk eshte lidhur mire.
