# First-Pass Implementation Workflow Clarification

Date: 2026-07-03
Branch: `docs/uprise-first-pass-implementation-workflow`
Base: `main` @ `236353e`
Owner: Codex local

## Purpose

Clarify that UPRISE execution packets are not only cleanup packets. UPRISE is still implementing many first-pass platform features, so the GISTer-style source-behavior-removal / excavator framing must stay conditional.

## Founder Clarification Captured

- UPRISE differs from GISTer because many UPRISE issues are still first implementation slices.
- Linear packets should give assigned agents clean execution context, repo source-truth links, scope, and validation seed.
- Repo docs/specs remain source of truth; Linear remains execution state.
- Cleanup/excavator/source-behavior-removal framing is useful only when the issue is actually about stale code, wrong existing behavior, refactor cleanup, branch absorption, or workaround removal.
- For first-pass implementation, the packet should define what to build from owner specs, lane briefs, current code surfaces, validation seed, and explicit out-of-scope boundaries.

## Files Changed

- `docs/specs/system/documentation-framework.md`
- `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/operations/ACTIVE_PM.md`
- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-07-03_first-pass-implementation-workflow.md`

## Runtime / Provider / Schema Impact

None. This is a docs/process clarification only.

No provider, database, schema, migration, runtime, or art state was touched.

## Validation

```bash
pnpm run docs:lint       # passed
pnpm run workspace:audit # passed
git diff --check         # passed
```

## Next Signal

Open a small docs PR after validation. If checks pass, this can merge as process documentation. Draft PR #212 remains preserved and out of scope unless explicitly reprioritized.
