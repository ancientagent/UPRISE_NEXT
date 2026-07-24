# Source Dashboard Management Shell Layout Brief

Status: Product Design layout brief for founder review
Package: `artist-profile-source-dashboard`
Design lane: `uprise-design-ui`
Primary owner spec: `docs/specs/users/artist-profile-and-source-dashboard.md`
Last updated: 2026-07-06

## Purpose

This brief captures the current founder-directed Source Dashboard layout target
for the next Product Design mockup pass.

It is not a product spec and does not create runtime authority. Durable rules,
API contracts, auth behavior, permissions, payment behavior, media storage, and
route ownership stay in `docs/specs/**` and current runtime evidence.

The goal is to make one focused artist/source-facing management shell that can
later be turned into a Dev Spec without duplicate panels, fake modules, or
listener-profile drift.

## Mockup Discipline

The mockup may preserve the strong file/folder look from the preferred early
Registrar/source-dashboard visual direction, but it must still protect the next
development agent from drift.

The design draft does not need to solve every product/backend question. It does
need to make every visible idea easy to classify:

1. `Build now`: already supported by current specs/runtime or safe as visual
   organization.
2. `Design only`: useful visual direction, but needs owner-spec/API/runtime
   work before implementation.
3. `Future`: valid direction to preserve, but not part of the beta/MVP slice.
4. `Do not build`: visual trope or feature that should be removed before Dev
   Spec.

Mockups should avoid filling space with convincing-but-unauthorized controls.
If a control looks clickable, the handoff must say whether it is current,
design-only, future, or prohibited.

Use the mockup to make the source-file concept understandable. Use the written
handoff to prevent a development agent from implementing speculative behavior
such as upload/storage, payment, private messaging, fake analytics, or generic
file-management features.

## Current Product Design Brief

Design the source-owner/member-facing dashboard reached after source login or
source selection.

The design should feel like the operating surface for a registered band/source,
not the public Artist Profile and not the listener profile. The approved visual
family is the current `plot-wire-*` style: grounded, direct, local, and
practical.

Selected visual direction:

- Use the white official report-paper direction from the latest preferred
  mockup.
- Push the document treatment slightly more toward xeroxed official paperwork:
  heavier ink rules, stronger section borders, and subtle print-paper texture
  are preferred over delicate SaaS card styling.
- Use a top command line/header with `UPRISE`, `SOURCE DASHBOARD`, source
  selector, and listener-account exit.
- Keep the band/source image and title compact so the report content dominates.
- Do not use a heavy left column, left-side support area, sidebar, folder edge,
  folder tabs, segmented tab row, or source chips that read like tabs.
- Keep source switching in a compact top-line selector or report-header control
  attached to the signed-in user.

The first mockup should focus on the source-management shell and the first
three section targets:

1. `Profile`
2. `Releases`
3. `Calendar`

Other sections can remain visible only if they are necessary for navigation
context and do not compete with the active section. `Metrics` should not be a
primary navigation section in this pass; release metrics belong below the Release
Deck inside `Releases`, potentially as an expandable dropdown.

## Shell Layout

### Desktop Structure

Use one white report-paper management sheet rather than a conventional admin
sidebar or folder UI.

Top command line:

1. `UPRISE` wordmark.
2. `SOURCE DASHBOARD` label.
3. Signed-in account/user context with current selected-source position, such as
   `Baris · Manager`.
4. Compact current-source selector.
5. `Exit to Listener Account`.

Model:

- The signed-in user holds access to source positions.
- The selected source profile holds the visible context.
- Switching the selected band/source/promoter changes the active file.
- The account role/title beside the signed-in account changes when the selected
  source changes, based on that user's position in the newly selected source
  (`Manager`, `Member`, `Promoter`, or later approved role names).
- Moving through report sections changes the area of that same selected source
  file.
- The interaction should feel like quickly filling out and managing a file, not
  moving from screen to screen.
- In the manager case, the user should feel like they are managing the band's
  source file: profile details, releases, calendar/events, members, and source
  permissions are all organized under that band's file.
