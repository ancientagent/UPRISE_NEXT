# Slice 125A — Sect-motion Controller Parity Tests (List/Detail Propagation)

## Scope
- Harden registrar controller parity coverage for sect-motion list/detail reads.
- Cover forbidden/not-found propagation and response passthrough expectations.
- No API route/schema changes.

## Changes
- Updated `apps/api/test/registrar.controller.test.ts`:
  - Added sect-motion list passthrough parity case validating mixed `countsByStatus` and entry ordering passthrough from service response.
  - Existing forbidden/not-found + detail payload passthrough coverage retained.
- Updated `docs/CHANGELOG.md`:
  - Added Unreleased entry for slice 125A.

## Validation Commands and Results
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter api test -- registrar.controller.test.ts registrar.service.test.ts` — PASS
4. `pnpm --filter api typecheck` — PASS
5. `pnpm --filter web typecheck` — PASS

## Risk / Rollback
- Risk: low (test-only parity hardening).
- Rollback: revert `apps/api/test/registrar.controller.test.ts` added sect-motion list parity test and `docs/CHANGELOG.md` entry.
