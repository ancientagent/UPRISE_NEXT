# SLICE-WEBADMIN-253A — Registrar contract inventory tags for deferred admin surfaces

## Summary
- Extended registrar web contract inventory metadata to explicitly tag deferred admin-lifecycle promoter read surfaces as action-gated placeholders.
- Preserved all existing contract `status` values (`gap`/`implemented`) and did not flip implementation state.

## Files Changed
- `apps/web/src/lib/registrar/contractInventory.ts`
- `apps/web/__tests__/registrar-contract-inventory.test.ts`

## Verify Command (exact)
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- registrar-contract-inventory.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```

## Verify Output (exact)
```text
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


⏱️  Scan completed in 12ms

✅ Build succeeded: All checks passed!


> web@1.0.0 test /home/baris/UPRISE_NEXT/apps/web
> jest "registrar-contract-inventory.test.ts"

PASS __tests__/registrar-contract-inventory.test.ts
  registrar contract inventory
    ✓ keeps endpoint ids unique (1 ms)
    ✓ keeps method + pathTemplate pairs unique
    ✓ ensures implemented contracts map to a concrete web consumer path (1 ms)
    ✓ enforces metadata coherence for implemented and gap contracts (2 ms)
    ✓ captures expected unresolved endpoint gaps (1 ms)
    ✓ tracks currently implemented registrar read API surfaces in inventory metadata
    ✓ keeps registrar read scaffolds explicitly marked as web-surface gaps (1 ms)
    ✓ tracks deferred admin-lifecycle read surfaces as action-gated placeholders
    ✓ tracks field-level gaps against known endpoint ids
  registrar artist endpoint helpers
    ✓ builds concrete registrar artist endpoint paths
    ✓ rejects empty entry ids for entry-scoped endpoints (7 ms)
  registrar project endpoint helpers
    ✓ builds concrete registrar project endpoint paths (4 ms)
    ✓ rejects empty entry id for project detail endpoint (1 ms)
  registrar promoter endpoint helpers
    ✓ builds concrete registrar promoter endpoint paths
    ✓ rejects empty entry id for promoter entry-scoped endpoints (1 ms)
  registrar sect-motion endpoint helpers
    ✓ builds concrete registrar sect-motion endpoint paths
    ✓ rejects empty entry id for sect-motion detail endpoint (1 ms)

Test Suites: 1 passed, 1 total
Tests:       17 passed, 17 total
Snapshots:   0 total
Time:        0.743 s, estimated 1 s
Ran all test suites matching /registrar-contract-inventory.test.ts/i.

> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```
