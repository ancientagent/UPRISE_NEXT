# 2026-06-25 - Documentation Framework and Lane System

Date: 2026-06-25
Branch: `docs/abacus-fusion-swarm-strategy`
Status: implemented documentation-system slice
Scope: context management, lane-agent ownership, contract ownership, Linear execution structure, reviewer routing

## Purpose

This slice installs the context-management strategy requested by the founder: agents should know what they are building without loading the entire doc history or repeatedly asking micro-feature questions.

## Implemented

- Replaced the older `docs/specs/system/documentation-framework.md` with the active owner spec for the documentation/context system.
- Added the document-layer model:
  - orientation,
  - lane briefs,
  - owner specs,
  - handoffs/audits,
  - legacy/external imports.
- Added the contract-owner rule: durable cross-system behavior lives in one owner spec or owner section under `docs/specs/**`; briefs and handoffs should summarize/link instead of duplicating every rule.
- Added a lane-agent model covering:
  - `uprise-context-steward`,
  - `uprise-onboarding-home`,
  - `uprise-registrar-source`,
  - `uprise-community-activation`,
  - `uprise-fairplay-broadcast`,
  - `uprise-media-release`,
  - `uprise-events-archive`,
  - `uprise-sects-governance`,
  - `uprise-business-later`,
  - `uprise-design-ui`,
  - `uprise-infra-hosting`.
- Added Linear execution guidance and an issue template.
- Added handoff promotion rules so accepted founder decisions move into owner specs instead of remaining in chat/handoff memory.
- Added question discipline so reviewers ask only questions that affect data model, API, runtime, voting/authority, source ownership, activation workflow, launch scope, or cross-lane documentation authority.
- Added reviewer routing for `uprisereviewer`, `upriseauditor`, Cloud Codex/OpenClaw/Abacus.
- Linked the framework from:
  - `AGENTS.md`,
  - `docs/AGENT_STRATEGY_AND_HANDOFF.md`,
  - `docs/agent-briefs/CONTEXT_ROUTER.md`,
  - `docs/README.md`,
  - `docs/specs/README.md`.

## How Future Agents Should Use This

1. Start from `AGENTS.md`, `docs/PLATFORM_START_HERE.md`, and `docs/agent-briefs/CONTEXT_ROUTER.md`.
2. Use the active lane brief to identify the owner spec.
3. Patch durable product truth in the owner spec first.
4. Keep orientation/brief updates short.
5. Use Linear for execution tracking, not product truth.
6. Use `uprisereviewer` for narrow review and `upriseauditor` only for broad drift sweeps.

## Current Initial Issue Candidates

Seed these into Linear or implementation planning when ready:

1. Define source registration / source origin contract.
2. Define community activation workflow around music-content and source-diversity thresholds.
3. Define proxy scene music lifecycle and migration contract.
4. Define Release Deck media eligibility contract.
5. Define Fair Play / proxy vote / tier propagation contract.
6. Define sect readiness and Sect Uprise boundary.
7. Audit runtime parity against the Music-Community Preference Contract.

## Validation

- `pnpm run docs:lint`
- `git diff --check`

## Files Changed

- `AGENTS.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/README.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/specs/README.md`
- `docs/specs/system/documentation-framework.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-06-25_documentation-framework-lane-system.md`
