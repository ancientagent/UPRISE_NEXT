# Source Dashboard Next Visual Refinement Handoff v01

Status: focused design handoff; no runtime implementation authority
Date: 2026-07-06
Package: `artist-profile-source-dashboard`
Screen/section: `source-dashboard`
Approved visual target:
`docs/screen-packages/artist-profile-source-dashboard/art-handoff/source-dashboard/approved/2026-07-06_source-dashboard-report-paper_desktop-1487x1058_v01.png`

## Evidence Used

- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `docs/screen-packages/README.md`
- `docs/screen-packages/artist-profile-source-dashboard/README.md`
- `docs/screen-packages/artist-profile-source-dashboard/instruction-packet.md`
- `docs/screen-packages/artist-profile-source-dashboard/source-map.md`
- `docs/screen-packages/artist-profile-source-dashboard/design-spec/source-dashboard-management-shell-layout-brief.md`
- `docs/screen-packages/artist-profile-source-dashboard/spec/source-dashboard-management-shell-dev-spec.md`
- `docs/screen-packages/artist-profile-source-dashboard/spec/source-dashboard-release-deck-readiness-dev-spec.md`
- `docs/screen-packages/artist-profile-source-dashboard/art-handoff/source-dashboard/spec/2026-07-06_source-dashboard-creative-brief-v01.md`
- `docs/screen-packages/artist-profile-source-dashboard/art-handoff/source-dashboard/spec/2026-07-06_source-dashboard-asset-contract-v01.md`
- `docs/screen-packages/artist-profile-source-dashboard/art-handoff/source-dashboard/prompts/2026-07-06_source-dashboard-report-paper_prompt-v01.md`
- `docs/screen-packages/artist-profile-source-dashboard/art-handoff/source-dashboard/approved/2026-07-06_source-dashboard-report-paper_approval-v01.md`
- `art/Avatar Boards/0_3 (1).jpeg` as referenced by the layout brief for member-avatar direction; read-only, not copied or extracted.

## Current State

The approved desktop mockup establishes the Source Dashboard as one white report-paper source file rather than a conventional admin dashboard. The current implementation direction remains the management-shell/readiness Dev Spec, with the first buildable vertical focused on Source Dashboard Releases / Release Deck readiness.

The approved PNG is an implementation visual target for layout, visual hierarchy, report-paper texture/rules, and asset direction. It does not authorize product behavior beyond the Dev Specs and owner specs. Any image-only control that lacks current runtime authority must be classified before implementation.

## What The Approved Mockup Establishes

- A single full-screen official report-paper sheet with strong outer borders, heavy row rules, and subtle paper texture.
- Top command line with `UPRISE`, `SOURCE DASHBOARD`, signed-in user plus selected-source role, compact source selector, and listener-account exit.
- Compact masthead with source logo/image, source name, Home Scene context, profile snapshot stats, and four member avatars.
- Release Deck as the dominant first section, with exactly three music slots.
- Row copy and hierarchy: slot number, album art, song title, duration, `Release date`, row status, URL, and `Load`.
- Row-level validity treatment instead of a large section-level green `Ready` chip.
- Paid ad clip attached to Release Deck but visually separate from music slots, with `10 sec max`, attach-to-track selector, ad type selector, locked `Record clip`, and payment-account note.
- Release Metrics as a compact row under Releases, with song selector and `Open graphs` expansion.
- Calendar / Print Shop as a report section with private draft state, published state, visibility, and print-shop bridge.
- Bottom Source Record strip with Registrar, payment account note, public profile URL, copy control, and lower-right `SOURCE FILE` stamp.

## Preserve In Implementation Direction

- Source Dashboard stays source/admin-facing and separate from listener profile, public Artist Profile, Home, and Plot.
- The report-paper/source-file metaphor should remain the visual spine.
- Release Deck remains first and most prominent for the next implementation slice.
- `Load` is the row action label; do not regress to `View`.
- `Release date` is the row label; do not regress to `Date added`.
- The three active music slots, six-minute song cap, fifteen-minute active-source cap, and URL-only MVP status must remain visible.
- Paid ad clip remains inactive/design-only and not a fourth music slot.
- Source switching remains compact and top-line; do not introduce a heavy sidebar, folder tabs, segmented tab row, duplicate tool list, or generic file manager.
- Member avatars can guide the masthead visual direction, but member profile links and permission controls remain pending owner-spec/privacy/routing contracts.
- Existing `plot-wire` vocabulary can continue underneath the final paper treatment where it does not fight the approved report style.

## Still Needs Visual Refinement

