# SLICE-UXAUTO-598A — Supervisor stop-condition clarity pass

Date: 2026-03-16  
Lane: D — Automation Reliability  
Task: `SLICE-UXAUTO-598A`

## Scope
Tighten supervisor stop-condition diagnostics for blocked/founder-decision/no-queued states in UX lanes.

## Changes
- Updated [`scripts/reliant-supervisor.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-supervisor.mjs):
  - added per-lane `stopCondition` output with stable codes and messages;
  - expanded cycle-level `stopConditions` reporting to include:
    - `founder_decision_required`
    - `blocked_only`
    - `no_queued_tasks`
  - kept founder-decision stops as the only exit-7 failure path;
  - downgraded `blocked_only` and `no_queued_tasks` to explicit informational stop diagnostics on stdout.
- Updated [`scripts/reliant-supervisor.test.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-supervisor.test.mjs) with coverage for:
  - founder-decision stop condition payload,
  - blocked-only lane diagnostics,
  - drained/no-queued lane diagnostics.

## Verification
- `node scripts/reliant-supervisor.test.mjs`
- `node scripts/reliant-runtime-clean.test.mjs`
- `node scripts/reliant-next-action.test.mjs`
- `pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck`

## Notes
- This slice improves operator clarity only; it does not change queue advancement semantics for blocked-only or drained lanes.
