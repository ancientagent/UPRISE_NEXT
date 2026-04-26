# Listener Profile And Source Management Separation

Date: 2026-04-26
Branch: `feat/ux-founder-locks-and-harness`
Status: active carry-forward

## Founder Correction
When the founder says `user profile`, that means the listener profile / collection workspace for everyone who has onboarded into the app.

Artists, bands, promoters, and future business-style identities are separate source entities. A listener can be linked to and authorized to manage those source entities, but source management is not part of the listener profile/community space.

## Locked Product Model
- Listener profile lives inside the app/community experience.
- Source entities are managed from source/admin web tooling.
- The listener app/mobile app pulls source data from that source-management system.
- Current `/source-dashboard` is the monorepo MVP implementation stand-in for that source-management website/domain.
- Do not treat `/source-dashboard` as proof that source management belongs inside the listener profile or Home/Plot community shell.

## Source Capabilities
For current source management, artists/sources mainly need to:
- create/manage events
- add/manage songs
- post messages/updates to followers

Users who are in bands or operate sources still participate inside the platform/community as their listener/base identity when they are not operating a source.

## Agent Risk
Design and coding agents must not blend these:
- listener user profile / collection workspace
- public Artist Profile
- source-management dashboard

If a design agent places Release Deck, Print Shop, source posting, source analytics, or source settings inside the listener profile, stop and correct it.
