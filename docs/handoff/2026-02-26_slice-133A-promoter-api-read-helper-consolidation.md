# Slice 133A — Promoter API Read Mapping Helper Consolidation

## Scope
- Consolidate promoter list/detail read mapping into shared internal helper(s) in registrar service.
- Refactor-only within existing read paths.
- No endpoint/schema/UI changes.

## Changes
- Updated `apps/api/src/registrar/registrar.service.ts`:
  - Added shared helper `mapPromoterRegistrationRead(...)` for promoter list/detail read response mapping.
  - Added shared helper `mapPromoterCapabilitySummary(...)` for promoter capability summary shape.
  - Switched `listPromoterRegistrations` and `getPromoterRegistration` to shared helper mapping while preserving existing payload/capability semantics.
- Updated `docs/CHANGELOG.md`:
  - Added Unreleased entry for slice 133A.

## Validation Commands and Results
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter api test -- registrar.service.test.ts` — PASS
4. `pnpm --filter api typecheck` — PASS
5. `pnpm --filter web typecheck` — PASS

## Risk / Rollback
- Risk: low (refactor-only mapper consolidation).
- Rollback: revert `apps/api/src/registrar/registrar.service.ts` helper extraction and `docs/CHANGELOG.md` slice entry.
