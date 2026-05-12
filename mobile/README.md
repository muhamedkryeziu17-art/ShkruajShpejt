# ShkruajShpejt Mobile

Expo React Native mobile app for the Albanian typing trainer.

## Stack

- Expo SDK 55
- React Native
- TypeScript
- Expo Router
- Supabase Auth with Google OAuth
- Expo SecureStore for session storage
- React Native Reanimated
- EAS Build

## Local Setup

```bash
cd mobile
npm install
copy .env.example .env
```

Fill `.env` with public mobile values:

```text
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_API_BASE_URL=
EXPO_PUBLIC_SITE_URL=https://YOUR_DOMAIN.com
EAS_PROJECT_ID=
```

For a physical phone or store build, `EXPO_PUBLIC_API_BASE_URL` must be a deployed HTTPS backend origin.

## EAS Project ID

Run:

```bash
cd mobile
npx eas-cli@latest login
npx eas-cli@latest init
```

Copy the generated project UUID from Expo and set it as `EAS_PROJECT_ID` in local `.env` and in EAS environment variables. The app config reads this value from `mobile/app.config.ts`.

## Run

```bash
npx expo start
```

Use a development build for final Google login testing because the app uses the custom scheme `shkruajshpejt`.

## Required Setup Docs

- `AUTH_SETUP.md` - Supabase and Google OAuth setup.
- `API_TESTING.md` - production API and save-result checks.
- `REAL_DEVICE_QA.md` - Android and iOS QA cases.
- `STORE_LISTING_DRAFT.md` - store text draft.
- `PRIVACY_AND_DATA_SAFETY_DRAFT.md` - draft privacy answers.
- `ASSET_REQUIREMENTS.md` - icon, splash, and screenshot requirements.

## Build

Development:

```bash
npx eas-cli@latest build --platform android --profile development
npx eas-cli@latest build --platform ios --profile development
```

Production:

```bash
npx eas-cli@latest build --platform android --profile production
npx eas-cli@latest build --platform ios --profile production
```

Submit:

```bash
npx eas-cli@latest submit --platform android --profile production
npx eas-cli@latest submit --platform ios --profile production
```

## Checks

```bash
npm install
npm run typecheck
npx expo-doctor
npx expo install --check
npx expo export --platform ios --output-dir dist-ios
npx expo export --platform android --output-dir dist-android
```

## Current Limitations

- Legal URLs still use `https://YOUR_DOMAIN.com/...` until `EXPO_PUBLIC_SITE_URL` is replaced.
- `EAS_PROJECT_ID` must be set after `npx eas-cli@latest init`.
- Production Google OAuth mobile credentials must be confirmed.
- Supabase mobile redirect URL must be confirmed.
- Real device auth and API save flows must be tested before TestFlight or Play Internal Testing.
