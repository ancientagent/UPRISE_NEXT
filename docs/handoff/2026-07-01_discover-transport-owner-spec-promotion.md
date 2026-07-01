# 2026-07-01 Discover Transport Owner-Spec Promotion

## Branch

- Branch: `docs/discover-transport-owner-spec-promotion`
- Base: `main` at `6d240f7` (`docs: refresh active pm after plot cleanup (#166)`)
- Mode: docs-only owner-spec promotion

## Summary

Promoted the approved founder-session Discover/transport decisions from `docs/founder-sessions/2026-07-01_discover-transport-map-player.md` into active owner docs. No runtime, schema, provider, database, or art changes were made.

## Durable Rules Promoted

- Discover transport belongs to Discover/Away Scene listening context, not Plot.
- Plot remains the Home Scene community dashboard/neighborhood; Home Scene selector movement is switch/select/tune, not transport.
- Discover has a later-phase front-door/back-door model:
  - front door starts from the user's Home context and points outward to related music outside the user's community;
  - back door previews the visited community's own highlights/popular material according to that community.
- Discover map view and seek mode are deferred design directions, not implementation-ready runtime work.
- Seek is explicit random discovery, not algorithmic recommendation/personalization.
- Saved Uprises may load into personal-player/Away Scene listening, but they do not appear in the Home Scene selector and do not grant voting authority.
- Transported visitors must not land inside member Plot/community dashboards.

## Files Changed

- `docs/specs/communities/discovery-scene-switching.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/handoff/2026-07-01_discover-transport-owner-spec-promotion.md`
- `docs/handoff/README.md`
- `docs/CHANGELOG.md`
- `docs/operations/ACTIVE_PM.md`

## Validation Results

- `pnpm run docs:lint` passed
- `git diff --check` passed

## Notes

This slice intentionally does not implement `/discover`, map UI, seek controls, action-wheel state, saved-Uprise transport, or personal-player changes. Those remain future scoped implementation slices after the owner contract is complete enough for runtime work.
