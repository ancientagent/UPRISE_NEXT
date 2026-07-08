# Home Scene Photo Rotation And Community List Founder Session

Status: raw founder-session capture
Date: 2026-07-07
Source: current chat/session
Related lane(s): UX/UI, Home/Plot, seed community selector, Product Design
Owner spec candidates: `docs/specs/communities/plot-and-scene-plot.md`; `docs/specs/seed/README.md`; `docs/specs/seed/music-communities.json`

## Raw Founder Notes

> i dont know if we forgot to add that
>
> poetry/spoken word
>
> and intstumental probably
>
> i mean to the actual community list
>
> it would be cool if the photos changed now and again a couple with their city context and a couple with their community context

## Clarifications

- `Spoken Word / Poetry` should be treated as part of the actual music-community list when validating the current selector.
- Type: already documented / confirmed
- Likely owner: `docs/specs/seed/music-communities.json`

- `Instrumental` is a requested addition candidate for the actual music-community list, but the exact activation path is open because adding it to the launch selector changes the active launch matrix from `6` cities x `8` communities to `6` cities x `9` communities.
- Type: open founder decision
- Likely owner: `docs/specs/seed/music-communities.json`; `docs/specs/seed/launch-community-city-matrix.json`; `docs/specs/DECISIONS_REQUIRED.md`

- Home Scene atmosphere photos should be allowed to rotate periodically, with some images carrying city context and some carrying music-community context.
- Type: design clarification
- Likely owner: `docs/specs/communities/plot-and-scene-plot.md`; Product Design handoff

## Feature Sets

- Home Scene rotating atmosphere photo set
- Raw basis: "it would be cool if the photos changed now and again a couple with their city context and a couple with their community context"
- Included behavior:
  - A Home Scene can use a small set of approved atmosphere images rather than a single static image.
  - Some images should ground the city context.
  - Some images should ground the music-community context.
  - The rotation is a visual identity/content layer for the Home Scene shell.
- Excluded / not activated:
  - Photo rotation must not change Home Scene authority, routing, tabs, player behavior, action grammar, seed activation, or community permissions.
  - Photo assets must not invent real venues, events, sponsors, artist affiliations, or source membership.
- Status: design-only / owner-spec presentation rule

## Working Interpretation

- Current seed files already include `Spoken Word / Poetry` in the active MVP launch selector.
- `Instrumental` needs founder lock before implementation because it may be either a true selectable Home Scene community, a routing/taste tag, or a future generated sect/channel category.
- The photo-rotation idea is safe to promote as a presentation rule if it stays content-only and does not imply separate behavior per city or music community.

## Promotion Targets

- Owner spec: `docs/specs/communities/plot-and-scene-plot.md`
- Lane brief: `docs/agent-briefs/UI_CURRENT.md`
- Open decision: `docs/specs/DECISIONS_REQUIRED.md`
- Seed note: `docs/specs/seed/README.md`

## Do Not Drift

- Do not remove or rename `Spoken Word / Poetry` from the active selector as though it were missing.
- Do not add `Instrumental` to seed JSON or launch matrix counts until the founder confirms it is an active selector community.
- Do not make city/community photo rotation a new navigation model, discovery transport, player behavior, or community-specific architecture variant.
- Do not let generated/local atmosphere photos imply unverified real-world claims.
