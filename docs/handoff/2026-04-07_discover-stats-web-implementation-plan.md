# 2026-04-07 Discover + Stats Web Implementation Plan

## Authority
- `AGENTS.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/solutions/SEAMLESS_AGENT_CONTINUITY_PROTOCOL_R1.md`
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`
- `docs/solutions/SURFACE_CONTRACT_PLOT_R1.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/communities/scene-map-and-metrics.md`
- `apps/web/WEB_TIER_BOUNDARY.md`

## Project State
- Branch: `feat/ux-founder-locks-and-harness`
- Planning date: `2026-04-07`
- Worktree: mixed / dirty
- Warning:
  unrelated modified files are present in avatar-picker docs/scripts, older prompt docs, launcher scripts, runtime folders, and local artifacts. Do not treat the current worktree as a clean implementation slice.

## Active Task Scope
- In scope:
  translate the current Discover + stats founder locks into an execution-ready `apps/web` implementation plan tied to current code and contracts.
- Out of scope:
  direct code implementation, canon rewrites, map-visual-design invention, notification-taxonomy invention, or reopening settled Home/Plot/Discover ownership rules.

## Locked
- `Home` is the left destination.
- `Discover` is the right destination.
- `Plot` lives inside `Home`.
- Discover is player-anchored and inherits the active listening/community scope.
- Discover top-to-bottom order is:
  1. one search bar
  2. `Popular Singles`
  3. `Recommendations`
  4. persistent player
  5. `Travel` attached to the bottom of the player
- `Popular Singles` lenses are `Most Added`, `Supported Now`, and `Recent Rises`.
- `Popular Now` is excluded from Discover.
- Recommendations use the fixed avatar + `Check out "signal"` grammar and are not freeform text cards.
- Plot feed carries followed-source updates.
- Plot statistics and Discover lens semantics must share one descriptive stats contract.
- Top 40 / billboard-style lists remain deferred from MVP.

## Current Code Reality
### Current web surface
- [`apps/web/src/app/discover/page.tsx`](/home/baris/UPRISE_NEXT/apps/web/src/app/discover/page.tsx) is still structured around an older Discover model:
  - top-level `Uprise Travel`
  - separate travel search and tier chips above the rest of the page
  - direct map exploration and retune from a top travel block
  - current-community local search as a second primary block
  - carousels for `Recommendations`, `Trending`, and `Top Artists`
- The page currently does **not** render a persistent player shell inside Discover.
- The page currently treats map exploration as a primary top-half section instead of a player-attached `Travel` expansion.

### Current shared contract/API shape
- [`packages/types/src/discovery.ts`](/home/baris/UPRISE_NEXT/packages/types/src/discovery.ts) still defines `CommunityDiscoverHighlights` as:
  - `recommendations`
  - `trending`
  - `topArtists`
- [`apps/api/src/communities/discovery.controller.ts`](/home/baris/UPRISE_NEXT/apps/api/src/communities/discovery.controller.ts) exposes `GET /discover/communities/:sceneId/highlights`.
- [`apps/api/src/communities/communities.service.ts`](/home/baris/UPRISE_NEXT/apps/api/src/communities/communities.service.ts) currently fulfills that endpoint with:
  - recommendation signals
  - blast-sorted `trending` signals
  - scene-local `topArtists`
- This is stale relative to the current founder lock and stats lock.

### Current Plot/stats groundwork
- [`apps/web/src/components/plot/StatisticsPanel.tsx`](/home/baris/UPRISE_NEXT/apps/web/src/components/plot/StatisticsPanel.tsx) already consumes tier-aware statistics and scene-map APIs.
- [`apps/web/src/components/plot/RadiyoPlayerPanel.tsx`](/home/baris/UPRISE_NEXT/apps/web/src/components/plot/RadiyoPlayerPanel.tsx) is the current compact persistent-player shell candidate for reuse/adaptation.
- [`apps/web/src/lib/discovery/client.ts`](/home/baris/UPRISE_NEXT/apps/web/src/lib/discovery/client.ts) already centralizes Discover route calls, so it is the correct web-tier contract seam.

## Do Not Change
- Do not reintroduce `Trending` or `Top Artists` as primary Discover rails.
- Do not split travel search and artist/song search into two top-level Discover search systems.
- Do not detach Discover scope from player context.
- Do not implement `Popular Now`, Top 40, billboard lists, or recommendation-engine behavior.
- Do not invent map visualization semantics beyond the already locked city/state/national structural scope behavior.
- Do not bypass the API layer from `apps/web`.

## Execution Plan
### Slice 1: Shared Discover contract replacement
Owner:
  shared types + API + web client

Files:
- [`packages/types/src/discovery.ts`](/home/baris/UPRISE_NEXT/packages/types/src/discovery.ts)
- [`apps/api/src/communities/discovery.controller.ts`](/home/baris/UPRISE_NEXT/apps/api/src/communities/discovery.controller.ts)
- [`apps/api/src/communities/communities.service.ts`](/home/baris/UPRISE_NEXT/apps/api/src/communities/communities.service.ts)
- [`apps/web/src/lib/discovery/client.ts`](/home/baris/UPRISE_NEXT/apps/web/src/lib/discovery/client.ts)

Replace the stale `highlights` contract with a Discover-specific response that matches the current lock. Minimum target shape:
- `community`
- `popularSingles`
- `mostAdded`
- `supportedNow`
- `recentRises`
- `recommendations`

Notes:
- The endpoint path can remain `/discover/communities/:sceneId/highlights` if that reduces churn, but the payload must stop advertising `trending` and `topArtists`.
- `recommendations` should evolve from generic signal cards toward explicit recommender + recommended-signal payloads so the avatar + fixed-balloon grammar can be rendered correctly.

### Slice 2: Stats-backed Popular Singles aggregation
Owner:
  API + shared contract

Files:
- [`apps/api/src/communities/communities.service.ts`](/home/baris/UPRISE_NEXT/apps/api/src/communities/communities.service.ts)
- related DTO/tests under `apps/api/test/`

Implement founder-locked lens semantics:
- `Most Added` -> single signals sorted by `addCountAllTime`
- `Supported Now` -> single signals sorted by `supportCountNow`
- `Recent Rises` -> single signals sorted by propagation markers `highestScopeReached` + `lastRiseAt`

Notes:
- This is descriptive stats behavior, not recommendation logic.
- If propagation fields are not fully wired in runtime data yet, ship the contract and resolver scaffold first, then mark `Recent Rises` as structurally present but operationally pending rather than inventing substitute momentum semantics.
- `Popular Now` must remain absent.

### Slice 3: Discover page composition rewrite
Owner:
  `apps/web`

Files:
- [`apps/web/src/app/discover/page.tsx`](/home/baris/UPRISE_NEXT/apps/web/src/app/discover/page.tsx)
- new/adjacent presentation components under `apps/web/src/components/`

Recompose Discover into the founder-locked vertical structure:
1. top search bar for artist/song search in the current listening scope
2. `Popular Singles`
3. `Recommendations`
4. persistent player
5. `Travel` control attached to the player bottom
6. map expansion panel below the player when Travel is open

Required removals/reframes:
- remove the current top-level `Uprise Travel` panel as a primary page section
- remove `Trending`
- remove `Top Artists`
- stop presenting travel search as the first Discover job

Required keeps:
- current-community inheritance
- explicit `Visit [Community]` deeper action as secondary, not primary
- signed-out behavior that avoids auth dead-end links

### Slice 4: Player/travel integration
Owner:
  `apps/web`

Files:
- [`apps/web/src/components/plot/RadiyoPlayerPanel.tsx`](/home/baris/UPRISE_NEXT/apps/web/src/components/plot/RadiyoPlayerPanel.tsx) or a Discover-specific derivative
- [`apps/web/src/app/discover/page.tsx`](/home/baris/UPRISE_NEXT/apps/web/src/app/discover/page.tsx)
- existing scene-map utilities/components

Use the current compact player shell as the integration baseline rather than inventing a second player system.

Target behavior:
- Discover shows the persistent player inline.
- `Travel` is visually and structurally attached to the bottom of that player.
- activating `Travel` opens the geographic scope UI downward from the player.
- map placement becomes subordinate to the player/travel system, not a top-of-page peer module.

Deferred:
- exact visual treatment of map scope cards/clusters beyond the already locked city/state/national macro behavior
- any unnecessary map interactivity beyond what is needed to preserve the current explicit retune flow

### Slice 5: Test replacement pass
Owner:
  web + API

Files to update:
- [`apps/web/__tests__/discover-page-lock.test.ts`](/home/baris/UPRISE_NEXT/apps/web/__tests__/discover-page-lock.test.ts)
- [`apps/web/__tests__/discovery-client.test.ts`](/home/baris/UPRISE_NEXT/apps/web/__tests__/discovery-client.test.ts)
- [`apps/api/test/communities.discovery.controller.test.ts`](/home/baris/UPRISE_NEXT/apps/api/test/communities.discovery.controller.test.ts)
- [`apps/api/test/communities.discovery.service.test.ts`](/home/baris/UPRISE_NEXT/apps/api/test/communities.discovery.service.test.ts)

Replace stale assertions that currently lock:
- `Trending`
- `Top Artists`
- old `CommunityDiscoverHighlights`

Add/refresh assertions for:
- one top search bar
- no second primary travel search
- `Popular Singles` lenses only: `Most Added`, `Supported Now`, `Recent Rises`
- recommendations row/rail exists without becoming a leaderboard
- player/travel/map ordering
- no `Popular Now`

## Suggested Implementation Order
1. Replace the shared Discover highlights contract and web client typings.
2. Implement the API aggregation needed for `Popular Singles` and recommendation row payloads.
3. Rewrite `/discover` composition against the new contract.
4. Re-anchor the map under player-attached `Travel`.
5. Rewrite stale tests and add founder-lock assertions for the new structure.

## Open
- Exact recommendation payload shape needed to fully render the locked avatar + balloon grammar.
- Whether current data already supports `Recent Rises` without additional propagation-field work.
- Exact first-pass retune interaction inside the Travel-expanded map, if stricter founder direction lands before implementation.
- Notification taxonomy remains separate and should not be solved inside this slice.

## Next Required Actions
1. Commit or stash unrelated work before implementation so Discover changes can be audited against a clean slice.
2. Start with the shared contract/API slice, not the page rewrite.
3. After the contract lands, re-read only the active Discover/stats locks and update `/discover`.
4. Run the targeted verification chain before any broader visual pass.

## Execution Standard
- Commands/checks required:
  - `pnpm run docs:lint`
  - `pnpm run infra-policy-check`
  - targeted web tests for Discover
  - targeted API tests for discovery contracts
  - relevant web/api typecheck steps
- Done means:
  - stale `Trending` / `Top Artists` Discover behavior is removed from contracts and UI
  - Discover is player-anchored in structure, not just copy
  - `Popular Singles` and `Recommendations` are the active rails
  - Travel/map live below the player
  - no new product semantics are invented
