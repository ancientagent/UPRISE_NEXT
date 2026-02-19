# 2026-02-22 — Plot Promotions Surface Wiring

## Scope
- Implement next unblocked Plot slice: Promotions.
- Add scene-scoped promotions read endpoint and wire Promotions tab.

## Changes
- API:
  - Added `GetCommunityPromotionsSchema` / `GetCommunityPromotionsDto` in `apps/api/src/communities/dto/community.dto.ts`.
  - Added `GET /communities/:id/promotions` in `apps/api/src/communities/communities.controller.ts`.
  - Added `CommunitiesService.getPromotions()` in `apps/api/src/communities/communities.service.ts`.
  - Current read model is interim: projects `Signal` types `PROMOTION` and `OFFER`.
  - Added unit tests: `apps/api/test/communities.promotions.service.test.ts`.
- Web:
  - Added `apps/web/src/components/plot/PlotPromotionsPanel.tsx`.
  - Wired Plot Promotions tab in `apps/web/src/app/plot/page.tsx`.
- Docs:
  - Updated `docs/specs/communities/plot-and-scene-plot.md`.
  - Updated `docs/specs/economy/print-shop-and-promotions.md`.
  - Updated `docs/CHANGELOG.md`.

## Validation
- `pnpm --filter api test -- test/communities.promotions.service.test.ts --runInBand`
- `pnpm --filter api build`
- `pnpm --filter web build`
- `pnpm run verify`

## Notes
- Read-only projection is intentionally separate from Fair Play/propagation.
- Full Promotions/Print Shop write flows remain deferred.
