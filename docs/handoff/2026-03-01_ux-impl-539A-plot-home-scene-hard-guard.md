# UX-IMPL-539A — Plot Home Scene Hard Guard

## Scope
Enforce the founder rule that users must not be in app flow surfaces without a resolvable Home Scene.

## Files Changed
- `apps/web/src/app/plot/page.tsx`
- `docs/CHANGELOG.md`

## Changes
- Added hard `hasHomeScene` gate in `/plot`.
- Added redirect effect: when Home Scene is missing, route to `/onboarding` using `router.replace('/onboarding')`.
- Added render suppression: `/plot` returns `null` while Home Scene is unresolved.
- Removed fallback-to-nearest-community behavior from the default community resolver on `/plot`.

## Verify Commands
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web typecheck
```

## Verify Result
- Passed (`docs:lint`, `infra-policy-check`, `web typecheck`).