- In the member case, the same file metaphor should still hold, but visible
  controls must respect that member's source-specific permissions.
- Paid capabilities such as on-air ad clips and later ad/promotion purchases
  need a payment account concept attached to the source/user operating model,
  but payment setup and purchase controls are design-only until monetization
  owner specs activate billing, payment provider, entitlement, and refund/error
  contracts.
- The report/file metaphor is a product interaction metaphor, not permission to
  create a generic filesystem, folder tree, bulk media library, drag-and-drop
  file manager, folder tabs, or tabbed navigation.

Compact source report masthead:

1. Source image/avatar.
2. Artist/band/source name.
3. Home Scene/source-origin context directly under the band/source name.
4. Compact source/profile snapshot next to the source image/title.
5. Member avatar strip on the far right.
6. Public profile preview/open path where relevant.
7. Optional lower-right rubber-ink stamp if it strengthens the official
   source-file metaphor.

The source image and name should remain visible in the report header, but they
should be smaller than a profile hero so the management report stays primary.

Masthead constraints:

- Remove the boxed `Owner` / `Manager` badge from the preferred report-paper
  mockup.
- Remove `Band source` or equivalent source-type copy from directly under the
  band/source name in this report-paper direction.
- Do not show `GPS verified` or checkmark status as masthead decoration.
- Do not duplicate `Source Account: The North Line` inside the masthead when the
  top command line already has the source selector.
- Move `Home Scene: Austin, TX · Indie Rock` directly below the band/source
  title.
- Fit the source/profile snapshot into the same masthead section beside the
  artist photo/title instead of rendering it as a lower `Profile Check` block.
- Reserve the far right of the masthead for band-member avatars.
- If an official-looking stamp is used, make it feel like an old rubber-ink
  official document mark near the lower-right of the report sheet, not a
  masthead badge or active status chip. Prefer neutral file language such as
  `SOURCE FILE` or `UPRISE SOURCE RECORD`. Do not use `Verified`, `Approved`,
  `Policy Clear`, paid-status language, or GPS/source validation copy unless a
  real owner-spec/runtime state exists.
- Stamp rendering should be low-emphasis and imperfect enough to read as ink on
  paper, while still remaining legible and not making the UI look dirty or
  damaged.

Report-paper visual treatment:

- Use heavier outer sheet borders and section rules than a typical SaaS card.
- Prefer crisp black/charcoal ink lines with slight photocopy/Xerox character
  over soft shadows or airy card separation.
- Keep row separators and table rules strong enough that the sheet reads like an
  official working form.
- Do not add grunge, torn-paper effects, fake stains, or distressed decoration
  that makes the interface harder to read.

Profile snapshot content in masthead:

1. Follower count.
2. Registrar-held Artist/Band Sect memberships or unset state; presentation remains pending.
3. Bio/status summary.
4. Official links/contact/donation readiness summary where current contracts
   support it.

Profile snapshot data organization can be refined during Dev Spec/prototype
work. The visual priority is that the profile snapshot lives in the compact
masthead area beside the artist image/title, not as a separate lower `Profile
Check` report section.

Member avatar strip:

- The member avatar area should behave like an invisible responsive container
  that resizes avatar profiles as member count changes.
- For the mockup, show four belly-up avatar profiles with names.
- Avatars can serve as links and may expose hover info later.
- Resolved member avatars may later link to the member's listener account or
  profile after identity routing and privacy rules are defined.
- Use the visual direction from
  `art/avatar-system/references/legacy-avatar-boards/0_3 (1).jpeg` for the
  four displayed member avatars.
- A Dev Spec should define how avatar sizing, truncation, wrapping, hover info,
  link targets, and accessible labels behave across different member counts.

Report section layout:

1. `Releases` / Release Deck as the primary first section.
2. `Release Metrics` as a compact expandable report row below Release Deck.
3. `Calendar / Print Shop` as an actual calendar report section.
4. `Registrar` only as a subdued lifecycle stamp, utility link, or report
   record if it stays visible.

Report interaction model:

