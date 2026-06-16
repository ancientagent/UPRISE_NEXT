# Secondary Agent-Doc Cleanup

## Scope
Clean up secondary agent-facing docs and prompt packs that still conflicted with the current minimal-load workflow, authority order, and model-routing standing orders.

## Updated Files
- `docs/RUNBOOK.md`
- `docs/architecture/UPRISE_OVERVIEW.md`
- `docs/blueprints/MULTI_AGENT_DOCUMENTATION_STRATEGY.md`
- `docs/handoff/agent-control/README.md`
- `docs/solutions/NEW_CHAT_BOOTSTRAP_PROMPT_UX_R1.md`
- `docs/solutions/MVP_FIGMA_AGENT_PROMPTS_R1.md`
- `docs/solutions/MODEL_ONBOARDING_EVAL.md`
- `docs/specs/system/agent-handoff-process.md`

## What Changed
- Removed stale default-reading requirements that pointed agents to milestone and phase-history docs as if they were always-read onboarding material.
- Repointed overview docs toward the current workflow layer:
  - `AGENTS.md`
  - `docs/AGENT_STRATEGY_AND_HANDOFF.md`
  - `docs/handoff/README.md`
- Marked the older multi-agent blueprint and Figma-first prompt pack as historical/specialized rather than current default operating guidance.
- Reframed queue/orchestrator docs as an explicit specialized workflow, not the default path for every agent.
- Reduced broad bootstrap/evaluation prompts so they follow the current `always read core + task-specific add-ons` model.
- Updated the active handoff-process spec so dated handoff notes are the default current format and older `agent-<name>-<task>` files are treated as legacy.

## Why
The main workflow cleanup already updated the top-level entry points, but secondary docs were still quietly reintroducing obsolete reading stacks, older naming conventions, and broad context loading. These changes reduce drift from those secondary entry points.

## Verification
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`

## Residual Notes
- Older historical prompt packs are still present by design. They are now more clearly labeled as historical/specialized rather than current default guidance.
- Additional secondary docs may still reference older phase-era practices, but the highest-impact agent entry points identified by the fresh-agent audit are now aligned.
