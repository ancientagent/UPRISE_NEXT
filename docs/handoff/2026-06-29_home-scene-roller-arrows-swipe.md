# Home Scene Roller Arrow/Swipe Presentation

Date: 2026-06-29
Branch: `design/plot-neighborhood-menu-pass`
Mode: focused runtime + docs clarification

## Summary

Updated the `/plot` Home Scene Roller presentation from a visible row of all
registered/resolvable Home Scene chips to a centered active-scene switcher with
left/right arrow controls and horizontal swipe.

The underlying contract did not change:

- `/plot` still loads `GET /users/me/home-scene-roller`.
- Selecting a resolvable item still tunes scene context with
  `POST /discover/tune`.
- The selected scene still drives the Plot/RADIYO/Feed/Events/Archive context
  below it.
- Saved Away Scenes remain profile/collection context and do not appear in the
  Home Scene Roller.

## Files Updated

- `apps/web/src/app/plot/page.tsx`
  - Added active/previous/next Home Scene item derivation.
  - Replaced the old all-chip roller render with previous arrow, centered active
    Home Scene, next arrow, and pointer-swipe handling.
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
  - Locked the new arrow/swipe presentation and prevented the old rendered
    all-items chip list from returning.
- `docs/specs/users/onboarding-home-scene-resolution.md`
  - Promoted the arrow/swipe presentation into the Home Scene owner contract.
- `docs/specs/communities/plot-and-scene-plot.md`
  - Updated the Plot shell description to include the switcher behavior.
- `docs/agent-briefs/UI_CURRENT.md`
  - Added a short agent-facing summary for future UI/design work.
- `docs/CHANGELOG.md`
  - Added one Unreleased entry.

## Validation

- Red check: `pnpm --filter web test -- plot-ux-regression-lock.test.ts --runInBand`
  failed before runtime changes because the new arrow/swipe lock was absent.
- Green check: `pnpm --filter web test -- plot-ux-regression-lock.test.ts --runInBand`
  passed after the runtime update.

## Scope Boundary

No API, database, preference membership, Discover tuning contract, Away Scene
storage, or profile management behavior changed in this slice.
