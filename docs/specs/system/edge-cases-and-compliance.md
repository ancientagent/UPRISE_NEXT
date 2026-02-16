# Edge Cases and Compliance

**ID:** `SYS-EDGE`
**Status:** `active`
**Owner:** `platform`
**Last Updated:** `2026-02-16`

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

### Implemented Now
- Home Scene is persisted on user profile.
- GPS verification for voting eligibility is implemented and returns explicit reason codes when verification fails.
- Unknown Home Scene input creates inactive pioneer community records.

### Deferred (Not Implemented Yet)
- Home Scene change cooldown workflow (30-day lock and transfer process).
- Sect broadcast pause/reactivation lifecycle.
- Name-conflict resolution admin tooling.
- Copyright claim ingestion, takedown, and counter-claim pipeline.

## Non-Functional Requirements
- Clear user messaging for transitions and removals.
- Compliance aligned with DMCA requirements.

## Architectural Boundaries
- Platform enforces compliance but does not adjudicate disputes.

## Data Models & Migrations
### Implemented Models
- `User` home-scene affinity fields and GPS status
- `Community` scene identity fields

### Planned Models
- `HomeSceneChangeLog`
- `SectStatus`
- `CopyrightClaim`
- optional `DMCARequest` / `CounterClaim`

## API Design
### Implemented Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/onboarding/home-scene` | required | Set/resolve Home Scene |
| POST | `/onboarding/gps-verify` | required | Verify geofence and voting eligibility |

### Planned Endpoints (Not Implemented)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/users/me/home-scene/change` | required | Request Home Scene change |
| POST | `/compliance/copyright/claims` | required | Submit copyright claim |
| POST | `/compliance/copyright/counter-claims` | required | Submit counter-claim |

## Web UI / Client Behavior
- Users can request Home Scene change with cooldown notice.
- Content removed shows compliance notice and appeal path.

## Acceptance Tests / Test Plan
- Home Scene change blocked within cooldown.
- Sect broadcast pauses on threshold failure.
- GPS verify reason codes map to clear user-facing compliance/help text.

## References
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Narrative Canon.md`

## Future Work & Open Questions
- Confirm Sect threshold values for pause/reactivation. See `docs/specs/DECISIONS_REQUIRED.md`.
