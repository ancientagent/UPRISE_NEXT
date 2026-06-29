# Scenes, Uprises, and Sects

**ID:** `COMM-SCENES`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-06-25`

## Overview & Purpose
This spec defines the structural hierarchy of **Scenes**, **Communities**, **Uprises**, and **Sects**. It formalizes how place, people, and broadcast relate, and how a Sect can mature into its own Uprise.

## User Roles & Use Cases
- Listener selects a Home Scene and participates locally.
- Artist (capability) registers to a Home Scene and uploads to its broadcast.
- Registrar participants enter motions to form a new Uprise when thresholds are met.
- Visitors traverse other Scenes without civic voting rights.

## Functional Requirements
- A **Scene** is a place-bound container. Scenes exist at City, State, and National levels.
- A **Community** is the people operating within a Scene.
- An **Uprise** is a dual-state object: the broadcast station/infrastructure operated by a Community within a Scene and the Signal of that community broadcast carried by RaDIYo.
- A **Home Scene** is the user’s local music Scene of choice and civic anchor.
- **Sects** are Registrar-recognized subcommunity affiliations inside a Home Scene that can mature into sub-community Uprises.
- Sect affiliation belongs in Registrar, not as a loose self-assigned profile tag.
- A Sect can become an official subcommunity before it becomes a Sect Uprise. Official Sect status makes the sect visible in Registrar for discovery/affiliation and may provide an updates channel, but it does not grant independent broadcast authority.
- A Sect Uprise should mirror Home Scene behavior wherever possible while staying scoped inside the parent Home Scene/music community.
- Sects exist to solve broad-community density: they let niche/sub/microgenre groups create a purer broadcast experience without forcing every niche into its own isolated city/music-community.
- A Sect becomes an Uprise only after meeting the support threshold and having enough committed artist catalog to sustain rotation (45 minutes of total playtime from artists who back/sign the motion).
- Sect readiness tracking counts approved playable minutes only from registered source accounts that explicitly tag/back/affiliate with that sect. Passive genre/style metadata does not count by itself.
- When a Sect meets the threshold, a motion is entered in the Registrar to establish the Sect Uprise.
- Artists must back/commit to the Sect Uprise for it to activate. If support is insufficient, the sect motion does not realize into an Uprise.
- Sect members have voting rights inside their Sect Uprise. Non-members may listen when parent-scene/discovery access permits, but listening access does not grant sect voting authority.
- Citywide is the only tier with civic infrastructure. Statewide and National are aggregate broadcasts only.

### Implemented Behavior (Current)
- Home Scene selection currently resolves exact `{city, state, musicCommunity}` in `Community` (tier `city`).
- If the selected city-tier community does not exist or is inactive, onboarding assigns the user to the nearest/relevant active major-node city-tier `Community` for the same parent music community.
- Major-node/proxy assignment must stay in-state when any same-state active major-node exists for the selected music community. Cross-state assignment is allowed only when no same-state active major-node exists, and remains an edge case for statewide identity policy.
- Onboarding does not create inactive `Community` rows or listener-side pioneer activation queues. The active listening/voting anchor is stored through `User.tunedSceneId` where current runtime needs an explicit resolved anchor.
- UPRISE starts with fixed active major-node Home Scenes / music capitals for each parent music community. Those nodes absorb surrounding or inactive-city listeners and sources until enough local artist/source concentration exists to split off a new city-tier `Community`.
- New city-tier communities are created through artist/source registration and Registrar/source activation, not listener onboarding or listener demand. Without active local artists/music, there is no music community to activate.
- When a new city-tier Home Scene splits off from a major node, future listener assignment and future source uploads attach according to the newly active Home Scene. Existing songs finish their current rotation lifecycle in their prior active scene unless a later approved spec changes the cutover rule.
- Home Scene affiliation/tag context remains part of system ordering where needed for civic identity, voting rights, and visitor/local distinction; older tag-era self-assigned profile tags alone should not drive official sect affiliation or sect realization.
- User is auto-joined to the resolved Scene via `CommunityMember`.
- Community profile read surface is available in web at `apps/web/src/app/community/[id]/page.tsx` using:
  - `GET /communities/:id` for profile metadata
  - `GET /communities/:id/feed` for recent S.E.E.D activity projection
- Registrar sect-motion submit skeleton exists:
  - `POST /registrar/sect-motion` creates a Home Scene-scoped registrar entry (`type = sect_motion`, `status = submitted`).
  - Current primitive enforces scene locality guardrails; threshold validation/approval remains deferred.
- Sect readiness tracking may be built before public visibility is enabled; visibility may remain hidden, admin-only, or read-only until beta/community calibration locks the maturity milestone and backing limits.
- Official Sect discovery should live in Registrar: members can see official sects in their Home Scene, inspect affiliation/update context, and choose to affiliate through the Registrar flow once the surface is enabled.
- Registrar should eventually show official sect context such as active official sects in the current Home Scene, sects that have already uprisen, and where those uprisen sects exist.
- Sect Uprises remain part of their parent Home Scene/community context; they do not become standalone city/music-community replacements.
- Once a sect is realized as a source, its Uprise is the sect signal and followers of the sect must be able to add that Uprise from the sect surface.

## City-Tier Activation Workflow

This section owns the community-side activation workflow for splitting a natural city-tier Home Scene from a major-node/proxy scene. Registrar owns source-origin authority; this spec owns how the community lifecycle changes once activation readiness is satisfied.

### Activation Candidate

- A candidate activation tuple is an inactive/unavailable `city + state + music community` that has registered source-origin activity.
- Candidate identity is the same community identity used everywhere else: `city + state + music community`. Do not collapse activation to city-only, state-only, or music-community-only.
- Listener onboarding submissions, missing-music-community requests, and passive demand can inform messaging or admin visibility, but they do not create an activation candidate without source/music evidence.
- Onboarding must not create inactive `Community` rows solely to remember a possible future scene.

### Readiness Criteria

- A city-tier Home Scene is ready to activate when it has at least `45` minutes of approved playable music from at least `5` distinct registered source accounts.
- No single source may occupy more than `15` minutes of any one Uprise rotation at a time.
- Only approved playable music from sources whose source origin matches the candidate tuple counts toward that tuple's activation readiness.
- Readiness accounting should use approved playable minutes and source-origin metadata, not loose profile tags, listener taste metadata, follower counts, or onboarding demand.
- Exact metric storage/read APIs are implementation details for follow-up slices; this section locks the counting semantics.

### Activation Trigger And Side Effects

- Activation is source/music-driven. The operational trigger mechanism (automatic evaluator vs explicit Registrar/admin approval gate) is an implementation contract to lock before runtime automation, but listener demand is never the trigger.
- Current MVP runtime uses an explicit authenticated admin trigger for readiness-proven tuples (`POST /admin/analytics/activation-readiness/activate`). It is not a scheduler and it cannot activate a tuple from listener demand alone.
- The current trigger creates/activates the natural scene, re-anchors matching source accounts for future uploads, re-roots matching listeners to the natural scene by updating their active tuned scene, records a cutover audit, creates lightweight activation notices, and saves distinct former proxy scenes as Away Scene/profile context.
- When the natural Home Scene activates, future Home Scene resolution for matching listeners should route to the natural active scene.
- Future source uploads for matching source-origin sources should attach according to the newly active natural Home Scene.
- Existing songs already active in a proxy scene finish their current rotation lifecycle in that prior scene unless a later approved Fair Play/cutover spec changes the rule.
- A song cannot be actively listed in more than one Uprise rotation at the same time.
- Proxy-scene listener votes, source/song voting data, and history remain historical to the proxy scene/tier where they occurred; they do not transfer into the newly active natural Home Scene.
- The prior proxy scene may remain available as an Away Scene or saved profile context, but it no longer acts as the user's natural Home Scene when the matching natural scene is active.
- Listener/source activation messaging and former-proxy saved-context behavior are owned by `docs/specs/users/onboarding-home-scene-resolution.md#proxy-to-natural-cutover-user-contract`.

