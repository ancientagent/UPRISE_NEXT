# MVP UX Batch17 Execution Plan

## Objective
Execute the next UX closure pass using the locked canon/spec stack, with no speculative behavior.

## Required Sources (must be re-read per lane)
1. `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
2. `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
3. `docs/specs/communities/plot-and-scene-plot.md`
4. `docs/specs/communities/discovery-scene-switching.md`
5. `docs/specs/users/onboarding-home-scene-resolution.md`
6. `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
7. `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`

## Lane Queues
- `.reliant/queue/mvp-lane-a-ux-plot-batch17.json`
- `.reliant/queue/mvp-lane-b-ux-discovery-batch17.json`
- `.reliant/queue/mvp-lane-c-ux-player-profile-batch17.json`
- `.reliant/queue/mvp-lane-d-ux-automation-batch17.json`
- `.reliant/queue/mvp-lane-e-ux-qarev-batch17.json`

## Runtime Files
- `.reliant/runtime/current-task-lane-a-ux-batch17.json`
- `.reliant/runtime/current-task-lane-b-ux-batch17.json`
- `.reliant/runtime/current-task-lane-c-ux-batch17.json`
- `.reliant/runtime/current-task-lane-d-ux-batch17.json`
- `.reliant/runtime/current-task-lane-e-ux-batch17.json`

## Execution Rule
Per slice only:
1. `claim`
2. execute exact scoped prompt
3. run `verifyCommand` exactly
4. update `docs/CHANGELOG.md` + dated `docs/handoff/` report
5. `complete --task-id ... --report ...`
6. continue until `no_queued_tasks`

If canon/spec conflict: `block` with exact reason and continue.
