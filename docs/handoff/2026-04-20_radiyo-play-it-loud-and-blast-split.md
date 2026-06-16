# 2026-04-20 — RADIYO Play It Loud And Blast Split

## Summary
Reconciled the active wheel/action doctrine so `Blast` no longer appears on the `RADIYO` wheel. `RADIYO` now uses `Play It Loud` as its immediate positive listening action, while `Blast` remains tied to the personal player / user-space listening context.

## Files changed
- `apps/web/src/components/plot/engagement-wheel.ts`
  - replaced the `RADIYO` wheel's `Blast` slot with `Play It Loud`
  - kept `Collection` mode mapped to `Blast` at `12:00`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
  - updated the deterministic wheel lock to expect `Play It Loud` on `RADIYO`
- `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
  - added `Play It Loud` as the positive `RADIYO` action
  - moved `Blast` context to personal player / user space
- `docs/specs/broadcast/radiyo-and-fair-play.md`
  - documented `Play It Loud` as the `RADIYO` wheel action
  - clarified that `Blast` does not belong to the `RADIYO` wheel
- `docs/specs/core/signals-and-universal-actions.md`
  - clarified that `Blast` is personal-player context while `Play It Loud` is not part of the current signal API contract
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
  - updated the artist-profile blast boundary to point at personal player / user space instead of `RADIYO`
- `docs/solutions/MVP_ARTIST_PROFILE_DOC_AUDIT_R1.md`
  - updated the action split summary to match the new doctrine
- `docs/solutions/EXTERNAL_ASSISTANT_REPO_BRIEF_R1.md`
  - updated the action grammar summary for external assistants
- `docs/solutions/REPO_AUTHORITY_MAP_R1.md`
  - updated the conflict-resolution example to use the new split
- `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`
  - updated the active screenshot-derived wheel list to `Play It Loud`

## Result
Current active doctrine is now:
- `RADIYO`: `Report`, `Skip`, `Play It Loud`, `Collect`, `Upvote`
- personal player / user space: `Blast`
- artist profile: no wheel, no `Blast`, `Collect` from demo listening only

## Verification
- `pnpm --filter web test -- plot-ux-regression-lock`
- `pnpm run docs:lint`
- `git diff --check`
