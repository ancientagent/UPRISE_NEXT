# 2026-02-19 — Scene Map Endpoint + Plot Wiring

## Scope
Implemented `GET /communities/:id/scene-map` and wired Plot Statistics map rendering to consume tier-scoped map payloads.

## Changes
- API
  - Added query schema `GetCommunitySceneMapSchema` in `apps/api/src/communities/dto/community.dto.ts`.
  - Added endpoint `GET /communities/:id/scene-map` in `apps/api/src/communities/communities.controller.ts`.
  - Added service method `getSceneMap(...)` in `apps/api/src/communities/communities.service.ts`.
  - Returned payload includes:
    - `tierScope`, `rollupUnit`, `center`, `points[]`, `timeWindow`.
  - Rollup behavior:
    - `city`: community points
    - `state`: city rollups
    - `national`: state rollups
- Web
  - Reworked `apps/web/src/components/plot/SceneMap.tsx` to render generic `points[]`.
  - Updated `apps/web/src/components/plot/StatisticsPanel.tsx` to fetch and render `/scene-map` by selected tier.

## Tests / Validation
- `pnpm --filter api test -- test/communities.scene-map.service.test.ts --runInBand`
- `pnpm --filter api build`
- `pnpm --filter web build`
- `pnpm run docs:lint`

## Deferred
- Dedicated geo-cluster visualization rules remain pending.
- Scene-map privacy floor thresholds remain policy-locked in decisions docs.
