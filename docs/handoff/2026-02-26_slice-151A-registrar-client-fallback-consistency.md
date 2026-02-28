# Slice 151A — Registrar Client Fallback Behavior Consistency Tests

## Scope
- Harmonize fallback/error behavior tests for existing registrar web client read methods.
- Contract-only; no UI actions.

## Changes
- Updated `apps/web/__tests__/registrar-client.test.ts`:
  - Added list fallback assertions for `null` payloads (project, sect-motion, promoter).
  - Added sect-motion detail empty-response error assertion.
  - Kept existing detail/audit empty-response assertions for project/promoter to preserve consistent behavior.
- Updated `docs/CHANGELOG.md`:
  - Added Unreleased entry for slice 151A.

## Validation Commands and Results
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter web test -- registrar-client.test.ts` — PASS
4. `pnpm --filter web typecheck` — PASS
5. `pnpm --filter api typecheck` — PASS

## Risk / Rollback
- Risk: low (test-only consistency hardening).
- Rollback: revert `apps/web/__tests__/registrar-client.test.ts` additions and `docs/CHANGELOG.md` entry.
