# MVP Artist Profile Founder Lock R1

Status: Active  
Owner: Founder + product engineering  
Last updated: 2026-04-08

## 1) Purpose
Capture founder-confirmed artist-page behavior so future sessions stop guessing about the artist surface from mixed narrative summaries, partial specs, or external synthesis.

This document is the controlling lock for:
- artist-page structure
- artist-page core actions
- artist-page playback handoff behavior
- artist-page implementation guardrails

## 2) Authority And Precedence
For artist-page implementation and review, apply this order:
1. Direct founder-confirmed behavior captured in this document
2. `docs/canon/*`
3. `docs/specs/*`
4. `docs/solutions/MVP_ARTIST_PROFILE_DOC_AUDIT_R1.md`
5. Other `docs/solutions/*`
6. `docs/legacy/*` (reference only)

This document resolves the current artist-page lock gap identified in `docs/solutions/MVP_ARTIST_PROFILE_DOC_AUDIT_R1.md`.

## 3) Source Context Used
- Founder confirmations in this session on 2026-03-22
- `docs/solutions/MVP_ARTIST_PROFILE_DOC_AUDIT_R1.md`
- `docs/specs/core/signals-and-universal-actions.md`
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/canon/Master Application Surfaces, Capabilities & Lifecycle Canon.md`
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Legacy Narrative plus Context .md`

## 4) Artist Page Structure Lock
The artist page should use a familiar mainstream profile-page structure.

Interpretation rule:
- familiar in layout recognizability
- not a custom or experimental page model
- do not import non-canon platform mechanics just because the structure is familiar

The page should organize the already-supported artist items in a recognizable profile pattern, including:
- profile header
- artist identity/info
- media/content areas
- songs/releases
- events
- support/action links

## 5) Core Actions On The Artist Page
The must-have artist-page actions are:
- `Follow`
- `Add`
- `Blast`
- `Support`

These are the primary user actions the surface must expose.

## 6) Playback Handoff Lock
### 6.1 Entry from artist link
When the user lands on the artist page from an artist link:
- RaDIYo continues playing uninterrupted
- nothing auto-plays from the artist page
- playback changes only if the user selects a single on the artist page

### 6.2 Entry from single/signal link
When the user lands on the artist page from a single/signal link:
- the route resolves to the artist page
- the selected single streams automatically from that page
- RaDIYo stops

## 7) Existing Architectural Carry-Forward Used By This Lock
This lock assumes, and does not redefine:
- additive capability / unified identity model
- Home Scene anchoring
- release-deck slot constraints
- descriptive analytics posture
- Print Shop / Runs / issuance boundaries

Those remain governed by:
- `docs/solutions/MVP_ARTIST_PROFILE_DOC_AUDIT_R1.md`
- supporting canon/spec sources cited there

## 8) Explicit Non-Locks / Still Deferred
This document does not yet finalize:
- exact section order within the artist page body
- exact visual composition of the header
- exact song-list ordering rules
- exact event/calendar interaction behavior on the page
- exact external-link inventory
- exact artifact/display rules on the profile
- artist-facing dashboard/management internals

Legacy carry-forward rule:
- richer artist profile data inventories from older product documents remain valid future-profile understanding
- they are preserved in `docs/solutions/LATER_VERSION_DOMAIN_UNDERSTANDINGS_R1.md`
- they do not automatically expand the current MVP artist-page contract

## 9) Implementation Guardrails
- Do not redesign the artist page as an unusual bespoke surface.
- Do not turn it into a passive dead-end bio page.
- Do not auto-play anything on artist-link entry.
- Do not keep RaDIYo running when the user enters from a single/signal link that should auto-stream from the page.
- Do not import external schema/API summaries as implementation authority.
- If more artist-page detail is required beyond this lock, extend founder lock coverage before implementation.

## 10) Follow-Up Needed
- Reconcile future artist-page implementation work against this founder lock and `docs/solutions/MVP_ARTIST_PROFILE_DOC_AUDIT_R1.md` together.
- If additional page-detail decisions are needed, extend this file instead of re-inventing the surface in code.
