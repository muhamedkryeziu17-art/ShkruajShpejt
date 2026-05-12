# Real Device QA

Run this on one Android phone and one iPhone before TestFlight or Google Play Internal Testing.

| Test | Status | Expected result | Notes |
| --- | --- | --- | --- |
| Android login | NOT TESTED | `Kycu me Google` opens browser, returns to app, and Profile shows user. | |
| iOS login | NOT TESTED | `Kycu me Google` opens browser, returns to app, and Profile shows user. | |
| Guest mode | NOT TESTED | `Vazhdo si mysafir` enters app and progress is not saved permanently. | |
| Typing test start | NOT TESTED | Test screen opens, input focuses, text is readable on small screen. | |
| Timer start | NOT TESTED | Timer starts only after the first typed character. | |
| Live metrics | NOT TESTED | WPM, Saktesia, Koha, and Gabime update while typing. | |
| Result screen | NOT TESTED | Result screen shows WPM, WPM bruto, Saktesia, Gabime, Koha, and weak keys. | |
| Save result | NOT TESTED | Logged-in user result saves and appears in stats/recent tests. | |
| Guest save message | NOT TESTED | Guest sees `Kycu per te ruajtur progresin`. | |
| Stats refresh | NOT TESTED | Stats update after a saved test without false demo data. | |
| Lessons list | NOT TESTED | `Mesimet` shows lessons, progress, and locked/completed states. | |
| Lesson detail | NOT TESTED | Lesson can be completed and progress saves for logged-in user. | |
| Weak keys | NOT TESTED | `Tastet e Dobeta` shows real weak keys or a clear empty state. | |
| Weak key drill | NOT TESTED | Custom practice opens and tracks mistakes. | |
| Bigrams | NOT TESTED | `Cifte Shkronjash` drill works and tracks speed/errors. | |
| Dark mode | NOT TESTED | Dark mode has strong contrast and no unreadable text. | |
| Light mode | NOT TESTED | Light mode has strong contrast and no unreadable text. | |
| Logout | NOT TESTED | `Dil nga llogaria` clears session and returns to login/guest state. | |
| Offline state | NOT TESTED | App shows clear error states and does not crash. | |
| App restart | NOT TESTED | Logged-in session persists after closing and reopening the app. | |
| Reduced motion | NOT TESTED | Motion is reduced when setting is enabled. | |
| Small screen layout | NOT TESTED | No clipped buttons, hidden text, or overlapping cards on small phones. | |
| Haptics off | NOT TESTED | No haptic feedback when `Dridhje` is disabled. | |
| Legal links | NOT TESTED | Privacy and Terms links open real public URLs. | |
