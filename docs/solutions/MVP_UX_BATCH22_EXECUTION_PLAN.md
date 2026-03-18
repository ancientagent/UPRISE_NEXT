# MVP UX Batch22 Execution Plan

## Objective
Continue post-Batch21 UX closure with strict canon/spec lock, no drift, and deterministic queue operations.

## Required Reading (per lane)
1. `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
2. `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
3. `docs/specs/communities/plot-and-scene-plot.md`
4. `docs/specs/communities/discovery-scene-switching.md`
5. `docs/specs/users/onboarding-home-scene-resolution.md`
6. `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
7. `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`

## Queues
- `.reliant/queue/mvp-lane-a-ux-plot-batch22.json`
- `.reliant/queue/mvp-lane-b-ux-discovery-batch22.json`
- `.reliant/queue/mvp-lane-c-ux-player-profile-batch22.json`
- `.reliant/queue/mvp-lane-d-ux-automation-batch22.json`
- `.reliant/queue/mvp-lane-e-ux-qarev-batch22.json`

## Policy Lock Reminder
- Social is hidden in MVP collapsed `/plot` tab rail.
- Placeholder wording is non-executable until V2 unlock.

## Loop
claim -> execute exact scope -> run verifyCommand exactly -> update changelog + dated handoff -> complete with `--task-id` guard -> continue until `no_queued_tasks`.
If blocked by canon/spec silence: block with exact reason and continue.
