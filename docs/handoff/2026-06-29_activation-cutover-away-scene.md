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

## Staging Closeout

Merged PR: `#139`
Merge commit: `2c09d6f`
Fly app: `uprise-api-staging`
Fly image: `registry.fly.io/uprise-api-staging:deployment-01KW9ZXBRRQWKPW4189183Q8T0`

Post-merge staging steps completed:
- Deployed merged `main` to Fly API staging with `~/.fly/bin/flyctl deploy --config fly.api.staging.toml --app uprise-api-staging --remote-only --now`.
- Applied Prisma migration `20260629120000_add_activation_cutover_context` through the hosted migration runner.
- Verified `prisma migrate status --schema prisma/schema.prisma` reports the hosted Neon `uprise_staging` schema is up to date.
- Ran `UPRISE_API_URL=https://uprise-api-staging.fly.dev pnpm run smoke:staging:api`; `/health/live`, `/health/db`, `/health/postgis`, and `/health/ready` returned healthy.
- Ran `UPRISE_API_URL=https://uprise-api-staging.fly.dev UPRISE_WEB_URL=https://uprise-web-staging-git-main-ben-risemans-projects.vercel.app pnpm run smoke:staging:readiness`; API health, DB, PostGIS, CORS preflight, and Places behavior passed. The unauthenticated web load remains Vercel-auth protected as expected.
- Ran a read-only hosted Prisma schema smoke against the new models: `userSavedScene.count()`, `userActivationNotice.count()`, and `communityActivationAudit.count()` all executed successfully and returned `0` on staging before any activation event.

No seed, activation write, temporary user write, or provider secret mutation was performed during closeout.
