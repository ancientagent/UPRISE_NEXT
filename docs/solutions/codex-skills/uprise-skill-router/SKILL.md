---
name: uprise-skill-router
description: Use when UPRISE work needs tool or lane routing, external-agent selection, provider/browser workflow choice, branch/review routing, or broad context strategy; do not use for simple exact-file edits or self-contained Q&A.
---

# UPRISE Skill Router

## Purpose

Route UPRISE work to the smallest useful authority packet, specialist skill,
tool, and validation path.

This skill is not product authority. Current repo truth, current code/tests,
active specs, active briefs, and explicit founder decisions remain authoritative.

The current environment can add/drop skills during a session. Treat this router
as a dispatch map, not as a heavy mandatory loading gate.

## Use Lightly

Do not load this skill just because the workspace is `/home/baris/UPRISE_NEXT`.
Use it only when routing is uncertain or the task touches tools, agents,
providers, broad audits, branch hygiene, external handoffs, or multiple lanes.

For exact-file edits, narrow Q&A, or a named owner spec, skip this router and
use the named file plus current repo evidence.

## Fast Path

For routine focused work:

1. Verify repo/branch/status: `pwd`, `git branch --show-current`, `git status --short`.
2. Read `AGENTS.md` and the smallest task-specific doc packet needed.
3. Use `docs/PLATFORM_START_HERE.md` and `docs/agent-briefs/CONTEXT_ROUTER.md` when the lane or authority path is unclear, not as automatic overhead.
4. Pick one lane below.
5. Load only the lane brief plus exact touched files/tests.
6. Add specialist skills/tools only when useful for the lane.
7. Keep unrelated lanes, stale handoffs, legacy docs, and broad canon unloaded unless the task calls for them.

For simple Q&A or a narrow status check, do not force the full fast path. Use
current repo evidence and answer directly.

## Authority Order

When sources conflict:

1. `AGENTS.md`
2. `docs/canon/**` for doctrine/terms
3. active specs under `docs/specs/**`
4. founder locks, active execution docs, and `docs/agent-briefs/**`
5. current runtime code and tests
6. dated handoffs under `docs/handoff/**`
7. chat memory, external-agent output, and legacy docs

Dated handoffs are context, not higher authority than current specs/code.
If a newer active spec/brief intentionally overrides older canon wording, report
the override rather than flattening it.

## Live Skill Loading

Use specialist skills dynamically instead of baking every workflow into this
router.

Skill loading rule:

- Trigger skills from the user request or material task risk, not from habit.
- Prefer one UPRISE specialist skill plus one technical skill when needed.
- Do not chain `uprise-skill-router` -> `uprise-lane-loader` -> multiple lane
  briefs unless the work is broad or ambiguous.
- For behavior-changing feature work, use the repo execution packet/review loop
  instead of trying to solve context by loading more skills.

Common pairings:

- Implementation planning: `superpowers:brainstorming`, `superpowers:writing-plans`
- Test-first code changes: `superpowers:test-driven-development`
- Debugging: `superpowers:systematic-debugging`
- Branch closeout: `superpowers:verification-before-completion`, `superpowers:finishing-a-development-branch`
- Browser/UI verification: `playwright`, `vercel:agent-browser`, `vercel:verification`
- Vercel work: relevant `vercel:*` skill, especially `vercel:vercel-cli`, `vercel:env-vars`, `vercel:deployments-cicd`, `vercel:vercel-api`
- Neon/Postgres work: `neon-postgres:neon-postgres`
- Linear work: `linear:linear`
- Product design: `product-design:get-context` plus the relevant product-design skill
- UPRISE reviews/audits: Codex subagents are default; Hermes is manual fallback/watchdog only.

Do not use a specialist skill just because it exists. Use it when it materially
improves correctness, verification, or workflow discipline.

## Slice Profiles

Use one slice profile before lane-specific loading when the task is more than a
self-contained question or exact-file edit. Profiles decide the workflow shape;
lanes decide the content packet.

### Feature Slice

Use for behavior-changing UI, API, runtime, player, feed, source, registrar,
onboarding, or action work.

Start packet:

- Identify the lane from `docs/agent-briefs/CONTEXT_ROUTER.md`.
- Read the lane brief, owner spec if named by the brief, exact runtime files,
  and focused tests.
- Build a small `QA Trace` before planning edits:
  - current source of the behavior;
  - upstream producers/API/client/store/state;
  - downstream screens/components/actions/tests;
  - docs/spec sections that own the behavior;
  - stale or parallel paths that might duplicate the feature.
  Use repo-native tracing (`rg`, `git grep`, imports, route/client/test
  inspection) rather than legacy app-map/context tools by default.
- Classify whether the change is new behavior, correction of wrong behavior,
  visual polish, or docs-only parity.
- If founder wording changes durable product truth, use
  `uprise-founder-session-capture` before summarizing and
  `uprise-founder-clarification-capture` before owner-spec edits.

Default skills:

