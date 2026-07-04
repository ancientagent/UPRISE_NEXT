# Artist Profile / Source Dashboard Owner Spec Handoff

Date: 2026-07-04
Branch / HEAD: `main` @ `b81c5f3`
Agent: Codex docs/spec researcher

## Scope

Researched whether a current owner dev spec already covered the end-to-end flow:
listener registers/materializes an Artist/Band through Registrar, owner/member
operates it through Source Dashboard, and listeners view the public Artist
Profile.

## Adequate Owner Spec Existed

No.

Current repo truth had strong partial owners:

- `docs/specs/system/registrar.md` owns Registrar actor model, source origin,
  materialization, invite/member sync, GPS/Home Scene gates.
- `docs/specs/users/identity-roles-capabilities.md` owns base user and linked
  Artist/Band source identity separation.
- `docs/specs/media/release-deck-and-eligibility.md` owns Release Deck media
  limits.
- `docs/specs/core/signals-and-universal-actions.md` owns Collect, Recommend,
  Blast, and source/signal boundaries.
- `docs/specs/social/message-boards-groups-blast.md` owns no direct artist DM
  and Blast/social boundaries.
- `docs/specs/communities/plot-and-scene-plot.md` owns Archive-top Registrar
  placement and feed handoffs.
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md` and
  `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md` locked surface
  behavior, but they are not durable owner specs under `docs/specs/**`.

No current `docs/specs/**` file owned the full Registrar -> Source Dashboard ->
Artist Profile handoff and source/listener boundary in one place.

## Files Changed

- `docs/specs/users/artist-profile-and-source-dashboard.md`
- `docs/specs/users/README.md`
- `docs/specs/README.md`
- `docs/specs/system/documentation-framework.md`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-07-04_artist-profile-source-dashboard-owner-spec.md`

## Evidence Summary

Runtime read-only inspection:

- `apps/web/src/app/artist-bands/[id]/page.tsx` keeps Artist Profile public,
  optional-auth, capped to three demo rows, with Follow/share/outbound links and
  row-level Collect/Recommend. It has no Blast, wheel, or listener-to-artist DM
  affordance.
- `apps/web/src/app/source-dashboard/page.tsx` keeps source tools in a separate
  source shell, validates active source context against the signed-in user, and
  links Release Deck, Source Profile, Print Shop, and Registrar.
- `apps/web/src/app/source-dashboard/release-deck/page.tsx` requires an active
  managed source, uses URL-only ingest, and shows 3 music slots, 6-minute single
  cap, 15-minute source cap, and paid-ad-slot-not-active copy.
- `apps/web/src/app/registrar/page.tsx` exposes source context as informational
  bridge only while keeping filings Home Scene-bound and GPS-gated.
- `apps/api/src/registrar/registrar.service.ts` submits GPS-gated Artist/Band
  entries, persists source-origin tuple fields, materializes source identity,
  creates owner membership, queues invite-token delivery for non-platform
  members, and syncs eligible members.
- `apps/api/src/artist-bands/artist-bands.service.ts` reads public Artist
  Profile data from explicit source-owned tracks/events first, with legacy
  fallback paths still present for `artistBandId: null` rows.
- `apps/web/src/store/source-account.ts` persists active source ID and selecting
  user ID; source routes clear stale context when it no longer belongs to the
  current user.

Tests/locks inspected:

- `apps/web/__tests__/community-artist-page-lock.test.ts`
- `apps/web/__tests__/source-dashboard-shell-lock.test.ts`
- `apps/web/__tests__/source-account-switcher-lock.test.ts`
- `apps/web/__tests__/release-deck-shell-lock.test.ts`
- `apps/web/__tests__/registrar-source-context-lock.test.ts`
- `apps/api/test/artist-bands.controller.test.ts`
- `apps/api/test/artist-bands.service.test.ts`
- `apps/api/test/registrar.controller.test.ts`
- `apps/api/test/registrar.service.test.ts`

## QA Trace Summary

- Current source of behavior: new owner spec plus Registrar, identity, Release
  Deck, signals/actions, social/DM, Plot, Artist Profile lock, Source Dashboard
  contract, source/feed lock, and the 2026-07-03 source-listener messaging
  founder session.
- Upstream producers/API/client/store/state: Registrar API/service,
  ArtistBands API/service, artist-bands web client, Release Deck validation,
  source-account store, `/registrar`, `/source-dashboard`, and
  `/source-dashboard/release-deck`.
- Downstream screens/components/actions/tests: public Artist Profile,
  Source Dashboard, Release Deck, Registrar, `SourceAccountSwitcher`, listener
  profile source-access boundary, row-level Collect/Recommend, source Follow,
  and the named web/API lock tests above.
- Docs owner sections: new lifecycle spec for cross-surface flow; existing specs
  retain narrow ownership for Registrar, identity, Release Deck, action grammar,
  social/DM, Archive placement, and Print Shop.
- Stale/parallel paths: legacy `artistBandId: null` profile fallback reads,
  legacy `ADD` persistence behind public `Collect`, direct `/print-shop` and
  `/registrar` routes during Source Dashboard bridge, member invite tokens
  separate from source-owner JWT/GPS materialization, and deferred source
  posts/messages.

## Validation

- `pnpm run docs:lint` passed.
- `git diff --check` passed.

## Recommended Next Implementation Slice

Convert the current file-content lock coverage for Artist Profile and Source
Dashboard into behavior-level tests that prove: public viewers cannot operate
source tools, owner/member source context clears across user changes, Artist
Profile stays capped to three playable rows, and no Blast/wheel/DM affordance
appears on Artist Profile.

## Continuation: Screen Narrative Packet

Added `docs/solutions/SCREEN_NARRATIVE_ARTIST_PROFILE_SOURCE_DASHBOARD_R1.md`
as a concise Product Design handoff packet for the post-registration Artist
Profile / Source Dashboard flow.

This continuation did not change product doctrine. The packet points Product
Design at `docs/specs/users/artist-profile-and-source-dashboard.md` as primary
authority and restates the design task: turn the packet plus owner spec into UX
states and visual direction without redefining contracts.

Additional files changed:

- `docs/solutions/SCREEN_NARRATIVE_ARTIST_PROFILE_SOURCE_DASHBOARD_R1.md`

Validation after this continuation:

- `pnpm run docs:lint` passed.
- `git diff --check` passed.

## Screen Package Workflow Continuation

Continuation after team-manager workflow review:

- Added repo-level major-screen package workflow rules to `docs/specs/system/documentation-framework.md` and `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`.
- Created `docs/screen-packages/README.md`.
- Seeded `docs/screen-packages/artist-profile-source-dashboard/README.md`, `instruction-packet.md`, and `source-map.md` alongside the existing workflow evaluation.
- Patched the owner spec and screen narrative to clarify that official outbound donation links remain allowed while UPRISE source-level `Support` is still forbidden.
- Patched the owner spec and screen narrative to avoid claiming shared `RADIYO` mutation from Artist Profile song handoffs until a future implementation explicitly specifies and tests that bridge.
- Added Release Deck runtime/test pointers for `tracks.controller.ts`, `tracks.service.ts`, `release-deck-validation.ts`, `tracks.service.test.ts`, and `release-deck-validation.test.ts`.

Validation for this continuation is recorded in the final agent response.

## Screen Package Runner Continuation

Added a repo-native screen-package workflow runner:

- `scripts/screen-package-flow.mjs`
- `scripts/screen-package-flow.test.mjs`
- `pnpm run screen-package:flow`
- `pnpm run screen-package:flow:test`

The runner inspects package gates, scaffolds new packages, and can write the next missing artifact template. It is deterministic and file-based, matching the major-screen workflow now documented in `docs/specs/system/documentation-framework.md` and `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`. It does not call models, edit product truth, or replace reviewer/founder gates.
