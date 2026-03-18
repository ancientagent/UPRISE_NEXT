# SLICE-UXAUTO-595A — Batch17 transition-sanity guard extension

Date: 2026-03-16  
Lane: D — Automation Reliability  
Task: `SLICE-UXAUTO-595A`

## Scope
Expand transition-sanity diagnostics for Batch17 queue status edges and deterministic refusal codes.

## Changes
- Updated [`scripts/reliant-slice-queue.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-slice-queue.mjs):
  - extended UX transition-sanity applicability from Batch16-only to Batch16/Batch17 queues;
  - added queue-edge diagnostics for impossible status ordering:
    - `queued_before_non_queued`
    - `in_progress_before_non_queued`
  - added deterministic transition metadata to `transitionSanity`:
    - `batch`
    - `reasonCodes`
    - `failureCode`
  - kept the existing `queue_transition_sanity_failed` refusal code and aligned stderr diagnostics to the generic UX batch guard wording.
- Updated [`scripts/reliant-slice-queue.test.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-slice-queue.test.mjs) with assertions for:
  - Batch16 transition metadata,
  - Batch17 queue-edge validation failure,
  - Batch17 claim refusal/status diagnostics with stable `reasonCodes`.

## Verification
- `node scripts/reliant-slice-queue.test.mjs`
- `node scripts/reliant-next-action.test.mjs`
- `pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck`

## Notes
- The new edge checks are intentionally narrow: they only flag impossible queue progression, not valid `blocked -> queued/done` continuation patterns.
