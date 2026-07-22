# Scenes, Uprises, and Sects

**ID:** `COMM-SCENES`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-07-14`

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
- **Sects** are listener-requested, artist-supported subcommunities inside a Home Scene that can mature into sub-community Uprises.
- Artist/Band Sect membership belongs in Registrar, not as a loose self-assigned profile tag.
- A Sect can become a legitimate subcommunity before it becomes active. Future
  Registrar presentation may expose it for discovery and Artist/Band membership
  and may provide an updates channel, but legitimacy alone does not grant
  independent broadcast authority.
- A Sect Uprise should mirror Home Scene behavior wherever possible while staying scoped inside the parent Home Scene/music community.
- Sects exist to solve broad-community density: they let niche/sub/microgenre groups create a purer broadcast experience without forcing every niche into its own isolated city/music-community.
- A Home Scene listener may request a Sect through Registrar.
- A requested Sect becomes legitimate when at least `5` distinct eligible
  registered Artist/Band sources register as Sect members in support of the
  request.
- A legitimate Sect becomes active when the current eligible music in those
  supporting member artists' Home Scene Release Decks totals at least `45`
  minutes after applying the existing `15`-minute per-source cap.
- Songs do not support, join, or back Sects individually. Artist/Band Sect
  membership is the authority; readiness dynamically totals each supporting
  member artist's current eligible Home Scene Release Deck music.
- Songs that are no longer in the current eligible Release Deck set are
  irrelevant to readiness and require no Sect-specific history or reassignment
  lifecycle.
- Sect members have voting rights inside their Sect Uprise. Non-members may listen when parent-scene/discovery access permits, but listening access does not grant sect voting authority.
- Citywide is the only tier with civic infrastructure. Statewide and National are aggregate broadcasts only.

### Implemented Behavior (Current)
- Official Sect identity persistence exists through the parent-community-scoped
  `Sect` model. A named Home Scene listener request now creates and links that
  identity transactionally through nullable Registrar provenance; Artist/Band
  Sect membership, lifecycle status, readiness, visibility, update channels,
  and Sect activation remain unimplemented.
- Home Scene selection currently resolves exact `{city, state, musicCommunity}` in `Community` (tier `city`).
- If the selected city-tier community does not exist or is inactive, onboarding assigns the user to the nearest/relevant active major-node city-tier `Community` for the same parent music community.
- Major-node/proxy assignment must stay in-state when any same-state active major-node exists for the selected music community. Cross-state assignment is allowed only when no same-state active major-node exists, and remains an edge case for statewide identity policy.
- Onboarding does not create inactive `Community` rows or listener-side pioneer activation queues. The durable active natural/proxy civic anchor is stored in `User.homeSceneId`; `User.tunedSceneId` is mutable Home/Away listening context and is not civic authority by itself.
- UPRISE starts with fixed active major-node Home Scenes / music capitals for each parent music community. Those nodes absorb surrounding or inactive-city listeners and sources until enough local artist/source concentration exists to split off a new city-tier `Community`.
- New city-tier communities are created through artist/source registration and Registrar/source activation, not listener onboarding or listener demand. Without active local artists/music, there is no music community to activate.
- When a new city-tier Home Scene splits off from a major node, future listener assignment and future source uploads attach according to the newly active Home Scene. Existing songs finish their current rotation lifecycle in their prior active scene unless a later approved spec changes the cutover rule.
- Home Scene affiliation/tag context remains part of system ordering where needed for civic identity, voting rights, and visitor/local distinction; older tag-era self-assigned profile tags alone must not create Artist/Band Sect membership or activate a Sect.
- User is auto-joined to the resolved Scene via `CommunityMember`.
- Community profile read surface is available in web at `apps/web/src/app/community/[id]/page.tsx` using:
  - `GET /communities/:id` for profile metadata
  - `GET /communities/:id/feed` for recent S.E.E.D activity projection
- Registrar named listener Sect requests exist:
  - `POST /registrar/sect-motion` is the legacy-compatible route/type for a
    Home Scene listener request (`type = sect_motion`, `status = submitted`).
  - Current runtime requires the Sect name, enforces the requester's established
    durable active natural/proxy `User.homeSceneId` assignment, and
    transactionally creates the submitted Registrar entry plus linked
    parent-scoped Sect identity. A transient Away Scene tuning context does not
    grant request authority.
  - Request creation requires no Artist/Band ownership and creates no
    Artist/Band membership, threshold state, progress, or activation.
- Sect readiness tracking may be built before public visibility is enabled; visibility may remain hidden, admin-only, or read-only until the product surface is activated.
- Sect readiness should read from the Release Deck/deck-system measurement
  path: current eligible songs, playable duration, source ownership, Home Scene
  context, and Registrar-held Artist/Band Sect membership.
- Official Sect discovery should live in Registrar: listeners can see legitimate/active Sects in their Home Scene, and Artist/Band operators can inspect or register source membership once the surface is enabled.
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

This section owns the community-side boundary for Official Sects, Sect readiness
tracking, and Sect Uprises. Registrar owns listener requests and Artist/Band membership;
this spec owns when sect readiness can be treated as enough community density to
justify subcommunity broadcast authority.

### Official Sect Boundary

- An Official Sect is a Registrar-recognized subcommunity inside a parent Home Scene/music community.
- Legitimate Sect status is pre-active. Future Registrar presentation may make
  the Sect visible for Artist/Band membership, source/system updates, and
  progress context, but legitimacy alone does not grant broadcast authority.
- Artist/Band Sect membership must be explicit and Registrar-held. Loose profile tags, passive genre/style metadata, or listener taste tags do not create membership.
- Sect visibility may remain hidden or read-only until its presentation and menu
  architecture are locked; this does not add a maturity or approval gate.
- Registrar may eventually show active Official Sects in the current Home Scene, sects that have already uprisen, and where those uprisen sects exist.
- Once a Sect becomes legitimate/Official, its recognized title becomes
  discoverable through Registrars in other Home Scenes belonging to the same
  parent music community. Those Home Scenes may establish or join their own
  local instance of that Sect without creating a new unrelated Sect title.
- Official Sect recognition never crosses into a different parent music
  community. Each Home Scene's local Sect instance retains its own membership,
  readiness, voting authority, and eventual Sect Uprise lifecycle; discovering
  or joining a local instance does not grant authority in the originating Home
  Scene's Sect.
- The persistence/linking mechanism for shared Official Sect identity and local
  Home Scene instances remains a future implementation contract. Do not infer a
  global membership row or shared cross-city voting authority from title
  recognition alone.

### Readiness Inputs

- A Home Scene listener may request a Sect through Registrar.
- Support from at least `5` distinct eligible registered Artist/Band sources
  makes the requested Sect a legitimate/Official Sect.
- Sect readiness counts the current approved playable minutes in the Home Scene
  Release Decks of Artist/Band sources whose Registrar-held membership supports
  the requested Sect.
- Artist/Band membership is sufficient to make that artist's current eligible
  Home Scene Release Deck music count. Songs do not carry separate Sect backing
  or affiliation.
- Passive genre/style metadata can inform discovery or candidate analysis, but
  it does not create Artist/Band Sect membership or make a non-member artist's
  Release Deck count.
- The current readiness threshold is one aggregate requirement: at least `45`
  minutes (`2,700` counted seconds) of current eligible Home Scene Release Deck
  music collectively across at least `5` distinct eligible registered sources.
  It is not `45` minutes from each of five sources.
- Apply the existing `15`-minute (`900`-second) Release Deck contribution cap
  per supporting member artist before testing the aggregate `45`-minute
  threshold. A member artist counts toward the five-artist support threshold
  through Registrar membership; their current eligible deck supplies their
  current minute contribution.
- Recalculate from current Release Deck state. Previous songs do not remain as
  Sect readiness evidence after leaving the eligible deck.
- Readiness tracking may be built before any public sect creation or progress surface is enabled.

### Sect Uprise Boundary

- A Sect Uprise should mirror Home Scene behavior wherever possible while staying scoped inside the parent Home Scene/music community.
- Sect Uprises exist to let niche/sub/microgenre groups create a purer broadcast experience without turning every niche into an isolated city/music-community silo.
- A Sect Uprise must not become a standalone replacement for the parent Home Scene or parent music community.
- Sect members have voting authority inside their Sect Uprise; non-members may listen when parent-scene/discovery access permits, but listening access does not grant sect voting authority.
- The legitimate Sect becomes active once its supporting artists collectively
  supply at least `45` counted minutes through their current eligible music in
  the parent Home Scene's combined Release Deck. There is no separate
  routine platform-admin approval stage after the settled thresholds are met.

### Current Runtime Boundary

- `POST /registrar/sect-motion` accepts a named request from a listener in the
  matching established durable active natural/proxy Home Scene and atomically
  creates the Registrar request plus linked authority-neutral `Sect` identity
  scoped to the parent `Community`; transient Away Scene tuning is ignored for
  authority.
- `GET /registrar/sect-motion/entries` and
  `GET /registrar/sect-motion/:entryId` provide submitter-owned readback with
  normalized name/slug, nullable linked Sect identity, and scene context.
- Legacy empty request rows remain readable with null request identity fields;
  runtime does not guess or backfill their Sect identity.
- Current runtime does not create Artist/Band Sect membership records, validate
  thresholds, expose progress, create update channels, or activate Sects.
- Existing `SectTag` / `UserTag` rows remain non-authoritative for Artist/Band Sect membership and Sect activation.
- No current runtime persists Artist/Band Sect membership or computes Sect
  readiness from member artists' current Home Scene Release Decks.

### Deferred Behavior (Not Implemented Yet)
- Dedicated Uprise persistence model and one-to-one Scene/Uprise lifecycle management.
- Reconcile older tag-era Sect assignment flows so they stop implying that profile tag selection creates Artist/Band membership or activates a Sect.
- Artist/Band Sect membership records and updates-channel surfaces remain unimplemented.
- Registrar request/support validation and the runtime evaluator that realizes
  an active Sect after the settled artist-support and music thresholds are met.
- Automated/scheduled city-tier activation and external notification delivery beyond the current profile notice context.
- Public Sect request UI, Artist/Band membership, progress visibility, and
  threshold-state presentation remain unimplemented; the named request API and
  submitter-owned readback are implemented.
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
  - must not be treated as sufficient by themselves to create Artist/Band Sect membership or activate a Sect
  - passive genre/style tag metadata may inform discovery or candidate analysis,
    but only Registrar-held Artist/Band Sect membership makes that artist's
    current eligible Home Scene Release Deck count toward readiness
- `Sect`
  - authoritative Official Sect identity scoped by `parentCommunityId`
  - unique identity constraint on `(parentCommunityId, slug)`
  - named listener requests create it transactionally with nullable
    `requestRegistrarEntryId` provenance and submitter-owned request readback
  - contains no lifecycle, Artist/Band membership, backing, readiness,
    visibility, or Uprise-activation state
- Future Artist/Band Sect membership references
  - should connect a registered Artist/Band source to the requested/legitimate
    Sect through Registrar-held membership
  - make that member artist's current eligible Home Scene Release Deck music
    count dynamically; no track-to-Sect association is required
  - must preserve the parent Home Scene/music-community context
- `User`
  - Home-scene affinity fields (`homeSceneCity`, `homeSceneState`, `homeSceneCommunity`, `homeSceneTag`, `gpsVerified`)
  - `homeSceneTag` remains relevant to system-order identity where that context is required
- Source-origin and activation-readiness read models may be added in future slices. This R1 contract does not require a migration by itself.

### Migrations
- `20260213154237_add_scene_and_sect_tags` (scene metadata + sect/user tag tables)
- `20260216004000_add_user_home_scene_and_track_engagement` (user home-scene/gps fields)
- `20260714223000_add_official_sects` (empty additive Official Sect identity table; no rows or backfill)
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
- New Sect UX should separate the listener's request from explicit Registrar-held Artist/Band membership; current eligible member-artist Release Deck duration governs the music threshold.
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
  - but tag assignment alone does not create Artist/Band Sect membership or activate a Sect
  - passive genre/style tags do not create Artist/Band Sect membership and do
    not make a non-member artist's Release Deck count toward readiness
- Sect behavior:
  - Sect Uprises remain inside the parent Home Scene/music community
  - Sect members can vote in their Sect Uprise
  - non-members can listen only according to parent scene/discovery access and cannot vote in the Sect Uprise
  - current runtime has sect-motion filing/readback only; Artist/Band Sect
    membership, readiness validation, official membership records, update
    channels, and Sect activation remain deferred
  - future readiness validation must require `2,700` counted seconds total
    across at least `5` distinct eligible registered sources after applying the
    `900`-second per-source contribution cap; it must not require `2,700`
    seconds from each source

## Future Work & Open Questions
- Lock implementation details for the metric storage/read path that evaluates the already-defined artist/source concentration threshold for splitting a new active city-tier community from an existing major-node/music-capital community.
- Define implementation details for activation metrics read paths, trigger authority, notification delivery, source assignment/cutover, future upload routing, and listener helper messaging.
- Retire or rename legacy `pioneer` runtime/test terminology once major-node assignment language is implemented end-to-end.
- Define when request, membership, legitimacy, and active-state progress become
  user-visible without adding a maturity, approval, or confirmation gate to the
  settled lifecycle.
- Define implementation artifacts for the remaining Official Sect activation
  boundary: Registrar-held Artist/Band Sect membership, current Release Deck
  aggregation, updates channel, threshold-state transitions, and visibility.
- Add explicit Uprise model and Scene<->Uprise lifecycle constraints.
- Lock propagation thresholds and policy in `docs/specs/DECISIONS_REQUIRED.md`.

## References
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Master Glossary Canon.md`
