# SLICE-UXPLYR-862A

Date: 2026-03-19
Lane: C
Task: Expanded profile composition parity pass

## Scope
- Align expanded profile header/workspace composition and section ordering to the locked profile surface spec.
- Prevent composition drift without expanding runtime behavior.

## Changes
- Tightened `apps/web/__tests__/plot-ux-regression-lock.test.ts` to assert the expanded `/plot` profile composition order directly in source.
- Locked the spec sequence `Profile Summary -> Activity Score -> Calendar -> Player Context -> collection section tabs/content -> Return to Plot Tabs`.

## Verification
- Ran exactly: `pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck`

## Result
- Passed.
