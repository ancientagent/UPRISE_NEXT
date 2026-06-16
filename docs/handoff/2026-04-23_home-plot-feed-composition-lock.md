# 2026-04-23 — Home Plot Feed Composition Lock

## What changed
- Added `docs/solutions/MVP_HOME_PLOT_FEED_COMPOSITION_LOCK_R1.md`.
- Corrected the current MVP Plot tab set to:
  - `Feed`
  - `Events`
  - `Archive`
- removed `Statistics` from current intended MVP tab language
- captured the founder-corrected Home top composition and player composition
- extended the Feed explanation so it now explicitly covers:
  - artist / listener / community updates
  - deterministic feed behavior
  - read-only carousel moments
  - artist-page handoff behavior

## Why
The repo had enough older Plot/runtime language that it was still easy to answer incorrectly with:
- `Promotions`
- `Statistics`
- generic shell descriptions

This lock captures the newer Home/Plot/feed framing directly so future design and documentation work stop drifting.

## Runtime note
Current runtime still reflects the older tab set and shell composition in places.

Treat this as:
- locked, spec/runtime reconciliation pending

## Files updated
- `docs/solutions/MVP_HOME_PLOT_FEED_COMPOSITION_LOCK_R1.md`
- `docs/solutions/SURFACE_CONTRACT_HOME_R1.md`
- `docs/solutions/SURFACE_CONTRACT_PLOT_R1.md`
- `docs/solutions/MVP_SCREEN_AND_SURFACE_MAP_R1.md`
- `docs/CHANGELOG.md`
