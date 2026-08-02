# Avatar Head Pose Compatibility Founder Session

Status: raw founder-session capture
Date: 2026-07-24
Source: current chat/session
Related lane(s): listener avatar system, avatar asset production
Owner spec candidates: `art/avatar-system/specifications/avatar-system-contract-r2.md`

## Raw Founder Notes

> remember if possible, we should make it to where the user could get away with slight head poses without it breaking the defaukt

> just enough to add some personality . versatility, identity etc

> another way we could do this is literally just selecting a whole character and switching out the under and/or over garments

> when they collect them

> that way we just have hundreds of characters to choose from

> ok cool then I want to see a full on punk sheet heavily stylalized all men, then all women. I want each one distinctively different in their looks and style

> maybe they can be all 1 unit but we can change the size of the model and add accessories or something

> this is an app where each community has sub communities of people who are into niche

> also feel free to add anything i miss. dayglow punk

> 80s

> there can be smiles, frowns, drunk, devious all kinds of stuff

## Clarifications

- The neutral front-facing head remains the default registration pose.
- The asset system should, if technically feasible, allow slight head poses
  without requiring a different body, garment, or default avatar construction.
- The purpose of the bounded pose range is to add personality, versatility, and
  identity without turning the avatar into a different construction system.
- Type: open design target
- Likely owner: avatar asset contract and production QA

## Feature Sets

- Bounded head-pose compatibility
- Raw basis: "slight head poses without it breaking the defaukt"
- Included behavior:
  - Preserve one default neck socket and body registration.
  - Explore slight authored head-pose variants that remain compatible with the
    default body and clothing stack.
- Excluded / not activated:
  - Arbitrary free rotation, skew, or runtime deformation.
  - A full animation, emote, or pose-editor system.
- Status: design-only and feasibility-open

- Whole-character identity preset alternative
- Raw basis: "selecting a whole character and switching out the under and/or
  over garments"
- Included behavior:
  - The listener selects one complete authored character as the base identity.
  - The intended long-term selection can be a large catalog containing hundreds
    of authored character choices.
  - The selected character can include its head, face, hair, skin treatment,
    and restrained pose as one cohesive illustration.
  - The character begins with its authorized default garment state.
  - Additional undergarments and open outer garments become interchangeable
    only after the listener collects or owns them.
  - Buttons, patches, pins, and similar digital merch remain separate objects
    attached to garment-owned zones.
- Excluded / not activated:
  - Separate user selection of every head, face, hair, and body part.
  - Runtime activation before the founder selects between the current modular
    head system and this simpler preset architecture.
- Status: selected exploration direction; production architecture remains
  pending visual and garment-fit approval

## Working Interpretation

- The safest asset direction is one canonical front-facing preset plus a small
  authored pose envelope, such as restrained left/right orientation or tilt.
- Pose variants should preserve the same neck mount and canvas registration.
- Pose differences should be perceptible enough to express identity but subtle
  enough that the same avatar, clothing, and overall silhouette remain
  recognizable.
- A whole-character preset would allow more cohesive identity and slight
  authored posing, but every preset would still need a shared torso, shoulder,
  chest-print, crop, and garment registration contract if garments are expected
  to swap without character-specific breakage.
- Collected garments belong to the listener's Inventory/equip context; they are
  not an unrestricted free catalog in the base character selector.
- To keep hundreds of characters compatible with one garment catalog, character
  variety should live primarily above the garment registration area. Slight
  head poses can vary while the shoulders, torso, chest-print area, crop, and
  garment anchors remain standardized.
- If this architecture is selected, production should begin with a bounded
  representative character lineup and garment-fit proof rather than a
  standalone catalog of interchangeable head parts.
- The first bounded catalog review consists of one heavily stylized
  male-presenting punk sheet followed by one heavily stylized female-presenting
  punk sheet. Each character must be visibly distinct while remaining part of
  one compatible UPRISE illustration family.
- A character may be authored and presented as one cohesive character core
  rather than exposed anatomical parts. Collected garments and accessories can
  remain renderer-owned overlays attached through fixed anchors.
- If character size is adjustable, the character core and every equipped layer
  must inherit one shared transform so garments and accessories cannot drift.
- Exact user-facing size controls and allowed surfaces remain open. Feed rails,
  compact Home/Plot identity slots, and other normalized identity contexts must
  not become inconsistent merely because a character supports presentation
  scaling elsewhere.
- The character catalog must reflect that every parent music community contains
  overlapping niche subcommunities and visual expressions. A broad label such
  as Punk cannot collapse its catalog into one generic leather-jacket look.
- Subcommunity research should guide authored character packs and garment
  vocabulary without automatically assigning a listener to a niche, requiring
  stereotypical dress, or preventing cross-scene choices.
- Authored whole-character identities may use a wide expression vocabulary,
  including smiles, frowns, laughter, stern or tired looks, devious expressions,
  and a deliberately woozy or drunk expression. The catalog should not default
  every character to the same neutral face.
- Facial expression must remain independent from subcommunity identity so a
  scene is not assigned one personality or behavioral stereotype.
- The exact pose range, asset count, and runtime selection behavior remain open.

## Promotion Targets

- Owner design contract:
  `art/avatar-system/specifications/avatar-system-contract-r2.md`
- Production matrix:
  `art/avatar-system/specifications/asset-production-matrix.md`
- Tests/runtime: unknown until a renderer implementation is specified
- Linear/PM: none

## Do Not Drift

- Do not let pose compatibility replace the neutral front-facing default.
- Do not infer unrestricted user-controlled rotation from "slight head poses."
- Do not require separate bodies or garments for each slight head pose.
- Do not treat the whole-character preset idea as selected architecture until
  the founder explicitly chooses it over the current modular-head approach.
- Do not expose internal layer construction as a paper-doll anatomy editor.
- Do not represent a parent music community with one visual stereotype.
