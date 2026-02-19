# 2026-02-19 — Discovery Context Chip Surfaces

## Scope
- Add a read-only context chip to clearly show Home Scene vs Tuned Scene status.
- Keep switching actions in Discover only; no new authority mutations.

## Changes
- Added shared UI component:
  - `apps/web/src/components/plot/SceneContextBadge.tsx`
  - Displays:
    - `Home Scene: ...`
    - `Tuned Scene: ...`
    - `Visitor` or `Local`
- Extended onboarding store context:
  - `tunedScene`, `isVisitor`
  - `setDiscoveryContext(...)`
- Discover page (`apps/web/src/app/discover/page.tsx`)
  - Reads `/discover/context` into shared store
  - Renders context chip in header
  - Updates shared discovery context after tune/home-scene actions
- Plot page (`apps/web/src/app/plot/page.tsx`)
  - Reads `/discover/context` into shared store
  - Renders context chip in header
- Community profile page (`apps/web/src/app/community/[id]/page.tsx`)
  - Renders same context chip for continuity
- API response alignment:
  - `POST /discover/set-home-scene` response includes `tunedScene` + `isVisitor`

## Validation
- `pnpm --filter api build` ✅
- `pnpm --filter api test -- test/communities.discovery.service.test.ts --runInBand` ✅
- `pnpm --filter web build` ✅

## Notes
- Context chip is read-only in this slice.
- Tune vs Home Scene actions remain explicit and separate.
