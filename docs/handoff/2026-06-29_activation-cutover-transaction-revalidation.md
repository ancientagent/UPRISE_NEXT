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

## Post-Merge Staging Closeout

Completed after PR #142 merged to `main` at `9961e93`.

### Deploy

- Fly account verified before deployment: `bariseman@gmail.com`.
- Target app verified before deployment: `uprise-api-staging` under Fly owner `personal`.
- Deployed merged `main` to Fly API staging with:

```bash
~/.fly/bin/flyctl deploy -c fly.api.staging.toml --remote-only
```

- New Fly image: `registry.fly.io/uprise-api-staging:deployment-01KWAGNQ5M73QFMN4P7N31MZMF`
- Machine: `2870191f055128`
- Machine version after deploy: `20`
- Region: `ord`
- Fly machine health checks: `2 total, 2 passing`

### Read-Only Smoke Results

API health smoke:

```bash
UPRISE_API_URL=https://uprise-api-staging.fly.dev \
UPRISE_EXPECTED_CORS_ORIGIN=https://uprise-web-staging.vercel.app \
pnpm run smoke:staging:api
```

Result: passed.

- `/health/live`: `200`
- `/health/db`: `200`, connected to Neon/Postgres
- `/health/postgis`: `200`, PostGIS installed and spatial test passed
- `/health/ready`: `200`
- CORS allow-origin matched `https://uprise-web-staging.vercel.app`

Full staging readiness smoke:

```bash
UPRISE_API_URL=https://uprise-api-staging.fly.dev \
UPRISE_WEB_URL=https://uprise-web-staging.vercel.app \
UPRISE_EXPECTED_CORS_ORIGIN=https://uprise-web-staging.vercel.app \
pnpm run smoke:staging:readiness
```

Result: passed.

- Stable web load: `200`
- API health/DB/PostGIS/readiness: passed
- CORS preflight: `204`, allow-origin matched stable web origin
- Places behavior: passed; Austin reverse geocode returned `Austin, Texas 78701`

Activation-readiness read smoke:

- Ran from inside the Fly machine with a short-lived JWT signed from the runtime `JWT_SECRET`.
- Endpoint: `GET /admin/analytics/activation-readiness`
- Writes API: `false`
- Writes database: `false`
- Status: `200`
- Candidate count: `0`
- Ready count: `0`
- Thresholds returned:
  - required playable seconds: `2700`
  - required playable minutes: `45`
  - required distinct sources: `5`
  - max playable seconds per source: `900`
  - max playable minutes per source: `15`

Hosted Prisma migration status:

```bash
~/.fly/bin/flyctl ssh console -a uprise-api-staging -C "/bin/sh -lc 'cd /app && ./node_modules/.bin/prisma migrate status --schema prisma/schema.prisma'"
```

Result: passed.

- Database: `uprise_staging`
- Migrations found: `22`
- Status: `Database schema is up to date!`

### Write-Smoke Decision

No controlled activation write smoke was run.

Reason: staging currently has `0` activation candidates and `0` ready candidates. Creating an artificial ready candidate would require writing source/track/community state into staging solely to trigger a destructive activation path. That should be handled only by a dedicated fixture-backed activation smoke with an explicit setup/cleanup design, not as an ad hoc post-deploy check.

### Boundary Confirmation

- No schema migration was run.
- No seed command was run.
- No activation write was run.
- No provider secrets or environment variables were changed.
- No temporary users, sources, tracks, communities, votes, or activation audit rows were created.
