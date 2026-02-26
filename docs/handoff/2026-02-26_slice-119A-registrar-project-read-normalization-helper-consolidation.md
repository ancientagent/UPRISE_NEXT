# Slice 119A — Registrar Project Read Normalization Helper Consolidation

## Scope
- Refactor-only consolidation inside existing project read paths.
- Preserve list/detail API contract and normalization behavior.
- No endpoint/schema/UI changes.

## Files Changed
- `apps/api/src/registrar/registrar.service.ts`
- `docs/CHANGELOG.md`

## Implementation
- Added shared `mapProjectRegistrationRead(entry)` helper in registrar service.
- Updated both `listProjectRegistrations` and `getProjectRegistration` to use shared helper.
- Preserved object-shape guard + `projectName` normalization semantics.

## Validation
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter api test -- registrar.service.test.ts` — PASS (`1` suite, `89` tests)
4. `pnpm --filter api typecheck` — PASS
5. `pnpm --filter web typecheck` — PASS

## Risk / Rollback
- Risk: Low (internal refactor only).
- Rollback: revert `registrar.service.ts` + changelog entry.
