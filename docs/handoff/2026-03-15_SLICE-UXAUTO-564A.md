# SLICE-UXAUTO-564A — UX master-lock preflight guard

Date: 2026-03-15  
Lane: D — Automation Reliability  
Task: `SLICE-UXAUTO-564A`

## Scope
Add an automation preflight guard that validates Batch16 UX source-of-truth files before lane execution.

## Changes
- Added [`scripts/reliant-ux-preflight.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-ux-preflight.mjs) to validate required Batch16 UX files:
  - `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
  - `docs/solutions/MVP_UX_BATCH16_EXECUTION_PLAN.md`
  - `docs/solutions/MVP_UX_BATCH16_DRIFT_WATCHLIST.md`
  - `docs/specs/users/onboarding-home-scene-resolution.md`
  - `docs/specs/communities/plot-and-scene-plot.md`
- Updated [`scripts/reliant-next-action.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-next-action.mjs) to run the UX preflight for Batch16 UX queues and emit `blocked_preflight` instead of execution instructions when required files are missing or unreadable.
- Updated [`scripts/reliant-autopilot.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-autopilot.mjs) to stop on the new preflight failure state.
- Added focused coverage in [`scripts/reliant-next-action.test.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-next-action.test.mjs) for:
  - successful UX Batch16 preflight,
  - blocked execution when the master lock is missing,
  - non-UX queues bypassing the Batch16 UX preflight.

## Verification
- `node scripts/reliant-next-action.test.mjs`
- `node scripts/reliant-slice-queue.test.mjs`
- `pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck`

## Notes
- The preflight is intentionally scoped to Batch16 UX queues only via queue filename matching.
- Failure mode is non-destructive: the queue is not advanced and automation emits a deterministic stop condition until required docs/spec anchors are readable again.
