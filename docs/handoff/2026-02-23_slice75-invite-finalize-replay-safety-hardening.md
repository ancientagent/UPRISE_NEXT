# 2026-02-23 — Slice 75: Invite Finalize Replay-Safety Hardening

## Scope
- Harden invite-delivery finalize semantics for replay/concurrency safety.
- Keep migration-free and additive contract behavior.

## Implementation
- `apps/api/src/registrar/registrar.service.ts`
  - `finalizeQueuedInviteDelivery` now:
    - returns `alreadyFinalized: true` without mutation when delivery row is already finalized,
    - performs queued-only atomic finalize via `updateMany(... where status='queued')`,
    - handles update race by returning current persisted state instead of overwriting.
- `apps/api/test/registrar.service.test.ts`
  - Updated queued finalize assertion for `updateMany` guard.
  - Added coverage for:
    - already-finalized early return path,
    - race path where queued update count is `0` and current finalized state is returned.

## Docs
- Updated:
  - `docs/specs/system/registrar.md`
  - `docs/specs/users/identity-roles-capabilities.md`
  - `docs/CHANGELOG.md`

## Validation
- `pnpm run docs:lint` — passed
- `pnpm run infra-policy-check` — passed
- `pnpm --filter api test -- registrar.service.test.ts registrar.invite-delivery-worker.test.ts` — passed
- `pnpm --filter api typecheck` — passed
- `pnpm --filter web typecheck` — passed
- `pnpm run qa:phase2` — passed

## Risk / Rollback
- Risk: low (logic hardening on existing internal finalize primitive).
- Rollback: single commit revert; no schema rollback required.
