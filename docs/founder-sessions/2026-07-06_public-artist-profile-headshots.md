# Public Artist Profile Member Headshots Founder Session

Status: raw founder-session capture
Date: 2026-07-06
Source: current chat/session
Related lane(s): ARTIST_SOURCE, UX_UI, IDENTITY
Owner spec candidates: `docs/specs/users/artist-profile-and-source-dashboard.md`; `docs/specs/users/identity-roles-capabilities.md`

## Raw Founder Notes

> this is great, and this is a good point, I think for the listener side it
> should be the artists headshots (if they have them) as its the lister
> accounts that are avatars

## Clarifications

- Public listener-side Artist Profile member display should prefer artist/member
  headshots when the source has them.
- Listener-account avatars are a separate identity surface and should not be
  treated as the default public band-member image.
- Public headshot display and listener-account avatar/profile linking remain
  separate concerns.

## Feature Sets

- Public Artist Profile member identity display
- Raw basis: "for the listener side it should be the artists headshots (if they
  have them) as its the listener accounts that are avatars"
- Included behavior:
  - Use source-provided artist/member headshots for public member display when
    available.
  - Keep member display name and what they play/contribute near the headshot.
  - Treat listener-account avatars as account identity, not the public
    band/member image by default.
- Excluded / not activated:
  - No public listener-to-artist DM.
  - No automatic use of private listener-account avatars on public band pages.
  - No public listener-account profile link until privacy/routing contracts
    explicitly allow it.
- Status: settled design/product boundary; storage, fallback, and privacy
  contracts still require implementation detail.

## Working Interpretation

The public Artist Profile should make the band/source feel real to listeners by
showing artist/member headshots when supplied by the source. A registered
UPRISE listener account can still have its own avatar, but that account avatar is
not the default public member image. Any future public link from a member image
to a listener account/profile needs explicit identity routing and privacy rules.

## Promotion Targets

- Owner spec: `docs/specs/users/artist-profile-and-source-dashboard.md`
- Owner spec: `docs/specs/users/identity-roles-capabilities.md`
- Design package: `docs/screen-packages/artist-profile-source-dashboard/design-spec/public-artist-profile-design-inventory.md`
- Art handoff: `docs/screen-packages/artist-profile-source-dashboard/art-handoff/public-artist-profile/`

## Do Not Drift

- Do not use listener-account avatars as default public band/member headshots.
- Do not expose private listener-account avatars, emails, or account identity
  data on the public Artist Profile without privacy/routing approval.
- Do not turn member headshots into DM, inbox, or private contact entry points.
- Do not expose member permission controls on the public Artist Profile.
