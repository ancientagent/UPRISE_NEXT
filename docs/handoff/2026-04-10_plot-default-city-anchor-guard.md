# 2026-04-10 — Plot Default City Anchor Guard

## Summary
- fixed a Plot assignment/runtime mismatch where a tuned state scene could become the default selected community anchor on `/plot`
- that polluted city-scoped Plot reads because the route would try to use a state scene as the selected city community

## What Changed
- added `shouldUseTunedSceneAsDefaultPlotAnchor` in `apps/web/src/components/plot/tier-guard.ts`
- Plot now only uses the tuned scene as the default selected community when the tuned scene is `city` tier
- if the tuned scene is `state`, Plot falls back to the resolved Home Scene city anchor for the default selected community

## Why
- the player can legitimately tune to a state broadcast now
- the rest of Plot still uses a city-scoped community anchor for Feed / Events / Promotions and for city-scoped statistics reads
- without this guard, a tuned state scene could leak into city-anchored Plot state and return the wrong or empty data

## Verification
- `pnpm --filter web test -- plot-tier-guard plot-ux-regression-lock`
- `pnpm --filter web typecheck`

## Follow-up
- browser QA for this slice is still blocked until the shared Chrome DevTools target on `127.0.0.1:9222` is back up
