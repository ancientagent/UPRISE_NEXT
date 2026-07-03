# Feed Blast Card Travel / Source Contract

Status: docs-only owner-spec promotion
Date: 2026-07-03
Branch: `docs/feed-blast-card-travel-source-contract`
Base: `origin/main` @ `a83b667`

## Purpose

Promote the founder clarification that Blast cards are Feed card types, the blasted signal must link to its source, and eligible outside-Uprise Feed cards may expose a separate `Travel` action that hands off to Discover/back-door visitor context while loading the Uprise.

## Founder Clarification Captured

Raw founder wording was appended to `docs/founder-sessions/2026-07-01_discover-transport-map-player.md` before owner-spec edits.

Key settled points:

- `Blast card` means a listener Blast activity card inside Feed.
- Every Blast card links the blasted signal to that signal's source.
- Feed-card listening/click behavior and `Travel` are separate actions.
- `Travel` takes the user to Discover/back-door visitor context and loads the Uprise.
- Feed-card `Travel` does not grant Home Scene authority, voting rights, or membership.
- This correction does not authorize map, Seek, saved/custom-Uprise launchers, or general transport controls inside the Plot top shell, Home Scene selector, or Plot profile pull-down.

## Files Changed

- `docs/founder-sessions/2026-07-01_discover-transport-map-player.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`
- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`
- `docs/CHANGELOG.md`

## Owner-Spec Resolution

Previous wording broadly said Feed/Plot cards must not add a transport action inside Feed/Plot. That wording was too broad after the founder clarified Feed-card `Travel`.

The corrected boundary is:

- general Plot transport remains disallowed;
- Plot top shell, Home Scene selector, and Plot profile pull-down still must not become transport systems;
- eligible outside-Uprise Feed cards may include a `Travel` handoff into Discover/back-door context;
- Blast-card signal-source links remain separate from `Travel`.

## Runtime Impact

No runtime code changed in this slice.

Future implementation/test work should add Feed/Blast card contract tests when Feed-card runtime supports outside-Uprise cards and Travel handoff behavior.

## Validation

To run before PR:

```bash
pnpm run workspace:audit
pnpm run docs:lint
git diff --check
```
