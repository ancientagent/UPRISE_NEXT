# 2026-03-24 — Plot unsigned terminal-state hardening

## Surface

- `/plot`

## Source of truth

- `docs/solutions/MVP_WEB_UX_IMPLEMENTATION_BRIEF_R1.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/handoff/2026-03-24_session-context-reconciliation.md`

## Current repro

- Unsigned `/plot` degraded correctly in the UI, but it still attempted protected reads that the route could not satisfy:
  - `GET /communities/resolve-home?...`
  - `GET /communities/:id` when a tuned scene id was present
  - `GET /communities/active/statistics?tier=...` through `TopSongsPanel` on the Statistics tab
- Those requests returned `401` and added console noise even though the route already had coherent signed-out / unresolved fallback states.

## Fix

- Updated `apps/web/src/app/plot/page.tsx` so default community resolution exits early when no auth token exists.
- Updated `apps/web/src/components/plot/TopSongsPanel.tsx` so unsigned Statistics state renders an explicit sign-in-required message instead of issuing protected reads and falling into an error box.
- Kept the existing unsigned Plot UX intact:
  - Home Scene tuple still anchors local context copy
  - unresolved / signed-out panels still render deterministic guidance states
  - Statistics tab now keeps auth-state messaging consistent across the main panel and Top 40 surface
- Extended `apps/web/__tests__/plot-ux-regression-lock.test.ts` to lock both unsigned guards against future drift.

## Verification

- `pnpm --filter web test -- --runInBand __tests__/plot-ux-regression-lock.test.ts`
- `pnpm --filter web typecheck`
- Playwright CLI harness replay on unsigned `/plot`:
  - feed tab: no console `401` noise after Home Scene tuple seeding
  - statistics tab: explicit `Sign in is required to load Top 40 songs for this scene context.` and no console `401` noise

## Residual risk

- This removes the unauthorized client noise without changing the current unsigned data model.
- If unsigned Plot later needs resolved community hydration or unsigned Top 40 visibility instead of tuple-only context copy, that should be handled as a separate read-contract decision rather than by reintroducing protected calls.
