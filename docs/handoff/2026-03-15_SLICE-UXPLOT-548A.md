# SLICE-UXPLOT-548A

Date: 2026-03-15
Lane: A (`lane-a-ux-plot-batch16`)
Task: Plot Promotions IA/state contract overhaul pack 1
Status: completed

## Scope
Execute one MVP slice only: align `/plot` Promotions tab content model and error/empty handling with scene-scoped deterministic contract; no economy behavior expansion.

## Canon / Spec Anchors
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/economy/print-shop-and-promotions.md`
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`

## Implemented
- Added typed promotions client wrappers in `apps/web/src/lib/communities/client.ts` for explicit `/communities/:id/promotions` and `/communities/active/promotions` reads.
- Updated `apps/web/src/components/plot/PlotPromotionsPanel.tsx` to render deterministic Promotions states:
  - skeleton rows during initial load
  - explicit scene-scoped empty copy
  - retryable error copy with `Retry Promotions`
  - locked copy stating Promotions remain explicit local offers only with no Fair Play/governance/recommendation effect
- Added web client coverage in `apps/web/__tests__/communities-client.test.ts` for active-scene promotions query construction.

## Non-Changes / Guardrails
- Did not introduce offer creation, carry/redeem, billing, or any Print Shop write behavior.
- Did not change Feed, Events, Statistics, Social, or route ownership behavior.

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts communities-client.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```

## Verify Result
- Passed exactly as claimed.

## Files Touched
- `apps/web/src/lib/communities/client.ts`
- `apps/web/src/components/plot/PlotPromotionsPanel.tsx`
- `apps/web/__tests__/communities-client.test.ts`
- `docs/CHANGELOG.md`
