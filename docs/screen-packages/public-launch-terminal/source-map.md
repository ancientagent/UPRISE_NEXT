# Source Map: Public Launch Terminal

Status: design-only package source map

## Durable Specs

- `docs/specs/users/onboarding-home-scene-resolution.md` - only the later,
  conventional account/Home Scene onboarding boundary; it does not own the
  public terminal.
- `docs/specs/system/documentation-framework.md` - owner-contract and handoff
  promotion rules.

## Founder / Visual Direction

- `docs/founder-sessions/2026-07-29_public-signal-archive-and-entry-door.md`
  - raw founder direction, clarifications, open decisions, and do-not-drift
  rules.
- `art/mockups/website/2026-08-01_uprise-tower-descent-storyboard/sequence-notes.md`
  - founder-approved separate motion/keyframe direction.
- `docs/screen-packages/public-launch-terminal/design-spec/ux-plan.md`
  - current design-owned contract.
- `docs/screen-packages/public-launch-terminal/art-handoff/public-launch-terminal/spec/2026-08-04_public-launch-terminal-visual-handoff-v01.md`
  - candidate visual target and storage/approval boundary.

## UI / Runtime Context

- `docs/agent-briefs/UI_CURRENT.md` - active in-app UI boundaries that this
  public terminal must not absorb.
- `apps/web/src/components/auth/EntryAccountPanel.tsx` - adjacent existing
  entry/auth surface only; it is not authority for the public terminal.

No dedicated public-launch-terminal runtime route or component was found in
the current worktree during this design handoff. Do not create one until an
owner contract assigns the public-site content, routing, and integration rules.

## Required Future Owner Contract

Before a Dev Spec or runtime slice, establish one public-site/launch owner
contract covering:

- section/routing model for Dispatches, Blog, System, and Contact;
- dispatch source, authorship, moderation/review, visibility, and timestamps;
- email collection/provider/consent/retention/unsubscribe behavior;
- narration/audio/transcript sources and accessibility requirements;
- contact destination and any moderation/privacy implications;
- entry-door launch state and its handoff to standard account onboarding.
