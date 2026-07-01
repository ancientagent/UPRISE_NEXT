# Plot Top Shell Visual Composition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tighten the `/plot` top shell so listener identity, Home Scene selector, and RADIYO player read as one intentional Home Scene cockpit without changing behavior.

**Architecture:** Keep existing `/plot` state, API calls, selector behavior, profile pull-down, and player contract. Make presentation-only changes to the top shell markup/classes and lock the composition with static regression tests. Update normal UPRISE slice docs.

**Tech Stack:** Next.js App Router, React/TSX, Vitest/Jest-style static source locks, pnpm.

---

### Task 1: Lock The Top-Shell Contract

**Files:**
- Test: `apps/web/__tests__/plot-ux-regression-lock.test.ts`

- [ ] **Step 1: Add static assertions**

Add assertions that `/plot` contains `data-slot="plot-top-shell"`, `data-slot="home-identity-layer"`, `data-slot="home-scene-selector"`, and `data-slot="compact-player-shell"`, and that the top shell does not contain Discover transport copy.

- [ ] **Step 2: Run focused test**

Run: `pnpm --filter web test -- plot-ux-regression-lock.test.ts --runInBand`
Expected: fail until markup is added.

### Task 2: Implement Presentation-Only Top Shell

**Files:**
- Modify: `apps/web/src/app/plot/page.tsx`
- Modify if needed: `apps/web/src/components/plot/HomeSceneSelector.tsx`

- [ ] **Step 1: Wrap identity, selector, and player**

Add a `data-slot="plot-top-shell"` wrapper around the non-expanded identity layer, Home Scene selector, and player panel.

- [ ] **Step 2: Tighten visual classes only**

Use existing color language and border/shadow vocabulary. Do not add new actions, routes, tabs, transport controls, side panels, or source tools.

- [ ] **Step 3: Preserve expanded profile behavior**

Keep `placement={isProfileExpanded ? 'profile-bottom' : 'top'}` and keep profile expansion replacing Plot tabs/body.

### Task 3: Update UPRISE Slice Docs

**Files:**
- Modify: `docs/CHANGELOG.md`
- Modify: `docs/operations/ACTIVE_PM.md`
- Create: `docs/handoff/2026-07-01_plot-top-shell-visual-composition.md`

- [ ] **Step 1: Add concise changelog entry**

Add one Unreleased entry for the Plot top-shell visual-composition cleanup.

- [ ] **Step 2: Add dated handoff**

Record branch, scope, files changed, behavior preserved, validation, and follow-up notes.

- [ ] **Step 3: Refresh ACTIVE_PM**

Update current HEAD/branch/PR queue state and recently completed slice notes.

### Task 4: Validate, Commit, Push, PR

- [ ] **Step 1: Run focused validation**

Run:
`pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tab-contracts.test.ts --runInBand`
`pnpm --filter web typecheck`
`pnpm run docs:lint`
`git diff --check`

- [ ] **Step 2: Commit**

Commit message: `refactor(web): tighten plot top shell composition`

- [ ] **Step 3: Push and open PR**

Push branch and open PR with required UPRISE metadata.
