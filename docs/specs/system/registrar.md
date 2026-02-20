# Registrar System

**ID:** `SYS-REGISTRAR`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-02-20`

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
- Registrar invite claim bootstrap (slice 6):
  - `POST /auth/invite-preview` implemented for invite prefill context lookup prior to claim.
  - `POST /auth/register-invite` implemented to claim invite tokens and create platform user accounts.
  - Claim marks registrar member row as `claimed` and links `claimedUserId`.
  - Home Scene defaults are prefilled from registrar scene context; GPS remains required for civic voting.
- Registrar invite tracking read surface (slice 7):
  - `GET /registrar/artist/:entryId/invites` implemented.
  - Submitter-only access.
  - Returns roster rows plus invite status counts (`pending_email`, `queued`, `claimed`, etc.).

### Deferred (Not Implemented Yet)
- Role registration code issuance and verification workflows.
- Registrar-gated create/update writes for Artist/Band entities beyond submission intake.
- Outbound invite email sender worker/provider integration (dispatch rows are now queued).
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
| GET | `/registrar/artist/:entryId/invites` | required | Read invite roster + status summary for submitter-owned registration |
| POST | `/registrar/promoter` | required | Initiate promoter registration |
| POST | `/registrar/project` | required | Register project for signal activation |
| POST | `/registrar/sect-motion` | required | File sect uprising motion (post-threshold) |

## Web UI / Client Behavior
- Registrar entrypoint should be reachable from The Plot civic surfaces.
- Users should be able to inspect registration state and required next actions.

## Acceptance Tests / Test Plan
- Registrar submissions are Scene-scoped and auditable.
- Duplicate submissions are idempotent or explicitly versioned by state.
- Registrar outcomes never alter Fair Play ordering directly.

## Future Work & Open Questions
- Finalize schema for role registration code flows.
- Define who can submit and approve Sect uprising motions.
- Lock registrar moderation/appeal behavior for rejected motions.

## References
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Narrative Canon.md`
