# Plot Bottom Nav Restoration

## Summary
- restored the founder-locked bottom nav on `/plot`
- added a minimal deterministic UPRISE wheel drawer driven by the existing mode-specific action set
- added regression coverage so the nav and center trigger remain locked to the `/plot` route

## Files Changed
- `apps/web/src/app/plot/page.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `docs/CHANGELOG.md`

## What Changed
- added persistent bottom navigation to `/plot` with:
  - `Home` (left)
  - center `UPRISE` trigger
  - `Discover` (right)
- wired the center trigger to a small wheel drawer that renders the existing deterministic action labels from `getEngagementWheelActions(playerMode)`
- applied bottom padding to the `/plot` surface so the fixed nav does not cover content
- rendered the same nav even in the unresolved Home Scene guidance state so the route keeps the locked shell shape

## Verification
- `pnpm --filter web test -- plot-ux-regression-lock.test.ts`
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- live browser verification with Playwright CLI wrapper:
  - opened `http://127.0.0.1:3000/plot`
  - confirmed snapshot contains:
    - navigation `Plot bottom navigation`
    - link `Home`
    - button `Open UPRISE engagement wheel`
    - link `Discover`
  - snapshot: `.playwright-cli/page-2026-03-24T05-10-33-327Z.yml`

## Why
- Batch27 QA reported the live `/plot` route was missing the required bottom nav entirely
- the current route source had no bottom-nav render path at all, so this was a real implementation omission rather than a QA environment artifact
