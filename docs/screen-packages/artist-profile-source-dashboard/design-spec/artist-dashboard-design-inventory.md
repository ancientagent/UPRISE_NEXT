# Artist Dashboard Design Inventory

Status: design inventory and Dev Spec handoff draft
Package: `artist-profile-source-dashboard`
Design lane: `uprise-design-ui`
Runtime lane: `uprise-registrar-source`
Primary owner spec: `docs/specs/users/artist-profile-and-source-dashboard.md`
Last updated: 2026-07-04

## Purpose

This document lists the artist/source-owner dashboard areas that need Product
Design treatment before they are converted into focused Dev Spec or
implementation slices.

It is not a product spec and does not create product truth. Durable behavior
stays in `docs/specs/**`. This file organizes visible hierarchy, states,
responsive behavior, accessibility, asset needs, deferred areas, and open
questions for the artist/source-owner operating surface.

## How To Use This Document

This document is the next-step design handoff for a Dev Spec agent. The Dev
Spec agent should not start from chat memory or from a broad platform scan.
They should start from this design inventory, then verify the named source
authority and runtime files before writing a dev spec.

The next agent should produce one focused Dev Spec for the first slice:

`Source Dashboard Release Deck Readiness Slice`

The Dev Spec should translate this design inventory into:

- exact runtime files to inspect and likely edit;
- current rendered/source-code behavior;
- state-by-state implementation requirements;
- API/client/store contracts already available;
- tests that exist today;
- behavior-level test gaps to fill;
- validation commands;
- stop conditions.

The Dev Spec must not add product rules, new actions, new dashboard modules,
new upload/storage/provider behavior, new auth rules, or new data contracts.

## Source Authority

Use these sources before turning any section into a dev spec:

