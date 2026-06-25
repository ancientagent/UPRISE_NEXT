# 2026-06-24 - Layered Context Reading Strategy

Date: 2026-06-24
Branch: `docs/abacus-fusion-swarm-strategy`
Decision: UPRISE agents use layered context mode.

## Decision

Focused implementation should not load the full platform history by default. It should load:

1. `AGENTS.md`
2. `docs/PLATFORM_START_HERE.md`
3. `docs/AGENT_STRATEGY_AND_HANDOFF.md`
4. `docs/agent-briefs/CONTEXT_ROUTER.md`
5. the active lane brief
6. exact touched specs/runtime/tests

Broad audits, architecture planning, deployment/infra work, multi-agent strategy, repo-structure work, and explicit full-platform reviews may use the Heavy Authority Pack in `AGENTS.md`.

## Files Updated

- `AGENTS.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/README.md`
- `docs/specs/system/documentation-framework.md`
- `docs/handoff/2026-06-24_documentation-authority-master-review.md`
- `docs/CHANGELOG.md`

## Remaining Review Queue

`M-01` is accepted. Next review item should be `M-03`: stale inactive-Community creation language versus current Home Scene fallback behavior.
