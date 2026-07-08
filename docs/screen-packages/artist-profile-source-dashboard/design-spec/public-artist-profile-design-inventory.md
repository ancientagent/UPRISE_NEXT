# Public Artist Profile Design Inventory

Status: design inventory and visual handoff draft
Package: `artist-profile-source-dashboard`
Design lane: `uprise-design-ui`
Primary owner spec: `docs/specs/users/artist-profile-and-source-dashboard.md`
Last updated: 2026-07-05

## Purpose

This document captures founder design input for the listener-facing public
Artist Profile. It is a design inventory, not product truth. Durable behavior,
routes, actions, permissions, data contracts, and beta activation decisions stay
in owner specs under `docs/specs/**`.

The public Artist Profile is the listener-facing source page reached from songs,
posts, events, discovery, and other public surfaces. It must stay separate from
Source Dashboard, which is owner/member-facing tooling.

This file also captures the source-owner profile-management input that feeds the
public Artist Profile. Owner-only management controls, including whether a
member can edit music or edit the calendar for the selected source, must not
appear on the public listener-facing profile.

For this design model, source roles are `manager` and `member`. The registering
member is the default `manager` because their location/Home Scene anchors the
band/source to its Home Scene.

## Source Authority

Use these sources before turning this inventory into a Dev Spec, visual mockup,
or implementation slice:

1. `AGENTS.md`
2. `docs/PLATFORM_START_HERE.md`
3. `docs/AGENT_STRATEGY_AND_HANDOFF.md`
4. `docs/agent-briefs/CONTEXT_ROUTER.md`
5. `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
6. `docs/agent-briefs/UI_CURRENT.md`
7. `docs/specs/users/artist-profile-and-source-dashboard.md`
8. `docs/specs/core/signals-and-universal-actions.md`
9. `docs/specs/media/release-deck-and-eligibility.md`
10. `docs/specs/economy/print-shop-and-promotions.md`
11. `docs/solutions/MEDIA_STORAGE_DECISION_PACKET_R1.md`
12. `docs/solutions/MVP_EXPLICIT_DEFERRED_LIST_R1.md`

## Current Design Brief

Design a public local-stage page for a registered artist/band source. The page
should help a listener understand who the source is, listen to a small set of
current tracks, follow/share/collect/recommend where allowed, and find official
off-platform links, shows, members, and source identity context.

The page should not feel like Source Dashboard, a social profile, a streaming
clone, or a generic creator page.

## Beta-Ready Content Targets

These items fit the current Artist Profile direction if existing source data or
approved implementation paths can support them:

- Source identity: artist/band name, entity type, slug, Home Scene, follower
  count where already available, and public source status.
- Band bio: a concise profile/bio area for the source, displayed as public
  identity copy when present.
- Band members: source-provided artist/member headshot when available, display
  name, and what they play or contribute. Listener-account avatars are a
  separate identity surface and should not be used as the default public member
  image unless future privacy/routing contracts explicitly allow it.
  In the source-owner profile-management page, this same member area is also
  where the source manager decides whether a member can edit music and whether a
  member can edit the calendar for that selected source. Source members should
  still be able to view source activity and calendar/event context for that
  selected source.
- Direct-listen rows: up to three playable song rows with local `Play/Pause`,
  timeline, row-level `Collect`, and gated row-level `Recommend`.
- Optional song details: lyrics, about-this-song copy, album/release name, and
  song/album buy link may be displayed later if the Release Deck/media profile
  contract supports it.
- Official links: website, merch, music/albums, social media, source-provided
  contact path, and donation page links when present.
- Upcoming shows: source-owned events with date, venue/location, and event
  context where present.
- Public actions: source-level `Follow`, share/copy page link, and official
  outbound links.
- Owner/member bridge: only for authorized source members, visually separated
  links to Source Dashboard, Release Deck, Source Profile management,
  Events/Print Shop, or Registrar.

## Later / Requires Spec Activation

These ideas are valid product directions to preserve, but they should not be
implemented from this design inventory unless an owner spec or founder decision
activates the lane:

- Sponsors: display of local-business sponsors or sponsorship relationships.
  This could become a future source monetization lane, but it must not become
  fake analytics, billing, upgrade, paid placement, or promotion management in
  the beta profile without a spec.
- Photos: public artist/band photo gallery or show-photo section. This is not
  required for beta launch.
- Direct donation: in-app donation/payment support. For beta, donation should be
  an official outbound link when supplied by the source. Direct in-app donation
  requires payment, trust, moderation, tax, and support decisions.
- Past-show flyer display: a public archive of flyers for shows the source has
  played. Flyer creation/printing belongs to the source-side Print Shop path;
  public profile display should wait for an approved archive/display slice.
- Minted flyer collectibles: collectible or minted flyers for beta collection
  reference. This requires explicit economy/collection ownership before design
  can create actions, scarcity rules, minting behavior, ownership displays, or
  collectible CTAs.
- Sects/affiliations: if the product has a defined concept of sects, crews,
  scenes, collectives, or affiliations, the profile can reserve a public identity
  area for them after terminology and data ownership are confirmed.

## Screen Hierarchy

### 1. Public Source Header

Design need:

- Make it immediately clear this is a public Artist Profile, not the listener's
  profile and not Source Dashboard.
- Show source identity and local scene context before actions.

Visible hierarchy:

1. Surface label: `Artist Profile` or approved public-source wording.
2. Source name.
3. Entity type, slug, and Home Scene.
4. Band bio excerpt or full bio if short enough.
5. Public actions: `Follow`, share/copy.
6. Owner/member bridge only when authorized, separated from listener actions.

### 2. Direct Listening

Design need:

- Let listeners hear the source immediately without implying RADIYO wheel
  mutation or streaming-platform library behavior.
- Preserve the three-row cap.
- Make room for source-provided song details later without turning the row into
  an album-library or streaming-platform page.

Visible hierarchy:

1. `Listen Here` / `Songs / Releases` area.
2. Up to three direct-listen rows.
3. Row-level play state and timeline.
4. Optional detail disclosure for lyrics, about-this-song copy, album/release
   name, and official source-provided buy link, only after the owner specs
   define storage and public display.

Design constraints:

- Song-level buy links are outbound official links only. Do not create UPRISE
  checkout, payment, entitlement, or marketplace behavior from this public
  profile inventory.
- Do not add an external listen link field to song details. Listening should be
  native to the public Artist Profile song row.
- Lyrics require content ownership, moderation, and visibility rules before
  public display.
4. Row-level `Collect`.
5. Gated row-level `Recommend` only after the listener holds/collects the song.

### 3. Band Members

Design need:

- Show the actual lineup and roles so the page feels like a real local source.
- On the source-owner profile-management page, use this same member section to
  set whether each member can edit music or edit calendar/events for the
  selected source.
- Keep source-member baseline access clear: members can still see what is going
  on for the selected source. Editing music and editing calendar/events are
  source-specific manager-granted checkboxes.

Visible hierarchy:

Public Artist Profile display:

1. Source-provided artist/member headshot when available.
2. Member display name.
3. Instrument, role, or contribution, such as guitar, vocals, drums, producer,
   manager, or other source-approved wording.

Source-owner profile-management controls:

1. Member avatar/headshot and display name.
2. What they play / contribution field.
3. Baseline access summary: can view source activity and calendar/event context.
4. Manager-only, source-specific `Can edit music` control for the selected
   band/source.
5. Manager-only, source-specific `Can edit calendar` control for the selected
   band/source.
6. Invite/claim/sync state if available from Registrar/member lifecycle.
7. Save state for member detail, music-edit access, and calendar-edit access
   changes.

Design constraints:

- Do not turn public member headshots into listener-to-artist DM entry points.
- Do not substitute listener-account avatars as the default public member image
  unless future profile-link privacy/routing contracts explicitly allow it.
- Do not imply social follow graphs for individual members unless a spec
  explicitly adds them.
- Do not expose permission controls to public visitors.
- Do not apply music-edit access globally across all bands/sources. A member can
  be allowed to edit music for one source and not another.
- Do not apply calendar-edit access globally across all bands/sources. A member
  can be allowed to edit the calendar for one source and not another.
- Do not use lack of `Can edit music` or `Can edit calendar` to block ordinary
  source-member visibility.
- Do not invent a broad permission system beyond the concrete beta questions of
  whether a member can edit music and whether a member can edit calendar/events
  until
  `docs/specs/users/identity-roles-capabilities.md` or another owner spec defines
  it.

### 4. Official Links

Design need:

- Give listeners the source-owned external paths without creating new in-app
  commerce/payment behavior.

Visible hierarchy:

1. Official website.
2. Merch.
3. Music/albums.
4. Social media.
5. Contact path, when supplied by the source, so people can reach out to the
   band/source.
6. Donation page link, when supplied by the source.

Design constraints:

- External donation links are allowed when source-provided.
- A source-provided public contact path is allowed so people can reach out to
  the band/source.
- Do not create an in-app UPRISE `Support` or payment button from this inventory.
- Do not create in-app listener-to-artist DM, chat, private messaging, or inbox
  behavior from this inventory.

### 5. Upcoming Shows

Design need:

- Show where the band/source can be seen next.

Visible hierarchy:

1. Date/time.
2. Event/show title.
3. Venue or location.
4. Source-owned event marker when applicable.

Design constraints:

- Do not add ticketing, RSVP, billing, promotion, or sponsorship behavior unless
  a spec activates it.

### 6. Future Archive / Community Memory

Design need:

- Preserve a future place for photos, past-show flyers, sponsored-by context,
  affiliations, and collectible flyer ideas without placing beta CTAs on the
  page.

Beta treatment:

- Do not render empty placeholder modules.
- Do not show `Coming Soon`.
- Keep the layout modular so these sections can be added later.
- Do not place Print Shop flyer-printing controls on the public Artist Profile;
  keep flyer production in Source Dashboard / Print Shop.

## State Notes

- Signed-out listeners can read public identity, bio, official links, direct
  listen rows, members, and events.
- Signed-out listeners cannot Follow, Collect, Recommend, or operate source
  tools.
- Signed-in non-members can Follow, Play/Pause, Collect eligible row signals,
  and Recommend only after holding/collecting the song.
- Source owner/member viewers may see a separated owner/member bridge into
  source tools.
- Empty bio, official links, members, or shows should collapse or show restrained
  empty copy only where current UX already supports it.

## Visual Direction

Use the current `plot-wire-*` vocabulary and the approved dashboard direction as
the related family, but change the posture:

- Source Dashboard: operational control room.
- Public Artist Profile: public local stage.

For the public page, favor source identity, listening, members, and shows over
tooling. Keep it direct, local, and readable. Avoid album-library grids,
infinite social feeds, creator analytics panels, and platform-profile tropes.

## Asset Needs

Beta / near-term:

- Source avatar/profile image treatment.
- Public artist/member headshot treatment.
- Instrument/role labels.
- Owner-only member `Can edit music` and `Can edit calendar` controls for the
  source profile management page.
- Official-link icon treatment for website, merch, music, social, contact, and
  donation.
- Event/show row treatment.
- Song row playback states.

Later:

- Photo gallery treatment.
- Sponsor/local-business badge treatment.
- Past-show flyer archive treatment.
- Collectible/minted flyer visual treatment, only after collection/economy rules
  are owned by specs.
- Affiliation/sect/collective badge treatment, only after terminology is defined.

## Explicit Do-Not-Build / Do-Not-Design

- No in-app listener-to-artist DM, private contact form, inbox, or chat.
- Source-provided public contact paths may appear as official links when
  supported by profile data.
- No Artist Profile `Blast`.
- No engagement wheel.
- No source-level `Collect`, source-level `Support`, or in-app donation/payment
  button unless later specs authorize it.
- No analytics, billing, upgrade, growth, paid placement, or sponsorship sales
  module.
- No fake sponsor cards.
- No empty photos/flyers/sponsors sections for beta if no data exists.
- No minted flyer collection action until collection/economy rules are
  specified.
- No source-admin tools for public visitors.
- No Source Dashboard controls inside the public listener profile body.
- No public member music-edit or calendar-edit controls on the listener-facing Artist
  Profile.
- No platform-trope clone of Spotify, Instagram, TikTok, Facebook, Linktree, or
  generic creator SaaS.

## Founder / Product Questions To Resolve

1. What is the canonical term and data owner for `sects`: sects, scenes,
   affiliations, collectives, crews, or another UPRISE concept?
2. Should member `what they play` come from Registrar/member data, source profile
   editing, or a later public-profile content system?
3. What is the exact `Can edit music` contract: who can set it, which member
   states are eligible, and which Release Deck/song-detail operations does it
   grant?
4. What is the exact `Can edit calendar` contract: who can set it, which member
   states are eligible, and does it grant create, edit, remove, or submit-for
   review behavior?
5. Which official social/contact paths are allowed at beta, and are they generic
   outbound links or typed fields?
5. Should contact remain outbound-only for beta?
6. Should donation remain outbound-only for beta?
7. Are past-show flyers part of Print Shop/event history, source profile media,
   or a future collection/economy system?
8. If minted flyers enter beta, what is collectible ownership, scarcity,
   transfer, and display behavior?
