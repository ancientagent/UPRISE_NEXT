# 2026-02-22 — Phase 2 Roadmap Kickoff + Slice 64 (Invite Delivery-State Hardening)

## Scope Lock (This Slice)
- Deliver Phase 2 roadmap for registrar-linked Artist/Band continuation from current Phase 1 baseline.
- Keep identity canon-first: Artist/Band remains a Registrar-linked entity, never a user capability flag.
- Implement additive API hardening only for invite-delivery lifecycle and claimability boundaries.
- Avoid new user-facing CTA/surfaces; use existing Registrar action model only.
- Preserve non-destructive migration posture for Phase 2 kickoff.

## Out of Scope (This Slice)
- Promoter capability grants.
- Project registration endpoint implementation.
- Sect motion endpoint implementation.
- Destructive schema/data removals.
- Mobile/web UI redesign work beyond existing Registrar flow.

## Evidence Base
- Canon authority:
  - `docs/canon/Master Narrative Canon.md` section `5.2 Artist / Band Entity`.
  - `docs/canon/Master Narrative Canon.md` section `7.4 Registrable Actions (V1)`.
  - `docs/canon/Master Narrative Canon.md` section `7.6 Design Constraint`.
- Current spec state:
  - `docs/specs/users/identity-roles-capabilities.md`
  - `docs/specs/system/registrar.md`
- Phase 1 baseline:
  - `docs/handoff/2026-02-22_phase1-api-hardening-completion.md`

## Phase 2 Roadmap (Evidence-Based, PR-Safe Slices)
1. Slice 64 (this change): invite-delivery lifecycle hardening and worker-ready finalization primitive.
2. Slice 65: execute queued invite deliveries through a dedicated worker/provider adapter with retry/error capture.
3. Slice 66: expose submitter-visible invite delivery outcomes (sent/failed timestamps and counts) in registrar status read surfaces.
4. Slice 67: add automated delivery trigger lane (scheduled/worker invocation) with idempotency + replay safety.
5. Slice 68: end-to-end registrar invite-delivery integration tests against DB-backed QA lane.

## Migration Strategy (Phase 2)
- Keep Phase 2 kickoff migration-free where possible (behavioral hardening first).
- If schema expansion becomes necessary for delivery telemetry (retry count, last error), use additive nullable columns first.
- Defer destructive or contract-removal operations to explicit deprecation slices after at least one green compatibility slice.

## Risks and Controls
- Risk: invite token flow accepts invalid lifecycle states and bypasses intended delivery process.
  - Control: claim/preview now enforce explicit claimable states (`queued`, `sent`).
- Risk: delivery row and member lifecycle can drift.
  - Control: single-transaction finalization method updates delivery + member status together.
- Risk: uncontrolled feature expansion in Phase 2.
  - Control: scope lock + per-slice docs/spec/changelog/handoff + validation gate.

## Rollback Strategy
- Code-only rollback: revert Slice 64 commit (no schema migration).
- Forward-fix option: relax claimable-state guard to previous behavior if emergency compatibility issue appears.

## Slice 64 Implementation Summary
- `apps/api/src/auth/auth.service.ts`
  - Added explicit claimable invite-state guard for `registerFromInvite` and `previewInvite` (`queued` or `sent` only).
- `apps/api/src/registrar/registrar.service.ts`
  - Added internal `finalizeQueuedInviteDelivery(registrarArtistMemberId, status)` primitive to finalize queued deliveries as `sent`/`failed`.
  - Finalization updates queue row and member lifecycle status in one transaction.
- Tests:
  - `apps/api/test/auth.invite-registration.service.test.ts`
  - `apps/api/test/registrar.service.test.ts`

## Validation Results
- `pnpm run docs:lint` — passed
- `pnpm run infra-policy-check` — passed
- `pnpm --filter api test -- auth.invite-registration.service.test.ts registrar.service.test.ts` — passed (2 suites, 53 tests)
- `pnpm --filter api typecheck` — passed
- `pnpm --filter web typecheck` — passed
