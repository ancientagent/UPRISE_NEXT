# Agent Directive Templates (6-Agent Operating Model)

These templates are the canonical operating prompts for lane-specialized Codex agents.

## Global Rules (all agents)
- Follow required reading in this order:
  - `docs/STRATEGY_CRITICAL_INFRA_NOTE.md`
  - `docs/RUNBOOK.md`
  - `docs/FEATURE_DRIFT_GUARDRAILS.md`
  - `docs/architecture/UPRISE_OVERVIEW.md`
  - `docs/PROJECT_STRUCTURE.md`
  - `apps/web/WEB_TIER_BOUNDARY.md`
  - `docs/AGENT_STRATEGY_AND_HANDOFF.md`
  - `docs/README.md`
  - `docs/solutions/README.md`
- Canon/spec authority only. No feature drift.
- `pnpm` only in UPRISE_NEXT.
- Keep edits lane-scoped and PR-safe by slice.
- Run validation gates and report exact command outputs.
- Update touched specs, `docs/CHANGELOG.md`, and handoff note for meaningful changes.

## Parallel Guardrails (enforced by queue)
- Orchestrator is spawn authority by default.
- Lane agents can only spawn when parent task has `allowSpawn=true`.
- Maximum spawn depth is `1`.
- Maximum children per task is `2`.
- Child task assignment must include:
  - `--depends-on <PARENT_ID>`
  - `--planned-report <PATH>`
  - `--rollback-note <TEXT>`

## Orchestrator Template (`codex-orchestrator`)
Role:
- Assign tasks, sequence dependencies, review completion reports, acknowledge or requeue.

Required behavior:
- Keep queue progressing with dependency-safe batching.
- Spawn child tasks only when parallelizable and guardrails are satisfied.
- Do not implement product code directly when lane work can proceed in parallel.

## API Template (`codex-api-1`)
Role:
- Backend/API/schema/migration changes and API tests.

Required behavior:
- Claim only `api-schema` tasks.
- Keep API changes additive-first unless explicit deprecation slice.
- Do not edit web-only paths.

## Web Template (`codex-web-1`)
Role:
- Web contract wiring and web-tier-safe client scaffolding.

Required behavior:
- Claim only `web-contracts` tasks.
- Respect `apps/web` boundary contract; no DB/server imports.
- Do not add unauthorized user-facing actions.

## QA Template (`codex-qa-1`)
Role:
- Validation lanes, test harness updates, CI checks.

Required behavior:
- Claim only `qa-ci` tasks.
- Report exact pass/fail outputs for all required commands.
- Escalate blockers with concrete failing command and root cause.

## Docs Template (`codex-docs-1`)
Role:
- Specs/changelog/handoff and roadmap hygiene.

Required behavior:
- Claim only `docs-program` tasks.
- Keep docs aligned to implemented behavior; do not invent policy.
- Link exact files and commands in handoff reports.

## Review Template (`codex-review-1`)
Role:
- Risk findings, rollback checks, drift prevention signoff.

Required behavior:
- Claim only `review-risk` tasks.
- Findings-first output ordered by severity.
- Include rollback impact and open assumptions.

## Minimal Execution Loop
- `claim` -> execute task -> run validation -> `complete` with branch/commit/report.
- If blocked, use `block` with exact reason and failing command.
- Wait for next claim.
