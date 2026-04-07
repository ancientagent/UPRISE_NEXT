# UPRISE AutoHarness R1

**Status:** `active`
**Owner:** `founder + codex`
**Last Updated:** `2026-04-05`

## Purpose
Create a model-agnostic control layer that prevents product drift across external builders, chat models, and coding agents.

This is not an autonomous coding system.
This is the doctrine and review harness that sits between founder intent and model output.

## Problem
Model quality changes.
Tooling changes.
Prompt state degrades.
Without a stable harness, every new model reinterprets UPRISE from scratch and reintroduces the same failures.

## Core Idea
UPRISE should not depend on one model "understanding the product."
Every model should be forced through the same control layer:
- locked invariants
- surface contracts
- drift taxonomy
- review gates
- correction prompts

## Operating Model
`Founder -> Codex -> External Agent`

### Founder supplies
- intent
- corrections
- product decisions
- acceptance or rejection

### Codex supplies
- prompt construction
- constraint packing
- mode selection
- drift review
- correction prompts
- repo-grounded truth checks

### External agent supplies
- candidate reasoning
- candidate plans
- candidate builds
- nothing is trusted until it passes the harness

## Non-Negotiable Invariants
These are the first gate for any serious output.

1. The persistent player is a governing system.
2. Player context must be considered on every surface, feature, menu, modal, and flow.
3. Home Scene identity is `city + state + music community`.
4. Plot is structural, not Home.
5. Current MVP Plot tabs are `Feed`, `Events`, `Promotions`, `Statistics`.
6. Discover is tier-aware and player-anchored.
7. Discover search scope is bounded by current player tier/context.
8. Travel is attached to the bottom of the player.
9. The Discover map expands downward from the player.
10. Support visibility is core product logic.
11. Identity is functional, not vanity.
12. Metrics are descriptive, not authoritative.
13. Do not import generic streaming-app, social-network, or creator-vanity defaults.
14. Do not invent new tabs, search systems, governance systems, or interaction models unless explicitly requested.

## Harness Layers
### 1. Truth layer
Canonical repo truth:
- `AGENTS.md`
- canon
- active specs
- founder locks in `docs/solutions/`
- current branch/runtime evidence

### 2. Contract layer
Each major surface should have a compact contract covering:
- purpose
- governing context
- what must exist
- what must not happen
- known drift patterns

### 3. Prompt layer
Every external model prompt should be structured by:
- current mode (`Discussion`, `Plan`, `Thinking`)
- scope
- locked truths
- exclusions
- required response structure

### 4. Review layer
Every meaningful output must be classified as:
- `keep`
- `revise`
- `reject`
- `convert to founder decision`

### 5. Failure layer
Every recurring bad output becomes a logged drift case in `docs/solutions/UPRISE_DRIFT_TAXONOMY_R1.md`.

## Mode Rules
### Discussion mode
Use for:
- truth refinement
- contradiction finding
- surface pressure-testing
- sequencing proposals for approval

Do not allow:
- implementation plans with tooling detail
- code proposals
- speculative adjacent features
- silent product redesign

### Plan mode
Use for:
- approved sequencing only
- scoped build order
- dependency identification
- explicit exclusions

Do not allow:
- new product decisions
- adjacent surface redesign
- hidden scope expansion

### Thinking / build mode
Use for:
- executing an approved slice only

Do not allow:
- contract rewriting
- unreviewed feature additions
- platform trope imports

## Review Gate
Before accepting any model output, check:
1. Does it preserve the invariants?
2. Does it preserve the active surface contract?
3. Does it invent systems that were not requested?
4. Does it import platform tropes?
5. Does it confuse metrics with authority?
6. Does it detach the product from the persistent player?
7. Does it collapse community identity below `city + state + music community`?

If any answer is `yes`, the output is not accepted as-is.

## Failure Capture Protocol
When a model drifts:
1. classify the failure
2. tie it to the violated invariant or contract
3. write a correction prompt
4. if the drift repeats, log it in the taxonomy

The harness compounds by getting better at rejecting bad output, not by generating more output.

## First-Pass Artifacts
R1 consists of:
- `docs/solutions/UPRISE_AUTOHARNESS_R1.md`
- `docs/solutions/UPRISE_DRIFT_TAXONOMY_R1.md`

Recommended next artifact:
- per-surface contract docs for `Home`, `Plot`, `Discover`, `Community`

## What This Is Not
- not a plugin yet
- not autonomous prompt mutation
- not autonomous spec rewriting
- not automatic product decision-making
- not a replacement for founder judgment

## Promotion Path
### Phase 1
Repo doctrine + docs + prompt templates

### Phase 2
Codex skill that:
- loads invariants
- loads drift taxonomy
- reviews external outputs
- emits correction prompts

### Phase 3
Optional automation around:
- drift tagging
- invariant scoring
- regression prompt generation

## References
- `docs/solutions/SOFTWARE_SYSTEMS_GUARDRAILS_R1.md`
- `docs/solutions/ANTI_PLATFORM_TROPE_DRIFT.md`
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `AGENTS.md`
