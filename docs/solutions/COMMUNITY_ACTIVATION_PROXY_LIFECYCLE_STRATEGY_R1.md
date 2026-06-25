# Community Activation Proxy Lifecycle Strategy R1

Status: proposed strategy synthesis
Owner: platform engineering
Last Updated: 2026-06-25

## Executive Summary

This strategy synthesizes Lane 1-6 findings into a Lane 7 implementation strategy focused on one primary contract gap: **community activation and proxy-to-natural lifecycle ownership**.

Repo authority confirms the platform already has stable truths for Home Scene identity, major-node proxy assignment, Registrar intake, and Fair Play lifecycle principles. What remains is to define and implement the activation owner contract that links those pieces end-to-end.

This plan preserves current product locks:

- community activation is source/music-driven, not listener-demand-driven;
- proxy assignment is a routing/listening/voting bridge, not a listener-side pioneer workflow;
- songs cannot be active in multiple Uprise rotations simultaneously;
- existing songs finish current lifecycle in prior active scene when natural scene activation occurs, while new uploads attach per active Home Scene;
- sect readiness should mirror community activation where possible, but stay inside the parent Home Scene until Sect Uprise authority is explicitly activated.

## Current Repo Truths

Authority loaded in order (`AGENTS.md` -> orientation -> owner specs -> lane briefs -> runtime evidence) is consistent on the following:

1. **Community identity** is `city + state + music community`.
2. **Activation thresholds are already product truth**: at least `45` minutes approved playable music from at least `5` distinct registered source accounts, with `20` minute max per source per rotation.
3. **Activation is source/Registrar-driven**, not listener-demand/onboarding-driven.
4. **Proxy assignment** remains in-state when possible; cross-state is edge-case only.
5. **GPS gates voting/source-registration authority**, not ordinary listening participation.
6. **Release Deck baseline** is 3 music slots (+ separate paid ad slot) with URL-based media ingest in MVP.
7. **Fair Play split** (New Releases pool + Main Rotation pool), engagement/upvote separation, and lifecycle principles are documented.
8. **Sect architecture** should mirror Home Scene logic and remain scoped to parent Home Scene/community unless elevated by explicit Sect Uprise authority.

## Swarm Lane Findings

Lane synthesis is based on the Abacus external lane-analysis artifact reported during this run, reconciled against the repo owner specs listed in this document. The external lane-findings file was not committed to this repository, so it is treated as scouting input rather than durable authority. Future agents should rely on the repo files cited under **Exact Files Reviewed** and promote durable rules into owner specs before implementation.

- **Lane 1 (Onboarding/Home Scene):** core proxy assignment and GPS locality checks are implemented; helper messaging + full profile preference persistence/move workflow still need parity.
- **Lane 2 (Registrar/Source):** registrar intake/materialization/capability primitives are strong; source-origin/Home Scene ownership contract is still missing.
- **Lane 3 (Community Activation):** threshold values are documented, but no activation metrics job + trigger + side-effects contract exists yet.
- **Lane 4 (Release Deck/Eligibility):** 3-song + 20-min constraints are documented, but eligibility/replacement/song-length contracts need owner-level lock.
- **Lane 5 (Fair Play):** lifecycle model is documented; graduation/promotion jobs and cutover mechanics need explicit implementation contract.
- **Lane 6 (Sects):** principles are clear and intentionally deferred in many areas; readiness/authority should reuse activation logic patterns where possible.

## Proposed Lifecycle Model

### Phase A: Inactive natural city routed to active proxy

- User submits natural Home Scene tuple.
- If natural city-tier scene inactive/unavailable, user is assigned to nearest/relevant active major-node scene (same parent music community, same-state first).
- Listener voting occurs in assigned active scene once submitted-city locality GPS verification passes.
- Source registration remains Home Scene-bound and GPS-gated through Registrar.

### Phase B: Activation readiness accumulation

For each inactive natural city-tier community tuple, system computes:

- distinct registered source count;
- total approved playable minutes from eligible source tracks;
- per-source active minute cap compliance.

No activation occurs from listener demand alone.

### Phase C: Activation trigger and side effects

When contract criteria are satisfied, system marks natural community active and runs deterministic side effects:

- future listener resolution routes to natural scene;
- future source uploads attach according to active Home Scene;
- current proxy lifecycle entries remain until their current lifecycle completes per existing locks;
- notifications/messages are emitted to affected listeners/sources (surface contract TBD in owner spec).

### Phase D: Proxy lifecycle wind-down

- historical votes/engagement stay with scene/tier where they occurred;
- no active dual-rotation placement for the same song;
- reuse rules for songs after proxy lifecycle follow existing Fair Play lock.

## Data Model Implications

This strategy is intentionally **no-migration at R1 doc stage**. Required model implications are contract-level first:

