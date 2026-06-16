# UX Profile Player Responsive Polish

Date: 2026-06-16
Branch: feat/ux-profile-player-responsive-polish
Status: active carry-forward

## Summary
This slice tightens the responsive behavior introduced by the `/plot` Home-side shell lock:

- `RadiyoPlayerPanel` now accepts an explicit `placement` prop with `top` and `profile-bottom` modes.
- The expanded listener profile passes `placement="profile-bottom"` to the same real RADIYO/SPACE player instead of creating a duplicate profile metadata card.
- The bottom profile player exposes `data-slot="bottom-player-marquee"` and shows a compact small-screen title/context strip before the full controls.
- The Home identity layer now wraps on small screens and returns to no-wrap on larger screens, preventing the avatar, recommendation bubble, UPRISE identity, notifications, and more menu from fighting for one row.

## Files Touched
- `apps/web/src/app/plot/page.tsx`
- `apps/web/src/components/plot/RadiyoPlayerPanel.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `docs/CHANGELOG.md`

## Verification
- `pnpm --filter web test -- plot-ux-regression-lock.test.ts`

## Agent Notes
Future UI agents should preserve these boundaries:

- The bottom profile player is the actual player with a placement variant, not a separate profile-only summary card.
- On tight screens, the compact bottom strip can prioritize track/band context, but mode, tier, rotation-pool, and wheel context remain player-owned.
- The listener profile is still opened in-place from the Home-side player pull-down; do not turn this into a separate social-profile route.
- Do not add source-management controls to the listener profile while polishing this surface.