- `Profile`, `Releases`, and `Calendar` are report sections on one management
  sheet, not navigation tabs.
- The source masthead and source selector remain in the report header while the
  operator works down the sheet.
- Section changes should preserve the feeling of filling out one report/source
  file, not navigating to a different screen.
- Use form-like section structure, concise inputs, compact rows, and clear save
  states.
- Avoid large page-transition layouts, duplicate headers, or route-like
  reorientation in the mockup.

Entry behavior:

- First-time entry for a newly available source should land on `Releases` /
  Release Deck so the source can get music into the player-testing path.
- After initial setup, returning to a source file may restore the last selected
  report section.
- If no remembered section exists after initial setup, `Profile` is the likely
  check-in/default section because it lets the operator review the source file.
- Remembering the last selected section is a runtime state decision and should be
  specified before implementation.

Main area:

1. Active section header.
2. Current source context, only once.
3. Section-specific content.
4. Section-specific state and validation copy.

Do not put the same tools in a sidebar and a card stack. Do not use left-side
support content; the report should read full-width from top to bottom.

### Mobile Structure

Mobile should collapse into this order:

1. Current source summary.
2. Source switcher.
3. Release Deck.
4. Release Metrics.
5. Profile snapshot in the compact masthead.
6. Calendar / Print Shop.
7. Listener-account return path.

Do not rely on tiny inline text links for source switching.

## Profile Section

The `Profile` section is source-owner/member-facing management for the public
Artist Profile content. It is not the public profile itself.

Visible content to design:

1. Public profile preview/open path.
2. Follower count.
3. Artist/Band Sect memberships, if the presentation contract is available.
4. Band/source bio.
5. Band/source members with avatars and what they play or contribute.
6. Member role/access summary.
7. Manager-only `Can edit music` control for each member, scoped to the
   selected source.
8. Manager-only `Can edit calendar` control for each member, scoped to the
   selected source.
9. Official links:
   - website
   - merch
   - social media
   - music/albums
   - contact path
   - donation link
10. Public-facing source identity fields where existing contracts support them.
11. Manager-facing add/find member by email/search entry, marked design-only
    until the member lookup/invite contract is defined.

Profile editing model:

- The registering member is the default `manager` for the source because they
  registered/materialized the band/source and their Home Scene anchors the
  source.
- `manager` can edit and save source profile details by default.
- Additional members can be granted music edit access through a source-specific
  `Can edit music` checkbox wherever the member is added or managed.
- A manager may add or look up band/source members from this source-facing
  Profile/bio screen. The likely model is email/search entry; if the person is
  already registered on UPRISE, the member row/avatar can resolve to their
  platform identity.
- Resolved member avatars may later link to those members' listener accounts or
  profiles, but only after identity routing and privacy rules are defined.
- `Can edit music` controls whether the member can work in the selected source's
  Release Deck/music detail area, including loading/submitting/editing songs if
  the owner specs support those operations.
- `Can edit calendar` controls whether the member can add or edit events for the
  selected source.
- Music permission controls belong in source-facing Profile/member management,
  not on the public listener-facing Artist Profile.

Design constraints:

- Do not expose member permission controls on the public listener-facing Artist
  Profile.
- Do not create listener-to-artist DM, inbox, chat, or private message behavior
  from this section.
- If a basic contact path appears, treat it as a source-provided official link
  unless a later spec adds in-app contact.
- Do not expose unresolved member email addresses publicly.
- Do not link member avatars to listener accounts until privacy/routing behavior
  is defined by the owner specs.
- Do not invent a broad permission system beyond the concrete `Can edit music`
  and `Can edit calendar` source-specific checkboxes unless an owner spec
  defines it.
- Artist/Band Sect membership data is Registrar-owned; source-dashboard presentation remains deferred.

## Releases Section

The `Releases` section is the primary first-time landing section after source
login/source availability. It contains Release Deck and immediate per-release
feedback.

### Release Deck Rows

Visible hierarchy:

