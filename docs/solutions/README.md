# Solutions

Playbooks for recurring problems and operational failures (build breaks, deployment misconfigurations, boundary violations, etc.).

## Rule
If an issue happens **twice**, it gets a Solutions doc.

## What Goes Here
- Root cause writeups that include **symptoms → diagnosis → fix → prevention → verification**
- “Do this first” checklists for common incidents
- Reusable workflow protocols and guardrails
- Links to relevant runbook sections, specs, and CI checks

## What Does Not Go Here
- Feature requirements (use `docs/specs/`)
- Long-form architecture explanations (use `docs/architecture/`)
- Per-session work notes (use `docs/handoff/`)

## Template
Start from: `docs/solutions/TEMPLATE.md`

## Start Here For Agent Workflow
- `docs/solutions/AGENT_WORKFLOW_PROTOCOL_R1.md` — current recommended multi-agent operating protocol
- `docs/solutions/ANTI_PLATFORM_TROPE_DRIFT.md` — prevents non-canon product-pattern assumptions
- `docs/solutions/ROLLBACK_CHECKPOINT_CHEATSHEET.md` — safe rollback/checkpoint flow
- `docs/solutions/SESSION_STANDING_DIRECTIVES.md` — paste-ready session policy block
- `docs/solutions/PHASE_STOP_GATE_PLAYBOOK.md` — stop-gate process to prevent infinite batching after convergence
- `docs/solutions/NARRATIVE_CARRY_FORWARD_RULES_R1.md` — prevents context narrowing below valid repo/carry-forward truth

## Active Founder Locks / Execution Guides
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_WEB_UX_IMPLEMENTATION_BRIEF_R1.md`
- `docs/solutions/MVP_UX_BATCH27_EXECUTION_PLAN.md`

## Additional Playbooks
- `docs/solutions/MODEL_ONBOARDING_EVAL.md`
- `docs/solutions/USER_ISARTIST_DEPRECATION_READINESS.md`
- `docs/solutions/WEB_TS6053_NEXT_TYPES.md`
- `docs/solutions/NEXT_FONT_GOOGLE_FONTS_BUILD_FAIL.md`
- `docs/solutions/PRISMA_MIGRATION_DRIFT_RECOVERY.md`
- `docs/solutions/AUTONOMOUS_AGENT_BRIDGE_RUNBOOK.md`
- `docs/solutions/RELIANT_WORKFLOW_PILOT.md`
- `docs/solutions/RELIANT_ORCHESTRATOR_RUNBOOK.md`
- `docs/solutions/MVP_HARD_ROADMAP_EXECUTION_PLAN.md`
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
- `docs/solutions/MVP_PLAYER_PROFILE_INTERACTION_R1.md`
- `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`
