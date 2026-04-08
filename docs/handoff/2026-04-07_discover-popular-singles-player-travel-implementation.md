# 2026-04-07 Discover Popular Singles + Player Travel Implementation

## Summary
- Replaced the stale Discover highlights contract (`trending`, `topArtists`) with the locked MVP structure:
  - `popularSingles.mostAdded`
  - `popularSingles.supportedNow`
  - `popularSingles.recentRises`
  - `recommendations`
- Threaded tier scope through the typed web client and API query DTOs so Discover search, highlights, and scene-map reads stay aligned to the current player scope.
- Rebuilt `/discover` to match the current founder lock:
  - one search bar
  - `Popular Singles`
  - `Recommendations`
  - persistent player
  - Travel attached to the bottom of the player
  - map drops from the Travel control instead of leading the page

## Files
- `packages/types/src/discovery.ts`
- `apps/api/src/communities/dto/community.dto.ts`
- `apps/api/src/communities/discovery.controller.ts`
- `apps/api/src/communities/communities.service.ts`
- `apps/web/src/lib/discovery/client.ts`
- `apps/web/src/app/discover/page.tsx`
- `apps/web/__tests__/discovery-client.test.ts`
- `apps/web/__tests__/discover-page-lock.test.ts`
- `apps/api/test/communities.discovery.controller.test.ts`
- `apps/api/test/communities.discovery.service.test.ts`

## Notes
- `Recent Rises` is wired as an explicit Discover lens but currently returns an empty array because rise-propagation metadata is not present in the runtime contract yet. This is intentional and matches the current service implementation.
- Recommendations now come from scoped `RECOMMEND` actions, deduped to the latest recommendation per recommending user inside the selected scope.
- `Popular Singles` and recommendation rows are computed from the full scoped dataset, not a recency-limited sample, so all-time/current-window lens semantics remain intact for older qualifying singles.
- The Travel surface remains player-attached. The visual map only renders when the user opens Travel from the control attached below the player.

## Verification
- `pnpm --filter web test -- discover-page-lock discovery-client`
- `pnpm --filter api test -- communities.discovery.controller communities.discovery.service`
