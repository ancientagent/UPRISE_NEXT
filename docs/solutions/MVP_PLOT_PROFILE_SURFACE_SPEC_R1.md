# MVP Plot + Profile Surface Spec R1

Purpose: deterministic implementation contract for the screenshot-derived mobile UX architecture.

## 1) Route and State Model

Route:
- `/plot` is the active scene dashboard route.

Primary UI states:
1. `plot_collapsed_profile`
2. `plot_collection_mode_collapsed`
3. `plot_expanded_profile`

Mode state:
- `player_mode`: `RADIYO` | `Collection`

Panel state:
- `collapsed` | `expanded`

State transitions:
- `collapsed -> expanded`: seam pull/tap (or explicit fallback control).
- `expanded -> collapsed`: reverse seam/collapse action.
- `RADIYO -> Collection`: user selects collection song/playlist.
- `Collection -> RADIYO`: eject action only.

## 2) Global Layout Contract (Collapsed)

Top to bottom in collapsed state:
1. Profile strip
2. Player strip
3. Plot tabs
4. Active tab body
5. Bottom nav

No desktop reinterpretation is allowed to change this semantic order.

## 3) Profile Strip (Collapsed)

Visible elements (MVP):
- Username
- Notifications icon
- Options menu (`...`)

Not visible in MVP:
- Avatar
- Instrument-registration fields
- Ambassador/mixologist role chips

Why:
- Preserve compact top strip and avoid premature role/UI complexity.

## 4) Player Strip Contract

### 4.1 RADIYO mode
Required elements:
- Scene title line
- Track row with art thumbnail
- Right-side vertical tier stack: `National`, `State`, `City`
- Rotation selector (`New`/`Current` release rotation)

Transport behavior:
- Tap tier to start that tier broadcast.
- Tap active tier again to stop playback.

Forbidden:
- Dedicated RADIYO/Collection switch button.

### 4.2 Collection mode
Required elements:
- Collection context title
- Eject control (return to RADIYO)
- Shuffle control

Hidden in Collection mode:
- Tier stack (`National/State/City`)

Other collection controls:
- operated via engagement/action wheel.

## 5) Bottom Nav + Engagement Wheel

Bottom nav:
- `Home` (left)
- Center UPRISE button (wheel trigger)
- `Discover` (right)

Wheel trigger:
- Center UPRISE button only.

RADIYO wheel actions:
- Report
- Skip
- Blast
- Add
- Upvote

Collection wheel actions:
- 9:00 Back
- 10:00 Pause
- 12:00 Blast
- 1:00 Recommend
- 3:00 Next

Deferred:
- Plus/minus dial as active MVP control.

## 6) Plot Tabs (Collapsed State)

Visible tabs in strict MVP mockups:
- Feed
- Events
- Promos
- Statistics

Deferred/hidden in strict mockups:
- Social tab

### 6.1 Feed
Role:
- Scene-scoped non-personalized activity surfaces.
Includes:
- feed cards, updates, actions context.
Excludes:
- recommendation ranking semantics.

### 6.2 Events
Role:
- scene event surfaces in Plot.
Includes:
- event cards/listing relevant to active scene context.

### 6.3 Promos
Role:
- scene-scoped offers/promotions.
Includes:
- promo/coupon-style cards in Plot context.

### 6.4 Statistics
Role:
- metrics and scene snapshots.
Includes:
- top songs/scene activity and statistical summaries per approved scope.

## 7) Expanded Profile Contract

Expanded profile replaces Plot body area in same route and keeps player context available.

### 7.1 Expanded header
Required:
- Username/handle
- Activity score
- Band status (conditional)
- Promoter status (conditional)
- Calendar widget on opposite side

Deferred (V2):
- Instrument/registrar fields in header
- Ambassador/mixologist surfaces
- Avatar surfaces

### 7.2 Expanded collection tabs (exact order)
1. Singles/Playlists
2. Events
3. Photos
4. Merch
5. Saved Uprises
6. Saved Promos/Coupons

### 7.3 Expanded tab content definitions
- Singles/Playlists:
  - saved singles and playlist groupings.
- Events:
  - event artifacts and saved fliers.
  - calendar does not live here.
- Photos:
  - saved scene/event photography artifacts.
- Merch:
  - Posters, Shirts, Patches, Buttons, Special Items.
- Saved Uprises:
  - saved/followed scene entries.
- Saved Promos/Coupons:
  - saved promos/coupons with status + expiration.

## 8) MVP vs V2 Boundary

MVP:
- All items in sections 2–7 marked required/visible.

V2/deferred:
- Vibe/recommendation bubble mechanics and manual vibe score UIs.
- Instrument registration/registrar profile fields in profile surfaces.
- Ambassador/mixologist role surfaces.
- Avatar and avatar-interactive merch behavior.
- Plus/minus dial as active control.

## 9) Implementation/Mockup Acceptance Gate

A screen fails if any of these occur:
- missing player strip in collapsed Plot.
- dedicated mode switch button appears.
- collection mode appears without selection path/eject return model.
- calendar appears inside Events tab body.
- avatar appears in MVP profile surfaces.
- tab order differs from locked order.
- non-listed controls are introduced.
