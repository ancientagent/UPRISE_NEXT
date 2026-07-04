---
name: uprise-founder-clarification-capture
description: Use when the UPRISE founder gives a clarification that may change durable product truth, terminology, thresholds, lifecycle rules, action grammar, source/voting authority, specs, tests, or future implementation.
---

# UPRISE Founder Clarification Capture

## Core Rule

Founder clarifications that change behavior must land in the owner spec, not only chat, handoff, Linear, or memory.

Do not invoke this for every short agreement, status answer, or already-settled
repo fact. If current owner specs already cover the point, cite the existing
source and avoid a new doc patch unless stale wording would mislead future
agents.

## First Pass

Classify the clarification:

- new durable rule
- correction to stale language
- implementation detail
- deferred/future idea
- open founder decision
- no-op because current docs already cover it

Then identify affected lanes and owner contract using:

- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/specs/system/documentation-framework.md`
- `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`

## Output Before Editing

```md
Clarification:
Affected lanes:
Current owner spec:
Docs likely needing patch:
Runtime/tests likely impacted:
Decision status: settled | open | deferred | already documented
Questions still needed: <only high-value blockers>
```

## Patch Rule

If editing is authorized:

1. Patch the owner spec first.
2. Patch lane brief summaries only if agents need routing help.
3. Add or update `docs/CHANGELOG.md`.
4. Add a dated handoff for multi-step clarification sessions.
5. Avoid duplicating micro-rules across many docs.

## Common Mistakes

- Asking repeated micro-questions after the owner contract is clear.
- Turning brainstorms into implementation scope without confirmation.
- Patching a handoff instead of the owner spec.
- Letting old terms such as `pioneer` survive when the clarification supersedes them.
