# SLICE-UXAUTO-565A — Queue drift guard for UX lane sequencing

Date: 2026-03-15  
Lane: D — Automation Reliability  
Task: `SLICE-UXAUTO-565A`

## Scope
Strengthen queue sanity checks for Batch16 UX lane sequencing and impossible task-state transitions.

## Changes
- Updated [`scripts/reliant-slice-queue.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-slice-queue.mjs):
  - added Batch16 UX queue detection for `.reliant/queue/mvp-lane-*-ux-*-batch16.json`;
  - added transition-sanity inspection for impossible status/timestamp combinations:
    - `queued` tasks carrying terminal timestamps,
    - `in_progress` tasks missing `startedAt` or carrying terminal timestamps,
    - `done` tasks missing `finishedAt` or carrying `blockedAt`,
    - `blocked` tasks missing `blockedAt` or carrying `finishedAt`,
    - invalid or backward timestamp ordering (`finishedAt/blockedAt/updatedAt` before prior lifecycle timestamps);
  - made `claim` refuse advancement with `resultCode=queue_transition_sanity_failed` when Batch16 UX queue state is impossible;
  - made `complete`, `block`, and `validate` stop on the same transition-sanity failures;
  - added `transitionSanity` diagnostics to `status` and `validate` output for deterministic triage.
- Updated [`scripts/reliant-slice-queue.test.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-slice-queue.test.mjs) with Batch16 UX queue cases covering:
  - `validate` failure on impossible queued-task lifecycle state,
  - `claim` refusal payload for `queue_transition_sanity_failed`,
  - `status.transitionSanity` reporting.

## Verification
- `node scripts/reliant-slice-queue.test.mjs`
- `node scripts/reliant-next-action.test.mjs`
- `pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck`

## Notes
- The new transition-sanity guard is intentionally scoped to Batch16 UX queues so older non-UX automation queues are not retroactively reinterpreted.
- The guard is non-destructive: it blocks further automated transitions until the queue state is repaired.
