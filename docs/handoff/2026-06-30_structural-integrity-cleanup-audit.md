# Structural Integrity Cleanup Audit — 2026-06-30

Audit branch: `audit/structural-integrity-cleanup-plan-2026-06-30`  
Verified base: `7c04fc1`  
Mode: read-only audit of platform/runtime/provider state; docs-only audit output is allowed.

## 1. Branch / HEAD / Worktree State

Opening verification showed the Cloud Codex wrapper branch was `work` at `7c04fc1`; the user accepted that wrapper mismatch and authorized creating this audit branch from the verified base. No runtime, spec, test, migration, env, provider, or legacy-doc file was edited.

## 2. Executive Summary

UPRISE is mostly structurally sound for visual QA and a narrow Plot/neighborhood UI pass, but cleanup should precede deeper feature buildout. The active runtime has strong locks for the critical truths: `/plot` has exactly `Feed`, `Events`, and `Archive`; the Home Scene roller is consumed from the authenticated read model; Source Dashboard, listener profile, Artist Profile, Registrar, and Print Shop are separated; Fair Play voting now recognizes explicit registered music-community preferences; and activation cutover is source/music-driven.

The main risk is not a broken platform foundation. The risk is that newer agents can still see obsolete compatibility artifacts and deferred panels near the active code and infer they are valid extension points. The highest-risk examples are retained but unmounted Plot `StatisticsPanel` / `PlotPromotionsPanel`, legacy `pioneer` and `homeSceneTag` naming, a nearly 2,000-line `/plot` route doing many jobs, and broad tests that lock source-code strings rather than public behavior.

Final recommendation: **do visual QA first, then cleanup before major Plot/neighborhood buildout**. Do not rewrite; take small extraction/quarantine slices.

## 3. Top P0/P1 Cleanup Risks

### P0 — Retained stale Plot panels look like valid build targets

- Classification: `stale runtime`
- Severity: `P0`
- Evidence: `apps/web/src/components/plot/StatisticsPanel.tsx` still implements a full statistics/map explorer with live community/statistics/map calls, even though active Plot tabs are only `Feed`, `Events`, and `Archive`. `apps/web/src/components/plot/PlotPromotionsPanel.tsx` still implements a promotions read surface and calls promotions endpoints.
- Why it matters: tests intentionally assert these panels are not mounted from `/plot`, but their location under `components/plot` makes them easy for future agents to reuse as if `Statistics` or `Promotions` were deferred tabs rather than stale/deferred artifacts.
- Recommendation: quarantine under a clearly named deferred folder or add a local README/comment banner and tests that forbid importing them into active Plot until an owner spec reactivates them.

### P0 — `/plot/page.tsx` is oversized and mixes Home, player, profile, roller, Registrar, source context, and collection concerns

- Classification: `oversized/tangled file`
- Severity: `P0`
- Evidence: the file is 1,995 lines and imports Plot tabs, player, source switcher, Registrar clients, Discovery, community clients, and user preference clients in one route shell.
- Why it matters: the current behavior is mostly correct, but new UI agents will have to edit too much unrelated state to adjust the next Plot/neighborhood pass.
- Recommendation: extract read-model hooks and presentational sections without changing product behavior.

### P1 — Legacy `pioneer` naming is valid compatibility but dangerous product language

- Classification: `dangerous compatibility`
- Severity: `P1`
- Evidence: onboarding computes and returns `pioneer`, `pioneerHomeScene`, and `resolvedCitySceneId` as compatibility payloads while owner specs say activation is source/music-driven and listener demand does not create communities.
- Why it matters: tests and web state still use `pioneer` language, which can mislead agents into listener-side community creation or pioneer queues.
- Recommendation: keep API compatibility for now, but rename internal UI copy/test intent around proxy-assignment follow-up and document a removal plan.

### P1 — Preference/default compatibility is necessary, but `homeSceneCommunity` remains a shadow default

