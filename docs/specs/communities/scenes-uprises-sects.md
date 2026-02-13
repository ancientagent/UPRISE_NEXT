# Scenes, Uprises, and Sects

**ID:** `COMM-SCENES`  
**Status:** `draft`  
**Owner:** `platform`  
**Last Updated:** `2026-02-13`

## Overview & Purpose
This spec defines the structural hierarchy of **Scenes**, **Communities**, **Uprises**, and **Sects**. It formalizes how place, people, and broadcast relate, and how a Sect can mature into its own Uprise.

## User Roles & Use Cases
- Listener selects a Home Scene and participates locally.
- Artist (capability) registers to a Home Scene and uploads to its broadcast.
- Registrar participants enter motions to form a new Uprise when thresholds are met.
- Visitors traverse other Scenes without civic voting rights.

## Functional Requirements
- A **Scene** is a place‑bound container. Scenes exist at City, State, and National levels.
- A **Community** is the people operating within a Scene.
- An **Uprise** is the broadcast station operated by a Community within a Scene and carried by RaDIYo.
- A **Home Scene** is the user’s local music Scene of choice and civic anchor.
- **Parent Scenes** are pre‑loaded, launch‑ready music communities that accept users immediately.
- **Sects** are the sum of listeners and artists sharing the same taste tag inside a Home Scene.
- Sects exist as statistical reality inside a Home Scene before they become a broadcast.
- A Sect becomes an Uprise only after meeting the support threshold and having enough committed artist catalog to sustain rotation.
- When a Sect meets the threshold, a motion is entered in the Registrar to establish the Sect Uprise.
- Artists must commit to the Sect Uprise for it to activate. If support is insufficient, the Sect remains a tag‑based subgroup.
- If a user enters a subsect name during onboarding, the system routes them to the Parent Scene and applies the tag.
- Citywide is the only tier with civic infrastructure. Statewide and National are aggregate broadcasts only.

## Non-Functional Requirements
- Consistency: Scene, Community, and Uprise are never treated as interchangeable.
- Clarity: onboarding language must use “Music Community,” not “Genre Selection.”
- Neutrality: no algorithmic ranking or recommendation is implied by Scene structure.

## Architectural Boundaries
- Canon definitions come from `docs/canon/`.
- “Genre/subgenre/microgenre” may appear only as optional **taste tags** and not as structural selectors.
- Home Scene selection uses **City**, **State**, **Music Community** labels.

## Data Models & Migrations
### Prisma Models
- Model(s) added/changed: TBD
- Relationships: TBD
- Indexes / constraints: TBD

### Migrations
- Migration name(s): TBD
- Backfill strategy (if applicable): TBD
- Rollback considerations: TBD

## API Design
### Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| TBD    | TBD  | TBD  | Scene and Sect resolution endpoints |

### Request/Response
- Request schema: TBD
- Response schema: TBD
- Error codes: TBD

## Web UI / Client Behavior
- Onboarding prompts for **City**, **State**, **Music Community**.
- If a subsect is entered, route to the Parent Scene and apply the taste tag.
- Plot surfaces show Scene membership and Sect tags without implying algorithmic ranking.

## Acceptance Tests / Test Plan
- Doc review: Scene, Community, and Uprise definitions align to canon.
- UI copy review: no “genre selection” wording.
- Registrar flow review: Sect Uprise activation requires artist commitment.

## Future Work & Open Questions
- Define formal thresholds for Sect Uprise activation (catalog minutes, artist count). See `docs/specs/DECISIONS_REQUIRED.md`.
- Define Registrar motion schema and vote mechanics.

## References
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Narrative Canon.md`
