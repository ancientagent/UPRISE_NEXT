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
```bash
node scripts/reliant-slice-queue.mjs init --queue .reliant/queue/mvp-slices.json
```

Inspect status:
```bash
node scripts/reliant-slice-queue.mjs status --queue .reliant/queue/mvp-slices.json
```

Optional runtime-aware diagnostics:
```bash
node scripts/reliant-slice-queue.mjs status --queue .reliant/queue/mvp-slices.json --runtime .reliant/runtime/current-task.json
```

Validate queue shape before execution:
```bash
node scripts/reliant-slice-queue.mjs validate --queue .reliant/queue/mvp-slices.json
```

Manual claim/complete/block:
```bash
node scripts/reliant-slice-queue.mjs claim --queue .reliant/queue/mvp-slices.json --runtime .reliant/runtime/current-task.json
node scripts/reliant-slice-queue.mjs complete --queue .reliant/queue/mvp-slices.json --runtime .reliant/runtime/current-task.json --report docs/handoff/<note>.md
node scripts/reliant-slice-queue.mjs block --queue .reliant/queue/mvp-slices.json --runtime .reliant/runtime/current-task.json --reason "<blocker>"
```
- Optional guardrail: append `--task-id <expected-task-id>` to `complete`/`block` to prevent wrong-task transitions.

## Reliant Run Steps
1. Open project in Reliant.
2. Select workflow `uprise-orchestrator`.
3. Select preset `uprise-executor`.
4. Keep mode `auto` for unattended processing.
5. Ensure queue path points to `.reliant/queue/mvp-slices.json`.
6. Start run.

## Execution Semantics
- Orchestrator claims one `queued` task.
- `claim` is deterministic: if queue already has one `in_progress` task, it returns that active task without advancing to the next queued item.
- `claim` fails fast on queue/runtime ownership mismatch or multiple `in_progress` tasks.
- Executes slice with canon/spec constraints.
- Runs required validation gates.
- Marks `done` if successful; marks `blocked` with exact reason on unrecoverable failure.
- Continues until no queued tasks remain.

## Anti-Loop Guardrails (Required)
- Do not run claim/block in a bulk loop.
- Claim exactly one task, execute it fully, then `complete` or `block` that same runtime task.
- Never block tasks preemptively for "not executed yet" reasons.
- If queue state and `.reliant/runtime/current-task.json` disagree, stop and clear stale runtime before continuing.
- Prefer queue-specific runtime files in lane mode (for example `.reliant/runtime/current-task-lane-d.json`).

## Stale Runtime Cleanup
If a stale `in_progress` task or runtime mismatch appears:

1. Inspect queue state:
```bash
QUEUE_PATH=".reliant/queue/mvp-slices.json"
RUNTIME_PATH=".reliant/runtime/current-task.json"
node scripts/reliant-slice-queue.mjs status --queue "$QUEUE_PATH" --runtime "$RUNTIME_PATH"
```
2. Clear stale runtime file:
```bash
RUNTIME_PATH=".reliant/runtime/current-task.json"
rm -f "$RUNTIME_PATH"
```
  - or:
```bash
pnpm run reliant:runtime:clean -- --runtime "$RUNTIME_PATH"
```
3. Re-claim once:
```bash
node scripts/reliant-slice-queue.mjs claim --queue "$QUEUE_PATH" --runtime "$RUNTIME_PATH"
```
4. If claim fails due to transition guard, resolve task state intentionally (done/blocked/queued) before retrying.

If `claim`/`complete`/`block` reports `invalid runtime file` (for example missing `taskId`), treat it as stale runtime and run cleanup + single re-claim.


## Rollback Checkpoints (Required in Throughput Runs)
- Before major multi-lane cutovers, create checkpoint commits/tags.
- Use compare-first rollback flow from .
- Default to non-destructive rollback ( to checkpoint or ).
- Use destructive reset only with explicit in-thread approval.

## Constraints
- Additive/non-breaking first.
- No feature drift.
- Web-tier boundary enforced.
- One task at a time in this workflow.

## Known Limits
- Reliability depends on local environment (pnpm/git/auth) in Reliant runtime.
- If runtime shell cannot execute project commands, task should be marked `blocked` and workflow continues.

## Rollback Checkpoints (Required in Throughput Runs)
- Before major multi-lane cutovers, create checkpoint commits/tags.
- Use compare-first rollback flow from `docs/solutions/ROLLBACK_CHECKPOINT_CHEATSHEET.md`.
- Default to non-destructive rollback (`git switch` to checkpoint or `git revert`).
- Use destructive reset only with explicit in-thread approval.

## Failure-Mode Appendix

### 1) Stale runtime file (missing or wrong task)
Symptoms:
- `complete` / `block` reports runtime file missing or runtime/queue mismatch.
- `status` shows `runtime.health` as `missing` or `mismatch`.

Deterministic fix:
1. ```bash
   QUEUE_PATH=".reliant/queue/mvp-slices.json"
   RUNTIME_PATH=".reliant/runtime/current-task.json"
   node scripts/reliant-slice-queue.mjs status --queue "$QUEUE_PATH" --runtime "$RUNTIME_PATH"
   ```
2. ```bash
   pnpm run reliant:runtime:clean -- --runtime "$RUNTIME_PATH"
   ```
3. ```bash
   node scripts/reliant-slice-queue.mjs claim --queue "$QUEUE_PATH" --runtime "$RUNTIME_PATH"
   ```

### 2) Duplicate `in_progress` ownership
Symptoms:
- Queue validation fails with multiple `in_progress`.
- `status.ownership.multipleInProgress=true`.

Deterministic fix:
1. ```bash
   QUEUE_PATH=".reliant/queue/mvp-slices.json"
   node scripts/reliant-slice-queue.mjs validate --queue "$QUEUE_PATH"
   ```
2. Resolve ownership to one active task (or use supervisor repair flow), then re-claim.
3. Re-check with `status` before `complete`/`block`.

### 3) Malformed runtime JSON
Symptoms:
- `claim` / `complete` / `block` reports `invalid runtime file`.
- `status.runtime.health=invalid`.

Deterministic fix:
1. ```bash
   RUNTIME_PATH=".reliant/runtime/current-task.json"
   pnpm run reliant:runtime:clean -- --runtime "$RUNTIME_PATH"
   ```
2. Optional diagnostics-only preview:
   ```bash
   node scripts/reliant-runtime-clean.mjs --runtime "$RUNTIME_PATH" --dry-run
   ```
3. Re-claim and continue.

### 4) Rapid-loop race during claim/complete
Symptoms:
- transient runtime/ownership mismatch under tight autopilot loops.
- queue tool logs include race hints.

Deterministic fix:
1. Retry with one-shot backoff using `--retry-ms`:
   - ```bash
     QUEUE_PATH=".reliant/queue/mvp-slices.json"
     RUNTIME_PATH=".reliant/runtime/current-task.json"
     node scripts/reliant-slice-queue.mjs claim --queue "$QUEUE_PATH" --runtime "$RUNTIME_PATH" --retry-ms 25
     ```
   - ```bash
     TASK_ID="SLICE-EXAMPLE-001"
     REPORT_PATH="docs/handoff/$(date +%F)_SLICE-EXAMPLE-001.md"
     node scripts/reliant-slice-queue.mjs complete --queue "$QUEUE_PATH" --runtime "$RUNTIME_PATH" --task-id "$TASK_ID" --report "$REPORT_PATH" --retry-ms 25
     ```
2. If retry still fails, follow stale runtime cleanup flow above.
