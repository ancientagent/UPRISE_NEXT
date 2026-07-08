# Source Dashboard Creative Brief v01

Status: active creative handoff
Date: 2026-07-06
Package: `artist-profile-source-dashboard`
Screen/section: `source-dashboard`
Primary Design Spec:
`docs/screen-packages/artist-profile-source-dashboard/design-spec/source-dashboard-management-shell-layout-brief.md`
Primary Dev Spec:
`docs/screen-packages/artist-profile-source-dashboard/spec/source-dashboard-management-shell-dev-spec.md`
Supporting Dev Spec:
`docs/screen-packages/artist-profile-source-dashboard/spec/source-dashboard-release-deck-readiness-dev-spec.md`
Owner Spec:
`docs/specs/users/artist-profile-and-source-dashboard.md`

## Purpose

Capture the current Source Dashboard art direction for a later design or
implementation handoff without storing unapproved mockups in the repo.

This brief is visual guidance only. It does not authorize runtime behavior,
route changes, storage, billing, event publication, metrics, source posting, or
new data contracts.

## Product Design Skill Constraints

Product Design guidance read for this handoff:

- `product-design/skills/index/SKILL.md`
- `product-design/skills/get-context/SKILL.md`
- `product-design/skills/ideate/SKILL.md`
- `product-design/references/critical-overrides.md`

Relevant constraints to preserve:

- Use the existing project/product context before creating design direction.
- Do not build or generate new UI without a confirmed design brief.
- A confirmed brief is not a visual target by itself; visual ideation needs its
  own selected target.
- If new visual ideation is reopened, generate exactly three independent image
  options only after brief confirmation, then wait for the user's selection.
- Use real source references when available; do not fake assets with ASCII,
  placeholder boxes, handcrafted SVGs, or approximate code drawings.
- Do not invent a new design system when the repo already has a visual language.
- Use desktop/admin/dashboard dimensions `1440 x 1024`; use `390 x 844` for a
  mobile continuation.
- Avoid browser chrome, device chrome, crowded layouts, clipped text, nested
  cards, and generic app-card-on-background composition.
- Current generated images remain Codex-cache-only unless the user approves a
  specific image as a durable repo asset.

## Source Evidence

- `docs/screen-packages/README.md`
- `docs/screen-packages/artist-profile-source-dashboard/design-spec/source-dashboard-management-shell-layout-brief.md`
- `docs/screen-packages/artist-profile-source-dashboard/spec/source-dashboard-management-shell-dev-spec.md`
- `docs/screen-packages/artist-profile-source-dashboard/spec/source-dashboard-release-deck-readiness-dev-spec.md`
- `docs/specs/users/artist-profile-and-source-dashboard.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/specs/economy/print-shop-and-promotions.md`
- `docs/founder-sessions/2026-07-06_source-dashboard-ad-action-wheel-links.md`
- `docs/founder-sessions/2026-07-06_source-dashboard-members-feed-publishing.md`

## Folder Naming Rule

The main art handoff folder is named for the screen or section:

`docs/screen-packages/artist-profile-source-dashboard/art-handoff/source-dashboard/`

Do not name the main folder after a generator ID, model run, date alone, agent
name, or vague label.

## Visual Target

Final style target:

- white official report-paper source-management sheet;
- heavier xerox-style ink lines and form rules;
- compact masthead rather than a profile hero;
- lower-right rubber-ink stamp as a low-emphasis official document artifact;
- no left sidebar, folder tabs, segmented tab row, or duplicated tool list;
- no soft SaaS card stack;
- no public/social platform clone patterns.

The interface should feel like a working source file for a band/source. It
should be fast to scan, practical to operate, and clearly separate from the
listener profile and public Artist Profile.

## Hierarchy

Top command line:

1. `UPRISE`
2. `SOURCE DASHBOARD`
3. signed-in account/user plus selected-source role, such as `Baris - Manager`
4. compact current-source selector
5. `Exit to Listener Account`

Compact masthead:

1. source image/avatar;
2. source name;
3. `Home Scene: <city>, <state> - <music community>` directly under the name;
4. source/profile snapshot beside the image/title;
5. member avatar strip on the far right;
6. public profile preview/open path where relevant;
7. optional lower-right stamp reading `SOURCE FILE` or `UPRISE SOURCE RECORD`.

Report sections:

1. `Releases` / Release Deck first.
2. `Release Metrics` as a compact dropdown below Release Deck.
3. `Calendar / Print Shop` as a real source-facing calendar section.
4. `Registrar` only as a subdued lifecycle note, utility link, or record stamp.

## Masthead Details

Use a compact masthead so report content dominates.

Include:

- source image/avatar;
- band/source title;
- Home Scene/source-origin context;
- compact profile snapshot;
- four belly-up member avatars with names;
- optional public profile preview/open path.

Do not include:

- boxed `Owner` / `Manager` masthead badge;
- `Band source` copy directly under the source name;
- decorative `GPS verified` or checkmark status;
- duplicate `Source Account: <name>` copy if the top command line already has
  the source selector;
