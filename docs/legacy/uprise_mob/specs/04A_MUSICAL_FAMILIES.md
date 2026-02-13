# Musical Families Community System (Phase 2)

This specification replaces any previous super/sub‑genre onboarding hierarchy. Communities are defined by geographic location + Musical Family.

## Rationale
- Prevents fragmented, lifeless communities; aligns with real scenes.
- Users immediately join a vibrant community identity.

## Community Key
- Format: `{city}-{state}-{family-id}`
- Example: `austin-texas-hardcore-punk-family`

## Onboarding Flow
1) User selects City/State.
2) Prompt: “What music are you most into?” → Super‑genre typeahead.
3) Then select a Musical Family within that super‑genre.
4) Assign user to `{city}-{state}-{family-id}` community.

Notes:
- All families are selectable in all cities. If local content is sparse, server returns backfilled rotations while preserving the local community identity.

## API (MVP)
- `GET /families/all` → list families: `{ id, name, territory, subGenres[], description? }[]`
- `GET /families/{familyId}` → details (optional)
- `POST /users/assign-community { city, state, familyId }` → `{ community_key }`
- Discovery/Radio endpoints accept `community_key` and should always return playable content.

## Data Model (Minimum)
- `musical_families(id, territory, name, description)`
- `family_subgenres(family_id, subgenre_slug)`
- `cities(id, city, state, lat, lng)`
- `communities(id, city_id, family_id, status, music_minutes, artist_count, activated_at)`
- `users(..., primary_community_key)`

## Families (MVP Set)
Hip Hop
- trap-family → trap, drill, mumble-rap, soundcloud-rap, atlanta-trap
- classic-hip-hop-family → boom-bap, east-coast-hip-hop, west-coast-hip-hop, conscious-rap
- regional-hip-hop-family → southern-hip-hop, uk-drill, afro-hip-hop, latin-trap
- alternative-hip-hop-family → abstract-hip-hop, jazz-rap, experimental-hip-hop, indie-hip-hop

Punk
- hardcore-punk-family → hardcore-punk, straight-edge, crust-punk, d-beat, powerviolence
- pop-punk-family → pop-punk, emo, post-hardcore, emocore, melodic-hardcore
- street-punk-family → oi, street-punk, ska-punk, punk-rock, anarcho-punk

Metal
- extreme-metal-family → black-metal, death-metal, grindcore, blackened-death-metal
- classic-metal-family → heavy-metal, power-metal, traditional-metal, nwobhm, speed-metal
- modern-metal-family → metalcore, deathcore, djent, progressive-metal, nu-metal
- doom-sludge-family → doom-metal, sludge-metal, stoner-rock, post-metal

Electronic
- house-family → deep-house, tech-house, progressive-house, acid-house, future-house
- techno-family → detroit-techno, minimal-techno, industrial-techno, acid-techno
- bass-family → dubstep, drum-and-bass, uk-garage, future-bass, breakbeat
- ambient-experimental-family → ambient, idm, experimental-electronic, downtempo, glitch

Folk/Country
- traditional-folk-family → traditional-folk, celtic-folk, bluegrass, old-time, american-folk
- modern-folk-family → indie-folk, folk-rock, contemporary-folk, singer-songwriter, acoustic
- country-family → country, alt-country, outlaw-country, country-rock, americana

## Business Rules
- Community identity is always Location + Family.
- Sub‑genres live on profiles for discovery and future splitting; they are not part of the community key.
- Server should backfill rotations to avoid empty experiences for new communities.

## Mobile Integration
- Feature flag: `FAMILY_COMMUNITIES_ENABLED=true` switches onboarding to Super‑genre → Family.
- Client builds `community_key` via `toFamilyCommunityKey(city, state, familyId)` and persists it.
- Discovery/Radio send `community_key` in requests.

## References
- `docs/overview/PHASE2_EXECUTION_PLAN.md` (Workstreams/Onboarding)
- `docs/specs/04_COMMUNITY_LOCATION.md` (Geo & keys)

