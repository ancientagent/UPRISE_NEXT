# Registrar Source GPS Authority Hardening

Date: 2026-07-03
Branch: `test/registrar-source-gps-authority-hardening`
Base: `origin/main` @ `c4fa768`
Task: `UPRISE-PLAN-005`

## Summary

Added focused Registrar service coverage to prove GPS verification alone is not enough to create an Artist/Band registration when the user's Home Scene/source-origin tuple is missing.

This slice is test-only. It does not change Registrar runtime behavior, provider state, database state, schema, migrations, or art assets.

## Contract Preserved

- Artist/Band registration requires a GPS-verified user.
- Artist/Band registration also requires an established Home Scene source-origin tuple.
- Source origin remains the submitted natural `city + state + music community`, not the proxy scene where the user/source may operate temporarily.
- Proxy-scene artist registration remains allowed only when it is the assigned same-music-community proxy scene and source-origin fields are preserved separately.
- Materialization re-checks GPS before creating an Artist/Band from unmaterialized entries.
- No listener-side pioneer workflow is added.

## Files Changed

- `apps/api/test/registrar.service.test.ts`
  - Added coverage that a GPS-verified user with missing Home Scene/source-origin fields cannot submit an Artist/Band registration and no Registrar entry/member rows are written.
- `docs/CHANGELOG.md`
  - Added this Task 5 slice entry.
- `docs/handoff/2026-07-03_registrar-source-gps-authority-hardening.md`
  - Added this handoff.

## Existing Coverage Re-Verified

- `apps/api/test/registrar.service.test.ts`
  - rejects non-GPS-verified Artist/Band registration.
  - preserves natural source origin during proxy-scene Artist/Band registration.
  - uses the default music-community preference when compatibility `homeSceneCommunity` is stale.
  - materializes Artist/Band rows with entry source-origin fields.
  - rejects unmaterialized legacy entry materialization when submitter is not GPS verified.
- `apps/api/test/registrar.controller.test.ts`
  - controller delegates Artist/Band submission/materialization and propagates errors.
- `apps/api/test/registrar.dto.test.ts`
  - Artist/Band payload trimming and member field validation remain locked.

## Validation

Passed:

```bash
pnpm --filter api test -- registrar.dto.test.ts registrar.controller.test.ts registrar.service.test.ts --runInBand
```

Result: 3 suites passed, 211 tests passed.

```bash
pnpm --filter api typecheck
```

Result: passed.

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

Continue to `UPRISE-PLAN-006`: Release Deck media eligibility hardening.