- a stamp that implies verification, approval, payment, GPS, or policy
  clearance.

## Releases / Release Deck

Release Deck is the primary first section.

Visible requirements:

- exactly three active music slots;
- album art, title, duration, `Release date`, source-owned status, and row
  validation/status per row;
- `Load` row action, not `View`;
- caps visible: three active music slots, six minutes per song, fifteen minutes
  active total per source;
- row-level validity/status markers;
- no large green `Ready` chip beside the section title;
- no fourth active music row.

The founder mental model includes loading songs with album art and release
dates. Implementation remains URL-only until media/storage owner specs activate
upload, storage, transcoding, waveform, worker, and provider behavior.

## Paid Ad Clip

The paid ad clip is design-only.

Represent it as:

- a fourth row or attached module connected to Release Deck;
- `10 sec max`;
- not a music slot;
- attached to Release Deck slot `1`, `2`, or `3`;
- category selector with `release date`, `general`, `event`, `sponsor`;
- `Record clip` placed on the far right;
- locked/paywalled state without active purchase language.

Do not imply paid ads affect Fair Play, ranking, rotation, propagation, voting,
governance, or tier movement. Do not implement billing, payment setup,
entitlement, ad recording, media capture, review, sponsor linking, or
action-wheel target visits from this handoff.

## Release Metrics

Metrics belong under `Releases`, not as a primary navigation section.

Design target:

- compact expandable/dropdown report row;
- song selector dropdown that can later choose from eligible uploaded songs;
- separate expand/collapse affordance for deeper detail;
- collapsed row shows the most useful selected-song rollup.

Candidate visible metrics:

- listens/plays;
- upvotes;
- collects/adds terminology pending product decision;
- recommends;
- readiness or slot state.

Metrics are descriptive only. They must not affect Fair Play, ranking,
propagation, governance, source authority, or Home Scene authority.

## Calendar / Print Shop

Calendar / Print Shop is a source-facing design section.

Design target:

- compact calendar or event planning ledger;
- source-owned event context;
- draft/private event planning;
- explicit future `Publish` state/action marked design-only;
- Print Shop/flyer path inside Calendar;
- clear distinction that publication, not mere calendar existence, controls
  public/community/follower calendar distribution.

Implementation boundary:

- current event write entrypoint is Print Shop;
- event draft/published state, community-calendar visibility, follower-calendar
  delivery, flyer minting, offers, runs, billing, and business promotion
  submission remain deferred until owner specs activate them.

## Profile / Member Avatars

The profile snapshot lives in the compact masthead. Detailed member management
belongs in the source-facing Profile/bio section, not on public Artist Profile.

Design target:

- four member avatars visible in the masthead strip;
- manager-led add/find member by email/search can appear as design-only in the
  Profile/bio management context;
- registered members may resolve to avatars;
- future avatar links to listener accounts depend on identity routing and
  privacy rules.

Restrictions:

- do not expose unresolved member emails publicly;
- do not place member permission editing on public Artist Profile;
- do not add listener-to-artist messaging or inbox behavior;
- do not create broad people search or privacy bypass behavior.

## Build-Now / Design-Only / Future / Do-Not-Build

Build now, if implementation scope is later approved:

- source-dashboard report shell presentation;
- active source context;
- account plus selected-source role display if runtime fields exist;
- Release Deck three-slot, six-minute, fifteen-minute visual clarity;
- URL-only row entry and existing source context states already supported by the
  Dev Spec.

Design only:

- report-paper final visual treatment;
- lower-right rubber-ink stamp;
- release-date presentation where runtime contract is not complete;
- metrics dropdown lookup;
- Calendar / Print Shop section composition;
- member lookup/email search;
- paid ad category/link-target row;
- `Record clip` placement.

Future:

- real upload/storage/transcoding/waveform;
- paid ad purchase/record/review/storage;
- business-account sponsor linking;
- action-wheel linked-target visit affordance;
- event publication/follower-calendar delivery;
- public member-avatar links after privacy/routing contracts;
- deeper graph metrics.

Do not build:

- generic file manager;
- upload dropzone or storage provider setup;
- fourth music slot;
- paid boost/ranking/Fair Play controls;
- billing/subscription/upgrade modules;
- manual source post composer;
- DM/inbox/chat/message followers;
- fake analytics/growth/leaderboards;
- source admin in listener profile;
- public listener-facing Print Shop creation;
- placeholder CTAs such as `Coming Soon`, `Upgrade`, or `Join`.

## Mobile Continuation

If a mobile mockup is approved later, target `390 x 844` and collapse in this
order:

1. current source summary;
2. source switcher;
3. Release Deck;
4. Release Metrics;
5. compact Profile snapshot/member avatars;
6. Calendar / Print Shop;
7. listener-account return path.

Do not rely on tiny inline text links for source switching or listener-account
exit.
