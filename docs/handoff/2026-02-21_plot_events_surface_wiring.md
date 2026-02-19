# 2026-02-21 — Plot Events Surface Wiring

## Scope
- Implement the next unblocked Plot tab slice: Events.
- Wire scene-scoped events API and render in Plot UI.

## Changes
- API:
  - Added `GetCommunityEventsSchema` / `GetCommunityEventsDto` in `apps/api/src/communities/dto/community.dto.ts`.
  - Added `GET /communities/:id/events` in `apps/api/src/communities/communities.controller.ts`.
  - Added `CommunitiesService.getEvents()` in `apps/api/src/communities/communities.service.ts`.
  - Added unit tests in `apps/api/test/communities.events.service.test.ts`.
- Web:
  - Added `apps/web/src/components/plot/PlotEventsPanel.tsx`.
  - Wired Plot Events tab in `apps/web/src/app/plot/page.tsx` to render `PlotEventsPanel`.
- Docs:
  - Updated `docs/specs/communities/plot-and-scene-plot.md`.
  - Updated `docs/specs/events/events-and-flyers.md`.
  - Updated `docs/CHANGELOG.md`.

## Validation
- `pnpm --filter api test -- test/communities.events.service.test.ts --runInBand`
- `pnpm --filter api build`
- `pnpm --filter web build`
- `pnpm run verify`

## Notes
- Endpoint is deterministic and scene-scoped; no personalization.
- Promotions and Social tabs remain deferred placeholder surfaces.
