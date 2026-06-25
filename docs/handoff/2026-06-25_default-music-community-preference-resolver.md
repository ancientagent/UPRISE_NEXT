# 2026-06-25 Default Music-Community Preference Resolver

## Summary

Added the first shared API read-path inversion primitive for the Music-Community Preference compatibility cleanup plan.

`MusicCommunityPreferenceResolverService` resolves a user's default music community by preferring `UserMusicCommunityPreference.isDefault` and falling back to `User.homeSceneCommunity` for older/compatibility rows.

Fair Play vote authority now uses this resolver for exact Home Scene matching, so an explicit default/starred music-community preference can override a stale `homeSceneCommunity` compatibility value without breaking older users.

## Files Changed

- `apps/api/src/users/music-community-preference-resolver.service.ts`
- `apps/api/src/users/users.module.ts`
- `apps/api/src/fair-play/fair-play.module.ts`
- `apps/api/src/fair-play/fair-play.service.ts`
- `apps/api/test/music-community-preference-resolver.service.test.ts`
- `apps/api/test/fair-play.vote.test.ts`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-06-25_default-music-community-preference-resolver.md`

## Runtime Behavior

- Explicit default preference row wins when present.
- `User.homeSceneCommunity` remains the compatibility fallback.
- Fair Play exact Home Scene vote matching now uses the resolved default music community.
- Registered-preference voting, proxy-scene voting, GPS gating, and non-city-tier vote rejection remain unchanged.

## Test Coverage

- Added resolver unit coverage for:
  - explicit default preference over compatibility field
  - supplied compatibility fallback
  - loaded compatibility fallback
  - no preference/no fallback returns `null`
- Added Fair Play regression coverage proving a user with `homeSceneCommunity='Punk'` and default preference `Metal` can cast an exact Austin Metal Home Scene vote without falling into the registered-preference helper path.
- Tightened Fair Play test setup from `clearAllMocks` to `resetAllMocks` so default-preference mock values cannot leak across vote cases.

## Validation

Passed in this branch:

- `pnpm --filter api test -- music-community-preference-resolver.service.test.ts fair-play.vote.test.ts --runInBand` - 17 tests passed
- `pnpm --filter api typecheck` - passed
- `pnpm run docs:lint` - passed
- `pnpm run infra-policy-check` - passed
- `git diff --check` - passed

## Boundaries

- No schema changes.
- No provider, DB, seed, migration, deploy, or browser commands.
- No removal of compatibility fields.
- Onboarding GPS, Registrar/source origin, Discover context, communities reads, and broader user/profile reads still need follow-up read-path inversion.
