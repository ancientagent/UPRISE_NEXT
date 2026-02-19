# 2026-02-19 — Discovery Home Scene Switch Guardrails

## Scope
- Implement explicit Home Scene reassignment in Discovery as a separate action from Tune.
- Keep discovery canon-safe: no join semantics, no hidden authority mutation.

## Changes
- API
  - Added `POST /discover/set-home-scene` in `apps/api/src/communities/discovery.controller.ts`.
  - Added request DTO/schema in `apps/api/src/communities/dto/community.dto.ts`.
  - Added `CommunitiesService.setHomeScene(userId, { sceneId })` in `apps/api/src/communities/communities.service.ts`.
- Guardrails
  - Target scene must be `tier=city`.
  - Cross-state switches are rejected when user already has a Home Scene state.
  - Membership link is ensured for the new Home Scene.
- Web
  - `apps/web/src/app/discover/page.tsx` now calls `POST /discover/set-home-scene`.
  - Added explicit confirmation before Home Scene reassignment.
  - Added clear civic-anchor warning copy.
  - `apps/web/src/app/plot/page.tsx` now calls out that Home Scene changes happen in Discover with confirmation.
- Docs
  - Updated `docs/specs/communities/discovery-scene-switching.md` to mark `POST /discover/set-home-scene` implemented and document guardrails.
  - Updated `docs/CHANGELOG.md`.

## Validation
- `pnpm --filter api test -- test/communities.discovery.service.test.ts --runInBand` ✅
- `pnpm --filter api build` ✅
- `pnpm --filter web build` ✅

## Notes
- Endpoint remains explicitly separate from `POST /discover/tune` (visitor transport context).
- Home Scene reassignment remains a user-initiated action and is never implicit.
