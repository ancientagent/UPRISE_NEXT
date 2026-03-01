# UX-IMPL-537A — Player Title Mode Parity + Scene Strip Cleanup

## Scope
Implement remaining mobile-first player parity on `/plot`:
- Switch broadcast/title label by player mode.
- Ensure `Collection` mode title follows `<user> Collection` format.
- Remove redundant scene strip under player.

## Files Changed
- `apps/web/src/app/plot/page.tsx`
- `docs/CHANGELOG.md`

## Notes
- `RADIYO` mode label now uses scene/uprise naming (`homeScene.musicCommunity` fallback: `City Punk Uprise`).
- `Collection` mode label now resolves to `<displayName|username|Your> Collection`.
- Removed `SceneContextBadge` render below player to match the requested shell cleanup.

## Verify Command (exact)
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web typecheck
```

## Verify Result
- Passed (`docs:lint`, `infra-policy-check`, `web typecheck`).
