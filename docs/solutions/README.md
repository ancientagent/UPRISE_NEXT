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
- `docs/solutions/SOFTWARE_SYSTEMS_GUARDRAILS_R1.md` — strict systems-thinking rules for software composition, context inheritance, and control-surface discipline
- `docs/solutions/UPRISE_AUTOHARNESS_R1.md` — founder-to-agent control harness for prompt shaping, drift review, and model-agnostic product-truth enforcement
- `docs/solutions/UPRISE_DRIFT_TAXONOMY_R1.md` — recurring UPRISE-specific drift cases and correction directions for external models and agents
- `docs/solutions/SEAMLESS_AGENT_CONTINUITY_PROTOCOL_R1.md` — standard handoff system for preserving canon, active working memory, and executable next steps across agents and sessions
- `docs/solutions/FOUNDER_DECISION_CAPTURE_PROTOCOL_R1.md` — mandatory same-pass salvage rule for founder decisions that change product truth, scope, terminology, or lifecycle behavior
- `docs/solutions/SURFACE_CONTRACT_HOME_R1.md` / `SURFACE_CONTRACT_PLOT_R1.md` / `SURFACE_CONTRACT_DISCOVER_R1.md` / `SURFACE_CONTRACT_COMMUNITY_R1.md` — minimum stable per-surface contracts for Home, Plot, Discover, and Community
- `docs/solutions/ROLLBACK_CHECKPOINT_CHEATSHEET.md` — safe rollback/checkpoint flow
- `docs/solutions/SESSION_STANDING_DIRECTIVES.md` — paste-ready session policy block
- `docs/solutions/LEAN_CONTEXT_OPERATING_RULES_R1.md` — keep dense doctrine/implementation work from wasting session context
- `docs/solutions/PHASE_STOP_GATE_PLAYBOOK.md` — stop-gate process to prevent infinite batching after convergence
- `docs/solutions/NARRATIVE_CARRY_FORWARD_RULES_R1.md` — prevents context narrowing below valid repo/carry-forward truth
- `docs/solutions/LATER_VERSION_DOMAIN_UNDERSTANDINGS_R1.md` — preserves legitimate later-version domains without silently widening current MVP scope

## Active Founder Locks / Execution Guides
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_EXPLICIT_DEFERRED_LIST_R1.md`
- `docs/solutions/MVP_WEB_UX_IMPLEMENTATION_BRIEF_R1.md`
- `docs/solutions/MVP_UX_BATCH27_EXECUTION_PLAN.md`

## Additional Playbooks
- `docs/solutions/MODEL_ONBOARDING_EVAL.md`
- `docs/solutions/USER_ISARTIST_DEPRECATION_READINESS.md`
- `docs/solutions/WEB_TS6053_NEXT_TYPES.md`
- `docs/solutions/NEXT_FONT_GOOGLE_FONTS_BUILD_FAIL.md`
- `docs/solutions/PRISMA_MIGRATION_DRIFT_RECOVERY.md`
- `docs/solutions/AUTONOMOUS_AGENT_BRIDGE_RUNBOOK.md`
- `docs/solutions/EXTERNAL_AUDITOR_QUEUE_BRIDGE_R1.md`
- `docs/solutions/RELIANT_WORKFLOW_PILOT.md`
- `docs/solutions/RELIANT_ORCHESTRATOR_RUNBOOK.md`
- `docs/solutions/MVP_CURRENT_EXECUTION_ROADMAP_R1.md`
- `docs/solutions/MVP_PHASE1_PHASE2_ACTION_BOARD_R1.md`
- `docs/solutions/MVP_HARD_ROADMAP_EXECUTION_PLAN.md`
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
- `docs/solutions/MVP_PLAYER_PROFILE_INTERACTION_R1.md`
- `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`
