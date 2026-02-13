# Onboarding and Home Scene Resolution

**ID:** `USER-ONBOARDING`
**Status:** `draft`
**Owner:** `platform`
**Last Updated:** `2026-02-13`

## Overview & Purpose
Defines the onboarding flow for selecting a Home Scene and the input-driven resolution logic that routes users to the correct Scene or Sect.

## User Roles & Use Cases
- New Listener selects a Home Scene during onboarding.
- Listener denies GPS and still participates without voting.
- User enters a subsect term and is routed to the Parent Scene with a tag.
- User enters a new city or unlisted scene and receives pioneer routing.

## Functional Requirements
- Onboarding asks: “What is your local music scene of choice?”
- Inputs must include **City**, **State**, **Music Community** with autocomplete from existing data.
- Home Scene selection is stored regardless of GPS verification.
- GPS verification is requested **only** to enable voting rights.
- If GPS is denied or unavailable, user remains Locally Affiliated but cannot vote.
- Input-driven resolution:
  - If City + Music Community matches an active Home Scene, join it.
  - If City + text matches an active Sect, join the Parent Scene and apply the tag.
  - If City + text maps to a Parent Scene, join the Parent Scene and apply the tag.
  - If unknown, create an incubating tag and join the Parent Scene; flag the user as a pioneer.
- If a city has no active Home Scene, inform the user, attach their city to their profile, and mark for pioneer recruitment tools while routing to the Parent Scene of the chosen music community.

## Non-Functional Requirements
- Clarity: onboarding copy must avoid “genre selection” language.
- Consistency: Home Scene is always defined as City + State + Music Community.
- Safety: GPS is never required to access non-civic features.

## Architectural Boundaries
- Canon definitions come from `docs/canon/`.
- “Genre/subgenre/microgenre” is not structural and may appear only as optional taste tags.
- Voting is the only action gated by GPS verification.

## Data Models & Migrations
### Prisma Models
- User (HomeSceneId, GPSVerified flag)
- Scene (City, State, Music Community)
- SectTag (name, parent Scene)
- UserTag (User to SectTag)

### Migrations
- TBD

## API Design
### Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/onboarding/home-scene` | required | Resolve and set Home Scene |
| POST | `/onboarding/gps-verify` | required | Set GPS verification status |

### Request/Response
- Request schema: City, State, MusicCommunity, OptionalTag
- Response schema: SceneId, AppliedTags, VotingEligible

## Web UI / Client Behavior
- Inputs: City, State, Music Community (autocomplete).
- GPS disclaimer shown after selection and before voting actions.
- Pioneer messaging when Scene or city is not active.

## Acceptance Tests / Test Plan
- Enter active Scene: user joins directly.
- Enter active Sect: user joins Parent Scene with tag.
- Deny GPS: user cannot vote but can participate.
- Unknown Scene: incubating tag created, user routed to Parent Scene.

## Future Work & Open Questions
- Define pioneer incentives and recruitment tooling.
- Sect activation threshold is **45 minutes of total playtime** from artists who sign the motion. See `docs/specs/DECISIONS_REQUIRED.md`.
- Formalize thresholds for new Scene creation. See `docs/specs/DECISIONS_REQUIRED.md`.

## References
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Glossary Canon.md`
