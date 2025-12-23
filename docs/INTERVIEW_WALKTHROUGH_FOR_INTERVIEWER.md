# UPRISE_NEXT — Interview Walkthrough (For Interviewer)

**Goal:** Follow along with the repo discussion without needing deep context.  
**Time:** ~5–8 minutes total reading/skimming  
**Note:** This is intentionally top‑down. It points you to where “truth” and guardrails live.

---

## 1) Start Here (60–90 seconds)

1. `README.md` — what the repo is at a glance (monorepo structure + tech stack).
2. `AGENTS.md` — the operating rules for contributors/agents (required reading + non‑negotiables).

---

## 2) Governance & Guardrails (2–3 minutes)

Open these in order:

1. `docs/INTERVIEW_ONE_PAGER.md` — top‑down overview (product concept + architecture + governance).
2. `docs/FEATURE_DRIFT_GUARDRAILS.md` — “spec‑first / no drift” policy.
3. `docs/RUNBOOK.md` — operations + verification expectations.
4. `apps/web/WEB_TIER_BOUNDARY.md` — strict boundary: web is untrusted; no DB/secrets in web tier.

---

## 3) “Proof of Enforcement” (1–2 minutes)

These are the concrete enforcement mechanisms:

1. `.github/workflows/ci.yml` — build/typecheck/test pipeline (quality gate).
2. `.github/workflows/secrets-check.yml` — secret scanning.
3. `.github/workflows/infra-policy-check.yml` — web-tier boundary enforcement.
4. `scripts/docs-lint.mjs` — docs structure guardrails (forbid PDFs, required doc folders, etc.).

---

## 4) Specs (Optional, 1–2 minutes)

If you want to see how “what we build” is authorized:

- `docs/specs/README.md` (new module-based specs)
- `docs/Specifications/README.md` (legacy canonical IDs while migration continues)
- Example system specs:
  - `docs/specs/system/documentation-framework.md`
  - `docs/specs/system/agent-handoff-process.md`
  - `docs/specs/system/web-tier-contract-guard.md`
  - `docs/specs/system/ci-cd-pipeline.md`

---

## What Not To Assume

- A feature is “implemented” only if there is a spec + code + verification evidence.
- Any sensitive values are intentionally not present in docs (env vars are referenced by name only).

