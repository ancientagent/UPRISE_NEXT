# Onboarding Home Scene Same-State Proxy Resolution

Date: 2026-07-08
Branch: `feat/onboarding-homescene-e2e-runtime`
Base: `main` @ `ebbf317`
Owner: Codex local / external executor patch reviewed locally

## Summary

Fixed onboarding proxy Home Scene resolution so same-state active major-node scenes are selected as the eligible candidate set before distance ranking. This aligns runtime with `docs/specs/users/onboarding-home-scene-resolution.md`: cross-state proxy assignment is allowed only when no same-state active major-node exists for the selected music community.

No provider state, database state, schema, migrations, seeds, or art assets were touched.

## Runtime Issue

`apps/api/src/onboarding/onboarding.service.ts` previously ranked PostGIS distance first and only used same-state matching as a later tiebreaker. A nearer cross-state city could beat a farther same-state city, even though the owner spec requires same-state active candidates to discard cross-state candidates before distance ranking.

A second edge case existed when a same-state active scene lacked a geofence but a cross-state scene had one: the geospatial query could return the cross-state candidate before the deterministic same-state fallback ran.

## Fix

- Query for same-state active city-tier candidates before geospatial ranking.
- Use the same-state presence as an eligibility gate inside the PostGIS query.
- Remove the ineffective `CASE WHEN lower(state)` distance tiebreaker.
- Preserve distance ordering within the eligible set.
- Preserve deterministic member/name/id fallback when geocoding or geofenced candidate data is unavailable.

## Files Changed

- `apps/api/src/onboarding/onboarding.service.ts`
- `apps/api/test/onboarding.home-scene-resolution.test.ts`
- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-07-08_onboarding-homescene-same-state-proxy.md`

## Tests Added / Updated

- Added regression coverage proving a same-state proxy wins over a nearer cross-state proxy.
- Added regression coverage proving cross-state proxy remains eligible when no same-state active scene exists.
- Updated one existing assertion that encoded a query-count implementation detail. The test now asserts the real contract: distance ranking beats member count within the eligible candidate set.

## Validation

Run in this branch:

```bash
pnpm --filter api test -- onboarding.home-scene-resolution.test.ts onboarding.music-community-request.test.ts onboarding-location-smoke-safety.test.ts --runInBand
pnpm --filter web test -- onboarding-page-lock.test.ts onboarding-regression-lock.test.ts onboarding-review-resolution.test.ts --runInBand
pnpm run smoke:onboarding-location:dry-run
pnpm --filter web typecheck
pnpm --filter api typecheck
pnpm run docs:lint
git diff --check
pnpm run workspace:audit
```

## Remaining Caveat

The new tests mock Prisma/PostGIS behavior and assert query shape plus runtime selection. A live PostGIS integration run would be the final proof of the SQL predicate against a real database, but live database execution was intentionally out of scope for this task.

## Not Fixed Here

- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md` still has a typo pointing at `apps/api/src/onboarding/onboarding.contselector.ts`; this is a separate one-line docs cleanup.
- Existing onboarding tag compatibility/dead-code cleanup around `tasteTag` / `appliedTags` remains out of scope.
