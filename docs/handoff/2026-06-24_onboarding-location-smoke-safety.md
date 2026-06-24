# 2026-06-24 Onboarding Location Smoke Safety

## Status

Implemented on branch `test/onboarding-home-scene-smoke`.

## Why

The launch audit called for staging-safe onboarding/Home Scene verification. The existing `smoke:onboarding-location` script was useful but could be accidentally aimed at a non-local API. That smoke registers temporary users and cleans them up through the configured Prisma database, so it needed a safer preflight and a no-write planning mode.

## Changed

- `apps/api/scripts/smoke-onboarding-location.mjs`
  - Added `--dry-run` mode that prints the smoke plan without API calls, Prisma connection, user creation, or database cleanup.
  - Added non-local API protection. If `UPRISE_API_URL` is not localhost/127.0.0.1, the full smoke refuses to run unless `UPRISE_CONFIRM_ONBOARDING_SMOKE=smoke-onboarding-location:<api-host>` is set.
  - Moved Prisma client creation behind runtime use so dry-run mode stays no-DB.
- `apps/api/package.json`
  - Added `smoke:onboarding-location:dry-run`.
- `package.json`
  - Added root `smoke:onboarding-location:dry-run`.
- `apps/api/test/onboarding-location-smoke-safety.test.ts`
  - Added static safety coverage for remote confirmation and dry-run no-write guarantees.
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
  - Added dry-run and smoke-safety verification guidance.
- `docs/CHANGELOG.md`
  - Added this slice to Unreleased.

## Current Contract

Routine local onboarding/Home Scene smoke workflow:

```bash
pnpm run smoke:onboarding-location:dry-run
UPRISE_LOCATION_PROVIDER=fake pnpm --filter api run smoke:onboarding-location
```

Non-local/staging full smoke requires explicit target confirmation:

```bash
UPRISE_API_URL=https://<api-host> \
UPRISE_CONFIRM_ONBOARDING_SMOKE=smoke-onboarding-location:<api-host> \
pnpm --filter api run smoke:onboarding-location
```

Only set that confirmation after verifying `UPRISE_API_URL` and `DATABASE_URL` target the intended staging environment. Do not use this smoke against production.

## Validation

Passed:

```bash
pnpm --filter api run smoke:onboarding-location:dry-run
pnpm --filter api test -- onboarding-location-smoke-safety.test.ts onboarding.home-scene-resolution.test.ts onboarding.music-community-request.test.ts
```

Pending before PR/merge closeout:

```bash
pnpm --filter api typecheck
pnpm run docs:lint
pnpm run infra-policy-check
git diff --check
```

## Notes

This slice does not run a live smoke, seed data, migrate a database, change provider configuration, or call Google Places. It only makes the existing smoke safer and easier to inspect before use.
