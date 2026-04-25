# Artist Profile And Source Dashboard Agent Brief

Status: active
Last Updated: 2026-04-25

## Use When
Use this brief when the task is about:
- public Artist Profile
- artist/source pages
- source dashboard
- Release Deck
- Print Shop as a source-facing tool
- artist/source account switching
- source-owned tracks or events
- source dashboard design handoff

## Do Not Use For
- listener user profile / collection workspace
- generic Home / Plot layout unless source surfaces are visible
- action grammar without source/profile implications
- deployment/infrastructure work

## Loading Rule
Start with the normal repo entry rules, then this brief.

Do not read every linked document by default. For public artist-page work, load the artist profile lock and the artist route. For source-dashboard work, load the source dashboard contract and the touched route/tool.

## Section Pointers
Runtime files:
- `apps/web/src/app/artist-bands/[id]/page.tsx`
- `apps/web/src/app/source-dashboard/page.tsx`
- `apps/web/src/app/source-dashboard/release-deck/page.tsx`
- `apps/web/src/app/print-shop/page.tsx`
- `apps/web/src/components/source/SourceAccountSwitcher.tsx`
- `apps/api/src/artist-bands/`
- `apps/api/src/events/print-shop.controller.ts`
- `apps/api/src/registrar/`

Specs / locks:
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md`
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/specs/economy/print-shop-and-promotions.md`

Tests / verification files:
- `apps/web/__tests__/plot-ux-regression-lock.test.ts` when source/profile actions affect Plot handoff or inserts
- package-specific API/web tests for touched routes

## Current Truth
- Artist Profile is a public source page and direct-listen surface outside `RADIYO`.
- Artist Profile is not the listener user profile / collection workspace.
- Artist Profile has source-level actions such as `Follow`, share, and official outbound links.
- Artist Profile song rows can support `Collect` and gated `Recommend`.
- Artist Profile does not use the engagement wheel.
- Artist Profile does not expose `Blast`.
- Source Dashboard is the signed-in source-side operating shell.
- Source Dashboard is not a second login tree.
- One signed-in user account can switch into managed source accounts.
- Current managed-source runtime is artist/band entities.
- Current Source Dashboard live tool cards are `Release Deck`, `Source Profile`, `Print Shop`, and `Registrar`.
- Release Deck has `3` music slots plus a `4th` paid `10` second ad-attachment slot.
- The ad slot is not an extra song slot and not its own rotation entry.
- Print Shop is source-facing infrastructure for creator/event issuance flows.
- Registrar remains separate civic/formalization infrastructure but must stay reachable from source-side operating context.

## Current Runtime Pointers
- `/artist-bands/[id]` is the public artist/source profile route.
- `/source-dashboard` is the current source-side operating shell.
- `/source-dashboard/release-deck` is the current Release Deck route.
- `/print-shop` is still a direct route but should be understood as part of source-dashboard tooling.
- `/registrar` is still a direct route but should preserve source-side continuity where relevant.

## Design / Implementation Boundaries
- Do not put Artist Profile actions on the listener user profile.
- Do not put listener collection workspace behavior on Artist Profile.
- Do not add source-level `Collect`, source-level `Blast`, or source-level `Support`.
- Do not add fake source-dashboard cards such as analytics, billing, growth, or upgrade modules unless explicitly activated.
- Do not model Print Shop as a listener-facing event-authoring utility.
- Do not treat business runtime, causes, source analytics packages, billing, or promotion package management as active MVP source-dashboard scope unless explicitly reactivated.
- Do not let source-dashboard work bypass Home Scene, registrar, or ownership validation rules.

## Verification
Use the narrowest relevant checks:
- route/component tests for the touched web surface, when present
- API tests for artist/source/event/registrar ownership changes, when present
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- `git diff --check`

Use broader `pnpm run verify` before PR/closeout when feasible.

## Update Rule
Patch this brief whenever Artist Profile, Source Dashboard, Release Deck, or Print Shop source-facing truth changes.
