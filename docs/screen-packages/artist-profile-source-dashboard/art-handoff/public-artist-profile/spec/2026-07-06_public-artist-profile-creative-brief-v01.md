# Public Artist Profile Creative Brief v01

Status: active creative handoff
Date: 2026-07-06
Package: `artist-profile-source-dashboard`
Screen/section: `public-artist-profile`
Primary Design Spec:
`docs/screen-packages/artist-profile-source-dashboard/design-spec/public-artist-profile-design-inventory.md`
Supporting Design Spec:
`docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md`
Supporting Dev Spec:
`docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md`
Owner Spec:
`docs/specs/users/artist-profile-and-source-dashboard.md`

## Purpose

Define the Public Artist Profile visual hierarchy, responsive behavior, states,
interaction notes, and asset needs for a future visual mockup or implementation
slice.

This brief is visual/design guidance only. It does not authorize runtime
behavior, data contracts, auth changes, new routes, paid features, source
management controls, messaging, or new public actions.

## Product Design Skill Constraints

Product Design guidance read for this handoff:

- `product-design/skills/index/SKILL.md`
- `product-design/skills/get-context/SKILL.md`
- `product-design/skills/user-context/SKILL.md`
- `product-design/references/critical-overrides.md`

Relevant constraints to preserve:

- Use the existing product context and visual system first.
- Do not invent a new design system.
- Do not build or generate UI without a confirmed brief.
- A brief is not a visual target; visual ideation still needs selected mockups.
- If visual ideation is reopened, generate exactly three independent image
  options after brief confirmation, then wait for user selection.
- Do not fake assets with ASCII, placeholder boxes, handcrafted SVGs, or
  approximate code drawings.
- Generated images stay outside the repo unless the user approves a specific
  image as a durable repo asset.

Saved Product Design user context was checked on 2026-07-06 and no saved
`user-context.md` existed. Current repo docs and founder packet are the
grounding material.

## Source Evidence

- `docs/screen-packages/artist-profile-source-dashboard/design-spec/public-artist-profile-design-inventory.md`
- `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md`
- `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md`
- `docs/specs/users/artist-profile-and-source-dashboard.md`
- `docs/specs/core/signals-and-universal-actions.md`
- `docs/specs/media/release-deck-and-eligibility.md`
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
- `docs/solutions/MVP_EXPLICIT_DEFERRED_LIST_R1.md`
- `apps/web/src/app/artist-bands/[id]/page.tsx`

## Recommended First Vertical Design Slice

Start with the **public masthead plus three direct-listen song rows**.

Reason:

- It is the highest-risk visual boundary on the public page.
- It carries source identity, Home Scene context, Follow/share, playable songs,
  row-level `Collect`, gated `Recommend`, and the no-wheel/no-Blast rule.
- It gives a future developer enough layout clarity to harden the route without
  prematurely designing photos, sponsors, flyer archives, or source tools.

The first slice should include desktop and mobile guidance for:

- masthead identity and public actions;
- direct-listen row anatomy;
- direct-listen confirmation before leaving `RADIYO`;
- signed-out, signed-in listener, and owner/member visibility differences.

## Visual Direction

Use the current UPRISE wireframe/DIY family, but do not carry over the Source
Dashboard or Registrar file/document metaphor. The public Artist Profile is not
a source lifecycle artifact, report paper, folder tab system, or management
worksheet.

Design qualities:

- classic independent DIY and underground network posture;
- "hack the system" local signal energy without becoming cyberpunk chrome;
- warm off-white or lightly distressed public page surface;
- black/charcoal linework, firm section rules, and xeroxy texture;
- local flyer/zine/show-table influence without pretending the UI is literal
  paper;
- compact direct-listen rows;
- restrained lime signal accent for active/confirmed states;
- practical source identity, not celebrity/social profile posture.

Avoid:

- Source Dashboard report-file density as the dominant public feeling;
- Registrar-style files, official document stamps, folder tabs, paper cosplay,
  or public-profile-as-form metaphors;
- generic profile hero with social metrics;
- album-library grids;
- streaming platform rows;
- influencer/social modules;
- creator analytics or commerce dashboard patterns.

## Public Artist Profile Screen Hierarchy

### 1. Public Masthead

Purpose: make the viewer understand the source before acting.

Desktop hierarchy:

1. Surface label: `Artist Profile`.
2. Source image/avatar.
3. Source name.
4. Entity type and slug.
5. Home Scene as `city, state - music community`.
6. Bio/profile copy.
7. Follower count as supporting metadata, not clout hierarchy.
8. Public actions: `Follow`, `Share`.
9. Official outbound links preview if space allows.
10. Owner/member bridge only when authorized, visually separated from public
    actions.

Mobile hierarchy:

1. Source image and name.
2. Home Scene and entity/slug.
3. Bio excerpt.
4. `Follow` and `Share`.
5. Official links as compact chips/list below the masthead.
6. Owner/member bridge after public actions, if authorized.

