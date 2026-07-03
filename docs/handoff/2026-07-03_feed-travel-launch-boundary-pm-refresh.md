# Feed Travel Launch Boundary / PM Refresh

Status: docs-only owner-spec clarification + operations refresh
Date: 2026-07-03
Branch: `docs/feed-travel-launch-boundary-pm-refresh`
Base: `origin/main` @ `052016f`

## Purpose

Capture and promote the launch-scope nuance for Feed-card `Travel`, then refresh Active PM / Branch Workspace Registry after PR #194, PR #195, and PR #196 merged.

## Founder Clarification Captured

Raw founder wording was appended to `docs/founder-sessions/2026-07-01_discover-transport-map-player.md`:

> ok, yes it should be on there though travel as a whole wont be a thing at launch, so there wont really be blast cards for other uprises until launch

## Settled Clarification

- Feed-card `Travel` belongs in the card contract for eligible outside-Uprise Feed cards.
- Travel as a whole is not launch-scope.
- Cross-Uprise Blast cards are not expected in the launch Feed while Travel/cross-community Discover remains deferred.
- This does not remove the Feed-card `Travel` contract; it prevents agents from treating it as a launch requirement.

## Files Changed

- `docs/founder-sessions/2026-07-01_discover-transport-map-player.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/operations/ACTIVE_PM.md`
- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`
- `docs/CHANGELOG.md`

## Runtime Impact

No runtime code changed.

## Operations Refresh

- Active PM now points at `main` @ `052016f` after PR #196.
- Open PR queue is recorded as empty at refresh time.
- Registry marks PR #194, #195, and #196 branches as merged.
- Current branch is registered as the active docs-only follow-up.

## Validation

```bash
pnpm run workspace:audit
pnpm run docs:lint
git diff --check
```
