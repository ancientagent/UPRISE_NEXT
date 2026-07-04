# Screen Narrative: Artist Profile / Source Dashboard Post-Registration Flow R1

Status: active design handoff packet
Owner: product design + uprise-registrar-source
Last updated: 2026-07-04
Primary owner spec: `docs/specs/users/artist-profile-and-source-dashboard.md`

## Screen / Flow Name

Artist/Band post-registration source lifecycle:

1. listener/base user registers and materializes an Artist/Band source through
   Registrar;
2. source owner/member operates that source through Source Dashboard;
3. public listeners view the source through Artist Profile.

## Actors

- Listener/base user submitting an Artist/Band Registrar filing.
- Source owner: the submitting user after materialization.
- Source member: an invited or existing linked `ArtistBandMember`.
- Public listener: signed-out or signed-in viewer of the Artist Profile.
- Signed-in listener: viewer who may Follow, Collect, and Recommend when
  eligible.
- Product Design agent: turns this packet and the owner spec into UX states and
  visual direction without redefining contracts.

## Why This Screen / Flow Exists

UPRISE needs one legible path from civic listener identity into managed source
identity without blending the listener app, source admin tools, and public source
profile.

The flow exists to make three ideas obvious:

- Registrar is how listeners become sources.
- Source Dashboard is where owners/members operate sources.
- Artist Profile is what listeners see and listen to publicly.

This packet is narrative/UX context only. Durable product contracts remain in
the owner specs.

## Entry Points

- Archive/community information Registrar entry for listener-to-source
  registration.
- Direct `/registrar` route during current MVP runtime.
- Source Dashboard Registrar card/link during the source-side bridge.
- Artist Profile owner/member controls that set active source context and open:
  - Source Dashboard;
  - Release Deck;
  - Print Shop;
  - Registrar.
- Listener/feed/discovery handoffs into Artist Profile, including song-driven
  `trackId` or `signalId` handoffs where current runtime supports them.
- Direct public Artist Profile URL.
- Listener profile source identity access for users who already manage source
  accounts; this is a bridge to Source Dashboard, not embedded source tooling.

## Exit Points

- From Registrar:
  - back to Plot/listener context;
  - Source Dashboard when a managed source context exists;
  - Release Deck or Print Shop only through eligible source context.
- From Source Dashboard:
  - Return to Listener Account / Plot;
  - Source Profile / public Artist Profile;
  - Release Deck;
  - Print Shop;
  - Registrar.
- From Artist Profile:
  - Back to Plot;
  - Visit the source Home Scene/community when available;
  - official external links;
  - owner/member-only source tool links when viewer manages that source.

## Primary User Jobs

- Register an Artist/Band source from the correct Home Scene civic identity.
- Understand whether the source is submitted, materialized, or ready for member
  follow-up.
- Switch from listener identity into a managed source operating context.
- Confirm which source account is active before operating source tools.
- Release source-owned music through Release Deck without confusing it with
  listener upload.
- View the public source page as a listener would see it.
- Listen to up to three source tracks from Artist Profile, then Collect or
  Recommend only when eligible.
- Return cleanly to listener mode.

## Emotional / Brand Beat

The flow should feel like a local artist stepping through a civic threshold into
a real source control room, then seeing the public-facing stage that listeners
can visit.

The mood is grounded, local, and operational:

- Registrar should feel formal and community-bound, not bureaucratic clutter.
- Source Dashboard should feel like a source control room, not a generic creator
  SaaS dashboard.
- Artist Profile should feel public, listenable, and alive without becoming a
  social-media clone.

## State-Dependent Behavior

- Signed-out public listener:
  - can read public Artist Profile;
  - cannot Follow, Collect, Recommend, or operate source tools.
- Signed-in listener, not source member:
  - can Follow;
  - can Collect row-level song signals when available;
  - can Recommend only after genuinely holding/collecting the song;
  - cannot see or operate owner/member source tools.
- Source owner/member:
  - can open Source Dashboard from Artist Profile;
  - can set active source context before opening Release Deck, Print Shop, or
    Registrar;
  - must see which source context is active.
- No active source selected:
  - Source Dashboard asks the user to select a managed source;
  - Release Deck is unavailable until an active managed source exists.
- Stale source context:
  - source routes must clear the persisted context if it does not belong to the
    current signed-in user.
- Registrar before GPS/Home Scene readiness:
  - Artist/Band submission is blocked until Home Scene and GPS requirements are
    satisfied.
