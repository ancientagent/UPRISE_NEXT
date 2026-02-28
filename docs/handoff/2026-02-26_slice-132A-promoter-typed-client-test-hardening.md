# Slice 132A — Promoter Typed Client Test Hardening (Read Paths)

## Scope
- Harden web typed client tests for promoter read methods:
  - `listPromoterRegistrations`
  - `getPromoterRegistration`
  - `getPromoterCapabilityAudit`
- Contract-only; no UI changes.

## Changes
- Updated `apps/web/__tests__/registrar-client.test.ts`:
  - Added empty-data error assertions for promoter detail and capability-audit reads.
  - Added stable shape passthrough assertion for populated promoter list response.
- Updated `docs/CHANGELOG.md`:
  - Added Unreleased entry for slice 132A.

## Validation Commands and Results
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter web test -- registrar-client.test.ts` — PASS
4. `pnpm --filter web typecheck` — PASS
5. `pnpm --filter api typecheck` — PASS

## Risk / Rollback
- Risk: low (test-only hardening).
- Rollback: revert `apps/web/__tests__/registrar-client.test.ts` additions and `docs/CHANGELOG.md` entry.
