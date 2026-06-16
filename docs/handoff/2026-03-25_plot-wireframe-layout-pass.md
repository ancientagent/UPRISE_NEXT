# 2026-03-25 Plot Wireframe Layout Pass

## Summary
- Rebuilt `/plot` around a compact wireframe-style utility layout anchored to the founder Miro reference instead of the previously rejected paper/zine styling direction.
- Kept Plot UX and route contracts intact while changing the page composition, shell styling, panel framing, and bottom navigation presentation.
- Moved the expanded profile layout toward the intended structure: profile summary, calendar above collection, collection tabs/body, and persistent player/footer continuity.

## Source Of Truth
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/solutions/MVP_WEB_UX_IMPLEMENTATION_BRIEF_R1.md`
- founder-provided Miro screenshot shared in-thread on 2026-03-25

## What Changed
- Added Plot-only wireframe utility primitives in `apps/web/src/app/globals.css`.
- Rebuilt the `/plot` route shell in `apps/web/src/app/plot/page.tsx`:
  - compact dashboard strip
  - compact player-first composition
  - embedded tab row
  - feed-first main panel
  - right rail for registrar and selected community
  - raw bottom-nav controls to avoid generic button chrome bleed-through
- Reworked `apps/web/src/components/plot/RadiyoPlayerPanel.tsx` to match the new shell.
- Restyled Plot panels to the same utility language:
  - `apps/web/src/components/plot/SeedFeedPanel.tsx`
  - `apps/web/src/components/plot/PlotEventsPanel.tsx`
  - `apps/web/src/components/plot/PlotPromotionsPanel.tsx`
  - `apps/web/src/components/plot/StatisticsPanel.tsx`
  - `apps/web/src/components/plot/TopSongsPanel.tsx`
  - `apps/web/src/components/plot/SceneMap.tsx`

## Verification
- `pnpm --filter web test -- --runInBand __tests__/plot-ux-regression-lock.test.ts __tests__/plot-tab-contracts.test.ts`
- `pnpm --filter web typecheck`
- live Playwright CLI check on `/plot` with seeded unsigned `Austin, Texas / Punk` onboarding state
  - verified compact Plot state
  - verified expanded profile state
  - verified pioneer notification panel
  - verified bottom-nav visual correction after replacing generic button wrappers with raw nav controls

## Notes
- Color is intentionally subordinate to layout in this pass; the page is designed to still hold together if the palette is later pushed closer to monochrome.
- This pass is Plot-only. `/discover` is untouched for now.
