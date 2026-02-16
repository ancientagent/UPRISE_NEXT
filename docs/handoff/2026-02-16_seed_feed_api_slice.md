# 2026-02-16 — S.E.E.D Feed API Slice

## Scope

Implemented the first backend slice for Plot Activity Feed (S.E.E.D): a scene-scoped feed endpoint returning explicit actions/events only.

## Implemented

- `GET /communities/:id/feed`
  - Auth required (inherits communities controller guard)
  - Query params:
    - `limit` (default 50, max 100)
    - `before` (optional date cursor)
  - Returns a merged, descending feed of explicit items:
    - `blast`
    - `track_release`
    - `event_created`
    - `signal_created`
  - Includes `meta.nextCursor` for cursor-style pagination.

## Files Changed

- `apps/api/src/communities/dto/community.dto.ts`
  - Added `GetCommunityFeedSchema` and `GetCommunityFeedDto`.
- `apps/api/src/communities/communities.service.ts`
  - Added `getFeed(communityId, query)` projection service.
- `apps/api/src/communities/communities.controller.ts`
  - Added `GET /communities/:id/feed` route.
- `apps/api/test/communities.feed.service.test.ts`
  - Added service unit tests for not-found and merged deterministic ordering.
- `docs/specs/communities/plot-and-scene-plot.md`
  - Marked feed endpoint implemented, UI rendering pending.
- `docs/CHANGELOG.md`
  - Added entry for S.E.E.D feed API slice.

## Validation

- `pnpm --filter api test -- test/communities.feed.service.test.ts --runInBand`
- `pnpm --filter api build`
- `pnpm run docs:lint`

## Deferred

- Feed endpoint consumption in web Plot UI.
- Dedicated `/communities/:id/events`, `/communities/:id/promotions`, `/communities/:id/statistics` endpoints.
- Registrar and social integration into S.E.E.D stream.

