# Agent Handoff - Plot Primary Tab Body Extraction

**Agent:** `Codex local`  
**Date:** `2026-07-01`  
**Related Spec:** `docs/specs/communities/plot-and-scene-plot.md`  
**Scope:** `apps/web/src/app/plot/page.tsx`, `apps/web/src/components/plot`, `apps/web/__tests__`

## Summary
Extracted the active `/plot` primary tab body renderer into `PlotPrimaryTabBody.tsx`. This is the first small Slice 2 cleanup from the structural integrity audit: the route shell still owns state, selected-scene context, player/profile/roller behavior, and tab selection, while the active `Feed` / `Events` / `Archive` body rendering now lives in a focused component.

## Scope & Deliverables
- What was in scope:
- Move the existing `Feed`, `Events`, and `Archive` body selection out of `apps/web/src/app/plot/page.tsx`.
- Preserve the current active tab set and body copy.
- Update regression locks so Archive/Feed/Events body assertions point to the extracted component.
- Update `apps/web/src/components/plot/README.md` to identify the active component boundary.
- What was explicitly out of scope:
- No visual redesign.
- No behavior change for Home Scene roller, player pull-down, profile, Registrar access, source context, or Fair Play.
- No changes to deferred `StatisticsPanel` or `PlotPromotionsPanel`.

## Decisions Made
- Decision: Extract only the primary tab body renderer first.
  - Rationale: `/plot/page.tsx` is large, but a broad route rewrite would be high-risk before visual QA. The tab body renderer has a narrow prop boundary and can be moved without changing data fetches or state ownership.
  - Alternatives considered: extracting roller/profile/player at the same time. Rejected because those areas carry more state and interaction risk.

## Implementation Notes
- Key files changed:
- `apps/web/src/components/plot/PlotPrimaryTabBody.tsx`
- `apps/web/src/app/plot/page.tsx`
- `apps/web/src/components/plot/README.md`
- `apps/web/__tests__/plot-tab-contracts.test.ts`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `docs/CHANGELOG.md`
- `docs/handoff/README.md`
- Key commands:
- `pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tab-contracts.test.ts --runInBand`
- `pnpm --filter web typecheck`
- No migrations/backfills.
- No provider or environment changes.

## Outstanding Questions & Recommendations
- Recommended next step: continue route cleanup in similarly small slices. Prefer extracting pure presentational sections before moving hooks or data loading.

## References
- Specs:
- `docs/specs/communities/plot-and-scene-plot.md`
- Audit:
- `docs/handoff/2026-06-30_structural-integrity-cleanup-audit.md`
