# Public Launch Terminal UX Plan

Status: design-only handoff; visual direction favored, exact mockup approval pending
Package: `public-launch-terminal`
Design lane: `uprise-design-ui`
Durable owner contract: not yet assigned

## Purpose

Define the design-owned hierarchy, visible states, responsive behavior,
accessibility expectations, asset needs, and implementation boundaries for the
first public UPRISE launch-terminal screen. This is a public information
surface, not the listener Home/Plot experience, the in-app Feed, RADIYO,
Registrar, account creation, or a generic marketing site.

It does not authorize data models, routes, authentication, mailing-list
storage, content management, audio hosting, or launch-state logic. Those need
an owner contract before runtime implementation.

## Evidence Used

- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/specs/system/documentation-framework.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/founder-sessions/2026-07-29_public-signal-archive-and-entry-door.md`
- `art/mockups/website/2026-08-01_uprise-tower-descent-storyboard/sequence-notes.md`
- candidate terminal visual recorded in the adjacent visual handoff

## Product Boundary

### This screen is

- a public prelaunch information shell;
- a curated archive of team-published community updates called Dispatches;
- a concise route to public Blog, System, and Contact information;
- a place to visually reserve email update intake, pending a delivery/storage
  owner contract;
- the visual endpoint of the future underground laptop reveal, without
  implementing that transition in this slice.

### This screen is not

- Home, Plot, Feed, Events, Archive, RADIYO, listener profile, Collection,
  Artist Profile, Source Dashboard, or Registrar;
- a real secure/encrypted/private network, account gate, passcode mechanism,
  discussion board, community chat, or social timeline;
- an account-registration substitute or a path that joins a listener to a Home
  Scene;
- a promise that email intake creates an account, grants access, or subscribes
  a person to a local community.

## First Vertical Slice

**Public terminal shell with Dispatches selected.**

The first implementation/design slice should render one public desktop-first
screen with:

1. UPRISE identity and low-emphasis public status on the left;
2. top-level navigation: `Dispatches`, `Blog`, `System`, `Contact`;
3. a readable Dispatch Index as the main body;
4. one expanded dispatch with a short excerpt, optional audio treatment, and
   transcript affordance;
5. a right utility rail that provides section context, a visually reserved
   email-updates input, and contact context.

Do not implement the other sections' route/content behavior as part of this
slice. Their existence is a navigation and information-architecture decision,
not permission to invent their data or bodies.

## Screen Hierarchy

### 1. Terminal chrome

- Decorative worn-laptop frame at large desktop sizes only.
- The actual page landmark starts inside the frame; the physical-bezel look is
  decorative and must not carry controls or required copy.
- Visual language: xerox black/charcoal field, paper flecks, muted amber/olive
  type and fine rules. There is no bright lime, neon glow, cyberpunk styling,
  surveillance language, or fake security claim.

### 2. Global public navigation

- A semantic `nav` at the upper right/upper center.
- `Dispatches` is initially selected.
- `Blog`, `System`, and `Contact` are equally legible, compact peer items.
- `System` means a public explanation of how UPRISE works. It is not a system
  dashboard or account settings surface.
- The active section needs a text label plus non-color treatment such as an
  underline/rule; amber color alone is insufficient.

### 3. Identity and mission rail

- UPRISE wordmark.
- Low-emphasis `Public archive` or equivalent public-context label.
- Small tower/signal mark and a short mission excerpt.
- A plainly stated status such as `Public archive active`; do not call it
  secure, encrypted, hidden, or private.
- Keep this rail informational. It must not become a signup/login panel.

### 4. Main content: Dispatch Index

- Heading: `Dispatch Index`.
- Helper copy: team-published updates for the community, never a live
  user-generated feed.
- Four compact numbered rows establish scan rhythm. Each needs a title,
  category/type label, date, and disclosure indicator.
- One selected row expands in-place with:
  - short dispatch/mission excerpt;
  - optional narrated transmission module;
  - explicit `Play` control only when a playable audio source exists;
  - a transcript link/control only when transcript text exists.
- The Index ends as content, not as a hard-coded false claim about the product
  history.

### 5. Right utility rail

- `About this section` explains what Dispatches represent.
- `Receive dispatches` reserves email collection. The visual input may appear
  in the target, but does not submit or persist until a mailing-list contract
  exists.
- `Contact` is a small public-channel bridge. It may show a final approved
  contact destination later; do not invent a contact form, message board, or
  inbox.

## Interaction Notes

### Current-design interaction

- Selecting a global nav item changes the visible public-information section.
  The content source, URL/routing model, and transition behavior are open.
- Selecting a dispatch row expands it and collapses the previously expanded
  row. If this becomes an accordion, use one well-defined selected item rather
  than multiple uncontrolled expansions.
- `Play` starts/stops only a provided narrated-audio asset. It is not RADIYO,
  a music player, a live broadcast, or an autoplay experience.
- `View transcript` reveals/opens the matching text transcript. It must remain
  reachable without audio.
- The email field needs no claimed behavior in the first slice. Do not show a
  fabricated success state, account creation, verification, or opt-in result.
- Contact navigation must lead only to a founder-approved public endpoint when
  implemented.

### Motion relationship

- The terminal is the eventual final frame of the approved tower descent.
- This first slice opens directly to the terminal. It does not implement the
  descent, concrete transition, laptop zoom, launch ascent, QR handoff, or
  Registrar/account onboarding.
- Any ornamental scanline/noise must be subtle and disabled or reduced for
  `prefers-reduced-motion`.

## Key States

| State | Required presentation | Do not imply |
| --- | --- | --- |
| Ready / Dispatches | One selected dispatch, collapsed peers, stable navigation | live community feed or real-time telemetry |
| No dispatches | Plain archive-empty message with no urgency CTA | a failed launch, account waiting list, or broken community |
| Dispatch loading | Preserve row geometry with readable loading text/skeletons | that data is encrypted or being retrieved from a private network |
| Dispatch unavailable | Plain recovery message; actual retry behavior is implementation-owned | false outage detail or unauthorized support channel |
| Audio available | Native/accessible play control, duration when supplied, transcript route/control | RADIYO playback or autoplay |
| Audio unavailable | Excerpt/transcript stays usable without a disabled decorative player | an audio asset exists |
| Email input idle | Labeled input, concise purpose, no implied account relationship | subscription completion or access grant |
| Email validation/submission | Deferred until provider, consent, retention, and delivery contracts exist | a silent or invented submission result |
| Contact unavailable | Omit the contact action or show approved static information | a message form, DM, or staff inbox |

## Accessibility And Mobile Notes

### Accessibility

- Use landmarks: `header`, `nav`, `main`, and complementary/aside regions.
- Navigation and disclosure controls must be keyboard reachable with visible
  focus treatment that passes contrast against the charcoal surface.
- Use button semantics and `aria-expanded`/`aria-controls` for expandable
  dispatch rows; do not make the full row a non-semantic clickable `div`.
- Do not encode selected state, service status, or section meaning in olive/
  amber color alone.
- The narrated module needs a real name, play/pause state, elapsed/duration
  text when available, and transcript access. Never autoplay narration.
- The email control requires a visible label, not placeholder-only text. Any
  error/success announcement must use an appropriate live region once real
  submission behavior is defined.
- Xerox texture must stay behind content and never lower text/control contrast.

### Mobile

- Target continuation: `390 x 844`.
- Remove the decorative laptop bezel; keep the terminal surface edge-to-edge
  with a restrained outer boundary.
- Keep the global navigation at the top as either a visible horizontal row or
  an accessible compact navigation control. Do not hide sections behind an
  unlabeled icon.
- Order: global navigation, identity/status, selected Dispatch content,
  remaining dispatch rows, email/contact utility content.
- Stack the left/right rails below the selected Dispatch content; do not reduce
  text below readable size to preserve the desktop three-column geometry.
- Large tap targets and explicit disclosure labels outrank visual density.

## Asset Needs

No generated asset is approved for repo storage yet.

| Asset | Use | Status / constraint |
| --- | --- | --- |
| Candidate desktop terminal mockup | Primary visual reference | Generated for UPRISE; founder likes the visual direction but has not explicitly approved the exact image for repo storage. |
| UPRISE wordmark | Header identity | Use an approved brand asset or text treatment only; do not extract from a generator output without approval. |
| Tower/signal mark | Low-emphasis public status marker | Reuse/approve a dedicated UPRISE mark; never imply live signal or community data. |
| Texture treatment | Terminal background | Prefer CSS/noise treatment or approved repo texture; must not impair contrast. |
| Narrated audio / transcript | Expanded dispatch | Requires a content owner, rights, hosting, transcript, and accessibility decision. |

## Explicit Do Not Build / Design

- Feed cards, listener avatars, RADIYO transport, music playback, action wheel,
  Home Scene selector, events carousel, player inventory, or in-app bottom nav.
- Account login, OAuth, credentials, ZIP/passcode, secret phrase, authentication
  bypass, registration, GPS, selfie capture, or Home Scene enrollment.
- User comments, replies, DMs, chats, message board, community submissions, or
  an "ask a question" workflow.
- Fabricated secure/encrypted link status, numbered field nodes, surveillance
  language, security theater, military framing, or real-world political group
  framing.
- Corporate hero layout, conversion countdowns, upgrade/buy/join CTAs, fake
  progress metrics, newsletters that silently create accounts, or urgency
  marketing.
- The tower descent/ascent animation, laptop transition, QR bridge, or any
  source/artist/admin feature.

## Founder / Product Questions

1. Who owns and publishes Dispatches, Blog, System, and Contact content, and
   what moderation/review process applies before public publication?
2. Are these sections distinct routes, client-side panels, or a content-driven
   one-page archive? The visual direction permits any of the three.
3. What public Contact destination is allowed at launch: email address, form,
   Discord/community destination, or none?
4. Does `Receive dispatches` ship at launch? If yes, who owns consent copy,
   data retention, provider selection, double opt-in, unsubscribe, and email
   delivery?
5. Is narrated manifesto/dispatch audio launch scope? If yes, who owns the
   script, voice rights, audio hosting, transcript, and playback analytics?
6. What does a dispatch represent: only founder/team notes, or also curated
   public updates from authorized UPRISE operations? It must not become a
   user-generated Feed.
7. When the entry door activates, where is its visual/home in this shell, and
   what owner spec controls its transition into standard account onboarding?

## Executor Acceptance Criteria

An implementation/design executor may treat this handoff as correctly applied
only when:

- Dispatches, Blog, System, and Contact are visible public information peers;
  Dispatches is initially selected.
- The selected Dispatch Index remains a curated team-update archive, not a
  listener Feed.
- The visual laptop/terminal treatment is decorative around semantic content
  and does not obstruct mobile or keyboard use.
- The screen has no account/auth/RADIYO/Feed/Registrar claims or controls.
- Any email, contact, audio, or navigation behavior not backed by a future
  owner contract is rendered as non-functional visual context or omitted.
- The tower descent remains separate future motion work, and this terminal can
  render directly as a standalone public screen.
