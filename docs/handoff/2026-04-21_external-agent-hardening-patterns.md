# 2026-04-21 — External agent hardening patterns

## What changed
- Added `docs/solutions/EXTERNAL_AGENT_HARDENING_R1.md`.
- Wired the new hardening patterns into:
  - `.deepagent-desktop/rules/uprise_next_rules.md`
  - `docs/solutions/EXTERNAL_ASSISTANT_REPO_BRIEF_R1.md`
  - `docs/AGENT_STRATEGY_AND_HANDOFF.md`
  - `docs/solutions/AGENT_WIKI_STEERING_R1.md`

## Why
- Recent external-agent research surfaced useful workflow patterns around:
  - context acquisition before work
  - explicit pause points before critical decisions / edits / completion
  - verification before closeout
  - stronger design-agent context/originality rules
- Those patterns were worth adopting, but not by copying third-party prompts wholesale.

## Repo effect
- External assistants now have a clearer operating contract.
- Swarm/delegation tools can be evaluated against explicit UPRISE workflow standards.
- Design agents are less likely to invent from generic app tropes or over-copy outside products.
