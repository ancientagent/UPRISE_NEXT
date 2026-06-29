# 2026-06-29 Authenticated Onboarding Persistence Smoke

## Status

Branch: `test/authenticated-onboarding-staging-smoke`
Base: `main` at `62dd1ab`

Runtime changed: no API request/response behavior changed
Provider state changed: no
Database writes run during implementation: no
Secrets read or changed: no

## Summary

This slice adds a repeatable authenticated onboarding persistence smoke command.
It verifies the gap left after signed-out onboarding QA: a real authenticated
user can persist Home Scene state through the API, log in again, and still read
the expected default music-community preference and Home Scene Roller state.

## Scope

In scope:

- Temporary authenticated user registration through `/auth/register`.
- Home Scene persistence through `/onboarding/home-scene`.
- Reload simulation through `/auth/login`.
- Authenticated readback through:
  - `/users/me/music-community-preferences`
  - `/users/me/home-scene-roller`
- DB assertions for persisted Home Scene fields, `tunedSceneId`,
  `gpsVerified`, default preference, and membership.
- Cleanup through Prisma with temporary `CommunityMember` removal and
  `memberCount` decrement.

Scenarios:

- `manual_austin_gps_skipped_persists_after_login`
- `manual_austin_gps_verified_persists_after_login`
- `manual_el_paso_proxy_persists_after_login`

Out of scope:

- Browser automation.
- Real user accounts.
- Provider secret changes.
- Production database writes.

## Commands

Dry-run, no writes:

```bash
pnpm --filter api run smoke:onboarding-auth-persistence:dry-run
```

Non-local staging run requires host/database-scoped confirmation:

```bash
UPRISE_API_URL=https://uprise-api-staging.fly.dev \
UPRISE_CONFIRM_AUTH_ONBOARDING_SMOKE=smoke-authenticated-onboarding:uprise-api-staging.fly.dev:uprise_staging \
pnpm --filter api run smoke:onboarding-auth-persistence
```

The script reads the actual connected database name via Prisma before allowing
non-local writes. If `DATABASE_URL` points anywhere other than the intended
database, the required confirmation string changes and the command refuses to
run.

## Validation

Implementation validation run:

```bash
pnpm --filter api run smoke:onboarding-auth-persistence:dry-run
pnpm --filter api test -- onboarding-location-smoke-safety.test.ts
pnpm --filter api typecheck
pnpm run docs:lint
git diff --check
```

Result: passed.

The full authenticated staging smoke was not run during implementation because
it writes temporary users/memberships to the target API/database pair. Run it
only after confirming `UPRISE_API_URL` and `DATABASE_URL` point at the intended
staging environment.

## Carry-Forward

After merge, run the staging command above against Fly API staging and Neon
`uprise_staging`, then record whether temporary users and memberships were
cleaned up.
