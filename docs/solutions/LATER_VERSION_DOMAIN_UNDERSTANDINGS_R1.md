# Later Version Domain Understandings R1

**Status:** `active`
**Owner:** `founder + product engineering`
**Last Updated:** `2026-04-08`

## Purpose
Preserve legitimate later-version product domains so future sessions do not accidentally discard them as legacy noise while still keeping current MVP execution narrow.

This document exists to capture a simple rule:
- some domains are real parts of UPRISE's long-term product model
- but they are not current-MVP-driving for the active Discover/Stats reconciliation unless explicitly reactivated

## Use This When
- reconciling older narrative docs against current MVP locks
- deciding whether a legacy domain should be treated as real, deferred, or ignored
- preventing future agents from collapsing valid later-version domains into "not part of the product"

## Domain Status Rule
The following domains are legitimate UPRISE product domains:
- causes
- ambassadors
- venues
- mixologists
- mixes

They should be treated as:
- real parts of later-version product understanding
- not noise
- not deleted from working knowledge

They should not be treated as:
- current-MVP-driving requirements for Discover, Plot Statistics, or the current web MVP
- permission to silently widen current implementation scope
- authority to invent missing runtime mechanics beyond what current repo specs already define

## Current Handling
### Ambassadors
- Legitimate later-version domain.
- Canon role: local support/tour-guide style services for artists on the road.
- Current repo authority:
  - `docs/specs/v2/ambassador-system.md`
- Current rule:
  - preserve the domain in working understanding
  - do not pull ambassador booking/service/map workflows into current MVP work unless explicitly requested

### Mixologists and Mixes
- Legitimate later-version domain.
- Canon role: curated mixes and related mixologist capability.
- Current repo authority:
  - `docs/specs/v2/mixologist-and-mixes.md`
  - `docs/specs/economy/revenue-and-pricing.md`
- Current rule:
  - preserve the domain in working understanding
  - do not pull mix creation, approval, Mix Market, or mix-surface behavior into current MVP work unless explicitly requested

### Venues
- Legitimate later-version domain.
- Canon role:
  - business/venue style economic and scene-infrastructure surfaces
  - event/touring support context
- Current repo authority:
  - `docs/specs/users/identity-roles-capabilities.md`
  - `docs/specs/economy/revenue-and-pricing.md`
  - relevant canon references in `docs/canon/*`
- Current rule:
  - preserve venue/business capability as part of broader product understanding
  - do not infer a fully locked standalone venue product system from legacy references alone

### Causes
- Legitimate later-version domain.
- Current founder direction:
  - causes are not part of the current MVP surface
  - causes are likely V2 unless explicitly reactivated earlier
- Current rule:
  - preserve the registrar-mediated cause model in working understanding
  - do not pull public cause surfaces, cause visibility, or cause runtime expansion into the active MVP slice unless explicitly requested

## Discover / Stats Boundary
For the active Discover and Statistics MVP work:
- ambassadors, venues, and mixologists remain valid future source classes in the shared ontology
- that legitimacy does not make them active MVP surface requirements
- current Discover/Stats implementation should continue to follow:
  - `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
  - `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`

## Retained Profile Data
Some legacy profile fields should remain part of background product understanding even when they are not part of the current MVP profile surfaces.

These fields should be treated as:
- legitimate profile-data candidates for later-version work
- retained understanding for future profile/spec reconciliation
- not automatic authorization to widen current MVP profile surfaces

### Artist Profile Data To Retain
- biography
- genre / inspiration tags
- photos / videos
- external links
- contact information
- artist library
- upcoming tour dates
- ratings
- messaging entry point

### Listener Profile Data To Retain
- username
- location
- favorite genre
- playlists
- artists followed
- listeners followed
- favorite artists
- ambassador services offered
- ambassador ratings from artists
- ambassador location

### Venue Profile Data To Retain
- venue name
- venue location
- ratings
- photos
- upcoming events

### Handling Rule
- keep these profile-data inventories in future-version understanding
- do not assume they are all approved for current MVP surface rendering
- when profile work expands later, reconcile against current repo locks/specs before implementation

## Founder Confirmation Rule
If a later-version domain introduces:
- a new concept not already represented in current repo specs/canon, or
- new detailed mechanics inside a familiar concept that are not already locked in repo truth,

do not silently promote that detail into active product authority.

Founder confirmation is required before:
- adding new later-version workflows
- treating legacy detail as active MVP behavior
- widening current surfaces/contracts around these domains

## Practical Prompt Rule
Future agents should use this framing:
- keep causes, ambassadors, venues, mixologists, and mixes in background product understanding
- do not discard them as fake or obsolete
- do not let them expand the current MVP slice unless the task or founder direction calls them back in

## References
- `docs/specs/v2/ambassador-system.md`
- `docs/specs/v2/mixologist-and-mixes.md`
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/specs/economy/revenue-and-pricing.md`
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`