- Classification: `valid compatibility`
- Severity: `P1`
- Evidence: onboarding still writes `User.homeSceneCommunity` and creates/updates the explicit `UserMusicCommunityPreference` default in the same transaction.
- Why it matters: this is currently necessary while read paths migrate, but agents may keep reading the shadow field as product authority instead of the preference table/default resolver.
- Recommendation: do not remove yet. Gate cleanup behind read-path inversion and staging verification.

### P1 — Tests protect true product truths but often by string-matching implementation details

- Classification: `test locks stale implementation`
- Severity: `P1`
- Evidence: Plot tab and route UX lock tests read source files and assert strings such as absent `StatisticsPanel`, absent `PlotPromotionsPanel`, and exact link markup.
- Why it matters: these tests are useful drift guards, but they can block safe extraction or encourage agents to preserve file-local strings instead of behavior.
- Recommendation: keep high-level contract assertions, replace brittle string checks with component/API-level assertions where practical.

## 4. Confirmed-Good Areas That Should Not Be Rewritten

- Classification: `no issue / confirmed correct`
- Severity: `Info`
- Plot tab contract is correctly locked in runtime: the active tab tuple is `Feed`, `Events`, `Archive`.
- Home Scene roller behavior is structurally correct: it loads the authenticated roller read model, presents active/previous/next items, switches through Discover tuning, and does not use saved Away Scenes as roller items.
- Source Dashboard remains separate from listener profile and public Artist Profile. It uses the signed-in user only to select/manage a source context.
- Artist Profile is public/direct-listen and does not use the RADIYO engagement wheel.
- Activation readiness/cutover is directionally correct: source-origin approved playable music drives readiness, the manual admin trigger creates/activates the natural scene, reanchors sources for future uploads, reroots listeners, saves Away Scenes, creates notices, and writes an audit.
- Fair Play has a valid bridge for voting across registered music-community preferences in the current/default city/proxy context.
- Release Deck validation for the six-minute cap and active source requirement is valid and should not be loosened during UI cleanup.

## 5. Detailed Findings By Area

### Plot / Home / Profile / Player

1. **Active Plot tabs are correct.**
   - Classification: `no issue / confirmed correct`
   - Severity: `Info`
   - Evidence: `/plot` declares only `Feed`, `Events`, and `Archive`.
   - Action: preserve.

2. **Plot route is too large for next UI work.**
   - Classification: `oversized/tangled file`
   - Severity: `P0`
   - Evidence: `/plot/page.tsx` owns tab state, player state, roller state, collection/profile state, Registrar summary state, promoter entries, source switcher, broadcast fetches, profile fetches, preference mutations, drag interactions, and rendering.
   - Action: extract without behavior changes.

3. **Retained Statistics/Promotions components are stale/deferred but still discoverable.**
   - Classification: `stale runtime`
   - Severity: `P0`
   - Evidence: `StatisticsPanel` still performs live stats/map reads; `PlotPromotionsPanel` still performs promotions reads.
   - Action: quarantine/annotate as deferred and ensure no active import path.

4. **Home Scene roller is structurally correct.**
   - Classification: `no issue / confirmed correct`
   - Severity: `Info`
   - Evidence: `/plot` loads `getHomeSceneRoller`, derives active/previous/next items, and switches through `tuneDiscoverScene`.
   - Action: do not rewrite; extract after tests are adjusted.

### Onboarding / Home Scene / Preferences

1. **Onboarding correctly sets one default preference while preserving compatibility fields.**
   - Classification: `valid compatibility`
   - Severity: `P1`
   - Evidence: `setHomeScene` writes `homeSceneCity`, `homeSceneState`, `homeSceneCommunity`, `tunedSceneId`, and upserts `UserMusicCommunityPreference` with `isDefault: true`.
   - Action: keep until all read paths use the preference resolver/default table.

2. **`pioneer` language is compatibility debt.**
   - Classification: `dangerous compatibility`
   - Severity: `P1`
   - Evidence: inactive/exact-scene fallback is still named `pioneer` in API output and web tests.
   - Action: do not delete response fields yet; rename UI/test concepts around proxy assignment in a focused slice.

