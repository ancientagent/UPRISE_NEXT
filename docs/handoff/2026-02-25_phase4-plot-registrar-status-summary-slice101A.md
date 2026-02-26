# 2026-02-25 — Phase 4 Slice 101A: Plot Registrar Status Summary

## Scope Lock
1. Integrate registrar status read context into Plot UI using existing APIs.
2. Keep `Open Registrar` as the only registrar action in Plot.
3. Add web-only summary logic for registrar entry lifecycle counts.
4. Add targeted unit coverage for summary aggregation.
5. Update spec/changelog/handoff docs for this slice.

## Out of Scope
- New registrar write actions in Plot.
- New registrar API endpoints.
- Any schema migration.
- Social tab implementation.

## Spec Authority
- `docs/specs/system/registrar.md`
  - Web behavior requires registrar entrypoint from Plot civic surfaces and state inspection support.
- `docs/specs/communities/plot-and-scene-plot.md`
  - Plot is civic interface with registrar workflow linkage.

## Changes Implemented
- `apps/web/src/app/plot/page.tsx`
  - Added registrar status-summary load via `listArtistBandRegistrations(token)`.
  - Scene Activity panel now renders:
    - total entries,
    - submitted/materialized counts,
    - pending/queued/sent/failed invite counts,
    - latest registrar status.
  - Preserved existing explicit `Open Registrar` action (no additional CTA added).
- `apps/web/src/lib/registrar/entryStatus.ts`
  - Added `getRegistrarPlotSummary()` aggregation helper and types.
- `apps/web/__tests__/registrar-entry-status.test.ts`
  - Added coverage for summary aggregation and empty-state behavior.
- Docs updated:
  - `docs/specs/communities/plot-and-scene-plot.md`
  - `docs/CHANGELOG.md`

## Validation Commands
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter web test -- registrar-entry-status.test.ts plot-statistics-request.test.ts`
- `pnpm --filter web typecheck`
- `pnpm --filter api typecheck`

## Validation Results
- `pnpm run docs:lint` ✅ passed
- `pnpm run infra-policy-check` ✅ passed
- `pnpm --filter web test -- registrar-entry-status.test.ts plot-statistics-request.test.ts` ✅ passed (2 suites, 11 tests)
- `pnpm --filter web typecheck` ✅ passed
- `pnpm --filter api typecheck` ✅ passed

## Risk / Rollback
- Risk: low; web read-surface enhancement only.
- Rollback: single commit revert; no data/migration coupling.
