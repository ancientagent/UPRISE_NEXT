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
- Extracted Sect request/list/detail behavior into a dedicated Registrar
  service/controller while preserving all existing endpoint paths.
- Required and normalized `sectName`, generated a deterministic parent-scoped
  slug, and narrowly translated expected identity collisions.
- Kept request authority listener-side and Home Scene-scoped; no Artist/Band
  source ownership is required.
- Reused the Home Scene selector's active natural/proxy resolution rule for
  request authority. The resolver derives authority from submitted locality and
  default music community, not transient `tunedSceneId` Away Scene state.
- Normalized new and legacy list/detail responses to nullable name/slug and
  nullable linked Sect identity; aligned the web read type and tests.
- Explicitly excluded Artist/Band membership, legitimacy/readiness evaluation,
  progress visibility, activation, update channels, public UI, extra approval,
  provider operations, and song-level Sect state.

## Implementation Notes

- Schema/provenance commit: `75f4e87`.
- Dedicated API workflow commit: `f51170e`.
- Migration file:
  `apps/api/prisma/migrations/20260715030000_add_sect_request_provenance/migration.sql`.
- Unicode display names are preserved. When ASCII slugging yields no content,
  the route uses `sect-` plus the first 16 lowercase hexadecimal characters of
  SHA-256 over the NFC-normalized trimmed name. Unicode combining marks across
  the full mark category are removed before ASCII slug shaping.
- A same-parent slug collision returns `ConflictException`; unrelated database
  failures are not masked.

## Validation Evidence

- Focused API regression set after reviewer repairs: 7 suites, 229 tests passed.
- API typecheck and Prisma client generation passed.
- Web Registrar client suite: 57 tests passed.
- Web typecheck passed.
- Full repository verification, workspace audit, and exact-commit independent
  product/code re-reviews are the remaining closeout gates before PR submission.

## Review Repairs

- Product review found that submitted-locality equality alone excluded
  listeners assigned to an active proxy Home Scene. Runtime now shares the
  selector's natural/proxy resolver and explicitly ignores transient Away Scene
  tuning for authority; exact, proxy, Away, and unresolved cases are covered.
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
