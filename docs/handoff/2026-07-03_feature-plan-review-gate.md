# Feature Plan Review Gate Handoff

Status: docs/process rule patched
Date: 2026-07-03
Branch: docs/feature-plan-review-gate
Owner: Codex local

## Summary

Added a lightweight pre-implementation feature gate to the existing UPRISE execution packet system.

The new rule: before an agent implements a feature or behavior-changing UI/API/runtime slice, the executor must review the feature against current repo authority, write a development plan, and have that plan reviewed by an independent Codex agent before implementation edits begin.

This is not a new PM harness and does not create per-issue context packet files by default. Tiny surgical docs-only or local cleanup PRs can skip the gate when no product/runtime behavior is being implemented and the branch owner can prove low risk.

## Files Changed

- `docs/specs/system/documentation-framework.md`
- `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/founder-sessions/2026-07-03_feature-plan-review-gate.md`
- `docs/founder-sessions/2026-07-03_source-listener-messaging-boundary.md`
- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-07-03_feature-plan-review-gate.md`

## Exact Template Additions

Execution Packet fields added:

```md
Feature / Behavior Scope:
Repo-Aspects To Verify:
Development Plan:
Plan Review:
```

Executor Readiness fields added:

```md
feature_reviewed_against_repo: yes/no/not_applicable
development_plan_written: yes/no/not_applicable
development_plan_reviewed_by_codex: yes/no/not_required
```

## Gate Semantics

- Applies to feature implementation and behavior-changing UI/API/runtime slices.
- Executor must review the feature against owner spec, lane brief, relevant runtime/code paths, tests, directly relevant founder-session notes or handoffs, deferred/out-of-scope boundaries, and validation seed.
- Executor must write a development plan before edits.
- A separate Codex reviewer must review the development plan before implementation edits begin.
- Use `gpt-5.3-codex-spark` for small/medium plan sanity checks.
- Use `gpt-5.5` with `reasoning_effort=xhigh` for complex, cross-lane, schema/provider/security/canon, or high-impact plans.

## Founder Captures

Added raw founder-session capture for the feature plan review rule.

Also included the already-created raw founder-session capture for source/listener messaging and Registrar boundary so the branch does not leave that clarification as an untracked local-only file. This branch does not promote that product clarification into owner specs.

## Validation

Passed in this branch:

```bash
pnpm run docs:lint
pnpm run workspace:audit
git diff --check
```

## Follow-Up

Future feature implementation prompts should include the new packet fields or explicitly mark them not applicable with a low-risk reason.
