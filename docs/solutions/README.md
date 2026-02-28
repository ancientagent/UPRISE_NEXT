# Solutions

Playbooks for recurring problems and operational failures (build breaks, deployment misconfigurations, boundary violations, etc.).

## Rule

If an issue happens **twice**, it gets a Solutions doc.

## What goes here

- Root cause writeups that include **symptoms → diagnosis → fix → prevention → verification**
- “Do this first” checklists for common incidents
- Links to relevant runbook sections, specs, and CI checks

## What does not go here

- Feature requirements (use `docs/specs/`)
- Long-form architecture explanations (use `docs/architecture/`)
- Per-session work notes (use `docs/handoff/`)

## Template

Start from: `docs/solutions/TEMPLATE.md`

## Agent Qualification

For new model onboarding and stress-testing, use:
- `docs/solutions/MODEL_ONBOARDING_EVAL.md`
- `docs/solutions/ANTI_PLATFORM_TROPE_DRIFT.md` (prevents non-canon product-pattern assumptions)
- `docs/solutions/SESSION_STANDING_DIRECTIVES.md` (paste-ready session policy block)
- `docs/solutions/USER_ISARTIST_DEPRECATION_READINESS.md` (bridge/removal readiness workflow for transitional artist marker)

## Web Build/Typecheck Incidents

- `docs/solutions/WEB_TS6053_NEXT_TYPES.md` — `.next/types` TS6053 failures
- `docs/solutions/NEXT_FONT_GOOGLE_FONTS_BUILD_FAIL.md` — `next/font` Google Fonts build failures
- `docs/solutions/PRISMA_MIGRATION_DRIFT_RECOVERY.md` — local/dev Prisma migration drift and failed-history recovery
- `docs/solutions/AUTONOMOUS_AGENT_BRIDGE_RUNBOOK.md` — scheduler/chat bridge setup for queue-driven multi-agent autonomy
- `docs/solutions/RELIANT_WORKFLOW_PILOT.md` — repo-local Reliant workflow pilot for slice plan→implement→verify→review execution
- `docs/solutions/RELIANT_ORCHESTRATOR_RUNBOOK.md` — queue-driven Reliant parent workflow for sequential slice execution with done/blocked continuation
- `docs/solutions/ROLLBACK_CHECKPOINT_CHEATSHEET.md` — deterministic rollback checkpoints, compare-first flow, and safe revert patterns for multi-agent throughput runs
- `docs/solutions/MVP_HARD_ROADMAP_EXECUTION_PLAN.md` — spec-locked execution roadmap from current registrar-heavy throughput to full MVP launch readiness
- `docs/solutions/MVP_UX_ALIGNMENT_REPORT_R1.md` — canon/spec-anchored UX alignment report and demo/sample process before UX implementation
- `docs/solutions/MVP_PLATFORM_COVERAGE_MATRIX_R1.md` — one-page whole-platform MVP coverage map (done/partial/missing) to prevent registrar-only execution bias
