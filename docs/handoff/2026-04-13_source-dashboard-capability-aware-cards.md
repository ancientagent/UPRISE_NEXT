# 2026-04-13 — Source Dashboard Capability-Aware Cards

## Summary
- Tightened `apps/web/src/app/source-dashboard/page.tsx` so creator-tool cards reflect real capability state instead of static copy.
- Current runtime focus is the `Print Shop` card.

## Runtime Change
- Source Dashboard now reads promoter registration state via `listPromoterRegistrations(token)`.
- `Print Shop` card copy now reflects:
  - linked artist/band source membership
  - promoter capability when granted
  - GPS-gated promoter progression when capability is not yet available

## Verified Live State
- For the current QA account:
  - linked source membership is present
  - promoter capability is not granted
  - GPS verification is not complete
- Live dashboard copy now says:
  - linked source membership still opens Print Shop
  - GPS verification is still required before promoter capability can progress in Registrar

## Verification
- `pnpm --filter web test -- source-dashboard-shell-lock route-ux-consistency-lock`
- `pnpm --filter web typecheck`
- Browser QA via Chrome DevTools:
  - `/source-dashboard` renders the new Print Shop card copy
  - no console warnings/errors

## Notes
- This is state-aware guidance only.
- No new permission path or billing/promotion behavior was introduced.
