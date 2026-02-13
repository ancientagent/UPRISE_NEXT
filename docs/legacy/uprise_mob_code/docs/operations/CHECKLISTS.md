# Checklists
- Release checklist
- Hotfix checklist
- Smoke-test checklist

## Phase-2 daily driver
1) Select active profile (User ↔ Artist/Band); confirm `X-Artist-Canonical-Id` in requests
2) Set discovery filters: `city/state/genre` and verify `community_key` echo
3) Radio smoke: fetch `/api/radio?community_key=...` and play 2 tracks
4) Discovery smoke: map loads with community/activity layers; filters applied
5) Events: create/search with city/state/genre; venue geofence respected
6) Promotions: create campaign with `community_key` or geo radius; review targeting
7) Fair Play: confirm queue includes genre/location inputs; anti-fraud checks active
8) DB: run PostGIS version check (5433) and 1 ST_DWithin query (read-only)
9) Mobile: cold start, verify persisted filters and active profile context
10) CI: ensure build passes; emulator boot optional, defer if constrained

Emulator parity checks (Phase 2)
- `.env.development`: `API_BASE_URL=http://10.0.2.2:3000`, `REFRESH_TOKEN_URL=/auth/refresh`, `UPDATED_USERDETAILS=/user/me`.
- After login, confirm `/user/me` fetch succeeds and route decision logs appear.
