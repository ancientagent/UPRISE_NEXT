# SLICE-UXAUTO-596A — Runtime-clean resume diagnostics parity

Date: 2026-03-16  
Lane: D — Automation Reliability  
Task: `SLICE-UXAUTO-596A`

## Scope
Improve runtime-clean resume messaging for stale runtime recovery and next-action determinism.

## Changes
- Updated [`scripts/reliant-runtime-clean.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-runtime-clean.mjs):
  - added Batch17 UX runtime-to-queue inference alongside the existing Batch16 map;
  - added stable `resumeMessage` output for each resume path:
    - `restore_in_progress`
    - `claim_next`
    - `blocked_multiple_in_progress`
    - `queue_missing`
    - `queue_invalid`
    - `no_queued_tasks`
- Updated [`scripts/reliant-next-action.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-next-action.mjs):
  - replaced the manual runtime rewrite suggestion with queue-aware `pnpm run reliant:runtime:clean -- --runtime ... --queue ... --resume` commands for UX lanes;
  - aligned stale-runtime cleanup suggestions in both `resume_in_progress` and `claim_next` states to the deterministic runtime-clean path.
- Updated tests:
  - [`scripts/reliant-runtime-clean.test.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-runtime-clean.test.mjs)
  - [`scripts/reliant-next-action.test.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-next-action.test.mjs)

## Verification
- `node scripts/reliant-runtime-clean.test.mjs`
- `node scripts/reliant-next-action.test.mjs`
- `node scripts/reliant-slice-queue.test.mjs`
- `pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck`

## Notes
- This keeps recovery behavior queue-aware and deterministic without reintroducing ad hoc runtime rewrite commands in `next-action`.
