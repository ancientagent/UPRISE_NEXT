# Slice 114B — Registrar Project Read Payload Hardening

## Scope
- Harden existing project read endpoints only:
  - `GET /registrar/project/entries`
  - `GET /registrar/project/:entryId`
- Additive/non-breaking read normalization only.
- No new endpoint, no migration, no web UI changes.

## Files Changed
- `apps/api/src/registrar/registrar.service.ts`
- `apps/api/test/registrar.service.test.ts`
- `docs/specs/system/registrar.md`
- `docs/CHANGELOG.md`

## Implementation
- Switched project list/detail payload normalization to `normalizeRegistrarPayloadObject(entry.payload)` before `projectName` extraction.
- Added service tests to confirm malformed/non-object payloads normalize to `payload.projectName = null` for both list and detail paths.
- Synced implemented-now spec wording and changelog.

## Validation (exact gate order)
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter api test -- registrar.controller.test.ts registrar.service.test.ts` — PASS (`2` suites, `125` tests)
4. `pnpm --filter api typecheck` — PASS
5. `pnpm --filter web typecheck` — PASS

## Risk / Rollback
- Risk: Low (read-path normalization hardening only).
- Rollback: revert the four files above; no data migration rollback required.
