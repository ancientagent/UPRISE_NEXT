# UX-IMPL-538A — Plot Layout Expansion

## Scope
Expand Plot content to match the rest of the surface composition while preserving existing UX behavior contracts.

## Files Changed
- `apps/web/src/app/plot/page.tsx`
- `docs/CHANGELOG.md`

## Changes
- Widened `/plot` page shell from `max-w-6xl` to `max-w-7xl`.
- Adjusted page padding for better horizontal use on medium/large viewports.
- Expanded collapsed-state Plot grid to a weighted layout:
  - `lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]`
- Increased primary Plot panel spacing (`lg:p-7`) for visual parity with other sections.
- Added explicit right-column fallback card when no community is selected to keep layout balanced.

## Verify Command (exact)
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web typecheck
```

## Verify Result
- Passed (`docs:lint`, `infra-policy-check`, `web typecheck`).
