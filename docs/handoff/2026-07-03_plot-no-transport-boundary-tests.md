# 2026-07-03 Plot No-Transport Boundary Tests

## Summary

Added the `UPRISE-PLAN-003` regression lock for the no-general-transport boundary inside Plot.

This is a test/docs-only slice. Runtime behavior was not changed.

## Scope

- Locked that Plot is not a general Discover/Away Scene transport surface.
- Locked that the Home Scene selector switches/selects/tunes among registered Home Scene music-community preferences only.
- Locked that saved Away Scenes stay profile-only and saved/custom Uprises are not launched from Plot profile/top shell.
- Locked Archive and Events against map view, Seek mode, saved-Uprise launchers, or travel-href style transport affordances.
- Preserved the existing implementation detail that Home Scene selector selection uses the current `tuneDiscoverScene` client path while remaining UI-framed as Home Scene selection, not transport.

## Files Changed

- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-07-03_plot-no-transport-boundary-tests.md`
- `.reliant/queue/uprise-development-plan-r1.json`
- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`

## Validation

Commands run and passed:

```bash
pnpm --filter web test -- plot-ux-regression-lock.test.ts --runInBand
pnpm --filter web typecheck
pnpm run docs:lint
pnpm run workspace:audit
git diff --check
```

## Notes

- No provider, DB, schema, migration, art, or runtime behavior was touched.
- `UPRISE-PLAN-003` should be completed in the Reliant queue after validation passes.
