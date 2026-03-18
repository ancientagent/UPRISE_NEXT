# SLICE-UXAUTO-624A — Queue/runtime preflight lock for Batch17

Date: 2026-03-17  
Lane: D — Automation Reliability  
Task: `SLICE-UXAUTO-624A`

## Scope
Extend UX preflight checks to include Batch17 queue/runtime naming and source-doc presence assertions.

## Changes
- Updated [`scripts/reliant-ux-preflight.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-ux-preflight.mjs):
  - generalized the UX queue detector from Batch16-only to Batch16/Batch17;
  - added Batch17 source-doc presence assertions for:
    - `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
    - `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
    - `docs/specs/communities/plot-and-scene-plot.md`
    - `docs/specs/communities/discovery-scene-switching.md`
    - `docs/specs/users/onboarding-home-scene-resolution.md`
    - `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
    - `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`
  - added queue/runtime naming checks by deriving the expected UX runtime basename from the queue naming pattern.
- Updated [`scripts/reliant-next-action.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-next-action.mjs) to pass runtime path into UX preflight so naming mismatches block execution before claim/continue instructions are emitted.
- Updated [`scripts/reliant-next-action.test.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-next-action.test.mjs) with Batch17 coverage for success and naming-mismatch failure.

## Verification
- `node scripts/reliant-next-action.test.mjs`
- `node scripts/reliant-slice-queue.test.mjs`
- `pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck`

## Notes
- The current branch does not ship a standalone `MVP_UX_BATCH17_EXECUTION_PLAN.md`, so Batch17 source-doc assertions were limited to the existing lock/spec set rather than inventing a missing requirement.
