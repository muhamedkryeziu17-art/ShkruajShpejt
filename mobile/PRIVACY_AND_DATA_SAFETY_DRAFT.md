# Privacy And Data Safety Draft

This is a draft for store forms and privacy policy planning. It is not legal advice. Review it before submission and make it match the final production app exactly.

Official references:

- Apple App Privacy: https://developer.apple.com/app-store/app-privacy-details/
- Apple App Store Connect Privacy: https://developer.apple.com/help/app-store-connect/reference/app-privacy
- Google Play Data Safety: https://support.google.com/googleplay/android-developer/answer/10787469

## Current Data Collected

| Data type | Collected | Linked to user | Purpose | Notes |
| --- | --- | --- | --- | --- |
| Email address | Yes, after Google login | Yes | Account, login, progress sync | Comes from Supabase Auth / Google. |
| Name | Yes, after Google login if provided | Yes | Profile display | Comes from Google profile. |
| Avatar URL | Yes, after Google login if provided | Yes | Profile display | Comes from Google profile. |
| User ID | Yes | Yes | Account and database ownership | Supabase Auth user ID. |
| Typing results | Yes for logged-in users | Yes | App functionality, progress tracking | WPM, raw WPM, accuracy, errors, duration. |
| Lesson progress | Yes for logged-in users | Yes | App functionality | Best WPM, best accuracy, attempts, completion. |
| Key stats | Yes for logged-in users | Yes | App functionality | Correct/error counts per key. |
| Daily stats | Yes for logged-in users | Yes | App functionality | Practice time, tests completed, averages. |
| Guest practice data | Local/session only | No account link | App functionality | Should not be saved permanently. |

## Not Collected Today

- Payment data.
- Subscription data.
- Precise location.
- Contacts.
- Photos or videos.
- Microphone audio.
- Advertising ID.
- Third-party advertising data.

If payments, subscriptions, analytics, crash reporting, ads, or RevenueCat are added later, update this document and both store forms before release.

## Third Parties

- Supabase: authentication, database, profile and progress storage.
- Google Auth: Google login and basic profile data.
- Apple and Google stores: distribution, review, and possible purchase handling if payments are added later.

## Security Draft Answers

- Data is encrypted in transit: Yes, use HTTPS for Supabase and the production API.
- Data deletion request: Must be supported through a public support or privacy URL before public release.
- User can use guest mode: Yes, guest progress is not permanently saved.
- Service role keys in mobile: No. Mobile must only use public Supabase anon key.
- Backend database credentials in mobile: No.

## Apple Privacy Draft

Likely data categories to declare:

- Contact Info: email address, name.
- User Content or Other Data: typing results and lesson/progress data if Apple classifies it there.
- Identifiers: user ID.
- Usage Data: app progress and interaction data if used for progress/statistics.

Declare data as linked to the user for logged-in accounts.

## Google Play Data Safety Draft

Likely disclosures:

- Personal info: email address and name.
- App activity: app interactions/progress if Google classifies typing progress as activity.
- User-generated or app-generated content: typing results/progress if applicable.
- Data is encrypted in transit: Yes.
- Data deletion request available: Must be Yes only after a real deletion process exists.

## Required Before Submission

- Publish `https://YOUR_DOMAIN.com/privacy`.
- Publish `https://YOUR_DOMAIN.com/terms`.
- Add developer contact email.
- Add data deletion request instructions.
- Verify Supabase retention and deletion behavior.
- Confirm whether crash diagnostics or analytics are added.
