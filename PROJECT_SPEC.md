# Coaching Journey — Canonical Project Spec

> Canonical product reference. If chat history conflicts with this file, verify the latest deployed code before changing production.

## Product
- Live: https://carriehw.github.io/carrie-coaching-tracker/
- Current generation: **v27** (bilingual + v26 booking template + compact Home)
- Mobile-first PWA; priority platform: iPhone Safari / Add to Home Screen.
- Static GitHub Pages app. Runtime user data stays in each browser/device; no cloud account or sync.

## Non-negotiables
- Never remove existing fields, metadata, record types, or useful information just to make UI simpler.
- Keep the app calm, simple, premium, and easy to use; do not turn it into a CRM/dashboard.
- Do not break ACC hour logic, existing records, PIN, backup, appointment flows, or iPhone Safari UX.
- Traditional Chinese and English are first-class UI languages. English mode must not leave system Chinese text; user-entered names/topics/feedback/reflections are never auto-translated.

## ACC logic
Targets: **100 total hours**, **75 paid/exchange**, reference metrics **8 recorded Coachees** and **25 detailed dated hours in recent 18 months**.

First use stores: name, opening total hours, opening paid/exchange hours, 4–6 digit PIN.

Totals:
- New completed Coaching adds actual duration to total.
- New paid/exchange Coaching also adds to paid/exchange hours.
- Free Coaching adds to total only.
- Past reconstruction records must always remain `origin:'past'`, `countTowardsTotals:false`; saving/editing/deleting them must never change opening totals.

## Required flows / data
### Appointment
Keep: Coachee name, phone optional, role/occupation, date, start time, expected duration, online/in-person, link/location, optional topic. Support save, edit, cancel, Apple Calendar, booking-message preview/share/copy.

### Completed Coaching
Keep: actual duration, topic, paid/exchange vs free, payment/exchange method, optional note, recording/video/none, consent, Coachee feedback, personal reflection. Editing a completed NEW record must recalculate totals.

### Past record
Keep: name, phone, role, date, optional start time, actual duration, format, location/link, topic, historical hour category, payment/exchange method, recording, consent, feedback, reflection. Never count it again toward totals.

### Records
Tabs: Upcoming / Completed / Past Records. Support detail, edit, delete; Upcoming also supports edit/cancel.

### Progress
Keep: total/100, paid-exchange/75, free hours, completed sessions, recorded Coachees, app-added hours, past-record count, reconstruction progress, Coachees/8, recent detailed hours/25. Do not claim full ACC eligibility from opening lump-sum hours alone.

### Settings
Keep: language, name, opening totals, explanation, save, backup/export/import, last backup date, local-only privacy note, lock app.

## Booking message (v26)
Traditional Chinese template should follow this wording/structure:

感謝[Name]嘅信任💜，以下係booking詳情：
- 日期：[date]
- 時間：[time]（大概[duration]）
- 見面方式：[method]
- 地點/鏈結：[location/link]

期待同[Name]見面 🥰

溫馨提示：Coaching 同平時隨性嘅傾偈有啲唔同，呢個係一個探索嘅旅程。過程中我唔會直接畀答案，而係會用一個陪伴同支持嘅角色同你一齊行。
我會堅守保密原則，呢度係一個安全、冇批判嘅空間，到時只需要放輕鬆，帶住一個開放、坦誠嘅心，呈現最真實嘅自己就可以啦 🫶🏻

到時見 💜

## Home information architecture (v27)
Home is an overview, not the full Records list.
- Show only the **next 2 upcoming appointments**.
- If more exist, show a subtle `X more appointments / 另有 X 個預約` shortcut to Records.
- Compact cards: name, date/time/mode, occupation, small status badge, one visible action.
- Before appointment start: action = Edit appointment.
- Once appointment time has started/passed: action = Complete record.
- Full management remains in Records.
- Main content must reserve enough bottom space so the floating nav never covers appointment cards.

## Visual system
**Soft Growth — calm, warm, premium.** Warm white base; lavender/lilac primary; blush/peach accents; mint only for restrained success states. Rounded cards/inputs, dark readable type, airy spacing, subtle shadows, rounded line icons, floating iOS-like bottom nav. Avoid dark/neon/corporate styling, excessive glass, dense cards, or too many gradients.

Icon: lavender → blush → peach gradient with simple white coaching/dialogue/growth symbol; no long text inside the icon. Current assets include `icon-v23.svg` and `apple-touch-icon.png`.

## Motion
Use motion for feedback, not decoration:
- page fade + 6–10px rise ~180–240ms;
- button press scale ~0.98;
- light card stagger;
- smooth progress transitions;
- brief success pop/sparkle only for meaningful completions.
Prefer `transform` + `opacity`; avoid repeated scroll animation and layout-heavy motion. Respect `prefers-reduced-motion`.

## Mobile UX guardrails
- iPhone safe-area first; bottom nav must never cover content.
- Forms stay single-column; date/time controls remain aligned on Safari.
- Touch targets ~44px+.
- No horizontal overflow or layout jumps.
- Screen/login scroll resets must remain intact (`scroll-reset-v21.js`).
- English strings must not clip or break layout.

## Data / security
Keys: DB `coaching_tracker_v3`; PIN `coaching_pin_v1`; user `coaching_user_name_v1`; language `coaching_lang_v1`; last backup `coaching_last_backup_v1`; session unlock `coach_unlocked`.

LocalStorage implications: devices/browsers are independent; classmates do not see each other’s records; clearing browser/site data can erase records; avoid private mode; JSON export/import is the migration/backup method. PIN is a UI lock, not encryption.

## Active source layers (v27)
CSS: `coaching-v10.css`, `polish-v13.css`, `coaching-v15.css`, `form-controls-v19.css`, `appointment-v20.css`, `final-v22.css`, `visual-v24.css`, `home-v27.css`.

JS: `coaching-v10.js`, `coaching-v15-addon.js`, `appointment-v20.js`, `scroll-reset-v21.js`, `final-v22.js`, `visual-v24.js`, `i18n-v25.js`, `booking-template-v26.js`, `home-v27.js`.

Older files may still provide active logic; do not delete them casually.

## Release checklist
Before calling a release complete, verify: unlock lands at Home top; add/edit/cancel appointment; correct booking preview/share; Apple Calendar; complete NEW Coaching updates totals; paid/free logic; past records never affect totals; completed edit/delete recalculates correctly; Stats numbers; backup export/import + last backup; PIN; zh-Hant and EN including dynamic UI; no translated user content; no nav overlap; no Safari date/time or scroll regression; icon; smooth/reduced motion.

## Scope guardrail
Do not add cloud accounts, auto-sync, CRM features, complex filters, social features, notifications, heavy analytics, or AI coaching advice unless explicitly approved. Future cloud sync can use Supabase; Vercel may be considered when backend/preview needs justify it.
