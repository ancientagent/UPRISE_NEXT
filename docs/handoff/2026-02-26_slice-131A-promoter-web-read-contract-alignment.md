# Slice 131A — Promoter Web Read Contract Scaffolding Alignment

## Scope
- Align web typed contract/client scaffolding for existing promoter read APIs:
  - `GET /registrar/promoter/entries`
  - `GET /registrar/promoter/:entryId`
  - `GET /registrar/promoter/:entryId/capability-audit`
- No new UI actions/CTAs.

## Changes
- Updated `apps/web/__tests__/registrar-client.test.ts`:
  - Added promoter list read client fallback coverage.
  - Added promoter detail read client endpoint/payload passthrough coverage.
  - Added promoter capability-audit read client endpoint/payload passthrough coverage.
- Updated `docs/CHANGELOG.md`:
  - Added Unreleased entry for slice 131A.

## Validation Commands and Results
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter web test -- registrar-contract-inventory.test.ts registrar-client.test.ts` — PASS
4. `pnpm --filter web typecheck` — PASS
5. `pnpm --filter api typecheck` — PASS

## Risk / Rollback
- Risk: low (web client test-only alignment).
- Rollback: revert promoter test additions in `apps/web/__tests__/registrar-client.test.ts` and `docs/CHANGELOG.md` entry.
