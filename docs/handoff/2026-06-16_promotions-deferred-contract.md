# Promotions Deferred Contract

Date: 2026-06-16
Agent: Codex GPT-5.5 high
Branch: `fix/promotions-deferred-contract`

## Summary
- Clarified that the promotions/offers read surface is retained/deferred runtime infrastructure, not a current MVP Plot tab.
- Updated the Plot tab contract test so it no longer teaches future agents that `Promotions` belongs beside current `Feed`, `Events`, and `Archive`.
- Preserved the existing retained promotions component/API seam without mounting it in `/plot`.

## Files Touched
- `apps/web/__tests__/plot-tab-contracts.test.ts`
- `docs/specs/economy/print-shop-and-promotions.md`
- `docs/CHANGELOG.md`

## Verification
- Red: `pnpm --filter web test -- plot-tab-contracts.test.ts` failed on the stale economy spec wording.
- Green: `pnpm --filter web test -- plot-tab-contracts.test.ts`

## Agent Notes
- Do not add a current MVP `Promotions` Plot tab.
- Do not delete retained/deferred promotion endpoint or client seams without a separate scoped cleanup decision.
- Current MVP Plot tabs remain `Feed`, `Events`, and `Archive`.
