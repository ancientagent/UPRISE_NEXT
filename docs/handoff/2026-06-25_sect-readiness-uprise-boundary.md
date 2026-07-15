# Sect Readiness And Sect Uprise Boundary

Date: 2026-06-25
Branch: docs/abacus-fusion-swarm-strategy
Slice: Community activation proxy lifecycle - Sect readiness owner boundary

## Summary

Promoted the scattered Sect readiness / Sect Uprise rules into explicit owner sections without changing runtime behavior.

Owner contract updates:

- `docs/specs/communities/scenes-uprises-sects.md#sect-readiness-and-sect-uprise-boundary` now owns the community-side Official Sect, readiness, and Sect Uprise broadcast boundary.
- **Corrected 2026-07-14:** `docs/specs/system/registrar.md#sect-request-and-artistband-membership-authority` owns the listener request and Registrar-held Artist/Band Sect membership; songs carry no separate Sect state.
- `docs/specs/system/documentation-framework.md` now routes Sect readiness / Sect Uprise boundary to those owner sections and narrows the remaining gap to implementation artifacts and visibility calibration.

No code, schema, migration, seed, provider, or DB action was added.

## Files Changed

- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/system/registrar.md`
- `docs/specs/system/documentation-framework.md`
- `docs/agent-briefs/REGISTRAR_GOVERNANCE.md`
- `docs/solutions/COMMUNITY_ACTIVATION_PROXY_LIFECYCLE_STRATEGY_R1.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-06-25_sect-readiness-uprise-boundary.md`

## Behavior Locked

- Official Sect status is pre-Uprise and does not grant independent broadcast authority.
- Sect affiliation must be explicit and Registrar-held; loose profile tags, passive genre/style metadata, and listener taste tags are not authoritative affiliation.
- Sect readiness counts approved playable minutes only from registered source accounts that explicitly tag/back/affiliate through the Registrar-owned path.
- The current readiness target mirrors community activation at `45` minutes of committed playable artist catalog.
- Sect Uprises should mirror Home Scene behavior wherever possible while staying scoped inside the parent Home Scene/music community.
- Sect voting authority belongs to sect members once a Sect Uprise exists; listening access alone does not grant voting authority.
- Current runtime remains limited to Home Scene-scoped sect-motion submit/readback primitives.

## Current Runtime Boundary

Existing runtime:

- `POST /registrar/sect-motion`
- `GET /registrar/sect-motion/entries`
- `GET /registrar/sect-motion/:entryId`

Still deferred:

- readiness threshold validation;
- approval state machine;
- Official Sect affiliation records;
- update channels;
- public progress/creation surfaces;
- listener request, Artist/Band Sect membership, and current member-artist
  Release Deck readiness implementation;
- threshold-state transition implementation;
- dedicated Uprise persistence model.

## Validation

Run before commit:

```bash
pnpm run docs:lint
git diff --check
```

## Next Slice

Either:

1. define activation notification + saved Away Scene/profile preservation after manual activation, or
2. define sect implementation artifacts if the project wants to continue the sect lane next: affiliation schema, updates-channel information architecture, approval state machine, visibility timing, and backing limits.
