# UPRISE Platform Start Here

Status: active orientation
Last Updated: 2026-06-25

## Purpose

This is the fast platform orientation for UPRISE. Read this before lane-specific docs when you need the product model, not just repo operations.

This file does not replace canon, specs, lane briefs, or runtime tests. It gives agents the current mental model so they do not start from stale platform assumptions.

## One-Paragraph Model

UPRISE is a music-community platform organized around local Home Scenes. A Home Scene is identified by `city + state + music community`. Every Home Scene uses the same architecture: location and music community change the scene data, membership, sources, events, signals, and history, but not the screens, player behavior, actions, tabs, or routing. Listeners participate through the Home/Plot/player experience; artists, bands, promoters, and other sources are separate managed entities with source-facing tools; business, paid promotion, advanced media infrastructure, Prime-model structures, and dedicated Uprise persistence are deferred unless explicitly activated by current specs.

## Current Truths To Preserve

1. Community identity is always `city + state + music community`.
2. Community architecture is invariant across all city/music-community instances.
3. Launch communities are seed instances, not special architectures.
4. Launch starts with a fixed set of major-node Home Scenes / music capitals for each parent music community. These active nodes absorb listeners and sources from surrounding or inactive cities until local artist/source concentration justifies a new city-tier community.
5. New city-tier communities are created through artist/source registration and Registrar/source activation, not listener onboarding or listener-side pioneer tracking. Listener demand can inform messaging, but without active local artists/music there is no music community to activate.
6. A new Home Scene activates when it has at least `45` minutes of approved playable music from at least `5` distinct registered source accounts.
7. No single source may occupy more than `15` minutes of any one Uprise rotation at a time.
8. Release Deck has `3` active music slots per managed Artist/Band source per city-tier community, a `6` minute cap per song, and a `15` minute total active-rotation cap per source; the paid ad attachment is not a fourth music slot. The combined Release Decks inside one Uprise also form the Uprise-wide catalog, release scheduling, and readiness measurement system.
9. If a listener's submitted/GPS city differs from the assigned active Home Scene, Home may show a lightweight tooltip encouraging them to tell local bands/artists to register with UPRISE; this is messaging, not a community-creation workflow.
10. Home contains Plot; Plot is not a standalone destination.
11. Current Plot tabs are exactly `Feed`, `Events`, and `Archive`.
12. Listener Profile, Artist Profile, Source Dashboard, Registrar, and Business surfaces are separate.
13. Source Dashboard is the MVP monorepo stand-in for future separate source/admin tooling.
14. GPS gates voting rights, not ordinary participation.
15. Onboarding collects one primary scene-of-choice music community; additional music-community preferences are added later from the user profile.
16. GPS verification proves location authority for voting and source registration; it does not automatically add every active music community in the verified city to the user's Home Scene selector.
17. One successful GPS verification for a city grants voting rights across the user's registered music-community preferences that resolve in that verified city.
18. Verifying a new city replaces the user's prior city voting authority; users do not hold voting authority in multiple cities at the same time.
19. Music-community preferences persist across cities; when the verified/default city changes, Home/Plot/RADIYO/Feed/Events/Archive content re-resolves to that city's active or proxy scenes.
20. The Home Scene selected during onboarding is the user's initial active/default Home Scene.
21. The starred default music-community preference determines the Home Scene loaded on login; the Home Scene selector is only a shortcut to resolvable primary communities in the current city.
22. Saved Away Scenes live in the user profile/collection, not in the Home Scene selector.
23. Missing music-community requests are intake/review only; they do not create live communities.
24. A Home Scene listener may request a Sect. Support from at least `5` distinct eligible registered Artist/Band sources that register as Sect members makes the requested Sect legitimate, and it becomes active once the current eligible music in those supporting artists' Home Scene Release Decks totals at least `45` minutes. Apply the existing `15`-minute per-source contribution cap; do not require `45` minutes from each artist. Songs do not support or join Sects individually, and previous songs are irrelevant after leaving the current eligible Release Deck. Routine platform-admin approval is not a stage in this lifecycle. Public progress visibility remains deferred.
25. Artist/Band Sect membership belongs in Registrar rather than loose self-assigned profile tags; Official Sects may become visible subcommunities with update channels, but they do not gain independent broadcast authority until they become active through the settled thresholds.
26. Sect Uprises should mirror Home Scene behavior wherever possible while staying scoped inside the parent Home Scene/music community. They exist to give niche/sub/microgenre groups a purer broadcast without fragmenting the parent music community into isolated city/community silos.
27. Business runtime, billing, paid promotion management, premium analytics, media upload/transcode, Prime model, and a dedicated Uprise model are deferred unless explicitly activated.

