# 2026-06-29 Launch Readiness Verification

## Status

Branch: `chore/launch-readiness-verification-2026-06-29`
Base: `main` at `477a3ff`
Post-deploy closeout: `main` at `6c4534b`

Runtime changed: yes, narrowly in onboarding state normalization
Provider state changed: yes, Fly API staging and Vercel web staging deployed from merged `main`
Database writes run: yes, staging Neon migration `20260625150000_add_user_music_community_preferences` applied
Deploys run: yes
Secrets read or changed: no

## Summary

This pass verified the current Vercel/Fly/Neon staging path across the launch-readiness list, fixed one live onboarding bug found by browser QA, restored the Fly API after a Fair Play dependency-injection crash surfaced during deploy, applied the pending staging preference migration, and re-ran stable staging browser QA successfully.

Confirmed current staging truth:

- Google Places-backed reverse geocode and city autocomplete are working on Fly staging.
- Neon staging contains the expected `48` active, geofenced city-tier launch communities with no duplicate city/music-community tuples.
- Focused API and web contract tests pass for activation diagnostics, onboarding resolution, Source Dashboard, Release Deck, Print Shop, Fair Play voting, and Artist Profile.
- Stable Vercel staging is deployed from `main` commit `6c4534b`.
- Fly API staging is healthy on image `deployment-01KW99A3ANNA4QFRXA64ZE8W18`.
- Neon staging now has the `user_music_community_preferences` table and matching Prisma migration record.
- Signed-out browser onboarding QA passes for manual `Austin / TX / 78701 / Punk` with GPS denied; review displays `Austin, Texas • Punk`, `Submitted location: Austin, Texas 78701`, and `Listening scene` rather than proxy.
- Media remains URL-only for MVP; storage/transcoding/worker deployment are still deferred by the active media decision packet.

Resolved blocker:

- Staging DB previously lacked the `user_music_community_preferences` migration. It was applied through the Neon MCP against project `misty-fire-63832725`, branch `br-lucky-water-atjlgbjo`, database `uprise_staging`, because the Fly production image does not package the Prisma CLI.

Live bugs found and fixed:

- The staging onboarding review treated `Austin, TX • Punk` as a proxy/pioneer scene even though `Austin, Texas • Punk` is active. Google reverse geocode returns `TX`, while launch tuples use full state names. This branch normalizes U.S. state abbreviations to full state names in the web onboarding review path and API `setHomeScene`/missing-community intake path.
- Deploying merged `main` initially crash-looped the API because `FairPlayService` emitted Nest dependency metadata as `Object` for `MusicCommunityPreferenceResolverService`. PR #128 fixed the DI wiring and added a `FairPlayModule` regression test.

## Verification Matrix

| Item | Result | Evidence |
| --- | --- | --- |
| 1. Neon DB verification | Passed | Launch communities: `expected=48`, `matched=48`, `missing=0`, `active=48`, `geofenced=48`, `radius_ok=48`, `coordinate_ok=48`; duplicate tuple query returned no rows. Preference table `user_music_community_preferences` now exists, and `_prisma_migrations` has exactly one record for `20260625150000_add_user_music_community_preferences` with checksum `b113438d394b42128afc82a2e362e478d6e61d3dbad5222ffc959c02b0648c4e`. |
| 2. Google Places smoke | Passed | `/places/reverse?latitude=30.2672&longitude=-97.7431&country=US` returned `Austin`, `TX`; `/places/cities?input=Austin&country=us` returned 5 suggestions with Google place IDs. |
| 3. Browser onboarding QA | Passed after deploy | Stable staging `/onboarding` on Vercel commit `6c4534b` loaded signed out, denied GPS, accepted `Austin / TX / 78701 / Punk`, kept missing-community request disabled while signed out, and reached review with `Home Scene: Austin, Texas • Punk`, `Submitted location: Austin, Texas 78701`, `Listening scene: Austin, Texas • Punk`, `Voting Eligibility: Not enabled`, `Skipped GPS`. |
| 4. Activation readiness hardening | Local contracts passed | `admin-analytics.service.test.ts` and `admin-analytics.controller.test.ts` passed. Runtime remains manual/admin-gated per existing activation docs. |
| 5. Media path decision | Confirmed deferred | `docs/solutions/MEDIA_STORAGE_DECISION_PACKET_R1.md` remains current: Release Deck is URL-only MVP; real upload/storage/transcoding/waveform/worker runtime deferred. |
| 6. Source Dashboard QA | Local contracts passed | Source Dashboard, source account context, Release Deck validation/shell, and Print Shop client tests passed. |
| 7. Fair Play / voting end-to-end | Local contracts passed | `fair-play.vote.test.ts` and onboarding resolution tests passed, including fallback voting authority coverage. |
| 8. Public Artist Profile decision/check | Local contracts passed | `artist-bands.service.test.ts`, `community-artist-page-lock.test.ts`, and `artist-band-client.test.ts` passed. Public read contract remains implemented. |
| 9. Staging runbook cleanup | Completed in follow-up docs branch | This handoff plus deploy matrix/changelog/handoff index updates record current staging truth after PR #127 and PR #128 merged. |

## Code Fix

Files changed:

- `apps/web/src/data/us-states.ts`
- `apps/web/src/lib/onboarding/review-resolution.ts`
- `apps/web/src/app/onboarding/page.tsx`
- `apps/web/__tests__/onboarding-review-resolution.test.ts`
- `apps/api/src/onboarding/onboarding.service.ts`
- `apps/api/test/onboarding.home-scene-resolution.test.ts`
- `apps/api/src/fair-play/fair-play.service.ts`
- `apps/api/test/fair-play.module.test.ts`

Behavior:

- Web onboarding normalizes state abbreviations before review-scene lookup and submitted selection persistence.
- API onboarding normalizes state abbreviations before exact `Community` lookup, `User.homeSceneState` persistence, `pioneerHomeScene`, and missing-community intake storage.
- Regression coverage proves `Austin + TX + Punk` resolves as exact active `Austin, Texas • Punk`, not proxy/pioneer.
- Fair Play module regression coverage proves Nest can resolve the preference resolver dependency through module wiring.

## Commands Run

Read-only provider/API checks:

```bash
node - <<'NODE'
const checks = [
  ['reverse', 'https://uprise-api-staging.fly.dev/places/reverse?latitude=30.2672&longitude=-97.7431&country=US'],
  ['cities', 'https://uprise-api-staging.fly.dev/places/cities?input=Austin&country=us'],
];
for (const [name, url] of checks) {
  const res = await fetch(url);
  const body = await res.json();
  console.log(JSON.stringify({ name, status: res.status, ok: res.ok, body }, null, 2));
}
NODE
```

Browser QA:

```bash
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh open https://uprise-web-staging.vercel.app/onboarding
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh snapshot
# Denied GPS, filled Austin/TX/78701/Punk, continued to review.
# Edited state to Texas and repeated review.
```

Post-deploy browser QA:

```bash
PLAYWRIGHT_CLI_SESSION=uprise-staging-onboarding-final bash ~/.codex/skills/playwright/scripts/playwright_cli.sh open https://uprise-web-staging.vercel.app/onboarding
PLAYWRIGHT_CLI_SESSION=uprise-staging-onboarding-final bash ~/.codex/skills/playwright/scripts/playwright_cli.sh click e21
PLAYWRIGHT_CLI_SESSION=uprise-staging-onboarding-final bash ~/.codex/skills/playwright/scripts/playwright_cli.sh fill e25 Austin
PLAYWRIGHT_CLI_SESSION=uprise-staging-onboarding-final bash ~/.codex/skills/playwright/scripts/playwright_cli.sh fill e28 TX
PLAYWRIGHT_CLI_SESSION=uprise-staging-onboarding-final bash ~/.codex/skills/playwright/scripts/playwright_cli.sh fill e31 78701
PLAYWRIGHT_CLI_SESSION=uprise-staging-onboarding-final bash ~/.codex/skills/playwright/scripts/playwright_cli.sh select e35 Punk
PLAYWRIGHT_CLI_SESSION=uprise-staging-onboarding-final bash ~/.codex/skills/playwright/scripts/playwright_cli.sh click e50
PLAYWRIGHT_CLI_SESSION=uprise-staging-onboarding-final bash ~/.codex/skills/playwright/scripts/playwright_cli.sh snapshot
```

Post-deploy staging smoke:

```bash
UPRISE_API_URL=https://uprise-api-staging.fly.dev pnpm run smoke:staging:api
UPRISE_API_URL=https://uprise-api-staging.fly.dev \
  UPRISE_WEB_URL=https://uprise-web-staging.vercel.app \
  UPRISE_EXPECTED_CORS_ORIGIN=https://uprise-web-staging.vercel.app \
  pnpm run smoke:staging:readiness
```

Focused tests:

```bash
pnpm --filter web test -- onboarding-review-resolution.test.ts
pnpm --filter api test -- onboarding.home-scene-resolution.test.ts
pnpm --filter api test -- admin-analytics.service.test.ts admin-analytics.controller.test.ts fair-play.vote.test.ts onboarding.home-scene-resolution.test.ts artist-bands.service.test.ts events.print-shop.service.test.ts
pnpm --filter web test -- source-dashboard-shell-lock.test.ts source-account-context.test.ts source-account-switcher-lock.test.ts release-deck-validation.test.ts release-deck-shell-lock.test.ts print-shop-client.test.ts onboarding-review-resolution.test.ts onboarding-page-lock.test.ts onboarding-regression-lock.test.ts onboarding-pioneer-follow-up.test.ts community-artist-page-lock.test.ts artist-band-client.test.ts
pnpm --filter api test -- fair-play.module.test.ts fair-play.vote.test.ts --runInBand
pnpm --filter api typecheck
pnpm --filter api build
pnpm --filter web typecheck
pnpm run verify
```

Results:

- API focused suite: 6 suites passed, 46 tests passed.
- Web focused suite: 12 suites passed, 27 tests passed.

## Remaining Blockers / Next Actions

1. Keep media upload/storage/transcoding out of launch readiness until the media path is explicitly activated.
2. Add a repeatable hosted migration command/path before the next schema change. Current Fly production package does not include Prisma CLI, so this migration was applied through Neon MCP with an explicit Prisma migration metadata record.
3. If authenticated browser onboarding persistence must be claimed on staging, run it with a controlled staging user/token. The signed-out browser QA verifies the current web review path only.
