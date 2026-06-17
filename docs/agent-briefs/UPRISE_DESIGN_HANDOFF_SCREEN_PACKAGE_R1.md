# UPRISE Design Handoff Package (UI screens)

Status: active
Last Updated: 2026-06-16
Use for: design/UX artifact generation and external design agents.

## General handoff scope
This package is for screen-level production only:
- layout and hierarchy
- interaction states
- copy and empty/loading/error behavior
- spacing + responsive behavior

Do not invent new feature logic in this packet.

## Screen 1: Home + Plot baseline
### Required shape
- Avatar + recommendation identity row
- identity city/state + UPRISE label
- top-right notification/settings controls
- player shell directly below identity row
- Plot tabs row directly under player
- active tab content below tabs

### Must-include copy behavior
- Plot tabs are `Feed`, `Events`, `Archive`
- default tab = Feed

### States
- normal
- player-focused
- profile-expanded impact (player may compress to strip)

## Screen 2: Feed
### Must include
- feed list scoped to active city/state/community
- scene context visible
- read-only discovery moments

### Exclusions
- ranking/personalization language
- inline action cards
- paywall/upgrade joins

## Screen 3: Events
### Must include
- scene-scoped event cards
- clear date/time/venue/source context
- empty-state and error-state treatment without action leakage

### Exclusions
- built-in calendar add/ICS actions
- recommendation CTA language

## Screen 4: Archive
### Must include
- descriptive lane summary
- top songs / activity snapshot where present
- historical/community record language

### Exclusions
- full-screen analytics exploration patterns
- tier/map/nearest-community navigators as default
- leaderboards or comparative scoring

## Screen 5: Profile pull-down
### Must include
- seam/drag affordance and collapse-expansion behavior
- listener collection workspace in place (no route change)
- player drop/strip behavior on expansion when space is constrained

### Exclusions
- separate profile route as default entry
- follower-only social network patterns that shift away from listener-centric scope

## Screen 6: Artist Profile
### Must include
- header/info, identity, follow/share
- up to 3 direct-listen rows
- collect + recommend (recommend gated by collect)
- official links

### Exclusions
- engagement wheel
- blast action
- scores/rankings/editorial picks

## Assets / references
- Prefer existing `art/` references only; no new one-off generated assets unless explicitly scoped.
- If using multiple sources, keep all references in one message and map each to a screen
  (`plot`, `profile`, `archive`, `artist-profile`) before generation.
