# 2026-03-25 — Plot and Discover legacy-modern refresh

## Summary
- Dropped the overly literal DIY paper/tape interpretation from the shared Plot/Discover visual primitives.
- Rebased the style system on the legacy app's stronger signals instead: dark charcoal surfaces, sharp type hierarchy, restrained acid-yellow highlight, and coral/red action accents.
- Kept the current route structure and founder-locked behavior intact.
- This supersedes the earlier same-day Discover-only zine shell pass as the preferred direction for the branch.

## Sources used
- `docs/legacy/uprise_mob_code/src/theme/colors.js`
- `docs/legacy/uprise_mob_code/src/screens/Home/Home.styles.js`
- `docs/legacy/uprise_mob_code/src/screens/radioScreen/radioScreen.styles.js`

## What changed
- `apps/web/src/app/globals.css`
  - moved shared Plot/Discover primitives from warm paper textures to a dark modern shell inspired by the legacy mobile palette
  - kept the existing class names to avoid route-level churn while changing the actual visual language
  - preserved yellow and red as accent colors, but in a more restrained way
- `apps/web/src/app/discover/page.tsx`
  - trimmed route copy from themed labels like `Discover Desk` / `Record Shelf View` into cleaner modern framing
  - kept travel and local-discovery behavior exactly as previously locked
- `apps/web/__tests__/discover-page-lock.test.ts`
  - updated the source lock to the new Discover framing copy while preserving the shared-style assertions

## Verification
- `pnpm --filter web test -- --runInBand __tests__/discover-page-lock.test.ts __tests__/plot-ux-regression-lock.test.ts __tests__/plot-tab-contracts.test.ts`
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- live Playwright screenshots on `/discover` and `/plot`

## Result
- The UI now reads as a modern dark product with legacy UPRISE influence instead of a literal hand-drawn notebook motif.
