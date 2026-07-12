# Artist Profile And Source Dashboard Lifecycle

**ID:** `USER-SOURCE-LIFECYCLE`
**Status:** `active`
**Owner:** `uprise-registrar-source`
**Last Updated:** `2026-07-06`

## Overview And Purpose

This spec owns the end-to-end MVP lifecycle where a listener registers and
materializes an Artist/Band source through Registrar, operates the resulting
source from Source Dashboard, and exposes that source to listeners through the
public Artist Profile.

This file exists because current behavior is otherwise spread across Registrar,
identity, media, social/action, Plot, source-dashboard, and founder-lock docs.
Those docs still own their narrow contracts; this spec owns the cross-surface
handoff and source/listener boundary so future implementation slices do not
duplicate or reinterpret the flow.

Path choice: the repo does not currently have `docs/specs/source/`. The closest
existing spec structure is `docs/specs/users/` because the flow starts from one
base `User` identity, creates linked source entities, and governs role/profile
separation. If a dedicated source spec folder is added later, this spec may move
there as a path-only rehome.

## Persistent System Impact

- Player visibility on this surface/flow:
  - Artist Profile shows local direct-listen song-row playback.
  - Source Dashboard, Release Deck, and Registrar are source/civic tooling and
    do not show the listener player as their primary surface.
- Player context/state inherited by this surface/flow:
  - Artist Profile may use shared playback infrastructure under the hood, but it
    must read as direct listening outside `RADIYO`.
  - Source Dashboard and Registrar do not inherit `RADIYO`, `SPACE`, Discover,
    or Away Scene transport state.
- Can this feature affect player state or listening context?
  - Artist Profile song-driven handoffs may select and start a local
    direct-listen profile row. Do not claim shared `RADIYO` mutation unless a
    future implementation explicitly specifies and tests that bridge.
  - Source Dashboard, Release Deck, and Registrar must not directly mutate
    listener playback state.
- Does player state constrain search, navigation, travel, or content scope here?
  - No. Source tools are scoped by authenticated source ownership and Home
    Scene/source-origin contracts, not by current player state.
- If the player is not visible here, why is that valid?
  - Source Dashboard and Registrar are operating/civic infrastructure, not
    listener playback surfaces.

## User Roles And Use Cases

- Listener/base user registers an Artist/Band source through Registrar.
- Registrar submitter explicitly materializes a submitted Artist/Band filing
  into canonical `ArtistBand` source identity after GPS validation.
- Invited members claim registrar invite tokens and may later be synced into
  canonical Artist/Band membership.
- Source owner/member operates a managed Artist/Band through Source Dashboard.
- Public listener views the Artist Profile as a source page/direct-listen
  surface.

## Functional Requirements

- Artist Profile is a public listener-facing source page and direct-listen
  surface.
- Source Dashboard is the source-owner/member operating shell for managed
  source entities.
- Registrar materializes Artist/Band source identity and remains
  listener/base-identity civic infrastructure.
- Source Dashboard may link to Registrar during the MVP bridge, and Registrar
  may show informational source context, but those links do not redefine
  Registrar as source-owned source-management tooling.
- A listener becomes a source through Registrar, not through embedded source
  tools in the listener profile.
- Source tools are owner/member-only operating controls, not public viewer
  controls.
- Artist Profile public viewer actions are source-level `Follow`, share/copy,
  official outbound links including official donation links when supplied by the
  source, and row-level listening actions only where allowed.
- Artist Profile is additive to the source's existing artist infrastructure. It
  may expose official links to Bandcamp, SoundCloud, merch, donation, social,
  website, contact, and similar source-provided destinations without making
  those external services the authority for UPRISE source identity.
- Artist Profile song rows may expose `Collect` and `Recommend`; `Recommend`
  is available only after the listener genuinely holds/collects the song.
- Artist Profile song rows may play source-owned external audio inside the
  UPRISE profile/player only when the Release Deck row provides a direct
  playable `http(s)` audio URL or a later approved playback/embed contract
  exists. Non-playable external pages remain official outbound listen/buy links.
