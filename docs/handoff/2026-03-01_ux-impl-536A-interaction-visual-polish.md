# UX-IMPL-536A — Interaction + Visual Polish

## Scope
Implement the next mobile-first UX/UI polish slice on `/plot`:
- Improve profile seam affordance clarity across `collapsed`, `peek`, `expanded`.
- Strengthen visual mode differentiation for `RADIYO` vs `Collection` controls.
- Add lightweight transition polish without changing route/behavior contracts.

## Files Changed
- `apps/web/src/app/plot/page.tsx`
- `apps/web/src/components/plot/RadiyoPlayerPanel.tsx`
- `docs/CHANGELOG.md`

## Notes
- Added state-aware seam label text and explicit profile-state chip in header.
- Added transition timing polish to profile/header and expanded-profile wrapper.
- Updated player mode switch presentation:
  - `RADIYO` active state highlighted in lime.
  - `Collection` active state highlighted in blue.
  - Wrapped mode switch in a dedicated segmented container.
- Kept all existing route and composition behavior intact.

## Verify Command (exact)
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web typecheck
```

## Verify Result
- Passed (`docs:lint`, `infra-policy-check`, `web typecheck`).
