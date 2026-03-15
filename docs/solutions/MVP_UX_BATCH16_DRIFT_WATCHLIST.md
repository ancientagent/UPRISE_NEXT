# MVP UX Batch16 Drift Watchlist

Status: Active  
Date: 2026-03-15

Purpose: strict drift-prevention checklist for Batch16 lane execution and QA review.

## Top 10 Failure Modes

1. Global layout order broken
- Collapsed `/plot` must remain:
  - profile strip -> player strip -> plot tabs -> active tab body -> bottom nav.

2. Unauthorized tabs or wrong order
- Collapsed tab rail is locked to:
  - Feed, Events, Promos, Statistics.
- Social remains deferred unless explicitly unlocked by spec update.

3. Player mode contract violations
- RADIYO:
  - scene title/context line
  - track row + art
  - tier controls (City/State/National)
  - rotation/source control
- Collection:
  - collection context title
  - eject return path to RADIYO
  - tier controls hidden

4. Profile strip scope drift
- Collapsed profile strip shows only:
  - username
  - notifications icon
  - options menu (`...`)
- No avatar/registrar/ambassador/mixologist additions in collapsed MVP strip.

5. Route/state transition drift
- Profile expand/collapse remains route-stable on `/plot` (no route push/pop).
- Collection entry is selection-driven; return to RADIYO is via eject path.

6. Personalized/ranked feed drift
- Feed/Plot tabs remain scene-scoped deterministic surfaces.
- No recommendation, trending, vibe scoring, or hidden ranking semantics.

7. Deferred feature leakage
- Do not introduce:
  - vibe/recommendation bubbles
  - plus/minus dial as MVP interaction
  - deferred role/profile surface expansions not spec-locked

8. Bottom nav misuse
- Bottom nav remains:
  - Home (left)
  - center UPRISE button (wheel trigger)
  - Discover (right)

9. Engagement wheel action drift
- Wheel action sets remain mode-locked and deterministic per current UX lock docs.
- No extra actions or position remaps without founder lock + spec update.

10. Expanded profile composition drift
- Expanded profile collection workspace order stays:
  1. Singles/Playlists
  2. Events
  3. Photos
  4. Merch
  5. Saved Uprises
  6. Saved Promos/Coupons
- Calendar remains in expanded header, not inside Events collection section.

## Batch16 Validation Checklist (Run After Each Lane)

1. Canon/spec preflight
- Confirm slice references:
  - `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
  - relevant `docs/specs/*` anchors

2. Onboarding gate validation
- Home Scene required before stable `/plot` context.
- GPS remains voting-only gate.
- Inactive city resolves to nearest active city-tier scene + pioneer notification path.

3. Layout order check
- Verify collapsed `/plot` stack order is intact.

4. Tabs check
- Verify only Feed/Events/Promos/Statistics are visible in collapsed rail.
- Verify Social treatment matches deferred policy lock.

5. Player mode checks
- Validate RADIYO and Collection contracts (controls/visibility/entry+exit semantics).

6. Tier-title/context parity
- On City/State/National selection, scene title/context updates deterministically to that scope.

7. Profile strip + expanded panel check
- Validate collapsed strip scope.
- Validate expanded header + collection workspace ordering.

8. Bottom nav + wheel check
- Validate nav anchors and wheel trigger ownership.
- Validate wheel action sets remain mode-locked.

9. Non-personalization check
- Verify Feed/Events/Promos/Statistics do not imply recommendation/ranking behavior.

10. Regression + verify commands
- Run each slice `verifyCommand` exactly.
- Ensure changelog + dated handoff + complete `--task-id` report are present.

## Current Source-of-Truth Set
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_UX_BATCH16_EXECUTION_PLAN.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
- `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/communities/plot-and-scene-plot.md`