- Artist Profile must not expose listener-to-artist DM/message controls.
- Artist Profile must not expose `Blast`.
- Artist Profile must not use an engagement wheel.
- Artist Profile current direct-listen area is capped to `3` playable rows. If
  a feed/discovery handoff selects a track outside the first three, that
  selected track may be placed first while preserving the `3` row cap.
- Source Dashboard current live cards are `Release Deck`, `Source Profile`,
  `Print Shop`, and `Registrar`; placeholder analytics, billing, growth,
  upgrade, source-post, message, or follower-update cards remain out of scope.
- Source Dashboard source selection should expose the signed-in account/user
  context and the user's current position for the selected source, such as
  manager, member, or promoter. Switching selected source context must update
  that role/position label and must not carry permissions from a different
  source.
- Source-facing Profile/member management may use manager-led email/search
  entry for adding or finding band/source members. If a member resolves to an
  already registered UPRISE user, their avatar can appear in the source-facing
  member strip and may later link to their listener account/profile after
  identity routing and privacy contracts are defined.
- Public Artist Profile member display should prefer source-provided
  artist/member headshots when available. Listener-account avatars are a
  separate identity surface and must not be substituted as the default public
  band/member image unless profile-link privacy and routing contracts explicitly
  allow it.
- Source Calendar/event management must support private/draft planning. Public
  feed/follower-calendar delivery should follow explicit event published state,
  not the mere existence of a calendar item. When the creator publishes a
  band/promoter/source event, followers of that source should automatically
  receive the published event in their calendars and the event can appear on the
  community calendar once the event publication, community-calendar visibility,
  and follower-calendar delivery contracts are active.
- Release Deck limits remain:
  - `3` active music slots per managed Artist/Band source per city-tier
    community.
  - No single song may exceed `6` minutes (`360` seconds).
  - No single source may occupy more than `15` minutes (`900` seconds) of any
    one active rotation.
  - Current MVP ingest is explicit hosted `http(s)` audio URL only and remains
    provider-agnostic when the URL is directly playable and allowed.
  - A paid ad attachment is not a fourth music slot and is not a standalone
    rotation entry.
  - Future paid ad categories/link targets (`release date`, `general`, `event`,
    `sponsor`) remain deferred until media, economy, action/signal, and business
    account contracts activate them.
- Source-origin and source Home Scene routing remain Registrar-owned; Source
  Dashboard must not rewrite source origin because the source is operating from
  a proxy or bridge context.

## Current Behavior Source

- Product docs:
  - `docs/specs/system/registrar.md#source-origin-contract`
  - `docs/specs/users/identity-roles-capabilities.md`
  - `docs/specs/media/release-deck-and-eligibility.md`
  - `docs/specs/core/signals-and-universal-actions.md`
  - `docs/specs/social/message-boards-groups-blast.md`
  - `docs/specs/communities/plot-and-scene-plot.md`
  - `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
  - `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md`
  - `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
  - `docs/founder-sessions/2026-07-03_source-listener-messaging-boundary.md`
  - `docs/founder-sessions/2026-07-06_source-dashboard-members-feed-publishing.md`
- Runtime/code:
  - `apps/web/src/app/artist-bands/[id]/page.tsx`
  - `apps/web/src/app/source-dashboard/page.tsx`
  - `apps/web/src/app/source-dashboard/release-deck/page.tsx`
  - `apps/web/src/app/registrar/page.tsx`
  - `apps/api/src/artist-bands/artist-bands.controller.ts`
  - `apps/api/src/artist-bands/artist-bands.service.ts`
  - `apps/api/src/tracks/tracks.controller.ts`
  - `apps/api/src/tracks/tracks.service.ts`
  - `apps/api/src/registrar/registrar.controller.ts`
  - `apps/api/src/registrar/registrar.service.ts`
  - `apps/web/src/lib/artist-bands/client.ts`
  - `apps/web/src/store/source-account.ts`
  - `apps/web/src/lib/source/release-deck-validation.ts`

## Architectural Boundaries

- Web tier must call API/client wrappers and must not import database clients or
  server-only modules.
- Registrar remains Home Scene-scoped civic infrastructure. Source-facing
  bridges are routing/context aids only.
