# 🧱 FEATURE_DRIFT_GUARDRAILS.md — Spec-First Policy (Zero Drift)

**Status:** 🔴 Critical  
**Applies To:** All agents and contributors  
**Goal:** Prevent feature drift, scope creep, and accidental boundary violations.

---

## What “Feature Drift” Means

Feature drift is any change that introduces new behavior, new surface area, or new contracts that are not explicitly documented and agreed upon.

Examples:
- Adding a new API endpoint not described in a spec.
- Introducing a new database model/migration without a spec update.
- Implementing UI flows that imply new backend behavior without a corresponding contract.
- Bypassing architectural boundaries (e.g., web tier importing server/data modules).

---

## Policy (Zero Tolerance)

### ✅ Allowed (without creating new specs)
- Fix build failures, type errors, and CI breakages.
- Fix bugs in already-documented behavior.
- Refactors that do not change external behavior (same inputs/outputs).
- Documentation improvements and link hygiene.

### ❌ Not Allowed (without an explicit spec update + approval)
- New features, flows, or modules “from imagination”.
- New API endpoints, DB models, or migrations outside documented requirements.
- New auth/roles/permissions semantics without an approved spec.
- Web-tier violations (DB access, secrets, server-only imports).

If it’s unclear whether something is “new behavior”, treat it as drift and stop.

---

## Spec Sources of Truth

Before implementing anything beyond a bugfix/refactor, ensure there is a spec:

- **Module-organized specs:** `docs/specs/` (preferred for new work)
- **Legacy canonical IDs/index:** `docs/Specifications/` (still referenced by existing docs/IDs)

If the relevant spec does not exist:
1. Create/extend a spec under `docs/specs/` using `docs/specs/TEMPLATE.md`.
2. If legacy IDs are involved, update `docs/Specifications/README.md` or add a note linking to the new spec.
3. Ask for human confirmation if scope/priority is unclear.

---

## Practical Checklist (Before You Code)

- [ ] I can point to the spec that authorizes this work (`docs/specs/...` or `docs/Specifications/...`).
- [ ] Web-tier boundary is respected (`apps/web/WEB_TIER_BOUNDARY.md`).
- [ ] Any shared contract changes are reflected in `packages/types` (and regenerated where applicable).
- [ ] PR description will include: Deployment Target, Phase, Specs links, and source agent tag.

---

## References
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/RUNBOOK.md`
- `docs/PROJECT_STRUCTURE.md`
- `apps/web/WEB_TIER_BOUNDARY.md`
