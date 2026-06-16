# 2026-04-10 — Registrar Source-Facing Access Lock

## Summary
Locked the founder clarification that registrar role/capability workflows should remain accessible from the source-facing side of the platform.

## What Was Locked
- Registrar role/capability flows are not only listener/civic utilities.
- Promoter capability code completion should remain reachable from source-facing surfaces.
- The current `/registrar` route is the MVP bridge for those workflows, not the only intended long-term access surface.

## Files Updated
- `docs/specs/system/registrar.md`
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
- `docs/CHANGELOG.md`

## Notes
- This is an access-surface doctrine lock, not a new runtime feature.
- No web implementation change was required in this pass.
