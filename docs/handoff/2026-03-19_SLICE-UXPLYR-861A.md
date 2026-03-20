# SLICE-UXPLYR-861A

Date: 2026-03-19
Lane: C
Task: Engagement wheel mapping lock pass

## Scope
- Reinforce deterministic engagement-wheel mappings by player mode.
- Prevent wheel-action drift from the locked player/profile surface docs without expanding behavior.

## Changes
- Tightened `apps/web/__tests__/plot-ux-regression-lock.test.ts` to assert the exact ordered `RADIYO_WHEEL_ACTIONS` and `COLLECTION_WHEEL_ACTIONS` arrays exported from `apps/web/src/components/plot/engagement-wheel.ts`.
- Kept runtime behavior unchanged and preserved `engagement-wheel.ts` as the source of truth for mode-specific wheel mappings.

## Verification
- Ran exactly: `pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck`

## Result
- Passed.
