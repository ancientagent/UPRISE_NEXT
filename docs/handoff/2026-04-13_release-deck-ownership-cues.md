# 2026-04-13 — Release Deck Ownership Cues

## Objective
Make the current `Release Deck` slot surface visibly distinguish explicit source-owned releases from older compatible carry-forward tracks.

## What Changed
- `apps/web/src/app/source-dashboard/release-deck/page.tsx`
  - current slot cards now label tracks with:
    - `Source-owned release` when `track.artistBandId === activeSource.id`
    - `Legacy carry-forward` when the row is still compatible but lacks stored source linkage
  - added supporting explanatory copy below the slot grid
- `apps/web/__tests__/release-deck-shell-lock.test.ts`
  - locked the two ownership labels on the Release Deck surface
- `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md`
  - documented that the current Release Deck slot runtime may distinguish explicit source-owned rows from older compatible carry-forward tracks

## Why
- new Release Deck writes already attach directly to the active source account
- older carried-over tracks remain intentionally compatible during this MVP period
- without a visible cue, the slot surface still flattened those two ownership states into one generic presentation

## Verification
- `pnpm --filter web test -- release-deck-shell-lock`
- `pnpm --filter web typecheck`
- `pnpm run verify`
- `git diff --check`

## Outcome
- Release Deck now makes its stronger ownership model visible on the live slot surface
- explicit source-owned releases are clearly distinguished from older compatible rows
- compatibility for older rows remains intact
