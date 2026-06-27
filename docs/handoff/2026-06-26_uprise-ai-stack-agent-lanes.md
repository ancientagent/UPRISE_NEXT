# 2026-06-26 UPRISE AI Stack And Agent Lanes

## Branch

- Branch: `docs/uprise-ai-stack-agent-lanes`
- Base: `origin/main` at `cb6544a`
- Mode: docs/tooling strategy implementation
- Provider/env/database state: not touched
- Runtime code: not touched
- Untracked art: left untouched

## Summary

Added a concise AI stack and lane-agent routing map so future UPRISE agents can decide when to use Codex local, Cloud Codex, Hermes reviewer/auditor, Abacus / Agent Swarm, NotebookLM, design tools, Linear, and generated wiki tools without treating any external tool as product authority.

This is a routing/operations doc only. It does not change product doctrine, owner specs, runtime behavior, provider state, or database state.

## Files Changed

- `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`
  - New concise routing map for tool selection, lane agents, prompt contracts, Linear role, review routing, and safety boundaries.
- `AGENTS.md`
  - Added the AI stack/lane doc to the multi-agent/tooling strategy add-ons.
- `docs/solutions/README.md`
  - Added the new doc to the agent workflow start list.
- `docs/agent-briefs/EXTERNAL_TOOLS.md`
  - Added the new doc as the first external guidance pointer and updated tooling pointers.
- `docs/specs/system/documentation-framework.md`
  - Added the AI stack/lane map as the concise routing summary while preserving the framework as the owner of documentation authority.
- `docs/agent-briefs/CONTEXT_ROUTER.md`
  - Added the AI stack/lane map to EXTERNAL_TOOLS default load and contract-owner routing notes.
- `docs/agent-briefs/UPRISE_HERMES_AUDITOR_AGENT.md`
  - Removed the stale standing default branch wording; the older launch-community branch is now labeled historical example-only.
- `docs/solutions/EXTERNAL_ASSISTANT_REPO_BRIEF_R1.md`
  - Added a pointer that the new AI stack/lane doc is the current tool-routing map.
- `docs/CHANGELOG.md`
  - Added concise Added/Changed entries.

## Branch / Worktree Inventory

Read-only inventory was run before edits to avoid forgetting active work:

- Current branch: `docs/uprise-ai-stack-agent-lanes` at `cb6544a`, tracking `origin/main`.
- Active prior implementation PR branch: `feat/preference-resolver-runtime-adoption` at `4eb123d`, tracking remote.
- Local `main`: `a65d457`, behind `origin/main` by 2. Cleanup candidate: fast-forward local main later if needed.
- Main workspace status before edits: tracked clean; existing untracked user-owned `art/` assets only.

Open PRs observed:

- `#123` `feat/preference-resolver-runtime-adoption` -> `main`, mergeable, checks success.
- `#122` `docs/browser-qa-lane-readiness` -> `main`, mergeable, mixed failing/success checks.
- `#121` `audit/home-scene-community-cleanup-plan` -> `main`, mergeable, checks success.
- `#120` `audit/activation-readiness-runtime` -> `main`, mergeable, checks success.
- `#119` `audit/registrar-source-origin-compatibility` -> `main`, mergeable, checks success.
- `#118` `feat/default-music-community-preference-resolver` -> `main`, mergeable, checks success.

Worktrees observed:

- `/home/baris/UPRISE_NEXT` -> `docs/uprise-ai-stack-agent-lanes`
- `/home/baris/UPRISE_NEXT/.worktrees/batch18` -> `feat/ux-batch18-prep`, clean
- `/home/baris/UPRISE_NEXT/.worktrees/batch19` -> `feat/ux-batch19-prep`, clean
- `/home/baris/UPRISE_NEXT_batch18` -> `feat/ux-batch18`, clean, behind `origin/main` by 292
- `/home/baris/UPRISE_NEXT_runtime` -> `phase3-no-automation-rollback`, clean
- `/home/baris/UPRISE_NEXT_uximpl` -> `ux-implementation`, clean
- `/home/baris/UPRISE_NEXT_uxmobile` -> `ux-mobile-r1-build`, clean
- `/tmp/uprise-abacus-community-review-fix` -> `abacus/community-activation-proxy-lifecycle-review-fix`, prunable gitdir points to non-existent location

Branches with gone upstreams observed:

- `next-slice71-phase2-observability-reads`
- `phase3-capability-slices-95-97`
- `phase3-status-entries-114`
- `phase4-batchb-108-113`
- `revive-pr47`
- `revive-pr50`

No cleanup was performed. These are candidates for a separate branch/worktree hygiene pass with explicit approval.

## Validation

To run before closeout:

```bash
pnpm run docs:lint
git diff --check
```

## Follow-Up Recommendations

- Merge or close open PRs intentionally; do not let `#118` through `#123` become invisible background work.
- Investigate `#122` failing check before merge.
- In a separate hygiene pass, prune the broken `/tmp/uprise-abacus-community-review-fix` worktree and decide whether to delete local branches with gone upstreams.
- Fast-forward local `main` after current PR coordination is finished.