- Normalize the approved PNG's dimensions toward the package's preferred desktop target of `1440 x 1024` without losing the report-paper density.
- Make the paper texture usable as an implementation reference: subtle enough not to obscure focus states, small text, row status, or input outlines.
- Decide whether the lower-right stamp should be a reusable asset or CSS/text treatment. If asset-based, it needs approval and an adjacent approval note.
- Resolve whether `Publish`, `Open Print Shop`, `Copy`, `Open graphs`, ad type selector, and paid-ad controls are shown as current, design-only, or future in any next mockup. Current specs do not authorize event publishing, metrics runtime, paid ad runtime, or new route ownership from the mockup alone.
- Tighten mobile hierarchy before any mobile visual target is generated. The desktop mockup does not prove mobile spacing, stacking, or tap-target behavior.
- Keep member avatars readable at desktop size and define what happens when member count changes, without implying member links or public identity routing.
- Treat album art and band logo as reusable visual slots, not generated final production assets.

## Desktop Refinement Notes

- Keep the command line short and functional. The role label belongs with the signed-in account and selected source, not as a masthead badge.
- Maintain a compact masthead. The report content should dominate; do not turn the top area into a public profile hero.
- Preserve the table-like Release Deck. Row boundaries should be strong enough to read as an official source file but not so dark that they overpower row content.
- Keep the empty slot row visibly different from valid rows without introducing upload/dropzone behavior.
- If status icons are used, pair them with accessible text. Do not rely on green alone.
- Avoid using `Payment Account` as a blocker for ordinary Profile, Release Deck, or Calendar management; it is future context for paid ads only.
- If `Publish` appears in a refinement mockup, label it design-only in the handoff or remove it from any implementation-bound crop.
- Do not add metrics cards, graphs, leaderboards, growth coaching, fake analytics, or a primary Metrics navigation area.

## Mobile Continuation Notes

Target mobile continuation size: `390 x 844`.

Mobile order should be:

1. current signed-in/source context;
2. source switcher with a usable tap target;
3. selected source summary/masthead;
4. Release Deck slot rows;
5. selected row `Load` detail or URL-only release form;
6. inactive paid ad attachment spot;
7. Release Metrics compact row;
8. compact Profile snapshot/member avatars if readable;
9. Calendar / Print Shop bridge if visible;
10. listener-account return path.

Mobile must not rely on tiny inline text links for source switching, listener-account exit, row `Load`, or critical state changes. Do not carry desktop table columns directly if they force clipped text or unreadable URLs; use stacked row groups while preserving the same data hierarchy.

## Asset Needs Request List

No asset should be extracted, cropped, generated, or committed until this list is approved.

