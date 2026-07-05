# Dev Spec: Source Dashboard Release Deck Readiness Slice

Status: executor-ready Dev Spec package artifact
Slice name: `Source Dashboard Release Deck Readiness Slice`
Package: `docs/screen-packages/artist-profile-source-dashboard/`
Primary owner spec: `docs/specs/users/artist-profile-and-source-dashboard.md`
Related owner specs: `docs/specs/media/release-deck-and-eligibility.md`, `docs/specs/system/registrar.md`, `docs/specs/broadcast/radiyo-and-fair-play.md`
Last updated: 2026-07-05

## Authority Statement

This file is an implementation-planning artifact for one small vertical slice. It is not product truth and must defer to active owner specs under `docs/specs/**`, repo instructions in `AGENTS.md`, and current runtime evidence.

Prior design/package review verdict to incorporate: `Pass With Issues`. The issues resolved by this Dev Spec are source operator identity, stale source context, no-source state, cap-reached state, and first-slice file ownership.

This slice should make the Source Dashboard and Release Deck ready for source-owned URL-only music entry and Fair Play/player testing visibility. It must not redefine Release Deck, Registrar, Artist Profile, Fair Play, media storage, source messaging, monetization, or source ownership contracts.

## Evidence Used

- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/README.md`
- `docs/specs/README.md`
- `docs/specs/system/documentation-framework.md`
- `apps/web/WEB_TIER_BOUNDARY.md`
- `docs/screen-packages/artist-profile-source-dashboard/README.md`
- `docs/screen-packages/artist-profile-source-dashboard/design-spec/artist-dashboard-design-inventory.md`
- `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md`
- `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `docs/specs/users/artist-profile-and-source-dashboard.md`
- `docs/specs/media/release-deck-and-eligibility.md`
- `docs/specs/broadcast/radiyo-and-fair-play.md`
- `docs/specs/system/registrar.md`
- `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md`
- `docs/solutions/MEDIA_STORAGE_DECISION_PACKET_R1.md`
- `docs/solutions/SOURCE_POSTS_MESSAGES_DECISION_PACKET_R1.md`
- `docs/solutions/MVP_EXPLICIT_DEFERRED_LIST_R1.md`
- `apps/web/src/app/source-dashboard/page.tsx`
- `apps/web/src/app/source-dashboard/release-deck/page.tsx`
- `apps/web/src/components/source/SourceAccountSwitcher.tsx`
- `apps/web/src/store/source-account.ts`
- `apps/web/src/lib/source/release-deck-validation.ts`
- `apps/web/__tests__/source-dashboard-shell-lock.test.ts`
- `apps/web/__tests__/source-account-switcher-lock.test.ts`
- `apps/web/__tests__/release-deck-shell-lock.test.ts`
- `apps/web/__tests__/release-deck-validation.test.ts`
- `apps/api/test/tracks.service.test.ts`

## Scope

Implement one focused readiness slice across the current source-admin shell:

- make the active source context unmistakable on `/source-dashboard`;
- make Release Deck the primary source-side task for URL-only track entry;
- show the three active music slots, six-minute per-track cap, and fifteen-minute active-source cap before or at submit time;
- avoid duplicating the same source tools in both left and right regions;
- show no-source, no-active-source, stale-source, missing-Home-Scene, validation, cap-reached, and ready-for-testing states without expanding product scope;
- keep `SourceAccountSwitcher` as the one-account, user-scoped source context selector;
- add focused rendered/behavior coverage where current file-content locks are not enough.

## Non-Goals

- No public Artist Profile redesign.
- No listener-facing Source Dashboard.
- No source tools inside listener profile beyond source identity/account access.
- No runtime code in this Dev Spec slice document.
- No new route, data model, API contract, auth rule, migration, worker, provider, or storage behavior.
- No real upload, object storage, transcoding, waveform extraction, signed upload URL, queue, or worker lifecycle.
- No paid ad-slot runtime, paywall, purchase, entitlement, or fourth active
  music slot. The fourth Release Deck spot is reserved for the
  defined-but-inactive paid ad attachment concept.
