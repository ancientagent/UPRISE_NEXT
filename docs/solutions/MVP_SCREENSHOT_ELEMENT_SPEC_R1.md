# MVP Screenshot Element Spec R1

Purpose: convert the provided legacy-style screenshot into a deterministic build spec for current MVP, with explicit MVP vs V2 boundaries.

## Scope
- Covers both views represented in the screenshot concept:
  1. Plot route with collapsed profile + player + Plot body
  2. Expanded profile/collection workspace with persistent player context
- Captures every visible element class and its role.

## Important Boundary
- Legacy screenshot is an architecture reference, not canon behavior.
- If legacy element conflicts with current lock, current lock wins.

## A) Collapsed Plot Screen (Element-by-Element)

### A1. Profile strip (top)
- Element: Username
  - What: identity anchor for current user.
  - Why: constant orientation and ownership.
  - MVP: yes.
- Element: Notifications icon
  - What: entry point for in-app notices.
  - Why: includes pioneer/scene notices and future platform notices.
  - MVP: yes.
- Element: Options menu (`...`)
  - What: profile/settings overflow entry.
  - Why: keeps strip compact while preserving utilities.
  - MVP: yes.
- Element: Avatar
  - What: legacy screenshot visual.
  - Why: identity ornament in old build.
  - MVP: no (deferred).

### A2. Player strip (below profile)
- Element: Scene title line
  - What: current listening context (city/state/community by tier).
  - Why: user always knows where broadcast context is anchored.
  - MVP: yes.
- Element: Track row + art thumbnail
  - What: currently playing item display.
  - Why: playback context and artist entry affordance.
  - MVP: yes.
- Element: Tier controls (City/State/National)
  - What: scope selector for RADIYO.
  - Behavior: tap tier to start; tap active tier again to stop.
  - Why: transport and context are unified.
  - MVP: yes (RADIYO mode only).
- Element: Rotation control (New/Current)
  - What: source rotation selector for RADIYO.
  - Why: lightweight control over broadcast rotation.
  - MVP: yes.
- Element: Dedicated mode switch button (RADIYO/Collection)
  - What: shown in some prior iterations.
  - MVP: no (removed by lock).
- Element: Eject control
  - What: return path from Collection to RADIYO.
  - Why: explicit, deterministic mode exit.
  - MVP: yes (shown in Collection mode).

### A3. Plot tabs
- Element set: `Feed`, `Events`, `Promos`, `Statistics`
  - What: core Plot panels.
  - Why: scene dashboard organization.
  - MVP: yes.
- Element: `Social` tab
  - What: legacy/older placeholder.
  - MVP: no for current strict mockups.

### A4. Feed/body cards
- Element: Feed cards and scene activity blocks
  - What: non-personalized scene-scoped feed surfaces.
  - Why: civic/community signal visibility.
  - MVP: yes.
- Element: Recommendation bubble mechanics (“vibe”, manual score bubble)
  - What: advanced recommendation/social scoring concept from screenshot notes.
  - MVP: deferred (V2 discussion).

### A5. Bottom nav
- Element set: `Home` (left), center UPRISE action button, `Discover` (right)
  - What: persistent root navigation + action-wheel trigger.
  - Why: one-handed consistency.
  - MVP: yes.

### A6. Action wheel (opened from center UPRISE button)
- Trigger: center UPRISE button.
- RADIYO actions (locked):
  - Report, Skip, Blast, Add, Upvote
- Collection actions (locked positions):
  - 9:00 Back
  - 10:00 Pause
  - 12:00 Blast
  - 1:00 Recommend
  - 3:00 Next
- Plus/minus dial concept:
  - MVP: deferred unless re-locked later.

## B) Expanded Profile Screen (Element-by-Element)

### B1. Expanded header
- Element: Username/handle block
  - MVP: yes.
- Element: Activity score
  - MVP: yes.
- Element: Band status
  - MVP: conditional (only if user has role).
- Element: Promoter status
  - MVP: conditional (only if user has role).
- Element: Calendar widget (header side)
  - What: date/event context panel in header.
  - MVP: yes.
- Element: Instrument registration / registrar profile fields
  - What: screenshot concept notes for future registration flows.
  - MVP: deferred to V2.
- Element: Ambassador/mixologist role surfaces
  - MVP: deferred to V2.

### B2. Expanded collection menu (locked order)
1. Singles/Playlists
2. Events
3. Photos
4. Merch
5. Saved Uprises
6. Saved Promos/Coupons

### B3. Tab content intent
- Singles/Playlists: saved tracks + playlist grouping.
- Events: fliers/event artifacts (calendar stays in header).
- Photos: listener photography artifacts.
- Merch: posters, shirts, patches, buttons, special items.
- Saved Uprises: saved/followed scene list.
- Saved Promos/Coupons: promo/coupon cards with status/expiration.

## C) Explicit MVP Deferrals (from this thread)
- Vibe/recommendation bubble mechanics and manual vibe scoring: V2.
- Instrument registration/registrar profile surfaces in profile header: V2.
- Ambassador/mixologist profile surfaces: V2.
- Avatar/interactive avatar mechanics: V2.
- Plus/minus dial as active control: V2 (unless founder re-locks).

## D) Prompt-Ready Replication Block (Use in Uizard)
Use `docs/solutions/MVP_UIZARD_PROMPT_PACK_R2_STRICT.md` as base, then append:

1) Treat legacy screenshot as layout reference only.
2) Keep all MVP locks from strict pack.
3) Exclude deferred items:
   - vibe/recommendation bubble mechanics
   - instrument/registrar profile fields
   - ambassador/mixologist role surfaces
   - avatar surfaces
4) Keep action wheel behavior and tab/menu order exactly as locked.
5) Do not add controls not listed.

Acceptance gate:
- Reject output if any deferred item appears in MVP screens.