## Common Wrong Assumptions

- Do not collapse Home Scene identity to city-only or genre-only.
- Do not create one-off runtime behavior for Austin, Punk, a launch city, or any other fixture unless it is explicitly fixture-only/test-only.
- Do not add `Statistics`, `Promotions`, or `Social` as current MVP Plot tabs.
- Do not put source-management tools inside the listener profile.
- Do not put Blast on the RADIYO wheel or add an engagement wheel to Artist Profile.
- Do not treat revenue doctrine as permission to build billing, subscriptions, paid boosts, coupons/offers, or business dashboards now.
- Do not treat missing music-community requests or listener onboarding counts as community activation signals.
- Do not build listener-side pioneer tracking or activation queues; inactive-location users are assigned to active major-node Home Scenes until artist/source registration justifies a split.
- Do not auto-enroll a GPS-verified user into every active music community in their city; Home Scene membership is an explicit user-profile affiliation.
- Do not put saved Away Scenes in the Home Scene selector; the selector is for resolvable primary music-community preferences in the current city.
- Do not treat every music-community preference as the default. Onboarding sets the initial default, and later default changes must be explicit.
- Do not auto-create Sects from passive genre/style tags; explicit registered-source backing is required, and visibility/unlock rules remain beta-calibrated.
- Do not use loose profile tags as Artist/Band Sect membership; membership is an explicit Registrar action by the registered artist/source.
- Do not implement a dedicated `Uprise` model only because canon names Uprise.

## Surface Map

- Home/Plot: listener Home Scene shell with `Feed`, `Events`, and `Archive`.
- Player/RADIYO/SPACE: listening context and action surface; RADIYO and SPACE action grammar stays split.
- Listener Profile: collection/workspace exposed through the player pull-down profile behavior.
- Artist Profile: public source page/direct-listen surface; not the listener profile and not source admin.
- Source Dashboard: current MVP source/admin stand-in for managed sources, Release Deck, Print Shop, Source Profile, and Registrar entry.
- Registrar: listener/Home Scene-bound civic/formalization infrastructure.
- Business/Monetization: doctrine and deferred boundary unless the project explicitly moves into that stage.

## Context Loading Rule

Use layered context, not bulk context.

When a task changes cross-system product truth, use `docs/specs/system/documentation-framework.md` to identify the owner contract, lane-agent ownership, reviewer routing, Linear issue structure, and handoff promotion rule. Orientation docs and lane briefs should point to owner specs instead of carrying full duplicated rules.

For focused implementation:

1. `AGENTS.md`
2. this file
3. `docs/agent-briefs/CONTEXT_ROUTER.md`
4. the active lane brief
5. exact specs/runtime/tests for the touched surface

For broad audits, architecture work, or platform strategy:

- Load the heavier curated authority pack named by `AGENTS.md`, the router, or the audit prompt.
- Keep legacy and handoff docs routed by topic; do not bulk-load stale history as current truth.

## Lane Router

After this file, use `docs/agent-briefs/CONTEXT_ROUTER.md` to pick the active lane:

- UX/UI and design: `docs/agent-briefs/UI_CURRENT.md`
- Actions/signals: `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`
- Artist/source/source-dashboard: `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- Events/archive: `docs/agent-briefs/EVENTS_ARCHIVE.md`
- Onboarding/Home Scene/GPS: `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
- Registrar/governance: `docs/agent-briefs/REGISTRAR_GOVERNANCE.md`
- Business/monetization: `docs/agent-briefs/BUSINESS_MONETIZATION.md`
- External tools/design agents: `docs/agent-briefs/EXTERNAL_TOOLS.md`

Lane agents own work areas, not final product truth. Durable product contracts live in `docs/specs/**`; see `docs/specs/system/documentation-framework.md#lane-agents`.

## Deferred Unless Activated

Do not implement these from canon doctrine alone:

- billing, subscriptions, Discovery Pass, paid boosts, coupons/offers, business dashboard, premium analytics runtime
- real media upload/storage/transcoding/waveform pipeline
- dedicated Uprise persistence model
- Prime model generated sect/channel/subcommunity architecture
- state/national tier expansion beyond current guarded/deferred behavior
- calendar mutation/export actions in Plot Events
- source posts/messages runtime

## Authority Reminder

If sources conflict, follow `AGENTS.md` first. Canon remains doctrinal authority, but older canon wording may be superseded by newer active specs, lane briefs, runtime locks, or explicit stale/deferred annotations. Report the conflict instead of flattening it.
