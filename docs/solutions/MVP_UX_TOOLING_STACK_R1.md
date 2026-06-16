# MVP UX Tooling Stack R1

Status: Historical tooling reference

Historical note:
- This file captures an earlier mobile-first tooling phase.
- It should not be used as the current authority for active MVP product behavior.
- Current assistants should read:
  - `docs/solutions/REPO_AUTHORITY_MAP_R1.md`
  - `docs/solutions/EXTERNAL_ASSISTANT_REPO_BRIEF_R1.md`
  - current founder locks in `docs/solutions/`
  - relevant active specs in `docs/specs/`


Purpose: single source for design/prototype/build tooling used in current MVP UX stage.

## Stage Objective
- Produce mobile-first UX screens with minimal drift.
- Keep outputs aligned to locked MVP behavior.
- Convert approved mockups into implementation-ready UI slices.

## Source-of-Truth Docs (Read First)
1. `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`
2. `docs/solutions/MVP_PROFILE_EXPANDED_MOCKUP_R1.md`
3. `docs/solutions/MVP_PLAYER_PROFILE_INTERACTION_R1.md`
4. `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
5. `docs/solutions/MVP_UIZARD_PROMPT_PACK_R2_STRICT.md`

## Tool Stack (Current)

### 1) Figma (Primary for UX structure/state design)
Use for:
- Deterministic screen architecture and component variants
- Explicit state modeling (player/profile/onboarding)
- MCP-driven design inspection/export

Inputs:
- `docs/solutions/MVP_FIGMA_EXECUTION_PACK_R1.md`
- `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`

Output expectation:
- Frame set organized by execution-pack pages
- Variant/component definitions for locked UX states
- Per-lane acceptance checklist

Do not use for:
- Inventing product behavior missing from canon docs
- Rewriting locked UX decisions

### 2) Uizard (Secondary exploration fallback)
Use for:
- Fast screen generation from strict prompts
- Screen-set iteration with controlled constraints

Inputs:
- `docs/solutions/MVP_UIZARD_PROMPT_PACK_R2_STRICT.md`

Output expectation:
- One screen per prompt (B1..B8)
- Acceptance checklist pass per screen

Do not use for:
- Product decision-making outside locked docs
- Inventing controls/tabs not in prompt pack

### 3) Uizard MCP Bridge (Automation path)
Files:
- `packages/uizard-mcp/src/index.ts`
- `docs/solutions/UIZARD_MCP_SERVER_SETUP.md`

Current tools:
- `uizard_config`
- `uizard_request` (generic authenticated bridge)

Current status:
- Usable for API bridge experimentation
- Not yet typed for project/screen workflows

Next hardening:
1. path/method allowlist in `uizard_request`
2. typed wrappers:
   - `list_projects`
   - `get_project`
   - `create_screen`
3. smoke test command for auth + safe GET

### 4) MCP Browser (Visual verification)
Use for:
- Snapshot/screenshot inspection of live app and generated mockups
- Structural parity checks against locked UX rules

Limitations:
- Session can drop (`Transport closed`); reconnect before review

### 5) Legacy Reference Archive (Blueprint only, non-canon)
Paths:
- `docs/legacy/uprise_mob/`
- `docs/legacy/uprise_mob_code/`

Use for:
- Proportion/interaction reference
- Architectural mapping only

Never do:
- Direct behavior import without current canon/spec lock

### 6) shadcn/ui (Implementation library, not design source)
Use for:
- Building approved UI in code after UX is locked

Do not use for:
- Defining product behavior/flow decisions

## Operating Sequence (Recommended)
1. Lock behavior in source docs.
2. Build Figma pages/components using `MVP_FIGMA_EXECUTION_PACK_R1.md`.
3. Validate each page/screen with checklist + drift guard.
4. Use Uizard only for optional parallel ideation.
5. Approve screen set.
6. Implement in code using shadcn primitives.
7. Verify with MCP snapshot + typecheck.

## Drift Stop Conditions
Stop and escalate to founder if:
- a required control is missing and AI proposes alternatives
- new CTA/action appears not listed in locked docs
- mode/tier behavior deviates from lock
- profile content ownership shifts (e.g., calendar moved out of header)

## Quick Commands

Run Uizard MCP bridge:
```bash
pnpm --filter @uprise/uizard-mcp start
```

Web typecheck:
```bash
pnpm --filter web typecheck
```