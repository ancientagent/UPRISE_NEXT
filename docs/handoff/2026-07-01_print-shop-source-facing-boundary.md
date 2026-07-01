# 2026-07-01 Print Shop Source-Facing Boundary

## Branch

- Branch: `fix/print-shop-source-facing-boundary`
- Base: `main` after PR #164 (`3725a6f`)
- Mode: source/listener boundary cleanup

## Summary

Removed the direct `Open Print Shop` shortcut from the normal `/plot` registrar/context panel. Print Shop remains available from source-facing contexts:

- Source Dashboard tool card
- linked Artist/Band source profile controls for source members
- direct `/print-shop` route with source/promoter eligibility checks

## Founder Clarification Captured

`docs/founder-sessions/2026-07-01_plot-home-scene-visual-skin.md` now records the raw clarification that Print Shop is source-facing only, and that it should remain available from source-facing context rather than removed.

## Contract Preserved

- Plot stays a listener/Home Scene community shell.
- Registrar status can remain visible in Plot as civic workflow context.
- Print Shop is not a listener profile action, ordinary Plot action, or general listener event-authoring utility.
- Print Shop remains source-facing and available to eligible source users through Source Dashboard / source profile / `/print-shop` eligibility gates.
- No backend, API, schema, provider, or art changes were made.

## Files Changed

- `apps/web/src/app/plot/page.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `docs/founder-sessions/2026-07-01_plot-home-scene-visual-skin.md`
- `docs/CHANGELOG.md`
- `docs/handoff/README.md`
- `docs/handoff/2026-07-01_print-shop-source-facing-boundary.md`

## Validation

- `pnpm --filter web test -- plot-ux-regression-lock.test.ts route-ux-consistency-lock.test.ts source-dashboard-shell-lock.test.ts --runInBand`
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `git diff --check`
