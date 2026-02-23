# Registrar System

**ID:** `SYS-REGISTRAR`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-02-21`

## Overview & Purpose
Defines the Registrar as the civic registration surface inside The Plot where role/capability motions and project activations are formalized.

## User Roles & Use Cases
- Listener starts Artist/Band entity registration.
- Listener starts Promoter registration for event workflows.
- Community participants formalize Project signals after discussion.
- Sect participants file motion when uprising thresholds are met.

## Functional Requirements
- Registrar is a Home Scene civic surface (Activity Feed context in canon narrative).
- Registrar records and tracks registration intent/status.
- V1 target functions:
  - Artist/Band registration initiation.
  - Promoter registration initiation.
  - Project registration/activation into signal space.
- Sect uprising motions are registrar-mediated when threshold criteria are met (45-minute committed artist playtime threshold + explicit support).

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
    - request Scene must match authenticated user's Home Scene.
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
  - `GET /registrar/artist/entries` now returns top-level `inviteCountsByStatus` aggregated across submitter-owned artist registration members.
  - Empty-state responses include `inviteCountsByStatus: {}` for stable shape parity.
  - Additive/non-breaking read-surface enrichment for lightweight registrar status dashboards.
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

### Deferred (Not Implemented Yet)
- Role registration code issuance and verification workflows.
- Registrar-gated create/update writes for Promoter capabilities beyond submission intake.
- Outbound invite email sender worker/provider integration (dispatch rows are now queued).
- Automated execution lane for queued invite deliveries (scheduler/worker trigger wiring).
- Dedicated project registration endpoint(s) and status lifecycle.
- Sect motion lifecycle and approval state machine.

## Non-Functional Requirements
- Traceability: registrar actions must be auditable.
- Integrity: registrar records are append-oriented and cannot be silently mutated.
- Clarity: registrar operations are civic process, not ranking or promotion logic.

## Architectural Boundaries
- Registrar cannot bypass Fair Play, voting, or propagation constraints.
- Registrar actions do not grant automatic visibility or authority.
- Registrar must remain Scene-scoped to preserve structural locality.

## Data Models & Migrations
### Target Models (Planned)
- `RegistrarCode` (for capability completion handoff flows)
- Project linkage to `Signal` rows for follow/blast/support
- Sect motion artifact and committed artist-catalog references

### Prisma Models (Implemented)
- `RegistrarEntry` (`type`, `status`, `sceneId`, `createdById`, `artistBandId?`, `payload`, timestamps)
- `RegistrarArtistMember` (`registrarEntryId`, `name`, `email`, `city`, `instrument`, `existingUserId?`, `inviteStatus`, timestamps)
- `RegistrarInviteDelivery` (`registrarArtistMemberId`, `email`, `status`, `payload`, `dispatchedAt`, timestamps)

### Migrations
- `20260220130000_add_artist_bands_identity` introduces registrar-link-ready Artist/Band persistence (`registrarEntryRef` placeholder).
- `20260220141000_add_registrar_entries` adds `registrar_entries` for Home Scene-scoped registration submissions.
- `20260220170000_add_registrar_artist_members` adds `registrar_artist_members` roster/invite persistence for registrar artist submissions.
- `20260220183000_add_registrar_invite_delivery` adds invite token fields + `registrar_invite_deliveries` queue table.

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
| POST | `/registrar/project` | required | Register project for signal activation |
| POST | `/registrar/sect-motion` | required | File sect uprising motion (post-threshold) |

## Web UI / Client Behavior
- Registrar entrypoint should be reachable from The Plot civic surfaces.
- Users should be able to inspect registration state and required next actions.
- Artist/Band registration must remain explicit action-driven (`Band / Artist Registration`) before form submission.
- Registrar form submit behavior must preserve Home Scene + GPS preconditions prior to API write attempts.
- Registrar web panel may only expose explicit, spec-authorized registrar follow-up actions (no auto-materialization/auto-dispatch).

## Acceptance Tests / Test Plan
- Registrar submissions are Scene-scoped and auditable.
- Duplicate submissions are idempotent or explicitly versioned by state.
- Registrar outcomes never alter Fair Play ordering directly.
- DB-backed integration coverage validates invite delivery lifecycle:
  - submit artist registration with non-platform members,
  - dispatch invite queue rows,
  - finalize queued rows as `sent`/`failed`,
  - read invite status surface with mapped delivery outcome fields.

## Future Work & Open Questions
- Finalize schema for role registration code flows.
- Define who can submit and approve Sect uprising motions.
- Lock registrar moderation/appeal behavior for rejected motions.

## References
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Narrative Canon.md`
