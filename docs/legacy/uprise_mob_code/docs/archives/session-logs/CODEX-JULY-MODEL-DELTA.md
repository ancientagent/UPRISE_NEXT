# July Model → Phase 2 Delta Report (Read‑Only Import)

Date: 2025-09-08

Sources (read only)
- docs/archives/july-model/architecture realignment/*
- docs/archives/july-model/Feature realignment/*

Summary
- Purpose: Capture what July Model reports demand, what Phase 2 specs already cover, and what remains to align the backend/mobile.

Already implemented in Phase 2 specs
- Identity unification
  - Canonical performer model documented: ArtistProfile + optional Band linkage.
  - Auth spec includes `X-Artist-Canonical-Id` header and ownership checks.
  - SYSTEM_OVERVIEW defines canonical IDs used by Songs/Events/Promotions.
- Location filters
  - Standard params defined and linked: `city,state,genre,lat,lng,radius,community_key`.
  - PostGIS usage, GIST indexes, and sample queries documented.
- Radio ↔ Community unification
  - Radio defined as a projection of Community queues; same filters and identity.
  - Response contract to echo `community_key` documented.
- Genre upgrade
  - 97-genre alignment captured; taxonomy + optional `genre_tags[]` for discovery/promotions.

What remains to implement
- Mobile onboarding
  - Ensure mobile uses `/onboarding/all-genres` and sets home scene (city/state).
  - After signup, create/confirm ArtistProfile; present profile switcher context.
- Discovery geo filtering
  - Discovery endpoints must apply `community_key` or city/state/genre; echo `community_key` in responses.
- Radio queue context
  - Guarantee tier↔community mapping is consistent (CITY/STATE/NATIONAL) and honors `community_key`.
- Feed contract
  - Keep `/home/feed` as notifications only (no songs/events payloads); ensure referenced notifications reflect user station.
- Auth ownership
  - Enforce that writes referencing an `artist_canonical_id` (and optional `band_id`) are authorized for the user.

Migrations or endpoints to add/modify (webapp_api)
- Shared community context resolver (new)
  - Utility/middleware to normalize `community_key` from query OR user station (with genre), attach to `req.context`.
- Radio (routes/radio.js)
  - Accept standard params; require/derive `community_key`; echo in response.
  - Ensure tier mapping and fallback selection respect community filters.
- Discovery (routes/discovery.js)
  - Apply `community_key` or city/state/genre filters; use PostGIS when columns exist, fallback to string filters otherwise.
  - Echo `community_key`, include a `filters` block; paginate.
- Home Feed (routes/home.js)
  - Verify notifications-only behavior remains; remove any residual song/event rows from feed payloads.
- Artist write paths (e.g., song/event/promotions)
  - Validate presence of `X-Artist-Canonical-Id` and user→artist ownership; reject unauthorized writes.
- Optional migrations (only if missing)
  - Add `genres.parent_genre_id` and `songs.genre_tags text[]` for taxonomy and tags.
  - Ensure geography columns have GIST indexes; create community view if needed.

Acceptance checkpoints
- curl smokes return 200 with correct `community_key` echo for discovery and radio.
- Feed endpoint payload contains only notification records.
- Onboarding endpoints return 97-genre set; mobile requests reflect new filters and header usage.

Notes
- All steps remain non‑destructive; database writes limited to approved migrations/seeds.
