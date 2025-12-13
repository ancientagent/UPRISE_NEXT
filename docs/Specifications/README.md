# 📚 Specifications — UPRISE Platform Modules

**Location:** `docs/Specifications/`  
**Purpose:** Single index of all module specs and their canonical IDs.

> New module-organized specs and templates live under `docs/specs/` (see `docs/specs/README.md`). This directory remains the canonical ID index while migration is in progress.

---

## Index

1. **01_UPRISE_Master_Overview.md** — Platform map & integration flows
2. **02_UPRISE_Skeleton_Framework.md** — High-level architecture & relationships
3. **04_UPRISE_Community_Location_System.md** — Geo + community backbone (PostGIS, GPS verification)
4. **06_UPRISE_Song_Management_System.md** — Upload → process → HLS → discovery
5. **07_UPRISE_Discovery_Map_System.md** — Map UI, feed, search, trending
6. **08_UPRISE_Events_System.md** — Event creation, booking, ticketing integration
7. **09_UPRISE_Promotions_Business.md** — Promotions, partners, analytics

> If you are migrating specs from the legacy repo, keep these filenames and headings unchanged so cross‑repo links remain valid.

---

## Authoring Rules
- Each spec must declare: Purpose, Components, Integration Points, API Endpoints, Data Model, Testing Requirements, Success Metrics.
- Any change to shared contracts must be mirrored in `packages/types` and regenerate OpenAPI / SDK.
- Link PRs to the spec sections you modified.
