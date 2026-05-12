# Auth Publication Checklist

## Frontend

- Uses Supabase anon key only.
- Google login uses Supabase OAuth.
- Redirect target is built from `VITE_SITE_URL` or the current origin.
- No service role key should be used in frontend.

## Backend

- Validates Supabase JWT bearer tokens.
- Protected endpoints use `RequireAuthorization`.
- Production backend now fails fast if `SUPABASE_URL` or `SUPABASE_JWT_SECRET` is missing.
- JWT fallback secret is only acceptable for local development.

## Supabase Manual Steps

1. Open Supabase Dashboard.
2. Go to Authentication > Providers.
3. Enable Google provider.
4. Add Google OAuth Client ID and Client Secret.
5. Go to Authentication > URL Configuration.
6. Set Site URL:

```text
https://YOUR-VERCEL-APP.vercel.app
```

7. Add redirect URLs:

```text
http://localhost:5173/**
https://YOUR-VERCEL-APP.vercel.app/**
https://YOUR-DOMAIN.com/**
shkruajshpejt://**
```

8. Keep the custom domain URL only after you actually have a custom domain.
9. Test login from production Vercel URL, not only localhost.

## Launch Blockers

- Production redirect URL must be added before Google login works publicly.
- Backend `SUPABASE_JWT_SECRET` must match the same Supabase project.
- Secrets shared during setup should be rotated before public launch.