3. **GPS flow is coherent but relies on submitted-location verification for proxy scenes.**
   - Classification: `valid compatibility`
   - Severity: `P2`
   - Evidence: exact active scenes use geofence checks; inactive/proxy scenes verify submitted city/state via reverse geocode.
   - Action: preserve; add tests around city/state normalization and proxy voting scope before any schema cleanup.

### Fair Play / Broadcast

1. **Registered-preference voting support is valid.**
   - Classification: `no issue / confirmed correct`
   - Severity: `Info`
   - Evidence: voting scope checks require GPS, active city tier scene, registered music-community preference, and city/default/proxy resolution.
   - Action: preserve.

2. **National tier is normalized to state in broadcast resolution.**
   - Classification: `product decision needed`
   - Severity: `P2`
   - Evidence: `resolveBroadcastSceneForTier` maps `national` to `state`.
   - Action: do not remove without an owner-spec decision; this may be intentional MVP deferral but should be labeled clearly.

3. **Rotation constraints need continued runtime-test emphasis.**
   - Classification: `no issue / confirmed correct`
   - Severity: `Info`
   - Evidence: activation readiness and Release Deck caps are represented in runtime and tests; existing tracks remain in prior rotations after cutover.
   - Action: preserve.

### Activation Cutover / Community Lifecycle

1. **Manual source-driven activation path matches active specs.**
   - Classification: `no issue / confirmed correct`
   - Severity: `Info`
   - Evidence: admin analytics uses `45` minutes, `5` sources, and `15` minutes/source thresholds, then creates/activates the natural city-tier scene.
   - Action: do not rewrite; harden with targeted tests and operator docs.

2. **Operational trigger authority remains a future contract edge.**
   - Classification: `missing owner contract`
   - Severity: `P2`
   - Evidence: specs allow explicit admin trigger now and defer scheduler/automation policy.
   - Action: track before automation; not a blocker for UI QA.

### Source Dashboard / Artist Profile / Registrar / Print Shop

1. **Surface separation is mostly clean.**
   - Classification: `no issue / confirmed correct`
   - Severity: `Info`
   - Evidence: Source Dashboard fetches managed source context from `/users/:id/profile`, source context is chosen through `SourceAccountSwitcher`, and listener profile tests assert Release Deck/source controls are absent from expanded `/plot`.
   - Action: preserve.

2. **Source Dashboard and Print Shop are large source/admin shells but acceptable MVP stand-ins.**
   - Classification: `valid compatibility`
   - Severity: `P2`
   - Evidence: Source Dashboard and Print Shop are separate routes and continue to act as monorepo stand-ins for future separate source/admin tooling.
   - Action: do not split into a new app/domain during this cleanup; only extract local helpers if a file changes.

3. **Registrar service is oversized but boundary-correct.**
   - Classification: `oversized/tangled file`
   - Severity: `P1`
   - Evidence: `registrar.service.ts` is 2,104 lines and owns artist/band registration, promoter capability, project registration, sect-motion skeleton, invite delivery, and source-origin materialization checks.
   - Action: plan service extraction by workflow, but avoid changing behavior during UI cleanup.

4. **Sect-motion runtime is correctly skeletal/deferred.**
   - Classification: `deferred/quarantined correctly`
   - Severity: `Info`
   - Evidence: active specs say sect-motion filing/readback exists while readiness validation, approval, official affiliation records, update channels, and Sect Uprise activation remain deferred.
   - Action: preserve; do not expand without a Registrar/sect owner slice.

### Docs / Tests / Authority Drift

1. **Docs generally match runtime for current truths.**
   - Classification: `no issue / confirmed correct`
   - Severity: `Info`
   - Evidence: orientation, briefs, and owner specs consistently repeat the active Plot/Home Scene/Fair Play/activation boundaries.
   - Action: no broad doc rewrite.

