# Feed Card Family Inventory R1

Status: active inventory
Last Updated: 2026-07-03
Scope: UPRISE Development Plan R1 / Task 9

## Purpose

This document inventories the current `/plot` Feed card and insert families against the active owner specs. It is an implementation inventory, not a new owner spec and not permission to add runtime actions.

Durable behavior remains owned by:

- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/core/signals-and-universal-actions.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`
- `docs/agent-briefs/EVENTS_ARCHIVE.md`

## Classification Legend

- `launch-scope`: current MVP/runtime-safe surface or contract.
- `source-facing`: links or context that point to Artist/Band/User/source objects without becoming source-management UI.
- `beta/deferred`: retained or future-safe contract, not launch runtime.
- `remove/quarantine`: should not appear in active Feed/Plot runtime unless a future owner spec explicitly reactivates it.

## Current Runtime Inventory

| Family / Surface | Runtime Evidence | Classification | Current Contract |
| --- | --- | --- | --- |
| S.E.E.D Feed panel | `apps/web/src/components/plot/SeedFeedPanel.tsx` | `launch-scope` | Default Plot mainpage/feed tab for the active Home Scene context. Scene-scoped, reverse-chronological, non-personalized. |
| Feed API row types | `apps/web/src/lib/communities/client.ts` exposes `blast`, `track_release`, `event_created`, `signal_created`, and fallback string types. | `launch-scope` | Reusable message-family archetypes; do not create one-off feed systems per event. |
| `blast` Feed card type | Feed type label maps `blast` to `Blast`; source/card semantics are locked by specs and tests. | `launch-scope` / `source-facing` | A Blast card is a Feed card for listener Blast activity. The blasted signal links to the signal source. Cross-Uprise Travel is future-safe, not launch. |
| `track_release` row | Track-release rows link to `/artist-bands/:id?trackId=:trackId` when source metadata exists. | `source-facing` | Source handoff into Artist Profile/direct-listen context; no inline Feed actions. |
| `event_created` row | Feed type label exists; Events tab owns full read surface. | `source-facing` | Event source/update feed row only. Event writes stay source-facing through Print Shop; calendar mutation is not inline Feed behavior. |
| `signal_created` row | Feed type label exists. | `source-facing` | Signal/source update row only. Source link remains distinct from any future Travel handoff. |
| Fallback Feed row type | Unknown feed types render their type label directly. | `launch-scope` with caution | Compatibility fallback only; future new types should be mapped into known reusable families before they become durable UI. |
| Popular Singles insert | `data-slot="plot-feed-popular-singles-insert"` | `launch-scope` | Read-only inserted discovery moment from current signal stats. Artist-profile link handoff is allowed; no inline actions. |
| Buzz insert | `data-slot="plot-feed-buzz-insert"` | `launch-scope` | Read-only listener recommendation squares. Recommendation display is not an inline Recommend action. |
| Upcoming Events insert | `data-slot="plot-feed-upcoming-events-insert"` | `launch-scope` | Read-only event snapshots in Feed. No inline Add-to-calendar/calendar mutation. |
| Plot Events rows | `apps/web/src/components/plot/PlotEventsPanel.tsx` | `launch-scope` | Read-only scene event listing with status/source context; no inline calendar mutation controls. |
| Archive Top 40 rows | `apps/web/src/components/plot/TopSongsPanel.tsx` | `launch-scope`, not Feed | Archive read-only descriptive/history lane; links to Artist Profile where available. |
| Scene Activity Snapshot | `apps/web/src/components/plot/PlotPrimaryTabBody.tsx` | `launch-scope`, not Feed | Descriptive Archive context only; not ranking, authority, or feed card behavior. |
| `PlotPromotionsPanel` | Retained component with deferred marker, not active `/plot` import. | `beta/deferred` | Quarantined/deferred seam. No current MVP Promotions tab. |
| `StatisticsPanel` | Retained component with deferred marker, not active `/plot` Archive body. | `beta/deferred` | Quarantined/deferred explorer. Active user-facing tab is Archive. |
| Feed-card `Travel` | Owner specs describe future-safe handoff; no active Feed runtime affordance. | `beta/deferred` | Future outside-Uprise cards may separate card/listen load from Travel to Discover/back-door visitor context. Not launch runtime. |
| Inline `Collect`, `Blast`, `Recommend`, `Follow`, wheel actions on Feed inserts | Existing tests reject Collect/Blast/Follow/handler drift; no active runtime. | `remove/quarantine` | Feed inserts remain read-only. Personal-player/user-space owns Blast; RADIYO wheel owns Play It Loud/Upvote. |
| Inline `Add to calendar` / calendar mutation in Feed or Plot Events | Tests now reject calendar mutation strings in Feed inserts and Plot Events. | `remove/quarantine` for current Plot | Calendar behavior is real system grammar but needs an approved calendar/event surface; current Plot Events and Feed inserts stay read-only. |

## Launch-Scope Summary

Current launch Feed consists of:

- server-driven S.E.E.D activity rows from the community Feed API;
- reusable row families for listener Blast activity, track releases, event creation, signal creation, and cautious fallback rows;
- intermittent read-only inserts for Popular Singles, Buzz, and Upcoming Events;
- source/artist/user links where the row or insert has source context.

Current launch Feed does not include:

- active cross-Uprise Travel links;
- generic Plot transport;
- inline Collect/Blast/Recommend/Follow actions;
- inline Add-to-calendar/calendar mutation controls;
- Promotions, Statistics, or Social tabs.

## Task 10 Handoff

Task 10 should stay narrow:

- harden the launch-scope Blast card runtime/source-link path where runtime data exists;
- preserve the distinction between source link, card/listening load, and future Travel handoff;
- keep Travel hidden/deferred unless a current owner spec explicitly activates it;
- do not add general transport to Plot;
- do not introduce inline Feed insert actions.

## Non-Blocking Follow-Ups

- Add deeper interaction/runtime coverage when the app has a stable harness for inserted discovery card click behavior. The owner spec says inserted discovery cards should hand into Artist Profile/demo listening; Task 9 records that contract but does not implement playback coupling.
- Map any future feed row type into one of the reusable message-family archetypes before it becomes a durable UI card.
