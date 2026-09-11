# Coaching Journey — Canonical Project Specification

> This file is the canonical product specification for the Coaching Journey web app. When chat history conflicts with this file, verify the latest deployed code before making changes.

## 1. Product purpose

Coaching Journey is a mobile-first personal tracker for people working toward ICF ACC coaching-hour requirements. The same public web app can be shared with classmates; each person uses their own browser/device-local data.

- Live URL: https://carriehw.github.io/carrie-coaching-tracker/
- Current deployed product generation: v25 bilingual / visual-polish build
- Primary platform: iPhone Safari / Add to Home Screen
- Secondary platform: modern mobile browsers
- Architecture: static GitHub Pages PWA, no cloud account system

## 2. Non-negotiable product principles

1. Do not remove existing features, fields, information dimensions, or record metadata merely to simplify the visual design.
2. Keep the app simple, calm, and easy to use. Do not turn it into a CRM, dashboard-heavy system, or feature-dense productivity suite.
3. Visual and motion upgrades must not break the proven Coaching flow.
4. Mobile/iPhone UX is the priority. Every release must be checked for Safari layout, safe-area, scroll, touch target, and cache/PWA behavior.
5. Traditional Chinese and English are first-class UI languages. Switching to English should not leave system UI text in Chinese.
6. User-entered content such as Coachee names, topics, feedback, and reflections must not be auto-translated.

## 3. ACC tracking logic

### Targets

- Total Coaching hours target: **100**
- Paid / exchange hours target: **75**
- Recorded identifiable Coachees reference target: **8**
- Detailed dated Coaching hours in recent 18 months reference target: **25**

### Opening progress

On first use, the user enters:

- Name
- Current total Coaching hours already completed
- Of those hours, current paid / exchange hours
- Private 4–6 digit PIN

Opening hours are the baseline and must not be reconstructed automatically from later records.

### New Coaching records

For a new Coaching appointment completed after using the app:

- Actual duration adds to total Coaching hours.
- Paid / exchange sessions add to both total and paid / exchange hours.
- Free sessions add to total only.

### Past record reconstruction

Past records are for Coaching already included in opening totals.

Required invariant:

- `origin: 'past'`
- `countTowardsTotals: false`
- Saving, editing, or deleting a past record must **never** add to or subtract from the opening total / paid baseline.

UI must clearly communicate:

> This is adding historical details, not adding new hours.

Users are not required to reconstruct every historic session.

## 4. Main user flows

### First-use onboarding / lock

- Enter name
- Enter opening total hours
- Enter opening paid / exchange hours
- Create private PIN
- Returning users unlock with PIN
- Old users missing a stored name may add the name without wiping data

PIN is a UI lock, not encryption.

### Home

Must retain:

- Greeting with user name
- ICF ACC journey hero
- Total / 100 progress
- Paid / exchange / 75 progress
- Remaining-hour messaging
- Motivational message
- Free hours
- Upcoming appointment count
- Recorded Coachee count
- Add Coaching Appointment CTA
- Add Past Coaching Record CTA
- Upcoming appointment cards

### Add Coaching Appointment

Retain all fields:

- Coachee name
- Contact phone (optional)
- Role / occupation
- Date
- Start time
- Expected duration
- Online / in-person
- Online meeting link
- In-person location
- Expected Coaching topic (optional)

After save:

- Appointment summary
- Apple Calendar `.ics`
- Booking message preview
- Share booking message
- Copy booking message
- Edit appointment
- Cancel appointment

### Booking message

Traditional Chinese booking message is intentionally warm and conversational. It includes:

- Name
- Date
- Time and approximate duration
- Meeting format
- Location / link
- Short explanation of Coaching as an exploration process
- Confidentiality / safe-space reminder

English mode may use an English system UI while preserving user-authored content. Any English booking-message treatment must be deliberately designed; do not machine-translate user-entered names/topics.

### Complete Coaching

Retain all fields:

- Actual duration
- Coaching topic
- Paid / exchange vs free
- Payment / exchange method
- Optional payment note
- Recording / video / none
- Consent
- Coachee feedback
- Personal reflection

Payment / exchange methods currently include:

- Peer / mutual Coaching exchange
- Cash / FPS
- Coffee
- Meal
- Other goods / service exchange

Completing a new record updates totals dynamically.

### Past Coaching Record

Retain:

- Name
- Phone
- Role / occupation
- Date
- Start time optional
- Actual duration
- Format
- Location / meeting link
- Topic
- Historical hour category
- Payment / exchange method
- Recording metadata
- Consent
- Feedback
- Reflection

