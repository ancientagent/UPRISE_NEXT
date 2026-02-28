# Slice 123A — Sect-Motion Web Read Contract Scaffolding

## Scope
- Add/align web typed contract/client scaffolding for existing sect-motion read APIs:
  - `GET /registrar/sect-motion/entries`
  - `GET /registrar/sect-motion/:entryId`
- No user-facing UI action/CTA changes.

## Files Changed
- `apps/web/src/lib/registrar/contractInventory.ts`
- `apps/web/src/lib/registrar/client.ts`
- `apps/web/__tests__/registrar-contract-inventory.test.ts`
- `apps/web/__tests__/registrar-client.test.ts`
- `docs/specs/system/registrar.md`
- `docs/CHANGELOG.md`

## Validation
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter web test -- registrar-contract-inventory.test.ts registrar-client.test.ts` — PASS (`2` suites, `18` tests)
4. `pnpm --filter web typecheck` — PASS
5. `pnpm --filter api typecheck` — PASS

## Risk / Rollback
- Risk: Low (web contract/client scaffolding + tests only).
- Rollback: revert listed files; no migration rollback required.
