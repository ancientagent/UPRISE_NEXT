# 2026-04-18 — Stats Doc Discover Deferment Reconciliation

## Summary
Tightened the remaining stats/plot documentation so it stops speaking about Discover as if it were still an active MVP destination.

## Updated
- `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`
- `docs/handoff/2026-04-07_stats-and-plot-feed-lock.md`

## What Changed
### `MVP_STATS_FOUNDER_LOCK_R1.md`
Adjusted wording so the stats contract now clearly applies to:
- current intermittent feed-insert discovery moments
- future reopened discovery surfaces later

and not to a currently live MVP Discover destination.

### `2026-04-07_stats-and-plot-feed-lock.md`
Marked the note as only partially active and historical on live Discover positioning.

It remains useful for:
- Plot feed vs notification split
- descriptive stats posture
- deferred billboard/Top-40 decisions

It should no longer be read as saying live Discover is still part of the active MVP route strategy.

## Verification
- `pnpm run docs:lint`
- `git diff --check`
