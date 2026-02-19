# 2026-02-19 — Discovery Tuned Scene Persistence

## Scope
- Persist tuned scene transport context so Discover + Plot resolve the same active scene.
- Keep Home Scene authority separate from tune context.

## Changes
- API
  - Added user fields in Prisma schema:
    - `tunedSceneId`
    - `tunedSceneUpdatedAt`
  - Added migration:
    - `apps/api/prisma/migrations/20260219162000_add_user_tuned_scene_context/migration.sql`
  - Updated `POST /discover/tune` to persist tuned scene context.
  - Added `GET /discover/context` endpoint for current user context resolution.
  - Updated `POST /discover/set-home-scene` flow to align tuned scene with explicit Home Scene switch.
- Web
  - Added persisted `tunedSceneId` to onboarding store.
  - Discover page now loads `/discover/context` and updates tuned scene state from API.
  - Plot page now loads `/discover/context` and resolves default selected community from tuned scene first.
- Tests
  - Extended discovery service tests for:
    - tune persistence update
    - `getDiscoveryContext` persisted tuned scene
    - `getDiscoveryContext` fallback to Home Scene

## Validation
- `pnpm --filter api test -- test/communities.discovery.service.test.ts --runInBand` ✅
- `cd apps/api && npx prisma generate && pnpm build` ✅
- `pnpm --filter web build` ✅

## Notes
- Tune context remains transport-only (visitor context), not civic authority.
- Home Scene remains explicit user action and separate from passive discovery.
