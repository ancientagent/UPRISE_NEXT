# Activation Listener Cutover

Date: 2026-06-25
Branch: docs/abacus-fusion-swarm-strategy
Slice: Community activation proxy lifecycle - Slice 5

## Summary

Extended the manual activation trigger so source-driven natural Home Scene activation also re-roots matching listeners to the newly active natural scene.

Runtime behavior added:

- after a readiness-proven tuple is manually activated, matching users with the same submitted/default `homeSceneCity`, `homeSceneState`, and `homeSceneCommunity` are updated to `User.tunedSceneId = activatedScene.id`
- `tunedSceneUpdatedAt` is refreshed for those users
- the response includes `cutoverListenerCount`
- matching sources continue to be re-anchored through `ArtistBand.homeSceneId` for future uploads
- existing proxy-scene tracks, votes, engagement history, and rotation entries remain untouched

This makes the activation event the deterministic cutover point, instead of overriding ordinary Away Scene listening every time discovery context is read.

## Files Changed

- `apps/api/src/admin-analytics/admin-analytics.service.ts`
- `apps/api/test/admin-analytics.service.test.ts`
- `docs/specs/admin/super-admin-controls.md`
- `docs/specs/system/registrar.md`
- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/system/documentation-framework.md`
- `docs/solutions/COMMUNITY_ACTIVATION_PROXY_LIFECYCLE_STRATEGY_R1.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-06-25_activation-listener-cutover.md`

## Behavior Locked

- Cutover is source/music-driven and occurs only after the manual activation trigger passes readiness checks.
- Matching listeners are rooted in the newly active natural Home Scene for Home/Plot resolution.
- Existing proxy scene can still be treated as historical/Away context by future profile/collection work, but this slice does not create a saved Away Scene model.
- Existing tracks remain in their prior active scene until their normal lifecycle ends.
- Votes and engagement history remain with the scene/tier where they occurred.
- No notifications, scheduler, audit log, live DB run, migration, or UI surface was added.

## TDD Evidence

RED:

```bash
pnpm --filter api test -- admin-analytics.service.test.ts --runInBand
```

Failed because `activateReadyCommunity` did not call `prisma.user.updateMany` and did not return `cutoverListenerCount`.

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

- No user-facing notification copy or delivery path.
- No saved Away Scene/profile preservation for the former proxy scene.
- No web admin activation UI.
- No scheduled/automatic activation evaluator.
- No audit log model or RBAC role enforcement.

## Next Slice

Either:

1. define and implement minimal activation notification/Away Scene preservation, or
2. move to Release Deck eligibility contract/enforcement if notification storage/UX needs a separate product decision.
