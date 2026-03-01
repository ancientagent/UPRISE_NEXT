# UX-IMPL-532A — Player Shell (`RADIYO` / `Collection`)

## Scope
Implement the next mobile-first UX/UI slice on `/plot`:
- Add dedicated player shell under profile seam.
- Add explicit `RADIYO` and `Collection` mode selectors.
- Add `New Releases` / `Main Rotation` pool controls in `RADIYO` mode.
- Keep behavior scaffold-only and route-stable.

## Files Changed
- `apps/web/src/components/plot/RadiyoPlayerPanel.tsx` (new)
- `apps/web/src/app/plot/page.tsx`
- `docs/CHANGELOG.md`

## Notes
- Introduced a self-contained player shell component with mode-specific control surfaces.
- Wired mode and pool state in `plot/page.tsx` via local component state (`PlayerMode`, `RotationPool`).
- Broadcast label reflects Home Scene context fallback when unset.
- Existing Plot tab/content structure left intact for this slice.

## Verify Command (exact)
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web typecheck
```

## Verify Result
- Passed (`docs:lint`, `infra-policy-check`, `web typecheck`).
