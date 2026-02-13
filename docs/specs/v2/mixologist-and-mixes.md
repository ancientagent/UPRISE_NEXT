# Mixologist and Mixes

**ID:** `V2-MIXES`
**Status:** `draft`
**Owner:** `platform`
**Last Updated:** `2026-02-13`

## Overview & Purpose
Defines Mixologist capability and curated Mixes as a V2 feature.

## User Roles & Use Cases
- Listener upgrades to Mixologist to create and sell mixes.
- Users explore mixes and view attribution.

## Functional Requirements
- Mixologist upgrade requires Discovery Pass (+$4/mo).
- Mixes are curated collections of songs.
- Personal mixes are free to create and share.
- Commercial mixes require artist approval.
- Mix Market supports premium mixes and tip jar.
- Attribution is mandatory for all artists and songs.
- Mixes can display community resonance and trending stats.

## Non-Functional Requirements
- Mixes do not affect Fair Play rotation.
- No automated recommendation of mixes.

## Architectural Boundaries
- Mixes are user‑generated and opt‑in.

## Data Models & Migrations
- Mix
- MixItem
- MixAttribution
- MixApproval

## API Design
- TBD

## Web UI / Client Behavior
- Mix detail pages show attribution and Scene context.
- Mixologists can manage approvals and pricing.

## Acceptance Tests / Test Plan
- Commercial mixes blocked without artist approval.
- Attribution displayed on all mixes.

## References
- `docs/canon/Legacy Narrative plus Context .md`
