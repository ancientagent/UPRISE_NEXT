# Handoff — Stats + Plot Feed Lock

Date: 2026-04-07
Owner: Codex
Status: Partially active carry-forward note (historical on live Discover positioning)

## What Changed
- Added `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md` as the shared descriptive stats contract for MVP.
- Updated `docs/specs/communities/plot-and-scene-plot.md` to lock:
  - followed-source updates belong in the Plot feed
  - profile-strip notifications are a separate notice/inbox surface
  - calendar auto-population is a real MVP organizational rule
  - Top 40 / billboard-style lists are deferred from MVP
- Updated `docs/specs/communities/scene-map-and-metrics.md` to stop treating Top 40 as an MVP requirement.
- Updated `docs/solutions/SURFACE_CONTRACT_PLOT_R1.md` so active surface guidance matches the feed-vs-notification split.
- Updated `docs/solutions/MVP_PHASE1_PHASE2_ACTION_BOARD_R1.md` so stale Discover sections (`Popular Signals`, `Active Participants`) no longer mislead future agents.

## Locked Truths
- Plot feed carries explicit scene actions and followed-source updates.
- Followed-source updates do not move into the profile-strip notification icon by default.
- The notification icon is for system/state-change/inbox-style notices.
- Calendar auto-add behavior remains part of MVP organizational behavior.
- Top 40 / billboard-style statistics are deferred from MVP until population justifies them.
- current feed-insert discovery moments read from the shared stats contract, not from the RaDIYo momentum system.
- if live Discover returns later, it should still inherit this shared stats contract rather than inventing a new one.

## What Remains Open
- Exact notification taxonomy beyond the locked split (which specific notice classes appear in the icon).
- Exact map visualization treatment by structural scope.
- Activity Points / Activity Score formula and decay semantics.
- Top 40/billboard tie-break semantics once those surfaces are intentionally reintroduced.

## Next Recommended Move
1. Reconcile any remaining prompt packs or solution docs that still imply Top 40 is active MVP behavior.
2. Turn the feed-insert discovery/stats locks into an `apps/web` implementation plan.
3. If needed, add a dedicated founder lock for notification taxonomy.
