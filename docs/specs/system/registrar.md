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
- No dedicated Registrar API routes or persistence models exist yet.
- Related primitives are present:
  - Signal creation/actions (`/signals`, `/signals/:id/support`, etc.) can represent project-like propagation once a project signal exists.

### Deferred (Not Implemented Yet)
- Role registration code issuance and verification workflows.
- Registrar-gated create/update writes for Artist/Band entities (current slice is read-only retrieval).
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
- `RegistrarEntry` (`type`, `status`, `sceneId`, `createdById`, timestamps)
- `RegistrarCode` (for capability completion handoff flows)
- Project linkage to `Signal` rows for follow/blast/support
- Sect motion artifact and committed artist-catalog references

### Migrations
- `20260220130000_add_artist_bands_identity` introduces registrar-link-ready Artist/Band persistence (`registrarEntryRef` placeholder).
- full Registrar tables remain deferred.

## API Design
### Planned Endpoints (Not Implemented)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/registrar/artist` | required | Initiate Artist/Band entity registration |
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
