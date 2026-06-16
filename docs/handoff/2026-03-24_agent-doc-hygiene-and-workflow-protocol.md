# 2026-03-24 — Agent doc hygiene and workflow protocol

## Summary
Cleaned the primary agent-facing docs so new sessions stop loading broad, partly historical reading stacks by default.

## What changed
- `AGENTS.md`
  - split reading into `Always Read` and `Task-Specific Add-Ons`
  - added explicit working rules for mixed-worktree QA, issue classification, and current-truth preference
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
  - rewritten as an active protocol doc instead of a mixed historical onboarding memo
  - removed stale/overbroad requirements like old phase docs and agent-tagging rules
  - added authority order, QA minimums, and closeout gate
- `docs/README.md`
  - simplified the start path and pointed task types to the right indexes
- `docs/handoff/README.md`
  - replaced the giant static handoff index with usage rules and safe-reading guidance
- `docs/solutions/AGENT_WORKFLOW_PROTOCOL_R1.md`
  - added a reusable operating protocol for multi-agent implementation + QA
- `docs/solutions/README.md`
  - elevated workflow/guardrail docs and trimmed the default list to more useful entry points

## Why
Recent UX/discovery execution showed the main failure mode was not lack of docs; it was unevenly current docs and stale handoff memory being loaded too broadly.

## Verification
- `pnpm run docs:lint`

## Intended effect
- Fewer irrelevant required-reading hops for common task types
- Clearer authority order when specs, handoffs, and code disagree
- Less mixed-worktree QA drift
- Faster agent startup with fewer stale assumptions
