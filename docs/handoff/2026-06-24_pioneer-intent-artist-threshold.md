# 2026-06-24 - Pioneer Intent Artist Threshold Clarification

Date: 2026-06-24
Branch: `docs/abacus-fusion-swarm-strategy`
Related master item: `M-04`
Founder clarification: preserved pioneer intent can become a real community only when the joining-artist/music activation threshold for that city/music-community is met. Listener demand alone is not enough.

## Current Truth

When a submitted Home Scene is unavailable, onboarding preserves the submitted `city + state + music community` as pioneer intent and routes the user to the nearest active same-parent community.

That pioneer intent is not dead metadata. It can later materialize into an active city-tier `Community` only when the joining-artist/music activation threshold for that city/music-community is met.

Listener demand alone does not activate a music community. Without participating artists/music, there is no music community.

When the city/music-community activates, users whose preserved pioneer intent matches the newly active `{city, state, musicCommunity}` are notified that their Home Scene is active and become members of that Home Scene. Users with verified submitted-location GPS receive voting rights there; users without GPS remain non-voting until verification.

Artists/sources tied to the newly active Home Scene keep existing songs in their current rotation lifecycle until those songs naturally complete that lifecycle. New songs submitted after activation attach to the newly active Home Scene.

Activation uses the same Home Scene architecture as every other community. It does not create a custom branch, special screen set, special action grammar, or bespoke routing.

## Threshold Status

The principle is founder-clarified. The exact numeric/evidence requirements for the joining-artist/music activation threshold are still tracked as a lock item in `docs/specs/DECISIONS_REQUIRED.md`.

The activation transition workflow is also tracked in `docs/specs/DECISIONS_REQUIRED.md` for implementation details: notification fanout, membership creation, voting-right refresh, and track-attachment cutover.

## Files Updated

- `docs/PLATFORM_START_HERE.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/seed/README.md`
- `docs/specs/DECISIONS_REQUIRED.md`
- `docs/handoff/2026-06-24_documentation-authority-master-review.md`
- `docs/CHANGELOG.md`
