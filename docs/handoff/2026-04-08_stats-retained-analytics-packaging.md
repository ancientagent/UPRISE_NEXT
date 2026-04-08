# Stats Retained Analytics Packaging

Date: 2026-04-08
Branch: feat/ux-founder-locks-and-harness

## Summary
- Clarified the MVP stats lock so broader analytics can remain richer than the current surface contract.
- Confirmed that retained metrics may exist per tier and platform-wide.
- Confirmed that those retained metrics may later be packaged into analytics add-ons for valid product domains such as artists, mixologists, venues, and businesses.

## Lock
- `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`

## What changed
- Added a `Retained But Not Surfaced Metrics` section.
- Preserved the following as legitimate retained analytics candidates:
  - `listenCountAllTime`
  - `mostListenedSignals`
  - `mostUpvotedSignals`
  - `mixtapeAppearanceCount`
  - `appearanceCountByTier`
- Locked the rule that:
  - these metrics may be retained/computed
  - they may exist at tier level or platform-wide
  - they may later feed packaged analytics add-ons
  - they do not automatically become MVP Plot/Discover display requirements

## Boundary
- This is a stats-foundation clarification, not a new MVP surface expansion.
- It does not lock final analytics product packaging, pricing, entitlement, or UI.
