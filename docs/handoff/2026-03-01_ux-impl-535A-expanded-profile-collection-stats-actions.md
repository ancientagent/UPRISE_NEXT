# UX-IMPL-535A — Expanded Profile: Collection + Stats + Actions

## Scope
Implement the next mobile-first UX/UI slice on `/plot` (expanded profile state):
- Strengthen collection-first composition with deterministic shelf preview controls.
- Keep statistics preview compact (2-3 module style) in expanded mode.
- Keep action row deterministic and route-stable.

## Files Changed
- `apps/web/src/app/plot/page.tsx`
- `docs/CHANGELOG.md`

## Notes
- Added expanded-profile collection shelf selector (`Tracks`, `Playlists`, `Saved`) with local state.
- Added lightweight collection preview content block under the selected shelf.
- Added compact statistics preview modules (`Community Members`, `Mode`, `Tier`).
- Action row now includes `Open Community`, optional `Open Collection Profile`, and `Return to Plot Tabs`.
- No route/modal transition changes; expanded profile remains in-route.

## Verify Command (exact)
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web typecheck
```

## Verify Result
- Passed (`docs:lint`, `infra-policy-check`, `web typecheck`).
