# Open-Source Technology Radar

Status: agent reference only
Last updated: 2026-08-17

## Purpose

This is a concise, repo-readable technology shortlist for agents that do not
have Codebase Memory MCP access. It records evaluated open-source projects and
their allowed UPRISE seams. It is not product doctrine, an implementation plan,
or authorization to install a dependency.

Read the named owner spec before proposing or using a project below. Current
runtime and owner specs outrank this radar.

## Evaluate Later

| Project | Exact UPRISE seam | Preconditions | Status |
| --- | --- | --- | --- |
| [MapLibre GL JS](https://github.com/maplibre/maplibre-gl-js) | Deferred Discover map renderer for explicit, deterministic community discovery, map markers, filters, and manual Tune actions. | Activate Discover map/Seek; define marker data, tile/style provider, attribution, privacy, cost, and WebGL fallback in `docs/specs/communities/discovery-scene-switching.md`. | Evaluate later. Map rendering only; it must not resolve Scenes, choose recommendations, or alter authority. |
| [Maputnik](https://maplibre.org/maputnik/) | Designer/developer map-style authoring tool for a future MapLibre surface. | Same Discover map activation; style ownership and tile provider selected. | Evaluate later. Tooling only, not a runtime dependency. |
| [PMTiles](https://github.com/protomaps/PMTiles) | Optional static tile packaging/hosting approach for a future map, potentially reducing a dedicated tile-server dependency. | Map data, attribution, tile-generation, hosting, and update cadence selected. | Evaluate later. Evaluate licensing and operational fit in the map slice. |
| [pg-boss](https://github.com/timgit/pg-boss) | Future durable Postgres-backed job execution for RADIYO lifecycle automation: due ingestion, protected-window graduation, recurrence recompute, retries, run records, and overlap protection. | First lock the production worker contract, retry/idempotency, cadence, deployment owner, PostgreSQL/Node compatibility, and migration plan. | Evaluate later. It is orchestration only; it must not implement or select Fair Play rules. |
| [hls.js](https://github.com/video-dev/hls.js) | Browser HLS playback adapter for a later authorized RADIYO or Track Mode media URL, including future music-video playback. | Media owner must authorize HLS manifests, CORS/content-type validation, source/provider provenance, playback telemetry, and failure behavior. | Evaluate later. It consumes server-selected media and never selects broadcast rotation. |

## Reference Only

| Project | Potential narrow use | Boundary |
| --- | --- | --- |
| [wavesurfer.js](https://github.com/katspaugh/wavesurfer.js) | Future waveform display for explicit Artist Profile/Track Mode playback. | Do not adopt before a media owner activates precomputed waveform/peak generation; do not use it for RADIYO scheduling. |
| [PixiJS](https://github.com/pixijs/pixijs) | Later animated/canvas-heavy avatar, collection, or dense map-marker surface. | Start avatar collection/equipment with layered SVG/PNG in normal web UI. PixiJS is unnecessary unless performance or interaction demands it. |
| [DiceBear](https://github.com/dicebear/dicebear) | Placeholder/reference for deterministic SVG avatar composition. | Do not use it as UPRISE visual identity; each bundled style has its own license. |
| [Avataaars](https://github.com/fangpenlin/avataaars-generator) | Reference for mix-and-match SVG avatar composition. | Do not import its generic visual language as the UPRISE avatar system. |

## Reject For Current UPRISE

| Project/category | Why it is not a fit |
| --- | --- |
| Liquidsoap, Icecast, AzuraCast, and self-hosted music-server suites | They introduce a second station/source/media control plane, duplicate UPRISE Fair Play/source logic, and commonly carry GPL/AGPL or dedicated-ops obligations. |
| Annoy and recommendation/vector-similarity engines | They conflict with UPRISE's explicit non-algorithmic, user-directed discovery model. |
| Temporal | Durable workflow infrastructure is far heavier than the current city-tier worker requirements. |
| Pedalboard and Basic Pitch | No currently approved source-media seam; they would add DSP/model-inference scope before UPRISE has activated its media pipeline. |

## Current UPRISE Boundaries

- RADIYO Fair Play, source eligibility, Release Deck scheduling, and community authority are UPRISE-owned logic. External projects may provide bounded delivery, rendering, or job-execution infrastructure only.
- Discover is explicit user-directed transport. Maps may render choices but cannot infer, recommend, resolve, or mutate civic authority.
- Media upload, storage, transcoding, waveform generation, and video delivery remain deferred until a media owner spec activates them.
- Flyer artifacts are event-bound Proof-of-Support issuance. They are not crypto, a marketplace, or default music signals.
- Avatar merch and patches belong to a future collection/equipment system. A custom layered asset renderer is the default design direction.

## Required Reading By Seam

- RADIYO/Fair Play: `docs/specs/broadcast/radiyo-and-fair-play.md`
- Release Deck/media: `docs/specs/media/release-deck-and-eligibility.md`
- Discover map/transport: `docs/specs/communities/discovery-scene-switching.md`
- Event flyers: `docs/specs/events/events-and-flyers.md`
- Signals and collections: `docs/specs/core/signals-and-universal-actions.md`
- Avatar/collection founder context: `docs/founder-sessions/2026-07-11_avatar-modular-merch-taxonomy.md` and `docs/founder-sessions/2026-07-12_avatar-creation-inventory-boundary.md`

## Update Rule

Update this radar only after a focused primary-source review of the project,
license, maintenance status, UPRISE owner specs, and current runtime seam. Do
not promote a project to implementation based on this reference alone.
