# RADIYO / Track Mode Player Terminology Founder Session

Status: raw founder-session capture
Date: 2026-07-02
Source: current chat/session
Related lane(s): `UX_UI`, `ACTIONS_SIGNALS`
Owner spec candidates: `docs/agent-briefs/UI_CURRENT.md`, `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`, `docs/specs/communities/plot-and-scene-plot.md`

## Raw Founder Notes

> yeah this should be thought of as listening to the radiyo or track mode I guess

## Clarifications

- The current player distinction should be conceptualized as listening to `RADIYO` versus listening in `track mode`.
- Type: terminology clarification / implementation detail
- Likely owner: `apps/web/src/components/plot/RadiyoPlayerPanel.tsx`, `apps/web/src/app/plot/page.tsx`, `docs/agent-briefs/UI_CURRENT.md`, `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`

## Feature Sets

- Player mode vocabulary
- Raw basis: "listening to the radiyo or track mode"
- Included behavior:
  - Future player/player-contract language should consider whether `SPACE` is too abstract for the user-facing or developer-facing concept.
  - The semantic split remains broadcast listening versus selected-track/listening-context mode.
- Excluded / not activated:
  - This note does not itself rename runtime `SPACE` mode, change action grammar, or alter player behavior.
  - This note does not settle final user-facing copy.
- Status: open / terminology direction

## Working Interpretation

- Existing code currently uses `RADIYO` and `SPACE`.
- Founder clarification suggests the product concept may be clearer as `RADIYO` versus `track mode`.
- Before implementation, we should decide whether this is:
  - user-facing copy only,
  - internal type rename from `SPACE` to `TRACK`, or
  - a hybrid where runtime remains `SPACE` while UI says `Track Mode`.

## Promotion Targets

- Owner spec: `docs/specs/communities/plot-and-scene-plot.md` if the formal Plot/player contract changes.
- Lane brief: `docs/agent-briefs/UI_CURRENT.md` for visible player wording.
- Lane brief: `docs/agent-briefs/ACTIONS_AND_SIGNALS.md` if action-wheel labels/mode ownership changes.
- Tests/runtime: `apps/web/__tests__/plot-ux-regression-lock.test.ts`, `apps/web/__tests__/plot-profile-player-state-contract.test.ts`, `apps/web/src/components/plot/RadiyoPlayerPanel.tsx`, `apps/web/src/app/plot/page.tsx`.

## Do Not Drift

- Do not treat this as permission to change playback behavior without a scoped implementation decision.
- Do not reintroduce generic streaming-app language.
- Do not assume `SPACE` is final user-facing terminology without checking this note.

## Raw Founder Notes Addendum

> the internal can stay space and radiyo space refers to the users profile space where they select tracks from their collection

## Clarifications Addendum

- Internal runtime terminology may remain `SPACE`.
- `RADIYO` refers to broadcast listening.
- `SPACE` refers to the user's profile space where they select tracks from their collection.
- User-facing/player concept may still be described as track-mode listening when helpful, but the internal `SPACE` term is not stale or wrong.
- Type: settled terminology clarification
- Likely owner: `apps/web/src/components/plot/RadiyoPlayerPanel.tsx`, `apps/web/src/app/plot/page.tsx`, `docs/agent-briefs/UI_CURRENT.md`, `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`

## Working Interpretation Addendum

- Do not rename the internal `SPACE` mode just because `Track Mode` is clearer in conversation.
- Treat `SPACE` as the profile/collection listening context.
- If visible copy changes later, it should clarify the selected-track/profile-space behavior without removing the internal `SPACE` model.

## Do Not Drift Addendum

- Do not classify `SPACE` as stale internal language.
- Do not replace `SPACE` with a new internal `TRACK` mode unless explicitly scoped later.
- Do not detach `SPACE` from the listener profile/collection workspace.

## Raw Founder Notes Addendum 2

> user should be able to pull down the player select a new uprise and flip it back up to change to custom uprises (keeping them their in their community)

## Clarifications Addendum 2

- The player pull-down profile/collection workspace should let the user select a saved/custom Uprise from their profile space.
- After selecting that Uprise, the user can flip/collapse the player back up and the active listening context changes to that selected custom Uprise.
- This should keep the user rooted in their current Home Scene/community; selecting a custom Uprise from the profile space is not Discover transport and does not move the user into an Away Scene/member Plot.
- Type: implementation clarification / future behavior lock
- Likely owner: `apps/web/src/app/plot/page.tsx`, `apps/web/src/components/plot/PlotListenerProfile.tsx`, `apps/web/src/components/plot/RadiyoPlayerPanel.tsx`, `docs/agent-briefs/UI_CURRENT.md`, `docs/specs/communities/plot-and-scene-plot.md`

## Working Interpretation Addendum 2

- Pulling down the player opens the user profile/collection `SPACE` surface.
- Selecting a saved/custom Uprise changes the personal listening context.
- Collapsing the profile/player back up should preserve the selected custom Uprise listening context while the surrounding Plot/Home Scene remains the user's current community.
- This reinforces the distinction between changing listening context and transporting to another community.

## Do Not Drift Addendum 2

- Do not treat selecting a saved/custom Uprise from the profile as leaving the Home Scene.
- Do not route this through Discover transport.
- Do not move the user into another community's Plot/member dashboard from this action.
- Do not confuse custom Uprise listening with changing Home Scene voting authority.

## Raw Founder Notes Correction

> nope only when they are in discover and when they are in discover the top shell isnt there for them to play anything from their collection

## Clarifications Correction

- Correction to Addendum 2: selecting/playing custom or saved Uprises from the user's collection is only for the Discover context.
- In Discover, the Plot top shell is not present.
- The user should not use the Plot top shell/player pull-down to play collection/custom Uprises from inside Plot.
- Type: stale correction / settled behavior clarification
- Likely owner: `docs/specs/communities/discovery-scene-switching.md`, `docs/agent-briefs/UI_CURRENT.md`, `docs/specs/communities/plot-and-scene-plot.md`, future Discover runtime files.

## Working Interpretation Correction

- Plot remains the Home Scene dashboard/neighborhood and should not become the collection/custom-Uprise playback launcher.
- Discover owns collection/custom-Uprise exploration/playback behavior.
- If the user is in Discover, the top Plot shell is absent, so collection playback must be designed in the Discover surface/player context rather than the Plot top shell.
- Addendum 2 above should be treated as superseded by this correction where it implies Plot pull-down collection Uprise playback.

## Do Not Drift Correction

- Do not implement saved/custom Uprise playback from the Plot top shell.
- Do not treat the Plot profile pull-down as the launcher for collection/custom Uprises.
- Do not keep using Addendum 2 as current truth where it conflicts with this correction.
- Do not add Discover playback controls into the Plot top shell.
