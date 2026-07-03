# 2026-07-03 Feed Blast Card Source-Link Contract Tests

## Summary

Added the `UPRISE-PLAN-001` regression lock for Feed Blast card source-link behavior.

This is a test/docs-only slice. Runtime behavior was not changed.

## Scope

- Locked that listener `Blast` cards are Feed rows, not a separate Plot tab, panel, destination, or discovery insert.
- Locked that the existing `SeedFeedPanel` source metadata branch links source-backed non-track feed rows to `/artist-bands/${source.id}`.
- Tied the runtime lock back to `docs/specs/communities/plot-and-scene-plot.md` and `docs/specs/communities/discovery-scene-switching.md`.
- Kept Travel launch/deferred behavior untouched; this slice does not activate Travel UI.

## Files Changed

- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-07-03_feed-blast-card-source-link-contract-tests.md`
- `.reliant/queue/uprise-development-plan-r1.json`
- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`

## Validation

Commands run and passed:

```bash
pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tab-contracts.test.ts --runInBand
pnpm --filter web typecheck
pnpm run docs:lint
pnpm run workspace:audit
git diff --check
```

## Notes

- No provider, DB, schema, migration, art, or runtime behavior was touched.
- `UPRISE-PLAN-001` should be completed in the Reliant queue after validation passes.
