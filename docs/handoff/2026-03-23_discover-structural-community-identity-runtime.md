# Discover Structural Community Identity Runtime (2026-03-23)

## Purpose
Carry structural community identity through the live Discover and destination surfaces so UI/runtime behavior matches the repo rule that communities/Uprises are identified by `city + state + music community`.

## Changes
- Extended shared Discover result types in `packages/types/src/discovery.ts` so artist results include `homeSceneCity`, `homeSceneState`, and `homeSceneMusicCommunity`, and song results include `communityCity`, `communityState`, and `communityMusicCommunity`.
- Updated `apps/api/src/communities/communities.service.ts` to select and return those structural fields for community-local artist/song search and top-artist highlights.
- Updated `apps/web/src/app/discover/page.tsx` to:
  - format origin context from `city + state + music community`
  - replace loose genre phrasing with current-community-context wording
  - render structural identity beneath artist/song/top-artist result cards
- Updated `apps/web/src/app/community/[id]/page.tsx` to render an explicit community identity line using the structural tuple.
- Updated `apps/web/src/app/artist-bands/[id]/page.tsx` to render Home Scene as `city + state + music community` instead of name-plus-location fallback.
- Extended `apps/web/src/lib/types/community.ts` so the web-side community model matches the richer `/communities/:id` payload already returned by the API.

## Verification
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`

## Notes
- This slice aligns runtime identity presentation without changing the underlying community tuple model, which was already established in onboarding and community resolution flows.
