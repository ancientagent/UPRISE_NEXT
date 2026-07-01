# Resolver / Onboarding Branch Review

Date: 2026-07-01
Branch: `docs/active-pm-resolver-onboarding-review`
Base: `main` @ `83108f1`
Mode: read-only branch review plus Active PM update

## Summary

Reviewed the resolver/onboarding branches that remained in the preserve/review queue after cleanup.

Result: do not merge these branches wholesale. Current `main` already contains the behavior they were created for, and their branch snapshots are stale enough that applying them would remove current migrations, smoke scripts, Active PM docs, and/or tracked art assets.

## Branches Reviewed

- `fix/fair-play-resolver-di-staging`
- `feat/default-music-community-preference-resolver`
- `feat/preference-resolver-runtime-adoption`
- `feat/missing-community-request-intake`

## Evidence

Current `main` already has:

- `MusicCommunityPreferenceResolverService` in `apps/api/src/users/music-community-preference-resolver.service.ts`
- Fair Play module DI coverage in `apps/api/test/fair-play.module.test.ts`
- missing-community request schema, endpoint, service, web UI, and tests
- owner-spec and brief references for resolver/intake behavior

Snapshot diffs from current `main` to the reviewed branches show broad stale reversions, including deletions of later migrations, smoke scripts, Active PM docs, and tracked art assets. Those branches are therefore cleanup candidates after explicit approval, not merge/cherry-pick candidates.

## Verification

```bash
pnpm --filter api test -- fair-play.module.test.ts music-community-preference-resolver.service.test.ts onboarding.music-community-request.test.ts onboarding.home-scene-resolution.test.ts --runInBand
```

Result: 4 suites passed, 16 tests passed.

## Boundaries Preserved

- No branch deleted.
- No worktree removed.
- No provider/env/database/schema/runtime code changed.
- No `art/` file touched.
