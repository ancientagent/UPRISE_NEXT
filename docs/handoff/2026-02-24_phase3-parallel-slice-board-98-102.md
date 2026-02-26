# 2026-02-24 — Phase 3 Parallel Slice Board (98–102)

## Scope Lock
1. Define lane-owned, PR-safe slices for next Phase 3 registrar backlog.
2. Keep all slices spec-authorized (no new unapproved UI actions).
3. Explicitly map dependencies for parallel execution.
4. Ensure each slice has validation gates and handoff requirements.

## Out of Scope
- Auto-merging branches.
- Any destructive migration/removal work.
- Unapproved web CTA/action additions.

## Queue / Lanes
- Queue path: `/tmp/uprise_next_phase3_parallel_batch1.json`
- Lane config: `docs/handoff/agent-control/lanes.json`

## Parallel-First Assignment Plan

### Wave 1 (claimable in parallel now)
1. `P3-API-098A` (`api-schema`)
   - Scope:
     - Implement `POST /registrar/project` submission primitive in registrar module.
     - Add DTO/service/controller + unit tests.
     - Keep status lifecycle additive (`submitted` baseline), no approval workflow in this slice.
   - Validation:
     - `pnpm run docs:lint`
     - `pnpm run infra-policy-check`
     - `pnpm --filter api test -- registrar.dto.test.ts registrar.controller.test.ts registrar.service.test.ts`
     - `pnpm --filter api typecheck`
     - `pnpm --filter web typecheck`

2. `P3-QA-095B` (`qa-ci`)
   - Scope:
     - Run focused regression for completed slices 95–97.
     - Publish pass/fail report with exact command output and failing-path notes (if any).
   - Validation commands to run/report:
     - `pnpm run docs:lint`
     - `pnpm run infra-policy-check`
     - `pnpm --filter api test -- registrar.dto.test.ts registrar.controller.test.ts registrar.service.test.ts`
     - `pnpm --filter api typecheck`
     - `pnpm --filter web typecheck`

3. `P3-REV-095B` (`review-risk`)
   - Scope:
     - Review-risk memo for slices 95–97:
       - regression risk,
       - rollback viability,
       - drift scan results.
   - Output:
     - review memo with findings ordered by severity (or explicit no-findings note).

4. `P3-DOC-098B` (`docs-program`)
   - Scope:
     - Maintain execution board/checklist for slices 98–102.
     - Ensure handoff template fields and validation requirements are explicit for lane agents.

### Wave 2 (dependency-driven)
5. `P3-API-099A` (`api-schema`, depends on `P3-API-098A`)
   - Scope:
     - Implement `POST /registrar/sect-motion` skeleton submission primitive.
     - Add explicit lifecycle state baseline (`submitted`), no approval state machine in this slice.
     - Add DTO/service/controller + tests.

6. `P3-WEB-098A` (`web-contracts`, depends on `P3-API-098A`)
   - Scope:
     - Add web typed contract/client support for `POST /registrar/project`.
     - Keep no new UI action; contract scaffolding only.

7. `P3-QA-098A` (`qa-ci`, depends on `P3-API-099A,P3-WEB-098A`)
   - Scope:
     - Run project+sect targeted validation lane and report exact outputs.

8. `P3-DOC-098A` (`docs-program`, depends on `P3-API-099A,P3-WEB-098A,P3-QA-098A`)
   - Scope:
     - Update touched specs, changelog, and handoff index for slices 98/99.

9. `P3-REV-098A` (`review-risk`, depends on `P3-DOC-098A`)
   - Scope:
     - Final risk/rollback signoff memo for the 98/99 batch.

## Lane Agent Completion Contract (required)
- Include:
  - changed files list,
  - exact validation commands + outputs,
  - risk + rollback note,
  - `git status --short`,
  - commit hash and branch.
