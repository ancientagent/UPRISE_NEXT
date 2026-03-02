# 2026-03-02 — Onboarding nearest-active fallback canon/spec lock

## Scope
Docs-only canon/spec codification for onboarding behavior:
- Parent music community is selection-only during onboarding.
- Taste tags are deferred until post-onboarding (inside Home Scene).
- If selected city-tier scene is inactive/unavailable, user is routed to nearest active city-tier scene for selected parent community.
- Pioneer intent is preserved and pioneer notification messaging is required.

## Files Updated
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/canon/Master Narrative Canon.md`
- `docs/CHANGELOG.md`

## Commands Run
```bash
pnpm run docs:lint
pnpm run canon:lint
```

## Command Output (exact)
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

> uprise-next@1.0.0 canon:lint /home/baris/UPRISE_NEXT
> node scripts/canon-lint.mjs

[canon:lint] OK: Checked 10 canon markdown files
```
