# 2026-04-16 — Discover Player/Title Card Layout Lock

## What changed
- Reconciled active Discover docs so they consistently describe Discover as a player-anchored page with one dominant top card.
- Locked the top Discover object as an expanded community player card that also serves as the community title card.
- Locked search as a single artist/song search entry inside that top card rather than a separate co-equal top section.
- Locked Discover content below the player as secondary community snippets/previews rather than equal-weight primary modules.
- Kept travel attached to the bottom of the player and clarified that map expansion/materialization belongs to the top card experience.

## Files updated
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/solutions/SURFACE_CONTRACT_DISCOVER_R1.md`
- `docs/specs/communities/discovery-scene-switching.md`

## Why
The active docs were still split between two different Discover models:
- older list-first structure with search and rails above the player
- newer founder direction where the player anchors the page and the rest of Discover materializes beneath it

That conflict made the current surface harder to reason about and would have caused UI work to drift.

## Locked direction
- Discover has one dominant top object: the community player/title card.
- Search lives inside that card.
- Travel expands from the bottom of that card.
- The map is part of that top-card expansion, not a detached module.
- `Popular Singles`, recommendations, and similar surfaces are contextual snippets below the anchor card.

## Implementation implication
Current web Discover implementation still needs a later layout refactor to match this structure. This slice only reconciles doctrine so the next UI pass has clear authority.
