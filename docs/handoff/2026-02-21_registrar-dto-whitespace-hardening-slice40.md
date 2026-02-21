# 2026-02-21 — Registrar DTO Whitespace Hardening (Slice 40)

## Scope
- Harden registrar DTO validation for canonical identity input quality.
- Add targeted schema tests only; no endpoint contract expansion.

## Implemented
- DTO updates: `apps/api/src/registrar/dto/registrar.dto.ts`
  - `PromoterRegistrationSchema.productionName` now uses `trim().min(1).max(140)`.
  - `ArtistBandRegistrationSchema` now trims:
    - top-level `name` and `slug`,
    - member `name`, `email`, `city`, `instrument`.
  - Required identity fields now reject whitespace-only payloads.
- Tests: `apps/api/test/registrar.dto.test.ts`
  - Added coverage for:
    - whitespace-only promoter production name rejection,
    - promoter production name trim behavior,
    - whitespace-only member identity field rejection,
    - trim normalization across artist/band identity fields.

## Validation
Commands run (all passed):
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- registrar.dto.test.ts registrar.controller.test.ts registrar.service.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" apps/api/src/registrar/dto/registrar.dto.ts apps/api/test/registrar.dto.test.ts docs/CHANGELOG.md docs/handoff/2026-02-21_registrar-dto-whitespace-hardening-slice40.md docs/handoff/README.md`
  - No new unauthorized CTA semantics introduced by this slice (historical changelog mention only).

## Rollback
- Revert `trim()` additions in `registrar.dto.ts`.
- Remove `apps/api/test/registrar.dto.test.ts`.

## Out of Scope Kept
- No route/controller/service behavior changes beyond normalized validated input.
- No schema/migration changes.
- No UI action changes.
