# UX Foundation Screen Shell Runtime Lock

Date: 2026-06-15
Branch: feat/ux-foundation-screen-shell
Status: active carry-forward

## Summary
The `/plot` Home-side shell now matches the current UI brief more closely:

- the top identity layer is no longer a generic `User dashboard` strip
- the top layer exposes explicit runtime slots for:
  - listener avatar bust
  - listener recommendation bubble
  - `UPRISE <CITY>` identity text
  - notifications
  - more/settings menu
- the RADIYO/SPACE player is defined once as `playerPanel`
- when the listener profile / collection workspace is expanded, Plot tabs are replaced and the actual player relocates to the bottom of that workspace
- the old duplicated `Player Context` summary card was removed because mode, tier, and rotation-pool context are player-owned

## Files Touched
- `apps/web/src/app/plot/page.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`

## Verification
- `pnpm --filter web test -- plot-ux-regression-lock.test.ts`
- `pnpm --filter web typecheck`

## Agent Notes
Future UI agents should not reintroduce:

- a generic dashboard strip in place of the avatar/recommendation/UPRISE identity layer
- profile-expanded player metadata duplicated outside the player
- a separate listener-profile route assumption for the current Home-side profile interaction
- Plot tabs while the listener profile / collection workspace is expanded
