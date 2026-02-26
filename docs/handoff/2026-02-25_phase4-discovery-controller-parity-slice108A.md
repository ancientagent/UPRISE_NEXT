# 2026-02-25 — Phase 4 Slice 108A: Discovery Controller Parity

## Scope Lock
1. Add controller parity tests for discovery endpoints.
2. Cover query/body validation error paths.
3. Keep runtime endpoint behavior unchanged.
4. Keep changes additive and migration-free.
5. Capture exact validation gate outputs.

## Out of Scope
- Service logic changes.
- Endpoint contract changes.
- Web UI changes.
- Schema migrations.

## Changes Implemented
- Added `apps/api/test/communities.discovery.controller.test.ts`.
- Coverage includes:
  - `GET /discover/scenes` delegation + invalid query path.
  - `GET /discover/context` delegation path.
  - `POST /discover/tune` delegation + invalid body path.
  - `POST /discover/set-home-scene` delegation + invalid body path.

## Validation Commands
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- communities.discovery.controller.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Validation Results
- `pnpm run docs:lint` ✅ passed
- `pnpm run infra-policy-check` ✅ passed
- `pnpm --filter api test -- communities.discovery.controller.test.ts` ✅ passed (1 suite, 7 tests)
- `pnpm --filter api typecheck` ✅ passed
- `pnpm --filter web typecheck` ✅ passed

## Risk / Rollback
- Risk: low; tests only.
- Rollback: single commit revert.
