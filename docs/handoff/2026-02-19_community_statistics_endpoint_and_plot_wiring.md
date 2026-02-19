# 2026-02-19 — Community Statistics Endpoint + Plot Wiring

## Scope
Implemented tier-scoped community statistics API and wired Plot statistics/top-songs surfaces to consume it.

## Changes
- API:
  - Added query schema: `GetCommunityStatisticsSchema` (`city|state|national`).
  - Added endpoint: `GET /communities/:id/statistics` in `apps/api/src/communities/communities.controller.ts`.
  - Added service method: `getStatistics(...)` in `apps/api/src/communities/communities.service.ts`.
  - Response includes:
    - `community`, `tierScope`, `rollupUnit`, `metrics`, `topSongs` (max 40), `timeWindow`.
- Web:
  - `apps/web/src/components/plot/StatisticsPanel.tsx` now fetches `/communities/:id/statistics?tier=...`.
  - `apps/web/src/components/plot/TopSongsPanel.tsx` now reads deterministic `topSongs` from statistics API.
  - `apps/web/src/app/plot/page.tsx` now passes `selectedTier` into `TopSongsPanel`.
- Tests:
  - Added `apps/api/test/communities.statistics.service.test.ts`.

## Validation
- `pnpm --filter api test -- test/communities.statistics.service.test.ts --runInBand`
- `pnpm --filter api build`
- `pnpm --filter web build`
- `pnpm run docs:lint`

## Notes / Deferred
- City map markers still come from `/communities/nearby` (local map behavior preserved).
- Dedicated `/communities/:id/scene-map` endpoint remains deferred.
- State/national map-specific geo clusters remain deferred; current state/national surfaces are metrics-driven rollups.
