# SLICE-UXAUTO-594A — Queue/runtime preflight lock for Batch17

Date: 2026-03-16  
Lane: D — Automation Reliability  
Task: `SLICE-UXAUTO-594A`

## Scope
Extend UX preflight checks to include Batch17 queue/runtime naming and source-doc presence assertions.

## Changes
- Updated [`scripts/reliant-ux-preflight.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-ux-preflight.mjs):
  - generalized the UX queue detector from Batch16-only to Batch16/Batch17;
  - added Batch17 required source-doc assertions from the execution plan:
    - `docs/solutions/MVP_UX_BATCH17_EXECUTION_PLAN.md`
    - `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
    - `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
    - `docs/specs/communities/plot-and-scene-plot.md`
    - `docs/specs/communities/discovery-scene-switching.md`
    - `docs/specs/users/onboarding-home-scene-resolution.md`
    - `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
    - `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`
  - added queue/runtime naming checks by deriving the expected UX runtime basename from the queue naming pattern.
- Updated [`scripts/reliant-next-action.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-next-action.mjs) to pass the runtime path into UX preflight so naming mismatches block execution before claim/continue instructions are emitted.
- Updated [`scripts/reliant-next-action.test.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-next-action.test.mjs) with Batch17 coverage for:
  - successful Batch17 preflight,
  - runtime naming mismatch failure,
  - Batch17 `next-action` pass-through when preflight succeeds.

## Verification
- `node scripts/reliant-next-action.test.mjs`
- `node scripts/reliant-slice-queue.test.mjs`
- `pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck`

## Notes
- Naming validation is filename-based so temp/test paths still pass when the runtime basename matches the expected lane/batch pattern.
- Existing Batch16 behavior remains supported.
