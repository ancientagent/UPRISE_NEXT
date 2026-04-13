# 2026-04-13 — Source Dashboard Registrar Card Context

## Summary
- Tightened the `Registrar` card inside `apps/web/src/app/source-dashboard/page.tsx`.
- Active artist/band sources now see registrar copy that reflects source-attached civic follow-up work instead of a generic registrar description.

## Runtime Change
- Source Dashboard now computes registrar card copy from the active managed source context.
- Current artist/band runtime wording emphasizes:
  - registration status
  - member sync work
  - capability-code progress
- The route target remains `/registrar`; no new registrar endpoint or permission surface was added.

## Docs Updated
- `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md`
- `docs/CHANGELOG.md`

## Verification
- `pnpm --filter web test -- source-dashboard-shell-lock route-ux-consistency-lock`
- `pnpm --filter web typecheck`
- Browser QA via Chrome DevTools:
  - `/source-dashboard` renders `Review Artist filings`
  - card body references registration status, member sync work, capability-code progress
  - `Open Registrar` still routes correctly into `/registrar`
  - `/registrar` still shows the active source-context bridge
  - no console warnings/errors

## Notes
- This change is presentation/continuity only.
- Registrar remains a separate civic system and filings remain Home Scene-bound.
