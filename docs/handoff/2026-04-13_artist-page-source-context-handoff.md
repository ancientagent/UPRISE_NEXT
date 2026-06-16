# 2026-04-13 — Artist Page Source Context Handoff

## Goal
Make the managed source page a trustworthy entrypoint into source tools by setting the correct source context before routing into source-side surfaces.

## What Changed
- `apps/web/src/app/artist-bands/[id]/page.tsx`
  - Wired source-side CTAs to call `setActiveSourceId(profile.id)` before routing into:
    - `Source Dashboard`
    - `Release Deck`
    - `Print Shop`
    - `Registrar`
  - Added `Open Release Deck` to the managed-source CTA set.
  - Added a small state note explaining whether source tools are already aligned to the viewed source account.
- `apps/web/__tests__/community-artist-page-lock.test.ts`
  - Locked the new Release Deck entrypoint and source-context messaging.
- `apps/web/__tests__/route-ux-consistency-lock.test.ts`
  - Locked the explicit source-context handoff on artist-page source-tool links.
- `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md`
  - Clarified that managed source pages must set active source context before handing off into source tools.

## Why
- The artist page already exposed source-side tools for linked members, but it still depended on whatever source context happened to be active.
- That was a system leak:
  - the UI suggested the user was acting on the viewed source
  - but the actual source-dashboard shell could still be pointed at some older source selection
- Setting source context at click time fixes the handoff at the correct boundary.

## Verification
- `pnpm --filter web test -- community-artist-page-lock route-ux-consistency-lock`
- `pnpm --filter web typecheck`
- Chrome DevTools MCP:
  - opened `http://127.0.0.1:3000/artist-bands/2d037ba2-9bd9-446f-9321-09bea9fab593`
  - verified source-tool CTA group includes `Open Release Deck`
  - clicked `Open Release Deck`
  - verified navigation lands on `/source-dashboard/release-deck`
  - verified active source context resolves to `Youngblood QA Source`
  - verified no console warnings/errors

## Outcome
- The managed source page is now a real source-context handoff surface instead of a loose collection of links.
- Source-side navigation is less dependent on stale persisted context.
