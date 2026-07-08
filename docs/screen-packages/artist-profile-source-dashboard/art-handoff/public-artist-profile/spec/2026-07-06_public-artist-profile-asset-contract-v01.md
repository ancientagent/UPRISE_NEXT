# Public Artist Profile Asset Contract v01

Status: active asset handoff contract
Date: 2026-07-06
Package: `artist-profile-source-dashboard`
Screen/section: `public-artist-profile`
Primary Design Spec:
`docs/screen-packages/artist-profile-source-dashboard/design-spec/public-artist-profile-design-inventory.md`
Supporting Design Spec:
`docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md`
Supporting Dev Spec:
`docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md`

## Purpose

Define what Public Artist Profile assets can be stored later, how they must be
named, and what approval/privacy notes are required.

This contract keeps mockups out of the repo unless the user explicitly approves
the exact file.

## Current Asset State

- No PNG/JPG/mockup image is approved for repo storage.
- No generated Codex image cache file is a repo asset.
- This handoff adds text-only prompt/spec documentation.

## Allowed Later, With Explicit Approval

The following may be stored later only after the user approves the exact asset:

- approved desktop Public Artist Profile mockup;
- approved mobile Public Artist Profile mockup;
- approved cropped section reference for masthead, direct-listen rows, members,
  official links, or events;
- approved source-owned brand/reference asset;
- approved generated asset whose prompt, date, intended use, and rights notes
  are recorded.

Working drafts may be stored in `mockups/` only if the user explicitly approves
repo storage for those drafts. Otherwise drafts stay outside the repo.

Approved implementation targets belong in `approved/`.

## File Naming

Use screen/section, visual direction, dimensions, and version.

Recommended image names, if approved later:

- `2026-07-06_public-artist-profile-underground-network_desktop-1440x1024_v01.png`
- `2026-07-06_public-artist-profile-underground-network_mobile-390x844_v01.png`
- `2026-07-06_public-artist-profile-direct-listen_section_v01.png`
- `2026-07-06_public-artist-profile-masthead_section_v01.png`

Recommended approval record names:

- `2026-07-06_public-artist-profile-underground-network_approval-v01.md`
- `2026-07-06_public-artist-profile-mobile_approval-v01.md`

Do not name files by generator ID, random cache filename, agent name, or
date-only label.

## Approval Record Requirements

Every stored mockup or approved visual target needs an adjacent approval record
or clearly linked approval note.

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
- private contact information;
- payment details, billing profiles, invoices, saved payment methods, or
  provider secrets;
- screenshots containing auth cookies, browser storage state, tokens, private
  dashboards, or production customer data.

Member headshots/avatars in mockups must remain fictional, generated, licensed,
or project-approved. Public Artist Profile member images should represent
source-provided artist/member headshots when available, not listener-account
avatars by default. If future headshots or avatars represent real users,
approval and privacy routing must be documented before storage.

## Linkage Back To Specs

Every approved asset should link back to:

- Design Spec:
  `docs/screen-packages/artist-profile-source-dashboard/design-spec/public-artist-profile-design-inventory.md`
- Supporting Design Spec:
  `docs/screen-packages/artist-profile-source-dashboard/design-spec/ux-plan.md`
- Supporting Dev Spec:
  `docs/screen-packages/artist-profile-source-dashboard/spec/dev-spec.md`
- Owner Spec:
  `docs/specs/users/artist-profile-and-source-dashboard.md`
- Action Grammar:
  `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
- Artist Profile Lock:
  `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`

If the asset touches events, also link:

- `docs/specs/events/events-and-flyers.md`

If the asset touches future sponsors, donations, payment, or business links,
record those as outbound-only or future/deferred and link the relevant economy
or deferred-scope docs before implementation.

## Implementation Boundary

Approved assets can guide layout, hierarchy, spacing, visual treatment, and
state visibility. They do not create runtime authority.

Implementation agents must still use the Dev Spec and owner specs for:

- direct-listen row behavior;
- `RADIYO`/direct-listen handoff behavior;
- action gates for Follow, Collect, and Recommend;
- source owner/member visibility;
- official link fields;
- event visibility;
- source/member privacy;
- validation and tests.

If an approved image shows a control that lacks owner-spec/runtime authority,
the control must be classified as `design-only`, `future`, or `do-not-build`
before implementation.
