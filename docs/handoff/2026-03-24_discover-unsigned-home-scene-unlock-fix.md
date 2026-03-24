# 2026-03-24 — Discover unsigned Home Scene unlock fix

## Scope
- Fix the unsigned onboarding -> plot -> Discover path so current-community Discover unlocks from a valid Home Scene tuple even when there is no resolved tuned city-scene id yet.

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
- Added a client-side Home Scene tuple fallback in `/discover` that resolves `{city, state, musicCommunity}` into the matching city-scene id when no tuned-scene id is present yet.
- Removed the auth hard-gate on current-community Discover reads once a valid scene context exists.
- Allowed anonymous `GET /discover/communities/:sceneId/search` and `GET /discover/communities/:sceneId/highlights` reads so unsigned current-community Discover can render from a resolved Home Scene context.
- Added regression coverage for the tuple-resolution path and anonymous typed-client/API reads.

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
- `/plot` resolved `Austin, Texas • Punk` scene context in the unsigned browser state.
- `/discover` showed:
  - `Home Scene: Austin, Texas — Punk`
  - `Tuned Scene: Austin, Texas — Punk`
  - unlocked current-community Discover
  - `Recommendations`
  - `Trending`
  - `Top Artists`
- This confirms the current-community Discover surface now unlocks from valid Home Scene context even when there is no pre-existing tuned city-scene id in storage.

## Verification commands
```bash
pnpm --filter web test -- --runInBand discover-page-lock.test.ts
pnpm --filter api test -- communities.discovery.controller.test.ts --runInBand
pnpm --filter web test -- discovery-client.test.ts --runInBand
```

## Notes
- The earlier signed-in Discover fixture flow was already working; this slice closes the remaining unsigned tuple-only gap.
