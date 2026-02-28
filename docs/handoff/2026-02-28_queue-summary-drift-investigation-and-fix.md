# Queue Summary Drift Investigation and Fix (2026-02-28)

## Problem
`reliant-slice-queue status` repeatedly reported `summarySanity` drift (`queued/done`) even when task states were correct.

## Root Cause
`scripts/reliant-slice-queue.mjs` updated task statuses on `claim/complete/block` but did not update persisted `queue.summary` before writing queue files.

## Fix Applied
- Added `computeSummary(tasks)` + `syncQueueSummary(queue)` helpers.
- `syncQueueSummary(queue)` now runs before every queue write in:
  - `claimTask`
  - `completeTask` (including idempotent report-path update branch)
  - `blockTask`
  - `initTemplate`

## Data Repair
Executed one-time repair across `.reliant/queue/*.json` to recompute and persist summaries for existing files.
- Updated files: 36

## Validation
- Command: `node scripts/reliant-slice-queue.test.mjs` (pass)
- Spot-check on batch12 lane queues now reports:
  - `summarySanity.driftCount = 0`
  - `summarySanity.severity = "none"`

