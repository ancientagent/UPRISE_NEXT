# 2026-06-24 - Home Scene Fallback Doc Correction

Date: 2026-06-24
Branch: `docs/abacus-fusion-swarm-strategy`
Master item: `M-03`
Decision: onboarding does not create inactive `Community` rows or listener-side pioneer activation queues.

## Current Truth

When a submitted Home Scene `{city, state, musicCommunity}` is inactive or unavailable:

- assign the listener to the nearest/relevant active major-node Home Scene for the same parent music community
- store the resolved active listening/voting anchor through `User.tunedSceneId` where current runtime needs it
- auto-join the resolved active Scene membership
- do not create inactive `Community` rows or listener-side activation queues during onboarding
- let source/artist registration and Registrar/source activation drive later city-tier community splits

## Files Updated

- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/handoff/2026-06-24_documentation-authority-master-review.md`
- `docs/CHANGELOG.md`

## Notes

This handoff has been superseded by the founder clarification captured in `docs/handoff/2026-06-24_major-node-community-activation-model.md`: the product model is major-node assignment, not listener-side pioneer tracking.
