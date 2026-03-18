# SLICE-UXAUTO-626A

Date: 2026-03-17
Lane: D
Batch: 18
Task: `SLICE-UXAUTO-626A`
Title: `Runtime-clean resume diagnostics parity`

## Scope
- Improve stale-runtime recovery messaging in `scripts/reliant-runtime-clean.mjs`.
- Keep `scripts/reliant-next-action.mjs` deterministic by consuming the same queue-aware runtime recovery plan instead of hand-built restore instructions.
- Cover Batch17 UX automation parity in the affected script tests.

## Changes
- Extended runtime-to-queue inference to Batch17 UX lane runtime filenames.
- Exported the shared runtime recovery planner so `next-action` and `runtime-clean` use the same `resumeAction` and `resumeMessage` semantics.
- Added deterministic `resumeMessage` values for `restore_in_progress`, `claim_next`, `blocked_multiple_in_progress`, `queue_missing`, `queue_invalid`, and `no_queued_tasks`.
- Replaced ad hoc next-action stale-runtime instructions with the queue-aware `reliant:runtime:clean --resume` path and surfaced `runtimeRecovery` details in JSON output.

## Verification
- `node scripts/reliant-runtime-clean.test.mjs`
- `node scripts/reliant-next-action.test.mjs`
- `pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck`

## Outcome
- Batch17 stale-runtime cleanup now reports deterministic recovery messaging, and `reliant-next-action` points operators to the same recovery path that `reliant-runtime-clean` computes.
