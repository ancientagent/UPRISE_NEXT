# MVP Artist Profile Founder Lock R1

Status: Active
Owner: Founder + product engineering
Last updated: 2026-04-20

## 1) Purpose
Capture the current founder-confirmed artist-profile behavior so future sessions stop mixing:
- older source-page action assumptions (`Add`, `Support`)
- broadcast/player-wheel behavior
- and the newer artist-profile direct-listen flow.

This document is the controlling lock for:
- artist-profile structure
- artist-profile playback mode
- artist-profile song-row controls
- collect/blast boundary on the artist profile
- handoff behavior from feed/discovery into artist-profile listening

## 2) Authority And Precedence
For artist-profile implementation and review, apply this order:
1. Direct founder-confirmed behavior captured in this document
2. `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
3. `docs/canon/*`
4. `docs/specs/*`
5. `docs/solutions/MVP_ARTIST_PROFILE_DOC_AUDIT_R1.md`
6. other active founder locks in `docs/solutions/*`
7. dated handoffs

If older artist-page docs still say the page action grammar is `Follow / Add / Support`, this document wins.

## 3) Source Context Used
- Founder clarifications in-session on 2026-04-16
- `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/specs/core/signals-and-universal-actions.md`
- `docs/solutions/MVP_ARTIST_PROFILE_DOC_AUDIT_R1.md`
- `docs/canon/Master Application Surfaces, Capabilities & Lifecycle Canon.md`

## 4) Artist Profile Purpose Lock
The artist profile is the public source page for the artist and the direct-listen surface for that artist's music outside the `RADIYO` system.

It should not be confused with:
- `RADIYO` broadcast mode
- `Collection` playback mode
- a dead-end bio page
- a second wheel-driven listening surface

Current intended interpretation:
- the profile is where the user can discover the artist
- listen to songs directly from the page
- learn about the artist
- share artist information
- decide whether to collect a song
- reach official artist-controlled off-platform destinations when configured

## 5) Artist Profile Structure Lock
The artist profile should still use a familiar profile-page structure.

But for current MVP listening behavior it should clearly include:
- profile header / identity
- artist info / context
- a short direct-listen song area
- official artist-controlled outbound links when configured
- supporting details / links / events where appropriate

Current MVP listening expectation:
- the artist profile presents `3` songs
- each song is rendered as its own playback row

## 6) Page-Level Action Boundary
Artist profiles are source pages.

That means page-level actions should remain source actions only, such as:
- `Follow`
- official artist-controlled outbound links when configured, such as:
  - merch
  - album purchase
  - donation/support
  - other official external destinations

Do not treat the source page itself as if it were a signal card.

That means:
- no source-level `Collect`
- no source-level `Blast`
- no source-level `Support` button

## 7) Song-Row Direct-Listen Lock
Each of the `3` songs on the artist profile should behave as a direct-listen row.

Each row should provide:
- song title
- `Play/Pause`
- a timeline / progress bar
- optional elapsed / duration display
- `Collect` in the profile listening context

The row should not carry:
- wheel actions
- blast controls
- broadcast framing
- collection framing

## 8) No-Wheel Rule On Artist Profile
The artist profile does not use the engagement wheel.

Reason:
- the user is listening to the song directly from the artist page
- this surface should not be confused with `RADIYO` or `Collection`

Guardrail:
- do not surface wheel actions on artist-profile song rows
- do not make artist-profile listening feel like a broadcast-control surface

## 9) Playback Mode Separation Lock
The product should keep these listening modes legible:

### 9.1 `RADIYO`
- broadcast mode
- wheel allowed

### 9.2 `Collection`
- owned listening mode
- wheel allowed

### 9.3 `Artist profile`
- direct-listen mode outside `RADIYO`
- no wheel
- row-based playback controls only

This separation matters because users should not confuse:
- direct listening on the artist profile
- listening to broadcast
- listening from owned collection

## 10) Playback Handoff Rules
### 10.1 Entry from artist link
When the user lands on the artist profile from an artist/source link:
- nothing auto-plays
- `RADIYO` keeps playing until the user explicitly selects one of the profile's song rows

### 10.2 Entry from discovery/feed song square or single/signal entry
When the user enters the artist profile from a song-driven discovery handoff:
- the route resolves to the artist profile
- the selected song begins playing there
- `RADIYO` pauses

User-facing interpretation:
- it should feel like the song is playing from the artist profile

## 11) Shared Audio-State Rule
The artist profile may use the shared playback system under the hood.

But the surface should still read as a separate artist-profile listening shell.

Interpretation:
- do not build a second unrelated audio engine just for the artist profile
- do build separate artist-profile playback chrome so the user experiences it as profile-based listening

## 12) Collect Boundary On Artist Profile
If the user likes a song while listening on the artist profile:
- they may `Collect` it there

This is the intended collection entry point for the artist-page listening flow.

Meaning:
- collection does not happen on the feed/discovery square itself
- collection happens after entering the artist-profile listening context
- the artist page remains a valid discovery/listening/recommendation context outside `RADIYO`

## 13) Blast Boundary On Artist Profile
`Blast` is not available from the artist profile.

`Blast` remains tied to the approved listening contexts:
- personal player / user space
- current web MVP `Collection` mode as the visible personal-player stand-in

That means:
- no blast on feed/discovery squares
- no blast on artist-profile song rows
- no wheel on artist profile

## 14) Explicit Non-Locks / Deferred Items
This document does not yet finalize:
- exact section order outside the locked song-row area
- exact header composition
- exact event/calendar layout on the artist profile
- exact visual styling of the song rows
- exact artwork fallback hierarchy beyond logo/release-art intent
- later richer profile-wall / artifact display behavior
- exact ordering and grouping of the official outbound links

## 15) Implementation Guardrails
- Do not reintroduce `Add` / `Support` as source-page core actions.
- Do not put the engagement wheel on the artist profile.
- Do not let artist-profile listening masquerade as `RADIYO` or `Collection` mode.
- Do not put `Collect`, `Blast`, or `Follow` directly on feed/discovery carousel squares.
- Do not auto-play anything on plain artist-link entry.
- Do not keep `RADIYO` running when the user enters through a song-driven artist-profile handoff.

## 16) Implementation Slices
### Slice A — documentation lock
- lock artist-profile direct-listen/discovery purpose
- lock no-wheel boundary
- lock collect-vs-blast separation

### Slice B — profile song rows
- render `3` song rows with play/pause + timeline
- keep row controls local to artist-profile listening

### Slice C — discovery handoff
- clicking a discovery/feed song square pauses `RADIYO`
- artist profile opens with the selected song playing there

### Slice D — collection entry
- allow `Collect` from the artist-profile listening context
- keep `Blast` unavailable there

### Slice E — later profile refinement
- refine header/details/events/artwork layout without changing the mode/action boundaries above

## 17) Follow-Up Needed
- reconcile any remaining active implementation briefs or UX docs that still describe artist-page core actions as `Follow / Add / Support`
- implement the artist-profile song-row shell before widening later visual polish
- keep blast/runtime wheel work out of artist-profile implementation slices unless the founder explicitly reopens that boundary
