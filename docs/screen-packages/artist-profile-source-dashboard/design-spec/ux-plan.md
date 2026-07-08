# Artist Profile / Source Dashboard UX Plan

Status: design-spec gate
Package: `artist-profile-source-dashboard`
Owner contract: `docs/specs/users/artist-profile-and-source-dashboard.md`
Design lane: `uprise-design-ui`
Runtime lane: `uprise-registrar-source`

## Purpose

This UX plan defines the design-owned screen hierarchy, visible states, accessibility expectations, responsive behavior, visual direction, and future art needs for the Artist Profile / Source Dashboard screen package.

It does not create product truth. Durable behavior remains in the owner spec and connected specs. Runtime, API, auth, data, validation, and action grammar belong to the Dev Spec/runtime implementation lanes.

## Source Evidence

Primary package evidence:

- `docs/screen-packages/artist-profile-source-dashboard/README.md`
- `docs/screen-packages/artist-profile-source-dashboard/instruction-packet.md`
- `docs/screen-packages/artist-profile-source-dashboard/source-map.md`
- `docs/specs/users/artist-profile-and-source-dashboard.md`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/solutions/SCREEN_NARRATIVE_ARTIST_PROFILE_SOURCE_DASHBOARD_R1.md`

Runtime surfaces inspected from the package source map:

- `apps/web/src/app/artist-bands/[id]/page.tsx`
- `apps/web/src/app/source-dashboard/page.tsx`
- `apps/web/src/app/source-dashboard/release-deck/page.tsx`
- `apps/web/src/app/registrar/page.tsx`
- `apps/web/src/components/source/SourceAccountSwitcher.tsx`
- `apps/web/src/store/source-account.ts`
- `apps/web/src/lib/source/release-deck-validation.ts`
- `apps/web/src/lib/artist-bands/client.ts`

## Screen Narrative

The flow should make one lifecycle legible without blending surfaces:

1. A listener/base user uses Registrar to submit and materialize an Artist/Band source from the correct Home Scene civic identity.
2. A source owner/member operates that managed source through Source Dashboard and its source-side tools.
3. Public listeners view the source through Artist Profile as a public, direct-listen source page.

The emotional model is a local artist crossing from civic registration into a practical source control room, then seeing the public stage listeners can visit. Registrar should feel formal and Home Scene-bound. Source Dashboard should feel operational and source-side. Artist Profile should feel public, listenable, and alive without becoming a social-media clone.

## User Intent

Artist Profile user intent:

- Identify the artist/band and its Home Scene.
- Listen directly to up to three source tracks outside `RADIYO`.
- Follow, share, visit official outbound links, and use row-level `Collect` / gated `Recommend` when eligible.
- See basic source identity, members, and source-owned events without entering source-management mode.
- If the viewer is an owner/member, reach source tools through a clearly separated owner/member bridge.

Source Dashboard user intent:

- Confirm which managed source account is active before taking source-side action.
- Switch between listener account and managed source accounts without creating a second login model.
- Open the current live source tools: `Release Deck`, `Source Profile`, `Print Shop`, and `Registrar`.
- Return cleanly to listener/Plot mode.
- Avoid mistaking Source Dashboard for public profile, listener profile, or generic creator-SaaS analytics.

Registrar / Release Deck bridge intent:

- Registrar remains Home Scene-bound civic infrastructure, even when entered from source context.
- Release Deck remains source-side URL-only MVP release tooling with three music slots, six-minute per-song cap, and 15-minute total source cap.

## UX Hierarchy: Artist Profile

Top zone: public source identity

- Label the surface as Artist Page / Artist Profile, not listener profile.
- Show source name, entity type, slug, bio, follower count, member count, and Home Scene identity when available.
- Keep Home Scene identity as `city + state + music community` when shown.
- Primary public actions are `Share Artist Page` and `Follow`.
- Owner/member-only tool links may appear in this zone only when the viewer manages the source. They must be visually separated from public listener actions.

Context/return zone:

- Include `Back to Plot`.
- Include `Visit <Home Scene>` only when a source Home Scene is available.
- If owner/member source tools are available, show source-context copy such as whether opening tools will align/switch the active source account.

Main listening zone:

- Lead with `Songs / Releases` and `Listen Here`.
- Show up to three playable song rows.
- If a feed/discovery handoff selects a track outside the first three, the selected track may appear first while preserving the three-row cap.
- Each row needs title, artist, duration, basic play context, source-owned marker when applicable, selected marker when applicable, and local playback timeline.
- Row actions are `Play` / `Pause`, `Collect`, and gated `Recommend` only.
- Local copy should make clear that this is direct listening here, not `RADIYO` wheel behavior.

Right/supporting information zone:

- Artist Info / Identity: created-by and Home Scene details.
- Official Links: website, merch, music/albums, donate, or other source-provided official outbound links when present.
- Members: linked lineup only; do not imply social absence when empty.
- Events: upcoming/recent source-owned events where present.

## UX Hierarchy: Source Dashboard

Header zone:

- Label the surface as Source Dashboard.
- If a source is active, show source name, entity type, slug, and membership role.
- Show the signed-in account/user beside the source selector with the role/title
  for the currently selected source; switching sources changes that displayed
  role/title.
- If no source is active, lead with `Select a source account`.
- Header copy should state that source-facing tools live here and operate on the active source account.
- Provide `Back to Plot`; provide `Return to Listener Account` when source context is active.

Source account selector zone:

- Use `SourceAccountSwitcher` as the visible account-context control when the user has managed sources.
- Show the current context as either Listener Account or the active source.
- The selector should communicate one signed-in user with switchable managed source contexts, not separate account credentials.
- If no managed sources exist, do not show fake source cards.

Current context zone:

- Once a source is selected, show a strong current-context card with source name, entity type, membership role, Home Scene, GPS state, and promoter capability state when present.
- Copy should clarify that source tools validate eligibility and operate from the source context while the signed-in user remains the actor.

Tool-card zone:

- Current live tool cards only:
- `Release Deck`: release singles/manage active music slots for the active source.
- `Source Profile`: view the public Artist Profile.
- `Print Shop`: source-facing creator/event issuance lane where authorized.
- `Registrar`: civic/source registration bridge and status follow-up.

Do not add analytics, billing, growth, upgrade, source posts/messages, follower updates, or placeholder modules.

## UX Hierarchy: Release Deck Bridge

Release Deck is part of source-side tooling and should be visually connected to Source Dashboard.

Required zones:

- Header with active source identity, Home Scene, caps, and return links.
- Current Context card confirming active source, Home Scene, music slot count, and paid ad slot as defined but not active here.
- Paid ad attachment may reserve future category/link-target structure
  (`release date`, `general`, `event`, `sponsor`) but must remain inactive until
  owner specs define paid ad runtime, business linking, and action/signal visit
  behavior.
- Current Music Slots, showing exactly three MVP music slots with open-slot state, source-owned release marker, or legacy carry-forward marker.
- Release Single form for URL-only MVP ingest: source, title, optional album/release note, duration in seconds, audio file URL, optional cover art URL, submit state, and validation feedback.

Design must not imply real upload, storage, transcoding, waveform extraction, history-safe replacement/edit tooling, or a fourth active music slot.

## UX Hierarchy: Registrar Bridge

Registrar remains civic/Home Scene infrastructure, not source-owned admin.

Required zones:

- Registrar header: Home Scene-bound submission framing and explicit action intent.
- Source-context bridge card: show active source context when present, but state that filings remain Home Scene-bound and listener/base-user owned.
- If no active source is selected, explain that Registrar remains available but source-facing capability work is clearer from Source Dashboard after selecting a source.
- Action selection for Artist/Band and Promoter filings, where currently authorized.
- Artist/Band registration form with Home Scene state, GPS gate messaging, source name/type/slug, and member roster inputs.
- Registrar history with status chips/cards and authorized next actions: Materialize Entity, Queue Member Invites, Sync Eligible Members, Load Invite Status.
- Promoter registration/capability sections remain visible only as currently implemented; do not convert them into business dashboard or monetization modules.

## State Model

Signed-out public Artist Profile:

- Can read the public Artist Profile, public identity, official links, song rows, members, and events.
- Cannot Follow, Collect, Recommend, or operate source tools.
- Disabled actions should explain sign-in requirement through copy, affordance, or inline feedback where implementation supports it.

Signed-in listener, not source owner/member:

- Can Follow.
- Can Play/Pause direct-listen rows.
- Can Collect eligible row signals.
- Can Recommend only after genuinely holding/collecting the song.
- Cannot see or operate owner/member source tool controls.

Listener visitor / visited-scene context:

- Artist Profile remains public and direct-listen.
- Registrar actions file against the user's Home Scene, not the scene being visited; current Registrar copy already surfaces this visitor warning.
- Do not use visitor state to create cross-community source-management shortcuts.

Source owner/member/manager:

- Can see owner/member-only links from Artist Profile into source tools.
- Owner/member links should set or align active source context before opening Source Dashboard, Release Deck, Print Shop, or Registrar.
- Must see which source account is active before operating tools.
- If persisted source context belongs to another user or is no longer managed by the signed-in user, the design should support a cleared/invalid-context state rather than showing tools.

No managed source accounts:

- Source Dashboard should explain that Registrar is how listeners become sources.
- It may mention promoter capability where current runtime does, but it must not show fake source-management tools.

No active source selected:

- Source Dashboard shows account selection and a current-context explanation.
- Release Deck is unavailable and should route back to Source Dashboard.

Loading states:

- Artist Profile: `Loading artist profile...`
- Source Dashboard: `Loading source dashboard...`
- Release Deck: `Loading source release context...`
- Registrar: use form/status-level loading language already present for profile, entries, invite status, and capability checks.

Error states:

- Artist Profile not found or profile load failure.
- Sign-in required for Source Dashboard, Release Deck, Registrar follow-up actions, Follow, Collect, and Recommend.
- Selected active source no longer belongs to current signed-in user.
- Release Deck opened without active source context.
- Active source lacks resolved Home Scene.
- Audio playback fails to start.
- Recommend fails because the listener does not hold/collect the signal.

Empty states:

- No released songs: say no released songs are available yet.
- Fewer than three tracks: show only available Artist Profile rows; Release Deck may show open slots.
- No official links: restrained `No official artist links have been shared here yet.` state.
- No members: `No members have been linked yet.`
- No events: no events are published yet.
- No Registrar entries: no Artist/Band registrar entries yet.
- No invite status: hide invite summary until loaded or available.

Ready states:

- Artist Profile ready tracks show direct-listen rows with play/pause, timeline, collect, and gated recommend states.
- Artist Profile ready events show title, datetime, venue/location, source-owned event marker when applicable, and descriptive attendance/address details where available.
- Release Deck ready slots show source-owned release or legacy carry-forward markers.
- Source Dashboard ready state shows active source context and four live tool cards.

Validation states:

- Registrar Artist/Band submission is blocked until signed in, GPS verified, and Home Scene resolved.
- Registrar member roster fields should surface missing/incomplete member inputs without suggesting partial source creation.
- Release Deck validates title, positive duration, maximum 360 seconds, required hosted `http(s)` audio URL, and optional hosted `http(s)` cover art URL.
- API-level fourth-slot or 15-minute overflow rejection belongs to Dev Spec/runtime, but design should reserve clear error space near Release Deck submission and slots.

## Interaction Model

Authorized Artist Profile interactions:

- `Back to Plot`.
- `Visit <Home Scene>` when source Home Scene is present.
- `Share Artist Page`.
- `Follow` for signed-in eligible listeners.
- Official outbound link `Visit` actions when source data provides URLs.
- Row-level `Play` / `Pause`.
- Row timeline seek.
- Row-level `Collect` when signed in and signal exists.
- Row-level `Recommend` only after collected/held.
- Owner/member-only source tool links when viewer manages the source.

Authorized Source Dashboard interactions:

- Select Listener Account.
- Select a managed source account.
- Return to listener/Plot mode.
- Open Release Deck.
- Open Source Profile / Artist Profile.
- Open Print Shop.
- Open Registrar.

Authorized Release Deck interactions:

- Return to Listener Account.
- Back to Source Dashboard.
- View Source Profile.
- Open Registrar.
- Submit a URL-only Release Single from active source context.

Authorized Registrar interactions for this package:

- Select Artist/Band or Promoter filing path where currently implemented.
- Submit Artist/Band registration when signed in, GPS verified, and Home Scene resolved.
- Materialize Entity.
- Queue Member Invites.
- Sync Eligible Members.
- Load Invite Status.
- Promoter code and promoter registration controls only where current Registrar runtime authorizes them.

## Responsive / Mobile Considerations

- Artist Profile should collapse from two-column `listening + supporting info` into a single-column order: identity, public actions, source-tool bridge if eligible, direct-listen rows, official links, members, events.
- Owner/member tool links should wrap into compact chips or stacked buttons without crowding public actions.
- Source Dashboard tool cards should collapse from four-card grid into a single-column stack with active source context above tools.
- SourceAccountSwitcher chips must wrap and remain tappable; Listener Account should remain visible as a clear exit from source mode.
- Release Deck should show current source context before the form on small screens; music slots can stack vertically.
- Registrar forms already use responsive grids; maintain readable labels, helper text, and error blocks on narrow screens.
- Tap targets should remain at least mobile-comfortable button/chip size; do not rely on tiny inline text links for critical context changes.

## Accessibility And Copy Constraints

- Do not communicate source/listener mode with color only; pair chips with explicit labels such as `Current Context`, `Listener Account`, `Source-owned release`, and `Legacy carry-forward`.
- Preserve accessible labels for playback timelines and form controls.
- Disabled states must not be the only explanation for gated actions; nearby copy should name the gate when practical.
- Use plain operational copy, not creator-platform hype.
- Avoid follower-count/clout emphasis beyond the existing follower count chip.
- Avoid platform-trope labels such as `DM`, `Message`, `Creator Studio`, `For You`, `Promotions`, `Upgrade`, or `Coming Soon` unless a future owner spec authorizes them.
- Official donation links may be displayed as outbound official links when source profile data supplies them; do not turn them into an in-app UPRISE `Support` action.
- Keep `Collect` as the user-facing song save action; do not reintroduce `Add` copy for public song rows.

## Visual Direction

Use the current MVP visual vocabulary as the base:

- `plot-wire-page`, `plot-wire-frame`, `plot-wire-card`, `plot-wire-panel`, `plot-wire-chip`, and `plot-wire-list-item` style families.
- Warm off-white / paper backgrounds, black linework, rounded cards, slight hard shadows, and lime accent for active/confirmed states.
- Source Dashboard should feel more like an operational control room than a social profile or SaaS analytics dashboard.
- Artist Profile should feel like a public local stage: identity first, direct listening second, official links and source details nearby.
- Registrar should retain a civic threshold feel: formal, grounded, Home Scene-bound, not bureaucratic clutter.
- Release Deck should feel like a source-owned slot board plus a restrained publishing form, not a media-management suite.

Design should avoid importing Spotify, Instagram, TikTok, Facebook, or generic creator-SaaS patterns. Do not use album-grid/library tropes, social DM/contact blocks, creator analytics cards, upgrade prompts, or follower-growth modules as defaults.

## Asset And Art Needs For Future Creative Studio

No assets should be generated for this design-spec gate. Future Creative Studio work may need:

- Source avatar/profile image treatment.
- Source cover/header image treatment.
- Release artwork thumbnail slot and empty/open-slot treatment.
- Song row playback affordance states for idle, selected, playing, collected, and recommended.
- Official-link icon treatment for website, merch, music/albums, and donate links.
- Source/account selector identity treatment.
- Release Deck slot-card art treatment.
- Registrar status chip and invite-status visual treatment.
- Empty-state visual marker for no released songs / no source accounts, only if the broader design system wants one.

Asset briefs must preserve source/listener separation and avoid fake placeholder CTAs. Art should support community/source identity without hardcoding a city, genre, artist, or fixture.

## No-Go Rules

- No listener DMs, messages, contact buttons, or inbox paths to artists.
- No `Blast` on Artist Profile.
- No engagement wheel on Artist Profile.
- No source-level `Collect`, source-level `Blast`, or UPRISE source-level `Support` action.
- No UPRISE source-level `Support` button unless owner specs later authorize it.
- Official outbound links, including donation links, are allowed when present in source profile data.
- No Source Dashboard controls inside the listener profile body. Source identity/account switching is the only approved listener-profile source affordance.
- No Release Deck, Print Shop, Registrar, source posting, analytics, billing, upgrade, growth, or source-admin panels inside listener profile.
- No public viewer source-owner/member controls.
- No fake Source Dashboard cards such as analytics, billing, growth, upgrade, posts, messages, or follower updates.
- No fourth Release Deck music slot; paid ad attachment is not an active song slot.
- No real upload/storage/transcoding/waveform implications beyond URL-only MVP ingest.
- No city-specific, source-specific, or fixture-only behavior unless explicitly marked test-only.
- Artist Profile song rows are local direct-listen rows unless a future implementation explicitly specifies and tests shared player mutation.

## Design Ownership Expectations

Design may own:

- Screen hierarchy and layout zones.
- State presentation and empty/loading/error copy placement.
- Visual hierarchy between public actions and owner/member tools.
- Responsive ordering and spacing guidance.
- Accessibility expectations for visible controls and copy.
- Visual direction and future Creative Studio asset needs.

Design must not own:

- API fields, data model changes, migrations, or auth rules.
- Source ownership validation logic or stale persisted source cleanup behavior.
- Registrar materialization, invite, sync, or GPS/Home Scene rules.
- Release Deck validation limits or server rejection behavior.
- Action grammar for Follow, Collect, Recommend, Blast, Support, or messaging.
- Runtime route creation, future source/admin domain format, or provider/storage/media infrastructure.
- Product decisions not settled by owner specs.

Dev Spec/runtime owns:

- Exact files/components changed.
- API/client/store contracts.
- Auth and active-source eligibility enforcement.
- Tests and regression locks.
- Error handling mechanics and validation implementation.
- Any behavior-level additions needed to make these UX states real.

## Product Decision / Owner-Spec Gaps

These are not design-authorized decisions:

- Whether source submitters eventually need a separate source-owner credential validation link before dashboard access. Current runtime uses signed-in submitter JWT plus GPS materialization for the submitter path.
- Future source/admin URL or separate domain format after the current monorepo `/source-dashboard` stand-in.
- Exact final visual treatment for dual-role viewers who are both public listeners and source owner/member; this plan requires separation, but final pattern should be reviewed with the spec package.
- Future source profile editing surface beyond the current `Source Profile` card linking to public Artist Profile.
- Future source posts/messages or one-way follower updates.
- Future media upload/storage/transcoding/waveform pipeline.
