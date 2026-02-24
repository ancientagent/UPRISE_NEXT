# Agent Control Loop (Autonomous Lane Coordination)

This folder is the control plane for parallel coding agents in UPRISE.

## Goal
Allow one orchestrator agent to assign tasks directly to lane agents, and let lane agents self-claim work and report completion/blockers without manual relay.

## Files
- `lanes.json`: lane definitions and allowed path scopes.
- `queue.json`: machine-readable task queue and state.
- `results/`: optional per-task result artifacts linked from queue rows.

## Command Interface
Use the root command:

```bash
pnpm run agent:queue -- <command> [flags]
```

Main commands:
- `init`: initialize queue + result directory.
- `assign`: add a queued task.
- `claim`: lane agent claims the next dependency-ready task.
- `complete`: lane agent marks task done + attaches result metadata.
- `block`: lane agent marks blocker with reason.
- `requeue`: orchestrator sends task back to queued.
- `ack`: orchestrator acknowledges review of done/blocked task.
- `status`: list queue summary + tasks.
- `poll`: show review-required, blocked, and in-progress tasks.

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

## Bridge Add-On
- Scheduler/chat bridge tick:
  - `pnpm run agent:bridge:tick -- --queue /tmp/uprise_next_agent_queue.json`
- Telegram command bridge tick:
  - `pnpm run agent:telegram:tick -- --queue /tmp/uprise_next_agent_queue.json --poll-timeout-seconds 25 --max-runtime-seconds 240`
- Full runbook:
  - `docs/solutions/AUTONOMOUS_AGENT_BRIDGE_RUNBOOK.md`
