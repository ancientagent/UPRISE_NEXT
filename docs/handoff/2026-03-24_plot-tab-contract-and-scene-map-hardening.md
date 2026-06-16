# 2026-03-24 Plot Tab Contract And Scene-Map Hardening

## Scope
- Remove the fake city-view NYC fallback from Plot statistics.
- Keep city-tier statistics anchored to the resolved selected community when GPS is absent.
- Enrich Plot `Events` and `Promotions` rows with source/status context already returned by the API.
- Fix the live `GET /communities/:id/scene-map?tier=city` failure that was breaking the Statistics tab.

## Changes
- `apps/web/src/components/plot/StatisticsPanel.tsx`
  - removed the hard-coded `New York City` fallback used when Home Scene existed without GPS
  - city-tier nearby-community reads now short-circuit to the selected community anchor when GPS is absent
- `apps/web/src/components/plot/PlotEventsPanel.tsx`
  - event rows now render lifecycle status (`Upcoming`, `Live now`, `Ended`)
  - event rows now show organizer/source publication context and event description when present
- `apps/web/src/components/plot/PlotPromotionsPanel.tsx`
  - promotion rows now show source context, status/type badge, call-to-action copy, and expiration when metadata exists
- `apps/web/src/lib/communities/client.ts`
  - extended `CommunityEventItem` typing to reflect the `createdAt` and `createdBy` fields already returned by the API
- `apps/api/src/communities/communities.service.ts`
  - fixed city-tier scene-map raw SQL to compare `id::text = ${id}` so Prisma no longer generates the broken `text = uuid` comparison
- `apps/api/test/communities.scene-map.service.test.ts`
  - locked the corrected raw SQL shape for city-tier scene-map lookup
- `apps/web/__tests__/plot-tab-contracts.test.ts`
  - locked the no-NYC-fallback statistics behavior and the richer Events/Promotions row contracts

## Runtime Verification
- Fresh Playwright session on `http://127.0.0.1:3000/plot` with seeded `auth-storage` and `onboarding-storage`
- Statistics tab now renders without the prior scene-map error state
- Live browser network now shows:
  - `GET http://127.0.0.1:4000/communities/30ec0098-776a-4cbf-ac7e-aa6538f8c58f/scene-map?tier=city => 200`
  - no `GET /communities/nearby` calls in the no-GPS city-tier statistics flow
- Direct API check now returns `200` for city-tier scene-map on the Austin Rock scene anchor

## Verification Commands
- `pnpm --filter web test -- --runInBand __tests__/plot-ux-regression-lock.test.ts __tests__/plot-tab-contracts.test.ts`
- `pnpm --filter api test -- communities.scene-map.service.test.ts --runInBand`
- `pnpm --filter web typecheck`
- `pnpm --filter api typecheck`
- `pnpm run verify`

## Residual Risk
- `Scene Activity Snapshot` is still descriptive copy, not a dedicated live activity list.
- Feed remains explicit/non-personalized, but deeper feed-card richness is still a separate UX pass if you want it tightened further.
