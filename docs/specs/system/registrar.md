# Registrar System

**ID:** `SYS-REGISTRAR`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-06-25`

## Overview & Purpose
Defines the Registrar as the listener-side civic registration surface inside The Plot where role/capability motions and prerequisite filings are formalized.

## User Roles & Use Cases
- Listener starts Artist/Band entity registration.
- Listener starts Promoter registration for event workflows.
- Community participants formalize Registrar-stage civic prerequisites when active.
- Sect participants file motion when uprising thresholds are met.

## Functional Requirements
- Registrar is a Home Scene civic surface (Activity Feed context in canon narrative).
- Registrar records and tracks registration intent/status.
- Registrar actor rule:
  - Registrar belongs to the listener/base identity side
  - source-facing routes may still expose transitional links into `/registrar` during current MVP runtime, but that bridge does not change the actor model or make Registrar a source-side tool
- Print Shop event-write access remains source-facing as well; registrar promoter capability exists to unlock that source-facing lane rather than to create a listener event-authoring flow.
- V1 target functions:
  - Artist/Band registration initiation.
  - Promoter registration initiation.
  - Registrar-stage civic prerequisite filings where active.
- Artist/Band source registration requires the registering user to be GPS-verified before materialized source identity can count toward Home Scene activation.
- A new Home Scene activates when it has at least `45` minutes of approved playable music from at least `5` distinct registered source accounts.
- No single source may occupy more than `20` minutes of any one Uprise rotation at a time.
- Sect uprising motions are registrar-mediated when threshold criteria are met (45-minute committed artist playtime threshold + explicit support).
- Sect readiness tracking may be built before it is user-visible; visibility may remain hidden, admin-only, or read-only until beta/community calibration locks maturity and backing limits.
- Sect readiness counts approved playable minutes only from registered source accounts that explicitly tag/back/affiliate with that sect; passive genre/style metadata does not count by itself.
- Sect affiliation belongs in Registrar rather than as a loose self-assigned profile tag.
- An Official Sect is a pre-Uprise Registrar-recognized subcommunity: it can appear in Registrar for discovery/affiliation and updates, but it does not grant independent broadcast authority.
- Registrar should eventually expose Official Sect context: active official sects in the current Home Scene, sects that have already uprisen, and where those uprisen sects exist.
- Sect Uprises should mirror Home Scene behavior wherever possible while remaining scoped inside the parent Home Scene/music community; sect membership/affiliation grants sect voting authority, while listening access alone does not.

## Source Origin Contract

This section owns the source-origin rules that connect Registrar filings, proxy-scene routing, and city-tier Home Scene activation. It is an owner contract for follow-up implementation slices; current runtime may still need parity work before every rule is enforced automatically.

- Source origin is the source's submitted natural `city + state + music community`, verified through Registrar/GPS authority. It is not silently replaced by the proxy scene where a listener/source operator is temporarily routed.
- Artist/Band source registration can only materialize into activation-eligible source identity when the registering user is GPS-verified for the submitted source-origin location.
- If the submitted source-origin Home Scene is active, new source uploads attach to that natural Home Scene.
- If the submitted source-origin Home Scene is inactive/unavailable, the source may operate through the assigned active proxy scene under the current Release Deck/Fair Play rules, but its submitted origin still counts toward activation readiness for the natural tuple.
- Source origin is stable after materialization unless a future explicit Registrar workflow changes it. Proxy assignment, visitor listening, or Away Scene browsing must not mutate source origin.
- Activation accounting uses registered source origin, approved playable minutes, distinct registered source count, and the per-source rotation cap.
- Listener onboarding counts, missing-music-community requests, and passive listener demand do not activate a community.
- Existing runtime field names such as `pioneer` may remain for compatibility until cleanup, but user-facing and owner-contract language should use submitted Home Scene, proxy scene, source origin, and activation readiness.

### Runtime Source-Origin Persistence

Registrar runtime persists source origin separately from proxy/operating scene identity:

- `RegistrarEntry.sceneId` remains the active operating scene for the filing.
- `RegistrarEntry.sourceOriginCity`, `sourceOriginState`, and `sourceOriginMusicCommunity` preserve the submitted natural source-origin tuple from the registering user's Home Scene metadata.
- `ArtistBand.homeSceneId` remains the active operating scene at materialization time.
- `ArtistBand.sourceOriginCity`, `sourceOriginState`, and `sourceOriginMusicCommunity` preserve the natural source-origin tuple for activation accounting.

Activation readiness APIs and trigger automation must read source-origin fields, not `ArtistBand.homeSceneId` alone, whenever source-origin and proxy-scene identity can differ.

## City-Tier Activation Authority

Registrar/source activation is the only authority path for creating or activating a new city-tier Home Scene from a major-node/proxy pattern.

- A candidate activation tuple is an inactive/unavailable `city + state + music community` with registered source-origin activity.
- The readiness threshold is at least `45` minutes of approved playable music from at least `5` distinct registered source accounts.
- No single source may contribute more than `20` minutes to any one Uprise rotation at a time.
- Only approved playable music from sources whose source origin matches the candidate tuple counts toward that candidate's city-tier activation readiness.
- The operational trigger mechanism (automatic evaluator vs explicit Registrar/admin approval gate) is an implementation contract to lock before runtime automation. The threshold itself is source/music-driven and does not depend on listener demand.
- Once activated, future listener resolution and future source uploads should route to the natural active Home Scene; existing proxy-scene songs and votes remain governed by the cutover/Fair Play lifecycle rules in the community and broadcast specs.

### Implemented Now
- Registrar-link-ready Artist/Band identity foundation exists (slice 1):
  - `ArtistBand.registrarEntryRef` stores registrar linkage reference for canonical handoff.
  - `ArtistBand` + `ArtistBandMember` provide canonical entity + membership graph.
  - Read-only retrieval endpoints exist (`GET /artist-bands/:id`, `GET /artist-bands`).
- Registrar write primitive (slice 2):
  - `RegistrarEntry` persistence model added.
  - `POST /registrar/artist` implemented for Home Scene-scoped Artist/Band registration submissions.
  - Submission constraints enforced in service:
    - city-tier Scene only,
    - request Scene must match authenticated user's Home Scene or assigned same-music-community proxy scene.
  - Source-origin tuple persistence is implemented on `RegistrarEntry` and materialized `ArtistBand`.
- Activation readiness diagnostics exist under `GET /admin/analytics/activation-readiness`:
  - read-only/admin-facing;
  - counts ready Artist/Band-backed tracks by persisted source-origin tuple;
  - caps each source at `20` playable minutes;
  - excludes already-active city-tier scenes.
- Manual activation trigger primitive exists under `POST /admin/analytics/activation-readiness/activate`:
  - authenticated/admin-facing with RBAC deferred;
  - accepts a `city + state + musicCommunity` tuple;
  - reuses source-origin readiness diagnostics and refuses activation unless the tuple meets the locked thresholds;
  - creates the natural city-tier `Community` when no row exists, or marks an inactive matching row active;
  - re-anchors matching `ArtistBand.homeSceneId` values to the natural scene for future uploads;
  - does not move existing track rows, copy votes, transfer engagement history, schedule jobs, or emit notifications.
- Registrar promoter initiation primitive (slice 34):
  - `POST /registrar/promoter` implemented for Home Scene-scoped promoter registration submissions.
  - Captures named production identity payload (`productionName`) for downstream capability processing.
  - Submission remains initiation-only (no automatic capability grant).
- Registrar promoter status list read surface (slice 42):
  - `GET /registrar/promoter/entries` implemented.
  - Returns submitter-owned promoter registrar entries in reverse-chronological order.
  - Includes scene context and payload summary (`productionName`) for registration state tracking.
  - Includes top-level status summary counts (`countsByStatus`) across returned entries.
  - Read payload normalization trims `productionName`; blank/whitespace resolves to `null`.
- Registrar promoter status detail read surface (slice 43):
  - `GET /registrar/promoter/:entryId` implemented.
  - Submitter-only read for single promoter registrar entry status tracking.
  - Returns scene context and payload summary (`productionName`) for the requested entry.
  - Read payload normalization trims `productionName`; blank/whitespace resolves to `null`.
- Transitional project/civic status read surfaces (slice 114A/114B):
  - `GET /registrar/project/entries` implemented.
  - Submitter-only list read for project registrar entries (`type = project_registration`) with reverse-chronological ordering.
  - Includes top-level `countsByStatus` summary and per-entry scene context + normalized payload summary (`projectName`).
  - List/detail read normalization is hardened to tolerate malformed/non-object payload shapes; `projectName` resolves to `null` when missing/blank/invalid shape.
  - `GET /registrar/project/:entryId` implemented for submitter-only detail read.
  - Controller parity coverage verifies detail-read error propagation (`ForbiddenException`, `NotFoundException`) and normalized payload passthrough semantics.
- Registrar sect-motion status read surfaces (slice 114A):
  - `GET /registrar/sect-motion/entries` implemented.
  - Submitter-only list read for sect-motion registrar entries (`type = sect_motion`) with reverse-chronological ordering.
  - Includes top-level `countsByStatus` summary and per-entry scene context + normalized payload object.
  - `GET /registrar/sect-motion/:entryId` implemented for submitter-only detail read.
- Registrar artist intake expansion (slice 3):
  - `POST /registrar/artist` requires submitter `gpsVerified = true`.
  - Registration payload now captures member roster:
    - `name`, `email`, `city`, `instrument`.
  - `RegistrarArtistMember` rows persist member roster + invite state.
  - Non-platform members are persisted with `inviteStatus = pending_email` for delivery handoff.
- Registrar materialization primitive (slice 4):
  - `POST /registrar/artist/:entryId/materialize` implemented.
  - Submitter-only action (entry creator must match authenticated user).
  - Materializes `ArtistBand` + owner `ArtistBandMember` from submitted registrar entry payload.
  - Idempotent when entry is already linked to an `ArtistBand`.
- Registrar invite dispatch primitive (slice 5):
  - `POST /registrar/artist/:entryId/dispatch-invites` implemented.
  - Generates invite token + expiry for pending non-platform registrar members.
  - Queues invite-delivery payload rows for email delivery worker handoff.
- Registrar invite delivery-state hardening (slice 64):
  - Invite claim surfaces now accept only claimable invite lifecycle states (`queued`, `sent`) for token preview/claim flows.
  - Internal registrar service method `finalizeQueuedInviteDelivery` added for worker/provider integration to mark queued deliveries as `sent` or `failed`.
  - Finalization path updates both delivery queue row status and member invite lifecycle status in one transaction.
- Registrar invite delivery worker seam (slice 67):
  - `InviteDeliveryProvider` interface defines pluggable invite delivery contract (`send(email, payload): Promise<'sent' | 'failed'>`).
  - `NoopInviteDeliveryProvider` implementation provides deterministic no-op delivery returning `'sent'` (no external I/O).
  - `RegistrarInviteDeliveryWorkerService` queries queued delivery rows, invokes provider, finalizes delivery status via `RegistrarService.finalizeQueuedInviteDelivery`.
  - Worker service is wired for DI in `RegistrarModule` with provider interface for future real email provider substitution.
  - Worker loop handles success/failure/exception paths and continues processing on partial failures.
  - No scheduler/cron wiring; worker must be invoked explicitly via manual call or future automation lane.
  - No real email provider integration; delivery execution remains no-op until provider substitution.
- Registrar invite claim bootstrap (slice 6):
  - `POST /auth/invite-preview` implemented for invite prefill context lookup prior to claim.
  - `POST /auth/register-invite` implemented to claim invite tokens and create platform user accounts.
  - Claim marks registrar member row as `claimed` and links `claimedUserId`.
  - Home Scene defaults are prefilled from registrar scene context; GPS remains required for civic voting.
- Registrar invite tracking read surface (slice 7):
  - `GET /registrar/artist/:entryId/invites` implemented.
  - Submitter-only access.
  - Returns roster rows plus invite status counts (`pending_email`, `queued`, `claimed`, etc.).
- Registrar invite delivery outcome read surface (slice 66):
  - `GET /registrar/artist/:entryId/invites` response extended with per-member delivery outcome fields.
  - Each member row now includes `deliveryStatus` (`queued`/`sent`/`failed`/`null`), `sentAt` (timestamp when delivery finalized as `sent`, else `null`), and `failedAt` (timestamp when delivery finalized as `failed`, else `null`).
  - Fields are derived from the existing `RegistrarInviteDelivery` row joined per member; no schema migration required.
  - Raw `deliveries` array is not exposed; only the mapped outcome fields are returned.
  - Additive/non-breaking: callers that do not consume the new fields are unaffected.
- Registrar capability-code verification/redemption primitives (slice 95):
  - `POST /registrar/code/verify` implemented (auth required) for capability-code validation prior to redemption.
  - `POST /registrar/code/redeem` implemented (auth required) to mark redeemable registrar codes as redeemed.
  - Redemption is guarded by locked policy constraints:
    - linked registrar entry type must be `promoter_registration`,
    - linked registrar entry status must be `approved`,
    - code must be in `issued` status and not expired/redeemed.
  - Additive API surface; no destructive migration.
- Promoter capability transition state persistence/read enrichment (slice 96):
  - `POST /registrar/code/redeem` now upserts additive `UserCapabilityGrant` rows for authenticated redeemers.
  - Promoter submitter read surfaces now include `promoterCapability` transition summary:
    - `codeIssuedCount`,
    - `latestCodeStatus`,
    - `latestCodeIssuedAt`,
    - `latestCodeRedeemedAt`,
    - `granted`,
    - `grantedAt`.
  - Capability grant provenance is linked to source registrar entry/code IDs for traceability.
- Capability grant audit persistence/read surface (slice 97):
  - Capability issuance/redemption/grant transitions now persist audit events in `CapabilityGrantAuditLog`.
  - Audit events are recorded for:
    - `code_issued`,
    - `code_redeemed`,
    - `capability_granted`.
  - Submitter-owned promoter audit read endpoint implemented:
    - `GET /registrar/promoter/:entryId/capability-audit`.
- Registrar registration status list read surface (slice 11):
  - `GET /registrar/artist/entries` implemented.
  - Returns submitter-owned Artist/Band registrar entries in reverse-chronological order.
  - Includes per-entry member + invite lifecycle summary counts for registrar follow-up actions.
  - Includes materialized canonical Artist/Band summary (`id`, `name`, `slug`, `entityType`) when linked.
- Registrar registration status list invite-outcome enrichment (slice 70):
  - `GET /registrar/artist/entries` invite lifecycle summary now includes `sentInviteCount` and `failedInviteCount`.
  - Keeps existing counts (`pendingInviteCount`, `queuedInviteCount`, `claimedCount`, `existingUserCount`) unchanged.
  - Additive/non-breaking read-surface enrichment for submitter tracking.
- Registrar registration status list top-level invite summary (slice 71):
  - `GET /registrar/artist/entries` now returns top-level `inviteCountsByStatus` aggregated across submitter-owned registrar artist members.
  - Empty-state responses include `inviteCountsByStatus: {}` for stable shape parity.
- Registrar registration status list last-dispatch timestamp (slice 72):
  - `GET /registrar/artist/entries` now includes per-entry `lastInviteDispatchAt` (latest non-null `RegistrarInviteDelivery.dispatchedAt` for each registration entry).
  - `lastInviteDispatchAt` is `null` when no invite dispatch has been finalized for the entry.
- Registrar invite delivery automated trigger lane (slice 73):
  - Internal trigger service supports env-gated interval execution of queued invite delivery processing.
  - Trigger remains default-off and uses overlap guards to prevent concurrent worker runs.
- Registrar invite finalize replay-safety hardening (slice 75):
  - `finalizeQueuedInviteDelivery` now mutates delivery/member status only when the delivery row is still `queued`.
  - Repeated finalize attempts return existing finalized state without overwriting.
- Registrar outbound webhook invite provider option (slice 78):
  - Added outbound webhook invite delivery provider path with provider selection via environment configuration.
  - URL/timeout guardrails and provider-selection coverage are implemented.
- Registrar member sync primitive (slice 13):
  - `POST /registrar/artist/:entryId/sync-members` implemented.
  - Submitter-only action for materialized registrations.
  - Idempotently links eligible registrar members (`existing_user` + `claimed`) into canonical `ArtistBandMember` rows.
- Registrar web entrypoint + intake UI (slice 10):
  - Plot scene activity panel includes explicit `Open Registrar` action.
  - `/registrar` route now presents `Band / Artist Registration` option before form entry.
  - Form captures `name`, `entityType`, and member roster (`name`, `email`, `city`, `instrument`).
  - Client resolves Home Scene tuple to city-tier scene ID and enforces GPS-verified submit gate before API call.
- Registrar web status/action panel (slice 12):
  - `/registrar` now reads submitter-owned registration entries from `GET /registrar/artist/entries`.
  - Exposes next-step actions for existing registrar APIs:
    - materialize registration (`POST /registrar/artist/:entryId/materialize`),
    - queue invites (`POST /registrar/artist/:entryId/dispatch-invites`),
    - read invite summary (`GET /registrar/artist/:entryId/invites`).
  - Displays per-entry invite lifecycle summary counts for submitter follow-up.
- Registrar promoter web intake/status (slice 121):
  - `/registrar` now exposes a `Promoter Registration` action alongside Artist/Band registration.
  - Promoter intake submits `productionName` to `POST /registrar/promoter` using the same Home Scene resolution + GPS gating as other registrar civic submissions.
  - `/registrar` now reads submitter-owned promoter registration history from `GET /registrar/promoter/entries`.
  - Web surface supports explicit follow-up reads for:
    - `GET /registrar/promoter/:entryId`,
    - `GET /registrar/promoter/:entryId/capability-audit`.
  - Registrar web surface now includes an eligibility snapshot clarifying that filings remain Home Scene-bound, visitor listening context does not change registrar scope, and promoter event creation remains blocked until capability is granted and the Print Shop event-write lane is published.
- Registrar code verification/redemption web intake (slice 122):
  - `/registrar` now exposes a `Promoter Capability Code` panel.
  - Web surface supports explicit authenticated calls to:
    - `POST /registrar/code/verify`,
    - `POST /registrar/code/redeem`.
  - Verify/redeem remains user-driven; no auto-redeem behavior is introduced.
  - Redemption success refreshes promoter registrar status so capability-grant reads stay current on the same page.
  - Current source-facing surfaces may still link people back into `/registrar` as a transitional bridge, but the capability lane itself remains listener-owned rather than a standalone source-side workflow.
- Registrar source-context visibility bridge (slice 124):
  - `/registrar` may surface current source-side operating context when the signed-in user has a managed source selected.
  - That source context is informational only; Registrar submissions remain Home Scene-bound and listener-owned.
  - Source Dashboard may remain a return path for source-attached users without changing Registrar into a source-side operating surface.
- Registrar web canonical member-sync action (slice 14):
  - `/registrar` status panel now includes explicit `Sync Eligible Members` action.
  - Action calls `POST /registrar/artist/:entryId/sync-members` for materialized entries.
  - Keeps membership linking user-driven (no automatic background sync).
- Registrar web sync eligibility guard (slice 22):
  - `Sync Eligible Members` action is enabled only when registrar entry has eligible linked members (`existing_user` + `claimed`).
  - Action remains explicit and submitter-driven.
- Identity contract migration alignment (slice 26):
  - User detail/profile read contracts no longer expose legacy `isArtist`.
  - Transitional alias `isArtistTransitional` is also removed from user detail/profile read contracts.
- Identity persistence cleanup alignment (slice 33):
  - Legacy `User.isArtist` column removed from persistence schema after caller migration reached zero.
- Transitional project submission primitive (slice 98A):
  - `POST /registrar/project` implemented for Home Scene-scoped project registration submissions.
  - Persists registrar entry baseline lifecycle (`type = project_registration`, `status = submitted`) with project name payload.
  - Reuses registrar scene/user guardrails (city-tier scene + requester Home Scene tuple match).
- Registrar sect-motion submission skeleton (slice 99A):
  - `POST /registrar/sect-motion` implemented as additive skeleton submission primitive.
  - Persists registrar entry baseline lifecycle (`type = sect_motion`, `status = submitted`) with minimal payload (`{}`) until motion artifact schema is canon-locked.
  - Reuses registrar scene/user guardrails (city-tier scene + requester Home Scene tuple match).
- Registrar project web contract scaffolding (slice 98A web lane):
  - API surfaces are implemented and web typed contract/client support is available for:
    - `POST /registrar/project`,
    - `GET /registrar/project/entries`,
    - `GET /registrar/project/:entryId`.
  - No new registrar UI action/CTA added; web surface remains action-gated per spec.
- Registrar sect-motion web read contract scaffolding (slice 123A web lane):
  - API surfaces are implemented and web typed contract/client support is available for:
    - `GET /registrar/sect-motion/entries`,
    - `GET /registrar/sect-motion/:entryId`.
  - Web endpoint inventory tracks these as API-implemented/web-action-gated gaps.
- Registrar docs consistency pass (slice 152A):
  - Implemented-now wording is normalized for completed batch3/batch4 read-contract work so API-implemented surfaces and web action-gated status remain explicitly distinguished.
- Registrar batch9 implemented-now/deferred consistency pass (slice 274A):
  - Batch9 Lane E QA/review slices (270A-273A) are documentation/validation only and do not add new registrar runtime behavior.
  - Implemented-now and deferred boundaries remain unchanged from previously completed registrar API/web contract slices.
- Registrar batch11 implemented-now/deferred wording sync (slice 334A):
  - Batch11 Lane E QA/review slices (330A-333A) are documentation/validation only and do not add new registrar runtime behavior.
  - Implemented-now and deferred boundaries remain unchanged from previously completed registrar API/web contract slices.
- Registrar batch12 implemented-now/deferred wording sync (slice 364A):
  - Batch12 Lane E QA/review slices (360A-363A) are documentation/validation only and do not add new registrar runtime behavior.
  - Implemented-now and deferred boundaries remain unchanged from previously completed registrar API/web contract slices.
- Registrar batch13 implemented-now/deferred wording sync (slice 394A):
  - Batch13 Lane E QA/review slices (390A-393A) are documentation/validation only and do not add new registrar runtime behavior.
  - Implemented-now and deferred boundaries remain unchanged from previously completed registrar API/web contract slices.
- Registrar batch14 implemented-now/deferred wording sync (slice 424A):
  - Batch14 Lane E QA/review slices (420A-423A) are documentation/validation only and do not add new registrar runtime behavior.
  - Implemented-now and deferred boundaries remain unchanged from previously completed registrar API/web contract slices.

### Deferred (Not Implemented Yet)
- Registrar-admin approval/issuance orchestration workflows for promoter capability codes.
- Registrar-gated promoter capability revocation/admin-management flows.
- Outbound invite email sender worker/provider integration (dispatch rows are now queued).
- Automated execution lane for queued invite deliveries (scheduler/worker trigger wiring).
- Project activation lifecycle beyond registrar submission primitive (signal linkage, follow/blast/support handoff).
- Automated city-tier Home Scene trigger execution and cutover orchestration.
- Sect motion lifecycle and approval state machine.
- Sect readiness tracking visibility and unlock controls.
- Official Sect affiliation, discovery, and updates-channel information architecture.
- Source/song sect-backing limits and paid/free backing capacity after beta/community calibration.

### Policy Lock (2026-02-24, P3-REV-001)
- `RegistrarCode` issuance authority is system-only (trusted API-tier registrar paths); no user self-issuance.
- Issuance precondition is `RegistrarEntry.status = approved` for capability-code handoff flows.
- Phase 3 kickoff scope applies this lock to promoter capability flow (`RegistrarEntry.type = promoter_registration`).

## Non-Functional Requirements
- Traceability: registrar actions must be auditable.
- Integrity: registrar records are append-oriented and cannot be silently mutated.
- Clarity: registrar operations are civic process, not ranking or promotion logic.

## Architectural Boundaries
- Registrar cannot bypass Fair Play, voting, or propagation constraints.
- Registrar actions do not grant automatic visibility or authority.
- Registrar must remain Scene-scoped to preserve structural locality.
- Registrar-held sect affiliation must preserve the parent Home Scene context and must not turn sects into isolated standalone city/music-community replacements.
- Registrar promoter capability should be interpreted as gating a source-facing Print Shop/event lane, not a listener-facing event-creation surface.
- Registrar source-origin authority must not be overridden by proxy-scene routing or source-dashboard context.

## Data Models & Migrations
### Target Models (Planned)
- `RegistrarCode` (for capability completion handoff flows)
- Project linkage to `Signal` rows for follow/blast/support
- Sect motion artifact and committed artist-catalog references
- Explicit registered-source sect backing/readiness references; passive tags must remain non-authoritative for realization
- Registrar-held Official Sect affiliation records and update-channel references
- Activation diagnostics/read models for source-origin readiness may be added later, but no migration is required by this R1 contract.

### Prisma Models (Implemented)
- `RegistrarEntry` (`type`, `status`, `sceneId`, `createdById`, `artistBandId?`, `payload`, timestamps)
- `RegistrarArtistMember` (`registrarEntryId`, `name`, `email`, `city`, `instrument`, `existingUserId?`, `inviteStatus`, timestamps)
- `RegistrarInviteDelivery` (`registrarArtistMemberId`, `email`, `status`, `payload`, `dispatchedAt`, timestamps)
- `UserCapabilityGrant` (`userId`, `capability`, `status`, `sourceRegistrarEntryId?`, `sourceRegistrarCodeId?`, `grantedAt`, `revokedAt?`, timestamps)
- `CapabilityGrantAuditLog` (`capability`, `action`, `actorType`, `targetUserId?`, `actorUserId?`, `registrarEntryId?`, `registrarCodeId?`, `metadata?`, `createdAt`)

### Migrations
- `20260220130000_add_artist_bands_identity` introduces registrar-link-ready Artist/Band persistence (`registrarEntryRef` placeholder).
- `20260220141000_add_registrar_entries` adds `registrar_entries` for Home Scene-scoped registration submissions.
- `20260220170000_add_registrar_artist_members` adds `registrar_artist_members` roster/invite persistence for registrar artist submissions.
- `20260220183000_add_registrar_invite_delivery` adds invite token fields + `registrar_invite_deliveries` queue table.
- `20260224200000_add_user_capability_grants` adds additive `user_capability_grants` for capability transition tracking.
- `20260224213000_add_capability_grant_audit_logs` adds additive `capability_grant_audit_logs` for registrar capability traceability.

## API Design
### Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/registrar/artist` | required | Initiate Artist/Band entity registration (submission entry) |
| POST | `/registrar/artist/:entryId/materialize` | required | Materialize submitted registrar entry into canonical Artist/Band entity |
| POST | `/registrar/artist/:entryId/dispatch-invites` | required | Queue invite deliveries for pending non-platform registrar members |
| POST | `/registrar/artist/:entryId/sync-members` | required | Sync eligible registrar members into canonical Artist/Band membership graph |
| GET | `/registrar/artist/:entryId/invites` | required | Read invite roster + status summary for submitter-owned registration |
| GET | `/registrar/artist/entries` | required | List submitter-owned Artist/Band registrar entries + member/invite summary counts |
| POST | `/registrar/promoter` | required | Initiate promoter registration |
| GET | `/registrar/promoter/entries` | required | List submitter-owned promoter registrar entries + scene context |
| GET | `/registrar/promoter/:entryId` | required | Read submitter-owned promoter registrar entry detail + scene context |
| GET | `/registrar/promoter/:entryId/capability-audit` | required | Read submitter-owned promoter capability audit events |
| POST | `/registrar/code/verify` | required | Verify registrar capability-code eligibility for redemption |
| POST | `/registrar/code/redeem` | required | Redeem registrar capability-code for authenticated user |
| GET | `/registrar/project/entries` | required | List submitter-owned project registrar entries + scene context |
| GET | `/registrar/project/:entryId` | required | Read submitter-owned project registrar entry detail + scene context |
| GET | `/registrar/sect-motion/entries` | required | List submitter-owned sect-motion registrar entries + scene context |
| GET | `/registrar/sect-motion/:entryId` | required | Read submitter-owned sect-motion registrar entry detail + scene context |
| POST | `/registrar/project` | required | Register project for signal activation |
| POST | `/registrar/sect-motion` | required | File sect uprising motion (post-threshold) |

