# Slice 143A — Registrar Implemented-Now Spec Consistency Pass

## Scope
- Docs-only consistency pass for registrar implemented-now wording.
- No API/UI/schema behavior changes.

## Changes
- Updated `docs/specs/system/registrar.md`:
  - Normalized implemented-now wording for project + sect-motion web contract scaffolding.
  - Aligned language to consistently state API-implemented surfaces with web typed scaffolding and action-gated UI status.
  - Updated `Last Updated` metadata.
- Updated `docs/CHANGELOG.md` with slice 143A entry.

## Validation Commands and Results
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter api typecheck` — PASS
4. `pnpm --filter web typecheck` — PASS

## Risk / Rollback
- Risk: low (docs-only wording/metadata sync).
- Rollback: revert `docs/specs/system/registrar.md` and `docs/CHANGELOG.md` entries.