1. `AGENTS.md`
2. `docs/PLATFORM_START_HERE.md`
3. `docs/agent-briefs/CONTEXT_ROUTER.md`
4. `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
5. `docs/agent-briefs/UI_CURRENT.md` for visual structure
6. `docs/specs/users/artist-profile-and-source-dashboard.md`
7. `docs/specs/media/release-deck-and-eligibility.md`
8. `docs/specs/broadcast/radiyo-and-fair-play.md`
9. `docs/specs/system/registrar.md`
10. `docs/specs/economy/print-shop-and-promotions.md`
11. `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md`
12. `docs/solutions/MEDIA_STORAGE_DECISION_PACKET_R1.md`
13. `docs/solutions/SOURCE_POSTS_MESSAGES_DECISION_PACKET_R1.md`
14. `docs/solutions/MVP_EXPLICIT_DEFERRED_LIST_R1.md`

## Current Design Brief

Design the source-owner/artist-facing operating surface first. The first
implementation path should make Release Deck usable enough for source-owned
music to enter current URL-only testing and Fair Play/player validation.

The dashboard is not a listener-facing profile, not a social profile, and not a
generic creator SaaS workspace. It is the source control room for a registered
artist/band source operated by the current signed-in authorized owner/member.

## Dev Spec Readiness Summary

Ready for Dev Spec:

- Source Dashboard source-context hierarchy.
- Source account switcher presentation.
- Release Deck primary placement.
- Release Deck slot/readiness presentation.
- URL-only release form state.
- Fair Play/player testing readiness copy and constraints.
- Empty, loading, error, no-source, stale-source, cap-reached, and ready states.

Not ready for Dev Spec without a separate product/spec activation:

- real upload/storage/transcoding/waveform UI;
- paid ad-slot / on-air ad clip runtime, including paywall, purchase, or
  entitlement behavior;
- source posts/messages/follower updates;
- source analytics, billing, upgrades, or promotion management;
- source profile editing;
- future source/admin domain routing format.

The first Dev Spec should therefore be a dashboard/readiness slice, not a full
artist portal redesign.

## First Slice Target

Name:

`Source Dashboard Release Deck Readiness Slice`

Design intent:

- Make the artist/source owner immediately understand which source is active.
- Make Release Deck the primary tool for getting source-owned music into
  current URL-only testing.
- Show whether the source has valid tracks for player/Fair Play testing.
- Show caps and validation states before the source hits API rejection.
- Keep secondary tools visible without expanding them into new runtime.

Non-goals:

- public Artist Profile redesign;
- real media upload;
- full Fair Play scheduler UI;
- dashboard analytics;
- source messaging;
- paid ads, on-air ad clip recording, paywall, purchase, entitlement, or billing.

## Surface Map

### 1. Source Context And Account Switching

Design need:

- Make the current operating context unmistakable.
- Show one base signed-in account with switchable managed source contexts.
- Support users with multiple source positions/pages created through Registrar
  materialization and member sync.
- Use two source roles for this design model: `manager` and `member`.
- The registering member is the default `manager` because their location/Home
  Scene ties the band/source to its Home Scene.
- Treat Release Deck submission permission as scoped to the selected source. The
  same signed-in user may be able to submit music for one band and not another.
- Baseline source-member access should still let a member see what is happening
  for that source and add events/calendar entries for that source.
- Keep `Listener Account` visible as the exit from source mode.
- Support no-source, active-source, stale-source, and source-no-longer-managed states.

Visible hierarchy:

1. `Source Dashboard` surface label.
2. Active source name, entity type, slug, membership role.
3. Home Scene identity where available.
4. Source account switcher showing available source positions/pages and the
   user's role for each source.
5. Return to listener account path.

Design constraints:

- Do not imply a second login tree.
- Do not place source tools inside the listener profile body.
- Do not hide which source is active before a destructive or publishing action.
- Do not apply Release Deck submission permission globally across all source
  positions. Every music submission action must resolve authority from the
  selected source membership.
- Do not foreground GPS verification as a dashboard badge unless a specific
  source action is blocked by an existing owner-spec rule. Registrar/GPS
  authority remains unchanged.

### 2. Dashboard Information Architecture

Design need:

- Avoid duplicating the same tools on both left and right sides of the page.
- Keep the immediate post-source-login page focused on current source context
  and Release Deck readiness.

Preferred tool structure:

1. `Release Deck`
2. `Source Profile` for the actual public-profile details management page
3. `Events` for source shows, event work, and the Print Shop/flyer-printing path
4. `Metrics` for basic descriptive source metrics, with deeper metrics reserved
   for paid accounts after monetization/entitlement specs exist
5. `Registrar` as the signed-in user's source lifecycle and records path

Design constraints:

- Use one clear navigation/tool region. Do not repeat the same tool list in a
  left rail and a right card stack.
- `Events` may contain or lead to Print Shop. Do not make Print Shop a duplicate
  sibling if the current design is using Events as the source-facing event page.
- `Metrics` may be planned as a source-dashboard page, but must stay
  descriptive. Do not add rankings, predictions, comparative leaderboards,
  governance influence, or paid-account gating until owner specs define the
  metrics and monetization contracts.
- Registrar access remains signed-in-user/source lifecycle access, not a public
  listener profile action.

### 3. Release Deck And Music Readiness

Design need:

- Make Release Deck the primary first artist-dashboard job.
- Show exactly three active music slots.
- Preserve the fourth Release Deck spot as the future on-air ad clip attachment
  spot.
- Show URL-only MVP release entry clearly.
- Make Fair Play/player readiness understandable without implying the Release
  Deck controls rotation order.

Visible hierarchy:

1. Active source and Home Scene context.
2. Slot summary: `3` music slots plus `1` ad clip spot.
3. Caps: `6` minutes per song, `15` minutes total active source cap.
4. Current music slots with open, filled, source-owned, and legacy carry-forward states.
5. Fourth spot summary: up-to-`10`-second ad clip attachment, defined for later
   activation and not active in the current slice.
6. URL-only release form with release date selection once the owner spec/API
   contract supports scheduled release dates.
7. Validation and API rejection area.
8. Readiness summary for testing: enough valid source-owned music exists or what is missing.

Current authorized inputs:

- Title.
- Duration in seconds.
- Hosted `http(s)` audio URL.
- Optional hosted `http(s)` cover art URL.
- Active source context.
- Resolved source Home Scene.

Founder-required next input:

- Remove from active deck: source operators should be able to remove a song from
  an active Release Deck music slot. If this means delete, deactivate,
  unpublish, or history-safe removal, implementation must stop for owner-spec/API
  contract clarification before changing runtime behavior.
- Release date selection: source operators should be able to select the date the
  song releases. Current inspected runtime/spec contracts do not yet expose this
  as an authorized `CreateTrackInput` field, so implementation must stop for
  owner-spec/API/runtime contract work before adding behavior.

Design constraints:

- Do not imply drag-and-drop upload, object storage, transcoding, waveform extraction, or worker processing.
- Do not present the fourth ad spot as a fourth music slot.
- Future ad attachment direction: a source may be able to pay for the fourth
  Release Deck spot, record up to a `10`-second on-air advertisement clip, and
  attach it to one of its songs, but this is not active in the current URL-only
  Release Deck slice.
- Do not imply Release Deck can reorder, boost, or otherwise govern Fair Play.
- At cap boundaries, show reject-only guidance rather than silent replacement.

### 4. Future On-Air Ad Clip Attachment

Design need:

- Preserve the founder direction that sources should eventually be able to
  paywall/unlock the fourth Release Deck spot, record a short on-air
  advertisement, and attach it to a song.
- Treat this as the fourth Release Deck spot.
- Keep this separate from the three active music slots and from current URL-only
  Release Deck entry.

Future visible hierarchy, when activated by an owner spec:

1. Song selection: choose one of the source's active songs.
2. Ad clip status: no clip, clip attached, or clip needs review if moderation is
   later required.
3. Clip length cap: up to `10` seconds.
4. Paywall or entitlement state: locked, eligible to purchase, paid/unlocked, or
   unavailable if the later monetization spec uses different language.
5. Record or replace clip action, only after media capture/storage behavior is
   specified.
6. Clear reminder that the fourth spot is an ad attachment, not a fourth music
   track.

Design constraints:

- Do not design recording controls, upload controls, storage, transcoding,
  billing, paywall, purchase, entitlement, sponsorship, review, or on-air
  scheduling behavior until an owner spec activates those contracts.
- Do not let the ad attachment alter Fair Play ranking, rotation, voting,
  propagation, or governance.
- Do not present the ad clip as a standalone playable song or listener-facing
  public profile module.

### 5. Fair Play / Player Testing Readiness

Design need:

- Give the artist/source owner useful feedback that their music is ready for
  player/Fair Play testing.
- Keep Fair Play authority separate from Release Deck controls.

Candidate visible states:

- `Not ready`: no active source, no Home Scene, or no valid source-owned tracks.
- `Ready for source-owned track testing`: one or more valid ready tracks exist.
- `At slot cap`: three ready tracks are active for the source/community.
- `At duration cap`: total active source duration would exceed `15` minutes.
- `Pending broader Fair Play`: track rows exist, but scheduling/rotation lifecycle is owned by broadcast runtime.

Design constraints:

- Use the repo term `Fair Play`, not `freeplay`.
- Do not invent rotation controls, ranking controls, boost controls, or play-count analytics.
- Do not imply source operators can bypass GPS, Home Scene, or Release Deck eligibility.

### 6. Source Profile Management

Design need:

- Give the source owner a clear way to manage the details that appear on the
  public Artist Profile.
- Keep the public profile separate from the operating dashboard.

Visible hierarchy:

1. Tool/nav entry named `Source Profile`.
2. Link to the actual profile-management page for band/source details.
3. Member section for avatars, what each member plays, baseline source access
   summary, and manager-only control
   over whether that member can submit music for the selected source.
4. Preview/open-public-profile path for the listener-facing Artist Profile.
5. Current public profile status summary if available.

Design constraints:

- Source Profile management is a separate source-owner page, not the public
  Artist Profile itself.
- Member Release Deck submission controls belong on the source manager Source Profile
  management page, not on the public listener-facing Artist Profile.
- Member music-submission controls must be scoped to the selected source. A
  source manager may allow a band member to submit music for one source without
  granting that ability for another source.
- The member section should make clear that source members can still view source
  activity and add events/calendar entries for the selected source even when
  they cannot submit music.
- Do not invent a broad permission system beyond the concrete beta question of
  whether a member can submit music through Release Deck unless the
  identity/roles owner spec defines it.
- Do not blend public listener actions with dashboard controls.
- Do not add Artist Profile `Blast`, engagement wheel, source-level `Collect`,
  or source-level `Support`.

### 7. Events / Print Shop Path

Design need:

- Present Events as the source-dashboard path for shows and event work, with
  Print Shop living inside or behind that event path.
- Let source members add new events/calendar entries for the selected source
  where current/future Events contracts allow it.
- Make the active source context visible before event creation.
- Distinguish artist/band event creation from promoter-capability event creation.
- Preserve Print Shop as the source-side path for flyer/event printing work as
  that beta lane opens, without making it a listener-facing Artist Profile tool.

Visible hierarchy:

1. Tool/nav entry named `Events`.
2. Source shows/event management entry.
3. Add event/calendar entry path for source members.
4. Print Shop/flyer-printing path inside Events.
5. Source or promoter capability status if the selected Events action needs it.
6. Home Scene or capability limitations where relevant.

Design constraints:

- Print Shop is source-facing infrastructure.
- Current MVP only implements the source-facing event-write lane.
- Flyer printing may become a beta Source Dashboard path through Print Shop; do
  not expose it as a public listener action or placeholder module before the
  Print Shop slice is specified.
- Do not design full Runs, artifacts, offers, billing, promotions management, or marketplace behavior.
- Do not let Print Shop alter Fair Play, propagation, ranking, or governance.

### 8. Registrar / Source Lifecycle Status

Design need:

- Let source owners reach Registrar follow-up as the signed-in user without
  redefining Registrar as a public profile editor.
- Show registration/materialization/member-sync status as lifecycle context.
- Reflect that Registrar gives a listener/user source pages/accounts and can
  continue adding source pages/positions to the same signed-in user.

Visible hierarchy:

1. Tool card named `Registrar`.
2. Source-context bridge copy.
3. Registration/materialization status.
4. Member invite and sync follow-up status where available.
5. Return path to Source Dashboard.

Design constraints:

- Registrar remains Home Scene-bound civic infrastructure.
- Source context on Registrar is informational.
- Do not change GPS/Home Scene authority through design.
- Do not introduce auto-materialization or automatic member sync.

### 9. Future Source Updates / Messages

Design need:

- Track as future product area only.
- Do not include in the current dashboard UI.

Current decision:

- Source posts/messages are valid later, but not current MVP runtime.
- Do not add posts, message followers, inbox, follower-update composer, chat, or notification tools now.

### 10. Metrics

Design need:

- Preserve founder direction that each source should have a Metrics page.
- Start with basic descriptive metrics.
- Let paid accounts track specific singles from Release Deck for
  higher-definition telemetry as a V2 / possible beta expansion after
  paid-account entitlement is specified.

Potential basic metric categories, pending owner-spec activation:

1. Public profile views.
2. Song plays/listens.
3. Follows.
4. Collects and recommends.
5. Upcoming/past event activity.
6. Release Deck readiness/slot status.

Paid-account tracked-single expansion, V2 / possible beta and pending
monetization spec:

- source selects one or more Release Deck singles to `track`;
- tracked singles expose higher-definition telemetry than the basic Metrics page;
- tracked-single views can include deeper time ranges and richer listener/source
  activity breakdowns;
- tracked-single export/reporting can be considered after data ownership is
  defined;
- campaign/ad-spot performance can connect only if ad runtime is activated.

Design constraints:

- Metrics must be descriptive only.
- Do not make metrics affect Fair Play, rotation, ranking, voting, propagation,
  Registrar authority, Home Scene authority, or governance.
- Do not add billing, paywall, entitlement, upgrade, or paid-account UI from this
  dashboard slice.
- Do not turn `track single` into a listener-facing action or a Fair Play
  ranking control. It is source-side telemetry selection only.
- Do not add comparative rankings, leaderboards, predictive scoring, or
  prescriptive business advice.

### 11. Business / Monetization / Analytics

Design need:

- Track as deferred.
- Do not include in the current artist dashboard design.

Current decision:

- Billing, paid-account entitlements, premium analytics, paid promotion
  management, offers/coupons, subscriptions, and paid ad-slot runtime are
  deferred.

## State Matrix

| State | Applies To | Design Requirement |
| --- | --- | --- |
| Loading | Dashboard, Release Deck, Registrar, Source Profile reads | Use calm status copy and preserve layout shell. |
| Signed out | Source Dashboard, Release Deck, Registrar actions | Block source tools and provide listener/login path only where current runtime supports it. |
| No managed sources | Source Dashboard | Explain that Registrar is how a listener becomes a source; show no fake source tools. |
| No active source | Source Dashboard, Release Deck | Ask the user to select a managed source before source tools operate. |
| Stale source context | Source Dashboard, Release Deck | Clear context and explain the selected source no longer belongs to the signed-in user. |
| Active source ready | Dashboard | Show source identity, Home Scene, role, and live tool cards. |
| Missing Home Scene | Release Deck | Block release submission; explain source Home Scene is required. |
| URL validation error | Release Deck | Keep error near URL input and form status. |
| Duration over `360` seconds | Release Deck | Block before submit and name the six-minute cap. |
| Fourth slot rejected | Release Deck | Explain the three active music slot cap. |
| Source duration over `900` seconds | Release Deck | Explain the fifteen-minute active source cap. |
| Fewer than three tracks | Release Deck | Show filled slots plus open slots without implying more than three. |
| Legacy carry-forward row | Release Deck | Mark as legacy/carry-forward, not new source-owned write path. |
| Ready for Fair Play testing | Release Deck readiness | Show that valid tracks exist; do not imply dashboard controls scheduling. |

## Mobile And Accessibility Notes

- Use a single-column mobile order: source context, account switcher, Release
  Deck primary card, readiness state, secondary tool cards.
- Keep tool cards tappable and stable; avoid tiny inline text links for primary actions.
- Do not communicate source/listener mode by color alone.
- Label mode explicitly: `Listener Account`, `Current Source`, `Source Dashboard`.
- Error and gated states need nearby explanatory copy, not disabled buttons alone.
- Form controls need clear labels, helper text, and validation placement.

## Visual Direction

Use the current MVP visual vocabulary:

- `plot-wire-page`
- `plot-wire-frame`
- `plot-wire-card`
- `plot-wire-panel`
- `plot-wire-chip`
- `plot-wire-list-item`

The dashboard should feel like an operating control room for a local source:
grounded, direct, and practical. It should not feel like a social profile, a
creator-growth dashboard, or a music-streaming library.

## Asset Needs

No new assets are required for the first dev-spec slice.

Later possible asset needs:

- Source identity image/avatar treatment.
- Release artwork thumbnail treatment.
- Slot-card open/filled/blocked visual treatment.
- Official source profile preview image treatment.
- Registrar status chip treatment.
- Print Shop event card/artifact treatment when that area becomes active.

Any asset work must avoid hardcoding a city, artist, source, or fixture unless
explicitly marked test-only.

## Explicit Do Not Design

- No listener-facing Artist Profile redesign in this first dashboard slice.
- No source tools inside listener profile.
- No listener-to-artist DM, inbox, contact, or message controls.
- No Source Dashboard posts/messages card.
- No Metrics runtime, analytics, billing, upgrade, growth, or
  promotion-management cards in the first Release Deck readiness slice.
- No real upload/storage/transcoding/waveform UI.
- No fourth active music slot; the fourth Release Deck spot is the inactive
  on-air ad clip attachment concept.
- No paid ad-slot / on-air ad clip runtime, paywall, purchase, entitlement, or
  billing behavior.
- No Fair Play boost, rank, reorder, or pay-for-placement controls.
- No city-specific or fixture-only dashboard behavior.
- No platform-trope defaults from Spotify, Instagram, TikTok, Facebook, or generic creator SaaS.

## Product Questions To Track

These do not block the first Release Deck/dashboard design slice, but they
should block later expansion if the answer would change runtime behavior:

1. When media infrastructure is activated, is Cloudflare R2 still the preferred first staging provider?
2. What is the future source/admin URL or domain format after the current `/source-dashboard` stand-in?
3. Does the registering member's default `manager` role need a separate
   credential validation link before dashboard access?
4. What source-profile editing surface, if any, should exist beyond viewing the public Source Profile?
5. When source posts/messages are activated later, where should follower-only updates appear?
6. When paid ad-slot / on-air ad clip runtime is activated later, how is the
   fourth spot paywalled or purchased, and how is the up-to-`10`-second clip
   recorded, reviewed if needed, and associated with one song without becoming a
   fourth music slot?
7. What is the exact Release Deck release-date contract: date-only or datetime,
   source Home Scene timezone or user timezone, immediate release option,
   validation for past dates, and how scheduled releases become active?
8. What basic source Metrics are allowed for beta, and what data source owns
   each metric?
9. What paid-account entitlement unlocks deeper Metrics, and how is that kept
   separate from billing/paywall implementation until monetization specs exist?

## Recommended First Dev Spec Slice

Title: `Source Dashboard Release Deck Readiness Slice`

Purpose:

- Make `/source-dashboard` and `/source-dashboard/release-deck` communicate
  active source context, URL-only release entry, three-slot state, validation
  limits, and Fair Play/player testing readiness.

Scope:

- Source Dashboard header/context hierarchy.
- Release Deck primary tool card prominence.
- Release Deck slot/readiness presentation.
- URL-only form state and validation copy.
- No-source, stale-source, missing-Home-Scene, cap-reached, and ready states.

Likely runtime files:

- `apps/web/src/app/source-dashboard/page.tsx`
- `apps/web/src/app/source-dashboard/release-deck/page.tsx`
- `apps/web/src/components/source/SourceAccountSwitcher.tsx`
- `apps/web/src/lib/source/release-deck-validation.ts`

Likely tests:

- `apps/web/__tests__/source-dashboard-shell-lock.test.ts`
- `apps/web/__tests__/source-account-switcher-lock.test.ts`
- `apps/web/__tests__/release-deck-shell-lock.test.ts`
- `apps/web/__tests__/release-deck-validation.test.ts`

Validation seed:

```bash
pnpm --filter web test -- source-dashboard-shell-lock.test.ts source-account-switcher-lock.test.ts release-deck-shell-lock.test.ts release-deck-validation.test.ts
pnpm --filter web typecheck
pnpm run docs:lint
git diff --check
```

## Dev Spec Agent Prompt Seed

Use this prompt seed when handing the next step to another agent:

```text
Work in `/home/baris/UPRISE_NEXT` on branch `docs/artist-profile-source-dashboard-specs`.

