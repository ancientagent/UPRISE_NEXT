# Source Dashboard Members And Feed Publishing Founder Session

Status: raw founder-session capture
Date: 2026-07-06
Source: current chat/session
Related lane(s): ARTIST_SOURCE, UX_UI, EVENTS_ARCHIVE, SOCIAL_FEED, REGISTRAR
Owner spec candidates: `docs/specs/users/artist-profile-and-source-dashboard.md`; `docs/specs/users/identity-roles-capabilities.md`; `docs/specs/events/events-and-flyers.md`; `docs/specs/social/message-boards-groups-blast.md`; `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`

## Raw Founder Notes

> ok i think the last think i wanted was if there was a place to put a stamp somewhere on it to make it look official , if not its ok.  also I should just mention that for the band members/ the manager would search for them? or i guess they would just enter their emails and if they are registered on the platform their avatars will appear.  this would happen in the little bio entre screen. the avatars would then be links to their listener accounts?   Note:  so pretty much anything that happens in the registrar that goes public will be sent as such in the feed, so nobody makes a post, if an artist ads an event to their calendar  there should probably be a publish feature on the event when they open it in their calendar,  this will publish it to the feed.  when new bands are registered they go to the feed.. I guess this can be discussed in a different section but im just saying there will be several actions that when they are made it will trigger things to get published to the feed, followers etc

> right the idea is an artist still may need to plan their calendar without revealing to the community

> right but it should just be published when its published rather than it being connected to their calendar

> the actual feature is if an artist publishes an event, those who follow the artist automatically receive the event in their calendar

> also it will show up on the community calendar but the real thing here is that it needs to be published buy the creator

> most other things just show up in the feed when they happen this is the distinction

> I'm not the biggest fan of the stamp, also if there's a way to make the document maybe a little bit more thicker lines or something / xeroxy  I guess this could be in the spec,  but the stamp should be like an ink rubber or like the old official one you had at the bottom right corner on one of the earlier versions.

> the main folder should be titled the screen / section covered

## Clarifications

- The report-paper Source Dashboard mockup should use a heavier xerox/report
  paper line treatment if it improves the official file feel. Any stamp should
  be a subtle bottom-right rubber-ink style mark, similar to the earlier
  official-stamp direction, rather than a prominent masthead/status stamp.
- Type: design direction
- Likely owner: `docs/screen-packages/artist-profile-source-dashboard/design-spec/source-dashboard-management-shell-layout-brief.md`

- Band/source member management should happen in the source-facing bio/profile entry screen, not on the public Artist Profile.
- Type: settled design direction, runtime contract pending
- Likely owner: `docs/specs/users/artist-profile-and-source-dashboard.md`; `docs/specs/users/identity-roles-capabilities.md`

- The manager should be able to add or find members by email/search-style entry; if the person is already registered on UPRISE, their avatar can resolve and appear in the member strip.
- Type: open contract / implementation detail
- Likely owner: `docs/specs/users/identity-roles-capabilities.md`; Registrar/member invite runtime

- Resolved member avatars should act as links to those members' listener accounts/profiles, subject to privacy and routing rules.
- Type: open contract / deferred
- Likely owner: `docs/specs/users/artist-profile-and-source-dashboard.md`; identity/profile routing specs

- Public feed items should be system-triggered by public Registrar/source lifecycle events rather than authored as manual social posts by artists.
- Type: settled direction, feed contract pending
- Likely owner: `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`; social/feed owner spec

- New band/source registration becoming public should produce a feed item.
- Type: settled direction, runtime contract pending
- Likely owner: Registrar/source lifecycle specs and feed owner spec

- Source event publication should be based on explicit event published state, not on whether an event exists in or is connected to the source calendar.
- Type: open contract / deferred implementation
- Likely owner: `docs/specs/events/events-and-flyers.md`; `docs/specs/social/message-boards-groups-blast.md`

- Source calendar planning must support private/unpublished event planning so artists can work on their calendar without revealing draft or tentative events to the community.
- Type: settled product boundary, runtime contract pending
- Likely owner: `docs/specs/events/events-and-flyers.md`; source-facing Calendar/Print Shop runtime

- When an artist/source publishes an event, followers of that artist/source should automatically receive the event in their calendar.
- Type: settled future feature direction, runtime contract pending
- Likely owner: `docs/specs/events/events-and-flyers.md`; follow/calendar/feed notification contracts

- Creator publication is the gate for public calendar distribution. Once the creator publishes the source event, it can appear on the community calendar and be delivered to follower calendars.
- Type: settled future feature direction, runtime contract pending
- Likely owner: `docs/specs/events/events-and-flyers.md`; community calendar/follower calendar contracts

