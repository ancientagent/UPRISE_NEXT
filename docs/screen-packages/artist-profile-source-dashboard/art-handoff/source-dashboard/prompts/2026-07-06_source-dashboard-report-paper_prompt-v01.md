# Source Dashboard Report-Paper Mockup Prompt v01

Status: prompt reference only
Date: 2026-07-06
Package: `artist-profile-source-dashboard`
Screen/section: `source-dashboard`
Target use: recreate the final Source Dashboard report-paper mockup direction if
visual generation is explicitly reopened.

Do not run this prompt automatically. Do not generate new images from this
handoff. Do not store unapproved mockups in the repo. Current generated images
remain in Codex cache and are not repo assets.

## Source Docs Referenced

- `AGENTS.md`
- `docs/screen-packages/README.md`
- `docs/screen-packages/artist-profile-source-dashboard/design-spec/source-dashboard-management-shell-layout-brief.md`
- `docs/screen-packages/artist-profile-source-dashboard/spec/source-dashboard-management-shell-dev-spec.md`
- `docs/screen-packages/artist-profile-source-dashboard/spec/source-dashboard-release-deck-readiness-dev-spec.md`
- `docs/specs/users/artist-profile-and-source-dashboard.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/specs/economy/print-shop-and-promotions.md`
- `docs/founder-sessions/2026-07-06_source-dashboard-ad-action-wheel-links.md`
- `docs/founder-sessions/2026-07-06_source-dashboard-members-feed-publishing.md`

## Prompt

Create one production-quality desktop UI mockup for the UPRISE Source Dashboard,
target dimensions `1440 x 1024`, with no browser chrome and no device frame.

The screen is a source-owner/member management surface for a registered
artist/band/source. It is not the public Artist Profile, not the listener
profile, and not Home/Plot community browsing.

Use a white official report-paper management sheet as the entire interface
language. Push the paper toward heavier xeroxed official paperwork: strong
outer borders, dark charcoal ink rules, firm row separators, compact form-like
sections, subtle print-paper texture, and no soft SaaS cards. The UI should feel
grounded, local, direct, practical, and operational.

Top command line:

- `UPRISE`
- `SOURCE DASHBOARD`
- signed-in account plus current selected-source role, for example
  `Baris - Manager`
- compact current-source selector
- `Exit to Listener Account`

The role label changes when the selected source changes. Show this as a compact
source-operating context, not as a global user badge.

Compact masthead:

- small source image/avatar and band/source name;
- `Home Scene: Austin, TX - Indie Rock` directly beneath the name;
- compact source/profile snapshot beside the source image/title, including
  followers, bio/status summary, official links/contact/donation readiness, and
  sect affiliation as pending/unset if needed;
- member avatar strip on the far right with four belly-up avatar profiles and
  names;
- optional public profile preview/open path;
- optional low-emphasis lower-right rubber-ink stamp reading `SOURCE FILE` or
  `UPRISE SOURCE RECORD`.

The stamp must look like an old imperfect rubber-ink official document mark near
the lower-right of the report sheet. It must not read as a status chip, GPS
badge, paid-status badge, validation badge, or masthead decoration.

Main report section order:

1. `Releases` / Release Deck as the first and dominant section.
2. `Release Metrics` as a compact expandable/dropdown report row below Release
   Deck, with a song selector dropdown and a separate expand/collapse affordance
   for deeper metrics.
3. `Calendar / Print Shop` as a real calendar report section with source event
   planning and flyer/print-shop path shown as design-only.
4. `Registrar` only as a subdued lifecycle stamp, utility link, or record note
   if visible.

Release Deck details:

- show exactly three active music rows/slots labeled `1`, `2`, and `3`;
- each row shows album art, song title, duration, `Release date`, source-owned
  status, and row-level validation/status;
- use `Load` as the row action label, not `View`;
- show caps clearly: `3` active music slots, `6 min max per song`, `15 min
  active total`;
- show row-level green check/status only where the row is source-owned and
  policy-valid;
- do not put a large green `Ready` chip beside the Release Deck section title;
- include a focused empty/add row state without making a generic media manager.

Fourth paid ad attachment:

- visually connect it to Release Deck, but keep it separate from the three music
  slots;
- label it as a future paid on-air ad clip attachment, `10 sec max`;
- include a design-only ad category selector with `release date`, `general`,
  `event`, and `sponsor`;
- include a design-only attached-track selector for `1`, `2`, or `3`;
- place `Record clip` at the far right of the row;
- make the locked/paywalled nature legible without using `Upgrade`, `Buy`,
  `Subscribe`, or active purchase language.

Calendar / Print Shop section:

- show an actual compact month/week calendar or event planning ledger;
- include draft/private planning state;
- include a future explicit creator `Publish` state/action as design-only;
- show that published source events can later reach the community calendar and
  follower calendars, but draft calendar work is private;
- keep Print Shop source-facing and inside the Calendar/Event workflow;
- do not create listener-facing event authoring.

Profile/member management hints:

- keep member management in the source-facing Profile/bio area;
- show manager-led add/find member by email/search as design-only;
- if members resolve to registered UPRISE users, avatars may appear in the
  member strip, but public linking to listener accounts is privacy/routing
  pending;
- do not expose unresolved email addresses publicly.

## Product Design Constraints

- Build from the repo's existing source-dashboard design context; do not invent
  a new design system.
- Treat this prompt as a selected visual target recreation, not a new broad
  ideation request.
- If ideation is reopened, use the Product Design brief gate first and generate
  exactly three independent options only after the user confirms the brief.
- Use target dimensions that match the surface: desktop/admin/dashboard
  `1440 x 1024`; mobile continuation should use `390 x 844`.
- Avoid crowding, clipped content, tiny text, or unclear control states.
- Use spacing, grouping, alignment, typography, and strong report rules before
  adding extra borders or decoration.
- Do not put the whole UI inside an app card on a contrasting background.
- Do not put cards inside cards.
- Do not add browser chrome, device chrome, multiple ideas in one image, or
  decorative feature filler.

## Negative Constraints

- No heavy left column, sidebar, folder edge, folder tabs, segmented tab row, or
  source chips that read like tabs.
- No duplicate left/right tool lists.
- No generic file manager, folder tree, media library, drag-and-drop dropzone,
  upload button, storage provider setup, waveform, queue, or transcoding UI.
- No source-management tools inside listener profile.
- No public listener-facing admin controls.
- No listener-to-artist DM, inbox, chat, or `Message Followers`.
- No source posts/manual composer.
- No fourth active music slot.
- No paid ad purchase, billing, entitlement, payment setup, subscription,
  upgrade module, sponsor sales, or business account runtime.
- No fake analytics, growth cards, leaderboards, rankings, business advice, or
  comparative scoring.
- No Fair Play boost, scheduling, ordering, rotation, recurrence, propagation,
  ranking, or voting controls.
- No GPS verified/checkmark status ornament unless a real source action is
  blocked by an owner-spec rule.
- No `Coming Soon`, `Upgrade`, `Join`, `Subscribe`, or placeholder CTAs.
- No Spotify, Instagram, TikTok, Facebook, or generic social/admin trope drift.

## Do Not Build From This Prompt

This prompt is visual handoff material only. It does not authorize runtime work,
route changes, media storage, payment flows, event publication, follower
calendar delivery, source metrics, ad recording, business linking, public member
profile links, or action-wheel linked-target behavior.
