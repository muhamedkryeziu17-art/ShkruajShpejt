# Production API Testing

Use this checklist before TestFlight and Google Play Internal Testing.

## Set Production API URL

Set `EXPO_PUBLIC_API_BASE_URL` to the deployed HTTPS backend origin.

Local `.env`:

```text
EXPO_PUBLIC_API_BASE_URL=https://api.YOUR_DOMAIN.com
```

EAS production environment:

```bash
cd mobile
npx eas-cli@latest env:create --name EXPO_PUBLIC_API_BASE_URL --value https://api.YOUR_DOMAIN.com --environment production --visibility plaintext
```

Do not use a loopback or private computer address for store builds.

## Test Health

PowerShell:

```powershell
$env:API_BASE_URL = "https://api.YOUR_DOMAIN.com"
curl.exe "$env:API_BASE_URL/api/health"
```

Expected result:

- HTTP 200.
- API returns health JSON.
- Database/readiness should be healthy if backend supports that check.

## Test Authenticated Endpoints

Get a real Supabase user access token from a signed-in test user. Do not commit or share this token.

PowerShell:

```powershell
$env:API_BASE_URL = "https://api.YOUR_DOMAIN.com"
$env:ACCESS_TOKEN = "PASTE_ACCESS_TOKEN"
curl.exe -H "Authorization: Bearer $env:ACCESS_TOKEN" "$env:API_BASE_URL/api/me"
curl.exe -H "Authorization: Bearer $env:ACCESS_TOKEN" "$env:API_BASE_URL/api/stats/summary"
curl.exe -H "Authorization: Bearer $env:ACCESS_TOKEN" "$env:API_BASE_URL/api/tests"
```

Expected result:

- `/api/me` returns the signed-in profile.
- `/api/stats/summary` returns dashboard numbers or empty stats.
- `/api/tests` returns test history or an empty list.

## Test Saving Typing Results

PowerShell:

```powershell
$body = @{
  modeSeconds = 30
  elapsedSeconds = 30
  difficulty = "Lehte"
  category = "Fjale te zakonshme"
  wpm = 24
  rawWpm = 26
  accuracy = 92
  correctChars = 60
  incorrectChars = 5
  totalChars = 65
  errors = @{ a = 2; s = 3 }
  speedTimeline = @(@{ second = 5; wpm = 20 }, @{ second = 30; wpm = 24 })
  keyStats = @(@{ key = "a"; correct = 12; incorrect = 2 })
} | ConvertTo-Json -Depth 6

curl.exe -X POST "$env:API_BASE_URL/api/tests" `
  -H "Authorization: Bearer $env:ACCESS_TOKEN" `
  -H "Content-Type: application/json" `
  --data $body
```

Expected result:

- HTTP 200 or 201.
- Response contains a saved result ID.
- Supabase table `typing_tests` has the new row for that user.
- `key_stats` and `daily_stats` update if backend supports them.

## Test From Mobile

1. Install development or preview build on a real phone.
2. Sign in with Google.
3. Start `Test i Shpejte`.
4. Finish the test.
5. Confirm result saves automatically or after `Ruaj Rezultatin`.
6. Open `Statistikat`.
7. Confirm WPM, Saktesia, and recent test data refresh.

## Expected Errors And Fixes

- HTTP 0 or network failure: production API URL is wrong, blocked, or not HTTPS.
- HTTP 401: Supabase JWT validation on backend is not configured for the same project.
- HTTP 403: RLS or backend authorization rejects the user.
- HTTP 500: backend database connection, migrations, or server env is wrong.
- Empty stats after save: result was not saved, daily stats update failed, or frontend cached old data.
