# Lane C Handoff - SLICE-INVITE-441A

> Recovery note: reconstructed from adjacent batch templates and queue metadata after local destructive clean removed original untracked file.
> Exact original command transcript for this specific file was not recoverable from local conversation artifacts.

Slice
Task ID: SLICE-INVITE-441A
Title: Invite provider outcome parser pack 6
Queue: .reliant/queue/mvp-lane-c-invite-batch15.json
Runtime: .reliant/runtime/current-task-lane-c-batch15.json
Scope lock: invite reliability/read-model only; no endpoints/schemas/CTAs.

Verify Command:
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api test -- registrar.service.test.ts && pnpm --filter api typecheck && pnpm --filter web typecheck

Verify Output:

> uprise-next@1.0.0 docs:lint /home/baris/UPRISE_NEXT
> node scripts/docs-lint.mjs && pnpm run canon:lint

[docs:lint] ✅ No tracked PDFs
[docs:lint] ✅ No tracked Zone.Identifier artifacts
[docs:lint] ✅ Docs directory structure looks present
[docs:lint] ✅ Specs metadata present
[docs:lint] ✅ No unexpected root-level markdown files
[docs:lint] ✅ docs:lint passed

> uprise-next@1.0.0 canon:lint /home/baris/UPRISE_NEXT
> node scripts/canon-lint.mjs

[canon:lint] OK: Checked 10 canon markdown files

> uprise-next@1.0.0 infra-policy-check /home/baris/UPRISE_NEXT
> tsx scripts/infra-policy-check.ts


🔍 UPRISE Web-Tier Contract Guard
════════════════════════════════════════════════════════════════════════════════
Scanning: apps/web
Patterns: 24 prohibited patterns
════════════════════════════════════════════════════════════════════════════════


✅ Web-Tier Contract Guard: No violations detected!
   All architectural boundaries are properly enforced.


⏱️  Scan completed in 4ms

✅ Build succeeded: All checks passed!


> api@1.0.0 test /home/baris/UPRISE_NEXT/apps/api
> jest "registrar.service.test.ts"

