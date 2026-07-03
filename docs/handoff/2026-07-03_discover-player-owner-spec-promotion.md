# Discover Player Owner Spec Promotion

Date: 2026-07-03
Branch: `docs/discover-player-owner-spec-promotion`
Base: `main` @ `37c61fe`
Owner: Codex local

## Summary

Promoted the founder-session Discover/player clarifications from raw capture notes into active owner specs and lane briefs.

This is a docs-only owner-spec promotion. It does not change runtime behavior, provider state, database/schema state, or art assets.

## Product Rules Promoted

- Discover transport remains outside Plot.
- Discover front door starts from the user's Home context and points outward to related music outside the user's community.
- Discover back door is visitor-facing and inward-looking for the visited community.
- Map view and Seek mode belong to Discover, not Plot.
- Feed/Plot cards can link/load listening or artist-profile demo context, but deeper community visits must hand off to Discover/back-door context.
- Saved/custom Uprise playback is Discover/collection-owned and must not launch from the Plot top shell, Plot Home Scene selector, or Plot profile pull-down.
- `SPACE` can remain internal/player-mode language for selected-track/profile-space listening, but it does not authorize saved/custom Uprise transport inside Plot.

## Files Changed

- `docs/specs/communities/discovery-scene-switching.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`
- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`
- `docs/CHANGELOG.md`

## Validation

Passed before PR:

```bash
pnpm run workspace:audit
pnpm run docs:lint
git diff --check
```

## Next Signal

Add/update static regression locks only if future runtime work touches Plot top shell, Plot profile pull-down, Discover, or saved/custom Uprise playback. Do not implement Discover transport in this docs-only promotion.