- Registrar with active source context:
  - source context is informational and provides return paths;
  - filings remain Home Scene-bound and listener-owned.
- Artist Profile song handoff:
  - plain artist link should not autoplay;
  - song-driven handoff may select/play the matching direct-listen profile row;
  - do not claim shared `RADIYO` mutation unless a future implementation
    explicitly specifies and tests that bridge.

## Data Needed

- Auth/session:
  - current user ID;
  - signed-in state;
  - GPS verification;
  - Home Scene tuple.
- Registrar:
  - submitter-owned Artist/Band entries;
  - materialized `artistBandId`;
  - entry status;
  - member invite counts and delivery state;
  - sync eligibility.
- Source context:
  - managed Artist/Band list;
  - active source ID;
  - active source selecting user ID;
  - membership role.
- Artist Profile:
  - source identity, slug, entity type;
  - bio/profile details;
  - Home Scene identity;
  - members;
  - official links;
  - follow count;
  - up to three direct-listen rows, with selected handoff row first when needed;
  - signal IDs and viewer collected/recommended state when signed in;
  - source-owned events.
- Release Deck:
  - active source;
  - source Home Scene/community;
  - latest ready source tracks;
  - URL, duration, title, and optional artwork input state.

## Actions Allowed

- Registrar:
  - Band / Artist Registration;
  - Materialize Entity;
  - Queue Member Invites;
  - Sync Eligible Members;
  - Load Invite Status.
- Source Dashboard:
  - select managed source account;
  - return to listener account;
  - open Release Deck;
  - open Source Profile / Artist Profile;
  - open Print Shop;
  - open Registrar.
- Release Deck:
  - release a URL-only single from the active source context;
  - return to Source Dashboard or listener account;
  - view public source profile;
  - open Registrar.
- Artist Profile:
  - Follow;
  - Share Artist Page;
  - visit official links;
  - Play/Pause direct-listen rows;
  - seek row timeline;
  - Collect eligible row signals;
  - Recommend only after collected/held;
  - owner/member-only links to source tools.

## Actions Forbidden

- No listener DM/message/contact action to artists.
- No `Blast` on Artist Profile.
- No engagement wheel on Artist Profile.
- No source-level `Collect`, source-level `Blast`, or UPRISE source-level
  `Support` action.
- No direct UPRISE source-level `Support` button; official outbound donation
  links remain allowed when supplied by source profile data.
- No feed/discovery inline `Collect`, `Blast`, `Follow`, or wheel actions as
  substitutes for Artist Profile listening context.
- No Release Deck, Print Shop, Registrar, source posting, analytics, billing,
  upgrade, growth, or source-admin panels inside the listener profile body.
- No public viewer controls for source-owner/member tools.
- No fourth music slot in Release Deck.
- No implied upload/storage/transcoding pipeline beyond URL-only MVP ingest.
- No redefinition of Registrar as a source-owned admin tool.
- No city-specific or fixture-only source behavior unless explicitly marked
  fixture/test-only.

## Connected Surfaces

- `Archive` / community information Registrar entry.
- `/registrar`
- `/source-dashboard`
- `/source-dashboard/release-deck`
- `/print-shop`
- `/artist-bands/[id]`
- `/plot`
- listener profile source identity access.
- Feed/discovery cards that hand into Artist Profile listening where supported.

## Empty States

- No managed source accounts:
  - explain that Registrar is how listeners become sources;
  - do not show fake source tools.
- No active source selected:
  - show source account selection before tools.
- No released songs:
  - Artist Profile says no released songs are available yet.
- Fewer than three tracks:
  - show only available rows or open slots in Release Deck.
- No official links:
  - show a restrained "no official links yet" state.
- No members:
  - show "no members linked yet" without implying public social absence.
- No Registrar entries:
  - show no Artist/Band registrar entries yet.
- No invite status:
  - invite summary remains hidden until loaded or available.

## Error States

- Sign-in required for Source Dashboard, Release Deck, Registrar follow-up
  actions, Follow, Collect, and Recommend.
- GPS verification required before Artist/Band Registrar submission.
- Home Scene cannot resolve for Registrar submission.
- Selected active source no longer belongs to current user.
- Release Deck opened without active source context.
- Active source lacks resolved Home Scene.
- Release Deck URL validation rejects non-`http(s)` audio URLs.
- Release Deck duration validation rejects songs over `360` seconds.
- API rejects fourth active music slot or source active-duration overflow.
- Artist Profile fails to load or source not found.
- Audio playback fails to start.
- Recommend fails because listener does not hold/collect the signal.