- No source posts/messages, follower updates, DMs, inbox, chat, analytics, billing, upgrade, coupon, offer, promotion-management, or business dashboard modules.
- No Registrar/GPS/Home Scene authority changes.
- No Fair Play scheduling, rotation, boost, ranking, play-count, or reordering controls.
- No Release Deck release-date scheduling or active-slot removal behavior until
  owner spec/API/runtime contracts define those operations.
- No new Events route or Print Shop relocation unless a scoped Events/Print Shop
  spec updates the current surface contract.
- No Metrics page/runtime in this Release Deck readiness slice. Basic Metrics
  and V2 / possible-beta paid tracked-single Metrics require a separate
  source-metrics and monetization/entitlement contract.

## Current Runtime Trace

### Source Dashboard

`apps/web/src/app/source-dashboard/page.tsx`:

- requires sign-in by loading `/users/:id/profile`; signed-out users get an error state and `Back to Plot`;
- reads `managedArtistBands` and the persisted `activeSourceId`;
- clears active source context when `activeSourceUserId` differs from the signed-in user;
- clears active source context when the persisted source is not found in current `managedArtistBands`;
- shows `SourceAccountSwitcher` for users with managed sources;
- shows a no-active-source context card instead of live tool cards;
- shows active source identity, entity type, slug, membership role, Home Scene label, GPS state, and promoter capability state;
- renders only four live cards: `Release Deck`, `Source Profile`, `Print Shop`, `Registrar`;
- uses current plot-wire visual vocabulary.

Founder-updated visual target:

- do not foreground GPS verification as a dashboard status ornament unless a
  specific existing owner-spec rule blocks the selected source action;
- avoid duplicating the same tools in both a left nav and right card stack;
- prefer one report-paper management structure with Release Deck first, source
  profile context/profile management, Calendar/Events, and Registrar kept
  secondary;
- keep basic release metrics below Release Deck as a compact expandable row, not
  as a primary navigation page in this slice;
- `Events` is the desired source-side home for shows and the Print Shop/flyer
  printing path, but current runtime/spec evidence still names `Print Shop` as a
  live card, so implementation must stop for a scoped Events/Print Shop contract
  before changing routes or navigation ownership.

Current gap: no-source and stale-source behavior exists mostly through route state and file-content locks; the next implementation should add behavior-level tests for visible state and clearing behavior if it changes UI presentation.

### Source Account Store And Switcher

`apps/web/src/store/source-account.ts`:

- persists `activeSourceId` and `activeSourceUserId` under `source-account-storage`;
- exposes `setActiveSourceId(sourceId, userId)` and `clearActiveSourceId()`.

`apps/web/src/components/source/SourceAccountSwitcher.tsx`:

- treats a source as active only when `activeSourceUserId === currentUserId`;
- keeps `Listener Account` visible as the source-mode exit;
- returns `null` when no managed sources exist.
- displays per-source membership role from the managed source summary when
  available.

First-slice ownership decision: do not change store behavior by default. The store already has the user-scoped context primitives this slice needs. Touch `SourceAccountSwitcher` only if presentation or behavior-level testability requires it.

Founder-added access rule: source roles are `manager` and `member`, scoped to
the selected source membership rather than the signed-in user globally. The
registering member is the default `manager` because their location/Home Scene
anchors the band/source to its Home Scene. The concrete beta capability to track
is whether a member can submit music through Release Deck for that selected
source. Source members should still be able to see source activity and add
events/calendar entries for that selected source. Source switching must make the
selected source role/access visible, and Release Deck submission must resolve
authority from that selected source membership.

### Release Deck

`apps/web/src/app/source-dashboard/release-deck/page.tsx`:

- requires sign-in and active source context;
- clears source context when persisted source belongs to another user;
- clears source context when the active source is no longer attached to the signed-in user;
- loads the current user profile, then loads the active source Artist Profile;
- requires `sourceProfile.homeScene.id` before submit;
- renders source identity, three music slots, six-minute cap, fifteen-minute source cap, and fourth paid ad attachment spot as defined but not active;
- displays up to three `sourceProfile.tracks.slice(0, 3)` rows;
- labels rows as `Source-owned release` when `track.artistBandId === activeSource.id`, otherwise `Legacy carry-forward`;
- uses `buildReleaseDeckTrackPayload(form, activeSource, communityId)` and `createTrack(payload, token)` for URL-only MVP writes;
- surfaces client validation and API rejection through `submitError`.

