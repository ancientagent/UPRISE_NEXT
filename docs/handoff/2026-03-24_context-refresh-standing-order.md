# Context Refresh Standing Order

## Scope
Add a repo-visible context refresh policy so agents refresh by trigger, with a turn-count backstop, instead of relying on a blind compaction/token threshold.

## Updated Files
- `docs/solutions/SESSION_STANDING_DIRECTIVES.md`
- `docs/solutions/AGENT_WORKFLOW_PROTOCOL_R1.md`
- `docs/handoff/agent-control/AGENT_DIRECTIVES.md`

## Policy Added
- Immediate refresh on:
  - material `HEAD` change
  - overlapping agent commit
  - new checkpoint commit becoming source of truth
  - conflicting docs/runtime/handoff evidence
  - stale findings being carried forward as current
- Soft refresh after roughly 8-10 substantial turns on the same slice
- Hard refresh after roughly 15 substantial turns on the same slice, or sooner if drift appears

## Why
The failure mode during the recent multi-agent work was not just long context. It was stale or mixed context surviving too long. Trigger-based refresh catches that earlier while keeping agents from rereading the whole repo unnecessarily.

## Verification
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
