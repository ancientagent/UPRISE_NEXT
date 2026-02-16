# Model Onboarding Evaluation

**Status:** `active`  
**Owner:** `platform/agents`  
**Last Updated:** `2026-02-15`

## Purpose
Use this checklist to qualify any new model before it can execute implementation work in UPRISE_NEXT.

## Required Inputs
- Required reading list from `AGENTS.md`
- Canon sources in `docs/canon/`
- Current specs in `docs/specs/`
- Current guardrails in `docs/FEATURE_DRIFT_GUARDRAILS.md` and `apps/web/WEB_TIER_BOUNDARY.md`

## 4-Stage Qualification Flow

### Stage 1: Read-Only Onboarding
- Instruct model to do a read-only repo onboarding pass.
- Require:
  - repo map
  - canon summary
  - spec coverage matrix
  - risk list
  - proposed sprint
- Reject if it makes edits or invents missing facts.

### Stage 2: Evidence Correction Pass
- Re-run findings with evidence-only constraints.
- Every claim must include:
  - exact file path
  - code/doc snippet
  - confidence level (`High|Medium|Low`)
- Any unsupported claim must be marked `Unknown`.

### Stage 3: Single-Task Execution Trial
- Assign one bounded task only.
- Require full validation:
  - `pnpm run typecheck`
  - `pnpm run test`
  - `pnpm run build`
  - `pnpm run infra-policy-check`
  - `pnpm run docs:lint`
- Require docs hygiene:
  - spec touch if behavior changed
  - `docs/CHANGELOG.md` entry
  - handoff note in `docs/handoff/` for multi-step work

### Stage 4: Reliability Scorecard
- Score 1-5 for each category:
  - Evidence accuracy
  - Canon alignment
  - Drift control
  - Boundary compliance
  - Test discipline
  - Documentation quality
  - Handoff clarity

## Pass/Fail Policy
- **Pass:** no critical violations; average score >= 4.0; no unverified claims in final report.
- **Conditional pass:** average >= 3.5 with explicit restrictions (for example: planning-only).
- **Fail:** any feature drift, boundary violation, fabricated evidence, or skipped validation steps.

## Standard Prompts

### Prompt A: Read-Only Onboarding
```text
You are joining UPRISE_NEXT as an implementation agent. Do an onboarding read-only pass first. Do not edit files.

Read in order:
1) docs/STRATEGY_CRITICAL_INFRA_NOTE.md
2) docs/RUNBOOK.md
3) docs/FEATURE_DRIFT_GUARDRAILS.md
4) docs/architecture/UPRISE_OVERVIEW.md
5) docs/PROJECT_STRUCTURE.md
6) apps/web/WEB_TIER_BOUNDARY.md
7) docs/AGENT_STRATEGY_AND_HANDOFF.md
8) docs/README.md
9) docs/solutions/README.md
10) docs/canon/*.md

Output:
A) Repo map
B) Canon extraction
C) Spec status matrix
D) Drift/risk list
E) Next sprint (5-10 tasks)
F) Blocker questions
```

### Prompt B: Evidence Correction
```text
Re-run your report as evidence-only.

Rules:
- No assumptions.
- Every status claim must include file path + snippet + confidence.
- If no evidence exists, mark Unknown.
- Do not edit files.

Output:
1) Corrected status matrix
2) Founder-lock blockers only
3) Can-implement-now list
4) Do-not-implement-yet list
```

### Prompt C: Single-Task Execution
```text
Implement Task 1 only. No extra scope.

Requirements:
- Canon-first, no feature drift.
- Keep web-tier boundary intact.
- Run typecheck, test, build, infra-policy-check, docs:lint.
- Update touched specs/changelog/handoff note as needed.
- Return files changed, validation results, and explicitly deferred items.
```

## Evaluation Record (Fill Per Model)
- Model:
- Date:
- Evaluator:
- Stage 1 result:
- Stage 2 result:
- Stage 3 result:
- Scorecard:
  - Evidence accuracy:
  - Canon alignment:
  - Drift control:
  - Boundary compliance:
  - Test discipline:
  - Documentation quality:
  - Handoff clarity:
- Final decision: `Pass | Conditional pass | Fail`
- Restrictions (if any):
- Follow-up actions:

## References
- `docs/RUNBOOK.md`
- `docs/FEATURE_DRIFT_GUARDRAILS.md`
- `apps/web/WEB_TIER_BOUNDARY.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/CHANGELOG.md`
