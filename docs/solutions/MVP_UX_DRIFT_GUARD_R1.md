# MVP UX Drift Guard R1

Purpose: prevent small-but-critical UX behavior drift across agents/sessions during mobile-first MVP work.

Process stop rule:
- If UX batches have converged to repeated clean closeouts and remaining uncertainty is founder acceptance rather than implementation mechanics, stop general batch seeding and switch to readiness review / walkthrough per `docs/solutions/PHASE_STOP_GATE_PLAYBOOK.md`.

## Use Before Any UX Edit
1. Read:
   - `docs/solutions/REPO_AUTHORITY_MAP_R1.md`
   - `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
   - `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
   - `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
   - `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
2. Confirm no contradictions.
3. If any behavior is missing from canon/spec/locked UX docs, stop and ask founder.

## Locked Micro-Decisions (Do Not Drift)
- Collapsed profile strip contains: username, notifications, options only.
- No avatar surface in MVP.
- Expanded profile header includes:
  - username/handle,
  - activity score,
  - conditional band/promoter fields,
  - calendar widget on opposite side.
- Expanded profile tabs (exact order):
  1. Singles/Playlists
  2. Events
  3. Photos
  4. Merch
  5. Saved Uprises
  6. Saved Promos/Coupons
- Events tab does not own the calendar (calendar is in expanded header).
- No dedicated RADIYO/Collection switch button on player.
- Enter Collection mode only from collection song/playlist selection.
- Return to RADIYO via eject only.
- Collection player has shuffle on strip; other collection controls are on action wheel.
- RADIYO transport is tier-driven:
  - tap City/State/National to start,
  - tap active tier again to stop.

## Action Wheel Lock
- Trigger: center UPRISE logo in bottom nav.
- Do not hardcode wheel actions from this historical doc.
- Resolve current listening/player actions from the active founder locks and action matrix at task time.

## Deferred (Keep Out of MVP Behavior)
- Ambassador and mixologist profile role surfaces.
- Instrument/registrar profile fields and registration surfaces.
- Avatar-interactive merch behavior.
- Vibe/recommendation bubble mechanics and manual vibe scoring surfaces.
- Plus/minus dial as active MVP control (keep as deferred concept unless founder re-locks).

## Mandatory Pre-Handoff Check
- Include a short “Drift Guard Confirmation” section listing:
  - each locked decision touched,
  - confirmation it remains unchanged,
  - any new founder decision requests.
