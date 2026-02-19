# 2026-02-23 — Plot Home Scene Anchor Resolver

## Scope
- Ensure Plot surfaces auto-anchor from Home Scene tuple even without GPS.

## Changes
- API:
  - Added `ResolveHomeCommunitySchema` in `apps/api/src/communities/dto/community.dto.ts`.
  - Added `GET /communities/resolve-home` in `apps/api/src/communities/communities.controller.ts`.
  - Added `CommunitiesService.resolveHomeCommunity()` in `apps/api/src/communities/communities.service.ts`.
  - Added unit tests: `apps/api/test/communities.resolve-home.service.test.ts`.
- Web:
  - Updated `apps/web/src/app/plot/page.tsx` default anchor resolution order:
    1) Home Scene exact tuple via `/communities/resolve-home`
    2) GPS-nearby fallback via `/communities/nearby`
- Docs:
  - Updated `docs/specs/communities/plot-and-scene-plot.md`
  - Updated `docs/specs/users/onboarding-home-scene-resolution.md`
  - Updated `docs/CHANGELOG.md`

## Validation
- `pnpm --filter api test -- test/communities.resolve-home.service.test.ts --runInBand`
- `pnpm --filter api build`
- `pnpm --filter web build`
- `pnpm run verify`

## Notes
- This keeps Plot anchor deterministic and canon-aligned to Home Scene selection.
