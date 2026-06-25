# Music-Community Preference Runtime Parity Audit

Date: 2026-06-25
Branch: audit/music-community-preference-runtime-parity
Base: main @ a65d457
Slice: Music-Community Preference runtime parity audit refresh

## Summary

Re-audited current `main` against `docs/specs/users/onboarding-home-scene-resolution.md#music-community-preference-contract` after PR #116 merged.

Result: the runtime now implements the main preference/default/roller/voting-scope foundation that the earlier audit listed as missing. The remaining compatibility work is narrower: centralize default-preference reads, invert remaining read paths away from direct `User.homeSceneCommunity` dependency where safe, and make onboarding/default-preference write paths keep the compatibility shadow in sync until schema cleanup is explicitly approved.

No runtime code, schema, migration, provider, DB, seed, deploy, or browser action was performed in this audit refresh.

## Evidence Checked

Owner contracts and briefs:

- `docs/specs/users/onboarding-home-scene-resolution.md#music-community-preference-contract`
- `docs/specs/users/onboarding-home-scene-resolution.md#compatibility-cleanup-plan-2026-06-25`
- `docs/specs/broadcast/radiyo-and-fair-play.md#proxy-cutover-and-lifecycle-join-points`
- `docs/specs/system/registrar.md#source-origin-contract`
- `docs/PLATFORM_START_HERE.md`

Runtime/schema:

- `apps/api/prisma/schema.prisma`
- `apps/api/src/users/users.controller.ts`
- `apps/api/src/users/users.service.ts`
- `apps/api/src/fair-play/fair-play.service.ts`
- `apps/api/src/onboarding/onboarding.service.ts`
- `apps/web/src/lib/users/client.ts`
- `apps/web/src/app/plot/page.tsx`

Tests inspected:

- `apps/api/test/users.profile.collection.test.ts`
- `apps/api/test/fair-play.vote.test.ts`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `apps/web/__tests__/users-client.test.ts`

## Confirmed Current Runtime

- `UserMusicCommunityPreference` exists with unique `{userId, musicCommunity}`, default/star flag, cascade relation to `User`, and a `userId/isDefault` index.
- `UsersController` exposes authenticated current-user endpoints:
  - `GET /users/me/music-community-preferences`
  - `POST /users/me/music-community-preferences`
  - `POST /users/me/music-community-preferences/default`
  - `GET /users/me/home-scene-roller`
- `UsersService.listMusicCommunityPreferences` lazily seeds the current `User.homeSceneCommunity` as a default preference when no preference rows exist.
- `UsersService.addMusicCommunityPreference` adds a preference without stealing the default when preferences already exist.
- `UsersService.setDefaultMusicCommunityPreference` flips the default/star row transactionally inside `UserMusicCommunityPreference`.
- `UsersService.getHomeSceneRoller` resolves registered preferences against `User.homeSceneCity/homeSceneState`: exact active natural city scene first, same-state active proxy second, any active proxy third, unresolved preferences excluded.
- `/plot` loads profile music-community preferences and lets the listener add approved parent communities and mark a default.
- `/plot` labels profile preferences as `In Home Scene Roller` or `Profile-only until active scene`.
- `/plot` renders `data-slot="home-scene-roller"` and uses `getHomeSceneRoller(token)`, `getCommunityById(item.sceneId, token)`, and `tuneDiscoverScene(item.sceneId, token)` when selecting a roller item.
- Fair Play voting now allows registered preference votes that resolve to the user's current/default city natural scene or active proxy scene, and rejects unregistered preferences, unresolved visitor scenes, and non-city-tier vote targets.
- Current tests cover preference seeding, add/default behavior, roller resolution/exclusion, profile UI labels, roller selection wiring, registered preference voting, same-state proxy voting, unregistered preference rejection, unresolved wrong-scene rejection, and non-city-tier vote rejection.

## Remaining Parity Gaps

### P1 — Default-preference read-path inversion still pending

Current runtime still reads `User.homeSceneCommunity` directly in multiple owner-paths:

- `apps/api/src/onboarding/onboarding.service.ts` uses `homeSceneCommunity` for GPS verification and still writes it as the compatibility Home Scene music-community field.
- `apps/api/src/fair-play/fair-play.service.ts` selects and compares `homeSceneCommunity` for exact Home Scene voting before it checks registered preferences.
- `apps/api/src/communities/communities.service.ts` still uses `homeSceneCommunity` for discover context and set-home-scene compatibility behavior.
- Registrar/source-origin tests and services still rely on the user compatibility fields for source-origin scope.

This is expected per the compatibility cleanup plan, but the next runtime slice should add a shared server-side default music-community preference resolver and update read paths to prefer `UserMusicCommunityPreference.isDefault`, with `User.homeSceneCommunity` only as fallback.

### P1 — Write-path sync is incomplete

`POST /onboarding/home-scene` writes `User.homeSceneCommunity` and `User.tunedSceneId`, but does not upsert the equivalent default `UserMusicCommunityPreference` row in the same transaction. The list endpoint can lazily seed the row later, but onboarding/default semantics should eventually write the preference model first and keep `homeSceneCommunity` as a compatibility shadow.

`POST /users/me/music-community-preferences/default` updates the preference default/star rows, but it does not update `User.homeSceneCommunity` as a shadow. That is acceptable for profile UI, but compatibility read paths that still consult `homeSceneCommunity` will not see the changed default until read-path inversion is implemented.

### P2 — No dedicated staging data audit yet

The owner spec requires staging verification before schema cleanup: every user with `homeSceneCommunity` should have an equivalent default preference row, and every default preference should resolve or remain profile-only according to the roller contract. No staging data audit was run in this slice.

## Updated Parity Status

Former missing items that are now implemented:

1. Profile-held preference persistence — implemented.
2. Add/list preference API and typed web wrappers — implemented.
3. Explicit default/star selection — implemented in the preference model and `/plot` UI.
4. Current-city resolution for registered preferences — implemented in `getHomeSceneRoller`.
5. Home Scene roller read model — implemented.
6. Unresolved preference profile visibility without roller inclusion — implemented.
7. GPS voting scope across registered preferences in verified/default city — implemented in Fair Play tests/runtime.
8. Migration/backfill foundation from `User.homeSceneCommunity` — implemented as migration + lazy service fallback, with further write-path sync pending.

Still pending:

1. Shared resolver for default music-community preference with `homeSceneCommunity` fallback.
2. Read-path inversion across onboarding GPS, Fair Play, Registrar/source origin, Discover/communities, and user/profile reads.
3. Write-path sync so onboarding and default-preference mutations keep the preference model and compatibility field aligned.
4. Staging data audit before any schema cleanup.
5. Dedicated schema cleanup only after the above are proven.

## Recommended Next Slice

Item 3 from the execution list should proceed next:

1. Add a shared API resolver for the user's default music-community preference.
2. Cover it with tests for explicit default row, fallback to `User.homeSceneCommunity`, and no preference/no fallback.
3. Use it in the safest first read path, likely Fair Play exact Home Scene voting or onboarding GPS verification, while preserving all existing behavior.
4. Do not remove schema fields or change migrations in that slice.

## Validation

Audit refresh validation to run before commit:

- `pnpm run docs:lint`
- `git diff --check`

## Boundaries

- No runtime changes in this audit refresh.
- No schema changes.
- No provider, DB, seed, migration, deploy, or browser commands.
- Existing `art/` untracked assets were not touched.
