# SLICE-UXPLOT-637A BLOCKED

Date: 2026-03-18
Lane: A (`lane-a-ux-plot-batch19`)
Task: Plot feed deterministic state copy pass
Status: blocked

## Exact Block Reason
This slice is scoped to Feed copy only, but its required verify command includes `apps/web/__tests__/plot-ux-regression-lock.test.ts`, which currently locks `no Social exposure` on the collapsed Plot tab rail.

That assertion depends on `SLICE-UXPLOT-636A`, which is blocked because:
- `docs/specs/communities/plot-and-scene-plot.md` still says Social remains a placeholder until the endpoint ships, while
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md` and Batch19 task `SLICE-UXPLOT-636A` require no Social exposure.

Therefore, this slice cannot be verified exactly without resolving the upstream spec conflict on Social exposure, which is outside this slice scope.

## No Code Changes / No Verify
- No code changes were made for this slice.
- No verify command was run for this slice.
