# Discover Contracts And Surface Implementation (2026-03-23)

## Scope
Implemented the missing Discover contract layer and rewired the web Discover surface to use the new founder-locked flow instead of the older scene-only page.

## What Changed
- Added new Discover DTOs for:
  - community-local search
  - community highlights
  - saved-Uprise acquisition
- Added new Discover API behavior in `CommunitiesService` for:
  - local artist/song search inside a community
  - `Recommendations` / `Trending` / `Top Artists` highlights
  - saving an Uprise into the user's `uprises` collection shelf
- Added `POST /signals/:id/recommend`
- Extended shared signal action typing to include `RECOMMEND`
- Added shared Discover contract types under `packages/types/src/discovery.ts`
- Added typed web client wrappers for the new Discover contracts
- Replaced the old `/discover` scene-only page with a richer surface that now includes:
  - contextual Uprise travel search
  - map toggle using the existing scene-map visual component
  - retune / add / visit / set-home controls on city-scene rows
  - local artist/song search for the active tuned community
  - `Recommendations`, `Trending`, and `Top Artists` carousel sections
  - live signal actions (`Add`, `Blast`, `Recommend`) on highlight cards

## Validation
- `pnpm --filter @uprise/types build`
- `pnpm --filter api test -- communities.discovery.controller.test.ts communities.discovery.service.test.ts signals.service.test.ts`
- `pnpm --filter web test -- discovery-client.test.ts discovery-context.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`
- Local boot check:
  - `pnpm --filter web dev`
  - `curl http://127.0.0.1:3000/discover`

## Notes
- The Discover surface now renders without a running auth session and shows the new travel/search shell, but richer community-local results still depend on authenticated context and data availability.
- Artist/song local-search rows are currently informational cards on the Discover page. Native artist/single destination routing remains a separate follow-up unless that route work is pulled into the same slice later.
- Untracked local artifacts were left untouched:
  - `.playwright-cli/`
  - `.worktrees/`
  - `core-api.pid`
  - `ui-dev.pid`
