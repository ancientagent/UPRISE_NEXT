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

- Expanded API regression set after reviewer repairs: 12 suites, 284 tests
  passed.
- API typecheck and Prisma client generation passed.
- Web Registrar client suite: 57 tests passed.
- Web typecheck passed.
- Full repository verification, workspace audit, and exact-commit independent
  product/code re-reviews are the remaining closeout gates before PR submission.

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

## Next Separate Slice

Do not add Artist/Band Sect membership writes until the owner contracts settle:

1. same-Home-Scene cross-Sect membership exclusivity;
2. withdrawal and append-oriented audit behavior;
3. detailed readiness/progress readers;
4. exact registered-source eligibility, including legacy canonical sources
   without Registrar linkage.

These mechanics do not reopen the settled five-member, aggregate 45-minute,
current-deck, or 15-minute-per-source rules.
