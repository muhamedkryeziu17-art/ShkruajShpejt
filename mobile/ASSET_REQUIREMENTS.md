# Asset Requirements

## Current Files

Current files exist:

- `assets/icon.png`: 1254 x 1254 PNG.
- `assets/adaptive-icon.png`: 1254 x 1254 PNG.
- `assets/splash.png`: 1254 x 1254 PNG.

These are based on the provided keyboard/speed logo. They are not empty placeholders, but they have not been reviewed in App Store Connect, Google Play Console, or on real devices. The same square image is used for icon, adaptive icon, and splash, so final visual QA is still required.

## Icon Requirements

- iOS App Store icon: 1024 x 1024 PNG, no alpha, no rounded corners baked into the image.
- Google Play high-res icon: 512 x 512 PNG.
- Expo app icon can be a larger square PNG and will be resized, but final exports must be checked visually.
- Keep the logo centered with enough padding so it is not cropped by iOS masks or Android launchers.

## Android Adaptive Icon Notes

- Use a foreground image with safe padding.
- Keep important artwork near the center.
- Background color is currently `#07111f`.
- Test on round, square, squircle, and themed launcher icon masks.

## Splash Requirements

- Splash should be simple, centered, and readable on dark background.
- Current splash uses the logo with `resizeMode: contain`.
- Test launch on small Android, large Android, iPhone, and iPad.
- If the image feels too detailed at launch size, create a simpler splash mark.

## Screenshot Requirements

Create screenshots after production data and auth work:

- Login.
- Home dashboard.
- Typing test in progress.
- Result screen.
- Lessons.
- Weak keys.
- Bigrams.
- Stats.
- Settings in dark mode.
- Settings or dashboard in light mode.

Apple may require iPhone and iPad screenshots because `supportsTablet` is true. Google Play requires phone screenshots and a feature graphic, commonly 1024 x 500.

## Recommended Final Style

- Keep the neon keyboard logo.
- Use a clean dark navy background.
- Avoid tiny text inside the icon.
- Avoid too much glow near the edge because masks may crop it.
- Use a simpler centered mark for splash if the current image feels busy on device.
