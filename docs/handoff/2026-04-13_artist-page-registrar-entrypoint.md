# 2026-04-13 — Artist Page Registrar Entrypoint

## Summary
- Added `Open Registrar` to the linked artist/band source page for source members.
- Source-managed artist pages now expose the same core source-side tool cluster:
  - `Source Dashboard`
  - `Open Print Shop`
  - `Open Registrar`

## Runtime Change
- `apps/web/src/app/artist-bands/[id]/page.tsx`
  - source members already had `Source Dashboard` and `Open Print Shop`
  - now also expose `Open Registrar`
- This uses the existing member ownership check; no new permission rule was introduced.

## Verification
- `pnpm --filter web test -- community-artist-page-lock route-ux-consistency-lock`
- `pnpm --filter web typecheck`
- Browser QA via Chrome DevTools:
  - linked artist page shows `OPEN REGISTRAR`
  - clicking it routes into `/registrar`
  - registrar still shows active source context
  - no console warnings/errors

## Notes
- This is continuity work only.
- Registrar remains Home Scene-bound and source context remains operator context, not filing-scope override.