1. Three music rows/slots.
2. Each row represents one active music slot.
3. Each row should show:
   - slot number `1`, `2`, or `3`
   - album art
   - song title
   - duration
   - release date
   - source-owned status
   - row status/policy validation
   - clear remove affordance once the remove contract exists
4. Open row state for an empty music slot.
5. Active-source and Home Scene context.
6. Caps:
   - `3` active music slots
   - `6` minutes per song
   - `15` minutes active total per source

Founder model to preserve:

- The artist/source loads a song into the row with album art and release date.
- The founder sees song upload/storage as personal storage behavior.

Implementation-facing row copy/behavior:

- Row action label should be `Load`, not `View`, when the action loads the
  release/song context.
- Pressing `Load` should open a focused row detail/edit area for that selected
  song/slot inside the Release Deck flow. It should not navigate to a generic
  media manager or detached song-admin app.
- Use `Release date`, not `Date added`, because rows may include songs waiting
  to be released.
- The row status should be a real status area. For source-owned tracks that pass
  song/policy eligibility, use a green check/status marker to indicate the song
  is valid.
- Do not place a large green `Ready` chip or green ready callout beside the
  `Release Deck` section title in the report-paper direction. Readiness belongs
  in row/status treatment and concise section copy.
- If a single is already out on `RADIYO`, highlight the row. Different highlight
  colors should represent the tier the song is currently on.
- Tier-highlight colors require an owner-spec/data contract before runtime
  implementation. The mockup may show the pattern, but a Dev Spec must define
  tier names, color tokens, contrast requirements, and state precedence.

Current implementation boundary:

- Current MVP remains hosted `http(s)` URL-only until the media storage/upload
  owner spec activates personal storage, upload, transcoding, waveform, worker,
  and provider behavior.
- A visual mockup may carry the founder mental model, but any Dev Spec must stop
  before implementing real upload/storage unless the owner contracts are updated.

### Add Or Edit Release Entry

The UI should not sprawl into a generic media manager. Use a focused row-entry
pattern:

1. Select an empty row or edit-open state.
2. Add title.
3. Add release date.
4. Add duration.
5. Add album art.
6. Add current MVP hosted audio URL, or future personal-storage selector after
   media storage is activated.
7. Add optional song detail fields:
   - lyrics
   - about this song / release note
   - album or release name
   - official buy link for that song or album
8. Save/submit state.

Song detail field boundaries:

- Song details should appear from the selected row `Load` state, not as a
  separate top-level page.
- Song-level `buy` links are source-provided outbound links only. They do not
  create UPRISE checkout, payment, cart, entitlement, or commerce behavior.
- Do not add an external `listen` link field here. Listening should be native to
  the public Artist Profile song row.
- Lyrics and song notes need content ownership, moderation, visibility, and
  public-display rules before implementation.
- Album/release naming and song-level outbound links need media/profile data
  contract ownership before implementation.

Runtime blockers before implementation:

- Release date scheduling needs a media owner-spec/API/runtime contract.
- Remove needs a history-safe media owner-spec/API/runtime contract.
- Personal storage/upload needs media-storage activation.
- Song detail fields need media/profile owner-spec/API/runtime contracts before
  they can be saved or shown publicly.

### Basic Release Metrics

Show basic per-release metrics below the Release Deck rows. The preferred
presentation is a compact expandable/dropdown metrics section inside
`Releases`, not a top-level dashboard section.

Default visual treatment:

1. Summary row beneath the Release Deck, such as `Release Metrics`.
2. The row should behave as a song metrics lookup/selector, not a `current
   song` label.
3. The operator should be able to choose any eligible uploaded song for the
   selected source, including songs currently loaded in Release Deck and songs
   uploaded previously.
4. Use a dropdown selector for song choice because the eligible song list may
   include more than the three active Release Deck rows.
5. Use a separate dropdown/accordion or chevron affordance to expand deeper
   metric detail and graph data for the selected lookup song.
6. When collapsed, show only the most useful rollup for the selected lookup
   song.
7. When expanded, show row-level metrics and later graph views for the selected
   lookup song.

Candidate visible metrics:

