# Slice 149A — Registrar Read Response Typing Cleanup

## Scope
- Tighten typed contract alignment for existing registrar read responses in web client types.
- No endpoint or runtime behavior changes.

## Changes
- Updated `apps/web/src/lib/registrar/client.ts`:
  - Tightened read entry `type` fields to endpoint-aligned literals (`artist_band_registration`, `project_registration`, `sect_motion`, `promoter_registration`).
  - Introduced `RegistrarEntryStatus` alias and aligned status typing across read response interfaces.
  - Aligned promoter read `scene` typing to nullable shape for contract safety.
- Updated `docs/CHANGELOG.md`:
  - Added Unreleased entry for slice 149A.

## Validation Commands and Results
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter web typecheck` — PASS
4. `pnpm --filter api typecheck` — PASS

## Risk / Rollback
- Risk: low (type-only contract cleanup).
- Rollback: revert `apps/web/src/lib/registrar/client.ts` type changes and `docs/CHANGELOG.md` entry.
