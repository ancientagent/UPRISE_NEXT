# Slice 166A — Registrar Controller Read-Path Negative Matrix Completion

## Scope
- Complete missing forbidden/not-found controller read-path negative cases for existing registrar read endpoints.

## Changes
- Updated `apps/api/test/registrar.controller.test.ts`:
  - Added not-found propagation tests for list reads:
    - `listMyPromoterRegistrations`
    - `listMyProjectRegistrations`
    - `listMySectMotionRegistrations`
    - `listMyArtistBandRegistrations`
- Updated `docs/CHANGELOG.md`:
  - Added Unreleased entry for slice 166A.

## Validation Commands and Results
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter api test -- registrar.controller.test.ts registrar.service.test.ts` — PASS
4. `pnpm --filter api typecheck` — PASS
5. `pnpm --filter web typecheck` — PASS

## Risk / Rollback
- Risk: low (test-only negative-case coverage additions).
- Rollback: revert new tests in `apps/api/test/registrar.controller.test.ts` and `docs/CHANGELOG.md` entry.
