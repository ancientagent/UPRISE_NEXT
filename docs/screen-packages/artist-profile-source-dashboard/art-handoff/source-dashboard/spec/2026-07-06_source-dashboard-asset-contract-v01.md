# Source Dashboard Asset Contract v01

Status: active asset handoff contract
Date: 2026-07-06
Package: `artist-profile-source-dashboard`
Screen/section: `source-dashboard`
Primary Design Spec:
`docs/screen-packages/artist-profile-source-dashboard/design-spec/source-dashboard-management-shell-layout-brief.md`
Primary Dev Spec:
`docs/screen-packages/artist-profile-source-dashboard/spec/source-dashboard-management-shell-dev-spec.md`
Supporting Dev Spec:
`docs/screen-packages/artist-profile-source-dashboard/spec/source-dashboard-release-deck-readiness-dev-spec.md`

## Purpose

Define what Source Dashboard visual assets can be stored later, how they must be
named, and what approval and rights/privacy records are required.

This contract keeps mockups out of the repo unless the user explicitly approves
them.

## Current Asset State

- No PNG/JPG/mockup image is approved for repo storage.
- No generated Codex image cache file is a repo asset.
- Current generated images should remain in Codex cache.
- This handoff adds text-only prompt/spec documentation.

## Allowed Later, With Explicit Approval

The following may be stored later only after the user approves the exact asset:

- final approved desktop Source Dashboard mockup;
- approved mobile continuation mockup;
- approved cropped section reference for Release Deck, Calendar / Print Shop,
  or masthead/member avatars;
- approved source-owned brand/reference asset;
- approved generated asset whose prompt, date, intended use, and rights notes
  are recorded.

Working drafts may be stored in `mockups/` only if the user explicitly approves
repo storage for those drafts. Otherwise drafts stay outside the repo.

Approved implementation targets belong in `approved/`.

## File Naming

Use screen/section, visual direction, dimensions, and version.

Recommended image names, if approved later:

- `2026-07-06_source-dashboard-report-paper_desktop-1440x1024_v01.png`
- `2026-07-06_source-dashboard-report-paper_mobile-390x844_v01.png`
- `2026-07-06_source-dashboard-release-deck_section_v01.png`
- `2026-07-06_source-dashboard-calendar-print-shop_section_v01.png`

Recommended approval record names:

- `2026-07-06_source-dashboard-report-paper_approval-v01.md`
- `2026-07-06_source-dashboard-mobile_approval-v01.md`

Do not name files by generator ID, random cache filename, agent name, or
date-only label.

## Approval Record Requirements

Every stored mockup or approved visual target needs an adjacent approval record
or a clearly linked approval note.

Minimum fields:

- asset filename;
- approval date;
- approver;
- source prompt/reference;
- source docs used;
- target dimensions;
- intended role: working draft, candidate direction, approved implementation
  target, or reference only;
- whether the asset can be used in implementation handoff;
- rights/privacy notes;
- linked Design Spec;
- linked Dev Spec;
- known design-only/future/do-not-build boundaries.

## Rights And Privacy Restrictions

Do not commit assets unless one of these is true:

- UPRISE owns the asset;
- the asset is generated specifically for this project and approved for repo
  storage;
- the asset is licensed for the intended repo/design use;
- the asset is a repo-owned screenshot/reference with no private account,
  auth/session, token, payment, or personal-contact exposure.

Do not commit:

- Codex generated image cache files without approval;
- third-party copyrighted art without rights confirmation;
- real private member photos without permission;
- unresolved member email addresses;
- private account identifiers beyond approved mock data;
- payment details, billing profiles, invoices, saved payment methods, or
  provider secrets;
- screenshots containing auth cookies, browser storage state, tokens, private
  dashboards, or production customer data;
- raw source files from outside the repo unless staged and approved under the
  relevant docs/legacy or asset workflow.

Member avatars in mockups must remain fictional, generated, licensed, or
project-approved. If future avatars represent real users, approval and privacy
routing must be documented before storage.

## What Not To Commit

- unapproved PNG/JPG/mockup files;
- generated image cache files;
- browser screenshots from authenticated provider flows;
- visual drafts that imply unapproved runtime such as billing, upload storage,
  sponsor linking, source posts, DMs, or Fair Play controls;
- placeholder CTA variants using `Coming Soon`, `Upgrade`, `Join`, `Buy`, or
  `Subscribe` unless a spec later authorizes exact copy;
- alternate visual directions that conflict with the report-paper target unless
  they are explicitly approved as exploratory references.

## Linkage Back To Specs

Every approved asset should link back to:

- Design Spec:
  `docs/screen-packages/artist-profile-source-dashboard/design-spec/source-dashboard-management-shell-layout-brief.md`
- Primary Dev Spec:
  `docs/screen-packages/artist-profile-source-dashboard/spec/source-dashboard-management-shell-dev-spec.md`
- Supporting Dev Spec:
  `docs/screen-packages/artist-profile-source-dashboard/spec/source-dashboard-release-deck-readiness-dev-spec.md`
- Owner Spec:
  `docs/specs/users/artist-profile-and-source-dashboard.md`

If the asset touches Calendar / Print Shop, also link:

- `docs/specs/events/events-and-flyers.md`
- `docs/specs/economy/print-shop-and-promotions.md`

If the asset touches paid ad categories, sponsor links, business accounts, or
action-wheel linked-target visits, record those as design-only/future and link
the relevant founder-session note:

- `docs/founder-sessions/2026-07-06_source-dashboard-ad-action-wheel-links.md`

If the asset touches member lookup, avatar linking, feed publication, or event
publishing, link:

- `docs/founder-sessions/2026-07-06_source-dashboard-members-feed-publishing.md`

## Implementation Boundary

Approved assets can guide layout, hierarchy, spacing, visual treatment, and
state visibility. They do not create runtime authority.

Implementation agents must still use the Dev Spec and owner specs for:

- active source ownership;
- roles and permissions;
- Release Deck caps;
- URL-only media ingest;
- event publishing;
- Print Shop boundaries;
- paid ad runtime;
- metrics data contracts;
- privacy/routing behavior;
- validation and tests.

If an approved image shows a control that lacks owner-spec/runtime authority,
the control must be classified as `design-only`, `future`, or `do-not-build`
before implementation.
