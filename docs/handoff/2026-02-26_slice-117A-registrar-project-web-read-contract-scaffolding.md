# Slice 117A — Registrar Project Web Read Contract Scaffolding

## Scope
- Add/align web typed contract/client scaffolding for existing API reads only:
  - `GET /registrar/project/entries`
  - `GET /registrar/project/:entryId`
- No new UI actions/CTAs.
- No API/schema changes.

## Files Changed
- `apps/web/src/lib/registrar/contractInventory.ts`
- `apps/web/src/lib/registrar/client.ts`
- `apps/web/__tests__/registrar-contract-inventory.test.ts`
- `apps/web/__tests__/registrar-client.test.ts`
- `docs/specs/system/registrar.md`
- `docs/CHANGELOG.md`

## Implementation
- Added project read endpoint inventory IDs and helpers (`listEntries`, `detail`) to web registrar contract inventory.
- Added typed client interfaces and methods:
  - `listProjectRegistrations(token)`
  - `getProjectRegistration(entryId, token)`
- Added focused tests for endpoint helper pathing, gap inventory IDs, and typed client GET calls/fallback behavior.

## Validation
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter web test -- registrar-contract-inventory.test.ts registrar-client.test.ts` — PASS (`2` suites, `12` tests)
4. `pnpm --filter web typecheck` — PASS
5. `pnpm --filter api typecheck` — PASS

## Risk / Rollback
- Risk: Low (web typed scaffolding/tests only; no behavior expansion).
- Rollback: revert the six files above; no migration rollback required.