- Feed emission for other public source/Registrar lifecycle actions can happen when the public action happens; events are different because community-calendar and follower-calendar delivery require explicit creator publication.
- Type: settled product distinction, runtime contract pending
- Likely owner: source/feed owner lock; events/calendar owner spec

- Design/asset package main folders should be named after the screen or section
  covered.
- Type: settled documentation/workflow convention
- Likely owner: `docs/screen-packages/README.md`

## Feature Sets

- Source profile member lookup and avatar resolution
- Raw basis: "the manager would search for them? or i guess they would just enter their emails and if they are registered on the platform their avatars will appear"
- Included behavior:
  - Manager enters or searches member emails inside source-facing Profile/bio management.
  - Registered platform users may resolve to visible avatars.
  - Member avatars may link to listener accounts/profiles.
  - Existing manager/member permissions remain source-specific.
- Excluded / not activated:
  - No public Artist Profile permission editing.
  - No listener-to-artist DM or inbox.
  - No broad people search, scraping, contact exposure, or privacy bypass.
- Status: design direction, identity/search/privacy contract pending.

- System-triggered feed publication from public source lifecycle events
- Raw basis: "anything that happens in the registrar that goes public will be sent as such in the feed, so nobody makes a post"
- Included behavior:
  - Registrar/source public lifecycle events can create feed updates.
  - Newly registered public bands/sources can be announced in Feed.
  - Source event management can expose a Publish action/status.
  - Published source events can reach Feed/followers through a system update
    model.
  - Calendar items can remain private/draft until explicitly published.
  - Followers of the artist/source automatically receive published events in
    their calendars.
  - Published creator events can appear on the community calendar.
  - Other public source/Registrar actions may emit Feed activity when they
    happen, but that feed timing must not be reused as the event calendar
    publication rule.
- Excluded / not activated:
  - No generic manual source post composer.
  - No event-page Blast.
  - No listener-facing event creation.
  - No automatic publication of private/draft Registrar or calendar work.
- Status: deferred until feed/event owner contracts define triggers, targets, idempotency, moderation, and privacy.

## Working Interpretation

- The preferred mockup should feel a little more xerox/report-paper official:
  heavier rules, stronger form borders, and a restrained printed-paper texture
  are valid. If a stamp appears, place it at the lower-right like an old
  rubber-ink official mark, using wording like `SOURCE FILE` or `UPRISE SOURCE
  RECORD` rather than `Verified` unless a real status field exists.
- Member management belongs in the source-facing Profile/bio edit area. It should let a manager add members by email/search, resolve registered users to avatars, and link resolved avatars to listener accounts after privacy/routing is defined.
- Public feed publication should be modeled as system-generated source lifecycle updates, not artist-authored posts. Most public source/Registrar lifecycle actions can show up in Feed when they happen. Event calendar distribution is the distinction: Source Calendar can support private planning, and community-calendar plus follower-calendar delivery should follow explicit creator-published event state rather than calendar linkage. Published artist/source events should automatically land in follower calendars and appear on the community calendar once the calendar/follow contracts are activated.

## Promotion Targets

- Owner spec: `docs/specs/users/artist-profile-and-source-dashboard.md`
- Owner spec: `docs/specs/users/identity-roles-capabilities.md`
- Owner spec: `docs/specs/events/events-and-flyers.md`
- Owner spec: `docs/specs/social/message-boards-groups-blast.md`
- Founder lock reference: `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
- Open decisions: `docs/specs/DECISIONS_REQUIRED.md`
- Lane brief: `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- Lane brief: `docs/agent-briefs/EVENTS_ARCHIVE.md`
- Design package: `docs/screen-packages/artist-profile-source-dashboard/`

## Do Not Drift

- Do not add a manual social post composer to Source Dashboard from this note.
- Do not expose member permission editing on public Artist Profile.
- Do not expose private emails or unresolved invite targets publicly.
- Do not link avatars to listener accounts until privacy/routing behavior is specified.
- Do not turn event publishing into `Blast` or an event-page blast target.
- Do not auto-publish private Registrar drafts, private calendar drafts, or unpublished source work.
- Do not auto-deliver draft/unpublished source events to follower calendars.
- Do not put draft/unpublished source events on the community calendar.
- Do not apply generic Feed "happens when it happens" timing to event calendar
  delivery; events require creator publication.
- Do not use an official-looking stamp to imply GPS verification, source
  validation, paid status, or policy clearance unless the owner spec provides
  that state.
- Do not place the stamp as a prominent masthead badge; it should read as a
  low-emphasis rubber-ink document artifact near the lower-right of the sheet.
- Do not name design/asset handoff folders by random generation IDs, agent
  names, or vague labels when a screen/section name is available.
