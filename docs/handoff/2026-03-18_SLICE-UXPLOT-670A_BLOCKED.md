# SLICE-UXPLOT-670A BLOCKED

Date: 2026-03-18
Lane: A (`lane-a-ux-plot-batch20`)
Task: Plot/profile seam interaction regression lock
Status: blocked

## Exact Block Reason
This slice is scoped to seam-state and route-stable profile-panel ownership only, but its required verify command includes `apps/web/__tests__/plot-ux-regression-lock.test.ts`, which currently locks `no Social exposure` on the collapsed Plot tab rail.

That assertion depends on `SLICE-UXPLOT-666A`, which is blocked because `docs/specs/communities/plot-and-scene-plot.md` still authorizes a Social placeholder while the lock/task requires no Social exposure.

Therefore, this slice cannot be verified exactly without resolving the upstream Social-exposure spec conflict, which is outside this slice scope.

## No Code Changes / No Verify
- No code changes were made for this slice.
- No verify command was run for this slice.
