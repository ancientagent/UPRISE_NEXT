# Feature Plan Review Gate Founder Session

Status: raw founder-session capture
Date: 2026-07-03
Source: current chat/session
Related lane(s): context-steward, external-tools, all feature implementation lanes
Owner spec candidates: docs/specs/system/documentation-framework.md; docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md; docs/AGENT_STRATEGY_AND_HANDOFF.md

## Raw Founder Notes

> we need to make a rule that before an agent goes to implement a feature that they have reviewed all aspects of the feature against the repo and that they must have their development plan reviewed by another codex

## Clarifications

- Feature implementation should not start from memory, chat-only assumptions, or an isolated prompt. The executor must review the feature against current repo authority before editing.
- Type: settled
- Likely owner: `docs/specs/system/documentation-framework.md`; `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`

- Feature implementation requires a written development plan reviewed by an independent Codex agent before executor edits begin.
- Type: settled
- Likely owner: `docs/specs/system/documentation-framework.md`; `docs/AGENT_STRATEGY_AND_HANDOFF.md`

## Feature Sets

- Pre-implementation feature gate
- Raw basis: "before an agent goes to implement a feature... reviewed all aspects... development plan reviewed by another codex"
- Included behavior:
  - repo-grounded feature review before implementation edits
  - written development plan
  - independent Codex plan review before executor readiness is marked yes
  - conditional use through existing Execution Packet / Executor Readiness blocks
- Excluded / not activated:
  - no new PM harness
  - no per-issue context packet files by default
  - no reviewer/QA gate for tiny low-risk docs-only or local cleanup work
- Status: settled

## Working Interpretation

- This is an operating/process rule, not a product doctrine change.
- It should live in the documentation framework and AI stack routing docs, with a short pointer in the default agent strategy doc.
- The gate applies to feature implementation and behavior-changing UI/API/runtime work. Tiny docs-only/local cleanup work can skip it only when the branch owner can prove low risk.

## Promotion Targets

- Owner spec: `docs/specs/system/documentation-framework.md`
- Agent/tool routing: `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`
- Default agent strategy: `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- Linear/PM: Execution Packet / Executor Readiness fields can be copied into Linear or PM notes as execution state only.

## Do Not Drift

- Do not let an implementation agent start feature edits without a repo-grounded feature review.
- Do not let the executor self-approve its own development plan for significant feature work.
- Do not treat external-agent output, Linear, or chat memory as enough repo review by itself.
- Do not turn this into a heavy harness for tiny low-risk docs-only cleanup.
