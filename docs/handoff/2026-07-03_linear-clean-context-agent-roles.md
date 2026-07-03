# Linear Clean Context Agent Roles Handoff

Status: docs/process rule patched
Date: 2026-07-03
Branch: docs/linear-clean-context-agent-roles
Owner: Codex local

## Summary

Added the Linear clean-context assignment protocol to UPRISE process docs.

The protocol separates two roles:

- Assigning agent: prepares the issue packet, gathers repo context, confirms product-changing understanding with the founder, recommends skills/tools/model tier, and assigns the executor.
- Assigned agent: starts clean from the Linear issue, follows only the issue plus repo-linked docs/files, and stops if the packet lacks enough context.

For non-trivial issue setup, the assigning agent should preferably be a dedicated Codex subagent. It should not also own the implementation branch unless explicitly reassigned.

## Files Changed

- `docs/specs/system/documentation-framework.md`
- `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/founder-sessions/2026-07-03_linear-clean-context-agent-roles.md`
- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-07-03_linear-clean-context-agent-roles.md`

## Durable Rule

Linear is the clean-context packet for assigned agents, but Linear does not become product truth. Durable founder-confirmed rules are promoted to canon only when canon-level doctrine/terminology changes; otherwise they go to the appropriate owner spec under `docs/specs/**`, tests, handoff, changelog, PM state, and Linear as appropriate.

## Validation

Passed in this branch:

```bash
pnpm run docs:lint
pnpm run workspace:audit
git diff --check
```
