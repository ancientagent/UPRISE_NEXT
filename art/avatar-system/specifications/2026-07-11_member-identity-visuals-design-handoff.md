# Member Identity Visuals Design Handoff v01

Status: active design handoff
Date: 2026-07-11
Package: `artist-profile-source-dashboard`
Screens/sections: `public-artist-profile` members section; `source-dashboard`
member strip
Owner Spec: `docs/specs/users/artist-profile-and-source-dashboard.md`
Primary Design Specs:
`docs/screen-packages/artist-profile-source-dashboard/design-spec/public-artist-profile-design-inventory.md`
`docs/screen-packages/artist-profile-source-dashboard/design-spec/source-dashboard-management-shell-layout-brief.md`
Founder Session:
`docs/founder-sessions/2026-07-06_public-artist-profile-headshots.md`
Companion System Spec (external, not in repo):
`art/avatar-system/specifications/fable-avatar-system-design-spec.md`
(UPRISE Modular Listener Avatar And Wearable Asset System R1)

## Purpose

Give the designer the visual work unlocked by the 2026-07-11 identity-boundary
runtime fix: band-member imagery on the public Artist Profile and the Source
Dashboard member strip. This handoff is visual/design guidance only. It does
not authorize new runtime behavior, routes, upload pipelines, messaging, or
public account linking.

## What Changed In Runtime (Grounding Facts)

These are already implemented and can be designed against directly:

1. Each band/source member now has a source-provided public `headshotUrl`
   field. Listener-account avatars are no longer used — and must never be
   designed — as the default public member image.
2. The band/source record now owns its own public `bio`, `avatar`, and
   `coverImage`. These no longer borrow the registering member's personal
   listener bio/avatar/cover, so a band with no supplied identity content
   renders genuinely empty.
3. The public Artist Profile lineup shows: source-provided headshot (only when
   present), member display name, and role/contribution. Listener `@username`
   was removed from public display.
4. The Source Dashboard member strip prefers the source-provided headshot,
   falls back to the member's account avatar (allowed internally, source-facing
   only), and uses a belly-up crop — not a circle.
5. There is no headshot upload/edit UI yet anywhere. The fields exist; the
   management flow is design work (classified below).

## Design Tasks And Classification

Use the package's standard classification so a future Dev Spec knows what each
visible idea is.

### Task 1 - Public member headshot treatment - `Build now`

Design the members/lineup section of the public Artist Profile:

- headshot image treatment: crop ratio, border/ink treatment consistent with
  the public-page DIY/zine direction, size at desktop and mobile;
- member display name and role/contribution text hierarchy beside the photo;
- the **no-photo state**: when a source has not supplied a headshot, the row
  currently renders text only. The designer may propose a restrained empty
  treatment (plain text row, or a neutral non-personal mark). It must not be
  an account avatar, an initials disc that mimics one, or social absence
  framing;
- mixed states in one lineup: some members with photos, some without, without
  the lineup looking broken;
- 1-member, 4-member, and 7+-member lineups.

### Task 2 - Source Dashboard member strip refinement - `Build now`

The strip already renders belly-up (flat-bottom, rounded-top frame) per the
layout brief. Design the finished treatment:

- belly-up member frame proportions and ink/border treatment on the
  report-paper shell;
- name + role text under each member;
- responsive behavior as member count changes (the brief calls for an
  invisible responsive container; mockup baseline is four members);
- initials fallback treatment when no image exists (allowed here — this is
  source-facing internal tooling);
- visual direction reference:
  `art/avatar-system/references/legacy-avatar-boards/0_3 (1).jpeg` for the
  belly-up posture and clothing-readable crop. The boards are direction
  reference only, not production art.

### Task 3 - Headshot management in source-facing Profile section - `Design only`

The source-facing Profile section (Source Dashboard) is where a manager will
eventually supply/replace member headshots. Design the visual slot for this —
per-member photo area with add/replace affordance and clear "public photo"
labeling — but mark every control design-only: there is no upload, storage, or
moderation runtime, and media storage remains URL-only until the media owner
spec activates. Do not design cropping tools, galleries, or moderation queues.

### Task 4 - Band identity emptiness - `Build now` (states) / `Design only` (editing)

Because band bio/avatar/cover no longer inherit personal data, newly registered
bands will present empty until the source supplies content. Design the public
masthead's restrained empty states for missing source image and missing bio.
The editing flow for these fields is source-dashboard Profile work and is
design-only for the same reason as Task 3.

### Future (preserve, do not mock as active)

- Member headshot/avatar links to listener accounts (privacy/routing pending).
- Modular listener-avatar rendering in the member strip (see companion avatar
  system spec R1).

## States To Cover

- headshot present / absent / mixed lineup;
- band source image present / absent;
- bio present / absent;
- 1, 4, and 7+ members on both surfaces;
- loading (compact skeleton, order-stable);
- image load failure degrades to the same treatment as "absent".

## Accessibility Notes

- Every headshot needs a text label: display name plus role/instrument.
- Never communicate "has photo / no photo" as a status difference; absence is
  neutral.
- Member strip belly-up frames need visible name text, not hover-only labels.
- Do not rely on color alone for any member state.

## Explicit Do Not Design

- No listener-account avatar as a public member image or public fallback.
- No listener `@username`, email, or account identity data on the public page.
- No DM, chat, inbox, or contact entry point from member photos.
- No member permission controls (`Can edit music` / `Can edit calendar`) on
  the public page — those live in source-facing Profile management only.
- No circular member crops in the Source Dashboard member strip.
- No follower graphs, per-member follow, or social-profile framing for
  members.
- No upload/storage/cropping/moderation UI presented as active runtime.
- No `Coming Soon` or placeholder CTAs.
- No empty sponsor/photo/flyer modules alongside the lineup.

## Founder / Product Questions For This Pass

1. Public no-photo treatment: plain text row, or a neutral non-personal
   graphic mark? (Must not read as an account avatar.)
2. Should the public lineup adopt the belly-up frame language for headshots to
   rhyme with the member strip, or keep a straight photo treatment? Current
   runtime uses a plain square photo.
3. Baseline headshot crop ratio: square or portrait?

## Next Step

Confirm this brief with the founder, then follow the standard Product Design
flow: three independent visual options after confirmation, wait for selection,
and keep generated images outside the repo until one is approved as a durable
asset.
