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

Deterministic supervisor health gate (no claim/repair side effects):
```bash
LANES_JSON=".reliant/runtime/lanes.json"
STATUS_OUT=".reliant/runtime/supervisor-status.json"
node scripts/reliant-supervisor.mjs --health-check --lanes-json "$LANES_JSON" --status-out "$STATUS_OUT"
```
- Exit `0`: healthy for required checks.
- Exit `6`: health gate failed on one or more lanes.
- Gate failure conditions:
  - multiple `in_progress` tasks in a queue
  - stale runtime file with no matching `in_progress` task
  - summary drift (`queue.summary` vs actual task counts)

Validate queue shape before execution:
```bash
node scripts/reliant-slice-queue.mjs validate --queue .reliant/queue/mvp-slices.json
```

UX Batch16/Batch17 preflight before execution:
```bash
QUEUE_PATH=".reliant/queue/mvp-lane-d-ux-automation-batch17.json"
node scripts/reliant-ux-preflight.mjs --queue "$QUEUE_PATH"
```
- Required source-of-truth sets are batch-specific:
  - Batch16 UX queues:
    - `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
    - `docs/solutions/MVP_UX_BATCH16_EXECUTION_PLAN.md`
    - `docs/solutions/MVP_UX_BATCH16_DRIFT_WATCHLIST.md`
    - `docs/specs/users/onboarding-home-scene-resolution.md`
    - `docs/specs/communities/plot-and-scene-plot.md`
  - Batch17 UX queues:
    - `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
    - `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
    - `docs/specs/communities/plot-and-scene-plot.md`
    - `docs/specs/communities/discovery-scene-switching.md`
    - `docs/specs/users/onboarding-home-scene-resolution.md`
    - `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
    - `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`
- If `--runtime` is provided, preflight also enforces queue/runtime lane and batch naming parity before execution.
- If preflight returns `ok=false`, stop before execution. Do not claim-forward or complete around missing/unreadable lock/spec files.

Manual claim/complete/block:
```bash
QUEUE_PATH=".reliant/queue/mvp-slices.json"
RUNTIME_PATH=".reliant/runtime/current-task.json"
TASK_ID="SLICE-EXAMPLE-001"
REPORT_PATH="docs/handoff/$(date +%F)_SLICE-EXAMPLE-001.md"
BLOCKER_REASON="exact blocker text"
node scripts/reliant-slice-queue.mjs claim --queue "$QUEUE_PATH" --runtime "$RUNTIME_PATH"
node scripts/reliant-slice-queue.mjs complete --queue "$QUEUE_PATH" --runtime "$RUNTIME_PATH" --task-id "$TASK_ID" --report "$REPORT_PATH"
node scripts/reliant-slice-queue.mjs block --queue "$QUEUE_PATH" --runtime "$RUNTIME_PATH" --task-id "$TASK_ID" --reason "$BLOCKER_REASON"
```
- Optional guardrail: append `--task-id "$TASK_ID"` to `complete`/`block` to prevent wrong-task transitions.

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
- For Batch16/Batch17 UX queues, `claim` also refuses `queue_transition_sanity_failed` when task lifecycle timestamps/statuses are impossible (for example `queued` with `finishedAt`, `done` without `finishedAt`, `blocked` with `finishedAt`, or a `queued`/`in_progress` task placed ahead of a non-queued successor in the queue).
- Executes slice with canon/spec constraints.
- Runs required validation gates.
- Marks `done` if successful; marks `blocked` with exact reason on unrecoverable failure.
- Continues until no queued tasks remain.

## UX Batch16/Batch17 Stop Conditions
Stop immediately and repair/escalate when any of the following occur:
- `blocked_preflight` from `reliant-next-action` / `reliant-autopilot`
  - Cause: UX master lock or required batch-specific source-of-truth files are missing/unreadable.
- `queue_transition_sanity_failed`
  - Cause: impossible Batch16/Batch17 UX queue lifecycle state in `scripts/reliant-slice-queue.mjs`.
- `founder_decision_required`
  - Cause: next queued task explicitly declares `founderDecisionRequired: true` or `requiresFounderDecision: true`.
- `runtime_owner_mismatch`, `missing_runtime`, or `invalid_runtime_payload`
  - Cause: runtime file and queue ownership disagree.
- Supervisor UX-lane diagnostics also surface non-fatal queue states:
  - `blocked_only` -> no queued or in-progress work remains, but blocked tasks still require manual follow-up.
  - `no_queued_tasks` -> queue is drained.

When a stop condition is triggered:
1. Do not advance queue state.
2. Record the exact blocker in the handoff/report.
3. Repair the runtime/queue/docs issue or escalate to founder when the blocker is a founder-decision dependency.

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

### UX Batch16/Batch17 runtime recovery
For Batch16/Batch17 UX lane runtime files, prefer queue-aware recovery:
```bash
RUNTIME_PATH=".reliant/runtime/current-task-lane-d-ux-batch17.json"
QUEUE_PATH=".reliant/queue/mvp-lane-d-ux-automation-batch17.json"
node scripts/reliant-runtime-clean.mjs --runtime "$RUNTIME_PATH" --queue "$QUEUE_PATH" --resume
```
- Deterministic `resumeAction` values:
  - `restore_in_progress` -> runtime was restored for the single in-progress task.
  - `claim_next` -> runtime remains absent; run the emitted `resumeCommand`.
  - `blocked_multiple_in_progress` -> repair queue ownership first.
  - `queue_missing` / `queue_invalid` -> repair queue path/payload before retrying.
  - `no_queued_tasks` -> queue is drained; no resume action is available.
- Deterministic `resumeMessage` mirrors the selected `resumeAction` and is also surfaced by `reliant-next-action` as `runtimeRecovery`.
- When `reliant-next-action` detects stale runtime with queued work still available, follow the queue-aware cleanup command first, then run the emitted `claim` command once.

## Verification Transcript Capture
For deterministic handoff parsing, capture verification with the transcript wrapper:
```bash
VERIFY_CMD='pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck'
pnpm run reliant:verify:transcript -- --command "$VERIFY_CMD" --format markdown
```
- Fixed transcript section order:
  - `## Verify Command`
  - `## Verify Exit Code`
  - `## Exact Output`
- `## Verify Exit Code` now emits deterministic key/value metadata:
  - `code=<exit code>`
  - `passed=<true|false>`
  - `signal=<signal|(none)>`
- Optional artifacts:
  - `--markdown-out <path>`
  - `--json-out <path>`

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
