# 2026-02-23 — Slice 67/68 CI Lint Follow-up

## Context
- PR `#46` failed CI `Lint Code` due to two hard ESLint errors introduced in recent registrar slices.

## Fixes
- `apps/api/src/registrar/registrar.service.ts`
  - Replaced unused destructured variable pattern with copy+delete to omit `deliveries` from response payload.
- `apps/api/test/registrar.invite-delivery-worker.test.ts`
  - Removed unused `RegistrarService` import.

## Validation
- `pnpm --filter api lint` — passed (warnings only; no errors)
- `pnpm --filter api test -- registrar.service.test.ts registrar.invite-delivery-worker.test.ts` — passed
- `pnpm --filter api typecheck && pnpm --filter web typecheck` — passed

## Rollback
- Single-commit revert, migration-free.
