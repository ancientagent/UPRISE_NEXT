# 2026-02-23 — Slice 76: Invite Replay Finalize DB Integration Coverage

## Scope
- Extend DB-backed registrar invite lifecycle integration coverage for replay/idempotency behavior.
- No API surface or schema changes.

## Implementation
- `apps/api/test/registrar.invite-delivery.integration.test.ts`
  - Added integration test:
    - submits artist-band registration with one external member,
    - dispatches queued invite,
    - finalizes once (`sent`),
    - replays finalize with conflicting status (`failed`),
    - asserts replay returns `alreadyFinalized: true` with preserved original `sent` status and timestamp,
    - verifies persisted delivery + member statuses remain unchanged.

## Docs
- Updated:
  - `docs/specs/system/registrar.md`
  - `docs/CHANGELOG.md`

## Validation
- `pnpm run docs:lint` — passed
- `pnpm run infra-policy-check` — passed
- `pnpm --filter api test -- registrar.invite-delivery.integration.test.ts` — failed in this environment (DB unreachable at `localhost:5432`)
- `pnpm --filter api typecheck` — passed
- `pnpm --filter web typecheck` — passed
- `pnpm run qa:phase2` — passed

## Risk / Rollback
- Risk: low (test/docs only).
- Rollback: single commit revert; migration-free.
