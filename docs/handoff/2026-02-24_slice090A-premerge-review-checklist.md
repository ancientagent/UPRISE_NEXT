# 2026-02-24 — Slice 090A Pre-Merge Review Checklist (P3-REV-002)

## Scope
1. Prepare a governance checklist for pre-merge review across API, web, and QA outputs for slice `090A`.
2. Keep this docs-only and non-behavioral.
3. Provide explicit go/hold criteria for orchestrator review.

## Input Artifacts
- API output (`P3-API-090A`):
  - Commit: `b9aa975`
  - Report: `docs/handoff/2026-02-24_slice89-registrarcode-persistence-foundation.md`
- Web output (`P3-WEB-090A`):
  - Commit: `56067b0`
  - Report: `apps/web/src/lib/registrar/client.ts`
- QA output (`P3-QA-090A`):
  - Status at checklist time: `queued` (not completed yet)
  - Queue file: `/tmp/uprise_next_agent_queue.json`

## Readiness Snapshot (Checklist Creation Time)
| Lane | Task | Status | Review Readiness |
|---|---|---|---|
| `api-schema` | `P3-API-090A` | `done` | Ready for review of migration + service guardrails |
| `web-contracts` | `P3-WEB-090A` | `done` | Ready for review of typed client scaffold + no new actions |
| `qa-ci` | `P3-QA-090A` | `queued` | Not merge-ready until validation evidence is produced |

## Pre-Merge Checklist
- [ ] Confirm queue shows `P3-QA-090A` as `done` (or explicitly `blocked` with accepted reason).
- [ ] Verify API additive-only posture:
  - `apps/api/prisma/migrations/20260224101500_add_registrar_codes/migration.sql` adds table only.
  - No destructive migration included in `P3-API-090A`.
- [ ] Verify policy lock enforcement in API service:
  - issuer must be `system`,
  - registrar entry `type = promoter_registration`,
  - registrar entry `status = approved`.
- [ ] Verify web scope did not add unauthorized actions:
  - typed client and inventory scaffolding only,
  - no new user-facing CTAs/actions introduced.
- [ ] Confirm validation command evidence exists for each completed lane artifact:
  - docs lint,
  - infra policy check,
  - targeted tests/typecheck listed in each lane report.
- [ ] Confirm queue has no unresolved blockers for `phase3` slice `090A` dependencies.

## Go / Hold Criteria
1. **Go** when API + Web + QA slice-090A tasks are all `done` with passing validation evidence and no unresolved blocker in queue.
2. **Hold** when any of the following is true:
   - `P3-QA-090A` is not complete,
   - validation evidence is missing/inconsistent with touched scope,
   - web adds unsupported user actions beyond approved spec scope.
3. **Rollback preference** for regressions:
   - single-commit revert per slice (`P3-API-090A`, `P3-WEB-090A`, `P3-QA-090A`) rather than bundled rollback.

## Validation for This Checklist Task
- `pnpm run docs:lint`
