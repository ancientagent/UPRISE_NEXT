# Executor Review Loop Protocol

Date: 2026-07-03
Branch: docs/executor-review-loop-protocol
Owner: Codex local
Status: docs/process clarification

## Summary

Promoted the founder-confirmed implementation workflow into UPRISE process docs: behavior-changing implementation issues should be assigned with a context packet from the PM/current owner, then handled through a fresh executor planning pass, independent plan review, same branch-owning executor implementation, and independent execution review. Failed plan or execution review returns the issue to the executor with concrete findings instead of proceeding to merge/closeout.

## Rule Captured

For feature or behavior-changing UI/API/runtime work:

1. PM/current owner selects the next implementation issue and gives the assigned executor a context packet with lane, owner contract, required docs, likely files, known runtime/tests to inspect, validation seed, out-of-scope boundaries, and stop conditions.
2. A fresh executor agent/session starts from that packet, verifies it against current repo evidence from owner specs, lane briefs, relevant runtime/code paths, tests, and directly cited founder-session notes or handoffs.
3. The executor writes an execution plan from repo evidence, not Linear/chat alone, and flags any packet correction needed.
4. The plan is confirmed or corrected before implementation edits begin.
5. An independent Codex reviewer checks the plan against repo authority.
6. The same branch-owning executor implements the accepted plan.
7. An independent reviewer checks execution against the plan, owner specs, runtime evidence, and validation output. Failed review returns to the executor.

Tiny surgical docs-only or low-risk local cleanup PRs can skip the loop when no product/runtime behavior changes and low risk is proven.

## Files Changed

- `docs/specs/system/documentation-framework.md`
- `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-07-03_executor-review-loop-protocol.md`

## Product / Runtime Impact

None. This is a process documentation clarification only.

## Validation

To run before closeout:

```bash
pnpm run docs:lint
pnpm run workspace:audit
git diff --check
```
