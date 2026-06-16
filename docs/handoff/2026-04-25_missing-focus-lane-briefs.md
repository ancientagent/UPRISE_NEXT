# Missing Focus Lane Briefs

Date: 2026-04-25
Branch: `feat/ux-founder-locks-and-harness`
Status: active carry-forward

## Summary
Created the four focus-lane briefs that `docs/agent-briefs/CONTEXT_ROUTER.md` expected but did not yet have as first-class files:
- `docs/agent-briefs/BUSINESS_MONETIZATION.md`
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
- `docs/agent-briefs/REGISTRAR_GOVERNANCE.md`
- `docs/agent-briefs/EXTERNAL_TOOLS.md`

These briefs reduce context load by giving agents a narrow default packet for business, onboarding, registrar, and external-tool tasks instead of making them search broad canon/spec/handoff history.

## Source Inputs
- Cloud Codex focus-stage inventory identifying the missing brief files.
- `docs/specs/economy/revenue-and-pricing.md`
- `docs/specs/economy/print-shop-and-promotions.md`
- `docs/solutions/MVP_EXPLICIT_DEFERRED_LIST_R1.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/specs/system/registrar.md`
- `docs/solutions/EXTERNAL_ASSISTANT_REPO_BRIEF_R1.md`
- `docs/solutions/EXTERNAL_AGENT_HARDENING_R1.md`

## Locked Routing Outcome
- Business work loads `BUSINESS_MONETIZATION.md` first and treats current business runtime as limited/deferred unless an active lock explicitly promotes the feature.
- Onboarding/Home Scene work loads `ONBOARDING_HOME_SCENE.md` first and preserves the `city + state + music community` identity rule.
- Registrar/governance work loads `REGISTRAR_GOVERNANCE.md` first and keeps Registrar on the listener/base-identity civic side.
- External-tool work loads `EXTERNAL_TOOLS.md` first and treats NotebookLM, Claude Designer, Stitch, Abacus, Cloud Codex, and generated wiki systems as departments, not authorities.

## Maintenance Note
When any of these lanes changes product truth, update the lane brief in the same pass as the owning spec/founder lock and add a dated handoff if the change materially affects future agent loading.
