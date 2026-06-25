# 2026-06-24 - Pioneer Activation Transition

Date: 2026-06-24
Branch: `docs/abacus-fusion-swarm-strategy`
Related master item: `M-04`
Founder clarification: when a preserved pioneer Home Scene becomes active, matched pioneer users move into it and artist/source uploads cut over prospectively.

## Current Truth

When a preserved pioneer city/music-community becomes active:

- users whose preserved pioneer intent matches the newly active `{city, state, musicCommunity}` are notified that their Home Scene is active
- those users become members of the newly active Home Scene
- users with verified submitted-location GPS receive voting rights in the newly active Home Scene
- users without GPS remain members but non-voting until verification
- artists/sources tied to that newly active Home Scene keep existing songs in their current rotation lifecycle until those songs naturally complete that lifecycle
- new songs submitted after activation attach to the newly active Home Scene

This transition does not create special community architecture. It activates the same Home Scene architecture for that `city + state + music community` tuple.

## Pending Implementation Detail

`docs/specs/DECISIONS_REQUIRED.md` tracks the implementation workflow details for notification fanout, matched-user membership creation, voting-right refresh, and source-track attachment cutover.

## Files Updated

- `docs/PLATFORM_START_HERE.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/broadcast/radiyo-and-fair-play.md`
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `docs/specs/DECISIONS_REQUIRED.md`
- `docs/handoff/2026-06-24_documentation-authority-master-review.md`
- `docs/handoff/2026-06-24_pioneer-intent-artist-threshold.md`
- `docs/CHANGELOG.md`
