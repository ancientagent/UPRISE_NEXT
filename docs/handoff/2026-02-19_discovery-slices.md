# 2026-02-19 — Discovery Slices (COMM-DISCOVERY)

## Scope
Implemented discovery foundation in two incremental slices:
1. Deterministic discovery listing (`GET /discover/scenes`)
2. Explicit tune action (`POST /discover/tune`) + web `Tune to Scene` control

## What Shipped
- API:
  - `apps/api/src/communities/discovery.controller.ts`
    - `GET /discover/scenes`
    - `POST /discover/tune`
  - `apps/api/src/communities/communities.service.ts`
    - `discoverScenes(userId, query)`
    - `tuneScene(userId, dto)`
  - `apps/api/src/communities/dto/community.dto.ts`
    - `GetDiscoverScenesSchema`
    - `PostDiscoverTuneSchema`
- Web:
  - `apps/web/src/app/discover/page.tsx`
    - scope + music community filters
    - actions: `Open Scene`, `Tune to Scene`, `Set as Home Scene`
  - entry links from:
    - `apps/web/src/app/page.tsx`
    - `apps/web/src/app/plot/page.tsx`
- Specs/Docs:
  - Added `docs/specs/communities/discovery-scene-switching.md` (`COMM-DISCOVERY`)
  - Updated `docs/specs/README.md`
  - Updated `docs/specs/communities/README.md`
  - Updated `docs/specs/communities/scene-map-and-metrics.md` consistency wording
  - Updated `docs/CHANGELOG.md`

## Validation
- `pnpm --filter api test -- test/communities.discovery.service.test.ts --runInBand` ✅
- `pnpm --filter api build` ✅
- `pnpm --filter web typecheck` ✅
- `pnpm --filter web build` ✅
- `pnpm run docs:lint` ✅

## Canon/Drift Notes
- Discovery uses explicit navigation only.
- No “Join Community” behavior/language introduced.
- Tune action does not mutate Home Scene (visitor-safe session context).

## Open Follow-Ups
- If required, add persistence policy for tuned-scene context lifetime (session-only vs stored).
- Implement optional `/users/home-scene` alias endpoint if API surface separation is desired beyond current onboarding endpoint.
