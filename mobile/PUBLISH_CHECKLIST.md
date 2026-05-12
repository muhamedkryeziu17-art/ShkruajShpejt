# Publish Checklist

Strict status: NOT READY FOR PUBLIC STORE SUBMISSION until every blocking item is complete.

## App Identity

- [x] App name set: ShkruajShpejt
- [x] Android package set: com.muki.shkruajshpejt
- [x] iOS bundle ID set: com.muki.shkruajshpejt
- [x] App scheme set: shkruajshpejt
- [ ] EAS project ID set through `EAS_PROJECT_ID`
- [ ] App Store Connect app record created
- [ ] Google Play Console app record created

## Assets

- [x] App icon file exists
- [x] Adaptive icon file exists
- [x] Splash image file exists
- [ ] Icon reviewed at Apple and Google production sizes
- [ ] Store screenshots created for required phone sizes
- [ ] Feature graphic created for Google Play

## Auth And Backend

- [x] Supabase URL env variable documented
- [x] Supabase anon key env variable documented
- [x] API base URL env variable documented
- [x] SecureStore session storage implemented
- [x] Guest mode implemented
- [x] Google OAuth flow implemented with deep link
- [ ] Supabase redirect URL added: shkruajshpejt://**
- [ ] Google iOS OAuth client created
- [ ] Google Android OAuth client created
- [ ] Real device Google login tested
- [ ] Real device result save tested
- [ ] Production API URL deployed over HTTPS

## Legal And Privacy

- [ ] Privacy Policy URL replaced with real public URL
- [ ] Terms URL replaced with real public URL
- [ ] Privacy policy includes developer contact
- [ ] Privacy policy describes Supabase, Google OAuth, profile data, usage stats, retention, deletion
- [ ] In-app privacy link points to real URL
- [ ] App Store privacy details completed
- [ ] Google Play Data safety form completed
- [ ] Account deletion or data deletion process documented

## Store Metadata

- [ ] App subtitle or short description prepared
- [ ] Full description prepared
- [ ] Keywords prepared
- [ ] Support URL prepared
- [ ] Marketing URL optional
- [ ] Age rating completed
- [ ] Content rating completed
- [ ] Review notes prepared
- [ ] Demo login or guest flow explained for reviewers

## Builds

- [x] EAS development profile exists
- [x] EAS preview profile exists
- [x] EAS production profile exists
- [x] Android production build outputs AAB
- [x] iOS production build profile exists
- [ ] Android production AAB build completed in EAS
- [ ] iOS production build completed in EAS
- [ ] TestFlight install tested
- [ ] Google Play internal testing install tested

## Quality

- [x] TypeScript check passes
- [x] Expo Doctor passes
- [x] Expo dependency check passes
- [x] npm audit returns 0 vulnerabilities at moderate level
- [x] iOS bundle export passes
- [x] Android bundle export passes
- [x] No special Albanian letters found in mobile source files
- [x] No service role key or database secret found in mobile source files
- [ ] Manual QA on iPhone
- [ ] Manual QA on Android phone
- [ ] Accessibility pass on small phone
- [ ] Dark and light mode verified on device
- [ ] Offline and poor network states verified on device
- [ ] Crash-free launch verified on device

## Known Blockers

- EAS project ID is not confirmed until `EAS_PROJECT_ID` is set locally and in EAS.
- Privacy and terms URLs still point to `https://YOUR_DOMAIN.com/...`.
- Store screenshots and metadata are missing.
- Production Google OAuth mobile credentials are not confirmed.
- Supabase mobile redirect URLs are not confirmed.
- Production backend URL is not confirmed.
- No real TestFlight or Google Play internal testing build has been produced yet.

## Added Release Docs

- [x] `AUTH_SETUP.md`
- [x] `API_TESTING.md`
- [x] `REAL_DEVICE_QA.md`
- [x] `STORE_LISTING_DRAFT.md`
- [x] `PRIVACY_AND_DATA_SAFETY_DRAFT.md`
- [x] `ASSET_REQUIREMENTS.md`
