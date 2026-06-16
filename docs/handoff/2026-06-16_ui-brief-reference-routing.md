# UI Brief Reference Routing

Date: 2026-06-16
Agent: Codex GPT-5.5 high
Branch: `fix/ui-brief-historical-lock-routing`

## Summary
- Updated `docs/agent-briefs/UI_CURRENT.md` so historical mobile and screenshot-derived UX docs no longer appear under `Current UI locks`.
- Added an explicit `Reference / companion UI files` section for older mapping, mobile-system, Plot/Profile screenshot, and screenshot element docs.
- Added a regression lock to keep those files out of the current-lock section while still allowing them as reference material.

## Files Touched
- `docs/agent-briefs/UI_CURRENT.md`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `docs/CHANGELOG.md`

## Verification
- Red: `pnpm --filter web test -- plot-ux-regression-lock.test.ts` failed while `UI_CURRENT.md` lacked a reference section and still listed historical docs as current locks.
- Green: `pnpm --filter web test -- plot-ux-regression-lock.test.ts`

## Agent Notes
- For design-agent and UI implementation work, load `UI_CURRENT.md` first.
- Treat `MVP_MOBILE_UX_SYSTEM_R1.md`, `MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`, and `MVP_SCREENSHOT_ELEMENT_SPEC_R1.md` as reference only.
- Current Home/Plot tab truth remains `Feed`, `Events`, and `Archive`.
