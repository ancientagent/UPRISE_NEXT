# Linear Clean Context Agent Roles Founder Session

Status: raw founder-session capture
Date: 2026-07-03
Source: current chat/session
Related lane(s): context-steward, external-tools, all implementation lanes
Owner spec candidates: docs/specs/system/documentation-framework.md; docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md; docs/AGENT_STRATEGY_AND_HANDOFF.md

## Raw Founder Notes

> ok so tell me if this makes sense and then lets make this the new protocol, if there is a linear issue its because something either is broken, impleneted wrong, needds testing etc..  that said the linear should contain all the context the executor needs. so executore should start with clean context for each issue and every linear should either point to or provide the rules, context, skill/tool recomendation etc. and solution  once it has been completed and confirmed the canon gets updated does this work?

> ok fair,  yes the canon should get updated when the founder confirms the agents understanding, but other than that the point is the assigned agent only looks to the linear because the context is clean

> sorry im talking about two things,, theres the assigned agent and assigning agent.   the assigned agent only looks to the linear,  the assigning agent confirms with the founder

## Clarifications

- Linear issues should function as clean-context execution packets for assigned agents.
- Type: settled
- Likely owner: `docs/specs/system/documentation-framework.md`; `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`

- The assigning agent owns founder confirmation, context assembly, solution direction, required docs/files, skills/tools, and acceptance criteria before assigning the issue.
- Type: settled
- Likely owner: `docs/specs/system/documentation-framework.md`

- The assigned agent starts with clean context per issue and follows the Linear issue plus repo-linked docs/files rather than prior chat history or old handoffs.
- Type: settled
- Likely owner: `docs/specs/system/documentation-framework.md`; `docs/AGENT_STRATEGY_AND_HANDOFF.md`

- Canon should update only after founder-confirmed understanding changes canon-level doctrine/terminology. Otherwise durable behavior belongs in the appropriate owner spec, with tests/handoff/changelog/PM updates as needed.
- Type: settled
- Likely owner: `docs/specs/system/documentation-framework.md`

## Feature Sets

- Linear clean-context assignment protocol
- Raw basis: assigned agent only looks to Linear; assigning agent confirms with founder
- Included behavior:
  - assigning agent creates complete Linear packet
  - assigning agent confirms ambiguous/product-changing understanding with founder
  - assigned agent starts clean and executes from Linear plus repo-linked authority
  - durable confirmed truth is promoted to canon or owner specs as appropriate
- Excluded / not activated:
  - Linear does not become product authority
  - assigned agent should not rely on hidden chat context
  - not every closed issue updates canon
- Status: settled

## Working Interpretation

- There are two roles: assigning agent and assigned agent.
- The assigning agent is responsible for making the issue executor-ready.
- The assigned agent should not have to reconstruct intent from chat or old handoffs.
- Linear carries context pointers and execution state; repo docs/specs/canon remain durable authority.

## Promotion Targets

- Owner spec: `docs/specs/system/documentation-framework.md`
- Agent routing: `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`
- Default strategy: `docs/AGENT_STRATEGY_AND_HANDOFF.md`

## Do Not Drift

- Do not assign vague Linear issues that require executor archaeology.
- Do not expect assigned agents to read prior chat for hidden product truth.
- Do not let Linear override owner specs or canon.
- Do not update canon for every issue; update canon only for founder-confirmed doctrine/terminology changes.
