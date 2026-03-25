# Plot Zine Shell Style Pass

## Scope
Apply the first UI-direction slice for `/plot` only.

This pass is intentionally limited to the Plot shell and compact player presentation. It does not redesign route behavior or broaden the style system across the rest of the app yet.

## Direction Locked
- DIY zine / photocopied paper feel
- lined paper and warm sheet backgrounds
- record-store divider tabs for Plot navigation and section switching
- yellow highlighter and red-pen annotation accents
- album-sleeve / paper-insert framing for selected content panels
- small tactile motion only (pull forward / set back), no glossy SaaS animation language

## Files
- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/globals.css`
- `apps/web/src/app/plot/page.tsx`
- `apps/web/src/components/plot/RadiyoPlayerPanel.tsx`
- `apps/web/src/components/plot/StatisticsPanel.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`

## Implementation Notes
- Added `Special_Elite` and `Caveat` as narrow accent fonts via `next/font/google` variables.
- Added Plot-specific paper/divider/annotation component classes in `apps/web/src/app/globals.css` rather than broad global restyling.
- Restyled Plot shell sections to use:
  - `plot-zine-page`
  - `plot-zine-card`
  - `plot-ledger-card`
  - `plot-divider-tab`
  - `plot-embossed-label`
  - `plot-annotation-note`
  - `plot-record-sleeve`
- Kept route logic unchanged.
- Added a source lock to keep the shell tied to the paper/divider style language.

## Verification
- `pnpm --filter web test -- --runInBand __tests__/plot-ux-regression-lock.test.ts`
- `pnpm --filter web typecheck`
- Playwright CLI live check on `/plot`
- `pnpm run docs:lint`

## Residual Notes
- This is a shell-level styling pass, not the full Plot visual system.
- Feed/Events/Promotions/Statistics internals can take the same visual language in later slices.
- `/discover`, `/community/[id]`, and `/artist-bands/[id]` remain untouched in this pass.
