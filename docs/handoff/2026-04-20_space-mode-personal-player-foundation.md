# 2026-04-20 — SPACE Mode Personal-Player Foundation

## Purpose
Reconcile the current web player shell so the owned listening mode stops reading as `Collection` and instead reads as `SPACE`, matching the newer founder direction that:
- `RADIYO` is the broadcast listening mode
- artist profile is the direct-listen discovery mode
- the personal player / user space is the owned listening mode where `Blast` belongs

## What Changed
- `/plot` now enters `SPACE` when a listener selects an owned item from the saved-singles area.
- The compact player shell now labels the owned listening mode as `SPACE` / `Your Space` instead of `Collection`.
- The deterministic wheel helper now exports `SPACE_WHEEL_ACTIONS` instead of `COLLECTION_WHEEL_ACTIONS`.
- Regression locks now assert `RADIYO` vs `SPACE` copy, `SPACE` selection entry, and `SPACE` wheel ownership.

## Files
- `apps/web/src/app/plot/page.tsx`
- `apps/web/src/components/plot/RadiyoPlayerPanel.tsx`
- `apps/web/src/components/plot/engagement-wheel.ts`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
- `docs/solutions/EXTERNAL_ASSISTANT_REPO_BRIEF_R1.md`
- `docs/handoff/2026-04-16_notebooklm_artist-profile-and-dashboard_briefing.md`
- `docs/CHANGELOG.md`

## Why This Slice
The action split was already locked:
- `Play It Loud` on `RADIYO`
- `Blast` on the personal player / user space

But the live web shell still taught assistants and tests that the owned listening mode was `Collection`.

That wording made the three listening shells less legible than intended:
- `RADIYO`
- artist profile
- personal player / `SPACE`

This slice makes the personal-player stand-in explicit without reopening broader user-space or blast-room implementation work.

## Current Boundary
- `RADIYO` remains the broadcast shell.
- artist profile remains the direct-listen/discovery shell with no wheel.
- `SPACE` is now the visible web stand-in for the personal player / user space.
- broader blast-room social behavior is still a later slice.
