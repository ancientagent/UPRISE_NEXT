# UPRISE Development Plan R1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move UPRISE from the current cleaned Plot/player/Feed/spec baseline into a launch-ready vertical slice without feature drift, branch drift, or hidden PM state.

**Architecture:** This is an execution plan, not product doctrine. Product truth stays in `docs/specs/**`, canon, active lane briefs, runtime code, and tests; this file sequences the work and defines when a PM agent is needed. Work proceeds through one branch-owning executor at a time unless the plan explicitly splits independent lanes.

**Tech Stack:** UPRISE monorepo, pnpm, Next.js web, Nest API, Prisma/PostGIS, docs/spec owner contracts, Active PM, Branch / Workspace Registry, Codex-first review/audit routing.

---

## Status Snapshot

- Snapshot date: 2026-07-03
- Current base: `origin/main` at `5a07d93` (`docs: clarify Feed Travel launch boundary (#197)`)
- Open PR queue at planning start: none
- Current branch for this plan: `docs/uprise-development-plan-r1`
- Provider/database/schema/art state: not touched by this plan
- Preserved UX references: `/home/baris/UPRISE_NEXT_uximpl`, `/home/baris/UPRISE_NEXT_uxmobile`, `feat/ux-batch17`, `feat/ux-batch18-run`

## PM Decision

Use Codex local as the active PM/executor for sequential work.

Do not add a separate always-on PM agent yet. The separate PM role becomes useful when there are two or more active implementation branches, Cloud Codex/Reliant/Abacus work is running in parallel, or branch absorption/cleanup needs a coordinator that is not also editing code.

When a PM agent is used, it is execution-state only. It may prepare execution packets, maintain `docs/operations/ACTIVE_PM.md`, maintain `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`, check closeout contracts, and assign one branch owner. It must not create product doctrine, override owner specs, or edit the same files as the executor.

## Operating Model

- One branch-owning executor owns each write path.
- Codex local is the default executor and PM for sequential slices.
- Codex subagents are allowed for independent read-only lane checks, focused audits, changed-file sanity, or test-output review.
- Cloud Codex is used for isolated branch work only when the execution packet is explicit and the branch can be pushed back for local review.
- Hermes is watchdog/manual fallback only.
- Linear tracks execution state only; owner specs and current runtime/tests remain durable truth.
- Founder clarifications are captured verbatim first, then promoted into owner specs/briefs when accepted.
- Branch/workspace creation or cleanup must update `docs/operations/BRANCH_WORKSPACE_REGISTRY.md` and pass `pnpm run workspace:audit`.

## Stage 0: Control Plane

**Purpose:** Keep the repo and agent workflow clean enough to execute without rediscovering branch state.

**Files:**
- Modify: `docs/operations/ACTIVE_PM.md`
- Modify: `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`
- Modify: `docs/operations/UPRISE_DEVELOPMENT_PLAN_R1.md`
- Modify: `docs/CHANGELOG.md`
- Create: `docs/handoff/2026-07-03_uprise-development-plan-r1.md`

- [ ] **Step 1: Keep Active PM current enough for the next slice**

Run:

```bash
git branch --show-current
git rev-parse --short HEAD
git status --short
gh pr list --state open --limit 20 --json number,title,headRefName,url
```

Expected: current planning branch, clean or only planned docs edits, and no unexpected open PR queue.

- [ ] **Step 2: Register every active branch/workspace**

Run:

```bash
pnpm run workspace:audit
```

Expected: registered current branch, registered preserved UX references, no unregistered local branch/worktree/open PR head.

- [ ] **Step 3: Close the planning branch**

Run:

```bash
pnpm run docs:lint
git diff --check
```

Expected: docs lint passes and no whitespace errors.

## Stage 1: Contract-Test Hardening

**Purpose:** Convert recently clarified product boundaries into tests before runtime expansion.

**Owner lanes:** `UX_UI`, `ACTIONS_SIGNALS`, `EVENTS_ARCHIVE`

