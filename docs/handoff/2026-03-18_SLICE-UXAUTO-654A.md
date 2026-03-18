# SLICE-UXAUTO-654A

Date: 2026-03-18
Lane: D
Batch: 19
Task: `SLICE-UXAUTO-654A`
Title: `Queue/runtime preflight lock for Batch17`

## Scope
- Extend UX preflight checks to cover Batch17 queue/runtime naming parity.
- Add the approved Batch17 source-doc presence assertions that exist on this branch.
- Keep `reliant-next-action` aligned with the same preflight contract.

## Changes
- Replaced the Batch16-only queue matcher in `scripts/reliant-ux-preflight.mjs` with shared Batch16/Batch17 parsing.
- Added a Batch17 required-file set using the current branch’s canon/spec docs:
  - `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
  - `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
  - `docs/specs/communities/plot-and-scene-plot.md`
  - `docs/specs/communities/discovery-scene-switching.md`
  - `docs/specs/users/onboarding-home-scene-resolution.md`
  - `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
  - `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`
- Added runtime-basename parity checks so Batch17 queue/runtime lane ownership is validated during preflight.
- Updated `scripts/reliant-next-action.mjs` and `scripts/reliant-next-action.test.mjs` to consume and cover the new Batch17 preflight behavior.

## Verification
- `node scripts/reliant-next-action.test.mjs`
- `pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck`

## Outcome
- Batch17 UX queues now fail preflight deterministically when runtime naming is wrong or required source docs are missing.
