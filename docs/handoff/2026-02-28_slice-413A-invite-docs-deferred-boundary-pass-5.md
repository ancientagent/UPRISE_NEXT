# Lane C Handoff - SLICE-INVITE-413A

Slice
Task ID: SLICE-INVITE-413A
Title: Invite docs deferred-boundary pass 5
Queue: .reliant/queue/mvp-lane-c-invite-batch14.json
Runtime: .reliant/runtime/current-task-lane-c-batch14.json
Scope lock: invite reliability/read-model only; no endpoints/schemas/CTAs.

Verify Command:
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck

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


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit


> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit

Complete Command:
node scripts/reliant-slice-queue.mjs complete --queue .reliant/queue/mvp-lane-c-invite-batch14.json --runtime .reliant/runtime/current-task-lane-c-batch14.json --task-id SLICE-INVITE-413A --report docs/handoff/2026-02-28_slice-413A-invite-docs-deferred-boundary-pass-5.md

Complete Output:
{"completed":true,"taskId":"SLICE-INVITE-413A","updatedAt":"2026-02-28T05:36:28.539Z"}