2. **Some runtime support exists without active user-facing authorization.**
   - Classification: `stale runtime`
   - Severity: `P1`
   - Evidence: Plot promotions/statistics components and promotions clients exist while active Plot tabs reject those surfaces.
   - Action: quarantine rather than delete if APIs are still used by admin/source flows.

3. **Some tests lock stale names.**
   - Classification: `test locks stale implementation`
   - Severity: `P1`
   - Evidence: web tests still name `onboarding-pioneer-follow-up` and assert `pioneer` source strings.
   - Action: add compatibility comments and rename test descriptions where possible while preserving response compatibility.

## 6. Cleanup Roadmap

### Slice 1 — Quarantine stale Plot deferred panels

- Problem: `StatisticsPanel` and `PlotPromotionsPanel` are stale/deferred but live beside active Plot components.
- Files likely touched: `apps/web/src/components/plot/StatisticsPanel.tsx`, `apps/web/src/components/plot/PlotPromotionsPanel.tsx`, Plot tab tests, perhaps a new deferred README.
- Owner spec: `docs/specs/communities/plot-and-scene-plot.md`; companion `docs/specs/economy/print-shop-and-promotions.md` for promotions boundary.
- Risk: accidental deletion of APIs still used by admin/source paths.
- Tests to add/run: Plot tab contract tests, web unit tests around imports, `pnpm --filter @uprise/web test` if available.
- What not to touch: active `Feed`, `Events`, `Archive`, Print Shop route, economy specs.

### Slice 2 — Extract `/plot` read-model hooks and presentational sections

- Problem: `/plot/page.tsx` is too tangled for more UI work.
- Files likely touched: `apps/web/src/app/plot/page.tsx`, new `apps/web/src/components/plot/*` sections/hooks.
- Owner spec: `docs/specs/communities/plot-and-scene-plot.md`; `docs/specs/users/onboarding-home-scene-resolution.md` for roller/profile preferences.
- Risk: breaking current roller, player/profile pull-down, or tab restore behavior.
- Tests to add/run: existing Plot UX regression locks plus rendered component tests for roller/profile state.
- What not to touch: tab names, source tools, Fair Play API behavior.

### Slice 3 — Rename `pioneer` UI/test language while preserving API compatibility

- Problem: compatibility field names imply listener-driven activation.
- Files likely touched: web onboarding store/tests, API DTO comments/tests, onboarding follow-up copy.
- Owner spec: `docs/specs/users/onboarding-home-scene-resolution.md` and `docs/specs/communities/scenes-uprises-sects.md`.
- Risk: breaking existing clients that still read `pioneer`.
- Tests to add/run: onboarding API/web tests, proxy fallback tests.
- What not to touch: response fields until versioned removal is approved.

### Slice 4 — Invert preference/default read paths away from `homeSceneCommunity`

- Problem: `homeSceneCommunity` is still a shadow default preference.
- Files likely touched: API users/preference resolver, onboarding service, Fair Play service, Discover/community context clients, tests.
- Owner spec: `docs/specs/users/onboarding-home-scene-resolution.md#music-community-preference-contract`.
- Risk: corrupting default Home Scene resolution or voting scope.
- Tests to add/run: preference resolver tests, Fair Play voting tests, onboarding persistence smoke in dry-run/local mode.
- What not to touch: schema field removal until staging verification says it is safe.

### Slice 5 — Split Registrar service by workflow

- Problem: `registrar.service.ts` is structurally correct but too large.
- Files likely touched: registrar service internals and module providers only.
- Owner spec: `docs/specs/system/registrar.md`.
- Risk: source-origin/GPS materialization regressions.
- Tests to add/run: registrar controller/service tests, source context locks.
- What not to touch: public endpoint paths, sect-motion deferment, invite provider configuration.

## 7. Exact Commands Run

