# Slice 116A — Registrar Project Read Controller Parity Hardening

## Scope
- Existing endpoints only:
  - `GET /registrar/project/entries`
  - `GET /registrar/project/:entryId`
- Controller parity hardening + targeted tests + docs sync.
- No new endpoint, no migration, no UI changes.

## Files Changed
- `apps/api/test/registrar.controller.test.ts`
- `docs/specs/system/registrar.md`
- `docs/CHANGELOG.md`

## Implementation
- Added controller test ensuring normalized project detail payload (`projectName: null`) is passed through unchanged from service response.
- Added controller test ensuring project detail `ForbiddenException` is propagated unchanged.
- Synced registrar spec implemented-now text for controller parity coverage.

## Validation (exact gate order)
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter api test -- registrar.controller.test.ts registrar.service.test.ts` — PASS (`2` suites, `127` tests)
4. `pnpm --filter api typecheck` — PASS
5. `pnpm --filter web typecheck` — PASS

## Risk / Rollback
- Risk: Low (test/documentation + controller error-propagation parity assertions).
- Rollback: revert the three files above; no migration rollback needed.
