# Slice 141A — Invite Status Read API Test Hardening (Delivery Outcomes)

## Scope
- Harden invite status read tests for `deliveryStatus`, `sentAt`, `failedAt` permutations on existing `GET /registrar/artist/:entryId/invites`.
- No endpoint/schema changes.

## Changes
- Updated `apps/api/test/registrar.controller.test.ts`:
  - Tightened invite-status response passthrough assertions to include `countsByStatus` and member delivery fields.
- Updated `apps/api/test/registrar.service.test.ts`:
  - Added queued delivery-row permutation assertion (`deliveryStatus='queued'`, `sentAt=null`, `failedAt=null`).
- Updated `docs/CHANGELOG.md`:
  - Added Unreleased entry for slice 141A.

## Validation Commands and Results
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter api test -- registrar.service.test.ts registrar.controller.test.ts` — PASS
4. `pnpm --filter api typecheck` — PASS
5. `pnpm --filter web typecheck` — PASS

## Risk / Rollback
- Risk: low (test-only hardening).
- Rollback: revert updates in `apps/api/test/registrar.controller.test.ts` and `apps/api/test/registrar.service.test.ts`, plus changelog entry.
