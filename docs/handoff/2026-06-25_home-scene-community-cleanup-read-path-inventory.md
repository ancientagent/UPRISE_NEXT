# `homeSceneCommunity` Cleanup Read-Path Inventory

**Date:** 2026-06-25  
**Branch:** `audit/home-scene-community-cleanup-plan`  
**Base:** `main` at `a65d457`  
**Mode:** docs/runtime inventory; no runtime edits  

## Purpose

This handoff turns the existing Music-Community Preference compatibility cleanup plan into an executable read-path inventory.

The owner spec already defines the policy: `User.homeSceneCommunity` is now the compatibility shadow for the default `UserMusicCommunityPreference.isDefault` row, while `User.homeSceneCity`, `User.homeSceneState`, `User.tunedSceneId`, and `User.tunedSceneUpdatedAt` remain active authority fields.

This inventory identifies where `homeSceneCommunity` is still read or written so the cleanup can be sequenced without breaking onboarding, voting, source registration, activation cutover, Discover, or profile/roller behavior.

## Current Usage Summary

Runtime source files containing `homeSceneCommunity`:

- `apps/api/src/onboarding/onboarding.service.ts`
- `apps/api/src/users/users.service.ts`
- `apps/api/src/fair-play/fair-play.service.ts`
- `apps/api/src/registrar/registrar.service.ts`
- `apps/api/src/communities/communities.service.ts`
- `apps/api/src/admin-analytics/admin-analytics.service.ts`
- `apps/api/src/auth/auth.service.ts`
- `apps/api/scripts/seed-artist-fixture-roster.mjs`
- `apps/api/scripts/seed-print-shop-creator-user.mjs`
- `apps/web/src/app/source-dashboard/page.tsx`
- `packages/types/src/user.ts`

Tests already cover these compatibility paths across onboarding, Fair Play voting/rotation, Registrar, communities/discovery, admin activation, auth invite registration, and user profile collection.

## Classification By Owner Lane

### Keep As Active Authority

These are not candidates for removal in the music-community cleanup slice:

- `User.homeSceneCity`
- `User.homeSceneState`
- `User.tunedSceneId`
- `User.tunedSceneUpdatedAt`

Reason: city/state and tuned scene carry submitted location, GPS/source locality, proxy/natural assignment, active listening anchor, and activation cutover semantics. The preference model only replaces the single default music-community shadow; it does not replace place or active scene context.

### Invert To Default Preference Resolver

These read paths should prefer a shared default-preference resolver, with fallback to `User.homeSceneCommunity` until migration verification passes:

1. **Fair Play city-tier vote matching**
   - File: `apps/api/src/fair-play/fair-play.service.ts`
   - Current behavior: direct `homeSceneCommunity` comparison for exact Home Scene match; registered preference logic exists separately.
   - Desired path: exact Home Scene and default preference should resolve through the shared default music-community resolver. Registered non-default preferences remain separate.

2. **Fair Play broadcast tier fallback**
   - File: `apps/api/src/fair-play/fair-play.service.ts`
   - Current behavior: state-tier fallback derives music community from tuned scene or `homeSceneCommunity`.
   - Desired path: if tuned scene is absent, derive the default music community through the shared resolver.

3. **Registrar Home Scene checks for promoter/project/sect/artist-band submissions**
   - File: `apps/api/src/registrar/registrar.service.ts`
   - Current behavior: all submission guards read `homeSceneCommunity`.
   - Desired path: use the shared default resolver for music-community identity while keeping `homeSceneCity`/`homeSceneState` as source/location authority.
   - Extra care: Artist/Band source origin should continue persisting the submitted/default natural source-origin tuple; do not replace source origin with a proxy scene.

4. **Discover and scene-context Home Scene matching**
   - File: `apps/api/src/communities/communities.service.ts`
   - Current behavior: Discover `isHomeScene`, state-rollup matching, `tuneScene`, `getDiscoveryContext`, `setHomeScene`, and metrics/count paths read `homeSceneCommunity`.
   - Desired path: display/read matching should use default preference for music community, while `setHomeScene` writes the compatibility shadow only after the preference/default model is updated.

5. **Activation listener cutover**
   - File: `apps/api/src/admin-analytics/admin-analytics.service.ts`
   - Current behavior: manual activation re-roots listeners by matching `homeSceneCity`, `homeSceneState`, and `homeSceneCommunity`.
   - Desired path: after resolver/write-sync lands, cutover should match listeners by city/state plus default preference row. Keep compatibility fallback until staging proves all rows are backfilled.