PASS test/registrar.service.test.ts
  RegistrarService
    ✓ submits promoter registration for Home Scene with named production identity (2 ms)
    ✓ rejects promoter registration when requester is outside Home Scene (33 ms)
    ✓ rejects promoter registration when scene is missing (1 ms)
    ✓ rejects promoter registration when requester user is missing
    ✓ rejects promoter registration for non city-tier scene
    ✓ rejects promoter registration when requester has no established Home Scene (1 ms)
    ✓ submits project registration for Home Scene signal activation flow
    ✓ rejects project registration when requester is outside Home Scene (1 ms)
    ✓ rejects project registration when scene is missing
    ✓ rejects project registration when requester user is missing
    ✓ rejects project registration for non city-tier scene
    ✓ rejects project registration when requester has no established Home Scene
    ✓ submits sect-motion registration for Home Scene civic filing flow
    ✓ rejects sect-motion registration when requester is outside Home Scene
    ✓ rejects sect-motion registration when scene is missing
    ✓ rejects sect-motion registration when requester user is missing
    ✓ rejects sect-motion registration for non city-tier scene
    ✓ rejects sect-motion registration when requester has no established Home Scene (1 ms)
    ✓ lists submitter-owned promoter registrations with scene context
    ✓ includes promoter capability transition summary in promoter list reads (1 ms)
    ✓ returns empty list when submitter has no promoter registrations
    ✓ aggregates promoter list counts across mixed statuses
    ✓ preserves reverse-chronological ordering from promoter list reads
    ✓ normalizes missing promoter payload field to null in list reads (1 ms)
    ✓ trims promoter payload productionName in list reads
    ✓ normalizes whitespace-only productionName to null in list reads
    ✓ reads submitter-owned promoter registration detail (1 ms)
    ✓ includes promoter capability transition summary in promoter detail reads
    ✓ trims promoter payload productionName in detail reads
    ✓ normalizes whitespace-only productionName to null in detail reads
    ✓ rejects promoter detail read for non-submitting user
    ✓ rejects promoter detail read for non-promoter registrar entry type (1 ms)
    ✓ throws when promoter detail entry does not exist
    ✓ lists promoter capability audit events for submitter-owned registration
    ✓ rejects promoter capability audit read for non-submitting user (1 ms)
    ✓ lists submitter-owned project registrations with scene context
    ✓ normalizes blank projectName to null in project list reads
    ✓ normalizes malformed project payload to null projectName in project list reads
    ✓ reads submitter-owned project registration detail
    ✓ normalizes malformed project payload to null projectName in project detail reads (1 ms)
    ✓ rejects project detail read for non-submitting user
    ✓ rejects project detail read for non-project registrar entry type
    ✓ throws when project detail entry does not exist
    ✓ lists submitter-owned sect motions with scene context (1 ms)
    ✓ reads submitter-owned sect motion detail
    ✓ rejects sect-motion detail read for non-submitting user
    ✓ rejects sect-motion detail read for non-sect-motion registrar entry type
    ✓ throws when sect-motion detail entry does not exist (1 ms)
    ✓ issues registrar code for approved promoter registration with system issuer (1 ms)
    ✓ issues promoter capability code through system-only seam for approved promoter entry
    ✓ rejects system-only issuance seam when registrar entry is missing (6 ms)
    ✓ rejects system-only issuance seam for non-promoter registrar entry types
    ✓ rejects system-only issuance seam when promoter entry is not approved
    ✓ emits deterministic audit ordering for approve-then-issue lifecycle helper (1 ms)
    ✓ emits consistent system actor metadata on both approve and reject audit events
    ✓ rejects approve-then-issue lifecycle helper when actor context is not system
    ✓ rejects approve-then-issue lifecycle helper when decision entry is missing (1 ms)
    ✓ rejects approve-then-issue lifecycle helper when decision entry type is non-promoter
    ✓ rejects approve-then-issue lifecycle helper when issuance-phase entry is missing
    ✓ rejects approve-then-issue lifecycle helper when issuance phase sees invalid approved-state precondition
    ✓ applies promoter approval transition from submitted to approved (1 ms)
    ✓ applies promoter approval transition from submitted to rejected
    ✓ rejects promoter approval transition when registrar entry is not submitted
    ✓ rejects promoter approval transition when actor context is not system (1 ms)
    ✓ rejects promoter approval transition matrix from approved to approved
    ✓ rejects promoter approval transition matrix from rejected to approved
    ✓ rejects promoter approval transition matrix from materialized to approved
    ✓ rejects promoter approval transition when registrar entry has unknown lifecycle status
    ✓ returns deterministic invalid-transition message for unknown lifecycle status edge (1 ms)
    ✓ rejects promoter approval transition from submitted to unsupported target status literal
    ✓ returns deterministic submitted-only guard message for unsupported submitted target edge
    ✓ rejects promoter approval transition matrix from approved to rejected
    ✓ rejects promoter approval transition matrix from rejected to rejected
    ✓ rejects promoter approval transition matrix from materialized to rejected (1 ms)
    ✓ normalizes approval/rejection reason payload to bounded stable metadata shape
    ✓ normalizes decision reason edge case: empty string
    ✓ normalizes decision reason edge case: whitespace-only string
    ✓ normalizes decision reason edge case: tab/newline-only string
    ✓ normalizes decision reason edge case: undefined reason
    ✓ normalizes decision reason edge case: null reason
    ✓ normalizes decision reason edge case: non-string reason (1 ms)
    ✓ normalizes decision reason edge case: trimmed reason
    ✓ normalizes decision reason edge case: trimmed multiline reason
    ✓ preserves decision reason at exact max length without truncation
    ✓ truncates decision reason at max length plus one boundary
    ✓ trims before truncating when decision reason exceeds max length with outer whitespace
    ✓ rejects promoter approval transition for non-promoter registrar entry types
    ✓ rejects promoter approval transition when registrar entry is missing (1 ms)
    ✓ revokes active promoter capability grant with append-only audit log emission
    ✓ revokes active promoter capability grant when registrar entry status is rejected
    ✓ rejects promoter capability revocation for non-promoter registrar entry types
    ✓ rejects promoter capability revocation when no active grant exists
    ✓ rejects promoter capability revocation when grant state is non-active
    ✓ rejects promoter capability revocation when grant has revokedAt timestamp (1 ms)
    ✓ rejects promoter capability revocation when active grant-link entry differs from target entry
    ✓ rejects promoter capability revocation when active grant has null source entry linkage
    ✓ rejects promoter capability revocation when actor context is not system (1 ms)
    ✓ rejects promoter capability revocation when registrar entry is missing
    ✓ rejects registrar code issuance when issuer is not system
    ✓ rejects registrar code issuance when registrar entry is missing (1 ms)
    ✓ rejects registrar code issuance for non-promoter registrar entry types
    ✓ rejects registrar code issuance when promoter registrar entry is not approved
    ✓ rejects registrar code issuance replay when an active issued code already exists
    ✓ returns deterministic replay-block message when an active issued code already exists (3 ms)
    ✓ rejects registrar code issuance when duplicate active code appears during transactional race window (1 ms)
    ✓ returns deterministic replay-block message for transactional race-window duplicate detection
    ✓ retries registrar code issuance on transient codeHash uniqueness conflict and succeeds
    ✓ fails registrar code issuance after exhausting uniqueness retry attempts (1 ms)
    ✓ verifies a redeemable registrar code for approved promoter entry
    ✓ rejects registrar code verification when code does not exist (1 ms)
    ✓ rejects registrar code verification when code is no longer redeemable
    ✓ redeems registrar code for authenticated user
    ✓ rejects registrar code redemption when code was already redeemed (1 ms)
    ✓ rejects registrar code redemption when code is expired
    ✓ throws when target scene does not exist
    ✓ requires gps-verified home-scene account (1 ms)
    ✓ enforces city-tier Home Scene registrar boundary
    ✓ rejects submissions outside user Home Scene
    ✓ creates submitted registrar entry and member invite records (1 ms)
    ✓ materializes submitted entry into ArtistBand + owner membership
    ✓ materialize is idempotent when artistBand already linked
    ✓ rejects materialize from non-submitting user
    ✓ queues invite deliveries for pending members (1 ms)
    ✓ returns zero when no pending members exist
    ✓ rejects invite dispatch when registrar entry is missing
    ✓ rejects invite dispatch for non artist/band registrar entry types
    ✓ rejects invite dispatch from non-submitting user
    ✓ finalizes queued invite delivery as sent
    ✓ rejects invite delivery finalization when delivery row is missing (1 ms)
    ✓ returns already-finalized response when delivery is no longer queued
    ✓ returns already-finalized response when queued update loses race
    ✓ returns invite status summary for submitter-owned entry
    ✓ includes delivery outcome fields per member when delivery row exists (1 ms)
    ✓ maps queued delivery rows to queued deliveryStatus without sent/failed timestamps
    ✓ omits raw deliveries array from member response shape
    ✓ rejects invite status read when registrar entry is missing
    ✓ rejects invite status read for non artist/band registrar entry types
    ✓ rejects invite status read from non-submitting user (1 ms)
    ✓ lists submitter-owned artist/band registrar entries with member invite counts
    ✓ returns empty list when submitter has no artist/band registrar entries (1 ms)
    ✓ syncs claimed/existing registrar members into canonical artist-band memberships
    ✓ rejects member sync before materialization
    ✓ rejects member sync when registrar entry is missing
    ✓ rejects member sync for non artist/band registrar entry types
    ✓ rejects member sync from non-submitting user

Test Suites: 1 passed, 1 total
Tests:       145 passed, 145 total
Snapshots:   0 total
Time:        0.414 s, estimated 1 s
Ran all test suites matching /registrar.service.test.ts/i.

> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit


> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit

Complete Command:
node scripts/reliant-slice-queue.mjs complete --queue .reliant/queue/mvp-lane-c-invite-batch15.json --runtime .reliant/runtime/current-task-lane-c-batch15.json --task-id SLICE-INVITE-441A --report docs/handoff/2026-02-28_slice-411A-invite-provider-outcome-parser-pack-6.md

Complete Output:
{"completed":true,"taskId":"SLICE-INVITE-441A","updatedAt":"UNRECOVERABLE_FROM_LOGS"}
