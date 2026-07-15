# Named Listener Sect Request

**Agent:** Codex local

**Date:** 2026-07-14

**Branch:** `codex/sect-membership-readiness`

**Base:** `origin/main@10787dc`

**Related Specs:** `docs/specs/system/registrar.md`,
`docs/specs/communities/scenes-uprises-sects.md`

**Scope:** API schema/migration, Registrar request runtime, web read types, tests,
and current-state docs

## Summary

The legacy-compatible `/registrar/sect-motion` path now accepts a named request
from any listener in the matching established Home Scene. The API creates the
submitted Registrar row and linked parent-scoped Sect identity atomically,
while submitter-owned reads preserve legacy empty rows without inventing an
identity.

## Scope And Deliverables

- Added nullable one-to-one `Sect.requestRegistrarEntryId` provenance with an
  additive `ON DELETE SET NULL` migration; no backfill or database deployment.
- Added nullable `User.homeSceneId` as the durable natural/proxy civic anchor,
  with authoritative onboarding, Home Scene change, invite-claim, and
  proxy-to-natural cutover writers. Its additive migration performs no guessed
  backfill or database deployment.
- Extracted Sect request/list/detail behavior into a dedicated Registrar
  service/controller while preserving all existing endpoint paths.
- Required and normalized `sectName`, generated a deterministic parent-scoped
  slug, and narrowly translated expected identity collisions.
- Kept request authority listener-side and Home Scene-scoped; no Artist/Band
  source ownership is required.
- Request authority uses the durable Home Scene anchor rather than transient
  `tunedSceneId` Away Scene state. Legacy null anchors use only a safe exact
  active natural tuple or one unambiguous active same-community proxy
  membership; ambiguous proxy history is rejected.
- Discovery context now reads the same durable civic anchor separately from
  mutable tuning, retaining exact-tuple fallback only for legacy null anchors.
- Normalized new and legacy list/detail responses to nullable name/slug and
  nullable linked Sect identity; aligned the web read type and tests.
- Explicitly excluded Artist/Band membership, legitimacy/readiness evaluation,
  progress visibility, activation, update channels, public UI, extra approval,
  provider operations, and song-level Sect state.

## Implementation Notes

- Schema/provenance commit: `75f4e87`.
- Dedicated API workflow commit: `f51170e`.
- Product/code review repair commit: `45f02ce`.
- Durable Home Scene authority repair commit: `a2827a9`.
- Durable Home Scene read-context repair commit: `8bd1eb7`.
- Final civic-transition and default-authority reviewer repair commit: `2d4b377`.
- Migration file:
  `apps/api/prisma/migrations/20260715030000_add_sect_request_provenance/migration.sql`.
- Civic-anchor migration file:
  `apps/api/prisma/migrations/20260715033000_add_user_home_scene_anchor/migration.sql`.
- Unicode display names are preserved. When ASCII slugging yields no content,
  the route uses `sect-` plus the first 16 lowercase hexadecimal characters of
  SHA-256 over the NFC-normalized trimmed name. Unicode combining marks across
  the full mark category are removed before ASCII slug shaping.
- A same-parent slug collision returns `ConflictException`; unrelated database
  failures are not masked.

## Validation Evidence

- Expanded API regression set after reviewer repairs: 12 suites, 287 tests
  passed.
- API typecheck and Prisma client generation passed.
- Web Registrar contract suites: 2 suites, 87 tests passed.
- Web typecheck passed.
- Full repository verification passed all 12 tasks; workspace audit passed with
  all 72 entries covered. Exact-commit independent product/code re-reviews are
  the remaining closeout gates before PR submission.

## Review Repairs

- Product review found that submitted-locality equality alone excluded
  listeners assigned to an active proxy Home Scene. The first repair reused the
  selector resolver, but code re-review correctly found that this could differ
  from onboarding's distance-selected proxy. Runtime now persists the actual
  assigned natural/proxy civic anchor separately from Away tuning, with safe
  non-guessing legacy fallbacks and exact/proxy/Away/ambiguous coverage.
- Code review found that the first slug implementation removed only the common
  `U+0300-U+036F` combining-mark block. Runtime now removes the complete Unicode
  mark category and covers an extended combining mark regression.
- Final code re-review found two remaining transition paths that still derived
  former civic state from compatibility or tuning data. Activation cutover now
  preserves the former proxy from durable `homeSceneId`, never a transient Away
  tune, and explicit Home Scene changes report the stored prior anchor before
  using exact-tuple fallback for legacy null rows.
- Final product re-review found two additional writers that could desynchronize
  the new authority boundary. Default/star changes now resolve an active
  natural/proxy scene and atomically update preference, anchor, tuning,
  compatibility, and membership state; unresolved preferences cannot replace
  the active default. Explicit Home Scene changes resolve inactive requested
  cities to active natural/proxy scenes rather than persisting inactive anchors.
- Final product/code re-review found that catching duplicate membership errors
  inside PostgreSQL interactive transactions could still abort authoritative
  Home Scene writes. Onboarding, default/star changes, and explicit Home Scene
  changes now use non-throwing duplicate-safe membership insertion and increment
  `memberCount` only for a newly inserted membership. Required onboarding and
  Registrar/Sect routing docs were also reconciled to the durable civic anchor
  and implemented named-request boundary.

## Next Separate Slice

Do not add Artist/Band Sect membership writes until the owner contracts settle:

1. same-Home-Scene cross-Sect membership exclusivity;
2. withdrawal and append-oriented audit behavior;
3. detailed readiness/progress readers;
4. exact registered-source eligibility, including legacy canonical sources
   without Registrar linkage.

These mechanics do not reopen the settled five-member, aggregate 45-minute,
current-deck, or 15-minute-per-source rules.