## Web UI / Client Behavior
- Registrar entrypoint should be reachable from The Plot civic surfaces.
- Source-facing surfaces may expose transitional links back into `/registrar`, but the actual Registrar workflow remains listener-side rather than a source-dashboard-native tool.
- Users should be able to inspect registration state and required next actions.
- Artist/Band registration must remain explicit action-driven (`Band / Artist Registration`) before form submission.
- Registrar form submit behavior must preserve Home Scene + GPS preconditions prior to API write attempts.
- Registrar web panel may only expose explicit, spec-authorized registrar follow-up actions (no auto-materialization/auto-dispatch).
- Registrar/source activation status may be exposed as read-only context after owner implementation, but it must not create public listener-side activation promises.

## Acceptance Tests / Test Plan
- Registrar submissions are Scene-scoped and auditable.
- Artist/Band source origin is preserved separately from temporary proxy assignment.
- Activation readiness counts only approved playable music from matching source-origin sources.
- Listener onboarding or missing-community request counts do not satisfy city-tier activation readiness.
- Duplicate submissions are idempotent or explicitly versioned by state.
- Registrar outcomes never alter Fair Play ordering directly.
- DB-backed integration coverage validates invite delivery lifecycle:
  - submit artist registration with non-platform members,
  - dispatch invite queue rows,
  - finalize queued rows as `sent`/`failed`,
  - read invite status surface with mapped delivery outcome fields.

## Future Work & Open Questions
- Finalize schema for role registration code flows with locked policy guardrails (`system-only` issuer authority + `approved` issuance precondition).
- Lock implementation details for activation metrics storage/read path, trigger authority, notification path, and source-origin cutover side effects.
- Define who can submit and approve Sect uprising motions.
- Beta-calibrate when sect progress becomes public and which paid/free backing limits are allowed.
- Define the Registrar menu architecture for Official Sect discovery, affiliation, updates, and cross-scene uprisen-sect context.
- Lock registrar moderation/appeal behavior for rejected motions.

## References
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Narrative Canon.md`
