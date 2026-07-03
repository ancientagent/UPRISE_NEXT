# Activation Readiness Transaction Revalidation

Date: 2026-07-03

Branch: `test/activation-readiness-transaction-revalidation`

Task: `UPRISE-PLAN-007`

## Summary

This slice closes the activation readiness transaction-revalidation follow-up from the development plan. Current `main` already recomputed activation readiness diagnostics inside the activation cutover transaction before creating/activating the natural scene, reanchoring sources, saving former proxy scenes, creating activation notices, rerooting listeners, or writing the activation audit.

The runtime path remains unchanged. This branch adds a tighter regression assertion proving the full diagnostics path is executed twice: once for admin-facing preflight diagnostics and once inside the transaction immediately before writes.

## Contract Verified

- `AdminAnalyticsService.activateReadyCommunity` keeps outer diagnostics for admin UX/preflight.
- The transaction calls `buildActivationReadinessDiagnostics(tx)` before scene/source/listener/audit writes.
- If the tuple is no longer ready inside the transaction, activation aborts with `Activation readiness threshold has not been met`.
- The stale transaction candidate path does not create/update `Community`, reanchor `ArtistBand`, or reroot `User` rows.
- No provider, database, schema, migration, or art state was touched.

## Files Changed

- `apps/api/test/admin-analytics.service.test.ts`
- `docs/CHANGELOG.md`
- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`
- `.reliant/queue/uprise-development-plan-r1.json`

## Validation

Planned validation:

```bash
pnpm --filter api test -- admin-analytics.service.test.ts --runInBand
pnpm --filter api typecheck
pnpm run docs:lint
pnpm run workspace:audit
git diff --check
```

## Follow-Up

No code follow-up is required for this race-condition item. `UPRISE-PLAN-008` remains queued for normalized activation tuple matching closeout.
