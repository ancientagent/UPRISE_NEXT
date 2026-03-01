# UX-02 / UX-03 — Plot Profile Expansion + Mode-Aware Player Integration

## Scope
Implemented the next UX execution slices on `ux-implementation`:
- In-route profile expansion panel in Plot (no route transition).
- Body swap behavior: expanded profile replaces Plot tab/grid content.
- Top/global mode-aware player strip with explicit `radiyo` / `collection` behavior.
- Collection item selection switches player mode to collection.
- Explicit control to switch back to RaDIYo mode.

## Files Changed
- `apps/web/src/app/plot/page.tsx`
- `apps/web/src/components/plot/PlotPlayerStrip.tsx`
- `apps/web/src/components/plot/ProfileExpansionPanel.tsx`

## Canon Alignment
- Uses explicit mode switching only (no auto hidden switch).
- Keeps player in-route and in-flow (not fixed bottom global bar).
- Uses implemented user profile/collection API (`GET /users/:id/profile`) and broadcast rotation read endpoint (`GET /broadcast/rotation`).

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
- Gesture implementation is pointer-threshold based for web and includes button fallback (`Open Profile` / `Collapse`).
- Expanded state keeps route unchanged and restores prior Plot snapshot on collapse.
- Collection track metadata parsing is tolerant of multiple metadata key shapes.
