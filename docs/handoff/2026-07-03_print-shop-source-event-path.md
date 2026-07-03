# Print Shop Source-Facing Event Path Hardening

Date: 2026-07-03
Branch: `test/print-shop-source-event-path`
Base: `main` @ `1bcbfa7`
Scope: UPRISE Development Plan R1 Task 12

## Summary

Task 12 was completed as a focused tests/docs hardening slice. Runtime already keeps Print Shop event creation source-facing, Plot Events read-only, and Archive Registrar placement above records/status history. This branch strengthens those locks and corrects a stale validation command in the active development plan.

## Files Changed

- `apps/api/test/events.print-shop.service.test.ts`
- `apps/web/__tests__/plot-tab-contracts.test.ts`
- `docs/operations/UPRISE_DEVELOPMENT_PLAN_R1.md`
- `docs/operations/ACTIVE_PM.md`
- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-07-03_print-shop-source-event-path.md`

## Product Boundaries Preserved

- Print Shop remains source-facing event creation infrastructure.
- Artist/Band Print Shop event writes require an explicitly selected managed source context.
- Promoter capability may create promoter-lane events without `artistBandId`.
- Plot Events remains read-only and does not link to event creation or Print Shop.
- Archive keeps Registrar on top and records/status history below.

## Runtime Impact

None. This branch changes tests and docs only.

No provider, database, schema, migration, art, or environment state was touched.

## Validation

Passed:

```bash
pnpm --filter api test -- events.print-shop.service.test.ts --runInBand
pnpm --filter web test -- plot-tab-contracts.test.ts --runInBand
pnpm --filter web typecheck
pnpm --filter api typecheck
pnpm run docs:lint
pnpm run workspace:audit
git diff --check
```

## Notes

`docs/operations/UPRISE_DEVELOPMENT_PLAN_R1.md` previously pointed Task 12 validation at `events.service.test.ts`, but the current source-facing Print Shop event tests are in `apps/api/test/events.print-shop.service.test.ts`. This branch updates the plan to the real test file.

## Next Signal

After Task 12 merges, return to clean `main` and continue with the next selected UPRISE Development Plan R1 task.
