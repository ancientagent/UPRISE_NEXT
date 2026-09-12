# PM Check-In

**Date/Time:** 2026-09-09 03:07 CDT
**Run ID:** `listener-profile-pointercancel-cleanup`
**Agent/Thread:** Fable (Claude Code) / listener-profile-pointercancel-cleanup
**Area:** Home / Plot / Listener Profile gesture path
**Task:** Add `pointercancel` cleanup to the existing Listener Profile pull gesture: reset drag state and return `peek` to `collapsed` without changing a committed `expanded` or `collapsed` state. Add focused coverage and rerun the browser QA at the resulting revision.
**Branch/Commit:** `fable/handoff`; starting baseline `9b4400ac`; this check-in's enclosing commit

## Result

Added `handleProfilePointerCancel` in `/plot` (the existing state owner) and
wired it to `onPointerCancel` on the identity gesture layer. The handler nulls
`dragStartY`, zeroes `dragDelta`, and collapses only when the panel is in
`peek`. Committed `expanded`/`collapsed` states are untouched. No other
interaction, layout, ARIA, or player behavior changed.

## Evidence

- TDD: the new contract test failed first (handler absent), then passed.
- `pnpm --filter web test -- --runInBand` on the four focused suites: 4 suites,
  46 tests passed.
- `pnpm --filter web typecheck`: passed.
- `pnpm run verify`: passed (docs/canon lint, infra policy, workspace typechecks).
- `pnpm run workspace:audit`: passed with the pre-existing two warnings.
- `git diff --check`: passed (LF/CRLF notices only).
- Browser rerun on the running local app (`pnpm --filter web dev` + `pnpm --filter api dev`, existing Playwright MCP Chromium tab, signed-out, Austin/Texas/Punk onboarding store):
  - 390x844, CDP touch: pull +70 expands; pull -70 collapses; peek at +30 then `touchCancel` returns to collapsed; a fresh pull after the cancel expands (drag refs reset); `touchCancel` and a DOM `pointercancel` while expanded leave it expanded; `pointercancel` while collapsed leaves it collapsed; mouse peek then `pointercancel` then a late 70 px `mouseup` stays collapsed.
  - 1280x800, mouse: two consecutive 60 px pulls both expand with no text selection; pull-up collapses; peek early release collapses; Enter on seam expands; Tab to `Return to Plot Tabs` + Enter returns focus to the seam with `:focus-visible`; reduced motion (`emulateMedia`) keeps panel `transition-property: none`, zero animations, and `pointercancel` during peek still collapses.
  - No console errors or warnings.
  - Screenshots `40-rerun-mobile-after-touch-390.png`, `41-rerun-desktop-after-return-1280.png`, `42-rerun-desktop-collapsed-1280.png` in `C:\Users\baris\uprise-agent-artifacts\listener-profile-browser-qa\` (WSL `/mnt/c/Users/baris/uprise-agent-artifacts/listener-profile-browser-qa/`).

## Status

Implemented, source/test validated, and browser verified by the implementing agent at this revision. Independent review is still pending.

## Changed

- `apps/web/src/app/plot/page.tsx`: `handleProfilePointerCancel` and its prop wiring.
- `apps/web/src/components/plot/PlotTopShell.tsx`: `onProfilePointerCancel` prop and `onPointerCancel` on the identity layer.
- `apps/web/__tests__/plot-profile-player-state-contract.test.ts`: focused contract test for the cancel handler and wiring.
- `docs/operations/ACTIVE_PM.md`: active writer record and validation row.

## Still Open

- Independent review of this commit (the browser rerun above was run by the implementer, not an independent reviewer).
- Physical-device touch proof; touch remains Chromium-emulated.

## Blockers

None.

## Important Discovery

At 1280x800 the `Return to Plot Tabs` scroll restore targets the pre-return
offset (798 px) but the collapsed page is shorter, so the browser clamps to
486 px; focus lands correctly on the seam, which is then above the viewport.
Pre-existing from `9b4400ac`, outside this task's boundary, reported for the
Manager rather than changed.

## Suggested Next Step

Independent reviewer PASS/RETURN on this commit; the active writer record closes on that verdict.

## PM Attention

None.