**Likely files:**
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `apps/web/__tests__/plot-tab-contracts.test.ts`
- `apps/web/__tests__/community-artist-page-lock.test.ts`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`

- [ ] **Task 1: Feed Blast card source-link contract tests**

Lock that Blast cards are Feed card types and that the blasted signal links to the signal source. If runtime card code already exists, test the runtime component. If the current repo only has static locks for this surface, add a static regression lock against the owner spec and relevant Plot/feed component.

Validation seed:

```bash
pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tab-contracts.test.ts --runInBand
pnpm --filter web typecheck
```

- [ ] **Task 2: Feed Travel launch-boundary tests**

Lock that `Travel` is allowed in the future outside-Uprise Feed card contract but is not launch-scope and must not appear as general Plot transport. The test must distinguish card/listen loading from `Travel` to Discover/back-door context.

Validation seed:

```bash
pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tab-contracts.test.ts --runInBand
pnpm run docs:lint
```

- [ ] **Task 3: Plot no-transport boundary tests**

Lock that Plot top shell, Home Scene selector, profile pull-down, Archive, and Events do not expose map view, Seek mode, saved-Away-scene launchers, or cross-community transport. Plot may switch among registered Home Scene preferences; Discover owns transport.

Validation seed:

```bash
pnpm --filter web test -- plot-ux-regression-lock.test.ts --runInBand
pnpm --filter web typecheck
```

## Stage 2: Launch-Critical Vertical Slice

**Purpose:** Verify the first useful path from onboarding through Home Scene, player, Feed, source registration, and Release Deck.

**Owner lanes:** `ONBOARDING_HOME_SCENE`, `REGISTRAR_GOVERNANCE`, `ARTIST_SOURCE`, `ACTIONS_SIGNALS`

**Likely files:**
- `apps/api/src/onboarding/onboarding.service.ts`
- `apps/api/src/registrar/**`
- `apps/api/src/admin-analytics/admin-analytics.service.ts`
- `apps/web/src/app/plot/**`
- `apps/web/src/app/source-dashboard/**`
- `apps/web/src/app/artist-bands/[id]/page.tsx`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/system/registrar.md`
- `docs/specs/media/release-deck-and-eligibility.md`
- `docs/specs/broadcast/radiyo-and-fair-play.md`

- [ ] **Task 4: Onboarding/Home Scene smoke hardening**

Run or add focused tests for manual-first Home Scene selection, GPS voting authority, GPS denial, proxy assignment, and Home Scene selector read model. Do not touch provider/database state without explicit approval.

Validation seed:

```bash
pnpm --filter api test -- onboarding.home-scene-resolution.test.ts onboarding.music-community-request.test.ts --runInBand
pnpm --filter web test -- onboarding-regression-lock.test.ts onboarding-review-resolution.test.ts --runInBand
```

- [ ] **Task 5: Registrar/source GPS authority hardening**

Verify that Artist/Band source registration requires a GPS-authorized user and that source origin remains separate from listener/proxy assignment. Do not add a listener-side pioneer workflow.

Validation seed:

```bash
pnpm --filter api test -- registrar.dto.test.ts registrar.controller.test.ts registrar.service.test.ts --runInBand
pnpm --filter api typecheck
```

- [ ] **Task 6: Release Deck media eligibility hardening**

Verify `3` active music slots per managed Artist/Band source per city-tier community, `6` minute cap per song, and `15` minute active-rotation cap per source. The paid ad attachment is not a fourth music slot. Real upload/transcode remains deferred unless explicitly activated.

Validation seed:

```bash
pnpm --filter api test -- tracks.service.test.ts artist-bands.service.test.ts --runInBand
pnpm --filter web test -- source-dashboard-shell-lock.test.ts community-artist-page-lock.test.ts --runInBand
```

## Stage 3: Community Activation / Proxy Lifecycle

**Purpose:** Harden source/music-driven activation and proxy-to-natural cutover.

**Owner lanes:** `REGISTRAR_GOVERNANCE`, `uprise-community-activation`, `ACTIONS_SIGNALS`

**Likely files:**
- `apps/api/src/admin-analytics/admin-analytics.service.ts`
- `apps/api/test/admin-analytics.service.test.ts`
- `apps/api/test/users.profile.collection.test.ts`
- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/system/registrar.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/broadcast/radiyo-and-fair-play.md`

- [ ] **Task 7: Revalidate activation readiness inside the cutover transaction**

Fix the low-risk race noted in code review: diagnostics may remain outside the transaction for admin UX, but the transaction must recompute or validate readiness immediately before scene creation/activation and abort if the tuple is no longer ready.

Validation seed:

```bash
pnpm --filter api test -- admin-analytics.service.test.ts --runInBand
pnpm --filter api typecheck
```

- [ ] **Task 8: Normalize activation tuple matching**

Use normalized/canonical tuple matching or derive exact mutation keys from the selected diagnostic candidate so casing/spacing drift cannot make diagnostics find rows while source/listener mutations miss them.

Validation seed:

```bash
pnpm --filter api test -- admin-analytics.service.test.ts users.profile.collection.test.ts --runInBand
pnpm --filter api typecheck
```

## Stage 4: Plot / Feed Runtime Buildout

**Purpose:** Build visible Plot/feed improvements only after contract tests are in place.

**Owner lanes:** `UX_UI`, `ACTIONS_SIGNALS`, `EVENTS_ARCHIVE`

- [ ] **Task 9: Feed card family inventory**

Inventory current Feed runtime cards against the owner specs. Classify every candidate as launch-scope, beta/deferred, source-facing, or remove/quarantine. Do not implement new card actions during inventory.

Validation seed:

```bash
pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tab-contracts.test.ts --runInBand
pnpm run docs:lint
```

- [ ] **Task 10: Launch-scope Blast card runtime**

If the inventory finds a launch-scope Blast card runtime path, implement or harden source links and listen/load behavior for in-community signals only. Keep `Travel` hidden/deferred unless the current owner spec explicitly activates it.

Validation seed:

```bash
pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tab-contracts.test.ts --runInBand
pnpm --filter web typecheck
```

## Stage 5: Source / Artist / Events MVP Completion

**Purpose:** Keep source-facing creation and listener-facing discovery separated.

**Owner lanes:** `ARTIST_SOURCE`, `REGISTRAR_GOVERNANCE`, `EVENTS_ARCHIVE`

- [ ] **Task 11: Source Dashboard / listener profile separation pass**

Verify source selector and managed-source links live in allowed profile/source seams without placing Release Deck, Print Shop, or Registrar controls in the listener collection body.

Validation seed:

```bash
pnpm --filter web test -- source-dashboard-shell-lock.test.ts source-account-switcher-lock.test.ts plot-ux-regression-lock.test.ts --runInBand
pnpm --filter web typecheck
```

- [ ] **Task 12: Print Shop source-facing event path**

Verify Print Shop remains source-facing, Plot Events remains read-only, and Archive/Registrar placement remains top Registrar then records/status below.

Validation seed:

```bash
pnpm --filter api test -- events.print-shop.service.test.ts --runInBand
pnpm --filter web test -- plot-tab-contracts.test.ts --runInBand
```

## Stage 6: Deferred / Beta Work

Do not implement these as launch-critical work unless a new owner-spec update explicitly activates them:

- Discover map view, Seek mode, front-door/back-door transport, and Travel UI.
- Cross-Uprise Blast cards and outside-Uprise Travel buttons in launch Feed.
- Saved/custom Uprise playback from collection-owned context.
- Sect visibility, official sect channels, backing limits, and Sect Uprise UI.
- Business runtime, billing, coupons/offers, paid boosts, premium analytics.
- Real media upload/storage/transcode/waveform pipeline.
- Dedicated Uprise persistence model or Prime model.

## Immediate Next Queue

1. Close this plan branch and return to clean `main`.
2. Start Stage 1 Task 1: Feed Blast card source-link contract tests.
3. Start Stage 1 Task 2: Feed Travel launch-boundary tests.
4. Start Stage 1 Task 3: Plot no-transport boundary tests.
5. Run Stage 2 Task 4 onboarding/Home Scene smoke hardening after Stage 1 locks are merged.
6. Run Stage 3 Task 7 and Task 8 activation cutover hardening before any provider/staging activation work.

## Reliant Queue Commands

Reliant can hand out this plan as a current execution queue. Use these commands instead of the older default `mvp-slices.json` queue when working from this plan:

```bash
pnpm run reliant:plan:seed
pnpm run reliant:plan:next
pnpm run reliant:plan:validate
```

`reliant:plan:next` reads `.reliant/queue/uprise-development-plan-r1.json` and uses `.reliant/runtime/current-task-uprise-development-plan-r1.json` for claim/resume state. Do not claim a Reliant task unless the branch is registered and one executor owns the write path.

## PM Agent Escalation Triggers

Use a separate PM agent only when one of these is true:

- Two or more implementation branches are active.
- Cloud Codex, Reliant, Abacus, or another external agent is working in parallel.
- A broad branch/worktree/prototype cleanup requires independent classification and closeout.
- A provider/db/schema/security/canon branch needs a coordinator separate from the executor.
- The user explicitly asks for a PM to hand out issue packets while Codex local focuses on code.

The PM agent's required output is an execution packet and closeout contract, not product doctrine.

## Closeout Rules For Every Slice

- Branch is registered before work starts.
- One executor owns writes.
- Founder decisions are captured verbatim before summarizing.
- Owner specs are patched before briefs when durable product truth changes.
- Changelog and dated handoff are updated for multi-step work.
- `pnpm run workspace:audit` passes before PR/closeout.
- Targeted tests pass before claiming runtime behavior.
- Reviewer/auditor pass is required for large refactors, complex branch absorption, provider/db/schema/security/canon risk, or final closeout gates.
