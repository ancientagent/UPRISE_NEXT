# Lane C Handoff - SLICE-INVITE-319A

Slice
Task ID: SLICE-INVITE-319A
Title: Queued-to-sent invariant enforcement pack 2
Queue: .reliant/queue/mvp-lane-c-invite-batch11.json
Runtime: .reliant/runtime/current-task-lane-c-batch11.json

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
    ✓ submits promoter registration for Home Scene with named production identity (3 ms)
    ✓ rejects promoter registration when requester is outside Home Scene (33 ms)
    ✓ rejects promoter registration when scene is missing
    ✓ rejects promoter registration when requester user is missing
    ✓ rejects promoter registration for non city-tier scene
    ✓ rejects promoter registration when requester has no established Home Scene (1 ms)
    ✓ submits project registration for Home Scene signal activation flow
    ✓ rejects project registration when requester is outside Home Scene (1 ms)
    ✓ rejects project registration when scene is missing
    ✓ rejects project registration when requester user is missing
    ✓ rejects project registration for non city-tier scene
    ✓ rejects project registration when requester has no established Home Scene
    ✓ submits sect-motion registration for Home Scene civic filing flow (1 ms)
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
    ✓ rejects promoter detail read for non-submitting user (1 ms)
    ✓ rejects promoter detail read for non-promoter registrar entry type
    ✓ throws when promoter detail entry does not exist
    ✓ lists promoter capability audit events for submitter-owned registration
    ✓ rejects promoter capability audit read for non-submitting user (1 ms)
    ✓ lists submitter-owned project registrations with scene context
    ✓ normalizes blank projectName to null in project list reads
    ✓ normalizes malformed project payload to null projectName in project list reads (1 ms)
    ✓ reads submitter-owned project registration detail
    ✓ normalizes malformed project payload to null projectName in project detail reads
    ✓ rejects project detail read for non-submitting user
    ✓ rejects project detail read for non-project registrar entry type
    ✓ throws when project detail entry does not exist (1 ms)
    ✓ lists submitter-owned sect motions with scene context
    ✓ reads submitter-owned sect motion detail
    ✓ rejects sect-motion detail read for non-submitting user
    ✓ rejects sect-motion detail read for non-sect-motion registrar entry type (1 ms)
    ✓ throws when sect-motion detail entry does not exist
    ✓ issues registrar code for approved promoter registration with system issuer (1 ms)
    ✓ issues promoter capability code through system-only seam for approved promoter entry (1 ms)
    ✓ emits deterministic audit ordering for approve-then-issue lifecycle helper
    ✓ rejects approve-then-issue lifecycle helper when actor context is not system (6 ms)
    ✓ rejects approve-then-issue lifecycle helper when decision entry is missing
    ✓ rejects approve-then-issue lifecycle helper when issuance phase sees invalid approved-state precondition
    ✓ applies promoter approval transition from submitted to approved
    ✓ applies promoter approval transition from submitted to rejected
    ✓ rejects promoter approval transition when registrar entry is not submitted (1 ms)
    ✓ rejects promoter approval transition when actor context is not system
    ✓ rejects promoter approval transition matrix from approved to approved (1 ms)
    ✓ rejects promoter approval transition matrix from rejected to approved
    ✓ rejects promoter approval transition matrix from materialized to approved
    ✓ rejects promoter approval transition matrix from approved to rejected
    ✓ rejects promoter approval transition matrix from rejected to rejected (1 ms)
    ✓ rejects promoter approval transition matrix from materialized to rejected
    ✓ normalizes approval/rejection reason payload to bounded stable metadata shape
    ✓ rejects promoter approval transition for non-promoter registrar entry types
    ✓ rejects promoter approval transition when registrar entry is missing
    ✓ revokes active promoter capability grant with append-only audit log emission (1 ms)
    ✓ revokes active promoter capability grant when registrar entry status is rejected
    ✓ rejects promoter capability revocation for non-promoter registrar entry types
    ✓ rejects promoter capability revocation when no active grant exists (1 ms)
    ✓ rejects promoter capability revocation when active grant-link entry differs from target entry
    ✓ rejects promoter capability revocation when actor context is not system
    ✓ rejects registrar code issuance when issuer is not system (1 ms)
    ✓ rejects registrar code issuance when registrar entry is missing
    ✓ rejects registrar code issuance for non-promoter registrar entry types
    ✓ rejects registrar code issuance when promoter registrar entry is not approved
    ✓ rejects registrar code issuance replay when an active issued code already exists
    ✓ verifies a redeemable registrar code for approved promoter entry (1 ms)
    ✓ rejects registrar code verification when code does not exist
    ✓ rejects registrar code verification when code is no longer redeemable
    ✓ redeems registrar code for authenticated user (1 ms)
    ✓ rejects registrar code redemption when code was already redeemed
    ✓ rejects registrar code redemption when code is expired
    ✓ throws when target scene does not exist
    ✓ requires gps-verified home-scene account
    ✓ enforces city-tier Home Scene registrar boundary
    ✓ rejects submissions outside user Home Scene
    ✓ creates submitted registrar entry and member invite records (1 ms)
    ✓ materializes submitted entry into ArtistBand + owner membership (1 ms)
    ✓ materialize is idempotent when artistBand already linked
    ✓ rejects materialize from non-submitting user
    ✓ queues invite deliveries for pending members (1 ms)
    ✓ returns zero when no pending members exist
    ✓ rejects invite dispatch when registrar entry is missing
    ✓ rejects invite dispatch for non artist/band registrar entry types
    ✓ rejects invite dispatch from non-submitting user
    ✓ finalizes queued invite delivery as sent (1 ms)
    ✓ rejects invite delivery finalization when delivery row is missing
    ✓ returns already-finalized response when delivery is no longer queued
    ✓ returns already-finalized response when queued update loses race (1 ms)
    ✓ returns invite status summary for submitter-owned entry
    ✓ includes delivery outcome fields per member when delivery row exists (2 ms)
    ✓ maps queued delivery rows to queued deliveryStatus without sent/failed timestamps
    ✓ omits raw deliveries array from member response shape (1 ms)
    ✓ rejects invite status read when registrar entry is missing
    ✓ rejects invite status read for non artist/band registrar entry types
    ✓ rejects invite status read from non-submitting user
    ✓ lists submitter-owned artist/band registrar entries with member invite counts
    ✓ returns empty list when submitter has no artist/band registrar entries
    ✓ syncs claimed/existing registrar members into canonical artist-band memberships
    ✓ rejects member sync before materialization (1 ms)
    ✓ rejects member sync when registrar entry is missing
    ✓ rejects member sync for non artist/band registrar entry types
    ✓ rejects member sync from non-submitting user

Test Suites: 1 passed, 1 total
Tests:       115 passed, 115 total
Snapshots:   0 total
Time:        0.427 s, estimated 1 s
Ran all test suites matching /registrar.service.test.ts/i.

> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit


> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit

Complete Command:
node scripts/reliant-slice-queue.mjs complete --queue .reliant/queue/mvp-lane-c-invite-batch11.json --runtime .reliant/runtime/current-task-lane-c-batch11.json --task-id SLICE-INVITE-319A --report docs/handoff/2026-02-27_slice-319A-queued-to-sent-invariant-enforcement-pack-2.md

Complete Output:
{"completed":true,"taskId":"SLICE-INVITE-319A","updatedAt":"2026-02-28T02:28:47.286Z"}
