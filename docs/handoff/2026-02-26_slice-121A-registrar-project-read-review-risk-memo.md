# Slice 121A — Risk/Rollback Review Memo (Registrar Project Read Batch)

## Findings (ordered by severity)
- None.

## Residual Risks / Gaps
- Medium: End-to-end web UI invocation remains intentionally out of scope; current batch covers API + web typed contract/client scaffolding and test surfaces only.
- Low: Queue-driven slice orchestration relies on disciplined per-slice verification and handoff updates; skipping either can still produce stale queue state.

## Rollback Guidance
- Slice-scoped rollback is migration-free.
- Revert by handoff slice grouping:
  - API read hardening/parity: `apps/api/src/registrar/registrar.service.ts`, `apps/api/test/registrar.service.test.ts`, `apps/api/test/registrar.controller.test.ts`
  - Web read scaffolding/tests: `apps/web/src/lib/registrar/contractInventory.ts`, `apps/web/src/lib/registrar/client.ts`, `apps/web/__tests__/registrar-contract-inventory.test.ts`, `apps/web/__tests__/registrar-client.test.ts`
  - Docs/handoff/changelog entries: corresponding files under `docs/handoff/` + `docs/specs/system/registrar.md` + `docs/CHANGELOG.md`
- Post-rollback verification:
  1. `pnpm run docs:lint`
  2. `pnpm run infra-policy-check`
  3. `pnpm --filter api typecheck`
  4. `pnpm --filter web typecheck`
