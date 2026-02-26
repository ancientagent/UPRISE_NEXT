# Slice 120A — Registrar Project Typed Client Test Hardening

## Scope
- Contract-only web test hardening for project list/detail read client methods.
- No API/schema/UI behavior changes.

## Files Changed
- `apps/web/__tests__/registrar-client.test.ts`
- `docs/CHANGELOG.md`

## Implementation
- Added test: detail read throws when API response lacks `data`.
- Added test: list read preserves populated payload shape (`total`, `countsByStatus`, `entries`).

## Validation
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter web test -- registrar-client.test.ts registrar-contract-inventory.test.ts` — PASS (`2` suites, `14` tests)
4. `pnpm --filter web typecheck` — PASS
5. `pnpm --filter api typecheck` — PASS

## Risk / Rollback
- Risk: Low (test-only plus changelog update).
- Rollback: revert test file + changelog entry.