Do not place source-dashboard tools in the main public masthead for normal
visitors.

### 2. Direct-Listen Rows

Purpose: let listeners hear the source directly without implying RADIYO wheel or
full catalogue behavior.

Desktop row anatomy:

- slot/artwork thumbnail;
- song title;
- source name;
- duration;
- album/release context if supported;
- local `Play` / `Pause`;
- timeline/progress;
- `Collect`;
- gated `Recommend`;
- selected/playing state;
- collected/recommended state.

Mobile row anatomy:

- artwork/title/duration on the first line;
- play/pause and timeline immediately below;
- `Collect` and gated `Recommend` as full-width or comfortably tappable row
  controls;
- no tiny inline links for primary actions.

Rules:

- Render at most three playable rows.
- If a feed/discovery handoff selects a track outside the first three, that
  selected track may appear first while preserving the three-row cap.
- Do not show a full catalogue, album grid, queue, shuffle, repeat, waveform, or
  streaming-service library affordance.

### 3. Shared-Player / Track-Mode Confirmation

The design must account for the case where starting artist-profile playback
changes the listener out of `RADIYO`.

Recommended presentation:

- Use an inline confirmation panel attached to the direct-listen section rather
  than a heavy modal for the first visual pass.
- Copy should explain that the listener is switching to direct artist-profile
  listening.
- Provide two clear actions:
  - continue/start this track;
  - stay in `RADIYO`.
- After confirmation, the song row becomes the active local track row.

Design note:

- Current runtime copy says a song can pause `RADIYO`. This handoff should keep
  the product intent legible without overclaiming unimplemented shared-player
  mutation. Implementation must follow the owner spec and tested runtime bridge.

### 4. Official Links

Purpose: expose source-controlled external paths without creating UPRISE
commerce, messaging, or payment behavior.

Allowed link types when source data supplies them:

- website;
- merch;
- music/albums;
- social media;
- public contact path;
- donation page.

Design:

- Use typed link rows or compact icon+label chips.
- Treat donation as an official outbound link, not in-app `Support`.
- Do not create checkout, entitlement, payment, purchase, invoice, DM, or
  support-ticket behavior.

### 5. Members

Purpose: make the artist/band feel like a real local source.

Public display:

- source-provided artist/member headshot when available;
- display name;
- instrument/role/contribution.

Do not show:

- member permission controls;
- unresolved emails;
- private contact;
- DM;
- social follow graph;
- broad people search.

Listener-account avatars are a separate identity surface. Do not substitute a
member's listener avatar as the default public Artist Profile member image
unless future profile-link privacy and routing contracts explicitly allow it.
Member headshot/avatar links to listener accounts remain privacy/routing-pending.

### 6. Source-Owned Events

Purpose: show where the source can be seen next.

Row anatomy:

- date/time;
- event/show title;
- venue or location;
- source-owned marker where applicable.
- `Add` may appear only as an event/calendar action if an approved event
  surface supports it.

Do not show:

- `Add` for songs, source/profile save, follow, collect, or generic profile
  behavior;
- listener event creation;
- Print Shop controls;
- ticketing;
- RSVP;
- paid promotion;
- sponsorship sales;
- unpublished/draft source calendar items.

### 7. Owner/Member Bridge

Purpose: let authorized source members reach source tools without making the
public profile feel like Source Dashboard.

Design:

- show only when the signed-in viewer manages the source;
- place after or beside public actions with clear utility language;
- visually separate from public listener controls;
- likely affordances: Source Dashboard, Release Deck, Print Shop, Registrar.

Rules:

- Public visitors must not see this bridge.
- The bridge must not turn into embedded source tools.
- The bridge must not expose member permission editing on the public page.

## Key States

### Public Signed-Out Visitor

- Can read source identity, bio, official links, direct-listen rows, members,
  and published events.
- Cannot Follow, Collect, Recommend, or access source tools.
- Gated controls should explain sign-in requirement where visible.

### Signed-In Listener

- Can Follow.
- Can Share.
- Can Play/Pause direct-listen rows.
- Can Collect eligible row signals.
- Can Recommend only after genuinely holding/collecting the song.
- Cannot see source tools unless they manage the source.

### Source Owner/Member Viewer

- Sees the public profile exactly as a public page first.
- Also sees a clearly separated owner/member bridge to source tools.
- Must not see source admin controls mixed into song rows, events, or public
  profile content.

### Empty

- No songs: show restrained copy such as `No released songs are available yet.`
- No official links: show restrained copy only if the section remains visible.
- No members: avoid social absence framing.
- No events: show `No events are published yet.` only if the events section is
  present.

Do not render empty sponsor, photos, flyers, gallery, or archive modules for
beta.

### Loading

