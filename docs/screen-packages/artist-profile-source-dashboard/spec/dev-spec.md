# Dev Spec: Artist Profile / Source Dashboard

Status: draft dev gate
Owner package: `docs/screen-packages/artist-profile-source-dashboard/`
Primary owner spec: `docs/specs/users/artist-profile-and-source-dashboard.md`
Last updated: 2026-07-04

## Scope

This Dev Spec gates future implementation for the Artist Profile / Source Dashboard screen package:

- Public/listener-facing Artist Profile at `apps/web/src/app/artist-bands/[id]/page.tsx`.
- Source-admin Source Dashboard shell at `apps/web/src/app/source-dashboard/page.tsx`.
- Source-admin Release Deck route at `apps/web/src/app/source-dashboard/release-deck/page.tsx`.
- Registrar bridge behavior at `apps/web/src/app/registrar/page.tsx` where source context is informational only.
- Runtime/API seams for Artist/Band profile reads, Registrar materialization/member sync, source account context, and Release Deck track creation.
- Implementation boundaries, stale paths, test gaps, and validation commands for a later implementation agent.

## Non-Goals

Do not implement or design these from this package:

- Listener-to-artist DM, `Message Artist`, `Contact Artist`, inboxes, private source messaging, or follower-update composer.
- Artist Profile `Blast`, engagement wheel, source-level `Collect`, source-level `Blast`, or direct UPRISE source-level `Support` action.
- Source posts/messages, analytics, billing, growth, upgrade, premium tools, business runtime, or placeholder cards.
- Real upload/storage/transcoding/waveform pipeline; current Release Deck MVP remains hosted `http(s)` URL ingest.
- A fourth music slot in Release Deck. Paid ad attachment is not a music slot and is not active runtime here.
- Source tools embedded inside listener profile body.
- Public viewer access to source-owner/member tools.
- City-specific, music-community-specific, source-specific, or fixture-only runtime behavior unless explicitly marked test-only.
- Product doctrine, auth rules, API contracts, data models, or navigation invented by Product Design, Creative, art, or implementation agents.

## Public Artist Profile vs Source Dashboard Split

- Artist Profile is public/listener-facing: signed-out and signed-in viewers can read source identity, Home Scene, members, official links, source-owned events, and up to three direct-listen song rows.
- Artist Profile listener actions are limited to source-level `Follow`, share/copy, official outbound links, local row playback, row-level `Collect`, and gated row-level `Recommend` after collection/holding.
- Artist Profile owner/member controls are conditional bridges only. If the signed-in viewer is a source member, links may set source context and open Source Dashboard, Release Deck, Print Shop, or Registrar.
- Source Dashboard is source-admin/source-owner/member tooling. It must stay separate from listener Home/Plot and listener profile collection workspace even while it runs in the same monorepo and same signed-in account.
- Source Dashboard live MVP cards are `Release Deck`, `Source Profile`, `Print Shop`, and `Registrar`. Do not add fake cards.
- Registrar is listener/base-identity civic infrastructure. Source-facing links to Registrar are transitional routing/context aids and do not make Registrar source-owned tooling.

## Authority Packet

### Required docs read in the requested order

