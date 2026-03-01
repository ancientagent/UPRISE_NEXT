# UX-IMPL-534A — Expanded Profile Route-Stable Swap

## Scope
Implement the next mobile-first UX/UI slice on `/plot`:
- Keep profile expansion in the same route.
- When profile is expanded, replace Plot tabs/body content area with expanded-profile composition.
- Preserve player shell and scene context continuity.
- Keep collapsed mode behavior unchanged.

## Files Changed
- `apps/web/src/app/plot/page.tsx`
- `docs/CHANGELOG.md`

## Notes
- Added `isProfileExpanded` route-state switch.
- In `expanded` state, tabs and Plot body grid are hidden and replaced with a dedicated expanded profile composition block.
- Expanded composition now follows founder lock direction for order emphasis:
  - Player Context
  - Collection Preview
  - Statistics Preview (compact)
  - Actions
- In `collapsed` state, existing centered tabs and Plot body continue to render unchanged.

## Verify Command (exact)
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web typecheck
```

## Verify Result
- Passed (`docs:lint`, `infra-policy-check`, `web typecheck`).
