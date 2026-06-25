# 2026-06-25 Preference Resolver Runtime Adoption

## Summary

Extended the default music-community preference resolver beyond Fair Play into the runtime paths that still depended on the compatibility `User.homeSceneCommunity` field.

The slice keeps compatibility fields intact, but current authority for the user's default music community now comes from `UserMusicCommunityPreference.isDefault` with `User.homeSceneCommunity` fallback in the paths touched here.

## Files Changed

- `apps/api/src/registrar/registrar.service.ts`
- `apps/api/src/registrar/registrar.module.ts`
- `apps/api/src/communities/communities.service.ts`
- `apps/api/src/communities/communities.module.ts`
- `apps/api/src/onboarding/onboarding.service.ts`
- `apps/api/src/auth/auth.service.ts`
- `apps/api/src/admin-analytics/admin-analytics.service.ts`
- `apps/api/scripts/verify-music-community-preferences.ts`
- `apps/api/package.json`
- `package.json`
- focused API tests under `apps/api/test/`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/CHANGELOG.md`

## Runtime Behavior

- Registrar source-origin checks use `MusicCommunityPreferenceResolverService` so a stale `homeSceneCommunity` field does not block a valid default music-community preference.
- Artist/Band Registrar submissions preserve source origin as the submitted city/state plus resolved default music community, including proxy-scene registration.
- Discover/community scene reads use the resolved default preference for Home Scene markers, tuned-scene visitor status, discovery context, and previous Home Scene lookup during `set-home-scene`.
- `POST /discover/set-home-scene` syncs the selected scene music community into `UserMusicCommunityPreference` as the default preference.
- Onboarding `setHomeScene` syncs the selected music community into `UserMusicCommunityPreference` as the default preference.
- Registrar invite-claim registration seeds the invited user's default music-community preference from the invite scene.
- Community activation cutover matches listeners by submitted city/state plus either compatibility `homeSceneCommunity` or default music-community preference.

## Read-Only Audit Command

Added:

```bash
pnpm run verify:music-community-preferences
```

This runs `apps/api/scripts/verify-music-community-preferences.ts` and performs only read queries. It reports:

- total users
- users with Home Scene tuple fields
- users with default preferences
- users with multiple default preferences
- users with Home Scene tuple fields but no default preference
- users whose default preference differs from compatibility `homeSceneCommunity`

Set `UPRISE_PREFERENCE_AUDIT_REPORT_ONLY=1` to force JSON reporting without failing the process on detected drift.

## Validation

Passed during this slice:

```bash
pnpm --filter api test -- registrar.service.test.ts communities.discovery.service.test.ts onboarding.home-scene-resolution.test.ts auth.invite-registration.service.test.ts admin-analytics.service.test.ts music-community-preference-resolver.service.test.ts fair-play.vote.test.ts --runInBand
```

Result: 7 suites passed, 212 tests passed.

Additional verification passed during this slice:

```bash
pnpm --filter api typecheck
pnpm run docs:lint
pnpm run infra-policy-check
git diff --check
pnpm run typecheck
```

Also checked the existing staging CORS blocker:

```bash
UPRISE_WEB_URL=https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app pnpm run smoke:staging:readiness
```

Result: failed on the known provider-side CORS mismatch: expected `https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app`, received `null`.

Local environment had `gh` but no `flyctl`/`fly` or `vercel` CLI, so no provider state could be inspected or changed safely from this branch.

## Boundaries

- No schema changes.
- No migrations.
- No live database audit was run.
- No provider, Fly, Vercel, Neon, seed, deploy, or browser mutation was performed.
- `User.homeSceneCommunity` remains a compatibility shadow and must not be removed until all remaining user/profile/read paths are verified and staging data is clean.
- Source dashboard labels and shared types may still carry compatibility reads; treat those as the next cleanup slice, not part of this branch.
