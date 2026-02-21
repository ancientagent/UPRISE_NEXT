# 2026-02-21 — Registrar Promoter QA Lane Shortcut (Slice 39)

## Scope
- Finalize in-progress QA ergonomics work for registrar promoter slices.
- Keep runtime behavior unchanged (tooling/docs only).

## Implemented
- Scripts: `package.json`
  - Added `qa:registrar-promoter`:
    - `pnpm run docs:lint`
    - `pnpm run infra-policy-check`
    - `pnpm --filter api test -- registrar.controller.test.ts registrar.service.test.ts`
    - `pnpm --filter api typecheck`
- Docs: `docs/RUNBOOK.md`
  - Added the new registrar promoter QA lane command to troubleshooting test workflow examples.

## Validation
Commands run (all passed):
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- registrar.controller.test.ts registrar.service.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`
- `pnpm run qa:registrar-promoter`

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" package.json docs/RUNBOOK.md docs/CHANGELOG.md docs/handoff/2026-02-21_registrar-promoter-qa-lane-shortcut-slice39.md docs/handoff/README.md`
  - No new unauthorized CTA semantics introduced by this slice (historical changelog mention only).

## Rollback
- Remove `qa:registrar-promoter` from `package.json`.
- Remove the corresponding runbook mention.

## Out of Scope Kept
- No API/controller/service behavior changes.
- No schema/migration changes.
- No web UI/CTA changes.
