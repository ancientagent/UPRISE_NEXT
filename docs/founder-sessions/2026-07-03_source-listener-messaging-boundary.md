# Source Listener Messaging Boundary Founder Session

Status: raw founder-session capture
Date: 2026-07-03
Source: current chat/session
Related lane(s): ARTIST_SOURCE, UX_UI, ACTIONS_SIGNALS
Owner spec candidates: docs/specs/social/message-boards-groups-blast.md; docs/specs/users/identity-roles-capabilities.md; docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md; docs/agent-briefs/UI_CURRENT.md

## Raw Founder Notes

> listeners can't message an artist. there is no dm feature outside of the feed channels

## Clarifications

- Listeners cannot directly message an Artist/Band source account.
- Type: settled
- Likely owner: `docs/specs/social/message-boards-groups-blast.md`; `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`

- UPRISE should not introduce a DM feature as part of Task 11 source-dashboard/listener-profile separation work.
- Type: settled
- Likely owner: Task 11 tests/runtime boundaries; `docs/agent-briefs/UI_CURRENT.md`

- Communication outside direct source-management tools should route through feed channels or approved public/community surfaces rather than private listener-to-artist messaging.
- Type: settled, with one follow-up clarification needed on whether this also supersedes mutual-follow listener-to-listener DM language.
- Likely owner: `docs/specs/social/message-boards-groups-blast.md`

## Feature Sets

No new feature set is approved by this note. This is a boundary clarification for Task 11 and future social/messaging work.

## Working Interpretation

- The listener profile may link a managed source owner to the Artist/Source Dashboard, but it must not include a listener-to-artist message action.
- Artist Profile and Source Dashboard should not gain `Message Artist`, `DM Artist`, `Contact Artist`, or inbox-style listener DM affordances unless a future owner spec explicitly supersedes this note.
- Current social/feed-channel language needs review before implementation because the active social spec still contains mutual-follow user-to-user DM language.

## Promotion Targets

- Owner spec: `docs/specs/social/message-boards-groups-blast.md`
- Lane brief: `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- Lane brief: `docs/agent-briefs/UI_CURRENT.md`
- Tests/runtime: Task 11 listener profile/source-dashboard separation tests should reject listener-to-artist DM affordances.

## Do Not Drift

- Do not add `Message Artist`, `DM Artist`, `Contact Artist`, artist inbox, or listener-to-artist private message UI.
- Do not treat source identity access in the listener profile as permission to embed source communication tools.
- Do not add private messaging outside approved feed-channel/public-community surfaces without explicit owner-spec activation.

## Raw Founder Notes Addendum

> the registrar is the top portion of the archives page, this is how listeners become sources

## Clarifications Addendum

- Registrar belongs at the top portion of the Archive page.
- Type: settled
- Likely owner: `docs/specs/communities/plot-and-scene-plot.md`; `docs/agent-briefs/UI_CURRENT.md`; `docs/agent-briefs/REGISTRAR_GOVERNANCE.md`

- Registrar is the listener-to-source conversion path: listeners become sources through Registrar, not through embedded source tools in the listener profile.
- Type: settled
- Likely owner: `docs/specs/system/registrar.md`; `docs/specs/users/identity-roles-capabilities.md`

## Working Interpretation Addendum

- Task 11 should not remove Registrar from Archive; it should preserve Archive-top Registrar placement.
- Task 11 should reject Release Deck, Print Shop, source posting, source analytics, and direct source-admin panels inside the listener profile body.
- A listener profile may link a managed user to Artist/Source Dashboard, but becoming a source is Registrar-owned and Archive-visible.

## Raw Founder Notes Addendum 2

> please see how registrar works,  they register and receive a link that validates their login credentials as a valid source

## Clarifications Addendum 2

- Registrar should be understood as the flow where a listener registers as/for a source, then receives or uses a validation link/token path that validates their login credentials as source-authorized.
- Type: settled concept, runtime parity to verify
- Likely owner: `docs/specs/system/registrar.md`; `docs/specs/users/identity-roles-capabilities.md`

## Working Interpretation Addendum 2

- Current runtime already has source submitter authentication + GPS gating, source materialization, tokenized member invite links, invite claim auth, and membership sync.
- The current runtime does not appear to send a source-owner validation email/link for the submitting owner; the owner validates through signed-in JWT + GPS and explicitly materializes the source.
- If the intended product rule is that the source owner also receives a credential-validation link before source dashboard access, that needs an owner-spec/runtime parity slice rather than being assumed already complete.
