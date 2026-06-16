# Seed Data (Implementation Support)

This folder contains **implementation seed data** used for onboarding and routing. It is **not canon** and must never override `docs/canon/` semantics.

## Contents
- `music-communities.json` — Launch-ready Music Community list (parent scenes).
- `taste-tag-map.json` — Mapping of taste tags to parent Music Communities (routing only).
- `music-community-taxonomy.md` — Internal taxonomy reference (not user-facing).
- `hotspot-cities.provisional.json` — Provisional candidate hotspot / launch cities for beta preload and nearest-active fallback support; includes source annotations and founder-supplied supplements.

## Rules
- These lists are **internal** and not user-facing taxonomies.
- `hotspot-cities.provisional.json` is an implementation-support candidate list, not canon, and may include founder-supplied additions that are not yet reflected in external source rankings.
- `launchOpen: true` inside `hotspot-cities.provisional.json` marks the cities currently intended to be operationally open for launch work on this branch.
- Tags are used for routing and Scene Map clustering only.
- Do not introduce new structural terms here; use canon vocabulary in specs.
