# Moderation and Quality Control

**ID:** `SYS-MODERATION`
**Status:** `active`
**Owner:** `platform`
**Last Updated:** `2026-02-16`

## Overview & Purpose
Defines quality checks, reporting, and moderation processes for content and users.

## User Roles & Use Cases
- Listeners report inappropriate content.
- Admins review and take action on flagged content.
- Automated checks validate audio uploads.

## Functional Requirements
- Automated quality checks:
  - Supported formats: mp3, wav, flac, m4a, aac.
  - File size limit: 100MB.
  - Duration: 30 seconds to 10 minutes.
  - Corruption and header validation.
  - Silence detection (max 30 seconds).
  - Acoustic fingerprinting for copyright.
- Community reporting available on Signals and users.
- Multiple reports trigger auto‑flag and temporary removal.
- Admin review queue for flagged items.
- Content standards prohibit hate, threats, illegal content, and unlicensed material.

### Implemented Now
- No dedicated moderation/report API routes exist yet.
- No automated audio quality pipeline exists in current codebase.

### Deferred (Not Implemented Yet)
- Report ingestion endpoints and moderation queue.
- Auto-flag threshold engine.
- Admin moderation action endpoints and appeal workflow.
- Upload quality checks and copyright fingerprinting integration.

## Non-Functional Requirements
- Timely review process.
- Clear dispute resolution path.

## Architectural Boundaries
- Moderation does not alter Fair Play rotation.
- Reports are community actions, not algorithmic judgments.

## Data Models & Migrations
### Planned Models
- `Report`
- `ModerationAction`
- `ContentFlag`
- optional `Appeal`

### Migrations
- None yet.

## API Design
### Planned Endpoints (Not Implemented)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/reports` | required | Report content/user |
| GET | `/moderation/queue` | admin | View flagged items |
| POST | `/moderation/actions` | admin | Apply moderation action |
| POST | `/moderation/appeals` | required | Submit appeal |

## Web UI / Client Behavior
- Report action should be visible in player/signal surfaces once reporting endpoints exist.
- Users must see clear status and reason messaging for removals and reinstatements.

## Acceptance Tests / Test Plan
- Report submissions are persisted with category and actor.
- Auto-flag behavior triggers only at locked threshold.
- Moderation actions are auditable and reversible by policy.

## References
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Narrative Canon.md`

## Future Work & Open Questions
- Define report thresholds and appeal timelines. See `docs/specs/DECISIONS_REQUIRED.md`.
