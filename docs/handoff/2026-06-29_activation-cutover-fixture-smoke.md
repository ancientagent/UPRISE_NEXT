# Activation Cutover Fixture Smoke

**Date:** 2026-06-29  
**Branch:** `test/activation-cutover-fixture-smoke`  
**Mode:** implementation slice, no provider/database write smoke run in this pass

## Summary

Added an API-owned activation cutover fixture smoke script that can create a synthetic ready source-origin tuple, call the real manual activation API endpoint, verify persisted cutover effects, and clean up all synthetic rows.

This closes the post-merge staging-readiness gap from the activation cutover work: read-only diagnostics were already verified, but there was no repeatable write smoke that could prove the full proxy-to-natural cutover path without relying on real staging artists/listeners being ready.

## Files Changed

- `apps/api/scripts/smoke-activation-cutover-fixture.mjs`
- `apps/api/package.json`
- `package.json`
- `docs/CHANGELOG.md`
- `docs/handoff/README.md`
- `docs/handoff/2026-06-29_activation-cutover-fixture-smoke.md`

## Smoke Contract

The script supports two modes:

- `pnpm --filter api run smoke:activation-cutover:dry-run`
  - no Prisma client creation
  - no API writes
  - no database writes
  - prints the fixture plan and non-local confirmation pattern

- `pnpm --filter api run smoke:activation-cutover`
  - creates temporary fixture rows
  - calls `POST /admin/analytics/activation-readiness/activate`
  - verifies persisted cutover effects
  - cleans up fixture rows in `finally`

Root aliases are also available:

- `pnpm run smoke:activation-cutover:dry-run`
- `pnpm run smoke:activation-cutover`

## Non-Local Safety

Non-local API targets require explicit host/database confirmation:

```bash
UPRISE_API_URL=https://uprise-api-staging.fly.dev \
DATABASE_URL='<confirmed staging database url>' \
JWT_SECRET='<same secret used by the API target>' \
UPRISE_CONFIRM_ACTIVATION_CUTOVER_SMOKE='activation-cutover:uprise-api-staging.fly.dev:uprise_staging' \
pnpm --filter api run smoke:activation-cutover
```

Do not run this against production. The script is for local and explicitly confirmed staging verification only.

## Fixture Shape

The write smoke creates:

- one temporary active proxy city-tier scene
- five temporary source accounts with source origin pointing at a synthetic natural `city + state + music community` tuple
- five ready tracks totaling `50` capped playable minutes (`10` minutes each)
- two listeners rooted in the proxy scene but submitted/registered to the synthetic natural tuple

The fixture meets the current activation threshold:

- at least `45` approved playable minutes
- at least `5` distinct registered source accounts
- no source contributes more than `15` minutes to readiness

## Verified Effects

When the full smoke runs, it verifies:

- activation readiness candidate exists before activation
- the real API activation endpoint succeeds
- a natural city-tier Home Scene is created or activated for the full tuple
- source accounts reanchor to the natural scene for future uploads
- listener `tunedSceneId` values reroot to the natural scene
- former proxy scenes are saved as profile Away Scenes
- activation notices are created unread for affected listeners
- `CommunityActivationAudit` records the scene, source/listener IDs, counts, and thresholds
- existing tracks remain attached to the former proxy scene and are not moved
- the activated tuple no longer appears as a readiness candidate afterward

## Validation

Run in this slice:

```bash
pnpm --filter api run smoke:activation-cutover:dry-run
```

Result: passed. The output confirmed `writesApi: false`, `writesDatabase: false`, and printed the synthetic fixture plan.

The full write smoke was not run in this pass because it requires a running API plus an explicitly confirmed database target. No provider, database, migration, or staging write operation was performed.

## Follow-Up Usage

Use this after deploying activation-cutover code when a real ready candidate is unavailable but the full write path needs verification.

Recommended staging sequence:

1. Confirm Fly API target and Neon database target.
2. Run `pnpm --filter api run smoke:activation-cutover:dry-run`.
3. Set the exact `UPRISE_CONFIRM_ACTIVATION_CUTOVER_SMOKE` value printed by the script.
4. Run the full smoke once.
5. Save the JSON output in a dated handoff.

## Boundaries

- This does not seed real launch communities.
- This does not create production artists or listener demand.
- This does not move existing proxy-scene tracks/votes/engagement/history.
- This does not replace provider-side staging checks.
- This should not be run against production.
