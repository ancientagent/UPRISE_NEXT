# 2026-06-24 — Plot Shell Archive Contract Hardening

Branch: `feat/plot-shell-archive-contract-hardening`
Mode: tests/docs hardening only
Runtime changed: no

## Summary

Recreated the Cloud Codex plot-shell hardening slice in the real UPRISE repo after the external environment could not push or create a PR. Current runtime already matched the active Plot product truth, so this branch only adds regression coverage and active documentation updates.

The guarded current behavior is:

- Active Plot tabs are exactly `Feed`, `Events`, and `Archive`.
- `Promotions` and `Statistics` are not current user-facing Plot tab labels.
- `PlotPromotionsPanel` is retained/deferred infrastructure and must not be mounted by current `/plot`.
- `StatisticsPanel` is retained/deferred infrastructure and must not be the active Archive body.
- Archive is read-only descriptive history, including Top Songs and Scene Activity Snapshot, not ranking or authority framing.
- Plot Events rows are scene-scoped read-only listings with no inline calendar mutation controls.
- Feed inserts remain read-only discovery/event moments with no inline Collect, Blast, or Follow controls.

## Files Changed

- `apps/web/__tests__/plot-tab-contracts.test.ts`
- `docs/agent-briefs/EVENTS_ARCHIVE.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-06-24_plot-shell-archive-contract-hardening.md`

## Runtime Evidence

- `/plot` declares `const tabs = ['Feed', 'Events', 'Archive'] as const`.
- `/plot` Archive renders `TopSongsPanel` and `Scene Activity Snapshot` copy.
- `/plot` does not import or mount `StatisticsPanel`.
- `/plot` does not import or mount `PlotPromotionsPanel`.
- `PlotEventsPanel` renders descriptive event rows and the existing `Include Past` filter, not calendar mutation actions.
- `SeedFeedPanel` labels discovery/event inserts as read-only and without inline actions.

## Validation

Run for this slice:

```bash
pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tab-contracts.test.ts plot-statistics-request.test.ts discover-page-lock.test.ts
pnpm --filter web typecheck
pnpm run docs:lint
pnpm run infra-policy-check
git diff --check
```

## Remaining Notes

- `StatisticsPanel`, `SceneMap`, and `PlotPromotionsPanel` may remain in the repo as retained/deferred infrastructure, but active runtime paths must not present them as current MVP Plot tab bodies without an explicit future spec update.
- If calendar export/add behavior is reintroduced later, it needs a separately approved scope and tests proving it does not appear as an unauthorized inline Plot Events row mutation.
