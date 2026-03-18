# MVP UX Batch18 Execution Plan

## Objective
Execute the next UX closure pass after Batch17 with strict canon/spec lock and no speculative behavior.

## Required Reading (per lane)
1. `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
2. `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
3. `docs/specs/communities/plot-and-scene-plot.md`
4. `docs/specs/communities/discovery-scene-switching.md`
5. `docs/specs/users/onboarding-home-scene-resolution.md`
6. `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
7. `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`

## Queues
- `.reliant/queue/mvp-lane-a-ux-plot-batch18.json`
- `.reliant/queue/mvp-lane-b-ux-discovery-batch18.json`
- `.reliant/queue/mvp-lane-c-ux-player-profile-batch18.json`
- `.reliant/queue/mvp-lane-d-ux-automation-batch18.json`
- `.reliant/queue/mvp-lane-e-ux-qarev-batch18.json`

## Runtimes
- `.reliant/runtime/current-task-lane-a-ux-batch18.json`
- `.reliant/runtime/current-task-lane-b-ux-batch18.json`
- `.reliant/runtime/current-task-lane-c-ux-batch18.json`
- `.reliant/runtime/current-task-lane-d-ux-batch18.json`
- `.reliant/runtime/current-task-lane-e-ux-batch18.json`

## Loop
claim -> execute exact scope -> run verifyCommand exactly -> update changelog + dated handoff -> complete with `--task-id` guard -> continue until `no_queued_tasks`.

If blocked by canon/spec silence: block with exact reason and continue.

## Policy Clarification (Batch18)
- Social is hidden in MVP collapsed `/plot` tab rail.
- Do not treat Social placeholder wording as executable MVP behavior.
