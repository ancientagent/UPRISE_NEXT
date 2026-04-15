# 2026-04-15 — Registrar Listener-Side Bridge Cleanup

## Summary
Reconciled the active Registrar doctrine to the listener-side actor model locked in `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`.

## What Changed
- `docs/specs/system/registrar.md`
  - clarified that source-facing entrypoints into `/registrar` are transitional bridges only
  - kept source context visibility informational only
  - kept Registrar itself listener-owned
- `docs/specs/users/identity-roles-capabilities.md`
  - reframed promoter capability-code access from a source-side flow to a listener-owned registrar flow with transitional source links
  - removed wording that grouped Registrar as a normal source-dashboard tool

## Result
Active docs now describe Registrar as:
- listener-side
- Home Scene-bound
- optionally linked from source-facing surfaces during the current bridge period
- not a true source-side operating system

## Verification
- `pnpm run docs:lint`
- `git diff --check`
