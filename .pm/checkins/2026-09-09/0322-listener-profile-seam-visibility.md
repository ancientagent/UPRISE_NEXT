# PM Check-In

**Date/Time:** 2026-09-09 03:22 CDT
**Run ID:** `listener-profile-return-visibility`
**Agent/Thread:** UPRISE executor / listener-profile-return-visibility
**Area:** Home / Plot / Listener Profile return focus
**Task:** Correct the confirmed clamped-layout defect where the focused Plot Tabs seam remained above the collapsed viewport after returning from the expanded profile.
**Branch/Commit:** `fable/handoff`; starting baseline `5b4b3b8`

## Result

Preserved the existing captured scroll restoration and focus behavior, then added a nearest-target `scrollIntoView` on the focused Plot Tabs seam. When the shorter collapsed layout clamps the former expanded offset, the seam is now requested into the visible viewport without changing the active tab, Home Scene, player mode, collection selection, ARIA semantics, gesture behavior, or reduced-motion state.

## Evidence

- Focused source regression: Plot profile/player state and Plot UX lock suites, 2 suites / 41 tests passed.
- Regression assertions cover the clamped-layout order: captured `scrollTo`, then focused seam `scrollIntoView` with `block` and `inline` set to `nearest` and `behavior` set to `auto`.
- Web typecheck passed.
- `pnpm run verify` passed: docs/canon lint, infrastructure policy, and workspace typechecks.
- `pnpm run workspace:audit` passed with the existing two registry warnings.
- `git diff --check` passed before commit.
- Browser rerun was not available in this executor session: the persistent CUA browser had no authorized UPRISE tab; prior Chromium-emulated evidence and the clamp artifact are recorded in `.pm/checkins/2026-09-09/0307-listener-profile-pointercancel-cleanup.md`.

## Status

Implemented, locally validated, committed, and pushed; independent review and current-revision browser proof remain pending.

## Changed

- `apps/web/src/app/plot/page.tsx`: make the focused seam visible after collapsed-layout scroll clamping.
- `apps/web/__tests__/plot-profile-player-state-contract.test.ts`: lock the clamped return order and nearest visibility target.
- `docs/operations/ACTIVE_PM.md`: record this active bounded writer and baseline.

## Still Open

Independent browser QA must confirm the seam is visibly focused at the current committed revision, including the 798-to-486 clamp case and reduced-motion mode. Physical-device touch and screen-reader announcement proof remain unavailable.

## Blockers

No implementation or validation blocker. Current UPRISE browser proof is unavailable because no authorized UPRISE browser tab was present.

## Important Discovery

The previous focus routine restored the old expanded offset after unmount; the browser correctly clamped that offset on the shorter collapsed page, but this left the seam above the viewport. A nearest-target scroll after focus is required for visible return focus.

## Suggested Next Step

Run the authorized UPRISE browser rerun at the pushed revision, then obtain independent review and close the active-writer record on PASS or RETURN.

## PM Attention

None.