`apps/web/src/lib/source/release-deck-validation.ts`:

- requires nonblank title;
- requires positive duration;
- rejects duration over `360` seconds;
- requires hosted `http(s)` audio URL;
- accepts optional hosted `http(s)` cover art URL;
- builds `artistBandId`, source artist name, `communityId`, and `status: 'ready'`.

Founder-added gap: Release Deck should allow the source operator to select the
date a song releases. Current inspected runtime and media spec evidence does
not expose a release-date field in the `CreateTrackInput` path. Do not implement
release-date behavior from this readiness slice until the owner spec/API/runtime
contract defines the field, timezone rules, past-date validation, immediate
release behavior, and scheduled-to-active transition.

`apps/api/test/tracks.service.test.ts` proves server-side Release Deck eligibility rejects a fourth ready music slot, over-360-second ready tracks, over-900 active seconds, and source Home Scene mismatch.

Current gap: Release Deck visible readiness does not yet summarize "ready for Fair Play/player testing" as a distinct state. Cap-reached states are server-enforced and shown through raw submit error, but the next implementation should make them visually clear without implying replacement/edit tooling.

Founder-updated row presentation target:

- row action copy should be `Load`, not `View`, when opening or loading a
  release/song row context;
- row date copy should be `Release date`, not `Date added`, even while runtime
  release-date scheduling remains blocked by missing media/API contracts;
- row status should carry the policy/eligibility signal. A valid source-owned
  song that passes policy may use a green check/status marker in the row;
- do not put a large green `Ready` chip or green ready callout beside the
  `Release Deck` section title;
- if a single is already out on `RADIYO`, the row may be visually highlighted,
  and different highlight colors may represent its current tier, but tier names,
  color tokens, contrast rules, state precedence, and runtime data ownership
  need owner-spec approval before implementation.

## Proposed Affected Surface

Likely implementation files:

- `apps/web/src/app/source-dashboard/page.tsx`
- `apps/web/src/app/source-dashboard/release-deck/page.tsx`
- `apps/web/src/components/source/SourceAccountSwitcher.tsx` only if needed for presentation/testability
- `apps/web/src/lib/source/release-deck-validation.ts` only if client-side validation copy or exported constants are needed
- `apps/web/__tests__/source-dashboard-shell-lock.test.ts`
- `apps/web/__tests__/source-account-switcher-lock.test.ts`
- `apps/web/__tests__/release-deck-shell-lock.test.ts`
- `apps/web/__tests__/release-deck-validation.test.ts`
- add focused rendered/behavior tests near existing web tests if behavior changes cannot be covered by file-content locks

Trace-only / do not edit unless a verified behavior gap requires escalation:

- `apps/api/test/tracks.service.test.ts`
- `apps/api/src/tracks/tracks.service.ts`
- `apps/web/src/store/source-account.ts`

Default first slice should touch dashboard/release-deck presentation and web tests, not source account store or API behavior.

## State Requirements

### Loading

- Preserve the `plot-wire-page` / `plot-wire-frame` / `plot-wire-card` shell.
- Dashboard copy remains calm: `Loading source dashboard...`.
- Release Deck copy remains calm: `Loading source release context...`.
- Do not show fake tool cards before source/user context is known.

### Signed Out

- `/source-dashboard` blocks source tools and says sign-in is required before opening source dashboard tools.
- `/source-dashboard/release-deck` blocks Release Deck and says sign-in is required before opening Release Deck.
- Provide a supported return path such as `Back to Plot`.
- Do not expose source cards, Release Deck form, or source-specific actions.

### No Managed Source

- Dashboard must explain that no managed source accounts are attached to the signed-in user.
- Show no fake source tools and no fake source cards.
- It may point to Registrar as the path by which a listener becomes a source, but must not make Registrar source-owned tooling.
- `SourceAccountSwitcher` may remain hidden when `sources.length === 0`.

