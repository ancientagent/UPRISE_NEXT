# 2026-06-29 Launch Readiness Verification

## Status

Branch: `chore/launch-readiness-verification-2026-06-29`
Base: `main` at `477a3ff`

Runtime changed: yes, narrowly in onboarding state normalization
Provider state changed: no
Database writes run: no
Deploys run: no
Secrets read or changed: no

## Summary

This pass verified the current Vercel/Fly/Neon staging path across the launch-readiness list and fixed one live onboarding bug found by browser QA.

Confirmed current staging truth:

- Google Places-backed reverse geocode and city autocomplete are working on Fly staging.
- Neon staging contains the expected `48` active, geofenced city-tier launch communities with no duplicate city/music-community tuples.
- Focused API and web contract tests pass for activation diagnostics, onboarding resolution, Source Dashboard, Release Deck, Print Shop, Fair Play voting, and Artist Profile.
- Media remains URL-only for MVP; storage/transcoding/worker deployment are still deferred by the active media decision packet.

New blocker found:

- Staging DB has not applied the `user_music_community_preferences` migration, so the read-only music-community preference verifier cannot run successfully against staging yet.

Live bug found and fixed in this branch:

- The staging onboarding review treated `Austin, TX • Punk` as a proxy/pioneer scene even though `Austin, Texas • Punk` is active. Google reverse geocode returns `TX`, while launch tuples use full state names. This branch normalizes U.S. state abbreviations to full state names in the web onboarding review path and API `setHomeScene`/missing-community intake path.

## Verification Matrix

| Item | Result | Evidence |
| --- | --- | --- |
| 1. Neon read-only DB verification | Passed with preference blocker | Launch communities: `expected=48`, `matched=48`, `missing=0`, `active=48`, `geofenced=48`, `radius_ok=48`, `coordinate_ok=48`; duplicate tuple query returned no rows. Preference table `user_music_community_preferences` is absent in staging. |
| 2. Google Places smoke | Passed | `/places/reverse?latitude=30.2672&longitude=-97.7431&country=US` returned `Austin`, `TX`; `/places/cities?input=Austin&country=us` returned 5 suggestions with Google place IDs. |
| 3. Browser onboarding QA | Passed with bug found/fixed | Signed-out staging browser flow loaded `/onboarding`, denied GPS, accepted manual city/state/ZIP/community, disabled missing-community request while signed out, and reached review without persistence. `TX` incorrectly showed proxy/pioneer; `Texas` correctly showed active Listening scene. Fixed in branch; requires deploy verification. |
| 4. Activation readiness hardening | Local contracts passed | `admin-analytics.service.test.ts` and `admin-analytics.controller.test.ts` passed. Runtime remains manual/admin-gated per existing activation docs. |
| 5. Media path decision | Confirmed deferred | `docs/solutions/MEDIA_STORAGE_DECISION_PACKET_R1.md` remains current: Release Deck is URL-only MVP; real upload/storage/transcoding/waveform/worker runtime deferred. |
| 6. Source Dashboard QA | Local contracts passed | Source Dashboard, source account context, Release Deck validation/shell, and Print Shop client tests passed. |
| 7. Fair Play / voting end-to-end | Local contracts passed | `fair-play.vote.test.ts` and onboarding resolution tests passed, including fallback voting authority coverage. |
| 8. Public Artist Profile decision/check | Local contracts passed | `artist-bands.service.test.ts`, `community-artist-page-lock.test.ts`, and `artist-band-client.test.ts` passed. Public read contract remains implemented. |
| 9. Staging runbook cleanup | Completed in this branch | This handoff plus deploy matrix/changelog/handoff index updates record current staging truth and remaining blockers. |

## Code Fix

Files changed:

- `apps/web/src/data/us-states.ts`
- `apps/web/src/lib/onboarding/review-resolution.ts`
- `apps/web/src/app/onboarding/page.tsx`
- `apps/web/__tests__/onboarding-review-resolution.test.ts`
- `apps/api/src/onboarding/onboarding.service.ts`
- `apps/api/test/onboarding.home-scene-resolution.test.ts`

Behavior:

- Web onboarding normalizes state abbreviations before review-scene lookup and submitted selection persistence.
- API onboarding normalizes state abbreviations before exact `Community` lookup, `User.homeSceneState` persistence, `pioneerHomeScene`, and missing-community intake storage.
- Regression coverage proves `Austin + TX + Punk` resolves as exact active `Austin, Texas • Punk`, not proxy/pioneer.

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

Focused tests:

```bash
pnpm --filter web test -- onboarding-review-resolution.test.ts
pnpm --filter api test -- onboarding.home-scene-resolution.test.ts
pnpm --filter api test -- admin-analytics.service.test.ts admin-analytics.controller.test.ts fair-play.vote.test.ts onboarding.home-scene-resolution.test.ts artist-bands.service.test.ts events.print-shop.service.test.ts
pnpm --filter web test -- source-dashboard-shell-lock.test.ts source-account-context.test.ts source-account-switcher-lock.test.ts release-deck-validation.test.ts release-deck-shell-lock.test.ts print-shop-client.test.ts onboarding-review-resolution.test.ts onboarding-page-lock.test.ts onboarding-regression-lock.test.ts onboarding-pioneer-follow-up.test.ts community-artist-page-lock.test.ts artist-band-client.test.ts
```

Results:

- API focused suite: 6 suites passed, 46 tests passed.
- Web focused suite: 12 suites passed, 27 tests passed.

## Remaining Blockers / Next Actions

1. Apply staging migrations before claiming music-community preference data readiness. The local migration `apps/api/prisma/migrations/20260625150000_add_user_music_community_preferences/migration.sql` exists, but staging Neon currently lacks `user_music_community_preferences`.
2. Deploy this branch before re-running the browser onboarding QA on staging. The live staging URL still has the `TX` proxy/pioneer bug until deployment.
3. Re-run a browser onboarding review after deploy with both GPS-derived `TX` and manual `TX` to confirm Austin Punk remains exact active.
4. Keep media upload/storage/transcoding out of launch readiness until the media path is explicitly activated.
