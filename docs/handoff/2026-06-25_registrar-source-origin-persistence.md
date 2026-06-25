# 2026-06-25 — Registrar Source-Origin Persistence

## Summary

Completed the runtime prerequisite for activation readiness diagnostics: Artist/Band Registrar filings now preserve the submitted natural source-origin tuple separately from the active/proxy operating scene.

This keeps `sceneId` / `ArtistBand.homeSceneId` as the current operating scene while adding source-origin fields for future activation accounting.

## Branch / Commit State

- Branch: `docs/abacus-fusion-swarm-strategy`
- Previous HEAD before this slice: `b382a6b` (`docs: clarify source-origin blocker review notes`)
- Runtime change: yes, API Registrar service + Prisma schema/migration
- Provider/DB action: none; migration file created but not applied to a live database

## Behavior Implemented

- `RegistrarEntry.sourceOriginCity`, `sourceOriginState`, and `sourceOriginMusicCommunity` persist the registering user's submitted natural Home Scene tuple.
- `ArtistBand.sourceOriginCity`, `sourceOriginState`, and `sourceOriginMusicCommunity` are copied from the Registrar entry during materialization.
- `RegistrarEntry.sceneId` remains the active operating scene for the filing.
- `ArtistBand.homeSceneId` remains the active operating scene at materialization time.
- Artist/Band registration remains GPS-gated and city-tier only.
- Artist/Band registration now permits the assigned same-music-community proxy scene when `User.tunedSceneId` matches the requested scene.
- Artist/Band registration still rejects unrelated Away/visitor scenes.

## Files Changed

- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/20260625120000_add_registrar_source_origin/migration.sql`
- `apps/api/src/registrar/registrar.service.ts`
- `apps/api/test/registrar.service.test.ts`
- `docs/specs/system/registrar.md`
- `docs/agent-briefs/REGISTRAR_GOVERNANCE.md`
- `docs/specs/system/documentation-framework.md`
- `docs/solutions/COMMUNITY_ACTIVATION_PROXY_LIFECYCLE_STRATEGY_R1.md`
- `docs/CHANGELOG.md`

## TDD Evidence

Red run before implementation:

```bash
pnpm --filter api test -- registrar.service.test.ts --runInBand
```

Expected failures observed:

- proxy-scene artist registration was rejected with `Registrar submissions are limited to your Home Scene`;
- submitted Registrar entry did not write source-origin fields;
- materialized Artist/Band did not write source-origin fields.

Green run after implementation:

```bash
pnpm --filter api exec prisma format
pnpm --filter api test -- registrar.service.test.ts --runInBand
pnpm --filter api typecheck
```

## Next Slice

Activation readiness diagnostics/read path can now be built from persisted source-origin fields. It should remain internal/admin/read-only and should count:

- approved playable minutes;
- distinct registered source accounts;
- per-source contribution against the `20` minute cap;
- candidate inactive natural `city + state + music community` tuples.

## Not Done

- No activation readiness endpoint added yet.
- No activation trigger/evaluator added.
- No live DB migration applied.
- No user-facing activation status UI added.
