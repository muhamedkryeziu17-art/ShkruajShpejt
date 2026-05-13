# Legal Acceptance Flow

ShkruajShpejt kerkon qe user-i i kycur te pranoje versionin aktual te Kushtet dhe Rregullat dhe Politiken e Privatise para se te perdore faqet e mbrojtura.

## Versionet aktuale

```text
TERMS_VERSION=2026-05-13
PRIVACY_VERSION=2026-05-13
```

Kur ndryshon teksti ligjor ne menyre materiale, perditeso versionet ne:

- `backend/LegalVersions.cs`
- `frontend/src/config/legal.ts`
- `mobile/constants/legal.ts`

Pas ndryshimit, user-at me version te vjeter do ta shohin prape ekranin e pranimit.

## Databaza

Pranimi ruhet ne `public.profiles`:

- `terms_accepted_at`
- `terms_version`
- `privacy_accepted_at`
- `privacy_version`

Migration:

```text
database/migrations/add_terms_acceptance.sql
```

RLS:

- `profiles_select_own` lejon user-in te lexoj vetem profilin e vet.
- `profiles_update_own` lejon user-in te perditesoj vetem profilin e vet.
- Backend perdor JWT user id dhe nuk pranon `user_id` nga frontend per pranimin ligjor.

## Backend API

`GET /api/me`

Kthen profilin dhe:

- `termsAcceptedAt`
- `termsVersion`
- `privacyAcceptedAt`
- `privacyVersion`
- `mustAcceptTerms`

`POST /api/legal/accept`

Body:

```json
{
  "termsVersion": "2026-05-13",
  "privacyVersion": "2026-05-13"
}
```

Backend kontrollon JWT user id, validon versionet, ruan timestamp-et dhe kthen profilin e perditesuar.

Backend gjithashtu bllokon endpoint-et e app-it me `428` nese user-i i kycur nuk ka pranuar versionet aktuale. Bypass lejohen vetem per:

- `/api/health`
- `/api/auth/debug`
- `/api/me`
- `/api/profile/sync`
- `/api/legal/accept`

## Frontend web

Komponentet kryesore:

- `frontend/src/state/LegalAcceptanceProvider.tsx`
- `frontend/src/components/TermsAcceptanceGate.tsx`
- `frontend/src/config/legal.ts`

Faqet publike mbeten te hapura:

- `/`
- `/login`
- `/privacy`
- `/terms`
- `/refund`
- `/contact`
- `/delete-account`
- `/about`

Faqet e mbrojtura nuk montohen derisa kontrolli ligjor mbaron dhe kushtet jane pranuar.

## Mobile

Komponentet kryesore:

- `mobile/hooks/use-legal-acceptance.tsx`
- `mobile/components/terms-acceptance-gate.tsx`
- `mobile/constants/legal.ts`

Pas login-it, mobile therrit `/api/me`. Nese `mustAcceptTerms` eshte `true`, shfaq modal bllokues. Linket hapin `/terms` dhe `/privacy` ne browser.

## Test manual

1. Ekzekuto migration ne Supabase.
2. Deploy backend.
3. Deploy frontend.
4. Kycu me nje user te ri.
5. Konfirmo qe shfaqet modali `Kushtet dhe Rregullat`.
6. Provo te hapesh dashboard pa pranuar. Duhet te jete i bllokuar.
7. Kliko `Lexo Kushtet`.
8. Kliko `Lexo Politiken e Privatise`.
9. Kthehu, sheno checkbox-in.
10. Kliko `Pranoj dhe vazhdo`.
11. Konfirmo qe dashboard hapet.
12. Rifresko faqen. Modali nuk duhet te shfaqet prape.
13. Ndrysho `TERMS_VERSION` ne kod per test.
14. Deploy dhe konfirmo qe modali shfaqet prape.

## Hapat ne Supabase

Ekzekuto ne SQL Editor:

```text
database/migrations/add_terms_acceptance.sql
```

Pastaj kontrollo:

```sql
select column_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'profiles'
  and column_name in ('terms_accepted_at', 'terms_version', 'privacy_accepted_at', 'privacy_version');
```

## Para publikimit

- Verifiko qe `/terms` dhe `/privacy` hapen ne domain-in final.
- Verifiko qe `VITE_SITE_URL` dhe `EXPO_PUBLIC_SITE_URL` tregojne domain-in final.
- Testo me user te ri.
- Testo qe user-i i pranuar nuk pyetet prape.
- Testo qe version i ri e shfaq modalin prape.
