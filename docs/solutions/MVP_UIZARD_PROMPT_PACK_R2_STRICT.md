# MVP Uizard Prompt Pack R2 (Strict)

Status: Historical reference only (pre-2026-04 plot/profile pack)

Historical note:
- This document reflects an older Plot/Profile/Discover generation phase.
- Do not use it as the current authority for action grammar, live Discover behavior, or artist-profile behavior.
- Current authority now lives in:
  - `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
  - `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
  - `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
  - `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
  - `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`
  - `docs/solutions/REPO_AUTHORITY_MAP_R1.md`

Use this file only as historical reference for a prior mobile mockup phase.


Use this pack for deterministic mobile mockup generation with minimal drift.

## How To Use
1. Paste **Section A** once.
2. Generate screens using **Section B** prompts one-by-one (B1 -> B8).
3. After each screen, run the acceptance checklist in that section.
4. If output violates any `NEVER` rule, regenerate with the same prompt and add: `Correct violations only. Do not redesign.`

---

## A) Global Rules (Paste First)
Design a mobile-only UX for UPRISE.

MUST:
- Phone viewport only (Android-style proportions), compact layout.
- Dark theme, high contrast, dense but readable spacing.
- Persistent layout order in Plot route:
  1) collapsed profile strip
  2) player strip
  3) plot tabs
  4) plot body
  5) bottom nav
- Bottom nav always has:
  - `Home` (left)
  - center UPRISE action button
  - `Discover` (right)

Product locks:
- No avatar in MVP profile surfaces.
- Collapsed profile strip contains only:
  - username
  - notifications icon
  - options menu (`...`)
- Expanded profile header contains:
  - username/handle
  - activity score
  - band/promoter fields only when applicable
  - calendar widget on opposite side
- Expanded profile tabs (exact order):
  1. Singles/Playlists
  2. Events
  3. Photos
  4. Merch
  5. Saved Uprises
  6. Saved Promos/Coupons

Player locks:
- Two modes exist: `RADIYO`, `Collection`.
- No dedicated RADIYO/Collection switch button.
- Enter Collection only by selecting a collection song/playlist.
- Exit Collection only via eject control.
- Collection player includes shuffle.
- Other collection playback controls are in action wheel.
- RADIYO transport is tier-driven:
  - tap City/State/National to start that tier
  - tap active tier again to stop

Action wheel locks:
- Triggered by center UPRISE nav button.
- RADIYO actions: Report, Skip, Blast, Collect, Upvote.
- Collection actions:
  - 9:00 Back
  - 10:00 Pause
  - 12:00 Blast
  - 1:00 Recommend
  - 3:00 Next

NEVER:
- no desktop/tablet layouts
- no avatar controls/customization
- no placeholder CTAs (Coming Soon, Upgrade, Join, etc.)
- no speculative social patterns outside specified tabs/actions
- do not add any controls not explicitly listed
- no vibe/recommendation bubble mechanics or manual vibe score UI
- no instrument/registrar profile fields in MVP screens
- no ambassador/mixologist role surfaces in MVP screens

---

## B1) Screen: Plot + Collapsed Profile + RADIYO
Create one screen: Plot route in collapsed profile state, RADIYO active.

MUST include:
- collapsed profile strip: username, notifications, options
- player strip with:
  - scene title
  - compact track row
  - right-side vertical tier stack: National, State, City
  - no mode switch button
- plot tabs: Feed, Events, Promos, Statistics
- feed body card area
- bottom nav with center UPRISE action button

NEVER:
- no Social tab
- no avatar
- no separate play/pause button for RADIYO

Acceptance checklist:
- [ ] right-side tier stack is vertical
- [ ] no RADIYO/Collection switch button is visible
- [ ] no avatar is shown
- [ ] bottom nav matches Home / center UPRISE / Discover

---

## B2) Screen: Plot + Collapsed Profile + Collection Mode
Create one screen: same Plot layout, Collection mode active.

MUST include:
- same collapsed profile strip
- collection context title in player
- eject control visible
- shuffle control visible
- bottom nav unchanged

NEVER:
- no tier stack in Collection mode
- no extra transport controls beyond locked set

Acceptance checklist:
- [ ] collection title context is clear
- [ ] eject is present
- [ ] shuffle is present
- [ ] no tier stack shown in Collection mode

---

## B3) Screen: Expanded Profile + Singles/Playlists (Default)
Create one screen: expanded profile replaces Plot body in same route.

MUST include:
- expanded header:
  - username/handle
  - activity score
  - conditional role fields (band/promoter placeholders only if applicable)
  - calendar widget on opposite side
- tab row (exact order):
  - Singles/Playlists, Events, Photos, Merch, Saved Uprises, Saved Promos/Coupons
- Singles/Playlists content as default
- player context retained on screen

NEVER:
- no avatar
- no route transition indicators

Acceptance checklist:
- [ ] tab order exactly matches lock
- [ ] calendar is in header (not tab content)
- [ ] Singles/Playlists is active by default

---

## B4) Screen: Expanded Profile + Events Tab
Create one screen with Events tab active.

MUST include:
- same expanded header block
- Events content: collected fliers and event artifacts list

NEVER:
- no calendar inside Events tab (calendar already in header)

Acceptance checklist:
- [ ] calendar remains in header
- [ ] Events body shows fliers/artifacts only

---

## B5) Screen: Expanded Profile + Photos Tab
Create one screen with Photos tab active.

MUST include:
- saved scene/event photos
- listener-contributed photography artifacts

Acceptance checklist:
- [ ] Photos content is distinct from Events and Merch

---

## B6) Screen: Expanded Profile + Merch Tab
Create one screen with Merch tab active.

MUST include category shelves:
- Posters
- Shirts
- Patches
- Buttons
- Special Items

Acceptance checklist:
- [ ] all five categories are visible

---

## B7) Screen: Expanded Profile + Saved Uprises Tab
Create one screen with Saved Uprises tab active.

MUST include:
- saved/followed uprise list
- scene identity chips (city/state/community)

Acceptance checklist:
- [ ] list reads as saved scenes, not generic social feed

---

## B8) Screen: Expanded Profile + Saved Promos/Coupons Tab
Create one screen with Saved Promos/Coupons tab active.

MUST include:
- promo/coupon cards
- clear status + expiration labels

Acceptance checklist:
- [ ] cards are promo/coupon-specific
- [ ] expiration/status are visible without opening details

---

## C) Final Consistency Prompt
Run this after B1-B8 are generated:

Normalize all screens to one coherent design system while preserving all locked behavior and control maps.
Do not add/remove controls, tabs, or actions.
Only align spacing, typography scale, component sizing, and visual consistency.