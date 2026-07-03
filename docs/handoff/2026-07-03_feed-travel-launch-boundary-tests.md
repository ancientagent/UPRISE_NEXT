# 2026-07-03 Feed Travel Launch-Boundary Tests

## Summary

Added the `UPRISE-PLAN-002` regression lock for Feed-card `Travel` launch boundaries.

This is a test/docs-only slice. Runtime behavior was not changed.

## Scope

- Locked that Feed-card `Travel` is future-safe contract language for eligible outside-Uprise cards, not current launch activation.
- Locked that source-link/listen behavior remains separate from `Travel` handoff semantics in the owner specs.
- Confirmed current Feed/Plot runtime does not expose `Travel`, `travelHref`, `/discover` links from Feed cards, or general Plot transport slots.
- Confirmed current Discover remains a `Coming Soon` / local-community-only placeholder.

## Files Changed

- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-07-03_feed-travel-launch-boundary-tests.md`
- `.reliant/queue/uprise-development-plan-r1.json`
- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`

## Validation

Commands run and passed:

```bash
pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tab-contracts.test.ts --runInBand
pnpm run docs:lint
pnpm run workspace:audit
git diff --check
```

## Notes

- No provider, DB, schema, migration, art, or runtime behavior was touched.
- `UPRISE-PLAN-002` should be completed in the Reliant queue after validation passes.