## Asset Needs

Design should account for these asset slots without requiring new art assets for
this docs packet:

- source avatar/profile image;
- source cover/header image;
- release artwork thumbnail;
- song row audio affordance states;
- official-link icon treatment;
- source/account selector identity treatment;
- Release Deck slot cards;
- Registrar status chips;
- empty-state illustration or visual marker, if the product design system wants
  one.

## Owner Specs

- End-to-end lifecycle:
  - `docs/specs/users/artist-profile-and-source-dashboard.md`
- Registrar actor/source-origin/materialization:
  - `docs/specs/system/registrar.md`
- Base user and linked source identity:
  - `docs/specs/users/identity-roles-capabilities.md`
- Release Deck limits:
  - `docs/specs/media/release-deck-and-eligibility.md`
- Action boundaries:
  - `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`
  - `docs/specs/core/signals-and-universal-actions.md`
- Visible UI boundaries:
  - `docs/agent-briefs/UI_CURRENT.md`
- Active source lane summary:
  - `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- Messaging boundary:
  - `docs/founder-sessions/2026-07-03_source-listener-messaging-boundary.md`

## Runtime Files

- `apps/web/src/app/artist-bands/[id]/page.tsx`
- `apps/web/src/app/source-dashboard/page.tsx`
- `apps/web/src/app/source-dashboard/release-deck/page.tsx`
- `apps/web/src/app/registrar/page.tsx`
- `apps/api/src/artist-bands/artist-bands.controller.ts`
- `apps/api/src/artist-bands/artist-bands.service.ts`
- `apps/api/src/registrar/registrar.controller.ts`
- `apps/api/src/registrar/registrar.service.ts`
- `apps/web/src/lib/artist-bands/client.ts`
- `apps/web/src/store/source-account.ts`
- `apps/web/src/lib/source/release-deck-validation.ts`
- `apps/web/src/components/source/SourceAccountSwitcher.tsx`
- `apps/web/src/components/plot/PlotListenerProfile.tsx`

## Tests / Locks

Current web locks are mostly source-content/file-content regression locks and route-level contracts. They prevent drift, but they are not proof of fully rendered behavior for every public/source/owner state. Runtime implementation slices should add focused rendered or integration coverage when behavior changes.


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

## Do Not Drift

- Do not turn Artist Profile into the source-owner dashboard.
- Do not turn Source Dashboard into a public profile.
- Do not turn Registrar into a source-owned admin tool.
- Do not put source tools inside the listener profile body.
- Do not add listener-to-artist DM/message/contact controls.
- Do not add `Blast` or an engagement wheel to Artist Profile.
- Do not add source posts/messages, follower-update composers, analytics,
  billing, growth, upgrade, or placeholder cards to Source Dashboard.
- Do not make Release Deck a listener upload surface.
- Do not treat the paid ad attachment as a fourth music slot.
- Do not import Spotify, Instagram, TikTok, Facebook, or generic creator-SaaS
  patterns as defaults.

## Open Questions

- Does the source submitter eventually need a separate source-owner credential
  validation link before dashboard access, or is current signed-in JWT + GPS
  materialization the intended owner path for MVP?
- What is the future source/admin URL or domain format after the current
  monorepo `/source-dashboard` stand-in?
- What exact visual hierarchy should distinguish public Artist Profile controls
  from owner/member source-tool controls when the viewer is both listener and
  source member?
- What is the future source profile editing surface, if any, beyond the current
  Source Profile card linking to the public profile?

## Product Design Handoff Notes

Immediate design task:

Product Design should turn this packet plus
`docs/specs/users/artist-profile-and-source-dashboard.md` into UX states and
visual direction for the post-registration Artist Profile / Source Dashboard
flow without redefining product contracts.

Design output should include:

- source lifecycle state map from Registrar submission to materialized source;
- Source Dashboard selected-source and no-source states;
- Artist Profile public listener state;
- Artist Profile owner/member viewer state with source-tool access clearly
  separated;
- Release Deck URL-only MVP state;
- Registrar source-context bridge state;
- empty/error states listed above;
- visual language recommendations that avoid platform-trope drift.

Design output must not introduce new actions, private messaging, `Blast` on
Artist Profile, engagement wheels on Artist Profile, or source tools inside the
listener profile.
