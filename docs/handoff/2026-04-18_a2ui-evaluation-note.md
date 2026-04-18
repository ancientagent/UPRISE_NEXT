# 2026-04-18 — A2UI Evaluation Note

## Summary
Reviewed A2UI as a possible fit for the UPRISE stack.

Source reviewed:
- `https://github.com/google/A2UI`

## What A2UI Is
A2UI is a declarative agent-to-UI format.

An agent emits structured UI intent as data.
A trusted client renders that intent using its own component catalog.

This makes it useful for:
- agent-generated internal tooling
- assistant panels
- structured review surfaces
- safe multi-agent UI composition

## Why It Is Interesting For UPRISE
UPRISE now has multiple external assistant departments in play:
- design agents
- writing/briefing assistants
- coding/implementation agents

A2UI could later be useful where those departments need structured internal surfaces without handing them arbitrary code execution.

Good future-fit areas include:
- internal admin tools
- generated audit dashboards
- assistant workbench surfaces
- structured review panels for docs/spec/runtime drift

## Why It Is Not The Immediate Next Move
A2UI is a rendering/protocol layer, not product doctrine.

Current priority remains:
- founder locks
- route/surface contracts
- action grammar
- implementation correctness in the existing React/Next stack

Adopting A2UI too early would add a second abstraction layer before core product behavior is fully settled.

## Current Recommendation
### Use later for internal tooling
A2UI is a valid later candidate for:
- internal agent-facing surfaces
- operator/admin tools
- generated structured inspection panels

### Do not use yet for core user-facing UPRISE surfaces
Do not use it yet to drive:
- Plot
- artist profile
- feed
- collection
- primary end-user listening surfaces

Those should continue to be implemented directly against the current repo contracts.

## Decision
- `A2UI` = later integration candidate
- not adopted for current MVP product implementation
- revisit only after the current doctrine/runtime cleanup phase is stable
