# Lane C Handoff - SLICE-INVITE-261A

Slice
Task ID: SLICE-INVITE-261A
Title: Invite payload schema/version guard checks
Queue: .reliant/queue/mvp-lane-c-invite-next.json
Runtime: .reliant/runtime/current-task-lane-c-next.json

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


⏱️  Scan completed in 3ms

✅ Build succeeded: All checks passed!


> api@1.0.0 test /home/baris/UPRISE_NEXT/apps/api
> jest "registrar.service.test.ts"

PASS test/registrar.service.test.ts
  RegistrarService
    ✓ submits promoter registration for Home Scene with named production identity (2 ms)
    ✓ rejects promoter registration when requester is outside Home Scene (30 ms)
    ✓ rejects promoter registration when scene is missing (1 ms)
    ✓ rejects promoter registration when requester user is missing
    ✓ rejects promoter registration for non city-tier scene (1 ms)
    ✓ rejects promoter registration when requester has no established Home Scene
    ✓ submits project registration for Home Scene signal activation flow (1 ms)
    ✓ rejects project registration when requester is outside Home Scene
    ✓ rejects project registration when scene is missing (1 ms)
    ✓ rejects project registration when requester user is missing
    ✓ rejects project registration for non city-tier scene
    ✓ rejects project registration when requester has no established Home Scene
    ✓ submits sect-motion registration for Home Scene civic filing flow
    ✓ rejects sect-motion registration when requester is outside Home Scene
    ✓ rejects sect-motion registration when scene is missing (1 ms)
    ✓ rejects sect-motion registration when requester user is missing
    ✓ rejects sect-motion registration for non city-tier scene
    ✓ rejects sect-motion registration when requester has no established Home Scene
    ✓ lists submitter-owned promoter registrations with scene context (1 ms)
    ✓ includes promoter capability transition summary in promoter list reads
    ✓ returns empty list when submitter has no promoter registrations (1 ms)
    ✓ aggregates promoter list counts across mixed statuses
    ✓ preserves reverse-chronological ordering from promoter list reads
    ✓ normalizes missing promoter payload field to null in list reads
    ✓ trims promoter payload productionName in list reads (1 ms)
    ✓ normalizes whitespace-only productionName to null in list reads
    ✓ reads submitter-owned promoter registration detail (1 ms)
    ✓ includes promoter capability transition summary in promoter detail reads
    ✓ trims promoter payload productionName in detail reads
    ✓ normalizes whitespace-only productionName to null in detail reads
    ✓ rejects promoter detail read for non-submitting user (1 ms)
    ✓ rejects promoter detail read for non-promoter registrar entry type
    ✓ throws when promoter detail entry does not exist
    ✓ lists promoter capability audit events for submitter-owned registration
    ✓ rejects promoter capability audit read for non-submitting user
    ✓ lists submitter-owned project registrations with scene context (1 ms)
    ✓ normalizes blank projectName to null in project list reads (1 ms)
    ✓ normalizes malformed project payload to null projectName in project list reads
    ✓ reads submitter-owned project registration detail
    ✓ normalizes malformed project payload to null projectName in project detail reads
    ✓ rejects project detail read for non-submitting user
    ✓ rejects project detail read for non-project registrar entry type
    ✓ throws when project detail entry does not exist
    ✓ lists submitter-owned sect motions with scene context
    ✓ reads submitter-owned sect motion detail
    ✓ rejects sect-motion detail read for non-submitting user
    ✓ rejects sect-motion detail read for non-sect-motion registrar entry type
    ✓ throws when sect-motion detail entry does not exist
    ✓ issues registrar code for approved promoter registration with system issuer (1 ms)
    ✓ rejects registrar code issuance when issuer is not system
    ✓ rejects registrar code issuance when registrar entry is missing (1 ms)
    ✓ rejects registrar code issuance for non-promoter registrar entry types
    ✓ rejects registrar code issuance when promoter registrar entry is not approved
    ✓ verifies a redeemable registrar code for approved promoter entry (1 ms)
    ✓ rejects registrar code verification when code does not exist
    ✓ rejects registrar code verification when code is no longer redeemable (4 ms)
    ✓ redeems registrar code for authenticated user (1 ms)
    ✓ rejects registrar code redemption when code was already redeemed
    ✓ rejects registrar code redemption when code is expired (1 ms)
    ✓ throws when target scene does not exist
    ✓ requires gps-verified home-scene account
    ✓ enforces city-tier Home Scene registrar boundary
    ✓ rejects submissions outside user Home Scene (1 ms)
    ✓ creates submitted registrar entry and member invite records
    ✓ materializes submitted entry into ArtistBand + owner membership
    ✓ materialize is idempotent when artistBand already linked (1 ms)
    ✓ rejects materialize from non-submitting user
    ✓ queues invite deliveries for pending members
    ✓ returns zero when no pending members exist (1 ms)
    ✓ rejects invite dispatch when registrar entry is missing
    ✓ rejects invite dispatch for non artist/band registrar entry types
    ✓ rejects invite dispatch from non-submitting user
    ✓ finalizes queued invite delivery as sent (1 ms)
    ✓ rejects invite delivery finalization when delivery row is missing
    ✓ returns already-finalized response when delivery is no longer queued
    ✓ returns already-finalized response when queued update loses race (1 ms)
    ✓ returns invite status summary for submitter-owned entry
    ✓ includes delivery outcome fields per member when delivery row exists
    ✓ maps queued delivery rows to queued deliveryStatus without sent/failed timestamps
    ✓ omits raw deliveries array from member response shape
    ✓ rejects invite status read when registrar entry is missing
    ✓ rejects invite status read for non artist/band registrar entry types
    ✓ rejects invite status read from non-submitting user (1 ms)
    ✓ lists submitter-owned artist/band registrar entries with member invite counts
    ✓ returns empty list when submitter has no artist/band registrar entries
    ✓ syncs claimed/existing registrar members into canonical artist-band memberships
    ✓ rejects member sync before materialization
    ✓ rejects member sync when registrar entry is missing
    ✓ rejects member sync for non artist/band registrar entry types (1 ms)
    ✓ rejects member sync from non-submitting user

Test Suites: 1 passed, 1 total
Tests:       90 passed, 90 total
Snapshots:   0 total
Time:        0.382 s, estimated 1 s
Ran all test suites matching /registrar.service.test.ts/i.

> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit


> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit

Complete Command:
node scripts/reliant-slice-queue.mjs complete --queue .reliant/queue/mvp-lane-c-invite-next.json --runtime .reliant/runtime/current-task-lane-c-next.json --task-id SLICE-INVITE-261A --report docs/handoff/2026-02-27_slice-261A-invite-payload-schema-version-guard-checks.md

Complete Output:
{"completed":true,"taskId":"SLICE-INVITE-261A","updatedAt":"2026-02-27T21:39:31.702Z"}
