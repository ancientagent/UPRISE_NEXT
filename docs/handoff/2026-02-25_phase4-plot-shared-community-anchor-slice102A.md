# 2026-02-25 — Phase 4 Slice 102A: Plot Shared Community Anchor

## Scope Lock
1. Keep Plot panel community context consistent across Statistics and Top Songs.
2. Remove duplicate local community anchor state from `StatisticsPanel`.
3. Keep behavior additive and action-neutral (no new CTA/button).
4. Preserve existing active-scene fallback behavior.
5. Update spec/changelog/handoff docs.

## Out of Scope
- New API endpoints.
- New Plot tabs/actions.
- Social tab implementation.
- Schema/data migration changes.

## Changes Implemented
- `apps/web/src/components/plot/StatisticsPanel.tsx`
  - Converted to controlled selected-community flow (`selectedCommunity` prop).
  - Removed internal selected-community state to prevent panel-local anchor drift.
  - Keeps existing nearby discovery and active statistics fallback behavior.
- `apps/web/src/app/plot/page.tsx`
  - Passes page-level `selectedCommunity` into `StatisticsPanel`.
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
- Risk: low; web state-flow consistency change, no API/schema changes.
- Rollback: single commit revert.
