# 2026-06-24 - Invariant Community Architecture

Date: 2026-06-24
Branch: `docs/abacus-fusion-swarm-strategy`
Master item: `M-04`
Decision: every Home Scene/community instance uses the same architecture.

## Current Truth

A community/Home Scene is identified by `city + state + music community`. That tuple changes scene data, members, sources, events, signals, content, activity, and history. It does not change screens, menus, tabs, player behavior, action grammar, or routing.

Sects, generated channels, and subcommunities are later Prime-model outputs, not launch-time special cases or custom community architecture.

## Files Updated

- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/handoff/2026-06-24_documentation-authority-master-review.md`
- `docs/CHANGELOG.md`

## Notes

The same invariant was already present in `docs/PLATFORM_START_HERE.md`, `docs/specs/seed/README.md`, `docs/specs/users/onboarding-home-scene-resolution.md`, and `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`. This patch reinforces it in the structural community spec.
