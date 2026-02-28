# Slice 134A — Promoter Controller Parity Hardening (Detail/Audit Reads)

## Scope
- Harden registrar controller parity tests for promoter detail and capability-audit read paths.
- Add forbidden/not-found propagation coverage.
- No API route/schema changes.

## Changes
- Updated `apps/api/test/registrar.controller.test.ts`:
  - Added promoter detail forbidden propagation test (`ForbiddenException`).
  - Added promoter capability-audit not-found propagation test (`NotFoundException`).
- Updated `docs/CHANGELOG.md`:
  - Added Unreleased entry for slice 134A.

## Validation Commands and Results
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter api test -- registrar.controller.test.ts registrar.service.test.ts` — PASS
4. `pnpm --filter api typecheck` — PASS
5. `pnpm --filter web typecheck` — PASS

## Risk / Rollback
- Risk: low (test-only parity hardening).
- Rollback: revert `apps/api/test/registrar.controller.test.ts` new cases and `docs/CHANGELOG.md` entry.
