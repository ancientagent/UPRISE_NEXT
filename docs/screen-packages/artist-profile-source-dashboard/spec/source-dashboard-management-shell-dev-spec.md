# Dev Spec: Source Dashboard Management Shell Readiness

Status: implementation-facing package spec; not a full-shell build authorization
Package: `docs/screen-packages/artist-profile-source-dashboard/`
Primary owner spec: `docs/specs/users/artist-profile-and-source-dashboard.md`
Recommended next slice: `Source Dashboard Releases / Release Deck Shell Readiness`
Last updated: 2026-07-06

## Authority Statement

This document translates current Source Dashboard design/spec/founder work into a
narrow developer-facing readiness spec. It is a screen-package artifact, not
durable product doctrine. If this file conflicts with `AGENTS.md`, owner specs
under `docs/specs/**`, or current runtime evidence, those sources win.

Do not read this as permission to build the entire Source Dashboard management
shell. The first buildable vertical is Releases / Release Deck shell readiness:
source role context, source states, three URL-only music slots, cap/status
clarity, `Load` row behavior, `Release date` copy without scheduling, and an
inactive paid ad attachment spot.

## Evidence Used

- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `docs/README.md`
- `docs/specs/README.md`
- `docs/screen-packages/README.md`
- `docs/screen-packages/artist-profile-source-dashboard/README.md`
- `docs/screen-packages/artist-profile-source-dashboard/design-spec/source-dashboard-management-shell-layout-brief.md`
- `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md`
- `docs/screen-packages/artist-profile-source-dashboard/spec/source-dashboard-release-deck-readiness-dev-spec.md`
- `docs/specs/users/artist-profile-and-source-dashboard.md`
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/specs/media/release-deck-and-eligibility.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/specs/economy/print-shop-and-promotions.md`
- `docs/specs/core/signals-and-universal-actions.md`
- `docs/specs/DECISIONS_REQUIRED.md`
- `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md`
- `docs/founder-sessions/2026-07-06_source-dashboard-ad-action-wheel-links.md`
- `docs/founder-sessions/2026-07-06_source-dashboard-members-feed-publishing.md`

## Scope

This spec covers Source Dashboard management shell readiness for the current
`/source-dashboard` monorepo stand-in for future separate source/admin tooling.
The shell should read as a white report-paper source file, not a listener
profile, public Artist Profile, Home/Plot surface, SaaS admin suite, or generic
file manager.

In scope as shell context:

- top command line with `UPRISE`, `SOURCE DASHBOARD`, signed-in user/source role,
  compact source selector, and `Exit to Listener Account`;
- report-paper source record treatment with compact source identity, Home Scene
  context, and existing profile snapshot data where current contracts already
  support it;
- report sections for `Profile`, `Releases`, and `Calendar`;
- Releases / Release Deck as the first implementation vertical;
- Source Record / Print Shop bridge only where it preserves current
  source-facing route continuity and does not imply calendar/event runtime that
  is not contracted.

Out of scope for this spec:

- a full one-pass rebuild of all Profile, Releases, Calendar, Metrics, Print
  Shop, paid ads, permissions, and member management behavior;
- owner-spec edits, migrations, payment/provider work, upload/storage work, feed
  fanout, new source/admin domain routing, or new route names.

## First Buildable Vertical

The recommended next implementation slice is `Source Dashboard Releases /
Release Deck Shell Readiness`.

Build only enough of the management shell to make the Release Deck readiness
path coherent:

- source/account context is visible and source-scoped;
- source states are explicit before tools operate;
- Release Deck is the primary visible section;
- three active music slots and current caps are visible;
- URL-only entry remains the only active ingest model;
- `Load` is the row-level entry/action copy;
- `Release date` copy is used where date copy appears, without implementing
  scheduling or persistence;
- valid source-owned rows show row-level validity, such as a green check with
  accessible text;
- the paid ad clip spot is present only as an inactive attachment concept, not a
  fourth music slot.

Do not build the complete Profile/member editor, Metrics runtime, Calendar
runtime, event publishing, follower calendar delivery, paid ad runtime, or
member permission system in this slice.

## Build Now

### Shell Readiness

Implementation may prepare the current `/source-dashboard` shell for the
report-paper direction if it is scoped to existing data and state:

- preserve Source Dashboard as source/admin tooling, separate from listener
  profile and public Artist Profile;
- avoid duplicate left navigation plus tool-card stacks;
- use one report/source-file structure where `Profile`, `Releases`, and
  `Calendar` read as sections of the selected source record, not unrelated
  routes;
- keep Releases / Release Deck first for new source setup;
- keep Registrar secondary as a lifecycle/context bridge if visible;
- keep Print Shop as a lightweight source-facing bridge, not a listener tool.

### Top Command Line And Source Context

The top command line should show:

- `UPRISE`;
- `SOURCE DASHBOARD`;
- signed-in account/user context plus the role/position for the selected source,
  such as `Manager` or `Member`, when current runtime data supplies it;
- compact current-source selector;
- `Exit to Listener Account`.

Switching selected source must update the displayed selected-source role from
that source's membership data. Do not carry permissions or labels from one
source to another.

### Source States

The shell must account for:

- loading;
- signed out;
- no managed sources;
- managed sources but no active source selected;
- stale persisted source context where `activeSourceUserId` does not match the
  signed-in user;
- stale persisted source context where `activeSourceId` no longer belongs to the
  signed-in user's managed sources;
- active source ready.

Stale source context must be cleared before source tools operate. Do not infer a
replacement source silently.

### Releases / Release Deck

Release Deck build-now behavior remains the current URL-only source-owned
Release Deck contract:

- exactly `3` active music slots;
- no single song over `6` minutes / `360` seconds;
- no source over `15` active minutes / `900` seconds in a city-tier community;
- current MVP explicit hosted `http(s)` audio URL only;
- optional hosted `http(s)` cover art URL only where current validation supports
  it;
- reject-only cap behavior; do not silently delete, replace, reorder, or mutate
  existing rows;
- no Fair Play scheduling, boost, ranking, ordering, recurrence, or tier
  controls.

Row behavior:

- use `Load`, not `View`, for the row-level action that opens or focuses the
  selected slot/release context;
- `Load` stays inside the Release Deck flow and must not navigate to a generic
  media manager;
- use `Release date`, not `Date added`, wherever row date copy is visible;
- do not persist release dates, schedule future visibility, or move tracks
  between scheduled/active states until the media/API contract exists;
- show row-level policy/eligibility status, not a large section-level green
  `Ready` chip;
- valid source-owned rows may use a green check/status marker, with text or
  accessible labeling so the state is not color-only;
- legacy carry-forward rows must stay distinguishable from explicit
  source-owned Release Deck rows.

### Paid Ad Attachment Spot

Build-now behavior is visual/inactive only:

- show the fourth spot as a paid ad clip / on-air ad attachment concept;
- make clear it is not a fourth music slot and not a standalone rotation entry;
- show `10 sec max` only as a future ad-clip property;
- keep any `Record clip`, category selector, link target, paywall, or payment
  state disabled, non-interactive, or omitted;
- avoid `Upgrade`, `Buy`, `Subscribe`, `Promote`, or other purchasable CTAs.

## Design-Only, Deferred, Or Future

These items are design-clear enough to preserve in layout language, but they are
not build-now runtime behavior.

### Role And Permissions

Design direction:

- the registering/materializing member is the default `manager`;
- a `member` can be attached to a source and should be able to view source
  context;
- future source-specific permission controls are `Can edit music` and `Can edit
  calendar`.

Implementation boundary:

- do not add `Can edit music` or `Can edit calendar` checkboxes, fields, API
  behavior, or enforcement until identity/media/events contracts define the
  fields and permission checks;
- current Release Deck write behavior should not be narrowed or widened by this
  spec beyond existing managed-source ownership/membership runtime;
- if a slice needs manager-only editing or member-specific edit denial, stop for
  owner-spec/API work first.

### RADIYO Tier Highlight

The design may show the idea that a single already out on `RADIYO` can be
highlighted and that colors can represent the current tier.

Do not implement tier highlight runtime until the owner specs define:

- tier names and data source;
- color tokens;
- contrast requirements;
- state precedence with row validity, errors, selected/open state, and legacy
  carry-forward state.

### Metrics

Metrics are not a first-slice runtime. Do not add a primary `Metrics` section,
metrics page, graph runtime, fake analytics, leaderboard, growth coaching, or
paid tracked-single telemetry.

Future design direction:

- Release Metrics belongs under `Releases`;
- song choice should use a dropdown selector, not left/right arrows and not a
  `current song` model;
- the selector should be able to choose eligible songs beyond the three active
  Release Deck rows after a metrics contract exists;
- graph expansion is deferred until the data contract exists;
- metrics remain descriptive only and must not affect Fair Play, rotation,
  ranking, governance, voting, propagation, or tier movement.

### Profile And Members

Build only read/scaffold presentation that existing contracts already support.
Do not implement a complete source Profile editor in the Release Deck readiness
slice.

Design direction to preserve:

- Profile is source-facing management for public Artist Profile content, not the
  public Artist Profile itself;
- bio/details, official links, source identity, follower count, and source
  member summary belong in the source record;
- donation and contact are official source-provided outbound links, not UPRISE
  `Support`, DM, inbox, or in-app contact features;
- member management belongs in the source-facing Profile/bio area, not on the
  public Artist Profile;
- manager-led member email/search lookup is design-only until identity/search
  and invite contracts exist;
- resolved member avatars may later link to listener accounts/profiles, but
  avatar links are deferred until privacy and routing rules exist.

Do not expose unresolved member emails publicly. Do not add broad people search,
public permission editing, listener-to-artist private messaging, or in-app
contact behavior.

### Calendar And Print Shop

Calendar/Print Shop direction is design-clear but implementation-blocked beyond
current lightweight bridge behavior.

Allowed in the first readiness slice:

- keep a secondary Print Shop bridge/path that preserves current source context;
- describe Calendar as a future source section if visible in shell copy;
- do not move route ownership or event creation behavior in this slice.

Deferred until events/feed/calendar contracts exist:

- private/draft source calendar planning runtime;
- event update/delete workflows;
- explicit creator `Publish` action/status;
- public feed publication from source lifecycle events;
- community-calendar visibility for creator-published events;
- follower-calendar delivery for followers of the source;
- idempotency, duplicate prevention, updates/cancellations, follower opt-out,
  mute, external calendar sync/export, and moderation/review rules.

Existing event direction to preserve in future specs:

- source calendar work may remain private/draft;
- a source event does not become public/community-calendar-visible/follower-
  calendar-visible merely because it exists in the source calendar;
- creator publication is the gate;
- when the contract is active, a creator-published artist/source event can
  appear on the community calendar and be delivered to follower calendars;
- Print Shop remains source-facing and is not a listener event-authoring tool.

### Paid Ad Categories And Link Targets

The paid ad clip category/link-target model is deferred. Do not save or execute
it in the first slice.

Future design direction:

- category options may be `release date`, `general`, `event`, and `sponsor`;
- `release date` may link a calendar date;
- `event` may link a source event;
- `sponsor` may link an activated business account;
- `general` may have no required linked target;
- future linked targets may be visitable through an action-wheel-style affordance
  only after action/signal, media, economy, and business-account contracts
  activate it.

This does not authorize a public Artist Profile engagement wheel.

## Data And API Assumptions

Current implementation can rely on these existing seams unless current code has
changed:

- `GET /users/:id/profile` supplies managed Artist/Band source summaries,
  including `managedArtistBands` and current membership role data where present;
- `apps/web/src/store/source-account.ts` persists `activeSourceId` and
  `activeSourceUserId`;
- `SourceAccountSwitcher` is the current source selector and must validate
  active source context against the current user;
- `GET /artist-bands/:id/profile` reads public/source profile data for the
  selected Artist/Band;
- `POST /tracks` is the current URL-only Release Deck write seam;
- Release Deck client validation owns title, duration, hosted audio URL, and
  optional hosted cover URL validation before API submit;
- API enforcement remains the source of truth for managed-source membership,
  Home Scene match, `3` ready slots, `360` second song cap, and `900` second
  active-source cap;
- `/print-shop` and `POST /print-shop/events` remain current source-facing event
  bridge/runtime, not a new Calendar shell contract.

Missing contracts/blockers:

- source-specific `Can edit music` and `Can edit calendar` fields and
  enforcement;
- manager/member role normalization if runtime values differ from founder
  language;
- release-date persistence, date-only vs datetime, timezone, immediate release,
  past-date validation, scheduled visibility, and scheduled-to-active
  transition;
- history-safe remove/deactivate/replacement behavior for Release Deck rows;
- real upload, storage, transcoding, waveform, worker, queue, or signed upload
  URL behavior;
- metrics endpoint and eligible-song lookup across current/prior uploads;
- paid ad recording, media capture, payment, entitlement, category persistence,
  linked targets, business-account selection, and action-wheel visit behavior;
- source Profile editing API for bio/details/song metadata/official link
  expansion where not already implemented;
- member email/search lookup, invite resolution, avatar linking, and privacy
  contract;
- event draft/publish state, community-calendar visibility, follower-calendar
  delivery, feed projection, and moderation contracts.

## Accessibility And Mobile Notes

Accessibility requirements for the first implementation slice:

- do not communicate source state, row validity, errors, or ad inactivity by
  color alone;
- green check validity requires accessible text such as `Valid source-owned
  release`;
- form labels must stay programmatically associated with inputs;
- validation/API errors must appear near the affected Release Deck form or row;
- source selector, listener exit, row `Load`, and submit actions must be
  keyboard reachable;
- disabled/deferred controls must be visibly and semantically inactive if
  rendered;
- report-paper borders/texture must preserve readable contrast and not obscure
  focus indicators.

Mobile order for this readiness slice:

1. signed-in/source context;
2. source selector;
3. selected source summary/source record;
4. Release Deck slot rows;
5. URL-only release form or selected row `Load` detail;
6. inactive paid ad attachment spot;
7. compact Profile snapshot if existing data supports it;
8. Calendar/Print Shop bridge if visible;
9. `Exit to Listener Account`.

Do not rely on tiny inline text links for source switching or listener-account
exit on mobile.

## Acceptance Criteria For First Vertical Slice

- The shell makes Source Dashboard clearly source/admin-facing and separate from
  listener profile, public Artist Profile, Home, and Plot.
- The top command line shows the signed-in user/account context, selected-source
  role when available, source selector, and listener-account exit.
- Switching source context updates the displayed selected-source role and does
  not carry source permissions across sources.
- Loading, signed-out, no-managed-source, no-active-source, stale-source, and
  active-source states are explicit.
- Stale `activeSourceId` / `activeSourceUserId` state is cleared before source
  tools operate.
- Releases / Release Deck is the first buildable section and primary vertical.
- Release Deck shows exactly three active music slots, the `6` minute per-song
  cap, the `15` minute active-source cap, and URL-only ingest.
- Row action copy uses `Load`, not `View`.
- Row date copy uses `Release date`, without implementing scheduling or
  release-date persistence.
- Valid source-owned rows show row-level validity, such as an accessible green
  check/status; there is no large section-level green `Ready` chip.
- The paid ad clip spot is visibly inactive and cannot be mistaken for a fourth
  active music slot.
- Paid ad categories/link targets, payment, recording, and action-wheel linked
  target behavior are not implemented.
- Metrics runtime is not implemented; no arrows/current-song model is added.
- Member email/search, avatar links, `Can edit music`, and `Can edit calendar`
  are not implemented until contracts exist.
- Calendar/Print Shop remains a lightweight bridge only; no event publish,
  community-calendar delivery, or follower-calendar delivery is implemented.
- Tests cover any changed behavior beyond existing file-content locks.
- No deferred feature, placeholder CTA, fake module, new route, new data
  contract, or platform-trope pattern is introduced.

## Explicit Do-Not-Build List

- no full Source Dashboard shell build in this slice;
- no source tools in listener profile;
- no public listener-facing source admin controls;
- no fourth active music slot;
- no upload button, drag-and-drop file picker, storage provider setup,
  transcoding, waveform, worker, queue, or signed upload URL;
- no Release Deck scheduling, active replacement, history mutation, or remove
  behavior without media owner-spec/API contracts;
- no Fair Play scheduling, ordering, boost, recurrence, ranking, propagation, or
  tier controls;
- no paid ad purchase, billing, payment account setup, entitlement, upgrade,
  subscription, invoice, refund, or saved payment method behavior;
- no paid ad category/link-target persistence, sponsor linking, business-account
  selection, or action-wheel linked-target visit runtime;
- no public Artist Profile engagement wheel;
- no Metrics page, fake analytics, graphs, leaderboards, growth advice, paid
  tracked-single telemetry, or business intelligence module;
- no member permission editing, member email/search lookup, public unresolved
  email display, broad people search, or avatar profile links;
- no listener-to-artist DM, inbox, chat, private message, source posts, manual
  follower-update composer, or `Message Followers` placeholder;
- no event publish runtime, follower-calendar delivery, community-calendar
  auto-visibility, external calendar sync/export, ticketing, RSVP, sponsor sales,
  offers, coupons, marketplace, or promotion-management behavior;
- no `Coming Soon`, `Upgrade`, `Buy`, `Subscribe`, `Join`, or other unapproved
  placeholder/purchase CTAs.

## Stop Conditions And Product Questions

Stop before implementation or route to owner-spec/product review if the slice
requires any of the following:

- a new source role/permission schema or runtime fields for `Can edit music` or
  `Can edit calendar`;
- changing who may write Release Deck rows beyond current managed-source
  ownership/membership enforcement;
- release-date persistence, scheduling, or public scheduled-release behavior;
- RADIYO tier highlight runtime or tier color/state mapping;
- track removal, replacement, deactivation, unpublish, or history-safe mutation;
- source metrics lookup, graph data, or paid tracked-single analytics;
- paid ad recording, category/link-target persistence, payment, sponsor business
  account linking, or linked-target action-wheel behavior;
- event draft/publish state, feed projection, community-calendar visibility, or
  follower-calendar delivery;
- moving Print Shop into a new Calendar route or changing Print Shop route/API
  ownership;
- member email/search lookup, invite resolution beyond current Registrar flows,
  or avatar links to listener accounts;
- real upload/storage/transcoding/waveform/media-worker behavior;
- source posts/messages, follower updates, DMs, inboxes, or manual social
  posting;
- broad visual redesign that replaces the approved report-paper/source-file
  direction or current plot-wire vocabulary without a separate design
  implementation slice.

Open product questions to keep visible:

- What exact runtime fields represent `manager`, `member`, `Can edit music`, and
  `Can edit calendar`?
- Should the first implemented release-date field be date-only or datetime, and
  what timezone owns it?
- What are the approved RADIYO tier names, colors, and precedence rules?
- What is the future metrics source of truth for current and previously uploaded
  songs?
- What is the final event publication contract for private drafts, community
  calendar visibility, follower calendar delivery, updates, cancellation, and
  follower opt-out?
- Does source member avatar linking go to listener profiles, public user pages,
  or another privacy-controlled identity route?

## Validation Seed

For this docs-only package artifact:

```bash
pnpm run docs:lint
git diff --check -- docs/screen-packages/artist-profile-source-dashboard/spec/source-dashboard-management-shell-dev-spec.md
```

For a later runtime slice from this spec, start with focused web tests around
Source Dashboard state handling, source context clearing, Release Deck row copy,
caps/status copy, and URL-only validation. Broaden to `pnpm run verify` before
PR closeout when feasible.
