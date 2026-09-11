# Coaching Journey — Canonical Project Spec

> Canonical product reference. If chat history conflicts with this file, verify the latest deployed code before changing production.

## Product
- Live: https://carriehw.github.io/carrie-coaching-tracker/
- Current generation: **v28** (bilingual + v26 booking copy + compact Home + flexible online appointment methods)
- Mobile-first PWA; priority: iPhone Safari / Add to Home Screen.
- Static GitHub Pages app. Runtime user data stays in each browser/device; no cloud account or sync.

## Non-negotiables
- Never remove existing fields, metadata, record types, or useful information just to simplify UI.
- Keep the app calm, simple, premium, and easy to use; not a CRM/dashboard.
- Do not break ACC hour logic, existing records, PIN, backup, appointment flows, or iPhone Safari UX.
- Traditional Chinese and English are first-class UI languages. English mode must not leave system Chinese text; user-entered names/topics/feedback/reflections are never auto-translated.

## ACC logic
Targets: **100 total hours**, **75 paid/exchange**, reference metrics **8 recorded Coachees** and **25 detailed dated hours in recent 18 months**.

First use stores: name, opening total hours, opening paid/exchange hours, 4–6 digit PIN.

Totals:
- New completed Coaching adds actual duration to total.
- New paid/exchange Coaching also adds to paid/exchange hours.
- Free Coaching adds to total only.
- Past reconstruction records remain `origin:'past'`, `countTowardsTotals:false`; saving/editing/deleting them never changes opening totals.

## Required flows / data
### Appointment
Keep: Coachee name, phone optional, role/occupation, date, start time, expected duration, online/in-person, optional topic, save/edit/cancel, Apple Calendar, booking-message preview/share/copy.

For **online** appointments, v28 separates format from online method. Supported methods:
- Zoom
- Google Meet
- Microsoft Teams
- WhatsApp Video Call
- FaceTime
- Other

Storage fields added without migration:
- `onlineMethod`
- `onlineContact`

Rules:
- Zoom / Meet / Teams show an optional meeting-link field (`link`).
- WhatsApp Video Call can use the existing Coachee phone when `onlineContact` is blank.
- FaceTime accepts optional phone / Apple ID / email.
- Other accepts optional platform/contact details.
- Existing pre-v28 online appointments stay valid. Existing `link` data is preserved and method may be inferred when editing.
- In-person appointments continue using `place`.

### Completed Coaching
Keep: actual duration, topic, paid/exchange vs free, payment/exchange method, optional note, recording/video/none, consent, Coachee feedback, personal reflection. Editing a completed NEW record recalculates totals.

### Past record
Keep: name, phone, role, date, optional start time, actual duration, format, location/link, topic, historical hour category, payment/exchange method, recording, consent, feedback, reflection. Never count it again toward totals.

### Records
Tabs: Upcoming / Completed / Past Records. Support detail, edit, delete; Upcoming also supports edit/cancel.

### Progress
Keep: total/100, paid-exchange/75, free hours, completed sessions, recorded Coachees, app-added hours, past-record count, reconstruction progress, Coachees/8, recent detailed hours/25. Do not claim full ACC eligibility from opening lump-sum hours alone.

### Settings
Keep: language, name, opening totals, explanation, save, backup/export/import, last backup date, local-only privacy note, lock app.

## Booking message
Traditional Chinese booking copy keeps the approved warm template.

Base structure:
- Name
- Date
- Time + approximate duration
- Meeting format
- Location/link or contact details only when relevant
- Warm Coaching explanation + confidentiality/safe-space reminder

v28 online-message rules:
- Link-based platform: `線上 · [platform]` + `地點/鏈結`.
- WhatsApp Video Call: `線上 · WhatsApp Video Call`; use `onlineContact`, otherwise existing phone; do not show a blank URL line.
- FaceTime: `線上 · FaceTime`; optional contact line.
- Other: show optional contact detail only when provided.
- Legacy online appointment without `onlineMethod` continues using the old link behavior.

## Home information architecture (v27)
Home is an overview, not the full Records list.
- Show only the next **2** upcoming appointments.
- If more exist, show a subtle `X more appointments / 另有 X 個預約` shortcut to Records.
- Compact cards: name, date/time/mode, occupation, small status badge, one visible action.
- Before appointment start: Edit appointment. Once started/passed: Complete record.
- Main content reserves enough bottom space so floating nav never covers cards.

## Visual / motion
**Soft Growth — calm, warm, premium.** Warm white base; lavender/lilac primary; blush/peach accents; mint only for restrained success states. Rounded cards/inputs, dark readable type, airy spacing, subtle shadows, rounded line icons, floating iOS-like bottom nav.

Motion: page fade/rise, button press scale ~0.98, light card stagger, smooth progress, brief success pop/sparkle. Prefer `transform` + `opacity`; respect `prefers-reduced-motion`.

## Mobile UX guardrails
- iPhone safe-area first; bottom nav never covers content.
- Forms stay single-column; date/time controls remain aligned on Safari.
- Touch targets ~44px+.
- No horizontal overflow/layout jumps.
- Screen/login scroll resets remain intact (`scroll-reset-v21.js`).
- English strings must not clip.

## Data / security
Keys: DB `coaching_tracker_v3`; PIN `coaching_pin_v1`; user `coaching_user_name_v1`; language `coaching_lang_v1`; last backup `coaching_last_backup_v1`; session unlock `coach_unlocked`.

LocalStorage implications: devices/browsers are independent; classmates do not see each other’s records; clearing site data can erase records; avoid private mode; JSON export/import is migration/backup. PIN is a UI lock, not encryption.

## Active source layers (v28)
CSS: `coaching-v10.css`, `polish-v13.css`, `coaching-v15.css`, `form-controls-v19.css`, `appointment-v20.css`, `final-v22.css`, `visual-v24.css`, `home-v27.css`, `online-v28.css`.

JS: `coaching-v10.js`, `coaching-v15-addon.js`, `appointment-v20.js`, `scroll-reset-v21.js`, `final-v22.js`, `visual-v24.js`, `i18n-v25.js`, `booking-template-v26.js`, `home-v27.js`, `online-v28.js`.

Older files may still provide active logic; do not delete casually.

## Release checklist
Verify: unlock/Home scroll; add/edit/cancel appointment; online platform fields for all six methods; old online appointments still edit correctly; booking preview/share reflects platform/contact; Apple Calendar; NEW completion totals; paid/free logic; past records never affect totals; completed edit/delete; stats; backup + last date; PIN; zh-Hant/EN dynamic UI; no translated user content; no nav overlap; Safari date/time; icon; smooth/reduced motion.

## Scope guardrail
Do not add cloud accounts, auto-sync, CRM features, complex filters, social features, notifications, heavy analytics, or AI coaching advice unless explicitly approved. Future cloud sync can use Supabase; Vercel may be considered when backend/preview needs justify it.
