# 2026-02-20 — Plot S.E.E.D Feed Wiring

## Scope
- Wire The Plot `Feed` tab to server-driven S.E.E.D feed API.
- Keep behavior canon-safe: deterministic, scene-scoped, non-personalized.

## Changes
- Added `apps/web/src/components/plot/SeedFeedPanel.tsx`.
  - Fetches `GET /communities/:id/feed?limit=20&before=:cursor`.
  - Renders explicit activity items with type, actor, timestamp, and entity type.
  - Supports cursor pagination via `Load More`.
  - Shows anchor guidance when no community is selected.
- Updated `apps/web/src/app/plot/page.tsx`.
  - `Feed` is now default active tab.
  - Replaced Feed placeholder with `SeedFeedPanel`.
  - Added nearest-community bootstrap (from GPS-based nearby query) to improve initial feed anchor.
- Updated docs:
  - `docs/specs/communities/plot-and-scene-plot.md`
  - `docs/CHANGELOG.md`

## Validation
- `pnpm --filter web build`
- `pnpm run typecheck`
- `pnpm run docs:lint`

## Notes
- Events/Promotions/Social tabs remain placeholder until corresponding API surfaces are implemented.
- Feed behavior remains independent from ranking/recommendation systems.
