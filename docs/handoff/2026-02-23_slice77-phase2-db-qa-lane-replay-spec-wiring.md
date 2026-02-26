# 2026-02-23 — Slice 77: Phase 2 DB QA Lane Replay Spec Wiring

## Scope
- Keep DB-backed replay finalize coverage explicit and stable in QA command wiring.
- No schema/API behavior changes.

## Implementation
- `apps/api/test/registrar.invite-delivery.replay.integration.test.ts`
  - Added dedicated DB integration test file for invite replay finalize behavior.
- `apps/api/test/registrar.invite-delivery.integration.test.ts`
  - Kept primary lifecycle integration spec focused on baseline queued/sent/failed path.
- `package.json`
  - Updated `qa:phase2:db` to run both integration specs.

## Docs
- Updated:
  - `docs/CHANGELOG.md`

## Validation
- `pnpm run docs:lint` — passed
- `pnpm run infra-policy-check` — passed
- `pnpm --filter api test -- registrar.invite-delivery.integration.test.ts registrar.invite-delivery.replay.integration.test.ts` — failed in this environment (DB unreachable at `localhost:5432`)
- `pnpm --filter api typecheck` — passed
- `pnpm --filter web typecheck` — passed
- `pnpm run qa:phase2` — passed

## Risk / Rollback
- Risk: low (test and command wiring only).
- Rollback: single commit revert; migration-free.