- Source Dashboard is the current monorepo stand-in for future separate
  source/admin tooling; do not discard current `/source-dashboard` work merely
  because the source/admin domain is not physically separated yet.
- Listener profile may expose source identity/account switching for users who
  manage Artist/Band sources, but it must not embed Release Deck, Print Shop,
  Registrar, source posting, analytics, or DM controls.
- Public Artist Profile must not become the source-owner operating shell.
- Source tools must validate that the active/persisted source belongs to the
  current signed-in user before operating.

## Data Models And Migrations

No migration is added by this owner spec.

2026-07-11 schema addition: `ArtistBand.bio`, `ArtistBand.avatar`, and
`ArtistBand.coverImage` were added as source-owned public identity fields, and
`ArtistBandMember.headshotUrl` was added as the source-provided public member
headshot carrier. Before this, the public profile projected the registering
member's listener-account bio/avatar/cover, which violated the identity
boundary above. Apply via the standard Prisma migration flow; no data
backfill — source identity stays empty until the source supplies it.

Current models involved:

- `User`: base account, Home Scene fields, GPS verification.
- `RegistrarEntry`: Artist/Band submissions, source-origin fields, linked
  `artistBandId`.
- `RegistrarArtistMember`: roster, invite lifecycle, claimed/existing member
  state.
- `RegistrarInviteDelivery`: queued/sent/failed invite delivery state.
- `ArtistBand`: canonical managed source identity, registrar linkage,
  `homeSceneId`, source-origin tuple, and source-owned public identity fields
  (`bio`, `avatar`, `coverImage`) that must not be projected from the
  registering member's listener account.
- `ArtistBandMember`: authorized source owner/member graph plus the
  source-provided public `headshotUrl`; listener-account avatars are not a
  public fallback for member display.
- `Track`: source-owned music rows using `artistBandId` and `communityId`.
- `Signal`, `SignalAction`, `CollectionItem`, `Follow`: public profile action
  and listener collection/read-state dependencies.

## API Design

