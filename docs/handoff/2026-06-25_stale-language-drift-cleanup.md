# 2026-06-25 - Stale Language Drift Cleanup

Date: 2026-06-25
Branch: `docs/abacus-fusion-swarm-strategy`
Status: implemented stale-language cleanup
Scope: active repo language, user-facing onboarding/Plot copy, active infra docs, Social tab spec wording, Linear search check

## Purpose

Remove or quarantine stale language that could cause future agents to rebuild old product behavior after the documentation-framework work.

## Linear Search Check

Linear tools were available, but UPRISE-specific searches did not return UPRISE issues in the connected workspace:

- `UPRISE pioneer` returned no issues.
- `UPR` returned no issues.
- `uprise radiyo` returned no issues.
- A broad `Home Scene` query returned Gistlister issues, confirming the connected Linear context is currently not exposing UPRISE Radiyo issues for this session.

No Linear issue edits were made.

## Repo Cleanup Implemented

### User-facing pioneer language

Updated runtime-visible copy in:

- `apps/web/src/app/onboarding/page.tsx`
- `apps/web/src/app/plot/page.tsx`

The UI now uses submitted-Home-Scene and proxy-scene language instead of telling users their Home Scene is `pioneering` or preserving `pioneer intent`.

Updated regression locks in:

- `apps/web/__tests__/onboarding-page-lock.test.ts`
- `apps/web/__tests__/onboarding-regression-lock.test.ts`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`

Internal compatibility names such as `pioneer`, `pioneerHomeScene`, and `pioneerFollowUp` remain in code/tests for now. The owner specs already mark those as runtime cleanup candidates rather than product language.

### Active infra naming

Normalized active docs from `DeepAgent` to `Supercomputer` in:

- `AGENTS.md`
- `docs/STRATEGY_CRITICAL_INFRA_NOTE.md`
- `docs/RUNBOOK.md`
- `docs/ENVIRONMENTS.md`
- `docs/agent-briefs/README.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/solutions/MVP_CURRENT_EXECUTION_ROADMAP_R1.md`
- `docs/solutions/DEPLOY_TARGET_READINESS_R1.md`

Legacy/handoff/changelog references were left untouched unless they were part of active routing.

### Social tab wording

Updated `docs/specs/social/message-boards-groups-blast.md` so it no longer says the current Plot shell includes a Social placeholder. The spec now matches current Plot truth: MVP tabs remain `Feed`, `Events`, and `Archive`; Social remains future/deferred until an explicit UI/API contract ships.

### Solution-doc drift notes

Updated active/high-risk solution docs so they no longer promote `pioneer intent` as active user-facing language:

- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/NARRATIVE_CARRY_FORWARD_RULES_R1.md`
- `docs/solutions/NARRATIVE_RECONCILIATION_GAP_REPORT_R1.md`
- `docs/agent-briefs/UPRISE_HERMES_LAUNCH_REVIEWER.md`

## Remaining Acceptable Hits

Expected remaining search hits include:

- explicit guardrails saying not to build listener-side pioneer activation queues;
- legacy compatibility field names awaiting runtime cleanup;
- V2/deferred Social-tab references;
- historical handoff/changelog/canon evidence.

These should not be treated as current user-facing product language.

## Validation

- `pnpm --filter web test -- onboarding-page-lock.test.ts onboarding-regression-lock.test.ts plot-ux-regression-lock.test.ts`
- `pnpm run docs:lint`
- `git diff --check`

