# Activation Cutover Transaction Revalidation

**Date:** 2026-06-29  
**Branch:** `fix/activation-cutover-revalidation`  
**Mode:** focused implementation hardening after code review  
**Runtime changed:** yes, API service logic only  

## Summary

Manual source-driven Home Scene activation now revalidates activation readiness inside the database transaction before any cutover writes. The transaction uses the revalidated readiness candidate as the cutover authority, reanchors sources by qualifying source IDs, and filters listener cutover rows with normalized `city + state + music community` comparison instead of relying on exact request casing.

This addresses two code-review follow-ups:

- readiness could theoretically change between the pre-transaction diagnostics read and transactional writes;
- exact-case tuple filters could skip source/listener rows when stored tuple casing or spacing differed from the admin request.

## Files Changed

- `apps/api/src/admin-analytics/admin-analytics.service.ts`
- `apps/api/test/admin-analytics.service.test.ts`
- `docs/specs/system/registrar.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-06-29_activation-cutover-transaction-revalidation.md`

## Behavior Locked

- `GET /admin/analytics/activation-readiness` still provides read-only diagnostics.
- `POST /admin/analytics/activation-readiness/activate` still requires the requested tuple to be ready before attempting activation.
- Inside `$transaction`, the service recomputes readiness and aborts if the tuple is no longer ready.
- Inside `$transaction`, an already-active matching city-tier scene still aborts with conflict.
- Source reanchoring uses the qualifying source IDs from the transaction-revalidated readiness candidate.
- Listener cutover reads submitted Home Scene/default music-community candidates and applies normalized tuple comparison in service code.
- Existing tracks, votes, rotation entries, engagement history, and proxy-scene lifecycle data are still not moved.
- Former proxy scenes are still saved as Away Scene context where supported.
- Listener activation notices and `CommunityActivationAudit` rows still record the activated natural tuple and cutover counts.

## Tests Added / Updated

- Updated existing activation cutover expectations for ID-based source reanchoring and normalized listener candidate reads.
- Added regression coverage that activation readiness is revalidated inside the cutover transaction before any writes.
- Added regression coverage that source and listener cutover tolerates casing/spacing differences while preserving the full `city + state + music community` identity.

## Validation

Run in this branch:

```bash
pnpm --filter api test -- admin-analytics.service.test.ts --runInBand
pnpm --filter api run typecheck
```

Both passed before docs were updated. Full repo verification should run before merge:

```bash
pnpm run docs:lint
pnpm run infra-policy-check
pnpm run verify
pnpm --filter api test -- admin-analytics.service.test.ts users.profile.collection.test.ts --runInBand
pnpm --filter web test -- plot-ux-regression-lock.test.ts --runInBand
git diff --check
```

## Boundaries

- No schema migration.
- No provider, database, deployment, or environment state touched.
- No live activation run.
- No changes to threshold values: still `45` approved playable minutes, `5` distinct sources, and `15` minutes max per source.
- No changes to public UI.
