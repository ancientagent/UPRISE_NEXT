# SLICE-UXAUTO-655A

Date: 2026-03-18
Lane: D
Batch: 19
Task: `SLICE-UXAUTO-655A`
Title: `Batch17 transition-sanity guard extension`

## Scope
- Expand transition-sanity diagnostics in `scripts/reliant-slice-queue.mjs` for Batch17 UX automation queues.
- Add deterministic refusal metadata so `claim`, `status`, and `validate` expose the same machine-readable failure shape.
- Extend regression coverage for the new Batch17 edge checks while preserving Batch16 behavior.

## Changes
- Replaced the Batch16-only UX queue matcher with shared Batch16/Batch17 queue parsing.
- Added queue-edge checks for `queued_before_non_queued` and `in_progress_before_non_queued`.
- Normalized transition-sanity output to include `batch`, `reasonCodes`, and `failureCode`.
- Updated transition-sanity refusal and validation messaging to use shared UX batch wording while preserving the exact `queue_transition_sanity_failed` machine code.

## Verification
- `node scripts/reliant-slice-queue.test.mjs`
- `pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck`

## Outcome
- Batch17 UX queues now fail deterministically on impossible status ordering and expose the same refusal code across queue commands.
