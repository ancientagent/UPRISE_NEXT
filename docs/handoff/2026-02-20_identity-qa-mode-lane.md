# Identity QA Mode Lane (2026-02-20)

**Author:** Codex (GPT-5)

## What was added
- Root command:
  - `pnpm run qa:identity`
- API command:
  - `pnpm --filter api test:identity`

## Purpose
Provides a single repeatable QA lane for canonical identity/registrar slices:
- docs/canon lint
- web-tier infra policy check
- focused identity/registrar/auth/user tests
- API typecheck

## Commands
```bash
pnpm run qa:identity
pnpm --filter api test:identity
```
