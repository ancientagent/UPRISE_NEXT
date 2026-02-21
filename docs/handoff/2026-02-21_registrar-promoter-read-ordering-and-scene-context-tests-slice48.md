# 2026-02-21 — Registrar Promoter Read Ordering + Scene Context Tests (Slice 48)

## Scope
- Harden promoter read-path tests for list ordering and detail scene-context contract.
- Keep runtime logic unchanged.

## Implemented
- Tests: `apps/api/test/registrar.service.test.ts`
  - Added list-read guardrail asserting reverse-chronological ordering (`createdAt desc`) expectations.
  - Added detail-read contract assertion for scene-context passthrough fields.

## Validation
Commands run (all passed):
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- registrar.dto.test.ts registrar.controller.test.ts registrar.service.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" apps/api/test/registrar.service.test.ts docs/CHANGELOG.md docs/handoff/2026-02-21_registrar-promoter-read-ordering-and-scene-context-tests-slice48.md docs/handoff/README.md`
  - No new unauthorized CTA semantics introduced by this slice (historical changelog mention only).

## Rollback
- Remove added ordering and scene-context assertions from `registrar.service.test.ts`.

## Out of Scope Kept
- No endpoint/service logic changes.
- No schema/migration changes.
- No UI changes.
