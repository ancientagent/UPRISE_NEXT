# 2026-06-24 - Proxy Scene and Community Activation Working Model

Date: 2026-06-24
Branch: `docs/abacus-fusion-swarm-strategy`
Status: working founder clarification, pending final spec patch
Scope: Home Scene activation, proxy scenes, source registration, sect thresholds, Registrar visibility

## Purpose

This note captures the current founder clarification from the live architecture discussion so future doc/spec patches do not rebuild the discarded `pioneer intent` model by accident.

This is a working decision note. It should be converted into active spec/brief updates after founder review.

## Core Correction

The old `pioneer intent` framing was wrongly carried forward after the product model changed.

The platform must not create or maintain empty listener-side communities. A community exists only when there is enough music to support it.

## Current Winning Model

### 1. City-Level Community Is Still The Real Community

- The real Home Scene/community identity remains `city + state + music community`.
- Statewide and national tiers are aggregate broadcast tiers, not the primary community architecture.
- Citywide is the civic/local anchor.

### 2. No Empty Communities

- A listener cannot be placed into a city/music-community where there is no active music.
- If the listener's natural Home Scene is active, they land there.
- If the listener's natural Home Scene is not active, they are routed to an active proxy scene.

### 3. Natural Home Scene vs Proxy Scene

Definitions:

- **Natural Home Scene**: the `city + state + music community` the listener provides during onboarding.
- **Proxy Scene**: the active Home Scene where the listener participates when their natural Home Scene is not active yet.
- **Rooted Home Scene**: the listener's current active civic/home anchor. This is either their natural active Home Scene or their assigned proxy scene.
- **Visitor Scene**: a saved scene/listening context that is not the user's rooted Home Scene.
- **Registered music-community preference**: a user-profile affiliation that means the user is a fan / involved with that music community; it persists across cities and resolves into local Home Scene or proxy scene content based on the current city. Active major-node cities should generally carry the same primary music-community set, so carried preferences normally resolve locally in the new city. If a saved music-community preference does not resolve to an active current-city scene, it stays visible in the profile but does not appear in the Home Scene roller until resolvable.

Rules:

- The natural Home Scene can be stored as user metadata/metric.
- This metadata is not a pending community, inactive community, activation queue, or promise.
- It can be used to count how many listeners identify with that natural scene, but listener count does not activate a community.
- The active/proxy scene is where the listener participates until the natural scene becomes active.
- Onboarding collects one primary scene-of-choice music community. Users join additional music communities by adding registered music-community preferences to their user profile.
- GPS verification gates voting/source-registration authority; it does not automatically add every active music community in the user's verified city to their Home Scene memberships.
- One successful GPS verification for a city grants voting rights across all registered Home Scene affiliations in that verified city.
- Verifying a new city replaces the user's prior city voting authority; users do not hold voting authority in multiple cities at the same time.
- When a user verifies a new city and changes their Home Scene location, preserve their registered music-community preferences automatically as the same music communities in the new city without a separate re-confirmation step, but re-resolve Home/Plot/RADIYO/Feed/Events/Archive content to the new city's active or proxy scenes.
- The Home Scene selected during onboarding is the user's initial active/default Home Scene.
- A Home Scene roller should show the user's registered music-community preferences resolved against the current verified/default city. The user may switch active Home/Plot context through it, and the starred default music-community preference determines the Home Scene the user is anchored to and loaded into on login. The currently selected roller item is the scene the user is in.
- Saved Away Scenes are profile/collection interests and visitor/listening contexts.
- Proxy assignment must stay in-state when any same-state active major-node exists for the selected music community.
- Cross-state proxy assignment is allowed only when no same-state active major-node exists for the selected music community.
- If cross-state proxy assignment is unavoidable, songs may still advance through tier progression provisionally, but statewide origin/identity handling needs explicit edge-case policy before implementation depends on it.

### 4. GPS Rules

- GPS gates voting rights.
- GPS-verified listeners routed to a proxy scene can vote in that proxy scene.
- Non-GPS listeners can participate but cannot vote.
- Non-GPS listeners cannot register a band/source.
- All bands/sources must be registered by a GPS-verified user.

### 5. Source/Band Accounts

- Bands/artists are not users. They are source accounts/entities managed by users.
- A band/source can only be registered by a GPS-verified user.
- The GPS-verified user's location establishes the source's natural scene origin for activation accounting.
- If the source's natural scene is active, its music attaches to that Home Scene.
- If the source's natural scene is not active, the source operates through the proxy scene while its music still counts toward activating the natural Home Scene.

### 6. City Home Scene Activation Threshold

- A new city Home Scene activates when enough approved playable music exists from registered source accounts tied to the same natural `city + state + music community`.
- The baseline threshold is **45 minutes of approved playable music from at least 5 distinct registered source accounts**.
- The reason for `45 minutes` is that it can support a radio-hour rotation.
- Activation is based on music content, not number of listeners and not number of bands by itself.
- Listener onboarding demand alone cannot activate a community.
- No single source may occupy more than **20 minutes** of any one Uprise rotation at a time.

### 7. Activation Does Not Mean Fragility

- The `45 minutes` threshold is an activation threshold.
- Once a Home Scene is active, it does not disappear automatically if songs are removed or catalog dips below threshold.
- A low-catalog state, needs-music state, warning, or recruiting prompt may be appropriate later, but deletion/deactivation is not automatic.

### 8. Transfer When Natural Home Scene Activates

When a natural Home Scene activates:

- Users whose natural Home Scene metadata matches that `city + state + music community` transfer automatically into the new active Home Scene.
- Their former proxy scene is retained as a visitor/saved scene so they can return to listen.
- GPS-verified users can vote in the newly active Home Scene.
- Non-GPS users transfer too, but remain non-voting until GPS verification.
- Source music from that natural scene attaches to the new Home Scene according to the approved activation/cutover workflow.
- Listener voting history stays historical to the proxy scene where it happened and does not transfer into the new natural Home Scene.
- Source/song voting data stays with the scene/tier where it was earned and remains relevant only for that song's existing lifecycle on that tier.
- Existing active songs finish their lifecycle in the proxy scene and do not move into the new natural Home Scene mid-lifecycle.
- After the source is rooted in the new natural Home Scene, it must add/select songs that are not currently listed in any other active Uprise rotation.
- A song can be reused in the new natural Home Scene after its proxy lifecycle ends unless it has already advanced to the statewide tier.

### 9. Sect Thresholds Use The Same Radio-Hour Principle

- A Sect is not the same thing as a city Home Scene.
- A Sect is a Registrar-recognized subcommunity inside an existing Home Scene.
- Sect Uprises should mirror Home Scene behavior wherever possible while staying scoped inside the parent Home Scene/music community.
- Sects exist so niche/sub/microgenre groups can have a purer broadcast without forcing every niche into an isolated city/music-community.
- Sect members have voting rights inside their Sect Uprise. Non-members may listen when parent scene/discovery access permits, but listening access does not grant sect voting authority.
- Sect activation also uses the `45 minutes of approved playable music` principle because it can support a radio-hour rotation.
- Existing docs already point to this principle for sects.

### 10. Sect Creation Should Be Gated By Community Maturity

- Tiny/new communities should not immediately split into sects if doing so would hollow out the primary Uprise.
- A parent Home Scene should likely need to hit a community maturity milestone before sect creation unlocks.
- The exact maturity milestone is not locked pre-launch; it should be calibrated during beta with real Home Scene catalog density, artist participation, and rotation health.
- Sect readiness tracking can be built before it is visible to users.
- User-facing sect progress/creation visibility may stay hidden, admin-only, or read-only until the maturity milestone is defined.
- Registrar is the likely primary surface for tracking progress toward sect readiness.
- Archive may show historical/read-only progress, but Registrar is the better procedural surface.

### 10A. Sect Readiness Counting

- Sect readiness counts approved playable minutes only from registered source accounts that explicitly tag/back/affiliate with that sect.
- Passive genre/style metadata can inform discovery or candidate analysis but does not count toward sect readiness by itself.
- Exact backing limits are beta/community-calibrated.
- Provisional ideas such as one active sect by default or up to three backed sects for paid accounts are not locked product rules yet.

### 10B. Official Sect Affiliation

- The older idea that users freely tag themselves into sects from the profile is too chaotic for official status.
- Official sect affiliation should be handled through Registrar.
- An Official Sect is a pre-Uprise subcommunity that can appear in Registrar so others can inspect it and choose to affiliate.
- Official Sect status can provide an updates channel, but it does not grant independent broadcast authority.
- Registrar should eventually expose active official sects in the current Home Scene, sects that have already uprisen, and where those uprisen sects exist.
- Exact Official Sect member threshold is beta/community-calibrated rather than locked pre-launch.

### 11. Sect Threshold Notification

When tagged/affiliated artists collectively reach the sect threshold:

- relevant artists should receive a message that the threshold has been met;
- the threshold-met state should route to Registrar action/confirmation;
- the sect should not silently appear without the required procedure;
- progress should be visible, likely in Registrar first.

### 12. City Home Scene Threshold Notification

When a natural city Home Scene reaches the `45 minutes` threshold:

- relevant source operators/artists should receive a message that the new Home Scene threshold has been met;
- activation should route through Registrar/source activation rather than silently creating user-facing civic state without process;
- exact operational details remain to be locked.

## Terms To Prefer

Use:

- natural Home Scene
- proxy scene
- rooted Home Scene
- visitor scene
- registered source account
- approved playable minutes
- minimum viable broadcast catalog
- community maturity milestone

Avoid for new product language:

- pioneer intent
- pioneer user
- inactive community
- empty Home Scene
- listener activation queue
- listener demand activation

Legacy runtime fields/tests may still use `pioneer` names until a runtime cleanup slice renames or retires them.

## Open Questions Still Remaining

1. What exact field names should replace legacy `pioneer` runtime/API terminology?
2. What is the exact Registrar approval/confirmation path once a city Home Scene reaches 45 minutes?
3. What notification surfaces should be used for source operators, listeners, and Registrar participants?
4. What is the edge-case policy for statewide origin/identity when cross-state proxy assignment was unavoidable?

## Immediate Documentation Cleanup Needed After Approval

Patch active docs to replace the discarded pioneer framing with this model:

- `docs/PLATFORM_START_HERE.md`
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/system/registrar.md`
- `docs/specs/system/edge-cases-and-compliance.md`
- `docs/specs/seed/README.md`
- `docs/specs/DECISIONS_REQUIRED.md`
- `docs/CHANGELOG.md`

## Implementation Cleanup Needed Later

After docs are approved, runtime may need a separate slice to inspect and possibly rename/adjust:

- `pioneer` / `pioneerHomeScene` API response fields
- onboarding review copy
- tests named around pioneer fallback
- source registration GPS requirements
- source natural-scene origin fields
- proxy scene assignment and visitor-scene retention
- activation threshold background job or Registrar workflow
