# Agent Control Loop (Autonomous Lane Coordination)

> Specialized queue/orchestrator workflow only.
>
> This folder is not the default agent entry path. Start with `AGENTS.md`, then use `docs/AGENT_STRATEGY_AND_HANDOFF.md` and `docs/handoff/README.md`. Use this control-plane workflow only when a queue-driven multi-lane run is explicitly in scope.

This folder is the control plane for queue-driven parallel coding agents in UPRISE.

## Goal
Allow one orchestrator agent to assign tasks directly to lane agents, and let lane agents self-claim work and report completion/blockers without manual relay.

## Files
- `lanes.json`: lane definitions and allowed path scopes.
- `queue.json`: machine-readable task queue and state.
- `results/`: optional per-task result artifacts linked from queue rows.
- `AGENT_DIRECTIVES.md`: lane-specialized prompt templates and parallel guardrails.
- `CLAW_AUDITOR_PROMPT.md`: standing external-auditor prompt for Claw/Abacus-style repo audits.

## Command Interface
Use the root command:

```bash
pnpm run agent:queue -- <command> [flags]
```

Main commands:
- `init`: initialize queue + result directory.
- `backfill-directives`: add default directive metadata to legacy tasks missing directives.
- `assign`: add a queued task.
- `claim`: lane agent claims the next dependency-ready task.
- `complete`: lane agent marks task done + attaches result metadata.
- `block`: lane agent marks blocker with reason.
- `requeue`: orchestrator sends task back to queued.
- `ack`: orchestrator acknowledges review of done/blocked task.
- `status`: list queue summary + tasks.
- `poll`: show review-required, blocked, and in-progress tasks.

Common lane ids:
- `api-schema`
- `web-contracts`
- `qa-ci`
- `docs-program`
- `review-risk`
- `external-audit`

`assign` supports queue guardrail metadata:
- `--parent-id`: mark task as child of an existing task.
- `--allow-spawn`: allow controlled child task creation from this task.
- `--max-depth`, `--max-children`: override spawn limits for this task.
- `--planned-report`, `--rollback-note`: required for child tasks.

## Orchestrator Workflow
1. Add tasks with explicit lane, dependencies, and scope.
2. Agents run `claim` in their lane and execute the task.
3. Agent completes with branch/commit/PR/report metadata.
4. Orchestrator runs `poll`, reviews output, acknowledges with `ack`, then assigns next tasks.

## Lane Agent Workflow
1. Run `claim` for your lane.
2. If a task is returned, execute only allowed scope and validation gates.
3. Publish report/handoff file.
4. Run `complete` with branch/commit/PR/report.
5. If blocked, run `block` with exact reason.

## External Auditor Workflow (`external-audit`)
Use this lane when an external repo auditor such as Claw CLI is available but should remain read-heavy and non-authoritative.

Recommended pattern:
1. Orchestrator assigns a narrow audit task into `external-audit`.
2. Claw CLI claims the task with an external-auditor identity.
3. Claw reads current repo truth, compares runtime/spec/canon/founder locks, and writes a report under:
   - `docs/handoff/agent-control/results/`
4. Claw completes the task with that report path.
5. Codex/orchestrator reviews the report, decides what is real, and either:
   - acknowledges it, or
   - requeues a corrected/narrower task.

Guardrails:
- External auditor is not product authority.
- It should not invent behavior or widen MVP scope.
- It should prefer report artifacts over code edits.
- If repo/workspace access is missing, it should block with the exact missing dependency.

## Example
Assign task:

```bash
pnpm run agent:queue -- assign \
  --id P3-S89 \
  --lane api-schema \
  --title "RegistrarCode schema foundation" \
  --phase phase3 \
  --priority 200 \
  --depends-on P3-S88
```

Claim task:

```bash
pnpm run agent:queue -- claim --lane api-schema --agent codex-api-1 --json
```

Complete task:

```bash
pnpm run agent:queue -- complete \
  --id P3-S89 \
  --agent codex-api-1 \
  --branch lane-api/P3-S89-registrar-code \
  --commit abc1234 \
  --pr https://github.com/ancientagent/UPRISE_NEXT/pull/999 \
  --report docs/handoff/reports/2026-02-24_P3-S89.md
```

Poll for review:

```bash
pnpm run agent:queue -- poll
```

## Guardrails
- Keep one task per PR-safe slice.
- Use dependency IDs for strict ordering.
- Do not claim tasks outside your lane.
- Do not edit paths outside lane scope.
- Every task completion must include validation command outcomes in its report.
- `assign` auto-attaches directive metadata to each task:
  - required reading order,
  - standing orders,
  - validation gate checklist,
  - lane role profiles,
  - parallel spawn guardrails.
- Child task guardrails are enforced by queue tool:
  - parent task must have `allowSpawn=true`,
  - child must depend on parent via `--depends-on <PARENT_ID>`,
  - child must include `--planned-report` and `--rollback-note`,
  - default hard limits: `maxDepth=1`, `maxChildren=2`.
- For legacy queues created before this feature:
  - run `pnpm run agent:queue -- backfill-directives --queue <QUEUE_PATH>` once.

## Bridge Add-On
- Scheduler/chat bridge tick:
  - `pnpm run agent:bridge:tick -- --queue /tmp/uprise_next_agent_queue.json`
- Telegram command bridge tick:
  - `pnpm run agent:telegram:tick -- --queue /tmp/uprise_next_agent_queue.json --poll-timeout-seconds 25 --max-runtime-seconds 240`
- Full runbook:
  - `docs/solutions/AUTONOMOUS_AGENT_BRIDGE_RUNBOOK.md`
