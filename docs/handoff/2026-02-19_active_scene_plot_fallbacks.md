# Active Scene Plot Fallbacks (2026-02-19)

## Scope
Implemented active-scene defaults for Plot read surfaces and broadcast rotation so UI can resolve tuned Scene first with Home Scene fallback when no explicit scene anchor is selected.

## Code Changes
- API
  - `apps/api/src/communities/communities.controller.ts`
    - Added:
      - `GET /communities/active/feed`
      - `GET /communities/active/statistics`
      - `GET /communities/active/events`
      - `GET /communities/active/promotions`
  - `apps/api/src/communities/communities.service.ts`
    - Added `resolveActiveSceneId(userId)` using discovery context (`tunedSceneId` -> Home Scene fallback).
  - `apps/api/src/fair-play/broadcast.controller.ts`
    - Added `GET /broadcast/rotation`.
  - `apps/api/src/fair-play/fair-play.service.ts`
    - Added `getActiveRotation(userId)` with tuned/home fallback and user-not-found/no-context guards.

- Web
  - `apps/web/src/components/plot/SeedFeedPanel.tsx`
    - Uses `/communities/active/feed` when `communityId` is null.
  - `apps/web/src/components/plot/TopSongsPanel.tsx`
    - Uses `/communities/active/statistics` when `communityId` is null.
  - `apps/web/src/components/plot/PlotEventsPanel.tsx`
    - Uses `/communities/active/events` when `communityId` is null.
  - `apps/web/src/components/plot/PlotPromotionsPanel.tsx`
    - Uses `/communities/active/promotions` when `communityId` is null.

## Docs Updated
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/specs/broadcast/radiyo-and-fair-play.md`
- `docs/CHANGELOG.md`

## Validation
- `pnpm --filter api build` passed.
- `pnpm --filter web build` passed.

## Notes
- Authority boundary unchanged: tuning/active context only affects read surfaces and playback transport defaults.
- Civic authority actions remain Home Scene + GPS gated.
