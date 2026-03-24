# 2026-03-24 — Lane D regression locks

## Surface

- `/onboarding`
- `/plot`

## Source of truth

- `AGENTS.md`
- `docs/handoff/2026-03-24_session-context-reconciliation.md`
- `docs/solutions/MVP_WEB_UX_IMPLEMENTATION_BRIEF_R1.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/communities/plot-and-scene-plot.md`

## Current repro

- The branch needed stable regression locks for the current onboarding founder fixes so Music Community input stays tied to the seeded selection list and unsigned users still reach the review/pioneer fallback state without auth-only dead ends.
- The branch also needed targeted verification that the current `/plot` founder-lock work keeps registrar status/access visible and keeps pioneer follow-up discoverable through the notification path rather than drifting into a new surface.

## Fix

- Added `apps/web/__tests__/onboarding-regression-lock.test.ts` as a source-read regression suite that locks:
  - seeded Music Community selection sourcing via `MUSIC_COMMUNITIES`
  - unsigned review-step continuity
  - pioneer review messaging and active-scene fallback review copy
- Kept the existing branch-local `/plot` regression suite as the source of truth for:
  - registrar access/status coverage
  - pioneer follow-up discoverability through the notification control path
- Avoided adding broader harness logic or inventing new route behavior.

## Verification

- `pnpm --filter web test -- --runInBand __tests__/onboarding-regression-lock.test.ts __tests__/plot-ux-regression-lock.test.ts`
- `pnpm --filter web typecheck`

## Residual risk

- `/plot` is already dirty on this branch outside this lane, so the plot-side regression assertions were validated against current branch-local implementation rather than re-authored from scratch here.
- The onboarding lock is source-read coverage, which is stable for contract drift but does not replace future route-level interaction tests if the branch later changes input mechanics.
