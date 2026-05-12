# Mobile Auth Setup

This app uses Supabase Auth with Google OAuth through the system browser and the custom app scheme `shkruajshpejt`.

## App Identity

- App name: ShkruajShpejt
- Scheme: `shkruajshpejt`
- Redirect URL used by the app: `shkruajshpejt://auth/callback`
- Supabase redirect allow-list entry required: `shkruajshpejt://**`
- Android package: `com.muki.shkruajshpejt`
- iOS bundle ID: `com.muki.shkruajshpejt`

## Supabase Google Provider

1. Open Supabase Dashboard.
2. Go to Authentication > Providers > Google.
3. Enable Google.
4. In Google Cloud Console, create a Web OAuth client for Supabase hosted auth.
5. Add this Google redirect URI to the Web OAuth client:

```text
https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback
```

6. Copy the Web OAuth Client ID and Client Secret into Supabase Google provider settings.
7. Save the provider.

The Client Secret stays in Supabase. It must never be placed in the mobile app.

## Supabase Redirect URLs

In Supabase Dashboard, go to Authentication > URL Configuration.

Add:

```text
shkruajshpejt://**
```

Keep the deployed web app redirect URLs too if the web app is live.

Supabase docs:

- https://supabase.com/docs/guides/auth/redirect-urls
- https://supabase.com/docs/guides/auth/native-mobile-deep-linking

## Android OAuth Credential

Create this for the production Android identity:

1. Open Google Cloud Console > APIs and Services > Credentials.
2. Create OAuth Client ID.
3. Choose Android.
4. Package name: `com.muki.shkruajshpejt`
5. Add SHA-1 certificate fingerprint.
6. For EAS builds, get the upload certificate fingerprint with:

```bash
cd mobile
npx eas-cli@latest credentials -p android
```

7. If Google Play App Signing is enabled, also add the Play App Signing SHA-1 from Play Console.

Current code does not put this client ID in the app. It is documented so the Google project is production-ready and can support native Google sign-in later.

## iOS OAuth Credential

Create this for the production iOS identity:

1. Open Google Cloud Console > APIs and Services > Credentials.
2. Create OAuth Client ID.
3. Choose iOS.
4. Bundle ID: `com.muki.shkruajshpejt`
5. Add Apple Team ID if Google asks for it.
6. Add App Store ID after the App Store Connect app record exists.

Current code uses Supabase hosted OAuth, so no iOS client secret is stored in the app.

## Deep Link Testing

Use a development build or store build. Do not use Expo Go for final auth testing.

1. Build a development app:

```bash
cd mobile
npx eas-cli@latest build --platform android --profile development
npx eas-cli@latest build --platform ios --profile development
```

2. Install on device.
3. Set `.env` values or pull EAS environment values.
4. Open the app and tap `Kycu me Google`.
5. Confirm the browser returns to the app.
6. Confirm Profile shows the logged-in user.
7. Restart the app and confirm the session remains.

## Troubleshooting

- `Unsupported provider`: Google provider is not enabled in Supabase.
- `redirect_uri_mismatch`: Google Web OAuth redirect URI does not match the Supabase callback URL.
- Browser does not return to app: add `shkruajshpejt://**` in Supabase redirect URLs and test with a development build.
- User logs in but API returns 401: backend JWT validation or production API env is wrong.
- Session disappears after restart: verify SecureStore works on the build and that Supabase env values are correct.
- Google shows blocked app: complete OAuth consent screen, add test users while in testing mode, and publish consent screen before public release.
