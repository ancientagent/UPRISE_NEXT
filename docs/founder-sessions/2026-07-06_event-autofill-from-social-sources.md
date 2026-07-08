# Event Autofill From Social Sources Founder Session

Status: raw founder-session capture
Date: 2026-07-06
Source: current chat/session
Related lane(s): events, print-shop, source-dashboard, artist-profile, external-integrations
Owner spec candidates: `docs/specs/events/events-and-flyers.md`; `docs/specs/economy/print-shop-and-promotions.md`

## Raw Founder Notes

> events are important, however it can scan the band's social media for events to autofill ours

> well ok yeah thats a lot maybe be can have a facebook or some other account to make them on

## Clarifications

- Events remain important even if the first product proof is local music playback.
- Type: settled
- Likely owner: `docs/specs/events/events-and-flyers.md`

- Event creation can later be assisted by scanning/importing from a band's official external social or event sources, but imported data should autofill source-owned event drafts rather than automatically publish public UPRISE events.
- Type: deferred/future idea with permission constraints
- Likely owner: `docs/specs/events/events-and-flyers.md`; external integration contracts

- A simpler future model may be connecting a band's official Facebook Page or another event-account source where the band already creates events, then using that source to prefill or sync UPRISE event drafts.
- Type: deferred/future idea with permission constraints
- Likely owner: `docs/specs/events/events-and-flyers.md`; external integration contracts

## Feature Sets

- Social-source event autofill
- Raw basis: "it can scan the band's social media for events to autofill ours"
- Included behavior:
  - Artist/source connects or supplies official external accounts/links.
  - UPRISE detects event-like data from approved/available sources.
  - A connected Facebook Page or other event account can be treated as the
    creator-maintained event source when the platform API/terms allow it.
  - UPRISE pre-fills a source-facing event draft with title, date, venue, city, flyer/image, source URL, and description when available.
  - Manager/member with event permission reviews, edits, and explicitly publishes the event before community-calendar or follower-calendar delivery.
- Excluded / not activated:
  - No hidden scraping of accounts without permission.
  - No automatic public event creation from social content.
  - No follower-calendar delivery from imported drafts.
  - No dependency on Instagram, Facebook, TikTok, Bandcamp, or other external API access for MVP.
- Status: deferred; useful beta/partner integration path.

## Working Interpretation

- The lowest-friction event path is import-assisted creation: UPRISE helps the artist avoid duplicate typing, but the creator still controls what becomes official and public inside UPRISE.
- A connected event account such as Facebook Page/Eventbrite/Bandsintown/official calendar may be a better source of structured event data than generic social scanning, if the artist owns it and platform access is approved.
- Current MVP can keep manual event creation through Print Shop while future integration work explores official API/import partners.
- Social/event imports should be treated as evidence and draft data, not source-of-truth public records until confirmed by the source operator.

## Promotion Targets

- Owner spec: `docs/specs/events/events-and-flyers.md`
- Lane brief: `docs/agent-briefs/EVENTS_ARCHIVE.md`
- Source dashboard/profile docs only when event import UI is designed there.
- Runtime/tests: future external-account connection, event draft import, creator review/publish, and source permission checks.

## Do Not Drift

- Do not call social-source event autofill an MVP dependency.
- Do not scrape private, restricted, or terms-prohibited social data.
- Do not publish imported event drafts without explicit creator action.
- Do not make imported events bypass source ownership, promoter capability, Home Scene, or event locality rules.
- Do not let imported event data create listener-side event-authoring behavior.
- Do not use a shared UPRISE-owned Facebook/social account as the canonical
  event owner for band events unless a future explicit source/venue/promoter
  ownership policy approves that model.