1. Listens / plays.
2. Upvotes.
3. Collects / adds.
4. Recommends.
5. Release readiness or slot state.

Terminology note:

- Founder wording included `adds`.
- Current UPRISE action grammar uses `Collect` rather than old `Add` wording for
  public song save behavior. A Dev Spec should resolve whether source-facing
  metrics label this as `Collects`, `Adds`, or another approved term.

Design constraints:

- Metrics are descriptive only.
- The metrics lookup needs a data contract before implementation because it
  spans current Release Deck songs and previously uploaded songs.
- Do not let metrics affect Fair Play, rotation, ranking, voting, propagation,
  Registrar authority, Home Scene authority, or governance.
- Do not add comparative leaderboards, predictive scoring, business advice,
  growth coaching, or fake analytics.
- Graphs in the expanded metrics area are valid later design direction, but
  should remain a later metrics-detail item until the data contract is defined.

### Fourth Paid Ad Spot

The fourth Release Deck spot is not a music slot.

Visible hierarchy:

1. Fourth row or attached module visually connected to the Release Deck.
2. Label as paid ad clip / on-air ad attachment.
3. Show locked/paywalled state without using an `Upgrade` CTA.
4. Show record action only as a future/paywalled design target, not active MVP
   runtime.
5. Show `10 sec max`.
6. Let the source choose which music track the ad clip attaches to:
   - `1`
   - `2`
   - `3`
7. Show a design-only ad category selector so the ad slot's function is
   recognizable:
   - `release date`
   - `general`
   - `event`
   - `sponsor`
8. Category link-target behavior, when activated:
   - `release date` links to a calendar date.
   - `event` links to a source event.
   - `sponsor` links to a business account after business accounts/local
     business communities are activated.
   - `general` has no required linked target.
9. Preserve the need for a payment account before paid ad-slot purchase or paid
   ad recording becomes active.
10. Place the `Record clip` control on the far right of the ad-clip row in the
   report-paper layout.

Current implementation boundary:

- Paid ad-slot runtime, paywall, purchase, entitlement, recording, media
  capture, review, and storage are deferred until owner specs activate them.
- Paid ad category/link-target persistence, business-account linking, and
  action-wheel linked-target visit behavior are deferred until owner specs
  activate them.
- Payment account setup, saved payment methods, invoices, refunds,
  subscriptions, entitlements, and ad purchase flows are deferred until a
  monetization/payment spec activates them.
- Do not make the fourth spot a fourth active music row.
- Do not let the ad spot imply Fair Play boost, ranking, or rotation priority.
- Do not treat the future linked-target action-wheel affordance as permission to
  add an engagement wheel to public Artist Profile.

## Payment Account / Paid Ads

A payment account is a valid future need for source-side paid features,
including the paid on-air ad clip and later ad/promotion purchases.

Design direction:

1. Treat payment account status as part of the selected source file or the
   signed-in user's source-operating context.
2. Keep it visually secondary in the first mockup.
3. Do not make payment setup a blocker for ordinary Profile, Release Deck, or
   Calendar management.
4. If shown, classify it as `Design only` or `Future` in the handoff.
5. Do not use `Upgrade`, `Buy`, `Subscribe`, `Promote`, or other purchasable
   CTAs until a payment/monetization owner spec authorizes the exact runtime.

Open ownership question:

- Should the payment account belong to the signed-in user, to each selected
  source file, or to both through a source billing profile?

Implementation boundary:

- Do not implement payment account setup, payment provider integration, saved
  payment methods, invoices, receipts, refunds, subscriptions, entitlement
  enforcement, or paid ad purchase until a dedicated payment/monetization spec
  exists.

## Calendar Section

The `Calendar` section is where source events and Print Shop belong.

The preferred report-paper direction should replace the lower `Profile Check`
section with an actual calendar area because profile snapshot content now lives
in the masthead.

Visible content to design:

1. Actual calendar view or compact month/week calendar.
2. Basic event creation entry.
3. Source context for the selected band/source.
4. Event date, title, venue/location, and source ownership.
5. Print Shop / flyer-printing path inside Calendar.
6. Event/flyer status where existing contracts support it.
7. Draft/private event planning state, because source operators may need to plan
   calendar items before revealing them to the community.
