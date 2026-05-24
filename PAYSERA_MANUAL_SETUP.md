# Paysera Manual Setup

Ky setup aktivizon pagesa manuale me Paysera ose banke. Nuk e terheq parane automatikisht nga app-i. User-i paguan, dergon konfirmim, pastaj admini aktivizon Pro ne Supabase.

## Si punon

1. User hap faqen `Cmimet`.
2. User zgjedh `Pro Mujor`, `Pro Vjetor`, ose `Lifetime`.
3. App-i shfaq shumen, perfituesin, Paysera email/IBAN dhe referencen.
4. User paguan ne Paysera ose banke.
5. User dergon screenshot/konfirmim ne support email.
6. Admini kontrollon pagesen.
7. Admini aktivizon planin ne `public.subscriptions`.

## Vercel env per frontend

Vendosi keto ne Vercel te projekti i frontend-it:

```text
VITE_PAYMENT_PROVIDER=paysera_manual
VITE_ENABLE_PAYMENTS=false
VITE_MANUAL_PAYMENT_PAYEE_NAME=EMRI_YT_OSE_BIZNESI
VITE_MANUAL_PAYMENT_PAYSERA_EMAIL=EMAILI_YT_PAYSERA
VITE_MANUAL_PAYMENT_IBAN=IBAN_I_PAYSERA_OSE_BANKES
VITE_MANUAL_PAYMENT_BANK_NAME=Paysera
VITE_SUPPORT_EMAIL=shkruajshpejt@gmail.com
```

`VITE_ENABLE_PAYMENTS=false` eshte ne rregull per kete flow, sepse pagesa manuale shfaqet nga `VITE_PAYMENT_PROVIDER=paysera_manual`.

## Render env per backend

Backend duhet te mbetet me databaze dhe auth funksionale:

```text
PAYMENT_PROVIDER=manual
BILLING_ADMIN_TOKEN=VENDOS_TOKEN_TE_GJATE_RANDOM
DATABASE_URL=...
SUPABASE_URL=...
SUPABASE_JWT_SECRET=...
CORS_ALLOWED_ORIGINS=https://DOMAINI_YT.vercel.app
FRONTEND_SITE_URL=https://DOMAINI_YT.vercel.app
```

Mos vendos `DATABASE_URL`, `SUPABASE_JWT_SECRET`, ose `BILLING_ADMIN_TOKEN` ne frontend/Vercel.

## Aktivizim manual ne Supabase

Pasi pagesa verifikohet, hape Supabase SQL Editor dhe perdor:

```sql
with target_user as (
  select id
  from public.profiles
  where lower(email) = lower('EMAILI_I_USERIT')
),
updated as (
  update public.subscriptions s
  set
    provider = 'paysera_manual',
    plan = 'lifetime',
    status = 'active',
    current_period_start = now(),
    current_period_end = null,
    cancel_at_period_end = false,
    lifetime = true,
    updated_at = now()
  from target_user u
  where s.user_id = u.id
    and s.provider in ('manual', 'paysera_manual')
    and s.provider_subscription_id is null
  returning s.id
)
insert into public.subscriptions (
  user_id, provider, plan, status,
  current_period_start, current_period_end,
  cancel_at_period_end, lifetime
)
select
  id, 'paysera_manual', 'lifetime', 'active',
  now(), null, false, true
from target_user
where not exists (select 1 from updated);
```

Per `Pro Vjetor`, ndrysho:

```sql
plan = 'pro_yearly'
current_period_end = now() + interval '1 year'
lifetime = false
```

Per `Pro Mujor`, ndrysho:

```sql
plan = 'pro_monthly'
current_period_end = now() + interval '1 month'
lifetime = false
```

## Kontroll pas aktivizimit

Ekzekuto:

```sql
select p.email, s.provider, s.plan, s.status, s.lifetime, s.current_period_end
from public.profiles p
join public.subscriptions s on s.user_id = p.id
where lower(p.email) = lower('EMAILI_I_USERIT');
```

Pastaj user-i duhet:

1. Te dale nga llogaria.
2. Te kyqet prape.
3. Te hape `Pagesat`.
4. Te klikoj `Rifresko`.

## Kufizime

- Nuk ka aktivizim automatik.
- Nuk ka refund automatik.
- Nuk ka abonim mujor automatik.
- Admini duhet te kontrolloj pagesen manualisht.
- Per launch publik duhen terma, refund policy dhe support email real.
