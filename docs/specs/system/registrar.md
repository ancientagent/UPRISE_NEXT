# Registrar System

**ID:** `SYS-REGISTRAR`
**Status:** `draft`
**Owner:** `platform`
**Last Updated:** `2026-02-13`

## Overview & Purpose
Defines the Registrar as the civic hub where roles and projects are registered and activated.

## User Roles & Use Cases
- Listener registers as Artist/Band or Promoter.
- Community members register Projects after discussion.
- Future: Sect motions are filed to initiate a new Uprise.

## Functional Requirements
- Registrar is located in the **Feed** tab of The Plot.
- V1 registration functions:
  - Artist/Band registration generates a completion code for the WebApp.
  - Promoter registration generates a completion code for the WebApp.
- Project registration:
  - Projects are proposed in Social message boards.
  - Registrar activates a Project as a followable signal.
- Future registrar functions include Sect motions and other civic actions.

## Non-Functional Requirements
- Clarity: Registrar functions are civic, not administrative.
- Traceability: registration actions are logged.

## Architectural Boundaries
- Registrar does not override canon definitions or governance rules.
- Web tier initiates registration through API only.

## Data Models & Migrations
### Prisma Models
- RegistrarEntry (type, status, owner)
- Artist/Band registration code
- Promoter registration code
- Project signal

### Migrations
- TBD

## API Design
### Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/registrar/artist` | required | Start artist registration |
| POST | `/registrar/promoter` | required | Start promoter registration |
| POST | `/registrar/project` | required | Register a project |

## Web UI / Client Behavior
- Registrar is accessible from the Feed tab.
- Users can see registration status and instructions.

## Acceptance Tests / Test Plan
- Artist registration creates a code and WebApp completion path.
- Project registration creates a followable signal.

## Future Work & Open Questions
- Define Sect motion workflow and thresholds.
- Define Registrar permissions for new civic actions.

## References
- `docs/canon/Legacy Narrative plus Context .md`
