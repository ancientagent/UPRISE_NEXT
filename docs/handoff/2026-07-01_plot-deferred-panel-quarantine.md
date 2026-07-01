# Agent Handoff - Plot Deferred Panel Quarantine

**Agent:** `Codex local`  
**Date:** `2026-07-01`  
**Related Spec:** `docs/specs/communities/plot-and-scene-plot.md`  
**Scope:** `apps/web/src/components/plot`, `apps/web/__tests__`, `docs`

## Summary
Retained Plot panel source files for `StatisticsPanel` and `PlotPromotionsPanel` are now explicitly marked as deferred, non-current import targets. The active `/plot` contract remains `Feed`, `Events`, and `Archive`; this slice adds guardrails so future cleanup/design agents do not mistake retained seams for active MVP surfaces.

## Scope & Deliverables
- What was in scope:
- Add a source marker to retained/deferred Plot panels.
- Add component-folder guidance for current vs deferred Plot panels.
- Add a regression lock that requires the deferred marker on both retained files.
- Update the Plot owner spec and Events/Archive lane brief with the quarantine rule.
- What was explicitly out of scope:
- No runtime UI behavior changes.
- No reactivation or deletion of `StatisticsPanel` or `PlotPromotionsPanel`.
- No Promotions, Statistics, billing, analytics, or calendar mutation work.

## Decisions Made
- Decision: Retain the files but mark them with `DEFERRED_PLOT_PANEL_DO_NOT_IMPORT_IN_ACTIVE_PLOT`.
  - Rationale: Existing docs allow retained/deferred runtime seams, but active `/plot` must not mount them as current MVP panels.
  - Alternatives considered: deleting the files. Rejected because docs still describe deferred seams and future surfaces may reuse them after an owner-spec slice.

## Implementation Notes
- Key files changed:
- `apps/web/src/components/plot/StatisticsPanel.tsx`
- `apps/web/src/components/plot/PlotPromotionsPanel.tsx`
- `apps/web/src/components/plot/README.md`
- `apps/web/__tests__/plot-tab-contracts.test.ts`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/agent-briefs/EVENTS_ARCHIVE.md`
- `docs/CHANGELOG.md`
- `docs/handoff/README.md`
- Key commands:
- `pnpm --filter web test -- plot-tab-contracts.test.ts --runInBand`
- No migrations/backfills.
- No provider or environment changes.

## Outstanding Questions & Recommendations
- Recommended next step: if future work reactivates Statistics, Promotions, or Scenery-style exploration, update the owner spec first and change the regression locks in the same slice.

## References
- Specs:
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/agent-briefs/EVENTS_ARCHIVE.md`
