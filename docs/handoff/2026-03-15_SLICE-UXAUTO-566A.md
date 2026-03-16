# SLICE-UXAUTO-566A — Supervisor stop-on-canon-silence enforcement

Date: 2026-03-15  
Lane: D — Automation Reliability  
Task: `SLICE-UXAUTO-566A`

## Scope
Enforce deterministic supervisor stop behavior when queue slices explicitly declare unresolved founder-decision dependencies.

## Changes
- Updated [`scripts/reliant-supervisor.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-supervisor.mjs):
  - added support for explicit queue-task declarations via `founderDecisionRequired: true` or `requiresFounderDecision: true`;
  - reads optional `founderDecisionReason` for the exact stop reason;
  - stops before `autoClaim` when the next queued task declares a founder-decision dependency;
  - records deterministic lane-level `founderDecisionStop` diagnostics and cycle-level `stopConditions`;
  - exits with stop code `7` in normal supervisor mode and surfaces `founder_decision_required` in health-check failures.
- Updated [`scripts/reliant-supervisor.test.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-supervisor.test.mjs) with coverage for:
  - one-shot supervisor stop on a founder-decision-declared queued task,
  - health-check failure on the same founder-decision dependency,
  - persisted status output containing `stopConditions` and lane action `stop:founder-decision:<taskId>`.

## Verification
- `node scripts/reliant-supervisor.test.mjs`
- `node scripts/reliant-slice-queue.test.mjs`
- `node scripts/reliant-next-action.test.mjs`
- `pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck`

## Notes
- This slice requires explicit task metadata; it does not infer founder lock state from prompt wording.
- The stop path is intentionally non-claiming and non-destructive so supervisor output can be used as the exact blocker record.
