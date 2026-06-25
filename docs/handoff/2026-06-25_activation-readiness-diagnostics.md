# 2026-06-25 — Activation Readiness Diagnostics

## Summary

Completed the internal/admin read path for city-tier Home Scene activation readiness diagnostics.

The new diagnostics read source-origin fields from Artist/Band-backed ready tracks, group by candidate natural `city + state + music community`, cap each source at `20` playable minutes, require `45` capped playable minutes and `5` distinct sources for readiness, and exclude tuples that already have an active city-tier scene.

## Branch / Commit State

- Branch: `docs/abacus-fusion-swarm-strategy`
- Previous HEAD before this slice: `f62bc60` (`feat(api): persist registrar source origin`)
- Runtime change: yes, authenticated admin analytics read path
- Migration change: none in this slice
- Provider/DB action: none

## Endpoint

- `GET /admin/analytics/activation-readiness`
- Current guard: authenticated user (`JwtAuthGuard`), matching the existing admin analytics/config posture while RBAC is deferred.
- Returns descriptive diagnostics only. It does not activate communities, change Fair Play, mutate rotations, or create user-facing activation promises.

## Behavior Implemented

- Counts only `Track.status = 'ready'` rows with a managed `ArtistBand` source.
- Reads natural source-origin tuple from `ArtistBand.sourceOriginCity`, `sourceOriginState`, and `sourceOriginMusicCommunity`.
- Groups candidates by source-origin tuple.
- Caps each source contribution at `1200` seconds / `20` minutes.
- Requires `2700` seconds / `45` minutes capped playable music and `5` distinct sources for readiness.
- Excludes tuples that already have an active city-tier `Community`.
- Ignores rows without complete source-origin identity.

## Files Changed

- `apps/api/src/admin-analytics/admin-analytics.controller.ts`
- `apps/api/src/admin-analytics/admin-analytics.service.ts`
- `apps/api/test/admin-analytics.controller.test.ts`
- `apps/api/test/admin-analytics.service.test.ts`
- `docs/specs/admin/super-admin-controls.md`
- `docs/specs/system/registrar.md`
- `docs/specs/system/documentation-framework.md`
- `docs/solutions/COMMUNITY_ACTIVATION_PROXY_LIFECYCLE_STRATEGY_R1.md`
- `docs/CHANGELOG.md`

## TDD Evidence

Red runs before implementation:

```bash
pnpm --filter api test -- admin-analytics.service.test.ts --runInBand
pnpm --filter api test -- admin-analytics.controller.test.ts --runInBand
```

Expected failures observed:

- service method `getActivationReadinessDiagnostics` did not exist;
- controller method `getActivationReadinessDiagnostics` did not exist.

Green runs after implementation:

```bash
pnpm --filter api test -- admin-analytics.controller.test.ts admin-analytics.service.test.ts --runInBand
```

## Next Slice

Activation trigger execution path remains next. That slice must decide and implement trigger authority: scheduled/system evaluator vs explicit Registrar/admin approval gate.

## Not Done

- No activation trigger/evaluator added.
- No community creation/activation mutation added.
- No live DB migration applied.
- No listener-facing activation status UI added.
- No RBAC/super-admin role system added; this follows current admin surface precedent where RBAC is deferred.