### No Active Source

- Dashboard must ask the user to select a managed source before source tools operate.
- If managed sources exist, keep the switcher visible and make `Listener Account` context explicit.
- Tool cards should remain unavailable until a source is selected.
- Release Deck opened without active source context must route to an unavailable/error state with `Back to Source Dashboard`.

### Stale Source Context

- If `activeSourceUserId` does not match the signed-in user, clear persisted source context before tools operate.
- If the persisted source is absent from the current user's `managedArtistBands`, clear persisted source context before tools operate.
- Dashboard should land in the no-active-source/no-source state depending on current managed sources.
- Release Deck should explain that the selected source account is no longer attached to this user, then provide `Back to Source Dashboard`.
- Do not silently operate on the previous source or infer another active source.

### Active Source Ready

- Dashboard must show source name, entity type, slug, membership role when
  available, and Home Scene label. Do not foreground GPS verification unless a
  selected source action is blocked by an existing owner-spec rule.
- Source access is per selected source. Do not carry music-submission affordances
  from one source to another source where the same user is not allowed to submit
  music.
- Do not use lack of music-submission access as a blanket block for source
  visibility or event/calendar entry access.
- Current live cards are `Release Deck`, `Source Profile`, `Print Shop`, and
  `Registrar`; founder-preferred report sections are Release Deck, source
  profile/profile management, Calendar/Events, and Registrar kept secondary,
  with Print Shop inside Calendar/Events. Treat route, navigation, or ownership
  changes as a separate scoped surface-contract update before runtime
  implementation. Do not add Metrics as a primary page in this slice.
- Do not duplicate the same tool list in both left and right regions.
- Release Deck must show source identity, Home Scene, three music slots, six-minute cap, fifteen-minute source cap, and the fourth paid ad attachment spot as defined but not active.
- Existing visual vocabulary such as `plot-wire-*` should be preserved.

### Missing Home Scene

- Release Deck must block submit when `sourceProfile.homeScene.id` is missing.
- Disabled submit or inline error must say an active source with a resolved Home Scene is required.
- Do not let Release Deck assign, rewrite, or infer Home Scene.
- Registrar/GPS/Home Scene authority stays with owner specs and existing source origin contracts.

### URL Validation Failure

- Client validation must reject non-`http(s)` audio URL and non-`http(s)` cover art URL.
- Keep errors close to the Release Single form status.
- Copy should name the current hosted-file MVP, not imply upload support.

### Release Date Selection

- Visual design may reserve a release-date field in the Release Deck form.
- Presentation copy for existing or future rows should say `Release date`, not
  `Date added`.
- Runtime implementation must stop until the media owner spec defines the
  release-date contract.
- The future contract must define date-only vs datetime, timezone authority,
  whether immediate release is allowed, past-date validation, scheduled
  visibility, and when scheduled tracks count against active slot/duration caps.

### Remove From Active Deck

- Visual design may replace generic `Manage` row language with a clear `Remove`
  affordance if the intent is only to remove a song from an active Release Deck
  music slot.
- Runtime implementation must stop until the media owner spec defines whether
  remove means delete, deactivate, unpublish, remove from active rotation, or
  another history-safe operation.
- The future contract must define how removal affects existing votes,
  collection state, Artist Profile visibility, Fair Play lifecycle, and active
  slot/duration counts.

### Over 360 Seconds

- Client validation must block a single track over `360` seconds before API submit.
- Copy must name the six-minute cap.
- API remains source of truth if the client misses the case.

### Fourth Slot

- Server rejection for a fourth ready track must remain reject-only.
- UI should show the three-slot cap clearly and explain that the source must choose a different active song combination.
- Do not show a fourth music track or imply automatic replacement.
- The fourth Release Deck spot remains the defined-but-inactive paid ad
  attachment concept and is not a music slot.
- In the report-paper layout, future paid-ad clip controls should place
  `Record clip` on the far right of the paid ad attachment row.
- `Record clip` remains design-only/deferred until paywall, recording, payment,
  review, media capture, and storage contracts are authorized.

### Over 900 Active Seconds

