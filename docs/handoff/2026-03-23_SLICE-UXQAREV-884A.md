# SLICE-UXQAREV-884A

Date: 2026-03-23
Lane: E - QA/Closeout
Task: Batch27 fresh current-HEAD QA sweep

## Scope
- Ran a fresh live QA sweep on current `HEAD` only.
- Checked the scoped web surfaces only:
  - `/discover`
  - `/artist-bands/[id]`
  - `/community/[id]`
  - `/registrar`
  - `/plot`
  - `/users/[id]`
  - `/onboarding`
- Discarded stale prior findings and recorded only currently reproducible behavior.

## Harness Method
- Live app target: `http://127.0.0.1:3000`
- Clean browser session: Playwright CLI wrapper via `bash ~/.codex/skills/playwright/scripts/playwright_cli.sh`
- Session flow used:
  1. open `/onboarding`
  2. fill Home Scene as `Austin` / `Texas` / `Rock`
  3. continue to review
  4. enter `/plot`
  5. inspect live `/plot` controls and route state
  6. verify direct route terminal states for `/discover`, `/registrar`, `/community/qa-missing`, `/users/qa-missing`, and `/artist-bands/qa-missing`
- Key live artifacts captured during the sweep:
  - `.playwright-cli/page-2026-03-24T05-04-44-780Z.yml`
  - `.playwright-cli/page-2026-03-24T05-05-29-004Z.yml`
  - `.playwright-cli/page-2026-03-24T05-05-46-065Z.yml`
  - `.playwright-cli/page-2026-03-24T05-05-58-251Z.yml`
  - `.playwright-cli/page-2026-03-24T05-06-12-407Z.yml`

## Current Reproducible Defects
- Surface: `/plot`
- Source of truth:
  - `docs/solutions/MVP_UX_MASTER_LOCK_R1.md` section `4.5 Bottom nav + engagement wheel`
  - `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md` section `5 Bottom Nav + Engagement Wheel`
  - `docs/solutions/MVP_WEB_UX_IMPLEMENTATION_BRIEF_R1.md` sections `4.2 Plot reachability` and `7 Acceptance Criteria`
- Issue:
  - The live `/plot` route renders no bottom navigation at all. The required `Home`, center UPRISE trigger, and `Discover` controls are absent from the current HEAD browser DOM.
- Why it is wrong:
  - The active founder/canon lock requires a persistent bottom nav on the Plot surface.
  - Without the `Discover` control, the intended in-app continuity from Plot into Discover is broken on the current live web route.
- Fix needed:
  - Restore the locked bottom nav on `/plot` so the live page exposes `Home`, center UPRISE trigger, and `Discover` again.
  - Re-verify the Plot-to-Discover continuity path in-browser after the nav is restored.
- Severity:
  - High

## Non-Defect Flows Verified
- `/onboarding`
  - Web onboarding remained completable in the live app for `Austin` / `Texas` / `Rock`.
  - Review state rendered correctly and `Enter The Plot` reached `/plot`.
- `/discover`
  - A clean direct visit without carried community context terminated into the explicit `Context unset` / `Community context required` state, not an infinite loader.
- `/registrar`
  - Live signed-out state terminated cleanly with registrar action entry plus explicit sign-in-required history messaging.
- `/community/[id]`
  - Direct visit to `/community/qa-missing` terminated cleanly into the current signed-out state instead of hanging.
- `/users/[id]`
  - Direct visit to `/users/qa-missing` terminated cleanly into the current signed-out state instead of hanging.
- `/artist-bands/[id]`
  - Direct visit to `/artist-bands/qa-missing` terminated cleanly into the current signed-out state with exit actions back to Discover and Plot.

## Exact Harness Commands
```bash
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh open http://127.0.0.1:3000/onboarding
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh -s=default fill e25 "Austin"
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh -s=default fill e28 "Texas"
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh -s=default fill e31 "Rock"
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh -s=default click e34
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh -s=default click e57
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh -s=default eval "() => Array.from(document.querySelectorAll('a,button')).map(el => ({text: (el.textContent||'').trim(), aria: el.getAttribute('aria-label')||'', role: el.getAttribute('role')||'', href: el.getAttribute('href')||''})).filter(x => x.text || x.aria)"
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh -s=default goto http://127.0.0.1:3000/discover
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh -s=default goto http://127.0.0.1:3000/registrar
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh -s=default goto http://127.0.0.1:3000/community/qa-missing
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh -s=default goto http://127.0.0.1:3000/users/qa-missing
bash ~/.codex/skills/playwright/scripts/playwright_cli.sh -s=default goto http://127.0.0.1:3000/artist-bands/qa-missing
```

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web typecheck && pnpm --filter api typecheck
```

## Exact Verify Output
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


⏱️  Scan completed in 15ms

✅ Build succeeded: All checks passed!


> web@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/web
> tsc --noEmit


> api@1.0.0 typecheck /home/baris/UPRISE_NEXT/apps/api
> tsc --noEmit
```
