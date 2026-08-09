# Instruction Packet: Public Launch Terminal

Status: design-only package seed
Lane: `uprise-design-ui`
Durable owner contract: not yet assigned

## Goal

Turn the founder-favored public terminal direction into a small, accessible
public-information surface without importing Home/Plot, RADIYO, Registrar,
authentication, or generic marketing-site behavior.

The initial selected section is `Dispatches`: a curated index of team-published
community updates. `Blog`, `System`, and `Contact` are public-information peers
in the shell, but their content and routing contracts remain open.

## Must Read

- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/specs/system/documentation-framework.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/founder-sessions/2026-07-29_public-signal-archive-and-entry-door.md`
- `docs/screen-packages/public-launch-terminal/source-map.md`
- `docs/screen-packages/public-launch-terminal/design-spec/ux-plan.md`
- `docs/screen-packages/public-launch-terminal/art-handoff/public-launch-terminal/spec/2026-08-04_public-launch-terminal-visual-handoff-v01.md`

## Expected Design Outcome

- Public terminal shell with visible `Dispatches`, `Blog`, `System`, and
  `Contact` navigation.
- Dispatches initially selected, rendered as a curated archive rather than a
  user/community Feed.
- Optional narrated-transmission presentation that remains usable without
  audio through a transcript.
- Laptop/xerox/amber visual language that is decorative around semantic,
  readable content and collapses cleanly on mobile.

## Stop Conditions

Stop and escalate rather than inventing behavior when work requires:

- a route/navigation model or content source for public sections;
- dispatch publishing, timestamps, moderation, or public data contracts;
- email collection, consent, persistence, delivery, or unsubscribe behavior;
- audio hosting, voice rights, transcript sourcing, playback analytics, or
  autoplay;
- contact form, inbox, community-message feature, login, passcode, QR bridge,
  account creation, or Home Scene enrollment;
- a new owner spec or a revised founder decision.

## Explicitly Out Of Scope

- Home/Plot/Feed/Events/Archive, RADIYO/player, listener profile/Collection,
  Artist Profile, Source Dashboard, and Registrar UI.
- Account/OAuth/GPS/avatar/onboarding behavior.
- Real security/encryption/private-network claims.
- Community discussions, messages, DMs, comments, or user-submitted updates.
- Tower descent/ascent motion and the activation/entry-door flow.
