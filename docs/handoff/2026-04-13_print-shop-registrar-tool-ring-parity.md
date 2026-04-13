# 2026-04-13 — Print Shop And Registrar Tool-Ring Parity

## Goal
Bring `Print Shop` and `Registrar` up to the same source-shell continuity standard as `Source Dashboard` and `Release Deck`.

## What Changed
- `apps/web/src/app/print-shop/page.tsx`
  - added `Return to Listener Account` when active source context exists
  - added `Open Release Deck` to the route-level source tool ring when active source context exists
  - surfaced readiness chips inside the `Source Context` panel:
    - Home Scene
    - promoter capability
- `apps/web/src/app/registrar/page.tsx`
  - replaced the source-side route buttons with a proper tool ring for active source mode:
    - `Return to Listener Account`
    - `Source Dashboard`
    - `Open Release Deck`
    - `Open Print Shop`
  - surfaced readiness chips inside the `Source Context` panel:
    - Home Scene
    - GPS
    - promoter capability
- tests:
  - `apps/web/__tests__/route-ux-consistency-lock.test.ts`
  - `apps/web/__tests__/registrar-source-context-lock.test.ts`
- docs:
  - `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md`

## Why
- These routes already knew about active source context, but their operating shell was thinner than the rest of the source-side system.
- They also allowed source-side work to flow back to `/plot` without explicitly exiting source mode.
- This slice aligns them with the same rules already applied to Source Dashboard and Release Deck:
  - source tool ring stays visible
  - listener return is explicit
  - route-level source context remains legible

## Verification
- `pnpm --filter web test -- route-ux-consistency-lock registrar-source-context-lock`
- `pnpm --filter web typecheck`
- Chrome DevTools MCP:
  - opened `/print-shop`
  - verified `Return to Listener Account`, `Source Dashboard`, `Open Release Deck`, and `Back to Registrar`
  - verified source-context chips render
  - clicked `Return to Listener Account` and confirmed navigation to `/plot`
  - opened `/registrar` with active source context
  - verified `Return to Listener Account`, `Source Dashboard`, `Open Release Deck`, and `Open Print Shop`
  - verified source-context chips render
  - clicked `Return to Listener Account` and confirmed navigation to `/plot`
  - verified no console warnings/errors

## Outcome
- `Print Shop` and `Registrar` now behave more like true source-shell surfaces and less like isolated forms.
- Listener-mode exit and creator-tool handoff are now consistent across the active source-side routes.
