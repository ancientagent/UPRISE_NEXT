# MVP UX Alignment Report (R1)

Status: Active planning artifact (pre-implementation UX alignment)
Last Updated: 2026-04-14
Owner: Product execution (founder + orchestration)

## 1) Purpose
This report aligns UX decisions to current canon/spec behavior before building additional UX/UI layers.

Primary rule: no inferred product behavior outside documented canon/spec sources.

## 2) Canon/Spec Sources Used
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/system/registrar.md`
- `docs/specs/core/signals-and-universal-actions.md`
- `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
- `docs/solutions/MVP_FLOW_MAP_R1.md`
- `docs/solutions/MVP_FOUNDER_DECISION_REGISTER_R1.md`
- `docs/solutions/MVP_HARD_ROADMAP_EXECUTION_PLAN.md`

## 3) Confirmed UX Truths (Do Not Redefine)
### 3.1 Onboarding
- Required fields: `city`, `state`, `musicCommunity`; optional `tasteTag`.
- GPS is voting-only gate; participation remains available without GPS verification.
- Home Scene tuple anchors downstream Plot and registrar context.

### 3.2 The Plot
- Plot is civic dashboard, not personalized recommendation feed.
- Core tabs/surfaces: Activity Feed (default), Events, Promotions, Statistics/Scene Map.
- Feed behavior is deterministic scene-scoped action projection.

### 3.3 Registrar
- Registrar is scene-scoped civic registration surface with explicit user actions.
- Existing implemented paths include artist/promoter/project/sect submit/status and invite lifecycle reads/actions.
- Deferred boundaries remain explicit (admin orchestration, full provider/scheduler production integration, project/sect lifecycle expansion).

### 3.4 Signals / Universal Actions
- Intended action grammar is explicit and idempotent:
  - sources: `Follow`
  - music-distribution signals: `Collect`, `Blast`, `Recommend` once genuinely held
  - events: `Add` to calendar
  - social posts/comments/replies: `React`
- Runtime still carries older `ADD`/`SUPPORT` naming debt in the generic signal API; UX work should follow `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md` when wording or layout choices depend on the intended model.
- No ranking or recommendation behavior may be implied by UX wording or interaction order.

## 4) Current Web Surface Snapshot
- Onboarding: `apps/web/src/app/onboarding/page.tsx`
- Plot shell: `apps/web/src/app/plot/page.tsx`
- Registrar shell: `apps/web/src/app/registrar/page.tsx`
- Scene panels/components: `apps/web/src/components/plot/*`
- Registrar web contracts/client inventory: `apps/web/src/lib/registrar/*`

## 5) UX Alignment Risks (Current)
- Overloading Plot first-screen priority without founder-approved ordering could imply non-canon ranking/recommendation behavior.
- Registrar deferred capabilities can be misrepresented if copy implies active admin lifecycle controls.
- Ambiguous CTA wording can accidentally signal unsupported flows.
- Cross-surface context mismatch (onboarding tuple vs selected plot scene vs registrar scene context) can cause user confusion if not explicitly shown.

## 6) Founder Alignment Items Before UX Build
These are discussion checkpoints, not implementation assumptions:
- Preferred first-load Plot emphasis: Activity feed first vs registration status prominence.
- Registrar-first vs Plot-first navigation preference for newly onboarded users.
- Visibility policy for deferred social/V2 surfaces in nav and copy.
- Copy tone for GPS voting gate (strict civic wording vs softer education text).

Reference unresolved policy items:
- `docs/solutions/MVP_FOUNDER_DECISION_REGISTER_R1.md`

## 7) UX Process (Recommended)
Use vertical slices, not full sequential page redesign:
1. Choose one user task slice.
2. Define user intent, system response, success/failure/empty/loading states.
3. Validate against specs/canon before implementing UI changes.
4. Build with existing API contracts only.
5. Verify with targeted tests and founder review checkpoint.

## 8) Demo/Sample Plan (Pre-Implementation)
Goal: align understanding before committing UX implementation effort.

### Demo Pack A — Flow Narrative (no code changes)
- Artifact: one-page flow storyboard per surface:
  - Onboarding
  - Plot
  - Registrar
  - Core action read/interaction states
- Include: intent, entry conditions, state transitions, user-visible outcomes.

### Demo Pack B — Interaction Samples (lightweight)
- Artifact: low-fidelity static comps + click-path map.
- Scope: route-level shell transitions and critical state messaging only.
- Constraint: no new semantics, no new action claims.

### Demo Pack C — Integrated UX Trial
- Artifact: branch-level UX sample run-through with existing contracts.
- Verify:
  - no web-tier violations,
  - no spec drift,
  - no unsupported CTA language,
  - all core loading/error/empty states covered.

## 9) UX Acceptance Criteria (Before Broad Build)
- Founder confirms flow order and language for onboarding -> plot -> registrar.
- Deferred features are visibly marked without promising unsupported actions.
- Every user-visible action maps to implemented API path and spec authorization.
- All affected slices pass:
  - `pnpm run docs:lint`
  - `pnpm run infra-policy-check`
  - relevant test targets
  - `pnpm --filter api typecheck`
  - `pnpm --filter web typecheck`

## 10) Immediate Next Step
Run a founder walkthrough on this report, lock UX ordering/copy decisions, then seed a dedicated UX slice batch (lane B primary, lanes A/C/D/E supporting parity/QA/docs).
