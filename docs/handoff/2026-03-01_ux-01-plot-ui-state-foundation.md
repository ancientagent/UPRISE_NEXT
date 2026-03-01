# UX-01 — Plot UI State Foundation

## Scope
Implemented the first UX execution slice on `ux-implementation`:
- Plot/profile panel state machine contract.
- Player mode state contract (`radiyo` / `collection`).
- Plot snapshot state primitives for restore-on-collapse behavior.
- Focused tests for state transition and store behavior.

## Files Added
- `apps/web/src/lib/plot-ui-state-machine.ts`
- `apps/web/src/store/plot-ui.ts`
- `apps/web/__tests__/plot-ui-state-machine.test.ts`
- `apps/web/__tests__/plot-ui-store.test.ts`

## Verification Commands
```bash
pnpm --filter web test -- plot-ui-state-machine.test.ts plot-ui-store.test.ts
pnpm --filter web typecheck
```

## Verification Output (summary)
- `PASS __tests__/plot-ui-state-machine.test.ts`
- `PASS __tests__/plot-ui-store.test.ts`
- `Tests: 8 passed, 8 total`
- `web typecheck: tsc --noEmit` passed

## Notes
- This slice intentionally adds state/test foundation only (no full profile panel body swap UI yet).
- Designed for downstream UX slices (`UX-02` onward) to consume without drift.