1. Define canonical activation metric query inputs from existing `Community`, `ArtistBand`, `Track`, and rotation/vote entities.
2. Define source-origin anchor semantics for `ArtistBand.homeSceneId` at registration and post-activation cutover.
3. Define whether additional derived/read-model fields are required for activation diagnostics (can be API computed first).
4. Clarify role of existing `SectTag`/`UserTag` as non-authoritative for sect realization.

Current runtime parity note: source-origin persistence is implemented on Registrar entries and materialized Artist/Band records. `sceneId` / `homeSceneId` remain the active operating scene, while `sourceOriginCity`, `sourceOriginState`, and `sourceOriginMusicCommunity` preserve the submitted natural tuple for activation accounting. Read-only activation readiness diagnostics and an authenticated manual activation trigger now exist under the admin analytics surface; the trigger re-anchors matching sources and re-roots matching listeners to the natural scene. Scheduled automation, notifications, and saved Away Scene/profile preservation remain deferred.

Out of scope for this strategy pass:

- dedicated `Uprise` model decisions;
- Project-to-Cause terminology migration / `project_registration` runtime naming cleanup;
- Prime-model generation mechanics;
- full media upload/storage/transcode activation.

## API Contract Implications

Owner-spec patching should define contracts before runtime changes:

1. **Activation metrics read contract** (admin/system/internal) for inactive communities.
2. **Activation evaluation trigger contract** (scheduled/system action).
3. **Activation result contract**: deterministic side effects and reporting.
4. **Source origin contract**: registrar submission scene vs assigned proxy vs natural tuple behavior.
5. **Cutover contract**: behavior for existing rotation entries, votes, and new uploads after activation.

## UI/UX Implications

1. Keep onboarding/proxy language as helper context only (not activation queue).
2. Add explicit user-facing activation-state messaging in Home/Profile strip/notification path when natural scene activates.
3. Expose source-facing activation status context via Registrar/Source Dashboard without changing Registrar actor model.
4. Avoid introducing new tabs/surfaces outside current locked shell.

## Registrar/Source Workflow

Contract to lock:

1. How source Home Scene is assigned at registration when user is routed through a proxy.
2. Whether source origin can change and under what explicit workflow.
3. How source origin affects activation accounting, upload routing, and tier lineage.
4. What happens to registrar/materialized source linkage at natural-scene activation.

Until owner decision, keep current registrar runtime untouched and treat source-origin ambiguity as a blocking contract dependency for activation automation.

## Release Deck and Music Eligibility Rules

Existing truths preserved:

- 3-song batch model (+ separate paid ad slot);
- 20-minute per-source cap per rotation;
- URL-only media ingest for current MVP.

Owner contract still needed for:

1. explicit song length cap;
2. active-rotation eligibility criteria;
3. replacement behavior when source is at active cap;
4. enforcement method for single-active-rotation exclusivity.

## Fair Play and Voting Implications

Preserve locked model:

- engagement controls recurrence only;
- upvotes control propagation only;
- proxy-scene votes/history remain historical to the proxy scene/tier.

Needed for activation lifecycle completion:

1. New Window graduation execution contract/job;
2. tier promotion run contract/job;
3. cutover sequencing between proxy and newly active natural scene;
4. proxy edge-case policy for cross-state advancement identity.

## Proxy-to-Natural Scene Migration Rules

Locked now (do not change):

- future assignment/uploads target newly active natural scene;
- existing songs finish current lifecycle in prior active scene;
- no multi-rotation simultaneous active listing for one song;
- proxy vote history does not transfer.

Still needs owner-level implementation detail:

1. source anchor updates (`homeSceneId`) on activation;
2. exact trigger timing for listener context re-resolution;
3. lifecycle-end conditions for proxy-carried songs;
4. operational handling of cross-state edge-case songs in tier progression.

## Sect Readiness / Sect Uprise Parallels

Sect strategy should parallel community activation with scoped authority. Current Registrar language already anchors Sect readiness to a `45`-minute committed playable-music threshold plus explicit support, and requires approved playable minutes from registered source accounts that explicitly tag/back/affiliate with that sect.

- use explicit registered-source backing as readiness input;
- use approved playable minutes accounting (not passive tags);
- keep sect affiliation Registrar-held;
- keep sect governance/broadcast authority inside parent Home Scene until Sect Uprise threshold and authority contracts are enabled.

This allows shared activation-metrics patterns without prematurely granting sect broadcast authority.

## Open Founder Decisions

