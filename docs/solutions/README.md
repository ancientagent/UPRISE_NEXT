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
- `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md` — mobile-first UX source-of-truth (layout, gestures, state model, and web adaptation rules) for post-alignment implementation
- `docs/solutions/MVP_MOBILE_UX_MAPPING_FROM_PLOT_PROTOTYPE_R1.md` — frozen mapping of current Plot prototype decisions into the mobile-first UX system format
- `docs/solutions/MVP_PLATFORM_COVERAGE_MATRIX_R1.md` — one-page whole-platform MVP coverage map (done/partial/missing) to prevent registrar-only execution bias
- `docs/solutions/MVP_PROFILE_EXPANDED_MOCKUP_R1.md` — profile IA contract (collapsed/expanded sections and collection tab content)
- `docs/solutions/MVP_PLAYER_PROFILE_INTERACTION_R1.md` — interaction contract for panel states and player mode transitions
- `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md` — micro-decision drift guard checklist for mobile MVP UX
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md` — full `/plot` + profile surface contract (elements, states, ownership)
- `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md` — element-by-element screenshot capture with MVP/V2 boundaries
- `docs/solutions/MVP_UIZARD_PROMPT_PACK_R1.md` — baseline Uizard prompt pack
- `docs/solutions/MVP_UIZARD_PROMPT_PACK_R2_STRICT.md` — strict per-screen Uizard prompt pack with MUST/NEVER and acceptance checks
- `docs/solutions/MVP_UX_TOOLING_STACK_R1.md` — consolidated tooling guidance for this UX stage
- `docs/solutions/MVP_DESIGN_PLATFORM_PACK_R1.md` — multi-platform design handoff (Uizard/Figma/Penpot/Balsamiq)
- `docs/solutions/NEW_CHAT_BOOTSTRAP_PROMPT_UX_R1.md` — copy/paste bootstrap for fresh high-context sessions
- `docs/solutions/UIZARD_MCP_SERVER_SETUP.md` — in-repo Uizard MCP server setup and auth wiring notes
