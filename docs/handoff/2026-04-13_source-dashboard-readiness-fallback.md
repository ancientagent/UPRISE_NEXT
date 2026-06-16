# 2026-04-13 — Source Dashboard Readiness Fallback

## Goal
Keep the Source Dashboard current-context panel truthful even when the auth user payload does not include Home Scene fields, so source-side readiness state does not regress to `Home Scene unresolved` during normal local runtime.

## What Changed
- `apps/web/src/app/source-dashboard/page.tsx`
  - Added onboarding-store fallback for Home Scene display in the current-context panel.
  - Kept readiness chips for:
    - Home Scene
    - GPS verification
    - promoter capability state
- `apps/web/__tests__/route-ux-consistency-lock.test.ts`
  - Locked the onboarding fallback path and readiness chip strings.
- `apps/web/__tests__/source-dashboard-shell-lock.test.ts`
  - Locked the current-context readiness chips in the dashboard shell.
- `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md`
  - Clarified that readiness state can surface as descriptive dashboard context rather than a separate admin surface.

## Why
- Source Dashboard already had the right source operating context, but the Home Scene chip could fall back to `Home Scene unresolved` when auth payload fields were missing.
- Local runtime still had valid Home Scene state in onboarding storage.
- For the current MVP shell, descriptive readiness state should use the best available current user context instead of implying the system has lost community identity.

## Verification
- `pnpm --filter web test -- source-dashboard-shell-lock route-ux-consistency-lock`
- `pnpm --filter web typecheck`
- Chrome DevTools MCP:
  - reloaded `http://127.0.0.1:3000/source-dashboard`
  - verified current-context panel shows `HOME SCENE: AUSTIN, TX • PUNK`
  - verified `GPS: PENDING`
  - verified `PROMOTER CAPABILITY: INACTIVE`
  - verified no console warnings/errors

## Outcome
- Source Dashboard current-context state is now materially more trustworthy during live source-side QA.
- This remains descriptive shell state only; it does not change creator eligibility rules or persisted event ownership semantics.