Current endpoints in the lifecycle:

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/registrar/artist` | required | Submit GPS-gated Artist/Band Registrar filing. |
| `GET` | `/registrar/artist/entries` | required | Read submitter-owned Artist/Band filings and materialized source summary. |
| `POST` | `/registrar/artist/:entryId/materialize` | required | Materialize submitter-owned filing into `ArtistBand` and owner membership. |
| `POST` | `/registrar/artist/:entryId/dispatch-invites` | required | Queue tokenized invite links for non-platform registrar members. |
| `GET` | `/registrar/artist/:entryId/invites` | required | Read invite status and delivery outcome summary. |
| `POST` | `/registrar/artist/:entryId/sync-members` | required | Sync eligible existing/claimed registrar members into `ArtistBandMember`. |
| `GET` | `/artist-bands/:id/profile` | optional | Read public Artist Profile, with viewer collect/recommend state when signed in. |
| `GET` | `/artist-bands/:id` | required | Read canonical Artist/Band entity details. |
| `GET` | `/artist-bands` | required | List managed Artist/Band entities for a user. |
| `POST` | `/follow` | required | Follow the Artist/Band source. |
| `POST` | `/signals/:id/collect` | required | Collect a song signal from the profile listening context. |
| `POST` | `/signals/:id/recommend` | required | Recommend only after the listener holds the signal. |
| `POST` | `/tracks` | required | Create URL-only source-owned Release Deck track with active-slot limits. |

## Web UI And Client Behavior

- `/artist-bands/[id]` is public Artist Profile/direct-listen.
- `/source-dashboard` is the source-owner/member operating shell.
- `/source-dashboard/release-deck` is the Release Deck tool inside the source
  dashboard system.
- `/registrar` is the direct Registrar route and current bridge target from
  source context.
- `apps/web/src/store/source-account.ts` persists `activeSourceId` and
  `activeSourceUserId`; source routes must clear stale source context when the
  persisted source does not belong to the current signed-in user.
- Artist Profile owner/member links may set active source context before opening
  Source Dashboard, Release Deck, Print Shop, or Registrar.
- Source Dashboard and Release Deck must show return paths to listener mode and
  Source Dashboard continuity without embedding source tools in the listener
  profile.

## QA Trace

### Current Source Of Behavior

- Durable owner contracts:
  - Source identity and role separation: this spec plus
    `docs/specs/users/identity-roles-capabilities.md`.
  - Registrar source origin/materialization: `docs/specs/system/registrar.md`.
  - Release Deck media limits: `docs/specs/media/release-deck-and-eligibility.md`.
  - Collect/Recommend/Blast/source-signal boundary:
    `docs/specs/core/signals-and-universal-actions.md`.
  - No listener-to-artist DM and Blast/social boundary:
    `docs/specs/social/message-boards-groups-blast.md`.
  - Registrar Archive placement and feed handoffs:
    `docs/specs/communities/plot-and-scene-plot.md`.
- Founder/current locks:
  - `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
  - `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md`
  - `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
  - `docs/founder-sessions/2026-07-03_source-listener-messaging-boundary.md`

### Upstream Producers, API, Client, Store, State

- Registrar producers:
  - `apps/api/src/registrar/registrar.service.ts` submits GPS-gated
    Artist/Band entries, persists source-origin tuple fields, materializes
    `ArtistBand`, creates owner membership, queues member invites, and syncs
    eligible claimed/existing members.
  - `apps/api/src/registrar/registrar.controller.ts` exposes the registrar
    API surface.
  - `apps/web/src/app/registrar/page.tsx` resolves Home Scene, blocks
    submission without GPS, shows source context as informational bridge, and
    keeps filings Home Scene-bound.
- Artist/source producers:
  - `apps/api/src/artist-bands/artist-bands.service.ts` reads public profile
    data, explicit `artistBandId` tracks/events, legacy fallback tracks/events,
    signal IDs, and viewer collect/recommend state.
  - `apps/api/src/artist-bands/artist-bands.controller.ts` exposes optional-auth
    profile reads and authenticated managed-source reads.
  - `apps/web/src/lib/artist-bands/client.ts` calls `/artist-bands/:id/profile`
    and source follow.
- Source operating state:
  - `apps/web/src/store/source-account.ts` persists active source ID and the user
    ID that selected it.
  - `/source-dashboard` and `/source-dashboard/release-deck` verify the active
    source belongs to the current user before showing tools.
  - `apps/web/src/lib/source/release-deck-validation.ts` builds Release Deck
    track payloads with `artistBandId` and URL/duration validation.

### Downstream Screens, Components, Actions, Tests

- Screens/components:
  - `apps/web/src/app/artist-bands/[id]/page.tsx`
  - `apps/web/src/app/source-dashboard/page.tsx`
  - `apps/web/src/app/source-dashboard/release-deck/page.tsx`
  - `apps/web/src/app/registrar/page.tsx`
  - `apps/web/src/components/source/SourceAccountSwitcher.tsx`
  - `apps/web/src/components/plot/PlotListenerProfile.tsx`
- Public Artist Profile actions:
  - source-level `Follow`;
  - share/copy;
  - official outbound links, including source-provided donation, Bandcamp,
    SoundCloud, merch, website, social, contact, and similar links;
  - row-level `Play/Pause`, timeline, `Collect`, gated `Recommend`.
- Owner/member-only source tool links:
  - Source Dashboard;
  - Release Deck;
  - Print Shop;
  - Registrar bridge.
- Lock tests:
  - `apps/web/__tests__/community-artist-page-lock.test.ts`
  - `apps/web/__tests__/source-dashboard-shell-lock.test.ts`
  - `apps/web/__tests__/source-account-switcher-lock.test.ts`
  - `apps/web/__tests__/release-deck-shell-lock.test.ts`
  - `apps/web/__tests__/registrar-source-context-lock.test.ts`
  - `apps/web/__tests__/release-deck-validation.test.ts`
  - `apps/api/test/artist-bands.controller.test.ts`
  - `apps/api/test/artist-bands.service.test.ts`
  - `apps/api/test/registrar.controller.test.ts`
  - `apps/api/test/registrar.service.test.ts`
  - `apps/api/test/tracks.service.test.ts`
  - `apps/api/test/signals.service.test.ts`

### Docs Spec Sections Owning Behavior

- End-to-end source lifecycle and cross-surface boundary: this spec.
- Base user, source entity, source-management separation:
  `docs/specs/users/identity-roles-capabilities.md`.
- Registrar actor model, source origin, source materialization, invite/member
  sync, Home Scene/GPS gates: `docs/specs/system/registrar.md`.
- Release Deck slots/duration/URL-only/reject-only limits:
  `docs/specs/media/release-deck-and-eligibility.md`.
- Signal/source action grammar:
  `docs/specs/core/signals-and-universal-actions.md`.
- DM/social/Blast boundary:
  `docs/specs/social/message-boards-groups-blast.md`.
- Archive-top Registrar placement and feed-to-Artist Profile handoffs:
  `docs/specs/communities/plot-and-scene-plot.md`.
- Print Shop source-facing event lane:
  `docs/specs/economy/print-shop-and-promotions.md`.

### Stale Or Parallel Paths To Watch

- Legacy profile fallback in `ArtistBandsService.findProfile` still includes
  `artistBandId: null` tracks/events by artist name or member uploader. Keep it
  as compatibility only; explicit `artistBandId` ownership wins for new source
  data.
- `SignalAction` rows still persist legacy `ADD` while public copy uses
  `Collect`; do not reintroduce user-facing `Add` for songs.
- Registrar invite-token claim validates invited members; current source-owner
  materialization validates by signed-in submitter JWT plus GPS, not an emailed
  owner validation link. If owner-link validation is desired, that requires a
  future runtime parity slice.
- `/print-shop` and `/registrar` remain direct routes while conceptually bridged
  from Source Dashboard; do not treat direct route availability as public
  listener tool ownership.
- `SourceAccountSwitcher` may appear in the listener profile only as source
  identity access. It must not embed Release Deck, Print Shop, Registrar,
  analytics, posting, or messaging controls in the listener profile body.
- Future source posts/messages and follower-update composers remain deferred
  until a dedicated implementation spec activates them.
- Source-facing member email/search lookup, public avatar linking, and event
  publication/follower-calendar delivery need dedicated identity/event/feed
  contracts before implementation.

## Verification Caveat

Current web locks are mostly source-content/file-content regression locks and route-level contracts. They help prevent drift, but they are not proof of fully rendered behavior for every public/source/owner state. Runtime implementation slices should add focused rendered or integration coverage when behavior changes.

## Acceptance Tests / Test Plan

- Docs/spec changes:
  - `pnpm run docs:lint`
  - `git diff --check`
- Runtime implementation slices should add or update focused tests named in the
  QA Trace, using package-level validation before broader `pnpm run verify`.

## Implementation Slice Recommendations

1. Owner-spec adoption slice: point future Artist Profile / Source Dashboard /
   Registrar issues at this spec and keep lane briefs as summaries.
2. Source-owner validation parity slice: decide whether source submitters need a
   validation link/token in addition to current signed-in JWT + GPS
   materialization. If yes, update Registrar owner behavior first, then runtime.
3. Artist Profile hardening slice: convert file-content lock coverage into
   behavior-level component tests for `3` row cap, no `Blast`, no wheel, no DM,
   and gated `Recommend`.
4. Source Dashboard membership hardening slice: add behavior-level tests proving
   stale persisted source context is cleared across user changes and public
   viewers cannot operate source tools.
5. Legacy fallback cleanup slice: after migrated source-owned tracks/events are
   sufficient, narrow or retire `artistBandId: null` fallback reads without
   losing historical display.

## Future Work And Open Questions

- Whether source submitters should receive a separate source-owner credential
  validation link before dashboard access remains a product/runtime parity
  question. Current runtime does not require it for the submitter.
- Exact future source/admin domain or URL format remains deferred.
- Source posts/messages and one-way entity follower timelines remain deferred
  until activated by a dedicated owner spec.
- Real upload/storage/transcoding/waveform infrastructure remains deferred.
- Source member lookup privacy/routing and explicit event publication/follower
  calendar delivery remain open product/runtime questions.
