# 2026-03-24 — Session context reconciliation

## Purpose

Capture the platform facts re-established during the current multi-agent discussion so they do not remain trapped in chat state or partial memory. This note is a reconciliation artifact, not a new product-definition source. Canon/spec/founder-lock precedence still applies.

## What this discussion re-established

### 1. Community identity is structural, not loose copy
- Communities/Uprises are identified by `city + state + music community`.
- Agents must not collapse identity to city-only or genre-only.
- If a flow already knows the current community context, it should inherit the music community from that context rather than asking the user to redefine it.
- This rule already existed in deeper specs and is now also elevated into top-level agent guidance.

Primary sources:
- `AGENTS.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`

### 2. Parent music communities are launch-ready and preloaded
- The repo confirms a launch-ready parent music-community list.
- The current seed file is `docs/specs/seed/music-communities.json`.
- This is a parent-community list, not a city roster.

Supporting sources:
- `docs/specs/seed/music-communities.json`
- `docs/specs/seed/README.md`
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Legacy Narrative plus Context .md`

### 3. Onboarding fallback behavior is already canon/spec
- If a selected city-tier scene is inactive or unavailable, onboarding must route the user to the nearest active city-tier scene for the selected parent/music community.
- The user's original selected `city + state + music community` must be preserved as pioneer intent.
- Pioneer messaging must be shown after the user is loaded into Home Scene context.

Primary sources:
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/canon/Master Narrative Canon.md`
- `docs/handoff/2026-03-02_onboarding-nearest-active-canon-lock.md`

### 4. Hotspot-city prepopulation is remembered in canon, but the actual city list is missing
- Canon/legacy-canon text confirms the concept that major hotspot cities will be identified and pre-populate in beta.
- The repo does not currently preserve a concrete hotspot-city or launch-city matrix.
- The active repo therefore preserves the fallback rule, but not the actual named fallback-city inventory.

Supporting source:
- `docs/canon/Legacy Narrative plus Context .md`

## Discover-specific truths carried forward from this discussion

### 5. Discover inherits community context
- Discover travel starts from the community the user is already in.
- Geography changes; origin community context remains fixed.
- When Discover is reached from a valid Home Scene or tuned scene, the music community is inherited from that context.
- Discover should not ask the user to redefine both location and community when that context already exists.

Primary source:
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`

### 6. Current-community Discover should not require retune when community context is already valid
- The current-community section is supposed to expose local artist/song search plus Recommendations, Trending, and Top Artists once the user is in a real community Discover context.
- This became a live bug because unsigned onboarding preserved the Home Scene tuple without a resolved city-scene id, leaving current-community Discover gated on `activeSceneId`.
- That gap is now closed on current `feat/ux-founder-locks-and-harness` HEAD for the valid-Home-Scene-tuple path: `/discover` resolves the tuple to a city-scene id and unlocks local artist/song search plus Recommendations, Trending, and Top Artists even without auth storage.

Primary sources:
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_WEB_UX_IMPLEMENTATION_BRIEF_R1.md`
- current branch work on `apps/web/src/app/discover/page.tsx`

### 7. Discover core is already largely implemented and verified
Before the current current-community unlock bug, this branch had already closed:
- travel hydration in authenticated fixture flows
- retune flow
- `Visit [Community Name]`
- artist-link handoff
- song-link handoff
- artist-page autoplay handoff
- Recommendations / Trending / Top Artists population with fixture data
- runtime `POST /tracks` so song verification no longer depends on direct DB inserts

Supporting handoffs:
- `docs/handoff/2026-03-23_discover-contracts-and-surface-implementation.md`
- `docs/handoff/2026-03-23_discover-artist-destination-slice.md`
- `docs/handoff/2026-03-23_discover-verification-and-runtime-cleanup.md`
- `docs/handoff/2026-03-23_runtime-track-create-path.md`

### 7a. Local Discover travel was re-verified as a runtime/setup problem, not an unresolved shell failure
- On-host verification no longer reproduces the earlier `Failed to fetch` symptom for `/discover`.
- The current web client uses `NEXT_PUBLIC_API_URL || 'http://localhost:4000'`.
- Current API defaults allow both `http://localhost:3000` and `http://127.0.0.1:3000` in dev CORS.
- Earlier harness failures are most credibly explained by browser/container origin mismatch rather than the current Discover route shell alone.

Primary sources:
- `apps/web/src/lib/api.ts`
- `apps/api/src/main.ts`
- `docs/handoff/2026-03-23_discover-public-read-runtime-fix.md`
- `docs/handoff/2026-03-22_openai-computer-use-browser-harness.md`

### 7b. The local database is empty by default; community rows come from runtime onboarding, not a working seed path
- Current local dev state does not include a working repo seed implementation that prepopulates `community` rows.
- The repo still documents `pnpm prisma db seed`, but the active API package does not define a Prisma seed entrypoint.
- `community` rows are created through authenticated onboarding when `POST /onboarding/home-scene` resolves or creates the selected city-tier community.