- Server rejection for over `900` active source seconds must remain reject-only.
- UI should explain the fifteen-minute active source cap and avoid silent mutation/replacement of existing rows.
- Do not add history-safe edit/replacement tooling in this slice.

### Valid Tracks Ready For Fair Play / Player Testing

- If at least one valid source-owned ready track exists for the active source
  and Home Scene, Release Deck may show row-level policy/eligibility status and
  concise readiness copy.
- The Release Deck title area should not use a large green `Ready` chip or green
  ready callout in the report-paper direction.
- Readiness copy must not imply Release Deck controls Fair Play scheduling,
  ordering, ranking, recurrence, propagation, or rotation.
- If no valid source-owned tracks exist, show what is missing: active source, Home Scene, or URL-valid source-owned ready track.
- Legacy carry-forward rows may remain visible but must not be counted as new source-owned write-path proof unless they have explicit `artistBandId === activeSource.id`.

## Interaction Notes

- `Listener Account` clears source context and returns to listener/Plot mode.
- Source selection sets both `activeSourceId` and `activeSourceUserId`.
- Dashboard tool card links should only appear in active-source-ready state.
- Release Deck actions are limited to return paths, public Source Profile link,
  Registrar link, row load/open affordances, and URL-only `Release Single`
  submit.
- Row load/open action copy should be `Load`, not `View`.
- Source Dashboard / Release Deck must not mutate listener player state.
- Release Deck must not expose Fair Play controls; Fair Play owns rotation lifecycle after accepted track creation.

## Accessibility And Mobile Notes

- Mobile order: source context, account switcher, Release Deck, slot board, row
  statuses, form, compact metrics row, secondary return links.
- Keep controls as usable buttons/chips; avoid tiny inline text links for critical source/listener context changes.
- Do not communicate source/listener mode by color alone; use explicit labels such as `Listener Account`, `Current Source`, `Source Dashboard`, `Source-owned release`, and `Legacy carry-forward`.
- Form controls must keep labels associated with inputs.
- Validation and API rejection copy must be visible near the form/slot area and not depend only on disabled button state.
- Preserve `plot-wire-*` visual language unless a separate design implementation slice authorizes visual system changes.

## Test Plan And Coverage Gaps

Current tests:

- `source-dashboard-shell-lock.test.ts` locks source dashboard shell copy, live cards, Release Deck caps, and paid-ad-slot-not-active wording.
- `source-account-switcher-lock.test.ts` locks one-account source switching, user-scoped active source context, and listener profile bridge-only behavior.
- `release-deck-shell-lock.test.ts` locks Release Deck route placement, source-owned payload building, URL-only MVP language, source-owned markers, and legacy carry-forward labels.
- `release-deck-validation.test.ts` covers payload creation, title/duration validation, `360` second cap, hosted URL requirements, and optional cover art.
- `tracks.service.test.ts` covers API rejection for a fourth music slot, over
  `360`, over `900`, processing-track exclusion, and Home Scene mismatch.

Coverage gaps to fill in the implementation slice:

- rendered or behavior-level test for dashboard signed-out, no-managed-source, no-active-source, and active-source states;
- rendered or behavior-level test proving stale persisted source context is cleared when user/source ownership no longer matches;
- rendered or behavior-level test for Release Deck no-active-source and stale-source states;
- rendered or behavior-level test for missing Home Scene blocking submit;
- rendered or behavior-level test for visible readiness summary when valid source-owned ready tracks exist;
- rendered or behavior-level test that cap-reached API errors are surfaced without implying auto-replacement or a fourth music track.

Do not rely only on file-content locks if the implementation changes state rendering.

## Validation Commands

Minimum for this docs-only Dev Spec slice:

```bash
pnpm run docs:lint
git diff --check
```

Recommended for later runtime implementation from this spec:

```bash
pnpm --filter web test -- source-dashboard-shell-lock.test.ts source-account-switcher-lock.test.ts release-deck-shell-lock.test.ts release-deck-validation.test.ts
pnpm --filter api test -- tracks.service.test.ts --runInBand
pnpm --filter web typecheck
pnpm run docs:lint
git diff --check
```

