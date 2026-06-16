# Archive/Event Terminology Cleanup

Date: 2026-06-16
Branch: `feat/archive-event-terminology-cleanup`
Issue: `UPR-9`
Status: implementation slice

## Summary

Aligned active Archive/Event terminology after the read-only Archive runtime change.

## Current Truth

- Current MVP Plot tabs are `Feed`, `Events`, and `Archive`.
- There is no current MVP `Statistics` tab.
- There is no current MVP `Promotions` tab.
- Current `/plot` Archive renders read-only modules:
  - `TopSongsPanel`
  - `Scene Activity Snapshot`
- `StatisticsPanel`, statistics endpoints, and Scene Map payloads may remain internal/runtime infrastructure, but they do not define the current MVP user-facing Archive body.
- The later Statistics / Scene Map design backlog remains active only as future design backlog, not as current tab authorization.

## Files Updated

- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/communities/scene-map-and-metrics.md`
- `docs/specs/communities/statistics-page-design-task-list.md`
- `docs/solutions/MVP_PLOT_UX_QA_REPORT_R1.md`
- `docs/solutions/MVP_UX_BATCH16_EXECUTION_PLAN.md`
- `docs/CHANGELOG.md`

## Verification

Recommended checks for this slice:

```bash
pnpm run docs:lint
pnpm exec prettier --check docs/specs/communities/plot-and-scene-plot.md docs/specs/communities/scene-map-and-metrics.md docs/specs/communities/statistics-page-design-task-list.md docs/solutions/MVP_PLOT_UX_QA_REPORT_R1.md docs/solutions/MVP_UX_BATCH16_EXECUTION_PLAN.md docs/CHANGELOG.md docs/handoff/2026-06-16_archive-event-terminology-cleanup.md
git diff --check
pnpm run verify
```
