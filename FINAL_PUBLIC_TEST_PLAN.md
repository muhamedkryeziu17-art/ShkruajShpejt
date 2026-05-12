# Final Public Test Plan

Run this after backend and frontend are deployed.

## Public Website

- [ ] Public landing page opens at `https://shkruajshpejt.vercel.app`.
- [ ] `/login` opens.
- [ ] `/privacy` opens.
- [ ] `/terms` opens.
- [ ] `/refund` opens.
- [ ] `/contact` opens.
- [ ] `/delete-account` opens.
- [ ] Mobile browser layout works on a real phone.
- [ ] Browser console has no errors.
- [ ] Network tab has no failed API calls.
- [ ] No API calls go to localhost.

## Guest Mode

- [ ] Start a typing test without login.
- [ ] Timer starts only after first typed character.
- [ ] Result screen opens.
- [ ] Guest result is not saved permanently.
- [ ] Guest can return to landing/test pages.

## Google Auth

- [ ] Click `Kycu me Google`.
- [ ] Google login completes.
- [ ] User returns to `/dashboard`.
- [ ] Profile sync completes.
- [ ] Refresh page keeps session active.
- [ ] Logout works.
- [ ] Logged-out user cannot call protected API endpoints.

## Typing And Stats

- [ ] Start typing test.
- [ ] Finish test.
- [ ] Save result.
- [ ] Dashboard updates.
- [ ] `/stats` loads saved result.
- [ ] `/api/tests` returns only current user tests.
- [ ] `/api/stats/summary` returns current user stats.
- [ ] `/api/stats/progress` returns current user progress.

## Lessons

- [ ] `/lessons` loads.
- [ ] Lesson detail opens.
- [ ] Complete a lesson attempt.
- [ ] Progress saves for logged-in user.
- [ ] Guest can view lessons but permanent progress requires login.

## Weak Keys

- [ ] `/weak-keys` loads for logged-in Pro/manual test user or shows paywall if gated.
- [ ] Weak keys endpoint returns only current user data.
- [ ] Practice text generation works.

## Backend Health

- [ ] `https://YOUR-BACKEND-URL/api/health` returns 200.
- [ ] Response `status` is `ok`.
- [ ] `databaseReachable` is true.
- [ ] `supabaseConfigured` is true.

## RLS And User Isolation

- [ ] User A saves a typing test.
- [ ] User B logs in and cannot see User A test.
- [ ] User B saves a typing test.
- [ ] User A logs back in and cannot see User B test.
- [ ] Supabase SQL confirms rows are separated by `user_id`.
- [ ] `payment_events` cannot be read by anon/authenticated frontend clients.

## Final Launch Gate

Public launch is allowed only if every required test above passes.