1. `AGENTS.md`
2. `docs/PLATFORM_START_HERE.md`
3. `docs/AGENT_STRATEGY_AND_HANDOFF.md`
4. `docs/agent-briefs/CONTEXT_ROUTER.md`
5. `docs/specs/system/documentation-framework.md`
6. `docs/screen-packages/artist-profile-source-dashboard/README.md`
7. `docs/screen-packages/artist-profile-source-dashboard/instruction-packet.md`
8. `docs/screen-packages/artist-profile-source-dashboard/source-map.md`
9. `docs/specs/users/artist-profile-and-source-dashboard.md`
10. `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
11. `docs/solutions/SCREEN_NARRATIVE_ARTIST_PROFILE_SOURCE_DASHBOARD_R1.md`

### Supporting docs inspected from the source map

- `docs/specs/users/identity-roles-capabilities.md`
- `docs/specs/system/registrar.md`
- `docs/specs/media/release-deck-and-eligibility.md`
- `docs/specs/core/signals-and-universal-actions.md`
- `docs/specs/social/message-boards-groups-blast.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/founder-sessions/2026-07-03_source-listener-messaging-boundary.md`
- `docs/handoff/2026-07-04_artist-profile-source-dashboard-owner-spec.md`

### Authority conclusions

- `AGENTS.md` wins on conflicts. Owner specs under `docs/specs/**` hold durable product/API/runtime truth.
- `docs/specs/users/artist-profile-and-source-dashboard.md` owns the cross-surface Registrar -> Source Dashboard -> Artist Profile lifecycle.
- `docs/specs/system/registrar.md` owns source origin, Home Scene/GPS gates, Registrar actor model, materialization, invite/member sync, and source-context bridge limits.
- `docs/specs/users/identity-roles-capabilities.md` owns one base `User` identity plus linked source entities, with source management outside listener profile.
- `docs/specs/media/release-deck-and-eligibility.md` owns Release Deck slot/duration/active-rotation/URL-only limits.
- `docs/specs/core/signals-and-universal-actions.md` owns `Collect`, `Recommend`, `Blast`, source/signal boundaries, and legacy `ADD` persistence caveat.
- `docs/specs/social/message-boards-groups-blast.md` plus `docs/founder-sessions/2026-07-03_source-listener-messaging-boundary.md` forbid listener-to-artist private DM affordances.
- `docs/specs/communities/plot-and-scene-plot.md` owns Archive-top Registrar placement and feed/discovery handoffs into Artist Profile listening.
- Screen package files are execution workspace artifacts. They must not become product authority unless accepted decisions are promoted to owner specs.

## Runtime / API / Data Contract Trace

### Artist Profile public/listener-facing surface

- `apps/web/src/app/artist-bands/[id]/page.tsx`
  - Calls `getArtistBandProfile(artistBandId, token ?? undefined)`, so public reads can include optional signed-in viewer state.
  - Reads `trackId` and `signalId` query params for selected row handoff.
  - Caps visible `demoTracks` to `profile.tracks.slice(0, 3)` and moves a selected out-of-first-three track to the front while preserving the three-row cap.
  - Computes owner/member source-tool visibility from `profile.members.some((member) => member.userId === user.id)`.
  - Sets active source context before opening `/source-dashboard`, `/source-dashboard/release-deck`, `/print-shop`, or `/registrar`.
  - Exposes `Share Artist Page`, source-level `Follow`, local row `Play/Pause`, row timeline, row-level `Collect`, and row-level `Recommend` gated by collected state.
  - Renders official outbound links: official site, buy music, merch, donate. Donation is allowed as outbound source-provided link, not UPRISE source-level `Support`.
  - Does not currently import engagement wheel helpers or show `Blast`/DM controls.

- `apps/api/src/artist-bands/artist-bands.controller.ts`
  - `GET /artist-bands/:id/profile` uses optional auth via `OptionalJwtAuthGuard`.
  - `GET /artist-bands/:id` and `GET /artist-bands` remain authenticated canonical source reads.

- `apps/api/src/artist-bands/artist-bands.service.ts`
  - `findProfile` loads source identity, Home Scene, members, follow count, tracks, events, signal IDs, and viewer collect/recommend state.
  - Explicit `artistBandId = artistBand.id` tracks/events are primary source-owned rows.
  - Compatibility fallback still includes `artistBandId: null` rows by artist name or member uploader. Treat this as legacy carry-forward only; new source data should use explicit `artistBandId`.
  - Signal mapping uses title plus `artistBandId` metadata where available; viewer state reads `CollectionItem` and `SignalAction(type='RECOMMEND')`.

- `apps/web/src/lib/artist-bands/client.ts`
  - Wraps `/artist-bands/:id/profile` and `/follow` for the web route.

### Source Dashboard / active source context

- `apps/web/src/store/source-account.ts`
  - Persists `activeSourceId` and `activeSourceUserId` in `source-account-storage`.
  - Provides `setActiveSourceId` and `clearActiveSourceId`.

- `apps/web/src/components/source/SourceAccountSwitcher.tsx`
  - Only treats a persisted source as active when `activeSourceUserId === currentUserId`.
  - Lets a signed-in user switch between Listener Account and managed source accounts.

- `apps/web/src/app/source-dashboard/page.tsx`
  - Requires sign-in before source dashboard tools.
  - Loads `GET /users/:id/profile` for `managedArtistBands`.
  - Clears active source context when the persisted selecting user differs from the current user or the source is no longer in `managedArtistBands`.
  - Shows no-source state instead of fake tools when no active source is selected.
  - Shows source context with Home Scene, GPS, promoter capability, and cards for Release Deck, Source Profile, Print Shop, and Registrar.
  - Provides `Return to Listener Account` and `Back to Plot` without embedding source tools in Plot/profile.

- `apps/web/src/components/plot/PlotListenerProfile.tsx`
  - Contains `data-slot="profile-source-identity-access"` and may render `SourceAccountSwitcher` for linked source identity access.
  - Must remain a bridge to Source Dashboard only; do not add Release Deck, Print Shop, Registrar, source posting, analytics, or messaging controls inside this listener profile body.

### Release Deck source-admin path

- `apps/web/src/app/source-dashboard/release-deck/page.tsx`
  - Requires sign-in and active source context.
  - Clears stale context when `activeSourceUserId` differs from the signed-in user or the active source no longer belongs to the user.
  - Loads current user profile and then `getArtistBandProfile(activeSource.id, token)` for source profile/deck state.
  - Requires an active source with resolved `sourceProfile.homeScene.id` before submit.
  - Uses `buildReleaseDeckTrackPayload(form, activeSource, communityId)` and `createTrack(payload, token)`.
  - Displays three slots, labels explicit source-owned rows vs legacy carry-forward, and states paid ad slot is defined but not active here.

- `apps/web/src/lib/source/release-deck-validation.ts`
  - Builds `CreateTrackInput` with `artistBandId: activeSource.id`, `artist: activeSource.name`, `communityId`, and `status: 'ready'`.
  - Requires nonblank title, positive duration, duration <= 360 seconds, hosted `http(s)` audio URL, and optional hosted `http(s)` cover URL.

- `apps/api/src/tracks/tracks.controller.ts`
  - `POST /tracks` is authenticated and delegates to `TracksService.createTrack`.

- `apps/api/src/tracks/tracks.service.ts`
  - When `artistBandId` is supplied, verifies the signed-in user created or belongs to that managed source.
  - Rejects mismatched `communityId` when the managed source has a Home Scene.
  - For source-owned ready tracks, enforces max 3 ready tracks per `artistBandId + communityId`, max 360 seconds per track, and max 900 ready seconds per source/community.
  - Creates rows with managed source name, `artistBandId`, `communityId`, URL fields, status, and `uploadedById`.

### Registrar source lifecycle path

- `apps/web/src/app/registrar/page.tsx`
  - Loads `managedArtistBands` from `GET /users/:id/profile` for source context display.
  - Clears stale active source context using the same user/source ownership guard as Source Dashboard.
  - Resolves Home Scene by `city + state + musicCommunity` before Registrar submission.
  - Blocks Artist/Band submission without sign-in, GPS verification, and resolved Home Scene.
  - Submits explicit `Band / Artist Registration` payload with member roster.
  - Exposes explicit follow-up actions: `Materialize Entity`, `Queue Member Invites`, `Sync Eligible Members`, and `Load Invite Status`.
  - Shows active source context as informational: filings still stay Home Scene-bound and listener-owned.

- `apps/api/src/registrar/registrar.controller.ts`
  - Exposes authenticated endpoints for Artist/Band submit, list entries, materialize, dispatch invites, sync members, and invite status.

- `apps/api/src/registrar/registrar.service.ts`
  - `submitArtistBandRegistration` requires city-tier scene, signed-in user, GPS verification, established Home Scene, and matching natural/proxy scene rule.
  - Persists `RegistrarEntry.sourceOriginCity`, `sourceOriginState`, and `sourceOriginMusicCommunity` from the registering user's Home Scene metadata.
  - Creates `RegistrarArtistMember` rows with `existing_user` or `pending_email` invite state.
  - `materializeArtistBandRegistration` is submitter-only, rechecks GPS for unmaterialized entries, creates `ArtistBand`, creates owner `ArtistBandMember`, and links `RegistrarEntry.artistBandId`.
  - Invite dispatch and member sync are submitter-only. Sync only links existing/claimed members after materialization.

## Current Tests

### Web locks

- `apps/web/__tests__/community-artist-page-lock.test.ts`
  - File-content lock for Artist Profile shell, optional-auth profile read, `signalId`/`trackId` selected row behavior, source owner/member tool links, Share/Follow, no wheel/Blast, three-row cap, Collect/Recommend, official links, members, events, and no ranking/editorial badges.
- `apps/web/__tests__/source-dashboard-shell-lock.test.ts`
  - File-content lock for source dashboard cards, source context, Home Scene/GPS/promoter capability copy, Return to Listener Account, Release Deck caps, and paid-ad-slot-not-active wording.
- `apps/web/__tests__/source-account-switcher-lock.test.ts`
  - File-content lock for user-scoped source account switching and listener profile bridge-only behavior.
- `apps/web/__tests__/release-deck-shell-lock.test.ts`
  - File-content lock for Release Deck inside source dashboard, source profile/Registrar links, source-owned payload building, URL-only MVP wording, and legacy carry-forward labels.
- `apps/web/__tests__/release-deck-validation.test.ts`
  - Behavior-level validation for source-owned ready payload, title/duration guard, 360-second cap, and hosted URL requirements.
- `apps/web/__tests__/registrar-source-context-lock.test.ts`
  - File-content lock for Registrar source-context bridge without changing civic scope.

### API tests

- `apps/api/test/artist-bands.controller.test.ts`
  - Covers optional-auth public profile read and signed-out profile read.
- `apps/api/test/artist-bands.service.test.ts`
  - Covers profile with songs/events, explicit source ownership, viewer collect/recommend state, and legacy fallback query shape.
- `apps/api/test/registrar.controller.test.ts`
  - Covers controller delegation/errors for Artist/Band list, submit, materialize, invite status, invite dispatch, and member sync.
- `apps/api/test/registrar.service.test.ts`
  - Covers Artist/Band registration GPS/Home Scene guards, proxy source-origin preservation, materialization into `ArtistBand` and owner membership, invite/status flows, listing summaries, and member sync guards.
- `apps/api/test/tracks.service.test.ts`
  - Covers Release Deck source-owned track creation at boundary, fourth-slot rejection, over-360-second rejection, over-900-second active-duration rejection, processing-track exclusion, and Home Scene mismatch rejection.
- `apps/api/test/signals.service.test.ts`
  - Covers `RECOMMEND` upsert and rejection when the listener has not collected the signal.

## Missing Tests / Coverage Gaps

Current web locks are useful drift guards, but most are source-content tests, not rendered behavior coverage. Future implementation should add focused behavior/integration tests for:

- Signed-out Artist Profile can read public profile but cannot Follow, Collect, Recommend, or see owner/member tools.
- Signed-in non-member can Follow and row-level Collect/Recommend when eligible, but cannot see source tools.
- Source owner/member sees source-tool links and those links set `activeSourceId` plus `activeSourceUserId` before routing.
- Plain Artist Profile URL does not autoplay; song-driven `trackId`/`signalId` handoff selects/plays only the local row as specified, without claiming shared `RADIYO` mutation.
- Three-row cap is preserved in rendered behavior, including selected track outside the first three.
- No Artist Profile DM/message/contact, engagement wheel, source-level Collect, source-level Blast, UPRISE source-level Support, ranking, or editorial badge appears.
- Source Dashboard clears stale source context across user changes and when the source is absent from `managedArtistBands`.
- Release Deck blocks no-source, stale-source, no-Home-Scene, over-duration, non-http URL, fourth-slot, and over-active-duration cases with user-facing errors.
- Registrar source context remains informational while form submission stays Home Scene/GPS bound.
- Listener profile source identity access remains bridge-only and does not embed source tools.

Package test-path cleanup:

- The package packet and source map now use `apps/api/test/registrar.service.test.ts` and `apps/api/test/registrar.controller.test.ts`; do not reintroduce the missing historical `apps/api/test/registrar.artist.service.test.ts` path unless a future slice intentionally creates that file.

## Stale Or Duplicate Paths To Avoid

- `ArtistBandsService.findProfile` compatibility fallback reads `artistBandId: null` tracks/events by artist name or member uploader. Do not build new behavior on this path; explicit `artistBandId` ownership wins for new source data.
- `SignalAction` still persists legacy `ADD` behind current public `Collect` grammar. Do not reintroduce user-facing `Add` for songs.
- Direct `/print-shop` and `/registrar` routes remain available during the Source Dashboard bridge. Direct route availability does not make those listener-owned public tools or source-native Registrar tools.
- `SourceAccountSwitcher` may appear in listener profile only as source identity access. Do not add source-admin tool panels to `apps/web/src/components/plot/PlotListenerProfile.tsx`.
- Registrar member invite token flows validate invited members. Current source submitter materialization validates through signed-in JWT + GPS, not a separate emailed owner validation link. If owner-link validation is required, stop for owner-spec/runtime parity work.
- Deferred source posts/messages, follower timelines, analytics, billing, growth, upgrade, and business runtime remain out of scope.
- Do not treat future separate source/admin domain direction as permission to discard current `/source-dashboard` runtime.

## Implementation Boundaries And File Ownership

Future implementation agents must state their exact file ownership before editing. Default split:

- Dev/runtime owner may edit only scoped web/API/test files needed for approved behavior in Artist Profile, Source Dashboard, Release Deck, Registrar bridge, source account context, ArtistBands API/service, Registrar API/service, Tracks API/service, and focused tests.
- Design implementation owner may edit only approved visual/layout/state presentation from the accepted Design Spec and must not alter data contracts, auth rules, API behavior, action grammar, or product doctrine.
- Product Design / Creative / Art may propose hierarchy, state visuals, accessibility expectations, responsive behavior, and art direction only. They must not invent actions, data contracts, auth rules, navigation, source ownership rules, Registrar rules, Release Deck limits, or product doctrine.
- Owner-spec changes are not part of normal implementation. If implementation requires new product behavior, stop and route to the owner spec first.
- Web-tier boundary remains active: `apps/web` must not import DB clients, server-only modules, or secrets.
- Package manager is `pnpm` only.

## Known Risks

- Boundary blending: owner/member controls on public Artist Profile can visually blur public listener actions with source-admin tools unless hierarchy is explicit.
- Stale source context: persisted `activeSourceId` must always be validated against current user and managed sources before operating tools.
- Fallback data path: legacy `artistBandId: null` rows can make old data visible; new implementation must not treat fallback as the source-owned write path.
- Autoplay/listening semantics: song handoff may select/play a local row, but shared `RADIYO` mutation is not specified or tested.
- Registrar owner-link ambiguity: founder wording references validation links, while current submitter materialization uses signed-in JWT + GPS. Treat this as a product decision/owner-spec gap if work depends on it.
- Test confidence: file-content locks can pass while rendered behavior regresses. Behavior-level tests are needed before implementation closeout.
- Print Shop is connected but not fully traced here beyond source-facing bridge expectations. If implementation touches Print Shop runtime, expand evidence to `apps/web/src/app/print-shop/page.tsx`, `apps/api/src/events/print-shop.controller.ts`, and `docs/specs/economy/print-shop-and-promotions.md`.

## Stop Conditions

Stop before implementation if any of these occur:

- Proposed behavior is not authorized by `docs/specs/users/artist-profile-and-source-dashboard.md` or the relevant owner spec.
- Source/listener/admin boundary is ambiguous.
- A design, art, or Creative output introduces new actions, API fields, auth rules, data model fields, navigation, product doctrine, or platform-trope patterns.
- A future slice requires provider, DB, schema, migration, security, canon, or product-decision work.
- Owner-link validation for source submitters is required but not settled in the owner spec.
- Implementation would add source tools to the listener profile body.
- Implementation would expose public viewer source-admin tools.
- Tests require or reintroduce the stale `apps/api/test/registrar.artist.service.test.ts` path without first creating that file intentionally.

## Validation Seed For Future Implementation

Use the narrowest relevant subset first, then broaden before PR closeout when feasible.

Recommended focused package checks:

```bash
pnpm --filter web test -- community-artist-page-lock.test.ts source-dashboard-shell-lock.test.ts source-account-switcher-lock.test.ts release-deck-shell-lock.test.ts release-deck-validation.test.ts registrar-source-context-lock.test.ts
pnpm --filter api test -- registrar.service.test.ts registrar.controller.test.ts artist-bands.controller.test.ts artist-bands.service.test.ts tracks.service.test.ts signals.service.test.ts --runInBand
pnpm --filter web typecheck
pnpm run docs:lint
git diff --check
```

Add behavior-level rendered/integration tests for any changed public/source/owner state before relying on these locks for closeout.