- Use `superpowers:brainstorming` before creative or behavior work.
- Use `product-design:get-context` when visible UI/design is part of the slice.
- Use `superpowers:writing-plans` after the design/requirements are confirmed.
- Use `superpowers:test-driven-development` for implementation unless the user
  explicitly scopes the work as a throwaway prototype or docs-only slice.
- Use `uprise-pr-reviewer` or a Codex reviewer after implementation when the
  slice changes product/runtime behavior.

Stop conditions:

- Public surface vs source/admin surface is ambiguous.
- The owner spec does not authorize the behavior.
- The change touches provider, DB, schema, security, canon, or cross-lane
  product truth without explicit approval.
- Existing code appears layered over stale behavior and needs cleanup planning
  before implementation.

Output before implementation:

```md
Slice profile: Feature Slice
Lane:
Owner contract:
Runtime files:
Tests:
QA Trace:
Founder clarification needed: yes/no
Design brief needed: yes/no
Plan review needed: yes/no
Out of scope:
```

### Screen Slice

Use for Plot screens, Artist Profile, Source Dashboard, Registrar, Discover,
Release Deck, Print Shop, Archive, Events, player surfaces, or any screen that
needs shared context to avoid drift.

Default workflow:

1. Pick one small vertical screen section or behavior.
2. Verify branch/HEAD, dirty state, owner spec, lane brief, likely runtime files,
   likely tests, out-of-scope boundaries, and branch/workspace registry state.
3. Use `docs/screen-packages/<slug>/` only when a shared package helps. Its
   required seed is `README.md`, `instruction-packet.md`, and `source-map.md`.
4. If the next implementation step is still ambiguous, create one short
   `implementation/slice-contract.md`.
5. Implement with one branch-owning executor. Subagents are sidecars only:
   bounded research, product design, or review.
6. Use Product Design / Design Spec only when visible hierarchy, states,
   accessibility, responsive behavior, or art direction must be settled before
   implementation.
7. Use one bounded review when behavior/risk justifies it; use xhigh only for
   final/high-risk gates.

Rules:

- Screen-package artifacts live in `docs/screen-packages/`; durable
  product truth remains in owner specs under `docs/specs/`.
- Do not turn every screen slice into a multi-agent package ceremony.
- Do not let Product Design, Creative Studio, or design implementation redefine
  actions, data contracts, auth rules, navigation, or product doctrine.
- Do not use this profile for tiny docs-only, copy-only, test-only, or isolated
  low-risk fixes; use the lean path.
- Use optional QA/trace checker agents only when risk calls for them, not as
  mandatory overhead.
- Save reusable visual assets in an explicit art/assets folder only when the user
  asks for asset work or approves the selected design direction.

## Lane Routing

### Architecture / Hosted Stack

Use for monorepo shape, DeepAgent/Supercomputer exit, staging/production stack,
repo structure, provider boundaries, and deployment strategy.

Load:
- Heavy Authority Pack from `AGENTS.md`
- relevant package/app/provider config

Add skills/tools as needed:
- Vercel skills for web/provider questions
- Neon skill for Postgres/PostGIS
- web/official docs when provider behavior may have changed

Keep read-only unless the user explicitly asks for edits/provider actions.

### Deployment / Infra

Use for Vercel, Fly, AWS, Neon, S3/R2, env vars, CI, workers, and hosted smokes.

Load:
- `docs/RUNBOOK.md`
- `docs/DEPLOY_ENV_MATRIX_R1.md` when present
- exact deploy/env scripts/configs

Rules:
- Verify visible provider org/project before stateful changes.
- Do not change credentials, envs, domains, production config, migrations, or data without explicit approval.
- Use official docs/web search for current provider behavior.

### Database / Neon / Prisma

Use for Prisma schema, migrations, seeds, PostGIS, pooling, Neon readiness, and DB smoke checks.

Load:
- `apps/api/prisma/schema.prisma`
- relevant migrations/seeds/scripts/tests
- relevant env/deploy docs

Rules:
- Neon is a database platform, not an app framework.
- Do not run destructive migrations, resets, or live seeds without explicit target confirmation.

### Runtime / API / Workers

Use for API, sockets, workers, transcoder, queues, and runtime branch recovery.

Load:
- exact API/worker/socket files and tests
- relevant shared types/contracts

Note:
- `/home/baris/UPRISE_NEXT_runtime` is a preserved older runtime branch. Only revive or port from it when explicitly asked.

### UX / UI / Design

Use for Home, Plot, player, listener profile, Artist Profile layout, mobile screen structure, external design prompts, and visible interaction states.

Load:
- `docs/agent-briefs/UI_CURRENT.md`
- exact route/component files/tests

Current UX locks:
- Home contains Plot.
- Plot is not standalone.
- Plot tabs are `Feed`, `Events`, `Archive`.
- Listener profile opens by pulling the player down.
- Artist Profile is not listener profile.
- Source management is not inside listener profile.

### Onboarding / Home Scene / Preferences

Use for onboarding, Home Scene resolution, city/state/music-community identity,
GPS voting, proxy/major-node assignment, music-community preferences, and profile
Home Scene defaults.

