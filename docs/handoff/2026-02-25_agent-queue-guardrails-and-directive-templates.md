# 2026-02-25 — Agent Queue Guardrails + Directive Templates

## Summary
This slice hardens the lane-queue control plane with enforceable parallelization guardrails and standardized directive templates for a six-agent operating model.

## Implemented
- `scripts/agent-control.mjs`
  - Added child-task guardrails to `assign`:
    - `--parent-id` support,
    - parent `allowSpawn` enforcement,
    - `maxDepth` and `maxChildren` enforcement,
    - required child metadata (`--depends-on <parent>`, `--planned-report`, `--rollback-note`).
  - Added spawn policy metadata persisted per task (`spawnPolicy`, `parentId`, `depth`, `children`, `planned`).
  - Added orchestrator-only check for assigning `--allow-spawn` tasks.
  - Extended directive payload auto-attachment with:
    - `parallelGuardrails`,
    - `agentRoleProfiles`.
  - Upgraded `backfill-directives` to patch partial legacy directive blocks, not just missing directive objects.
- `scripts/agent-control.test.mjs`
  - Added coverage for:
    - child-task dependency/report/rollback requirements,
    - max-children enforcement,
    - max-depth enforcement,
    - non-orchestrator spawn-authority rejection,
    - directive backfill for partially-missing directive structures.
- `docs/handoff/agent-control/AGENT_DIRECTIVES.md`
  - Added copy-ready directive templates for:
    - `codex-orchestrator`,
    - `codex-api-1`,
    - `codex-web-1`,
    - `codex-qa-1`,
    - `codex-docs-1`,
    - `codex-review-1`.
- `docs/handoff/agent-control/README.md`
  - Documented new assign flags and enforced child-task guardrails.

## Risk / Rollback
- Risk: low. Changes are isolated to task-queue orchestration tooling and documentation.
- Rollback: single-commit revert; no schema migration or product runtime surface impact.

## Validation
Run:
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm run agent:queue:test`
