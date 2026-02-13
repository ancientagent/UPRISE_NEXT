# Edge Cases and Compliance

**ID:** `SYS-EDGE`
**Status:** `draft`
**Owner:** `platform`
**Last Updated:** `2026-02-13`

## Overview & Purpose
Defines edge cases for Home Scene changes, Sect thresholds, naming conflicts, and copyright compliance.

## User Roles & Use Cases
- Listener changes Home Scene after relocation.
- Sect broadcast pauses when thresholds drop.
- Admin resolves naming conflicts.

## Functional Requirements
- Home Scene changes:
  - One Home Scene at a time.
  - 30‑day cooldown between changes.
  - Voting transfers only after GPS verification.
- Sect threshold drop:
  - Broadcast pauses.
  - Members are routed back to Parent Scene.
  - Content is preserved for reactivation.
- Name conflicts resolved by system key and admin review.
- Copyright compliance:
  - Prohibit unlicensed covers, remixes, samples, and AI impersonation.
  - Acoustic fingerprinting on upload.
  - Immediate removal on flagged content pending review.
  - Counter‑claim process for disputes.

## Non-Functional Requirements
- Clear user messaging for transitions and removals.
- Compliance aligned with DMCA requirements.

## Architectural Boundaries
- Platform enforces compliance but does not adjudicate disputes.

## Data Models & Migrations
- HomeSceneChangeLog
- SectStatus
- CopyrightClaim

## API Design
- TBD

## Web UI / Client Behavior
- Users can request Home Scene change with cooldown notice.
- Content removed shows compliance notice and appeal path.

## Acceptance Tests / Test Plan
- Home Scene change blocked within cooldown.
- Sect broadcast pauses on threshold failure.

## References
- `docs/canon/Legacy Narrative plus Context .md`
