# Artist Dashboard IA (R1)

## Purpose
Define information architecture for a separate artist management dashboard app/site.

## Canon Anchors
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/specs/system/registrar.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/specs/economy/print-shop-and-promotions.md`
- `docs/specs/engagement/activity-points-and-analytics.md`
- `docs/specs/economy/revenue-and-pricing.md`

## Product Boundary
- Listener Plot/Discovery remains in main web app.
- Artist dashboard is a separate authenticated surface focused on artist operations.
- No governance bypass, no pay-for-placement semantics.

## Top-Level Navigation
1. Overview
2. Catalog
3. Audience (Analytics)
4. Events
5. Promotions
6. Registrar
7. Team & Access
8. Settings

## Section Responsibilities

### 1) Overview
- Current active artist/band entity context.
- Quick status cards:
  - Active slot usage (Standard vs Premium semantics)
  - Recent releases status
  - Upcoming events count
  - Registrar notices / required actions
- CTA set: navigate deeper, no speculative write actions.

### 2) Catalog
- Track list and release lifecycle visibility.
- Rotation context visibility (descriptive only).
- Explicit actions are limited to implemented endpoints/contracts.

### 3) Audience (Analytics)
- Descriptive analytics only (no ranking/recommendation language).
- City/state/national descriptive cuts where canon permits.
- Premium analytics sections visibly labeled and gated.

### 4) Events
- Scene-bound event management entry.
- Event status, upcoming/past partitions.
- Print Shop event creation pathway (as canon defines).

### 5) Promotions
- Promotions are paid surface and separate from Fair Play.
- Scope-oriented campaign management; no recommendation claims.

### 6) Registrar
- Artist/Band registrar lifecycle and capability/code statuses.
- Motion/status tracking, invite/member status where available.

### 7) Team & Access
- Linked-member visibility for artist/band entities.
- Permission surface is read-first until capability APIs are fully locked.

### 8) Settings
- Profile fields, visibility preferences, account-level controls.
- Billing/entitlements shown as planned/deferred where backend is not implemented.

## IA Rules
- No hidden authority-changing actions.
- No ambiguous role language (User vs Artist/Band entity stays explicit).
- Keep every action traceable to an existing endpoint or deferred marker.

## R1 Exclusions
- Full billing execution flows.
- V2 features (Mixologist, Ambassador, Search Parties).
- Speculative algorithmic discovery/recommendation tools.
