# 2026-04-18 — Handoff Staleness Reconciliation

## Summary
Audited the recent high-value handoff layer against the current active founder locks and runtime/doctrine reconciliation notes.

This pass did not rewrite historical notes. It marks which older handoffs are now historical only so agents do not keep treating them as active carry-forward.

## Current Active Handoff Layer
These are the recent notes that should anchor current carry-forward first:
- `docs/handoff/2026-04-18_repo-authority-map-and-wiki-steering.md`
- `docs/handoff/2026-04-18_art-department-structure.md`
- `docs/handoff/2026-04-17_abacus-external-assistant-briefing.md`
- `docs/handoff/2026-04-16_notebooklm_artist-profile-and-dashboard_briefing.md`
- `docs/handoff/2026-04-16_discover-feed-insert-and-artist-demo-lock.md`
- `docs/handoff/2026-04-16_artist-fixture-roster-seed.md`
- `docs/handoff/2026-04-16_discover-deferred-local-only-mvp.md`

## Stale Or Historical-Only Notes
### 1) `docs/handoff/2026-03-25_community-artist-wireframe-pass.md`
Historical-only for visual shell/workframe context.

Stale claim:
- it still describes the artist page as preserving an `artist follow/add/blast/support action row`

Why stale:
- later 2026-04-14 and 2026-04-15 reconciliation passes removed source-level `Add` / `Support` from artist pages and narrowed signal/action grammar.

Use now instead:
- `docs/handoff/2026-04-14_artist-page-action-and-spec-reconciliation.md`
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`

### 2) `docs/handoff/2026-03-23_discover-verification-and-runtime-cleanup.md`
Historical-only for an earlier live-Discover phase.

Stale assumptions:
- live Discover travel/results are treated as active success conditions
- recommendations/trending/top-artist population is described as live Discover behavior

Why stale:
- later founder direction deferred live `/discover` for the current local-community-only MVP and moved discovery value into intermittent feed inserts.

Use now instead:
- `docs/handoff/2026-04-16_discover-deferred-local-only-mvp.md`
- `docs/handoff/2026-04-16_discover-feed-insert-and-artist-demo-lock.md`
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`

### 3) `docs/handoff/2026-04-06_discover-rail-priority-lock.md`
Historical-only for the pre-deferral Discover phase.

Stale assumptions:
- Discover is described as a live MVP destination with ranked rail priority
- community visit is treated as a secondary Discover outcome inside an active route strategy

Why stale:
- later founder direction deferred live Discover entirely for the current MVP.

Use now instead:
- `docs/handoff/2026-04-16_discover-deferred-local-only-mvp.md`
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`

### 4) `docs/handoff/2026-04-07_stats-and-plot-feed-lock.md`
Partially active, but stale anywhere it implies Discover is still a live MVP destination.

Still useful for:
- Plot feed vs notification split
- descriptive stats posture

Treat as stale for:
- active Discover positioning

Use alongside:
- `docs/handoff/2026-04-16_discover-deferred-local-only-mvp.md`
- `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`

### 5) `docs/handoff/2026-03-24_cross-route-ux-continuity-and-plot-contract-hardening.md`
Historical-only for a prior Discover/Plot route phase.

Stale assumptions:
- signed-out Discover hardening is described as an active route concern
- `/discover` route behavior is treated as part of the live MVP surface strategy
- `RadiyoPlayerPanel` action summary still sits in the older wheel/action grammar period

Why stale:
- later doctrine deferred Discover and continued action-grammar reconciliation.

Use now instead:
- `docs/handoff/2026-04-16_discover-deferred-local-only-mvp.md`
- `docs/handoff/2026-04-15_radiyo-wheel-collect-language-reconciliation.md`

## Important Distinction
These older notes are not wrong in the sense of branch history. They are stale as current carry-forward because the MVP direction moved.

Agents should preserve them as historical traceability, not active guidance.

## Recommended Reading Behavior
For current carry-forward on discovery/artist-profile/action-grammar work:
1. latest 2026-04-18 / 2026-04-17 / 2026-04-16 handoffs first
2. then the corresponding founder locks in `docs/solutions/`
3. only then older March/early-April handoffs if historical rationale is needed
