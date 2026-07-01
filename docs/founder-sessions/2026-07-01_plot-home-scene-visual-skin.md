# Plot / Home Scene Visual Skin Founder Session

Status: raw founder-session capture
Date: 2026-07-01
Source: current Codex chat/session
Related lane(s): UX_UI, onboarding-home
Owner spec candidates: docs/specs/communities/plot-and-scene-plot.md; docs/specs/users/onboarding-home-scene-resolution.md

## Raw Founder Notes

> so the last one is the most recent, they should all be the same architecturally we did work out how the  user changes between mutiple homescene communities thats the main difference with the last one however the roller idea was supposed to be like a roladex for changing the community name in the tite but instead the user would jsut hit the arrows left or right to  change the community

> correct.  I think i still have the agent open where this conversation was had, unless that conversation was with you

> where we were talking  about the ui design, what changes between communities etc

> yep this is all documented then correct?

> ok as long as you still have the conversation, what we discussed so we dont have to revisit, I know I gave a prompt to cloud for the color / scene profile

> ok so from now on when we have brainstorming conversations, or when i go to make a large clarification it is important that we extract it word for word and save it to a founder sessions doc. then you can just remember the context that you need to remember but all of it is saved in a seperate document for me to remember and for you to call upon for full details ok?

> there should be two sections in the doc clarifications and featuresets. so everytime when  it comes to bug fixes and the like I will say EXACTLY what needs to happen and it wont get recorded in its entirety and features end up not getting implemented correctly so this isnt just for feature brainstorms like the  ui stuff, but also there will be  little things all over that will save a lot of time if they get stashed in a seperate place, and i will know if/when it comes up and I can tell the agent where to go to get the full detaisl

> there is no homescene roller kill the word roller

> if anything what makes the user change from one homescene to another homescene is the homescene swiper / selector depending on if the user selects the arrows or just swipes the upper part of the app

> so the print shop is only source facing

> this should be availableyes this is correct

## Clarifications

### Home Scene Swiper / Selector Presentation

- The latest/current model is the reference point for Home Scene switching.
- The preserved UX branches should be treated as architecturally related references, but not merged wholesale.
- The Home Scene swiper/selector changes the active community title/context through left/right arrows or horizontal swipe in the upper part of the app.
- The former `roller` term is stale/deprecated and should not be used for active user-facing or agent-facing Home Scene switching language.
- Type: settled
- Likely owner: docs/specs/users/onboarding-home-scene-resolution.md; docs/agent-briefs/UI_CURRENT.md; apps/web/src/app/plot/page.tsx; apps/web/__tests__/plot-ux-regression-lock.test.ts

### Founder Session Capture Workflow

- Long brainstorming sessions and precise bug-fix instructions should be preserved word-for-word before summarization.
- Founder-session notes should separate `Clarifications` from `Feature Sets` so exact implementation details do not get compressed into vague product summaries.
- This applies to small bug-fix/edge-case instructions as well as large feature-design conversations.
- Type: settled workflow rule
- Likely owner: local Codex skill `uprise-founder-session-capture`; docs/specs/system/documentation-framework.md if the repo workflow needs a durable agent-facing patch later

### Print Shop Source-Facing Boundary

- Print Shop is source-facing only.
- Print Shop should remain available from source-facing context; source-facing means scoped to source operations, not removed or hidden from eligible source users.
- It should not be treated as a listener-facing utility, a listener profile action, or general Plot dashboard action.
- This is already covered by active docs: `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md` and `docs/specs/events/events-and-flyers.md`.
- Type: settled; already documented
- Likely owner: docs/specs/events/events-and-flyers.md; docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md; apps/web source-dashboard/print-shop surfaces

## Feature Sets

### Fixed Plot/Home Shell + Variable Community Visual Skin

- Raw basis: founder asked what changes between communities and confirmed the discussion should not be revisited.
- Included behavior:
  - Plot/Home architecture remains the same across communities.
  - Switching communities changes active Home Scene context and visual skin, not the screen architecture.
  - The active title may be `Austin Punk` or equivalent `city + music community` identity text.
  - Variable visual-skin candidates include title/wordmark treatment, backdrop/skyline, genre/community overlay, color profile, and possibly player accents.
  - The fixed shell keeps the avatar/player/profile pull-down, Feed/Events/Archive, feed card taxonomy, Home Scene swiper/selector behavior, profile/collection workspace, and action boundaries stable.
- Excluded / not activated:
  - No one-off community architecture by city or genre.
  - No full visible Home Scene preference-management list in the Home shell.
  - No saved Away Scenes in the Home Scene selector.
  - No runtime implementation is approved by this note alone.
- Status: design clarification; implementation requires a separate approved UX extraction/design slice

## Working Interpretation

- The current UX extraction target should preserve `main` as authority and use the UX prototype branches only as references for layout/state/component ideas.
- The immediate product rule is not to redesign community switching from scratch: keep arrows/swipe as the active Home Scene swiper/selector.
- Community-specific visual identity should be modeled as a skin/profile over an invariant Plot/Home architecture.
- Raw founder-session capture is now the preferred way to avoid losing exact wording from both big feature discussions and small bug-fix clarifications.

## Promotion Targets

- Owner spec: docs/specs/users/onboarding-home-scene-resolution.md for Home Scene switcher/member preference behavior if wording is ambiguous.
- Owner spec: docs/specs/communities/plot-and-scene-plot.md for fixed shell plus variable visual-skin boundaries if/when visual identity becomes implementation scope.
- Lane brief: docs/agent-briefs/UI_CURRENT.md if agents need a short routing note for community visual skins.
- Tests/runtime: apps/web/src/app/plot/page.tsx and apps/web/__tests__/plot-ux-regression-lock.test.ts for any presentation extraction.
- Tooling: local skill `uprise-founder-session-capture` now owns the capture habit for future sessions.

## Do Not Drift

- Do not treat old UX prototype branches as merge candidates.
- Do not reintroduce old `Promotions`, `Statistics`, or `Social` Plot tabs from prototype branches.
- Do not call the Home Scene swiper/selector a `roller` in active docs, code, tests, or user-facing copy.
- Do not turn the Home Scene selector into a full preference-management list.
- Do not put saved Away Scenes in the Home Scene selector.
- Do not model Print Shop as listener-facing Plot/profile functionality.
- Do not vary app architecture per community; vary only data/context and approved visual skin layers.
- Do not summarize exact founder bug-fix instructions without preserving the raw wording somewhere durable first.
