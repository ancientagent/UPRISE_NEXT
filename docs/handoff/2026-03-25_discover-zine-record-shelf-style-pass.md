# 2026-03-25 — Discover zine record-shelf style pass

## Summary
- Applied the Plot DIY zine / record-divider visual system to `/discover` without changing the founder-locked travel and local-discovery behavior.
- Reused the existing paper/ledger/tape/highlighter language so Discover now reads as the same product as Plot.
- Restyled `SceneContextBadge` to use the same embossed-label chip system across both routes.

## Files
- `apps/web/src/app/discover/page.tsx`
- `apps/web/src/components/plot/SceneContextBadge.tsx`
- `apps/web/__tests__/discover-page-lock.test.ts`

## What changed
- Reframed the Discover hero as a taped paper-card shell with `Discover Desk` and `Record Shelf View` callouts.
- Converted travel controls, tier toggles, travel-result cards, local search shelves, and highlight carousels to the same `plot-zine-card`, `plot-ledger-card`, `plot-divider-tab`, `plot-embossed-label`, and handwritten annotation language already used in Plot.
- Kept all founder-locked mechanics intact:
  - travel remains explicit `Retune` then `Visit [Community Name]`
  - local artist/song search behavior is unchanged
  - `Recommendations`, `Trending`, and `Top Artists` still render from the existing discover highlight contracts
  - signed-out Discover still suppresses auth-dead-end artist/community actions as previously locked
- Updated source locks so the Discover route keeps the shared zine styling markers.

## Verification
- `pnpm --filter web test -- --runInBand __tests__/discover-page-lock.test.ts`
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- Live Playwright CLI verification on `/discover`
  - empty-context state shows the new shell and travel card treatment
  - seeded unsigned Austin/Rock context shows the styled current-community shelf, travel cards, and empty-state `Recommendations` / `Trending` / `Top Artists`

## Notes
- This pass intentionally stops at the Discover route shell and current cards/shelves. Deeper panel-specific motion/polish can happen later without reopening the behavior contract.
