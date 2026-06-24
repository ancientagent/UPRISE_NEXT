# 2026-06-24 — Staging Readiness And Seed Safety

Branch: `chore/staging-readiness-and-seed-safety`
Mode: non-destructive repo-side guardrail slice
Runtime changed: no product UI/API behavior changed
Provider state changed: no
Database writes run: no

## Summary

This slice turns the audit recommendation into repo-visible safety rails before the next hosted-stack work:

- Added a read-only staging API health smoke command.
- Added a dry-run launch community seed command that prints the planned `48` city-tier community/geofence records without connecting to Prisma.
- Added a non-local `DATABASE_URL` confirmation gate before the write seed can run.
- Updated deployment and seed docs so future agents use the same safe order.

## Files Changed

- `apps/api/package.json`
- `apps/api/prisma/seed.ts`
- `apps/api/scripts/smoke-staging-api.mjs`
- `apps/api/src/seed/launch-community-seed-safety.ts`
- `apps/api/test/launch-community-seed-safety.test.ts`
- `package.json`
- `docs/CHANGELOG.md`
- `docs/DEPLOY_ACCOUNT_SETUP_CHECKLIST_R1.md`
- `docs/DEPLOY_ENV_MATRIX_R1.md`
- `docs/specs/seed/README.md`
- `docs/handoff/2026-06-24_staging-readiness-and-seed-safety.md`

## Seed Safety Contract

Safe inspection command:

```bash
pnpm --filter api run seed:launch-communities:dry-run
```

Write command for local dev database targets:

```bash
pnpm --filter api run seed:launch-communities
```

Write command for non-local targets requires explicit database-name confirmation:

```bash
DATABASE_URL="<confirmed target URL>" \
UPRISE_CONFIRM_LAUNCH_COMMUNITY_SEED=seed-launch-communities:<database_name> \
pnpm --filter api run seed:launch-communities
```

For the documented Neon staging database, the expected confirmation value is:

```bash
UPRISE_CONFIRM_LAUNCH_COMMUNITY_SEED=seed-launch-communities:uprise_staging
```

The confirmation variable is only a guardrail. It does not replace visible provider verification of the Neon project, branch, database, and connection string target.

## Staging Smoke Contract

Read-only API health smoke:

```bash
UPRISE_API_URL=https://uprise-api-staging.fly.dev pnpm run smoke:staging:api
```

Optional CORS check:

```bash
UPRISE_API_URL=https://uprise-api-staging.fly.dev \
UPRISE_EXPECTED_CORS_ORIGIN=<confirmed web origin> \
pnpm run smoke:staging:api
```

The smoke checks only:

- `/health/live`
- `/health/db`
- `/health/postgis`
- `/health/ready`

It does not authenticate, seed, migrate, deploy, or mutate state.

## Validation

Run for this slice:

```bash
pnpm --filter api test -- launch-community-seed.test.ts launch-community-seed-safety.test.ts
pnpm --filter api run seed:launch-communities:dry-run
pnpm --filter api typecheck
pnpm run docs:lint
pnpm run infra-policy-check
git diff --check
```

## Remaining Notes

- No live staging seed was run in this slice.
- No provider state was changed.
- The next hosted-stack slice can use the smoke command to verify API health without touching database contents.
