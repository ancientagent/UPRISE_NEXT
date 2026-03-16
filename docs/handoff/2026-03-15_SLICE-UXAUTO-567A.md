# SLICE-UXAUTO-567A — Runtime hygiene extension for UX queues

Date: 2026-03-15  
Lane: D — Automation Reliability  
Task: `SLICE-UXAUTO-567A`

## Scope
Extend stale-runtime cleanup/reporting for Batch16 UX lane runtime files and make resume behavior deterministic.

## Changes
- Updated [`scripts/reliant-runtime-clean.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-runtime-clean.mjs):
  - added Batch16 UX runtime-to-queue inference for lane runtime files:
    - `current-task-lane-a-ux-batch16.json` -> plot queue
    - `current-task-lane-b-ux-batch16.json` -> discovery queue
    - `current-task-lane-c-ux-batch16.json` -> player/profile queue
    - `current-task-lane-d-ux-batch16.json` -> automation queue
    - `current-task-lane-e-ux-batch16.json` -> QA/review queue
  - added `--resume` behavior:
    - restores runtime JSON when the matching queue has exactly one `in_progress` task,
    - emits deterministic `resumeAction=claim_next` plus the exact `claim` command when the queue is idle with queued work,
    - reports queue/runtime state for missing or invalid queue cases without destructive guesswork;
  - extended JSON output with `inferredQueuePath`, `resumeRequested`, `resumeAction`, `resumeCommand`, `resumed`, `resumedTaskId`, and `queueState`.
- Updated [`scripts/reliant-runtime-clean.test.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-runtime-clean.test.mjs) with UX-lane cases covering:
  - dry-run resume diagnostics,
  - runtime restoration for a single in-progress UX task,
  - deterministic `claim_next` reporting when only queued work remains.

## Verification
- `node scripts/reliant-runtime-clean.test.mjs`
- `node scripts/reliant-supervisor.test.mjs`
- `node scripts/reliant-slice-queue.test.mjs`
- `pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck`

## Notes
- Resume restoration is limited to unambiguous single-`in_progress` ownership; multiple in-progress tasks remain a repair/manual-stop condition.
- The extension is additive and queue-aware; it does not guess non-UX queue mappings.