6. **Profile/roller seeding**
   - File: `apps/api/src/users/users.service.ts`
   - Current behavior: `listMusicCommunityPreferences` seeds preference rows from `homeSceneCommunity` when no rows exist.
   - Desired path: keep this compatibility seed until staging verification proves all active users have preference rows. After verification, demote to read-only legacy repair or remove in a dedicated migration cleanup slice.

### Keep As Compatibility Writes Until Contract Switch

These writes should remain until old clients/tests and staging data are proven safe:

1. **Onboarding Home Scene write**
   - File: `apps/api/src/onboarding/onboarding.service.ts`
   - Current behavior: writes `homeSceneCity`, `homeSceneState`, `homeSceneCommunity`, and `tunedSceneId`.
   - Next implementation: write/update the default preference row first, then write `homeSceneCommunity` as a compatibility shadow.

2. **Discover set Home Scene**
   - File: `apps/api/src/communities/communities.service.ts`
   - Current behavior: writes the selected scene tuple into `homeSceneCity`, `homeSceneState`, and `homeSceneCommunity`.
   - Next implementation: update the default preference row and compatibility shadow together.

3. **Registrar invite claim**
   - File: `apps/api/src/auth/auth.service.ts`
   - Current behavior: seeds Home Scene fields from registrar scene context during invite registration.
   - Next implementation: also create/update the default preference row in the same claim path.

### Fixture / Script Paths

These should be updated only after runtime read/write paths are inverted:

- `apps/api/scripts/seed-artist-fixture-roster.mjs`
- `apps/api/scripts/seed-print-shop-creator-user.mjs`

Reason: they are dev/setup helpers and should follow the runtime contract after it changes. They are not owner authority.

### Type / Web Surface Paths

- `packages/types/src/user.ts`
- `apps/web/src/app/source-dashboard/page.tsx`

These are compatibility consumers. Keep types compatible until API responses stop requiring `homeSceneCommunity`. Do not silently remove fields from shared types before API/web tests and staging verification pass.

## Safe Cleanup Sequence

1. **Merge shared default resolver**
   - Land the resolver service that returns default `UserMusicCommunityPreference.isDefault` with `User.homeSceneCommunity` fallback.

2. **Invert high-risk reads**
   - Fair Play vote/broadcast paths.
   - Registrar submission guards and source-origin derivation.
   - Discover context/Home Scene matching.
   - Activation listener cutover.

3. **Synchronize writes**
   - Onboarding, Discover set Home Scene, default-preference mutation, and invite claim should update preference rows first and `homeSceneCommunity` only as a compatibility shadow.

4. **Switch contracts/tests**
   - New tests should prove behavior works when `homeSceneCommunity` is stale or null but a default preference row exists.
   - Keep legacy fallback tests until staging verification passes.

5. **Run staging data verification**
   - Prove every user with `homeSceneCommunity` has an equivalent default preference row.
   - Prove every default preference can resolve to natural/proxy/profile-only according to the roller contract.
   - Identify stale/null compatibility rows before any migration.

6. **Only then consider schema cleanup**
   - `homeSceneCommunity` removal or demotion must be a dedicated migration slice.
   - Do not remove `homeSceneCity`, `homeSceneState`, `tunedSceneId`, or `tunedSceneUpdatedAt` in this cleanup.

## Recommended Implementation Slices

1. **Resolver adoption in Fair Play**
   - Focused tests: `apps/api/test/fair-play.vote.test.ts`, rotation/broadcast tests.

2. **Resolver adoption in Registrar**
   - Focused tests: `apps/api/test/registrar.service.test.ts`.

3. **Resolver adoption in Discover/communities**
   - Focused tests: `apps/api/test/communities.discovery.service.test.ts`, `apps/api/test/communities.routes.test.ts`.

4. **Write-path sync**
   - Focused tests: onboarding Home Scene, users preferences, auth invite registration, Discover set Home Scene.

5. **Activation cutover preference matching**
   - Focused tests: `apps/api/test/admin-analytics.service.test.ts`.

6. **Staging data audit script**
   - Read-only by default.
   - Must require explicit target confirmation for non-local databases.

## Validation

This was a docs/runtime inventory slice. Validation run:

```bash
pnpm run docs:lint
git diff --check
```

## Files Changed

- `docs/CHANGELOG.md`
- `docs/handoff/2026-06-25_home-scene-community-cleanup-read-path-inventory.md`

