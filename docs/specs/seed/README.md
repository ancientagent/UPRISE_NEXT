# Seed Data (Implementation Support)

This folder contains **implementation seed data** used for onboarding and routing. It is **not canon** and must never override `docs/canon/` semantics.

## Contents

- `music-communities.json` — MVP launch Music Community list shown during onboarding.
- `launch-community-city-matrix.json` — Current city-tier launch matrix; `6` cities x `8` music communities = `48` operational Home Scene tuples.
- `taste-tag-map.json` — Mapping of taste tags to parent Music Communities (routing only).
- `music-community-taxonomy.md` — Internal taxonomy reference (not user-facing).
- `hotspot-cities.provisional.json` — Provisional candidate hotspot / launch cities for beta preload and nearest-active fallback support; includes source annotations and founder-supplied supplements.

## Rules

- These lists are implementation support and must not override canon.
- `music-communities.json` is the current MVP onboarding selector list.
- `music-community-taxonomy.md` is a broader internal reference and must not be treated as the current onboarding selector.
- Home Scene architecture is invariant. City and music-community identity change the scene data, membership, content, activity, and later generated Prime-model structures; they must not change runtime behavior, tabs, menus, actions, player rules, or routing.
- Sects, generated channels, and sub-communities happen later through the Prime model; they are not launch-time architecture variants.
- `hotspot-cities.provisional.json` is an implementation-support candidate list, not canon, and may include founder-supplied additions that are not yet reflected in external source rankings.
- `launchOpen: true` inside `hotspot-cities.provisional.json` marks the cities currently intended to be operationally open for launch work on this branch.
- Tags are used for routing and Scene Map clustering only.
- Do not introduce new structural terms here; use canon vocabulary in specs.
