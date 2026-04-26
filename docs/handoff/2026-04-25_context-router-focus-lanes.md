# 2026-04-25 — Context Router Focus Lanes

## Summary
Added a lightweight work-lane routing framework so agents can pivot between areas of focus without loading the whole platform context every time.

## Added
- `docs/agent-briefs/CONTEXT_ROUTER.md`

## Updated
- `docs/agent-briefs/README.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/CHANGELOG.md`

## Why
The section briefs solve part of the context problem, but work often crosses domains. The router defines the active focus lane first, then loads companion briefs only when the task touches that domain.

## Current Focus Lanes
- `UX_UI`
- `ACTIONS_SIGNALS`
- `ARTIST_SOURCE`
- `EVENTS_ARCHIVE`
- `BUSINESS_MONETIZATION`
- `ONBOARDING_HOME_SCENE`
- `REGISTRAR_GOVERNANCE`
- `EXTERNAL_TOOLS`
- `INFRA_RUNTIME_QA`

## Key Rule
Load for the lane, not for the whole platform.

For the current UX/UI lane, agents should load placement, behavior, action visibility, visual/art direction, and design constraints. They should not load business models, registrar formulas, pricing, infrastructure, or old feature history unless the UI task directly touches those domains.

## Verification
- `pnpm run docs:lint`
- `git diff --check`
