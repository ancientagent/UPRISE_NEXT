# Provider-Agnostic Artist Linking Founder Session

Status: raw founder-session capture
Date: 2026-07-06
Source: current chat/session
Related lane(s): media, artist-profile, source-dashboard, registrar, business-strategy
Owner spec candidates: `docs/specs/media/release-deck-and-eligibility.md`; `docs/specs/users/artist-profile-and-source-dashboard.md`

## Raw Founder Notes

> well the artist can create an account, and maybe we do let them list their sings via http,  and then we can just have a basic shell that connects all their other stuff to it

> well yes im saying for the user facing aritst profile a blast takes them to their account , they go to hear the song cant even that be a play link from another account of theres somehwere

> basically what im saying is is it possible to point our users to their song for them to play while in the artists uprise profile even though it is hosted somehwere else

> this is how we make this a billion dollar app, its an addon to what they are already doing they just plug it in and their songs get local play y connecting them to the listeners in there community rather than making it an app that tryies to own everything

> they could plug in their bandcamp, soundcloud or use use ours but it wont be as rhobust

> at least noiw

> really this would be a perfect buying target for bandcamp

> then we would have instant access to all of their artists

> an it would cost nothing for the artists timewise or anything

## Clarifications

- UPRISE should remain additive to existing artist infrastructure rather than requiring artists to abandon Bandcamp, SoundCloud, merch stores, donation pages, websites, or other external accounts.
- Type: settled
- Likely owner: `docs/specs/users/artist-profile-and-source-dashboard.md`; business strategy notes only for acquisition framing.

- Artist Profile song rows may point listeners to source-owned songs hosted elsewhere when the song has a direct playable URL or approved embed/link behavior.
- Type: settled with technical constraints
- Likely owner: `docs/specs/media/release-deck-and-eligibility.md`; `docs/specs/users/artist-profile-and-source-dashboard.md`

- Ordinary external profile/page links should remain official outbound links unless they provide a direct playable audio URL or approved playback integration.
- Type: settled with technical constraints
- Likely owner: `docs/specs/users/artist-profile-and-source-dashboard.md`

- UPRISE-hosted media may be a later/basic fallback, but current MVP remains URL-only until a media-storage owner spec activates upload/storage/transcoding.
- Type: already documented plus clarified
- Likely owner: `docs/specs/media/release-deck-and-eligibility.md`

## Feature Sets

- Provider-agnostic artist plug-in model
- Raw basis: "they could plug in their bandcamp, soundcloud or use use ours but it wont be as rhobust"
- Included behavior:
  - Artists create/register a UPRISE source account.
  - Artists provide playable song URLs or official external links from existing services.
  - UPRISE routes local listeners to the song/source through RADIYO, Artist Profile, Feed/Buzz, Blast-card handoffs, and source links.
  - UPRISE positions itself as local distribution/discovery infrastructure, not a replacement for artist commerce, hosting, or existing fan-support systems.
- Excluded / not activated:
  - No dependency on Bandcamp/SoundCloud API approval for MVP.
  - No real UPRISE upload/storage/transcoding unless a later media-storage spec activates it.
  - No claim that UPRISE owns or hosts externally served audio.
- Status: settled product direction; implementation remains constrained by current URL-only media spec.

- Bandcamp strategic partnership / acquisition framing
- Raw basis: "really this would be a perfect buying target for bandcamp"
- Included behavior:
  - Treat Bandcamp as a strategic ecosystem fit because UPRISE can send local discovery and purchase/support intent back to artist-controlled Bandcamp pages.
  - Explore a zero-friction partner path where Bandcamp-side integration can make eligible/opted-in artists available to UPRISE with minimal artist setup work.
- Excluded / not activated:
  - Do not encode acquisition speculation as runtime behavior.
  - Do not make MVP dependent on Bandcamp OAuth/API access.
  - Do not assume UPRISE can access, import, stream, or register all Bandcamp artists without Bandcamp approval, artist permission, rights clearance, and explicit integration terms.
- Status: strategic context only.

## Working Interpretation

- The MVP should let artists plug existing song and commerce infrastructure into UPRISE rather than forcing UPRISE to own every media, storefront, donation, or social surface.
- The Release Deck remains a lightweight URL-based listing path: if the URL is directly playable and allowed, UPRISE can play it in UPRISE surfaces; otherwise UPRISE should present an official outbound listen/buy/support link.
- Artist Profile and Feed/Blast handoffs should route listeners toward the artist/source and song, not toward generic social posting behavior.
- The ideal Bandcamp partnership shape is near-zero artist setup time: Bandcamp or an approved OAuth/API flow could confirm artist account access and prefill/source-link artist data. That remains a strategic hypothesis, not a current MVP dependency or access guarantee.

## Promotion Targets

- Owner spec: `docs/specs/media/release-deck-and-eligibility.md`
- Owner spec: `docs/specs/users/artist-profile-and-source-dashboard.md`
- Lane brief: `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- Tests/runtime: future Release Deck URL validation, Artist Profile song-row playback/link fallback, and Feed/Blast source-link behavior if implementation changes.

## Do Not Drift

- Do not turn provider links into a requirement that UPRISE owns or hosts all music.
- Do not require Bandcamp/SoundCloud API integration before MVP can work.
- Do not describe a Bandcamp partnership as instant access to all artists in product specs unless Bandcamp grants that access and the legal/artist-consent model is explicit.
- Do not treat ordinary external web pages as direct playable URLs unless browser playback and provider terms allow it.
- Do not put Blast controls on Artist Profile; Blast originates from listener inventory/personal-player context and may create Feed/Buzz handoffs to the source/song.
- Do not encode acquisition or buyer-target speculation as product runtime behavior.