- Use a compact profile skeleton or single loading state.
- Preserve masthead/listen/supporting-section order so layout does not jump
  dramatically.

### Error

- Profile not found or load failure.
- Audio start failure.
- Follow/Collect/Recommend failure.
- Recommend failure because listener does not hold the song.

### Limited Permission

- Signed-out action gates.
- Missing signal ID for row-level actions.
- Recommend disabled until collected.
- Source bridge absent for non-members.

### Ready

- Masthead, public actions, three or fewer song rows, official links, members,
  and events render in the order above.

## Desktop Layout Guidance: 1440 x 1024

Use one primary public surface rather than a card floating on a decorative
background. The surface can feel handmade, underground, and networked, but it
should still read as a usable product page rather than a document scan.

Recommended structure:

1. Top public identity band.
2. Masthead block with source image/name/bio/actions.
3. Main two-column body:
   - left/wider column: direct-listen rows first;
   - right/narrower column: official links, members, events.
4. Owner/member bridge as separated utility strip or panel, visible only when
   authorized.

Desktop emphasis:

- direct listening should be visually heavier than official links;
- official links should be easy to scan but not primary over songs;
- events and members support source trust/context without becoming social feed.

## Mobile Layout Guidance: 390 x 844

Use a single-column order:

1. source image/name/Home Scene;
2. bio excerpt;
3. `Follow` and `Share`;
4. owner/member bridge only if authorized, visually separated from public
   listener actions;
5. direct-listen rows;
6. track-mode confirmation where needed;
7. official links;
8. members;
9. events.

Mobile constraints:

- keep tap targets comfortable;
- avoid two-column song rows;
- keep timeline controls usable;
- do not rely on hover-only member information;
- avoid sticky source-tool controls on public visitor state.

## Accessibility Notes

- Do not communicate play/selected/collected/recommended state by color only.
- Every timeline needs a clear accessible label.
- Buttons and links need distinct labels: `Follow`, `Share`, `Collect`,
  `Recommend`, `Play`, `Pause`.
- Disabled/gated actions should explain why when practical.
- External official links should be visibly distinct from in-app actions.
- Member headshots require text labels for display name and role/instrument.
- Confirmation state needs focus order and keyboard access if implemented.

## Asset Needs

Near-term:

- source avatar/profile image treatment;
- song/release artwork thumbnail treatment;
- artist/member headshot treatment;
- official-link icon treatment for website, merch, music, social, contact,
  donation;
- direct-listen row states: idle, selected, playing, collected, recommended,
  gated;
- event row treatment.

Later only after specs activate:

- photo gallery treatment;
- sponsor/local-business badge treatment;
- past-show flyer archive treatment;
- minted flyer/collectible display treatment;
- sect/affiliation badge treatment;
- member headshot/avatar links to listener accounts.

## Explicit Do Not Build / Do Not Design

- No Source Dashboard redesign in this pass.
- No source admin tools for public visitors.
- No Release Deck, Print Shop, Registrar, analytics, billing, upgrade, growth,
  source post, or message controls inside the public profile body.
- No listener-to-artist DM, chat, inbox, private contact form, or message
  button.
- No Artist Profile `Blast`.
- No engagement wheel.
- No source-level `Collect`, source-level `Blast`, or UPRISE source-level
  `Support`.
- No `Add` for songs, source/profile save, follow, collect, or generic profile
  behavior. `Add` is event/calendar-only.
- No in-app donation/payment flow; donation is outbound only when supplied by
  source profile data.
- No full music catalogue or streaming library grid.
- No event authoring or Print Shop controls for listeners.
- No sponsor modules, photo modules, flyer archive, minted flyer CTA, or
  placeholder modules unless specs activate them.
- No `Coming Soon`, `Upgrade`, `Join`, `Subscribe`, or placeholder CTAs.
- No Spotify, Instagram, TikTok, Facebook, Linktree, or generic creator-SaaS
  patterns.

## Founder / Product Questions Blocking Design Confidence

1. Confirmation placement: should leaving `RADIYO` for direct artist-profile
   listening use inline confirmation or modal confirmation?
2. Member role source: should public `what they play` come from Registrar member
   data, source profile editing, or a later public-profile content system?
3. Member headshot links: when registered members resolve to UPRISE users, are
   public headshot/avatar links to listener accounts allowed, and under what
   privacy rules?
4. Affiliation wording: what is the canonical public term for sects,
   affiliations, crews, collectives, or related source identity markers?
5. Official contact paths: which contact/social link types are allowed as typed
   beta fields, and should contact remain outbound-only?
6. Song details: when can lyrics, about-this-song copy, album/release name, and
   buy links become public display fields?
7. Event display: should the public profile show only future published events,
   or also recent published source-owned events?

## Next Step

Use this brief to generate visual options only after the user asks to generate
mockups. If mockups are generated, produce exactly three options and wait for the
user to select one before copying any asset into the repo.
