# 2026-03-25 Discover Wireframe Visual Pass

## Summary
Applied the new wireframe-style utility language from the founder Miro anchor to `/discover` without changing Discover's founder-locked information architecture or routing behavior.

## What Changed
- Reused the existing Plot wireframe primitives for the Discover shell instead of introducing a separate style system.
- Restyled the shared `SceneContextBadge` to match the wireframe chip language.
- Reframed the Discover route into three clear utility blocks:
  - route header
  - Uprise Travel
  - Current Community Discover
- Converted travel result rows, local search result cards, and carousel items to the same bordered modular card language.
- Kept Discover behavior intact:
  - inherited origin-community travel
  - Retune-first / Visit-second flow
  - local artist/song search
  - Recommendations / Trending / Top Artists
  - signed-out gating rules

## Files
- `apps/web/src/app/discover/page.tsx`
- `apps/web/src/components/plot/SceneContextBadge.tsx`
- `docs/CHANGELOG.md`

## Verification
- `pnpm --filter web test -- --runInBand __tests__/discover-page-lock.test.ts`
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`

## Live QA
- Used Playwright CLI with seeded unsigned onboarding context:
  - `Austin / Texas / Punk`
- Verified in-browser:
  - wireframe shell loads correctly
  - Uprise Travel remains distinct from Current Community Discover
  - current-community local search still works
  - Recommendations / Trending / Top Artists remain visible and readable
  - Discover still reads as Discover rather than a copied Plot layout

## Notes
- This pass intentionally carries over the visual system only, not the full Plot composition.
- `/discover` still preserves its own route structure because the founder lock defines a different information architecture from `/plot`.