1. **Source origin contract**: is source Home Scene fixed at registration tuple, proxy anchor, or mutable by explicit workflow?
2. **Activation counting semantics**: do readiness minutes count all approved-playable tracks or only active-rotation-eligible tracks?
3. **Activation trigger authority**: automatic system activation on threshold vs explicit Registrar/admin approval gate?
4. **Proxy cross-state advancement policy**: how statewide identity is assigned when proxy assignment is cross-state edge case.
5. **Release Deck hard eligibility contract**: song length cap and replacement behavior at 3-song/20-min constraints.
6. **Cutover UX trigger**: when and where users/sources are notified and whether reassignment is immediate or session-bound.

## Implementation Slices

Sequence translates blockers into implementation order (without runtime edits in this doc pass):

1. **Slice 1 – Owner Contract: Source Origin + Activation Workflow**
   - Add a new source-origin owner section to `docs/specs/system/registrar.md` and patch community owner specs with activation computation/trigger rules.
   - No runtime changes.
2. **Slice 2 – Owner Contract: Proxy Cutover + Fair Play Lifecycle Join Points**
   - Patch migration/cutover contracts and cross-state policy placeholders.
3. **Slice 3 – Activation Metrics Read Path**
   - Completed as authenticated admin analytics diagnostics using persisted source-origin fields.
4. **Slice 4 – Activation Trigger Execution Path**
   - Completed as authenticated manual admin trigger for readiness-proven tuples; creates or activates the natural city-tier scene.
5. **Slice 5 – Listener/Source Notification Path**
   - Minimal source/listener re-rooting is implemented in the manual activation trigger: matching `ArtistBand.homeSceneId` and `User.tunedSceneId` values move to the natural scene for future uploads/Home resolution without moving existing tracks/votes.
   - Next: minimal UX/API messaging for proxy-to-natural activation transitions and saved Away Scene/profile preservation for the former proxy context.
6. **Slice 6 – Release Deck Eligibility Enforcement**
   - First create or designate a Release Deck / media eligibility owner spec or section, then enforce owner-locked eligibility/replacement rules without widening MVP media scope.
7. **Slice 7 – Sect Readiness Parity Foundations**
   - Reuse activation-metrics patterns for sect readiness (visibility still deferred).

## Test Plan

For the strategy/docs slice (this branch):

- `pnpm run docs:lint`
- `git diff --check`

For follow-up runtime slices (planned, not in this doc pass):

- targeted API unit/integration tests for activation computation + trigger semantics;
- regression tests for onboarding proxy resolution and cutover messaging;
- Fair Play lifecycle tests for proxy historical vote retention and single-active-rotation enforcement;
- Registrar-source-origin contract tests.

## Docs To Patch Next

Primary owner docs to patch in order:

1. `docs/specs/system/registrar.md` (new source origin contract owner section)
2. `docs/specs/communities/scenes-uprises-sects.md` (activation workflow owner section)
3. `docs/specs/users/onboarding-home-scene-resolution.md` (cutover-facing user contract pointers)
4. `docs/specs/broadcast/radiyo-and-fair-play.md` (activation/cutover execution semantics)
5. `docs/specs/media/release-deck-and-eligibility.md` or an equivalent new owner section (Release Deck / media eligibility contract)
6. `docs/agent-briefs/ONBOARDING_HOME_SCENE.md` / `REGISTRAR_GOVERNANCE.md` / `ARTIST_PROFILE_SOURCE_DASHBOARD.md` (short routing updates after owner patches)

## Risks / Drift Traps

1. Re-introducing listener-side pioneer activation language or behavior.
2. Treating proxy assignment as a permanent source-origin identity without owner lock.
3. Implementing activation jobs before counting semantics are owner-locked.
4. Allowing song dual-active-rotation states during cutover.
5. Using passive tags as authoritative sect readiness inputs.
6. Widening media/storage/business scope while activation lifecycle is still unresolved.

## Exact Files Reviewed

### External synthesis input
- Abacus external lane-analysis artifact reported as `~/swarm_shared_files/lane_findings.md` in the Abacus run environment. This file is not repo-persisted and is not durable authority.

### Prior strategy / reviewer context
- `docs/handoff/2026-06-24_abacus-fusion-agent-swarm-strategy.md`
- `docs/handoff/2026-06-25_hermes-reviewer-clarification-handoff.md`

### Authority and owner docs
- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/specs/system/documentation-framework.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/system/registrar.md`
- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/broadcast/radiyo-and-fair-play.md`
- `docs/specs/social/message-boards-groups-blast.md`
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
- `docs/agent-briefs/REGISTRAR_GOVERNANCE.md`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`

### Runtime evidence provenance (from lane findings cross-check)
- `apps/api/prisma/schema.prisma`
- `apps/api/src/onboarding/onboarding.service.ts`
- `apps/api/src/fair-play/fair-play.service.ts`
- `apps/api/src/tracks/tracks.service.ts`
- `apps/api/src/registrar/*`
- `apps/web/src/app/onboarding/page.tsx`
- `apps/web/src/app/source-dashboard/page.tsx`