```bash
pwd && git branch --show-current && git rev-parse --short HEAD && git status --short && git remote -v
git switch -c audit/structural-integrity-cleanup-plan-2026-06-30
sed -n '1,220p' AGENTS.md
sed -n '1,220p' docs/PLATFORM_START_HERE.md
sed -n '1,220p' docs/AGENT_STRATEGY_AND_HANDOFF.md
sed -n '1,260p' docs/agent-briefs/CONTEXT_ROUTER.md
for f in docs/specs/system/documentation-framework.md docs/agent-briefs/UI_CURRENT.md docs/agent-briefs/ONBOARDING_HOME_SCENE.md docs/agent-briefs/ACTIONS_AND_SIGNALS.md docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md docs/agent-briefs/EVENTS_ARCHIVE.md docs/specs/users/onboarding-home-scene-resolution.md docs/specs/communities/plot-and-scene-plot.md docs/specs/broadcast/radiyo-and-fair-play.md docs/specs/system/registrar.md docs/specs/communities/scenes-uprises-sects.md; do sed -n '1,240p' "$f"; done
find apps/web/src/components/plot -maxdepth 1 -type f -print | sort
find apps/web/src/app/source-dashboard -maxdepth 3 -type f -print | sort
find apps/web/src/app/print-shop -maxdepth 3 -type f -print | sort
find apps/api/src/onboarding apps/api/src/fair-play apps/api/src/admin-analytics apps/api/src/registrar apps/api/src/tracks -maxdepth 3 -type f -print | sort
sed -n '1,260p' apps/web/src/app/plot/page.tsx
sed -n '1,240p' apps/web/src/components/plot/SeedFeedPanel.tsx
sed -n '1,220p' apps/web/src/components/plot/StatisticsPanel.tsx
sed -n '1,160p' apps/web/src/components/plot/PlotPromotionsPanel.tsx
sed -n '1,260p' apps/api/src/onboarding/onboarding.service.ts
sed -n '260,620p' apps/web/src/app/plot/page.tsx
sed -n '260,620p' apps/api/src/onboarding/onboarding.service.ts
sed -n '1,260p' apps/api/src/fair-play/fair-play.service.ts
sed -n '1,260p' apps/api/src/admin-analytics/admin-analytics.service.ts
sed -n '1,260p' apps/web/src/app/artist-bands/[id]/page.tsx
sed -n '1,260p' apps/web/src/app/source-dashboard/page.tsx
sed -n '1,220p' apps/web/src/app/source-dashboard/release-deck/page.tsx
sed -n '1,220p' apps/web/src/app/print-shop/page.tsx
rg -n "PlotPromotionsPanel|StatisticsPanel|Promotions|Statistics|pioneer|homeSceneTag|Release Deck|15|6 minute|sect" apps/web/__tests__ apps/api/test apps/api/src apps/web/src/app/plot/page.tsx apps/web/src/app/artist-bands/[id]/page.tsx apps/web/src/app/source-dashboard apps/web/src/app/print-shop -g '!**/node_modules/**'
wc -l apps/web/src/app/plot/page.tsx apps/api/src/registrar/registrar.service.ts apps/api/src/admin-analytics/admin-analytics.service.ts apps/api/src/fair-play/fair-play.service.ts apps/api/src/onboarding/onboarding.service.ts apps/web/src/app/source-dashboard/release-deck/page.tsx apps/web/src/app/artist-bands/[id]/page.tsx apps/web/src/app/print-shop/page.tsx
```

## 8. Tests Not Run / Limitations

- No runtime tests were run during the read-only audit phase.
- No provider, env, database, migration, seed, deploy, browser automation, or live API checks were run.
- Validation after writing this docs-only audit is limited to `pnpm run docs:lint` and `git diff --check`.

## 9. Final Recommendation

Proceed with **visual QA first, then cleanup**. The platform is not fundamentally broken, and current critical contracts are represented in runtime and tests. However, before major Plot/neighborhood UI buildout, complete Slice 1 and Slice 2 so stale/deferred panels and the oversized `/plot` file do not become the foundation for the next design pass.
