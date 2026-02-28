# Slice 150A — Registrar Controller Read-Path Parity Matrix Completion

## Scope
- Fill remaining registrar read controller parity tests for forbidden/not-found propagation.
- Existing endpoints only; no route/schema changes.

## Changes
- Updated `apps/api/test/registrar.controller.test.ts`:
  - Added forbidden propagation test for `verifyRegistrarCode`.
  - Added not-found propagation test for `getArtistBandInviteStatus`.
- Updated `docs/CHANGELOG.md`:
  - Added Unreleased entry for slice 150A.

## Validation Commands and Results
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter api test -- registrar.controller.test.ts registrar.service.test.ts` — PASS
4. `pnpm --filter api typecheck` — PASS
5. `pnpm --filter web typecheck` — PASS

## Risk / Rollback
- Risk: low (test-only parity coverage).
- Rollback: revert `apps/api/test/registrar.controller.test.ts` additions and `docs/CHANGELOG.md` entry.
