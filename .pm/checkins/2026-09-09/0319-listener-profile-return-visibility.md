# PM Check-In

**Date/Time:** 2026-09-09 03:19 CDT
**Run ID:** `listener-profile-return-visibility`
**Agent/Thread:** UPRISE executor / listener-profile-return-visibility
**Area:** Home / Plot / Listener Profile return focus
**Task:** Make the focused Plot Tabs seam visible when the collapsed page clamps the prior expanded scroll offset.
**Branch/Commit:** `fable/handoff`; starting baseline `5b4b3b8`

## Result

Updated the existing post-return focus routine to preserve the captured scroll position first, then call `scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'auto' })` on the focused Plot Tabs seam. This keeps the seam visible when the prior expanded offset exceeds the shorter collapsed page while avoiding unnecessary movement when it is already visible.

## Evidence

- Focused web suites: Plot profile/player state contract and Plot UX regression lock, 41 tests passed.
- New regression contract asserts the clamped-layout scroll/focus ordering and nearest seam visibility target.
- Existing prior browser rerun identified the exact clamp case: expanded offset `798` clamped to `486`, leaving the focused seam above the viewport (`.pm/checkins/2026-09-09/0307-listener-profile-pointercancel-cleanup.md`, artifact `41-rerun-desktop-after-return-1280.png`).
- Web typecheck, `pnpm run verify`, and `pnpm run workspace:audit` are to be rerun at the final commit.

## Status

Implemented locally; final validation, commit/push, and independent browser re-review pending.

## Changed

- `apps/web/src/app/plot/page.tsx`: nearest visibility correction after return focus and scroll restoration.
- `apps/web/__tests__/plot-profile-player-state-contract.test.ts`: clamped-layout ordering/visibility regression assertions.
- `docs/operations/ACTIVE_PM.md`: active writer and current baseline record.

## Still Open

Current-commit browser rerun must confirm visible focused seam at the clamped desktop layout and preserve normal/reduced-motion behavior. Physical-device touch and screen-reader announcement proof remain unavailable.

## Blockers

None.

## Important Discovery

The existing `scrollTo` restoration alone cannot guarantee visibility after content unmounts because the collapsed page is shorter; a nearest-target scroll is required after focus.

## Suggested Next Step

Run the full focused regression set and browser rerun on the committed revision, then obtain independent review and close the active-writer record on PASS or RETURN.

## PM Attention

None.
