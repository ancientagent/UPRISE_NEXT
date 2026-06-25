# 2026-06-24 - Abacus Fusion Agent Swarm Strategy

Branch: `docs/abacus-fusion-swarm-strategy`
Mode: external-agent strategy / docs only
Runtime changed: no
Provider state changed: no
Database writes run: no

## Summary

Added a UPRISE-specific operating playbook for Abacus AI Agent Swarm /
Fusion-style workflows.

The strategy is based on current Abacus help docs and existing UPRISE
external-agent guardrails. The key decision is that UPRISE should use swarms for
parallel mapping and independent deliverables, not as the default implementer of
one tightly coupled branch.

## External Research Used

- `https://abacus.ai/help/chatllm-ai-super-assistant/agent-swarms`
- `https://abacus.ai/help/chatllm-ai-super-assistant/deepagent`
- `https://abacus.ai/help/chatllm-ai-super-assistant/deepagent-tasks`

## Files Changed

- `docs/solutions/ABACUS_FUSION_AGENT_SWARM_STRATEGY_R1.md`
- `docs/agent-briefs/EXTERNAL_TOOLS.md`
- `docs/solutions/EXTERNAL_AGENT_HARDENING_R1.md`
- `docs/solutions/EXTERNAL_ASSISTANT_REPO_BRIEF_R1.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-06-24_abacus-fusion-agent-swarm-strategy.md`

## Current Recommendation

First experiment:

- Run Abacus Agent Swarm in read-only mode against the Prime Model /
  community-scaling architecture map.
- Split workers by authority/drift, runtime/data, UX/surface, QA/test strategy,
  and decision packet.
- Bring the output back to the main repo agent for verification before any
  implementation work.

## What Was Not Done

- No Abacus swarm was run from this branch.
- No runtime code changed.
- No provider settings changed.
- No database writes, migrations, or seeds were run.
- No implementation branch was opened from swarm output.

