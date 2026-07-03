# Onboarding/Home Scene Smoke Hardening

Date: 2026-07-03
Branch: `test/onboarding-home-scene-smoke-hardening`
Base: `origin/main` @ `cc57dc5`
Task: `UPRISE-PLAN-004`

## Summary

Added focused smoke-hardening regression coverage for onboarding/Home Scene behavior without changing runtime behavior, provider state, database state, schema, or art assets.

This slice locks two launch-critical edges in the queued onboarding suites:

- GPS before Home Scene selection stores coordinates but fails closed with `NO_HOME_SCENE` and does not grant voting.
- Denying/skipping GPS keeps manual city/state Home Scene entry available and keeps voting disabled until verification succeeds.

Existing selector read-model coverage was verified in the same slice instead of duplicating selector behavior into onboarding tests.

## Current Product Contract Preserved

- Home Scene identity remains `city + state + music community`.
- Manual city/state selection remains valid even when GPS is denied or skipped.
- GPS gates voting rights only; it is not required for ordinary onboarding participation.
- GPS-first verification cannot grant voting before a Home Scene exists.
- Inactive/missing submitted locations resolve to active proxy/major-node scenes without creating a listener-side community.
- Home Scene selector items come from registered music-community preferences that resolve in the current/default city; unresolved preferences remain profile-only.

## Files Changed

- `apps/api/test/onboarding.home-scene-resolution.test.ts`
  - Added coverage for the `NO_HOME_SCENE` GPS path before Home Scene selection.
- `apps/web/__tests__/onboarding-regression-lock.test.ts`
  - Added coverage that GPS deny/skip leaves manual city/state onboarding available and voting disabled.
- `docs/CHANGELOG.md`
  - Added this Task 4 slice entry.
- `docs/handoff/2026-07-03_onboarding-home-scene-smoke-hardening.md`
  - Added this handoff.

## Existing Coverage Re-Verified

- `apps/api/test/onboarding.home-scene-resolution.test.ts`
  - exact active scene anchor
  - state normalization
  - default music-community preference write
  - inactive same-state proxy assignment
  - missing tuple fallback without Community creation
  - distance-based fallback
  - exact geofence GPS verification
  - submitted-location fallback GPS verification
  - submitted-location mismatch failure
  - geocoder-unavailable failure
- `apps/api/test/onboarding.music-community-request.test.ts`
  - missing music-community intake does not create live `Community` rows.
- `apps/api/test/users.profile.collection.test.ts`
  - Home Scene selector resolves registered preferences and excludes unresolved preferences.
- `apps/api/test/onboarding-location-smoke-safety.test.ts`
  - dry-run onboarding smoke covers manual denied-GPS, GPS-first, and proxy fallback scenarios without API/database writes.
- `apps/web/__tests__/onboarding-review-resolution.test.ts`
  - client-side review keeps exact active scene, same-state fallback, and cross-state fallback behavior deterministic.
- `apps/web/__tests__/users-client.test.ts`
  - typed web wrapper calls `GET /users/me/home-scene-selector`.
- `apps/web/__tests__/onboarding-page-lock.test.ts`
  - GPS-first flow rechecks stored coordinates after Home Scene submit.

## Validation

Passed:

```bash
pnpm --filter api test -- onboarding.home-scene-resolution.test.ts onboarding.music-community-request.test.ts users.profile.collection.test.ts onboarding-location-smoke-safety.test.ts --runInBand
```

Result: 4 suites passed, 30 tests passed.

```bash
pnpm --filter web test -- onboarding-regression-lock.test.ts onboarding-review-resolution.test.ts users-client.test.ts onboarding-page-lock.test.ts --runInBand
```

Result: 4 suites passed, 16 tests passed.

Closeout validation passed:

```bash
pnpm run docs:lint
pnpm run workspace:audit
git diff --check
```

## Runtime / Provider / Schema Impact

- Runtime behavior changed: no.
- Provider state touched: no.
- Database state touched: no.
- Schema/migration touched: no.
- Art/assets touched: no.

## Next Slice

Continue to `UPRISE-PLAN-005`: Registrar/source GPS authority hardening.