Saving must not change total hours.

### Records

Tabs:

- Upcoming
- Completed
- Past Records

Must support:

- Open record detail
- Edit completed record
- Delete completed record
- Edit past record
- Delete past record
- Edit upcoming appointment
- Cancel upcoming appointment

For completed NEW records, editing actual duration or paid status must recalculate totals.

### ACC Progress / Statistics

Retain:

- Total hours / 100
- Paid / exchange hours / 75
- Free hours
- Completed sessions
- Recorded Coachees
- App-added hours
- Past-record count
- Historical reconstruction progress
- Recorded Coachees / 8
- Detailed dated hours in recent 18 months / 25

Important wording rule:

The app must not falsely claim complete ACC eligibility because opening lump-sum hours do not contain complete client identities and dates.

### Settings

Retain:

- Language control: Traditional Chinese / English
- User name
- Opening total hours
- Opening paid / exchange hours
- Explanation that opening progress is pre-app progress
- Save settings
- Data backup section
- Last backup date
- Export JSON backup
- Import JSON backup
- Local-only privacy note
- Lock app

## 5. Language / i18n rules

Supported UI languages:

- Traditional Chinese (`zh-Hant`)
- English (`en`)

Language preference is stored locally and should persist between sessions.

### English QA requirement

When English is selected, all system-generated UI text must be English across:

- Home
- Appointment forms
- Completion forms
- Past-record forms
- Records tabs and empty states
- Record details / edit screens
- Progress / statistics
- Settings
- Backup status
- Buttons
- Toasts
- Confirmation dialogs where technically feasible
- Dynamically inserted addon UI

Common failure mode to avoid:

Older layers (`coaching-v10.js`, `coaching-v15-addon.js`, `appointment-v20.js`, `final-v22.js`) dynamically inject Chinese strings after first render. i18n must therefore handle dynamic DOM updates, not only initial static text.

Never translate user-entered names, topics, feedback, or reflections.

## 6. Data / privacy / security

- Main DB key: `coaching_tracker_v3`
- PIN key: `coaching_pin_v1`
- User name key: `coaching_user_name_v1`
- Language key: `coaching_lang_v1`
- Last backup key: `coaching_last_backup_v1`
- Session unlock key: `coach_unlocked`

Runtime coaching data is stored in browser `localStorage`.

Implications:

- Different browsers/devices have independent data.
- Classmates using the same public URL do not see each other’s local records.
- Clearing site/browser data can erase records.
- Private/incognito mode should be avoided for normal use.
- JSON export/import is the current migration / backup mechanism.
- PIN hash protects access to the UI but does not encrypt local coaching data at rest.
- No cloud sync, shared account system, Supabase Auth, or server database at this stage.

## 7. Visual design system

Design direction: **Soft Growth — calm, warm, premium**.

### Brand palette

Primary visual language:

- Lavender / lilac
- Blush pink
- Soft peach
- Warm white
- Mint only as a restrained success accent

Approximate balance:

- 70% warm white / white
- 20% lavender / lilac
- 7% blush / peach
- 3% mint / green

### Icon

Home-screen / brand icon direction:

- Lavender → blush → peach gradient
- White coaching / dialogue / growth symbol
- Minimal; no long text inside icon
- Must look good under iOS rounded icon masking

Current assets include:

- `icon-v23.svg`
- `apple-touch-icon.png`

### UI styling

Prefer:

- Light background
- Rounded cards and inputs
- Subtle borders and shadows
- Large readable dark typography
- Airy spacing
- Soft gradients only in high-value areas
- Rounded line icons with consistent stroke
- Premium iOS-like floating bottom navigation

Avoid:

- Dark cyber / neon look
- Corporate dashboard styling
- Excessive glassmorphism
- Too many gradients
- Dense cards
- Pale background with weak white text
- Decorative effects that reduce readability

## 8. Motion design system

Motion exists to improve feedback and satisfaction, not to show off animation.

### Existing / approved motion direction

- Page entrance: subtle fade + 6–10 px upward movement
- Duration: about 180–220 ms
- Buttons: press scale around `0.985–0.98`, quick release
- Cards: very light stagger (roughly 30–50 ms between items)
- Progress bars: smooth transition to current value
- Success states: short pop + minimal sparkle, approximately 500–700 ms
- Bottom navigation: active-state response / subtle movement

### Engineering constraints

Prefer animating only:

- `transform`
- `opacity`

