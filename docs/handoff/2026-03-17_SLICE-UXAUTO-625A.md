# SLICE-UXAUTO-625A

Date: 2026-03-17
Lane: D
Batch: 18
Task: `SLICE-UXAUTO-625A`
Title: `Batch17 transition-sanity guard extension`

## Scope
- Expanded transition-sanity diagnostics in `scripts/reliant-slice-queue.mjs` for Batch17 UX automation queues only.
- Added deterministic refusal metadata so `claim`, `status`, and `validate` all expose the same failure code when queue ordering or status/timestamp edges are impossible.
- Extended regression coverage in `scripts/reliant-slice-queue.test.mjs` for Batch16 and Batch17 transition-sanity behavior.

## Changes
- Replaced the Batch16-only queue matcher with a shared Batch16/Batch17 UX queue parser.
- Added queue-edge checks for `queued_before_non_queued` and `in_progress_before_non_queued`.
- Normalized transition-sanity output to include `batch`, `reasonCodes`, and `failureCode`.
- Updated refusal and validation messaging to use shared UX batch wording while preserving the exact `queue_transition_sanity_failed` machine code.

## Verification
- `node scripts/reliant-slice-queue.test.mjs`
- `node scripts/reliant-next-action.test.mjs`
- `pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck`

## Outcome
- Batch17 UX automation queues now fail deterministically on invalid status ordering and surface the same refusal code across queue commands.
