# Monetization Setup

ShkruajShpejt now has a freemium + Pro billing layer. Payments are intentionally disabled until a real provider is configured and tested.

## Recommended Provider Order

1. Paddle - recommended first for global SaaS because it can act as merchant of record and supports checkout, subscriptions, taxes, and webhooks.
2. Lemon Squeezy - second option with simple hosted checkout and webhooks.
3. Manual activation - fallback for bank transfer, school deals, or early Pro users.

Do not put payment secrets in the frontend.

## Plans

| Plan | Price | Notes |
| --- | --- | --- |
| Free | 0 EUR | Basic typing tests, limited lessons, basic stats, guest mode |
| Pro Monthly | 3.99 EUR/month | Self-serve checkout |
| Pro Yearly | 24.99 EUR/year | Self-serve checkout |
| Lifetime | 49.99 EUR one-time | Self-serve checkout |
| Basic School | 99 EUR/year | Contact sales |
| Pro School | 199 EUR/year | Contact sales |
| Custom School | 299 EUR+/year | Contact sales |

## Backend Env

Set these only on the backend host:

```text
PAYMENT_PROVIDER=paddle
PAYMENT_WEBHOOK_SECRET=
BILLING_ADMIN_TOKEN=
PADDLE_API_KEY=
PADDLE_WEBHOOK_SECRET=
PADDLE_PRICE_PRO_MONTHLY=
PADDLE_PRICE_PRO_YEARLY=
PADDLE_PRICE_LIFETIME=
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_WEBHOOK_SECRET=
LEMONSQUEEZY_VARIANT_PRO_MONTHLY=
LEMONSQUEEZY_VARIANT_PRO_YEARLY=
LEMONSQUEEZY_VARIANT_LIFETIME=
```

`PAYMENT_PROVIDER` accepts:

```text
paddle
lemonsqueezy
manual
```

## Frontend Env

```text
VITE_ENABLE_PAYMENTS=true
VITE_PAYMENT_PROVIDER=paddle
VITE_SITE_URL=https://YOUR_DOMAIN.com
VITE_API_BASE_URL=https://YOUR_BACKEND_URL.com
```

Keep `VITE_ENABLE_PAYMENTS=false` until checkout and webhooks have been tested.

## Database Setup

Run these files in Supabase SQL editor:

```text
database/schema.sql
database/rls-policies.sql
```

New tables:

- `subscriptions`
- `payment_events`

Users can read only their own subscription status through RLS. Webhook writes must happen only through the backend.

## Paddle Setup

1. Create a Paddle account.
2. Create products/prices:
   - Pro Monthly: 3.99 EUR/month
   - Pro Yearly: 24.99 EUR/year
   - Lifetime: 49.99 EUR one-time
3. Copy price IDs into:
   - `PADDLE_PRICE_PRO_MONTHLY`
   - `PADDLE_PRICE_PRO_YEARLY`
   - `PADDLE_PRICE_LIFETIME`
4. Create an API key and set `PADDLE_API_KEY`.
5. Create webhook destination:

```text
https://YOUR_BACKEND_URL.com/api/billing/webhook
```

6. Copy the webhook secret into `PADDLE_WEBHOOK_SECRET`.
7. Enable relevant subscription/transaction events.
8. Set frontend `VITE_ENABLE_PAYMENTS=true` only after sandbox checkout works.

Paddle docs:

- https://developer.paddle.com/api-reference/transactions/create-transaction
- https://developer.paddle.com/webhooks/signature-verification

## Lemon Squeezy Setup

1. Create a Lemon Squeezy store.
2. Create variants for Pro Monthly, Pro Yearly, and Lifetime.
3. Copy store ID and variant IDs into backend env.
4. Create an API key and set `LEMONSQUEEZY_API_KEY`.
5. Create webhook:

```text
https://YOUR_BACKEND_URL.com/api/billing/webhook
```

6. Copy signing secret into `LEMONSQUEEZY_WEBHOOK_SECRET`.
7. Enable subscription and order events.

Lemon Squeezy docs:

- https://docs.lemonsqueezy.com/api
- https://docs.lemonsqueezy.com/help/webhooks

## Manual Activation

Manual activation is for early users, bank transfer, and school deals.

Set backend env:

```text
BILLING_ADMIN_TOKEN=long-random-secret
```

Call:

```bash
curl -X POST https://YOUR_BACKEND_URL.com/api/billing/manual-activate \
  -H "Content-Type: application/json" \
  -H "X-Billing-Admin-Token: YOUR_ADMIN_TOKEN" \
  --data "{\"userId\":\"USER_UUID\",\"plan\":\"pro_yearly\",\"status\":\"active\",\"lifetime\":false}"
```

For lifetime:

```json
{
  "userId": "USER_UUID",
  "plan": "lifetime",
  "status": "active",
  "lifetime": true
}
```

## Test Checkout

1. Sign in with Google.
2. Open `/pricing`.
3. Click a Pro plan.
4. Complete sandbox checkout.
5. Confirm provider redirects to `/settings/billing`.
6. Confirm webhook writes a row in `payment_events`.
7. Confirm `subscriptions` has the user and active plan.
8. Refresh `/settings/billing`.
9. Confirm Pro gates unlock.

## Test Feature Gates

Free users should see paywall on:

- `/weak-keys`
- `/bigrams`
- advanced charts in `/stats`
- lessons after the first few free lessons

Pro users should see those pages without paywall.

## Security Checklist

- [ ] No payment secrets in frontend.
- [ ] No service role key in frontend.
- [ ] No database URL in frontend.
- [ ] Webhook signature verification configured.
- [ ] Backend validates auth before checkout.
- [ ] Users can only read their own subscription.
- [ ] Webhook endpoint stores provider events.
- [ ] Manual activation token is long and private.

## Still Manual

- Create provider account.
- Create products/prices.
- Add env vars.
- Add webhook URL.
- Test sandbox checkout.
- Test webhook activation.
- Review legal pages after provider choice.
