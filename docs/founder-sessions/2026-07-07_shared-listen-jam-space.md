# Shared Listen Jam Space Founder Session

Status: raw founder-session capture
Date: 2026-07-07
Source: current chat/session
Related lane(s): Home/Plot UI, listener profile, collection space, social/deferred V2, player
Owner spec candidates: `docs/specs/v2/listening-rooms.md`; `docs/specs/social/message-boards-groups-blast.md`; `docs/specs/communities/plot-and-scene-plot.md`

## Raw Founder Notes

> so there is a feature (to be added later) that lets users have a shared listen.  where the avatars can be invited to the users space and have a silly mini dance game

> that should be documented somewhere

## Clarifications

- Shared Listen / Jam Space is a later feature, not current MVP scope.
- Type: deferred
- Likely owner: `docs/specs/v2/listening-rooms.md`

- Shared Listen should live in the listener's decorated collection/profile space, not as a public Feed row, public Plot tab, Artist Profile action, or RADIYO/Fair Play control.
- Type: settled deferred feature boundary
- Likely owner: `docs/specs/v2/listening-rooms.md`

- The feature allows invited listener avatars to enter the user's space for shared listening and a lightweight silly mini dance interaction.
- Type: deferred feature detail
- Likely owner: `docs/specs/v2/listening-rooms.md`

## Feature Sets

- Shared Listen / Jam Space
- Raw basis: "lets users have a shared listen... avatars can be invited to the users space and have a silly mini dance game"
- Included behavior:
  - A listener can invite other listener avatars into their decorated collection/profile space.
  - The session can support synchronized listening around a selected track/session.
  - Avatars can have a lightweight playful dance/idle interaction during the shared listen.
  - The space uses the listener's public/decorated inventory atmosphere where appropriate.
- Excluded / not activated:
  - Not current MVP runtime.
  - Not a public Social tab room by default.
  - Not a Feed, comment, DM, Artist Profile, or RADIYO wheel feature.
  - Does not affect RADIYO/Fair Play voting, ranking, propagation, or civic authority.
  - Does not make private inventory items public unless the owner exposes them.
- Status: deferred / design-only

## Working Interpretation

- The preferred model is private or invite-only shared listening inside a listener-owned collection/profile space.
- This supersedes older "Listening Rooms inside the Social tab" framing where it conflicts with the user-space concept.
- The mini dance-game layer is a playful avatar interaction attached to shared listen, not a standalone game surface or public engagement mechanic.

## Promotion Targets

- Owner spec: `docs/specs/v2/listening-rooms.md`
- Lane brief: `docs/agent-briefs/UI_CURRENT.md`
- Companion spec: `docs/specs/social/message-boards-groups-blast.md`
- Runtime/tests if activated: future listener profile/collection space, player synchronization, avatar rendering, and invite-session contracts.

## Do Not Drift

- Do not implement this as a current MVP feature.
- Do not put Shared Listen in the public Feed.
- Do not make it a Social tab room by default.
- Do not make it a DM/chat/comments replacement.
- Do not let shared listening affect Fair Play, RADIYO voting, rankings, or source metrics by default.
- Do not expose private collection inventory through shared listen without explicit visibility controls.
