# 2026-04-16 — Discover Top Player / Travel Implementation

## What changed
- Moved the Discover player stack to the top of `apps/web/src/app/discover/page.tsx` so the page now opens with the RADIYO marquee instead of burying it under search and rails.
- Replaced the redundant default RADIYO footer copy on Discover with a Discover-specific travel footer rendered inside `RadiyoPlayerPanel`.
- Removed the separate dark travel bar that had been visually glued under the player and folded that behavior into the player footer area instead.
- Kept the existing travel panel and retune/map controls, but made them drop directly from the top player marquee.
- Kept search, Popular Singles, and Recommendations below the marquee as secondary snippet sections.

## Files changed
- `apps/web/src/components/plot/RadiyoPlayerPanel.tsx`
- `apps/web/src/app/discover/page.tsx`
- `apps/web/__tests__/discover-page-lock.test.ts`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`

## Notes
- This slice implements the already-locked Discover hierarchy instead of changing doctrine again.
- The player component now accepts an optional `radiyoFooter` override so Discover can replace the default transport prompt without disturbing Plot's default player behavior.
- Plot still retains the default RADIYO footer and wheel copy.