### Source And Listener Re-Resolution

- Matched listeners whose submitted/default Home Scene tuple now exists should be rooted in the natural Home Scene on the next supported resolution/cutover path.
- Source accounts preserve source identity; activation changes future routing and upload attachment, not the existence of the source entity.
- Source-origin changes require an explicit Registrar workflow. Activation must not silently rewrite a source to an unrelated city or music community.
- Cross-state proxy assignment remains an edge case. If activation/cutover depends on cross-state state-tier identity, lock the edge-case policy in the Fair Play/broadcast owner spec before implementation.

## Sect Readiness And Sect Uprise Boundary

This section owns the community-side boundary for Official Sects, sect readiness
tracking, and Sect Uprises. Registrar owns sect affiliation and motion filing;
this spec owns when sect readiness can be treated as enough community density to
justify subcommunity broadcast authority.

### Official Sect Boundary

- An Official Sect is a Registrar-recognized subcommunity inside a parent Home Scene/music community.
- Official Sect status is pre-Uprise. It may make the sect visible in Registrar for affiliation, source/system updates, and progress context, but it does not grant independent broadcast authority.
- Official Sect affiliation must be explicit and Registrar-held. Loose profile tags, passive genre/style metadata, or listener taste tags do not create official affiliation.
- Official Sect visibility may remain hidden, admin-only, or read-only until the beta/community milestone and menu architecture are locked.
- Registrar may eventually show active Official Sects in the current Home Scene, sects that have already uprisen, and where those uprisen sects exist.