Primary sources:
- `apps/api/prisma/schema.prisma`
- `apps/api/package.json`
- `docs/canon/Operational Getting Started.md`
- `apps/api/src/onboarding/onboarding.controller.ts`
- `apps/api/src/onboarding/onboarding.service.ts`

### 7c. The minimum reproducible signed-in Discover QA path already exists through runtime/API flows
- A valid local signed-in path exists through `POST /auth/register` and `POST /auth/login`.
- A valid Home Scene can be established without DB editing through `POST /onboarding/home-scene`.
- Discovery context falls back from tuned scene to Home Scene, so tuned-scene setup is optional for minimum Discover QA.
- There is no confirmed web-first login/register route in `apps/web/src/app`; the reliable setup path remains API-first.

Primary sources:
- `apps/api/src/auth/auth.controller.ts`
- `apps/api/src/onboarding/onboarding.controller.ts`
- `apps/api/src/communities/communities.service.ts`
- `apps/web/src/store/auth.ts`
- `apps/web/src/store/onboarding.ts`

### 7d. Discover content setup is mixed-path: runtime for artists/follows/signals, runtime `POST /tracks` for songs
- Artist-band creation exists through the registrar runtime flow after Home Scene and GPS verification.
- Follow counts and scene-scoped signals/actions are created through existing runtime endpoints and are sufficient to populate `Top Artists`, `Recommendations`, and `Trending`.
- The branch also now ships authenticated runtime `POST /tracks`, so local song Discover no longer depends on direct DB insertion when current HEAD includes that route.
- Song-to-artist handoff still depends on creating a track that matches an artist-band in the same scene.

Primary sources:
- `apps/api/src/registrar/registrar.controller.ts`
- `apps/api/src/registrar/registrar.service.ts`
- `apps/api/src/signals/signals.controller.ts`
- `apps/api/src/signals/signals.service.ts`
- `apps/api/src/tracks/tracks.controller.ts`
- `apps/api/src/communities/communities.service.ts`

### 7e. Non-Discover runtime regressions were also re-verified during this session
- `/onboarding`, `/plot`, `/registrar`, `/users/[id]`, and `/community/[id]` are all reachable on the current branch.
- `/plot`, `/users/[id]`, and `/community/[id]` present clear signed-out or unresolved terminal states instead of fetch crashes.
- Earlier session QA did surface `/registrar` signed-out-state drift and a missing favicon asset, but those are not safe carry-forward defects now because the branch has since fixed both states.

Primary sources:
- `apps/web/src/app/registrar/page.tsx`
- `apps/web/src/app/favicon.ico`
- live browser verification on branch `feat/ux-founder-locks-and-harness`

## Artist/profile truths carried forward

### 8. Artist page lock is already established
- Familiar mainstream profile-page structure.
- Core actions: `Follow`, `Add`, `Blast`, `Support`.
- Artist-link entry should not interrupt RaDIYo.
- Song/signal link entry routes to the artist page and auto-plays the selected single.

Primary source:
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`

## Why agents diverged in this session

### 9. The main failure mode was partial context, not contradictory platform direction
Agents diverged because:
- some facts were only preserved in deeper canon/specs
- some facts were preserved in founder locks or dated handoffs rather than top-level docs
- some runtime truths were discovered during QA and not yet merged back into a single reconciliation artifact
- the actual hotspot-city inventory appears to be missing from active repo materials, even though the hotspot-city concept exists

This means the problem was not primarily conflicting product truth. It was fragmented carry-forward.

## What is still missing after this reconciliation

### 10. The repo still lacks an authoritative hotspot/launch city inventory
Still missing from active repo:
- concrete list of hotspot cities expected to pre-populate
- explicit `city + state + music community` launch matrix for fallback routing or beta preload
- deterministic source for unsigned onboarding/discover fallback when a selected city scene is not active and no user-specific tuned scene exists yet

### 10a. Future reconciliations must prefer current HEAD over stale handoff memory for runtime claims
- This session surfaced one concrete risk: dated handoffs can describe runtime capabilities that may already have diverged from the live branch state another agent is inspecting.
- Reconciliation notes should therefore merge audited facts from current source/runtime checks, not simply restate older handoffs.

## Operational rule going forward

### 11. Future agents should use this precedence order
1. `docs/canon/`
2. active `docs/specs/`
3. founder locks in `docs/solutions/`
4. current branch runtime evidence
5. dated handoffs for reconciliation context

Do not let a single chat memory override the repo when the repo already contains the rule.
Do not assume a missing concrete list exists just because the behavior around it is canon.
If a factual list is required operationally and cannot be found in active repo materials, treat it as a missing artifact and record that gap explicitly.

## Immediate impact on the current branch
- The current `/discover` work should continue using the nearest-active onboarding fallback rule already locked in canon/spec.
- The missing hotspot-city inventory is a real documentation/data gap, but it is not a reason to stall the current bug fix.
