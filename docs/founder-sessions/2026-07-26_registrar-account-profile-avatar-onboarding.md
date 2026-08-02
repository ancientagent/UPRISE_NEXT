# Registrar Account Profile And Avatar Onboarding Founder Session

Status: raw founder-session capture
Date: 2026-07-26
Source: current chat/session
Related lane(s): website entry, account onboarding, Registrar, Home Scene,
listener profile, Personal Space, listener avatar, artist/source management
Owner spec candidates:
`docs/specs/users/onboarding-home-scene-resolution.md`,
`docs/specs/system/registrar.md`,
`docs/specs/users/identity-roles-capabilities.md`,
`docs/specs/users/artist-profile-and-source-dashboard.md`

## Raw Founder Notes

> instead of making all these avatars we can just have the user put their own likeness in

> yeah.. so the clothes can all be their own thing

> we will have a bunch of approved avatar clothes

> i think it would likely be best if the user could select the expression

> or really, if there's a way we can get all these different qualities to show through in the user

> other way around, depending on how they answer the profile questions or something like thay

> yeah, honestly it should just have a couple random generation settings.. (different punks)

> thats for punk but they can also have sometghing different foing on for sometjhing elser

> right, first of all, since these will be made specifically for users, they can be more detailed /less vague as long as its somewhat accurate.

> as far as facial features

> right, hair and all that can be a trait of the music style though, depending..

> well for now lets just go with what we've established so far and we will adjust as we test

> I think the initial wardrobe (not band wardrobe) would be a result of the style

> ok im thinking this would be part of the onboarding from the website

> we should likely create the entry site aswell

> or maybe its part of the registrar

> this is how the user create their account profile

> the user creates their credentials just like any other platform from the website. you signup add your email/password, then you enter your location and favorite music community

> then you are dropped into your homescene

> actually the user's profile is displayed when another user clicks on their avatar from a feed card or something. however their profile is displayed in their "space"

> well the user see's their stats and what not in the expanded topshell

> that way it doesnt takeup space in the collection /space

> so does it make sense for the user to edit info in this space? probably not, it actually may make the most sense for them to go to the registrar and fill out profile info

> really this is where a regular user could register their band. well it is where users are supposed to go to register their band, but it makes sense if its where everyone goes to fill out their profile, and if they have to register their band then so be it

> well artists would have a separate place they would go to

> they get the other website address

> once they have filled out their listener account and registered a band

> yes the artist gets an address/ access to the music management stuff an all that ...release deck etc

> also we have talked about potentially allowing artists to register their band stuff via bandcamp / soundcloud oauth e

> right really the band would be part of their profile rather than being something seperate

> because also, there is a feature where users should register if they play an instrument so people who are looking for band members etc

> so im thinking in the registrar there should be a photo area where the user gets their photo taken, which gives them their avatar

> this works because they would also fillk out details like music styles (like we taked about)

> I think the user should have to get a photo taken rather than submit one

## Clarifications

- Website account creation is a standard credential flow: email/password, then
  location and favorite music community. The resulting context determines the
  user's initial Home Scene, which is their first signed-in destination.
  - Type: settled founder direction; owner-spec promotion pending
  - Likely owner: `docs/specs/users/onboarding-home-scene-resolution.md`
- Registrar is proposed as the official account-profile record for all signed-in
  users. A user who registers a band receives a separate artist website address
  after completing their listener account and band registration. That artist
  address grants access to artist/source music-management surfaces, including
  Release Deck. The exact route and handoff between that address and existing
  Registrar filings needs owner-spec reconciliation.
  - Type: mixed; profile and post-registration artist handoff are founder
    direction, but current routing behavior requires review before implementation
  - Likely owner: `docs/specs/system/registrar.md`
- A user's band/source is part of their profile through a relationship and
  role, rather than a detached second user account. The source still retains
  separate public and operational surfaces.
  - Type: settled founder direction
  - Likely owner: `docs/specs/users/identity-roles-capabilities.md`
- Provider-assisted artist/band registration or profile prefill through
  Bandcamp and/or SoundCloud OAuth is a potential future path. It does not
  confirm provider capability, permissions, artist consent, data scope, or an
  MVP dependency.
  - Type: deferred integration idea; extends
    `2026-07-06_provider-agnostic-artist-linking.md`
  - Likely owner: `docs/specs/users/artist-profile-and-source-dashboard.md`
    and `docs/specs/media/release-deck-and-eligibility.md`
- Registrar should eventually record musician identity, including instruments
  played, to support a future band-member discovery feature.
  - Type: future feature; visibility, search, and availability behavior are
    not yet defined
  - Likely owner: user identity/profile spec to be identified
- The Registrar profile area requires a guided live camera capture that creates
  the user's UPRISE avatar. It does not offer local-file photo submission.
  Music-style answers provide the avatar's starting style context.
  - Type: design direction; runtime/provider, privacy, retention, consent,
    and moderation remain open
  - Likely owner: onboarding/profile spec plus a future avatar-system owner
    contract
- User-specific avatars may preserve detailed facial likeness. Music style may
  affect hair and starter non-band wardrobe direction, but the system should
  be adjusted through testing rather than expanded before the first quality
  evaluation.
  - Type: design direction
  - Likely owner: avatar-system design contract
- The signed-in user sees personal stats in the expanded top shell so the
  collection/Personal Space remains focused on avatar, collection, equipped
  gear, and later decoration. Structured profile edits belong in Registrar.
  - Type: design direction; detailed controls and routes remain open
  - Likely owner: Home Scene/Plot and Registrar specs