### Readiness Inputs

- Sect readiness counts approved playable minutes only from registered source accounts that explicitly tag/back/affiliate with that sect through the Registrar-owned path.
- Passive genre/style metadata can inform discovery or candidate analysis, but it does not count toward readiness without explicit registered-source backing.
- The current readiness target mirrors community activation at `45` minutes of committed playable artist catalog.
- Source/song backing limits and paid/free backing capacity remain beta/community-calibrated and must not be hard-coded until an implementation slice locks them.
- Readiness tracking may be built before any public sect creation or progress surface is enabled.

### Sect Uprise Boundary

- A Sect Uprise should mirror Home Scene behavior wherever possible while staying scoped inside the parent Home Scene/music community.
- Sect Uprises exist to let niche/sub/microgenre groups create a purer broadcast experience without turning every niche into an isolated city/music-community silo.
- A Sect Uprise must not become a standalone replacement for the parent Home Scene or parent music community.
- Sect members have voting authority inside their Sect Uprise; non-members may listen when parent-scene/discovery access permits, but listening access does not grant sect voting authority.
- A sect motion does not realize into a Sect Uprise unless there is sufficient committed source support and the Registrar/community approval path is satisfied.

### Current Runtime Boundary

- `POST /registrar/sect-motion` exists only as a Home Scene-scoped skeleton filing primitive.
- `GET /registrar/sect-motion/entries` and `GET /registrar/sect-motion/:entryId` exist for submitter-owned readback.
- Current runtime does not validate sect readiness thresholds, approve motions, create Official Sect affiliation records, create update channels, or activate Sect Uprises.
- Existing `SectTag` / `UserTag` rows remain non-authoritative for Official Sect affiliation and Sect Uprise realization unless a future migration explicitly promotes them through Registrar-owned records.

### Deferred Behavior (Not Implemented Yet)
- Dedicated Uprise persistence model and one-to-one Scene/Uprise lifecycle management.
- Reconcile older tag-era sect assignment flows so they stop implying that profile tag selection alone creates official sect affiliation or realizes a sect.
- Official Sect affiliation records and updates-channel surfaces remain deferred until Registrar information architecture is locked.
- Registrar motion threshold validation, approval workflow, and automatic Sect-to-Uprise activation.
- Automated/scheduled city-tier activation and external notification delivery beyond the current profile notice context.
- User-facing sect creation/unlock visibility, source-level backing limits, song-level backing limits, and paid/free backing capacity remain beta/community-calibrated until tested with real Home Scene density.
- City-to-State-to-National propagation thresholds and enforcement jobs (see `docs/specs/DECISIONS_REQUIRED.md`).

## Non-Functional Requirements
- Consistency: Scene, Community, and Uprise are never treated as interchangeable.
- Clarity: onboarding language must use “Music Community,” not “Genre Selection.”
- Neutrality: no algorithmic ranking or recommendation is implied by Scene structure.

## Architectural Boundaries
- Canon definitions come from `docs/canon/`.
- “Genre/subgenre/microgenre” must not be used as the live sect-formation mechanism.
- Home Scene selection uses **City**, **State**, **Music Community** labels.
- Home Scene architecture is invariant across city/music-community instances: the tuple changes scene data, membership, content, source activity, events, and history, but not screens, menus, tabs, player behavior, action grammar, or routing.

## Data Models & Migrations
### Prisma Models
- `Community`
  - Structural fields: `city`, `state`, `musicCommunity`, `tier`, `isActive`
  - Geofence fields: `geofence` (PostGIS geography), `radius`
- `CommunityMember`
  - Scene membership linkage (`userId`, `communityId`, `role`)
  - Unique membership constraint on `(userId, communityId)`
- `SectTag` / `UserTag`
  - still participate in Home Scene/tag ordering and existing runtime identity structures
  - must not be treated as sufficient by themselves to make an official sect affiliation or realize a sect into an Uprise
  - passive genre/style tag metadata may inform discovery or candidate analysis, but explicit registered-source backing is required before minutes count toward sect readiness
- `User`
  - Home-scene affinity fields (`homeSceneCity`, `homeSceneState`, `homeSceneCommunity`, `homeSceneTag`, `gpsVerified`)
  - `homeSceneTag` remains relevant to system-order identity where that context is required
- Source-origin and activation-readiness read models may be added in future slices. This R1 contract does not require a migration by itself.

