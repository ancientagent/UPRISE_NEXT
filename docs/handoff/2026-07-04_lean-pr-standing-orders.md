# 2026-07-04 Lean PR Standing Orders

Status: docs/process update
Branch: `docs/lean-pr-standing-orders`
Base: `main` at `05266e6`

## Summary

Added repo-visible standing orders so UPRISE defaults to a lean PR path instead of process-heavy loops for small and medium slices.

The intended default is now:

1. implement the scoped change from current repo truth;
2. run focused validation;
3. update only required docs/changelog/handoff;
4. open/update the PR with required metadata;
5. merge or enable auto-merge when required checks pass.

Independent review remains available, but it is risk-scaled:

- one bounded Codex review pass for behavior-changing work when it materially reduces risk;
- heavy review only for schema/provider/security/canon/doc-authority, complex cross-lane changes, branch absorption, broad cleanup, or failed checks;
- tiny docs-only/local cleanup can skip independent review when low risk is proven.

## Files Updated

- `AGENTS.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/specs/system/documentation-framework.md`
- `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`
- `docs/operations/ACTIVE_PM.md`
- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`
- `docs/CHANGELOG.md`

## Guardrails Added

- No process loops for small/medium work unless a real blocker or safety risk appears.
- No branch-registry head-chasing commits.
- No follow-up operations PR solely to close the just-merged PR.
- No CI babysitting: poll once, enable auto-merge when safe, and continue useful work unless a check fails or the user is waiting on a deploy decision.
- Operations docs remain routing snapshots; GitHub/`gh` remains live PR truth.

## Validation

```bash
pnpm run docs:lint
pnpm run workspace:audit
git diff --check
```
