# Legal Placeholder Fixes

Free Vercel launch URL:

```text
https://shkruajshpejt.vercel.app
```

## Production Env Replacements

Set these instead of editing many source files:

```text
VITE_SITE_URL=https://shkruajshpejt.vercel.app
VITE_SUPPORT_EMAIL=your-real-support-email
EXPO_PUBLIC_SITE_URL=https://shkruajshpejt.vercel.app
```

## Remaining `YOUR_DOMAIN`

These are intentional placeholders until production env/domain is chosen:

- `frontend/src/lib/legal.ts`
  - Fallback `https://YOUR_DOMAIN.com`
  - Replace through `VITE_SITE_URL=https://shkruajshpejt.vercel.app`
  - Fallback `support@YOUR_DOMAIN.com`
  - Replace through `VITE_SUPPORT_EMAIL`

- `mobile/constants/legal.ts`
  - Fallback `https://YOUR_DOMAIN.com`
  - Replace through `EXPO_PUBLIC_SITE_URL=https://shkruajshpejt.vercel.app`
  - Fallback `support@YOUR_DOMAIN.com`
  - Replace before mobile store testing or add `EXPO_PUBLIC_SUPPORT_EMAIL` later.

- Documentation files:
  - `LEGAL_TODO.md`
  - `LEGAL_PUBLICATION_CHECKLIST.md`
  - `FRONTEND_PUBLICATION_REVIEW.md`
  - `MONETIZATION_SETUP.md`
  - `PUBLICATION_AUDIT.md`
  - `mobile/README.md`
  - `mobile/API_TESTING.md`
  - `mobile/PUBLISH_CHECKLIST.md`
  - `mobile/PRIVACY_AND_DATA_SAFETY_DRAFT.md`
  - `mobile/STORE_LISTING_DRAFT.md`

Docs can keep placeholders, but production env must use real values.

## Remaining `support@YOUR_DOMAIN.com`

Found in:

- `frontend/src/lib/legal.ts`
- `mobile/constants/legal.ts`
- legal/deployment docs

For web launch, set:

```text
VITE_SUPPORT_EMAIL=your-real-support-email
```

## Remaining `example.com`

No production code should use `example.com`. If found later, treat it as a blocker unless it is documentation-only.

## Remaining `localhost` Or `127.0.0.1`

Expected local-development references:

- `README.md`
- `DEPLOY_VERCEL.md`
- `AUTH_PUBLICATION_CHECKLIST.md`
- `PRODUCTION_ENV_CHECKLIST.md`
- `Start-ShkruajShpejt.ps1`
- `Run-ShkruajShpejt-Server.cmd`
- `Hap ShkruajShpejt Direkt.cmd`

These are acceptable for local docs/scripts. Do not use localhost in Vercel env or backend production env.

## `replace-with`

No active production replacement token is expected. If a future scan finds `replace-with`, replace it before deploy.
