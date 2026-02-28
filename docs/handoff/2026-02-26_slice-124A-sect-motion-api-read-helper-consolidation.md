# Slice 124A — Sect-Motion API Read Helper Consolidation

## Scope
- Refactor-only consolidation for existing sect-motion read paths in registrar service.
- No endpoint/schema/UI changes.

## Files Changed
- `apps/api/src/registrar/registrar.service.ts`
- `docs/CHANGELOG.md`

## Implementation
- Added shared `mapSectMotionRegistrationRead(entry)` helper.
- Updated `listSectMotionRegistrations` and `getSectMotionRegistration` to use shared mapping helper.
- Preserved existing guard semantics and response contract.

## Validation
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter api test -- registrar.service.test.ts` — PASS (`1` suite, `89` tests)
4. `pnpm --filter api typecheck` — PASS
5. `pnpm --filter web typecheck` — PASS

## Risk / Rollback
- Risk: Low (internal refactor only).
- Rollback: revert modified files; no migration rollback required.
