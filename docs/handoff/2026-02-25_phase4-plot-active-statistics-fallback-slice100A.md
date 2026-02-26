# 2026-02-25 — Phase 4 Slice 100A: Plot Active-Statistics Fallback

## Scope Lock
1. Improve Plot Statistics behavior when no explicit community anchor is selected.
2. Reuse existing spec-authorized active-scene read endpoint (`GET /communities/active/statistics`).
3. Keep changes web-only and additive.
4. Add targeted unit coverage for request/anchor resolution logic.
5. Update Phase 4 communities spec + changelog.

## Out of Scope
- New Plot/Discover actions or CTA changes.
- New API endpoints.
- Schema migrations.
- Social tab implementation.

## Changes Implemented
- Added request-resolution helper: `apps/web/src/components/plot/statistics-request.ts`.
- Updated `apps/web/src/components/plot/StatisticsPanel.tsx`:
  - uses community-anchored statistics endpoint when selected community exists,
  - falls back to `/communities/active/statistics?tier=...` when no community anchor exists,
  - resolves scene-map anchor id from selected community id or active-scene id from fallback response.
- Added targeted unit tests: `apps/web/__tests__/plot-statistics-request.test.ts`.
- Updated Phase 4 spec note:
  - `docs/specs/communities/plot-and-scene-plot.md`
- Updated `docs/CHANGELOG.md`.

## Validation Commands
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter web test -- plot-statistics-request.test.ts`
- `pnpm --filter web typecheck`
- `pnpm --filter api typecheck`

## Validation Results
- `pnpm run docs:lint` ✅ passed
- `pnpm run infra-policy-check` ✅ passed
- `pnpm --filter web test -- plot-statistics-request.test.ts` ✅ passed (1 suite, 5 tests)
- `pnpm --filter web typecheck` ✅ passed
- `pnpm --filter api typecheck` ✅ passed

## Risk / Rollback
- Risk: low; web read-path fallback only, no API/schema contract change.
- Rollback: single commit revert; no migration/data impact.