8. Future explicit creator `Publish` status/action, marked design-only until
   the event/feed/calendar publication contract exists.
9. Future published-event delivery note: when activated, publishing an
   artist/source event should place it on the community calendar and
   automatically deliver it to follower calendars.

Design constraints:

- Source members should be able to view source calendar/event context.
- Adding or editing calendar/event entries is controlled by manager status or the
  source-specific `Can edit calendar` checkbox unless a later owner spec narrows
  or expands that permission.
- Calendar planning should not imply public feed visibility by default.
- Publishing to community calendar and follower calendars should be controlled
  by explicit creator-published event state, not by the event merely existing in
  or being connected to the source calendar.
- Follower calendar delivery belongs to the future event-publication contract;
  do not deliver draft/unpublished events.
- Most public source/Registrar actions may show up in Feed when they happen,
  but event calendar distribution is different and requires creator
  publication.
- Print Shop stays source-facing.
- Do not expose Print Shop as a public listener action.
- Do not add ticketing, RSVP, billing, offers, promotions management,
  marketplace behavior, or sponsor sales modules unless a spec activates them.

## Metrics Section

Metrics should not be a primary navigation section in the first source
management mockup.

For this pass, metrics belong under `Releases`, below the Release Deck, as a
compact expandable/dropdown area.

Near-term metrics should be limited to basic descriptive source/release signals
where current or planned contracts support them.

Paid tracked-single telemetry remains V2 / possible beta and needs separate
monetization, entitlement, and metrics contracts.

## Registrar Section

Registrar remains a source lifecycle / records path for the signed-in user.

It should stay reachable from the Source Dashboard, but it should not dominate
the daily management shell or become a public profile editor.

## States To Represent

The mockup or later Dev Spec should account for:

1. Loading.
2. Signed out.
3. No managed sources.
4. Multiple source positions.
5. Manager role.
6. Member role.
7. Member without music-submit permission.
8. Empty Release Deck.
9. Partially filled Release Deck.
10. Full three-slot Release Deck.
11. Missing release date.
12. Missing Home Scene.
13. Over six-minute song.
14. Over fifteen-minute source total.
15. Fourth paid ad spot locked/deferred.
16. Payment account absent or not yet activated for paid features.
17. Empty Calendar.
18. Event creation ready.

## Explicit Do-Not-Design

- No duplicate left/right tool lists.
- No public listener-facing source admin controls.
- No source tools inside listener profile.
- No listener-to-artist DM, inbox, or chat.
- No fourth active music slot.
- No upload/storage/transcoding/waveform runtime unless media specs activate it.
- No paid ad purchase, billing, subscription, entitlement, or upgrade module
  unless monetization specs activate it.
- No active payment account setup or saved-payment-method UI unless a
  payment/monetization spec activates it.
- No fake analytics, growth cards, business advice, or leaderboards.
- No Fair Play scheduling, boost, ranking, or rotation controls.
- No GPS badge as dashboard decoration unless a specific source action is
  blocked by an existing owner-spec rule.
- No `Coming Soon`, `Upgrade`, or placeholder CTAs.

## Founder Questions Still Needed

1. Should `Registrar` remain visible as a subdued lifecycle stamp/utility link,
   or should it be tucked into source/account context?
2. Should the Release Metrics lookup default collapsed or open in the first
   mockup?
3. For release metrics, should the label be `Collects`, `Adds`, or another
   source-facing term?
4. For personal storage, is the beta target still URL-only with a future storage
   path, or should a new media-storage spec be created before this UI is
   implemented?
5. What presentation label should the Source Dashboard use for Registrar-held Artist/Band Sect memberships?
6. Should the paid ad spot show a locked `Record` button in the mockup, or
   should it show only the future slot structure until paywall language is
   specified?
7. Should the future payment account belong to the signed-in user, each source
   file, or a source billing profile connected to the user's source positions?