Create a Dev Spec for the Source Dashboard Release Deck Readiness Slice.

Read:
- AGENTS.md
- docs/PLATFORM_START_HERE.md
- docs/AGENT_STRATEGY_AND_HANDOFF.md
- docs/agent-briefs/CONTEXT_ROUTER.md
- docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md
- docs/agent-briefs/UI_CURRENT.md
- docs/specs/users/artist-profile-and-source-dashboard.md
- docs/specs/media/release-deck-and-eligibility.md
- docs/specs/broadcast/radiyo-and-fair-play.md
- docs/specs/system/registrar.md
- docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md
- docs/solutions/MEDIA_STORAGE_DECISION_PACKET_R1.md
- docs/solutions/SOURCE_POSTS_MESSAGES_DECISION_PACKET_R1.md
- docs/solutions/MVP_EXPLICIT_DEFERRED_LIST_R1.md
- docs/screen-packages/artist-profile-source-dashboard/design-spec/artist-dashboard-design-inventory.md

Inspect runtime:
- apps/web/src/app/source-dashboard/page.tsx
- apps/web/src/app/source-dashboard/release-deck/page.tsx
- apps/web/src/components/source/SourceAccountSwitcher.tsx
- apps/web/src/lib/source/release-deck-validation.ts
- apps/web/__tests__/source-dashboard-shell-lock.test.ts
- apps/web/__tests__/source-account-switcher-lock.test.ts
- apps/web/__tests__/release-deck-shell-lock.test.ts
- apps/web/__tests__/release-deck-validation.test.ts

Output:
- current runtime trace;
- implementation requirements by state;
- likely file ownership;
- tests to update/add;
- validation commands;
- stop conditions.

Do not implement code. Do not add new product rules. Do not activate real upload,
storage, transcoding, paid ad slot runtime, analytics, billing, source posts, or
new dashboard modules.
```
