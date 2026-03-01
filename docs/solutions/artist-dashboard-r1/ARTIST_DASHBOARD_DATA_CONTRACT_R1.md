# Artist Dashboard Data Contract (R1)

## Purpose
Map dashboard surfaces to implemented or canon-planned contracts and identify gaps before UI implementation.

## Legend
- `Implemented`: endpoint/shape exists now.
- `Planned`: canon defines target but backend not implemented.
- `Gap`: no locked API contract yet.

## Core Identity + Profile
- `GET /users/:id` -> Implemented
- `GET /users/:id/profile` -> Implemented
- Notes:
  - User profile != canonical full artist-entity graph.
  - Artist/Band linked-entity model remains partially deferred.

## Registrar Domain
- Registrar read/write contracts in active implementation stream (artist registration, invite status, sync, etc.)
- Status: Partially implemented (incremental slices completed in current roadmap)
- Notes:
  - Keep registrar as civic workflow surface, not ranking engine.

## Catalog / Tracks
- `GET /tracks` / `GET /tracks/:id` -> Implemented
- `POST /tracks/:id/engage` -> Implemented (recurrence input)
- Gap:
  - Full artist-owned catalog management contract not fully locked as separate dashboard API set.

## Broadcast / Rotation
- `GET /broadcast/rotation` -> Implemented
- `GET /broadcast/:sceneId/rotation` -> Implemented
- Notes:
  - Used for descriptive playback context, not placement control.

## Events
- `GET /events` / `GET /events/:id` -> Implemented
- `GET /communities/:id/events` -> Implemented
- Planned write side:
  - `POST /print-shop/events`
  - `PATCH /events/:id`
  - `POST /events/:id/proof`
  - `POST /events/:id/flyers/mint`

## Promotions
- `GET /communities/:id/promotions` -> Implemented read projection
- Billing/campaign write flows -> Planned

## Analytics
- Descriptive analytics framework is specified.
- Implemented web/API metrics are partial.
- Premium analytics capability exists in canon as gated concept, billing/entitlement infra deferred.

## Entitlements / Billing
- Canon lock:
  - Free Listener: Home Scene only transport
  - Discovery Pass: global scene transport
- Billing APIs -> Planned (`/billing/subscriptions`, etc.)
- R1 interim behavior policy:
  - UI entitlement gating allowed as explicit temporary guard until billing backend lands.

## Founder-Approved R1 Additions (Thread)
1. Discovery transport gating in web UX
- Free mode: cross-scene transport locked.
- Discovery Pass mode: unlocked transport.
- Implemented as explicit UI gate with temporary dev override.

2. Player navigation
- Active player art/title can route users to artist profile where artist id is available.

## Contract Gaps To Resolve Before Full Artist Dashboard Build
1. Canonical artist-entity membership API for team management.
2. Catalog write API ownership model and moderation constraints.
3. Premium analytics entitlement source of truth contract.
4. Promotions campaign write lifecycle contract for dashboard control plane.

## R1 Implementation Policy
- Do not claim backend support where only planned.
- Render planned/gap areas as explicit "Not yet active" surfaces.
- Keep data model and permissions explicit in UI copy.