### Migrations
- `20260213154237_add_scene_and_sect_tags` (scene metadata + sect/user tag tables)
- `20260216004000_add_user_home_scene_and_track_engagement` (user home-scene/gps fields)
- Backfill strategy: none required (nullable adds + new tables)
- Rollback: drop added columns/tables only if no onboarding/tag data is needed

## API Design
### Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/onboarding/home-scene` | required | Resolve Home Scene and auto-join resolved active membership |
| POST | `/onboarding/gps-verify` | required | Verify voting eligibility against exact Home Scene geofence or submitted-location major-node assignment locality |
| GET | `/communities` | required | List communities |
| GET | `/communities/:id` | required | Community details |
| POST | `/communities` | required | Create community (supports geofence fields) |
| GET | `/communities/nearby` | required | Nearby scene lookup by lat/lng |
| POST | `/communities/:id/verify-location` | required | Verify user location against a community geofence |

### Request/Response
- `POST /onboarding/home-scene` request:
  - `city`, `state`, `musicCommunity`, optional `tasteTag` / Home Scene tag context where the current flow still uses it
- `POST /onboarding/home-scene` response:
  - user home-scene fields + `sceneId`, `appliedTags[]` where applicable, `votingEligible`; legacy `pioneer` fields may exist until runtime cleanup but are not product authority
- `POST /onboarding/gps-verify` response:
  - `gpsVerified`, `votingEligible`, `distance`, optional reason:
    - `NO_HOME_SCENE`
    - `SCENE_NOT_FOUND`
    - `SCENE_NO_GEOFENCE`
    - `OUTSIDE_GEOFENCE`
    - `SUBMITTED_LOCATION_NOT_VERIFIED`
    - `SUBMITTED_LOCATION_MISMATCH`

## Web UI / Client Behavior
- Onboarding prompts for **City**, **State**, **Music Community**.
- Home Scene/tag context may still appear in onboarding/runtime because the system uses it for civic identity and ordering.
- New sect affiliation UX should be Registrar-held rather than loose profile tagging; artist motion/backing still governs realization into a Sect Uprise.
- Sect progress may be computed internally before it is exposed; public visibility requires an explicit product activation.
- Sect Uprise listening access and voting authority should mirror Home Scene/visitor behavior where possible: listening may be broader than membership, but voting belongs to members.

## Acceptance Tests / Test Plan
- Doc review: Scene, Community, and Uprise definitions align to canon.
- UI copy review: no “genre selection” wording.
- API behavior:
  - Unknown or inactive city/community assigns to the nearest/relevant active major-node same-parent city-tier community and auto-joins the resolved active Scene.
  - Onboarding does not create inactive `Community` rows or listener-side pioneer activation queues.
  - New city-tier communities split from major nodes only through artist/source concentration and Registrar/source activation.
  - Activation readiness uses source-origin-matching approved playable minutes, at least `5` distinct registered source accounts, and the `15` minute per-source rotation cap.
  - Artist/source tracks created before a split finish their existing rotation lifecycle; post-activation track uploads attach according to the source's active Home Scene.
  - Proxy-scene listener votes and source/song voting data remain historical to the proxy scene/tier where they occurred; they do not transfer into the newly active natural Home Scene.
  - Existing city/community resolves without duplicate membership.
  - GPS verify changes voting eligibility only.
- Tag behavior:
  - if `tasteTag` exists in onboarding/runtime, it remains valid Home Scene/tag context
  - but tag assignment alone does not create official sect affiliation or realize a sect into an Uprise
  - passive genre/style tags do not count toward sect readiness without explicit registered-source backing
- Sect behavior:
  - Sect Uprises remain inside the parent Home Scene/music community
  - Sect members can vote in their Sect Uprise
  - non-members can listen only according to parent scene/discovery access and cannot vote in the Sect Uprise
  - current runtime has sect-motion filing/readback only; readiness validation, approval, official affiliation records, update channels, and Uprise activation remain deferred

## Future Work & Open Questions
- Lock implementation details for the metric storage/read path that evaluates the already-defined artist/source concentration threshold for splitting a new active city-tier community from an existing major-node/music-capital community.
- Define implementation details for activation metrics read paths, trigger authority, notification delivery, source assignment/cutover, future upload routing, and listener helper messaging.
- Retire or rename legacy `pioneer` runtime/test terminology once major-node assignment language is implemented end-to-end.
- Beta-calibrate the community maturity milestone required before user-facing sect creation unlocks.
- Define implementation artifacts for the now-owned Official Sect and Sect Uprise boundary: Registrar affiliation schema, updates channel, motion schema, approvals, visibility, backing limits, and paid/free capacity.
- Add explicit Uprise model and Scene<->Uprise lifecycle constraints.
- Lock propagation thresholds and policy in `docs/specs/DECISIONS_REQUIRED.md`.

## References
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Master Glossary Canon.md`
