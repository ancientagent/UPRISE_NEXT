# 2026-04-13 — Registrar Source Context Bridge

## Summary
- Added active source-context visibility to `apps/web/src/app/registrar/page.tsx`.
- Preserved the Registrar civic rule: filings remain Home Scene-bound even when the user is operating from a selected source account.
- Added a Source Dashboard return path on `/registrar` for users with managed sources.

## Runtime Change
- `/registrar` now loads the current user source profile and reads the persisted `activeSourceId`.
- When an active managed source exists, Registrar shows:
  - source name
  - entity type / membership role
  - clarification that source context is operator context only
- When managed sources exist but none is selected, Registrar explains that source-facing capability work is clearer from `Source Dashboard`.
- When no managed sources exist, Registrar falls back to listener civic context copy.

## Docs Updated
- `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md`
- `docs/solutions/MVP_ACCOUNT_SOURCE_SIGNAL_SYSTEM_PLAN_R1.md`
- `docs/specs/system/registrar.md`

## Verification
- `pnpm --filter web test -- route-ux-consistency-lock registrar-source-context-lock source-dashboard-shell-lock`
- `pnpm --filter web typecheck`
- `git diff --check`

## Notes
- This slice does not widen Registrar into a source-owned filing system.
- It only makes source-side operating context visible so source-attached users see `/registrar` as part of the same one-account source/tool shell.