- Another listener reaches the public listener profile by selecting the user's
  avatar from a Feed card or another public surface. This is distinct from the
  signed-in user's own expanded top shell and Personal Space presentation.
  - Type: design direction
  - Likely owner: listener profile/Home Scene spec

## Feature Sets

- Website entry and Home Scene onboarding
  - Raw basis: "you signup add your email/password, then you enter your
    location and favorite music community" and "then you are dropped into your
    homescene"
  - Included behavior:
    - simple credential creation on the website;
    - location and favorite music-community collection;
    - first signed-in destination is the resolved Home Scene.
  - Excluded / not activated:
    - implementation of auth, location authority, or a new entry-site route.
  - Status: founder direction; owner-spec promotion pending.

- Registrar account profile and source relationships
  - Raw basis: "this is how the user create their account profile" and "the
    band would be part of their profile rather than being something seperate"
  - Included behavior:
    - Registrar as the proposed structured profile workspace;
    - artist/band registration from that workspace;
    - a separate artist website address after listener account completion and
      band registration, with access to music-management surfaces including
      Release Deck;
    - potential provider-assisted data prefill/registration after provider
      capability and consent review;
    - future instruments/roles for band-member discovery;
    - source membership/role relationship rather than a second user account.
  - Excluded / not activated:
    - the artist-site route/address, source-dashboard consolidation, source
      permission changes, public musician discovery, or source registration
      rule changes;
    - assumed Bandcamp/SoundCloud OAuth, provider data access, automatic import,
      or an integration dependency for MVP.
  - Status: founder direction; implementation blocked on owner-spec
    reconciliation.

- Photo-guided, style-aware avatar setup
  - Raw basis: "there should be a photo area where the user gets their photo
    taken, which gives them their avatar"
  - Included behavior:
    - photo-derived UPRISE avatar;
    - detailed personal facial likeness;
    - user-selected expression and bounded random/style settings;
    - style-aware initial non-band wardrobe from approved UPRISE assets;
    - separately equipable approved wardrobe after creation.
  - Excluded / not activated:
    - generated or baked-in band wardrobe;
    - photo/provider/privacy implementation;
    - unlimited style taxonomy, automatic personality inference, or automatic
    profile completion.
  - Status: design direction; first quality test required.

- Listener identity surfaces
  - Raw basis: public profile via avatar click, stats in expanded top shell,
    profile/collection context in Personal Space.
  - Included behavior:
    - public profile opens from a listener avatar on a public surface;
    - expanded top shell carries personal stats;
    - Personal Space avoids dashboard/form density.
  - Excluded / not activated:
    - specific routes, edit controls, public data fields, or social-profile
    mechanics.
  - Status: design direction.

## Working Interpretation

- Keep website sign-up intentionally small. It establishes credentials and
  Home Scene context, then loads the user into their Home Scene.
- Treat Registrar as the proposed authoritative structured-profile workspace
  after sign-in. After a user completes their listener account and registers a
  band, they receive a separate artist website address. This is broader than
  the current active Registrar owner spec, so it must be reconciled before
  implementation.
- Treat the avatar as a photo-derived, detailed user identity whose first
  non-band wardrobe bundle is selected from style-aware approved assets. Gear
  and later wardrobe changes remain modular.
- Keep the user-facing Home Scene, expanded top shell, Personal Space, public
  listener profile, and artist/source management surfaces as distinct
  presentations.
- The first delivery should be a narrow quality experiment before a full
  avatar creator or wardrobe economy is built.

## Promotion Targets

- Owner spec: `docs/specs/users/onboarding-home-scene-resolution.md` for the
  website sign-up to initial Home Scene sequence.
- Owner spec: `docs/specs/system/registrar.md` for any expanded Registrar
  account-profile responsibility.
- Owner spec: `docs/specs/users/identity-roles-capabilities.md` for person to
  source membership/role relationships and eventual musician profile fields.
- Owner spec: `docs/specs/users/artist-profile-and-source-dashboard.md` for
  the separate artist address and its music-management access boundary.
- Existing founder evidence:
  `docs/founder-sessions/2026-07-06_provider-agnostic-artist-linking.md` for
  the provider-agnostic source-linking boundary.
- Design contract:
  `art/avatar-system/specifications/photo-guided-avatar-and-promotional-wearables-design-spec.md`.
- Decision record: `docs/specs/DECISIONS_REQUIRED.md` for photo handling,
  avatar-provider, musician-discovery visibility, and profile/public-surface
  decisions before runtime work.

## Do Not Drift

- Do not treat band/source membership as a second listener account or collapse
  source public/operational surfaces into the listener profile.
- Do not assume the separate artist website address is the current Registrar
  route or invent its route, authentication handoff, or dashboard behavior.
- Do not place Release Deck or other artist/source music-management controls in
  the listener Home Scene, expanded top shell, or Personal Space.
- Do not claim Bandcamp or SoundCloud OAuth/data-import capability, or make it
  a prerequisite for artist registration, without verified provider and owner
  contracts.
- Do not put personal stats or structured profile forms into Personal Space.
- Do not make the public listener profile a generic social-media page.
- Do not infer a user's personality, identity, or music style from their photo.
- Do not add a local-file photo upload/submission path to the avatar flow; the
  likeness reference must come from the guided live camera capture.
- Do not treat the proposed broadened Registrar responsibility as implemented
  runtime behavior until the owner specs reconcile it.
- Do not build public musician discovery, photo storage, avatar generation,
  new auth behavior, or source registration changes from this capture alone.
