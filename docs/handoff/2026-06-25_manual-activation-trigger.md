# Manual Activation Trigger

Date: 2026-06-25
Branch: docs/abacus-fusion-swarm-strategy
Slice: Community activation proxy lifecycle - Slice 4

## Summary

Implemented the first activation trigger execution path as an authenticated manual admin primitive:

- `POST /admin/analytics/activation-readiness/activate`
- accepts `{ city, state, musicCommunity }`
- reuses the existing source-origin activation readiness diagnostics
- refuses activation unless the tuple meets the locked thresholds:
  - at least `45` minutes approved playable music
  - at least `5` distinct registered source accounts
  - max `20` minutes counted per source
- creates the natural city-tier `Community` when no matching row exists
- marks an existing inactive matching city-tier `Community` active when present
- re-anchors matching `ArtistBand.homeSceneId` to the activated natural scene for future uploads

This is intentionally not scheduled automation. It is an admin-gated MVP trigger so the activation path can be exercised without allowing listener demand, missing-community requests, or passive metadata to create communities.

## Files Changed

- `apps/api/src/admin-analytics/admin-analytics.controller.ts`
- `apps/api/src/admin-analytics/admin-analytics.service.ts`
- `apps/api/test/admin-analytics.controller.test.ts`
- `apps/api/test/admin-analytics.service.test.ts`
- `docs/specs/admin/super-admin-controls.md`
- `docs/specs/system/registrar.md`
- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/system/documentation-framework.md`
- `docs/solutions/COMMUNITY_ACTIVATION_PROXY_LIFECYCLE_STRATEGY_R1.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-06-25_manual-activation-trigger.md`

## Behavior Locked

- Activation is source/music-driven, not listener-demand-driven.
- The endpoint only acts on readiness-proven source-origin tuples.
- Missing natural scenes can be created at activation time; inactive natural scenes are activated in place.
- Matching source accounts are re-anchored for future uploads through `ArtistBand.homeSceneId`.
- Existing `Track` rows are not moved.
- Existing proxy-scene votes, engagement history, and rotation placement are not transferred.
- No scheduler, cron, queue, notification, web UI, RBAC role system, audit log model, or live DB action was added.

## TDD Evidence

RED:

```bash
pnpm --filter api test -- admin-analytics.service.test.ts --runInBand
```

Failed because `service.activateReadyCommunity` did not exist.

```bash
pnpm --filter api test -- admin-analytics.controller.test.ts --runInBand
```

Failed because `controller.activateReadyCommunity` did not exist.

GREEN:

```bash
pnpm --filter api test -- admin-analytics.controller.test.ts admin-analytics.service.test.ts --runInBand
```

Passed after implementation.

## Validation

Run before handoff completion:

```bash
pnpm --filter api test -- admin-analytics.controller.test.ts admin-analytics.service.test.ts --runInBand
pnpm --filter api typecheck
pnpm run docs:lint
git diff --check
```

## Not Done

- No scheduled/automatic activation evaluator.
- No listener/source notification delivery.
- No web admin activation button.
- No full listener preference/profile cutover orchestration.
- No migration or dedicated activation audit log.
- No movement of existing proxy-scene songs, votes, engagement history, or rotation entries.

## Next Slice

Slice 5 should define and implement the minimal listener/source notification and cutover orchestration path after manual activation. It should preserve the locked rule that existing proxy-scene songs finish their current lifecycle where they already are.
