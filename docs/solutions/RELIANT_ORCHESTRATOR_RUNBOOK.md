# Reliant Orchestrator Runbook (UPRISE_NEXT)

## Purpose
Run queued MVP slices sequentially with automatic done/blocked tracking so execution can continue past blockers.

## Components
- Workflow: `.reliant/workflows/uprise-orchestrator.yaml`
- Child workflow: `.reliant/workflows/uprise-slice-loop.yaml`
- Preset: `.reliant/presets/uprise_executor.yaml`
- Queue script: `scripts/reliant-slice-queue.mjs`
- Queue file: `.reliant/queue/mvp-slices.json`
- Runtime task state: `.reliant/runtime/current-task.json`

## Queue Format
Each task must include:
- `id` (string)
- `title` (string)
- `prompt` (full slice prompt)
- `verifyCommand` (string)
- `status` (`queued` | `in_progress` | `done` | `blocked`)

Optional fields added by execution:
- `startedAt`, `finishedAt`, `blockedAt`, `updatedAt`
- `reportPath`, `blockerReason`

## Local Queue Utilities
Initialize template queue:
`node scripts/reliant-slice-queue.mjs init --queue .reliant/queue/mvp-slices.json`

Inspect status:
`node scripts/reliant-slice-queue.mjs status --queue .reliant/queue/mvp-slices.json`

Manual claim/complete/block:
- `node scripts/reliant-slice-queue.mjs claim --queue .reliant/queue/mvp-slices.json --runtime .reliant/runtime/current-task.json`
- `node scripts/reliant-slice-queue.mjs complete --queue .reliant/queue/mvp-slices.json --runtime .reliant/runtime/current-task.json --report docs/handoff/<note>.md`
- `node scripts/reliant-slice-queue.mjs block --queue .reliant/queue/mvp-slices.json --runtime .reliant/runtime/current-task.json --reason "<blocker>"`

## Reliant Run Steps
1. Open project in Reliant.
2. Select workflow `uprise-orchestrator`.
3. Select preset `uprise-executor`.
4. Keep mode `auto` for unattended processing.
5. Ensure queue path points to `.reliant/queue/mvp-slices.json`.
6. Start run.

## Execution Semantics
- Orchestrator claims one `queued` task.
- Executes slice with canon/spec constraints.
- Runs required validation gates.
- Marks `done` if successful; marks `blocked` with exact reason on unrecoverable failure.
- Continues until no queued tasks remain.

## Constraints
- Additive/non-breaking first.
- No feature drift.
- Web-tier boundary enforced.
- One task at a time in this workflow.

## Known Limits
- Reliability depends on local environment (pnpm/git/auth) in Reliant runtime.
- If runtime shell cannot execute project commands, task should be marked `blocked` and workflow continues.
