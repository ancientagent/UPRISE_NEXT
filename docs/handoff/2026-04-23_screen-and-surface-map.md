# 2026-04-23 — Screen And Surface Map

## What changed
- Added `docs/solutions/MVP_SCREEN_AND_SURFACE_MAP_R1.md`.
- Mapped the current product screens/surfaces from active specs, founder locks, surface contracts, and current `apps/web` runtime.
- Explicitly separated:
  - intended surface structure
  - current route/runtime reality
  - fragmented areas that still need a cleaner lock

## Why
The repo had enough scattered surface truth to answer screen-structure questions correctly, but not one compact map that:
- listed the actual screens
- showed where `Plot` belongs
- showed where `SPACE` is currently embedded
- and described the top-to-bottom feature order on each screen

That gap was creating repeated drift in screen explanations and external design-tool briefings.

## Key corrections captured
- `Home` contains `Plot`; `Plot` is not a sibling destination.
- current web runtime still materially expresses the Home-side shell through `/plot`.
- `SPACE` is currently a concept and embedded mode/panel set, not a clean standalone route.
- the primary current source-side screens are:
  - `Source Dashboard`
  - `Release Deck`
  - `Print Shop`
  - `Registrar`

## Sources used
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/solutions/SURFACE_CONTRACT_HOME_R1.md`
- `docs/solutions/SURFACE_CONTRACT_PLOT_R1.md`
- `docs/solutions/SURFACE_CONTRACT_DISCOVER_R1.md`
- `docs/solutions/SURFACE_CONTRACT_COMMUNITY_R1.md`
- `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/onboarding/page.tsx`
- `apps/web/src/app/plot/page.tsx`
- `apps/web/src/app/discover/page.tsx`
- `apps/web/src/app/artist-bands/[id]/page.tsx`
- `apps/web/src/app/community/[id]/page.tsx`
- `apps/web/src/app/registrar/page.tsx`
- `apps/web/src/app/source-dashboard/page.tsx`
- `apps/web/src/app/source-dashboard/release-deck/page.tsx`
- `apps/web/src/app/print-shop/page.tsx`

## Verification
- `pnpm run docs:lint`
- `git diff --check`
