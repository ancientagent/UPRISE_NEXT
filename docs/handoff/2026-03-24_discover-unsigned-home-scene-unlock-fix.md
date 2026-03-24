# 2026-03-24 — Discover unsigned Home Scene unlock fix

## Scope
- Fix the unsigned onboarding -> plot -> Discover path so current-community Discover unlocks from a valid Home Scene tuple even when there is no resolved tuned city-scene id or live city-scene anchor yet.

## Files
- `apps/web/src/app/discover/page.tsx`
- `apps/web/src/lib/discovery/client.ts`
- `apps/api/src/communities/discovery.controller.ts`
- `apps/api/src/communities/communities.service.ts`
- `apps/web/__tests__/discover-page-lock.test.ts`
- `apps/web/__tests__/discovery-client.test.ts`
- `apps/api/test/communities.discovery.controller.test.ts`
- `docs/handoff/2026-03-24_session-context-reconciliation.md`
- `docs/CHANGELOG.md`

## What changed
- Added a client-side Home Scene fallback ladder in `/discover` that first attempts to resolve `{city, state, musicCommunity}` into a live city-scene id, then keeps the page in current-community empty-state mode when no city-scene anchor exists yet.
- Removed the auth hard-gate on current-community Discover reads once valid community context exists.
- Allowed anonymous `GET /discover/communities/:sceneId/search` and `GET /discover/communities/:sceneId/highlights` reads so unsigned current-community Discover can render from either a resolved scene id or the Home Scene empty-state fallback.
- Added regression coverage for both the fallback-resolution path and anonymous typed-client/API reads.

## Live verification
### Unsigned state repro
- Clean browser storage.
- Seeded only `onboarding-storage` with:
  - `homeScene: { city: "Austin", state: "Texas", musicCommunity: "Punk" }`
  - `tunedSceneId: null`
  - `tunedScene: null`
  - no `auth-storage`
- Opened `/plot`, then `/discover`.

### Observed result
- `/plot` carried `Austin, Texas • Rock` scene context in the unsigned browser state.
- `/discover` showed:
  - `Home Scene: Austin, Texas — Rock`
  - `Tuned Scene: Not set`
  - enabled local artist/song search
  - `Recommendations`
  - `Trending`
  - `Top Artists`
  - empty-state current-community messaging explaining that no live city-scene anchor exists yet
- This confirms the current-community Discover surface now unlocks from valid Home Scene context even when there is no pre-existing tuned city-scene id or live city-scene anchor in storage.

## Verification commands
```bash
pnpm --filter web test -- --runInBand discover-page-lock.test.ts
pnpm --filter api test -- communities.discovery.controller.test.ts --runInBand
pnpm --filter web test -- discovery-client.test.ts --runInBand
```

## Notes
- The earlier signed-in Discover fixture flow was already working; this slice closes the remaining unsigned tuple-only gap and keeps current-community Discover usable even before a live city-scene anchor exists.