Load:
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- exact onboarding/API/store files/tests when editing

Current anchors:
- Community identity is `city + state + music community`.
- Onboarding collects one primary scene-of-choice music community.
- Music-community preference/default/roller rules live in `docs/specs/users/onboarding-home-scene-resolution.md` under `Music-Community Preference Contract`.
- GPS gates voting/source-registration authority, not ordinary participation.

### Actions / Signals / Fair Play

Use for Collect, Recommend, Blast, Play It Loud, Upvote, voting, action placement,
engagement wheel, feed inserts, and signal API compatibility.

Load:
- `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`
- action matrix/founder locks
- exact action/API/player files/tests

Current locks:
- RADIYO uses Play It Loud and Upvote.
- Blast belongs to personal player/user-space, not RADIYO.
- Artist Profile has no engagement wheel.
- Recommend is gated by genuine holding/collection.

### Artist / Source / Source Dashboard

Use for Artist Profile, Source Dashboard, Release Deck, Print Shop, source
entities, artist/promoter management, and source-admin domain planning.

Load:
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- exact source routes/components/API files/tests

Current locks:
- A listener may manage a source, but the source is a separate entity.
- `/source-dashboard` is the MVP stand-in for future source/admin domain tooling.
- Do not discard current source-dashboard work because it is not yet split to another domain.

### Registrar / Governance / Activation

Use for source registration, GPS authority, city/source origin, community
activation thresholds, sect affiliation, proposals, backing, formalization, and
authority boundaries.

Load:
- `docs/agent-briefs/REGISTRAR_GOVERNANCE.md`
- `docs/specs/system/registrar.md` when needed
- exact registrar/API/runtime files/tests

Rules:
- Do not invent governance mechanics or thresholds.
- Ask only high-value founder questions that affect multiple systems.

### Events / Archive

Use for Plot Events, Archive, event cards/details, flyers/artifacts, descriptive
stats/history, Scene Map, and community records.

Load:
- `docs/agent-briefs/EVENTS_ARCHIVE.md`
- event/archive specs
- exact event/archive runtime files/tests

Current lock:
- Active tab language is Archive, not Statistics, even if internal code retains statistics names.

### Business / Monetization

Use for pricing, premium analytics, business-source model, promotions, revenue,
launch packaging, and deferred commercial surfaces.

Load:
- `docs/agent-briefs/BUSINESS_MONETIZATION.md`
- relevant economy specs/canon only when needed

Rule:
- Separate long-term doctrine from current MVP runtime. Do not implement deferred monetization unless explicitly activated.

### Art / Assets / External Design Tools

Use for art folders, mockups, design references, image conversion, and handoffs
to Claude Design, Stitch, Uizard, Gemini, NotebookLM, Abacus, or other design agents.

Load:
- `docs/agent-briefs/EXTERNAL_TOOLS.md`
- `docs/agent-briefs/UI_CURRENT.md` only when screen context is needed
- exact art files only when needed

Rules:
- Art references are visual input, not product truth.
- Do not touch untracked `art/` files unless the user explicitly asks.

### Context / Drift Mapping

Use for “where does X show up?”, stale term sweeps, context maps, cross-doc
dependency checks, and documentation strategy.

Prefer:
- `info-lens`
- `context-diff`
- repo `rg` sweeps

Keep results evidence-based with file paths and line references.

### Worktree Hygiene

Use for dirty worktrees, branch reconciliation, stale workspace audits, and
archive/delete decisions.

Before cleanup:
- `git status --short --branch`
- `git worktree list`
- identify dirty/untracked files

Rules:
- Never delete worktrees, branches, stashes, backups, or user art without explicit approval.
- Preserve patches before risky cleanup.

## External Reviewer Routing

Use external reviewers as second-pass auditors, not product authority.

- `uprisereviewer`: narrow review of a named PR/slice/contract after implementation or clarification.
- `upriseauditor`: broad drift audit across docs/code/strategy.
- Cloud Codex/OpenClaw/Abacus: useful for scoped implementation/audit tasks when the repo and branch are accessible.

Give reviewers:
- exact branch/commit
- exact docs to load
- explicit no-edit/no-provider/no-DB boundaries unless implementation is intended
- acceptance criteria and output format

For the current post-clarification reviewer handoff, use:
`docs/handoff/2026-06-25_hermes-reviewer-clarification-handoff.md`.

## Stop Conditions

Stop and ask/report when:

- checkout is wrong repo/branch
- unrelated dirty tracked changes would be confused with your work
- a founder/product decision is required
- migration, branch deletion, reset, data wipe, credential change, or provider mutation is needed
- validation fails repeatedly after scoped fixes
- the task is drifting into repeated micro-questions instead of shared contracts

## Output Discipline

- Audits: lead with findings and evidence.
- Implementation: state changed files, verification run, and remaining risks.
- Design-agent handoffs: provide exact docs/files to load and exact screens/states to produce.
- Clarification sessions: consolidate accepted decisions into the owning spec/brief; avoid scattering repeated micro-rules across many docs.
