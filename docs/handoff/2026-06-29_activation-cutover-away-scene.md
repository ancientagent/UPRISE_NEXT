# Activation Cutover Away Scene Context

Date: 2026-06-29
Branch: fix/activation-cutover-away-scene
Agent: Codex

## Summary

Implemented the next activation cutover/source-origin hardening slice for manual city-tier Home Scene activation.

The manual activation trigger now:
- captures matching source IDs before re-anchoring source accounts to the newly active natural Home Scene;
- captures matching listener IDs and their previous `tunedSceneId` before cutover;
- saves distinct former proxy scenes as profile/collection Away Scene context;
- creates lightweight activation notices for affected listeners;
- updates listener `tunedSceneId` to the natural scene;
- writes a durable `CommunityActivationAudit` record with source IDs, listener IDs, thresholds, saved Away Scene count, and notice count;
- still does not move existing tracks, copy votes, transfer engagement history, or schedule activation jobs.

## Files Changed

- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/20260629120000_add_activation_cutover_context/migration.sql`
- `apps/api/src/admin-analytics/admin-analytics.service.ts`
- `apps/api/src/users/users.service.ts`
- `apps/api/test/admin-analytics.service.test.ts`
- `apps/api/test/users.profile.collection.test.ts`
- `apps/web/src/app/plot/page.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/system/registrar.md`
- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/CHANGELOG.md`

## Runtime Notes

New tables:
- `user_saved_scenes`: profile/collection Away Scene context, separate from signal collection shelves.
- `user_activation_notices`: lightweight listener cutover context.
- `community_activation_audits`: durable admin audit trail for manual activation cutover.

Profile read model:
- `GET /users/:id/profile` returns `savedAwayScenes` when collection visibility allows it.
- `GET /users/:id/profile` returns unread `activationNotices` only to the profile owner.

Plot UI:
- Expanded listener profile shows Home Scene activation notices.
- Saved former proxy scenes appear under Saved Uprises / Away Scenes.
- Home Scene Roller remains backed only by resolvable music-community preferences and does not include saved Away Scenes.

## Validation Run

- `pnpm --filter api run prisma:generate`
- `pnpm --filter api test -- admin-analytics.service.test.ts users.profile.collection.test.ts --runInBand`
- `pnpm --filter web test -- plot-ux-regression-lock.test.ts --runInBand`
- `pnpm --filter api run typecheck`
- `pnpm --filter web typecheck`
- `pnpm run verify`
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `git diff --check`

## Remaining Before Merge

- Open PR with required metadata.
- Because this slice adds a migration, deploy/smoke staging after merge before claiming complete runtime rollout.