Broaden to `pnpm run verify` before PR closeout when feasible.

## Acceptance Criteria

- Source Dashboard states are explicit for loading, signed out, no managed source, no active source, stale source context, and active source ready.
- Release Deck states are explicit for loading, signed out, no active source,
  stale source context, missing Home Scene, URL validation error, over `360`
  seconds, fourth-music-slot rejection, over `900` active seconds, and
  row-level ready-for-Fair-Play/player-testing visibility.
- The slice preserves source-owner/member-facing dashboard scope and keeps public Artist Profile listener-facing and separate.
- Three active music slots, six-minute track cap, and fifteen-minute active source cap are visible and enforced without a fourth active music track; the fourth Release Deck spot remains the inactive paid ad attachment concept.
- Release Deck remains hosted `http(s)` URL-only.
- Stale source context is cleared before dashboard/release-deck tools operate.
- Store/API changes are avoided unless a verified behavior gap requires escalation.
- Tests cover any changed behavior beyond existing file-content locks.
- No deferred features, placeholder CTAs, new routes, new data contracts, or platform-trope patterns are introduced.

## Explicit Do-Not-Build / Do-Not-Design List

- no analytics, dashboards, rankings, follower-growth modules, or play-count insights;
- no billing, paywall, purchase, entitlement, upgrade, subscription, offer,
  coupon, business dashboard, paid promotion management, or paid ad-slot runtime;
- no source posts/messages, `Message Followers`, DM, inbox, chat, notification fanout, or follower-update composer;
- no listener-to-artist DM/contact feature;
- no source-level `Collect`, source-level `Support`, source-level `Blast`, Artist Profile `Blast`, or engagement wheel;
- no upload button, drag-and-drop dropzone, file picker, storage provider setup, transcoding, waveform, worker, queue, or signed upload URL;
- no active fourth music slot; the fourth Release Deck spot remains the inactive
  paid ad attachment concept;
- no Fair Play scheduling, ordering, boost, rotation, recurrence, tier-propagation, or ranking controls;
- no new route names, future source/admin domain decision, or source URL format;
- no city-specific, music-community-specific, artist-specific, source-specific, or fixture-only runtime behavior unless explicitly marked test-only;
- no Registrar, GPS, Home Scene, or source-origin authority changes;
- no bulk visual redesign and no replacement of existing `plot-wire` vocabulary.

## Founder / Product Questions Or Blockers

- No founder decision is required to implement the readiness presentation slice as scoped here.
- Stop and route to owner-spec/product review if implementation requires a separate source-owner credential validation link before dashboard access; current runtime uses signed-in submitter/user membership plus GPS/materialization paths.
- Stop if implementation attempts to add Release Deck release-date scheduling
  before the media owner spec/API/runtime contract is updated.
- Stop if implementation attempts to add Release Deck removal/deactivation
  behavior before the media owner spec/API/runtime contract is updated.
- Stop if implementation attempts to replace the current `Print Shop` card with
  an `Events` route/page before the Source Dashboard / Events / Print Shop
  surface contract is updated.
- Stop if implementation attempts to add a Metrics page, basic metrics, V2 paid
  tracked-single telemetry, or paid-account gating before source metrics and
  monetization/entitlement specs are updated.
- Stop if implementation needs a new `Can submit music` permission field or
  access model beyond the current membership role data returned for managed
  sources.
- Stop if the current runtime role values do not support the founder model of
  `manager` and `member`, with the registering member defaulting to `manager`.
- Stop if implementation needs more granular Events/calendar permissions than
  the founder-stated baseline that source members can add events/calendar
  entries for the selected source.
- Stop if a product stakeholder wants real upload/storage/transcoding, paid ad-slot / on-air ad clip runtime, paywall/purchase/entitlement behavior, source posts/messages, analytics, billing, source profile editing, or future source/admin domain behavior in this slice.
- Stop if fixing stale source context requires changing store persistence semantics beyond current `activeSourceId` plus `activeSourceUserId`.
- Stop if Release Deck readiness copy needs to claim Fair Play scheduling, player mutation, rotation entry, recurrence, or tier-propagation behavior not already owned by broadcast specs.
