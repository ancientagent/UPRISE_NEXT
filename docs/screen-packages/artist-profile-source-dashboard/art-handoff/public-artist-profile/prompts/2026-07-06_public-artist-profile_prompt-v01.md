# Public Artist Profile Mockup Prompt v01

Status: prompt reference only
Date: 2026-07-06
Package: `artist-profile-source-dashboard`
Screen/section: `public-artist-profile`
Target use: generate a future Public Artist Profile visual direction only if
visual generation is explicitly reopened.

Do not run this prompt automatically. Do not generate new images from this
handoff without user direction. Do not store unapproved mockups in the repo.

## Source Docs Referenced

- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`
- `docs/agent-briefs/EVENTS_ARCHIVE.md`
- `docs/screen-packages/artist-profile-source-dashboard/design-spec/public-artist-profile-design-inventory.md`
- `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md`
- `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md`
- `docs/specs/users/artist-profile-and-source-dashboard.md`
- `docs/specs/core/signals-and-universal-actions.md`
- `docs/specs/media/release-deck-and-eligibility.md`
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
- `docs/solutions/MVP_EXPLICIT_DEFERRED_LIST_R1.md`

## Prompt

Create two coordinated UI artboards for the UPRISE Public Artist Profile, with
no browser chrome and no device frame:

1. desktop/web at `1440 x 1024`;
2. mobile at `390 x 844`.

This is the listener-facing artist/band/source page reached from a song, post,
event, discovery path, or artist link. It is not Source Dashboard, not listener
profile, not RADIYO, and not source admin tooling.

Primary viewer state for both artboards: signed-in listener, not a source
owner/member. Do not show source-tool controls in the primary public-listener
state. If an owner/member bridge is represented, show it only as a small
clearly separated authorized-state inset or secondary variant, not as part of
the normal public listener page.

Use the current UPRISE wireframe/DIY family, but do not make this page look
like a Registrar file, official document, report paper, folder tab system, or
source-management worksheet. This is a public listener-side artist page, not a
source lifecycle artifact.

Visual feel: classic independent DIY, underground network, local signal,
hack-the-system energy. Use firm black linework, xeroxy texture, compact rows,
practical utility controls, restrained lime signal accents, and the existing
`plot-wire-*` UI vocabulary. The page should feel like an independent public
network node for a real local source, not a paper document, streaming-service
clone, generic social profile, Linktree page, or creator analytics dashboard.

Primary layout:

1. Public masthead:
   - `UPRISE`
   - `ARTIST PROFILE`
   - artist/band image and name
   - entity type and slug
   - Home Scene as `city, state - music community`
   - concise public bio
   - follower count as supporting context only
   - public actions: `Follow`, `Share`
   - official outbound links, including contact and donation if present
2. Direct-listen section:
   - up to three playable song rows only
   - each row shows artwork, song title, source name, duration, release/album
     context if available, local play/pause, timeline, `Collect`, and gated
     `Recommend`
   - do not show the engagement wheel
   - do not show `Blast`
   - show a clear track-mode confirmation state for leaving `RADIYO` before a
     listener starts direct artist-profile playback
3. Member strip:
   - source-provided artist/member headshots when available, names, and what
     they play/contribute
   - do not substitute listener-account avatars as the default public member
     image
   - no public permission controls
   - no member DM or private contact affordance
4. Official links:
   - website, merch, albums/music, social, contact, donation when configured
   - links are outbound official paths, not UPRISE checkout/payment/DM
5. Upcoming shows:
   - source-owned event cards/rows with date, event title, venue/location, and
     source-owned marker where applicable
   - if `Add` appears, it is only an event/calendar row action
   - never use `Add` for songs, source/profile save, follow, collect, or generic
     profile behavior
   - do not show listener event authoring or Print Shop controls
6. Authorized owner/member bridge:
   - primary public-listener artboards should not show this bridge
   - if shown, use a small separated authorized-state inset or secondary
     variant when the viewer is an authorized source owner/member
   - link to source tools without making them public controls

Mobile continuation should target `390 x 844` using the same hierarchy, not a
new product behavior. Collapse order:

1. masthead and public actions
2. optional owner/member bridge only in a separated authorized-state inset or
   variant
3. direct-listen rows
4. track-mode confirmation state when needed
5. official links
6. members
7. source-owned events

## Required States To Represent Or Reserve

- public signed-out visitor
- signed-in listener
- source owner/member viewer, reserved as separated inset/variant only
- empty song rows
- loading profile
- profile load error
- limited permission for Follow/Collect/Recommend
- ready with three song rows
- direct-listen confirmation before switching out of `RADIYO`

## Negative Constraints

- No Source Dashboard controls for public viewers.
- No Release Deck, Print Shop, Registrar, analytics, billing, growth, upgrade,
  or source admin panels in the public page body.
- No listener-to-artist DM, inbox, chat, private contact form, or message
  button.
- No engagement wheel.
- No Artist Profile `Blast`.
- No source-level `Collect`, source-level `Support`, or in-app donation/payment
  action.
- No `Add` for songs, source/profile save, follow, collect, or generic profile
  behavior. `Add` is event/calendar-only.
- No full catalogue/library grid beyond the three direct-listen rows.
- No fake sponsor cards, photo gallery, flyer archive, minted flyer CTA, or
  placeholder modules without data/spec activation.
- No `Coming Soon`, `Upgrade`, `Join`, `Subscribe`, or placeholder CTAs.
- No Spotify, Instagram, TikTok, Facebook, Linktree, or generic creator-SaaS
  trope drift.

## Do Not Build From This Prompt

This prompt is visual handoff material only. It does not authorize route
changes, data contracts, auth behavior, source permission behavior, media upload,
event publication, follower-calendar delivery, in-app donation, messaging,
paid features, sponsor modules, or expanded profile/gallery/archive runtime.