| Asset name | Source mockup/reference path | Where it appears | Intended use | Dimensions/aspect ratio | Style notes | Proposed source method | Approval requirement |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Source Dashboard desktop visual target | `docs/screen-packages/artist-profile-source-dashboard/art-handoff/source-dashboard/approved/2026-07-06_source-dashboard-report-paper_desktop-1487x1058_v01.png` | Full desktop screen | Existing approved implementation visual target | Existing `1487 x 1058`; future normalized target may be `1440 x 1024` | White official report-paper, black/charcoal ink rules, compact source file | Already approved; do not crop or regenerate automatically | Existing adjacent approval note already present. Any revised version needs a new approval note. |
| Paper texture swatch | Approved mockup; possible `art/textures/` references read-only | Report sheet background | Subtle implementation reference for print-paper surface | Tileable texture preferred; exact size TBD | Very subtle xerox/print grain; no stains, torn edges, or grunge | Generate or derive from approved mockup only after approval; alternatively implement with CSS noise without storing image | Needs explicit approval before storing as image asset. CSS-only treatment should still be reviewed visually. |
| Rubber-ink `SOURCE FILE` stamp | Approved mockup lower-right stamp | Lower-right report artifact | Low-emphasis official source-record marker | Approx. landscape stamp, final size TBD | Imperfect ink, readable, neutral wording; no verified/approved/GPS/payment implication | Generate as standalone asset or rebuild as text/CSS after design approval | If stored as PNG/SVG, needs adjacent approval note. |
| Source logo / source image placeholder | Approved mockup masthead logo | Masthead left | Visual slot for selected source identity | Square `1:1`; final CSS slot likely 72-96 px desktop | High-contrast band/source mark; mock data only | Leave as runtime data or use approved mock placeholder in visual-only assets | Do not store new generated source logo without approval and rights note. |
| Member avatar strip direction | `art/Avatar Boards/0_3 (1).jpeg`; approved mockup masthead avatars | Masthead right | Reusable visual direction for member avatars | Individual busts; flexible strip; likely square/portrait crops | Belly-up punk avatar profiles, black/white ink treatment compatible with report-paper | Source from existing repo art only after approval, or generate fictional avatars after approval | Needs approval before cropping/storing. Do not use real member photos or unresolved identities. |
| Release row album art thumbnails | Approved mockup Release Deck rows | Release Deck art column | Visual slot for active Release Deck songs | Square `1:1`; approx 64-80 px desktop | Album-art-like, high contrast, readable at small size | Leave as runtime data; use generated fictional thumbnails only for mockups after approval | Each stored thumbnail/mock asset needs approval or must remain inside approved full mockup only. |
| Empty slot plus tile | Approved mockup Release Deck row 3 | Empty Release Deck row | Indicates open active music slot without upload/dropzone behavior | Square `1:1` matching album art slot | Dashed border with simple plus; must not imply drag/drop upload | Prefer deterministic UI styling, not stored asset | No asset needed unless exported as part of approved mockup. |
| Status check icon style | Approved mockup row status | Release Deck status column | Valid source-owned row marker | Small icon; final size TBD | Green check plus text; accessible status copy required | Runtime icon/library or CSS; not image asset | No standalone approval needed if implemented as UI icon under Dev Spec. |
| Calendar micro-layout reference | Approved mockup Calendar / Print Shop section | Calendar section | Visual reference for compact calendar/event ledger | Desktop section; mobile stacked variant TBD | Ledger/calendar hybrid, report-paper rules | Keep in mockup/handoff; no crop yet | Cropped section reference needs approval before storing. |
| Print Shop bridge icon/treatment | Approved mockup Calendar / Print Shop section | Flyer printing row | Indicates source-facing print path | Small icon/text row | Utility bridge, not listener event authoring | Runtime icon/library or approved crop after approval | No generated asset without approval. |
| Public profile URL/copy treatment | Approved mockup bottom Source Record strip | Source Record row | Shows public profile path as source-file reference | Text/control; no image asset | Utility treatment only | Runtime UI text/control; leave as data | No asset needed. |

## Exact Design-Only / Future / Do-Not-Build Boundaries

Design-only or future unless owner specs explicitly activate them:

- paid ad recording, payment account setup, purchase, billing, entitlement, sponsor linking, category persistence, or action-wheel linked-target visits;
- Release Deck upload/storage/transcoding/waveform/media-worker behavior;
- release-date persistence, scheduling, timezone rules, past-date validation, or scheduled-to-active transition;
- remove/deactivate/replacement behavior for Release Deck rows;
- metrics lookup across current/prior uploads, graphs, paid tracked-single telemetry, or analytics runtime;
- event draft/publish runtime, community-calendar visibility, follower-calendar delivery, updates/cancellations, opt-outs, external calendar sync, or feed fanout;
- member email/search lookup, invite resolution, permission editing, unresolved email display, and avatar links to listener profiles;
- source posts, manual follower updates, DMs, inboxes, chats, or `Message Followers`;
- new source/admin domain route, new route names, or route ownership changes;
- `Coming Soon`, `Upgrade`, `Buy`, `Subscribe`, `Join`, or other placeholder/purchase CTAs.

Do-not-build from this visual direction:

- generic file manager or folder tree;
- heavy sidebar or duplicated tool list;
- source admin controls inside listener profile;
- public Artist Profile engagement wheel;
- fourth active music slot;
- Fair Play scheduling, boost, ordering, ranking, propagation, voting, or tier controls;
- fake analytics, growth cards, leaderboards, or business dashboards;
- platform-trope layouts copied from Spotify, Instagram, TikTok, Facebook, or generic SaaS admin templates.

## Product Questions Blocking Design Confidence

- What exact runtime fields will represent `manager`, `member`, `Can edit music`, and `Can edit calendar`?
- Should future Release Deck release-date input be date-only or datetime, and what timezone owns it?
- What are the approved RADIYO tier names, colors, and state precedence rules if row tier highlighting is later used?
- What is the eventual metrics source of truth for current and previously uploaded songs?
- What is the event publication contract for private drafts, community-calendar visibility, follower-calendar delivery, updates, cancellation, and follower opt-out?
- Where should source member avatar links go, if anywhere, after privacy and identity routing are defined?
- Should the payment account belong to the signed-in operator, each selected source file, or both through a source billing profile?

## Next Action

Ask the founder to approve or revise the asset request list before any extraction, cropping, generation, or repo storage. After approval, create only the approved asset(s), store them in the correct package folder, and add adjacent approval notes.