Avoid expensive repeated animation of:

- width / height where unnecessary
- top / left
- large shadows
- layout-heavy properties

Use `prefers-reduced-motion` so users who reduce motion get a calm experience.

### Satisfaction principle

High-value animation moments are:

- Completing a Coaching session
- Saving an appointment
- Crossing a progress milestone
- Moving forward in ACC progress

Do **not** animate every scroll, every card repeatedly, or use constant bouncing / glowing effects.

## 9. Mobile UX rules

Every update must be reviewed from an iPhone Safari perspective.

Check:

- Safe-area inset around bottom navigation
- Dynamic Island / top spacing
- Bottom nav does not cover content
- Minimum touch targets are comfortable
- Forms stay single-column on mobile
- Date / time inputs remain vertically aligned in iOS Safari
- Inputs and selects retain consistent height
- Long forms preserve readable spacing
- Entering the app / switching screens resets scroll appropriately
- No layout jump when pressing buttons
- Language changes do not cause broken alignment or overflow
- English strings have enough space and do not clip

Known historical bug:

Safari previously restored the first login screen’s scroll position and dropped the user near the bottom of Home. `scroll-reset-v21.js` exists to prevent this. Do not regress it.

## 10. Backup behavior

Current backup strategy is deliberately simple:

- Export all app data to JSON
- Import JSON to restore / migrate
- Record last export time
- Show a gentle backup reminder

Do not add cloud sync unless explicitly approved as a future architectural change.

## 11. Current source layering

Current `index.html` loads the following active layers:

### CSS

- `coaching-v10.css?v=14`
- `polish-v13.css?v=13`
- `coaching-v15.css?v=1`
- `form-controls-v19.css?v=1`
- `appointment-v20.css?v=1`
- `final-v22.css?v=1`
- `visual-v24.css?v=25`

### JavaScript

- `coaching-v10.js?v=14`
- `coaching-v15-addon.js?v=2`
- `appointment-v20.js?v=1`
- `scroll-reset-v21.js?v=1`
- `final-v22.js?v=1`
- `visual-v24.js?v=25`
- `i18n-v25.js?v=25`

Do not casually delete older files simply because a newer layer exists. Some older files may still provide active logic.

## 12. PWA / cache rules

The app uses a service worker and can aggressively cache assets on iPhone.

When shipping a visual, icon, JS, CSS, or i18n update:

1. Update the relevant asset query version.
2. Refresh the service-worker cache key / asset list when needed.
3. Verify GitHub Pages deployment completed successfully.
4. Test the deployed URL, not only repository source.
5. For iOS home-screen icon changes, the user may need to remove the old shortcut and add it again because iOS caches icons heavily.

Testing URLs may temporarily use `?v=<version>` for cache busting. The canonical share URL remains the clean root URL.

## 13. Release / regression checklist

Before declaring a UI release complete, verify:

- Home renders from top after unlock
- New appointment saves correctly
- Appointment edit updates without duplication
- Appointment cancel removes it from Upcoming and does not affect completed hours
- Booking preview displays correct appointment
- Share / copy message targets correct appointment
- Apple Calendar export works
- New completed record changes totals correctly
- Paid / exchange vs free logic is correct
- Past record never changes totals
- Completed record edit recalculates totals
- Record delete behavior is correct
- Statistics remain numerically correct
- JSON backup export/import works
- Last backup date updates
- PIN flow works
- Traditional Chinese works
- English mode contains no stray system Chinese text on major screens and dynamically inserted UI
- User-entered content is not translated
- No bottom-nav overlap
- No Safari date/time misalignment regression
- No scroll-position regression
- New icon appears correctly after fresh Add to Home Screen
- Motion remains smooth and restrained
- Reduce Motion is respected

## 14. Product scope guardrail

Current app scope is intentionally narrow.

Do not add without explicit product approval:

- Cloud accounts / login system
- Cross-device automatic sync
- Heavy CRM functions
- Complex filtering / tagging systems
- Excessive analytics dashboards
- Social features
- Notification infrastructure
- AI-generated Coaching advice inside this tracker

The product should remain a focused personal **Coaching Journey tracker**.

## 15. Decision rule for future changes

When considering a new feature or design effect, ask:

1. Does this help the user record Coaching, see progress, or feel supported?
2. Does it preserve the current simple flow?
3. Does it still feel calm and premium on iPhone?
4. Can it be implemented without risking the hour-calculation logic?

If the answer is not clearly yes, do not add it by default.
