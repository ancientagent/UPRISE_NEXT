# Moderation and Quality Control

**ID:** `SYS-MODERATION`
**Status:** `draft`
**Owner:** `platform`
**Last Updated:** `2026-02-13`

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

## Non-Functional Requirements
- Timely review process.
- Clear dispute resolution path.

## Architectural Boundaries
- Moderation does not alter Fair Play rotation.
- Reports are community actions, not algorithmic judgments.

## Data Models & Migrations
- Report
- ModerationAction
- ContentFlag

## API Design
- TBD

## Web UI / Client Behavior
- Report action visible in player and signal views.
- Users see status when content is removed or reinstated.

## Acceptance Tests / Test Plan
- Reports trigger auto‑flag after threshold.
- Admin action removes content and logs decision.

## References
- `docs/canon/Legacy Narrative plus Context .md`

## Future Work & Open Questions
- Define report thresholds and appeal timelines. See `docs/specs/DECISIONS_REQUIRED.md`.
