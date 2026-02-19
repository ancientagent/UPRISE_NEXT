# Sprint 1 Plan — MVP Build

**Goal:** Implement the first runnable slice of the platform with Home Scene onboarding and RaDIYo playback.

## Scope
### Data Models
- Scene (City, State, Music Community)
- User (HomeSceneId, GPSVerified)
- ArtistProfile + ArtistMembership
- Song
- PlayDeck (rotation slots)

### API
- Onboarding: set Home Scene + GPS status
- Scene lookup + resolution
- Broadcast fetch (RaDIYo)
- Vote endpoint (tier propagation only)

### UI
- Onboarding flow (City / State / Music Community)
- Home Scene entry (The Plot shell)
- RaDIYo player (non‑personalized)

### Fair Play (Skeleton)
- Two-pool broadcast lifecycle (New Releases -> Main Rotation)
- Density-adaptive new-window assignment with hysteresis
- Main Rotation recurrence weight generation (upvotes separated for propagation)

## Dependencies
- Decisions locked in Sprint 0
- Canon specs in `docs/specs/`

## Deliverables
- Working onboarding flow
- Working RaDIYo playback endpoint
- Minimal Two-Pool Fair Play scheduling

## Risks
- Threshold decisions may still be open
- Data model changes if canon is updated

## Exit Criteria
- MVP flow runs end‑to‑end locally
- No web‑tier boundary violations
- Specs updated to reflect implementation details
