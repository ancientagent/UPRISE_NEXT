# 2026-03-22 — OpenAI Computer Use Browser Harness

## Scope
- Add a repo-local, dev-only browser automation harness based on OpenAI computer use plus Playwright.
- Keep the implementation outside the product runtime and aligned with the current OpenAI computer-use loop.

## Official guidance used
- OpenAI computer-use guide:
  - built-in loop: request -> inspect `computer_call` -> execute `actions[]` -> send `computer_call_output` -> repeat
  - browser/Playwright path for isolated automation
  - safety guidance for prompt injection, sensitive actions, CAPTCHAs, and human-in-the-loop controls

Source:
- https://developers.openai.com/api/docs/guides/tools-computer-use

## Files added
- `packages/openai-computer-use/package.json`
- `packages/openai-computer-use/tsconfig.json`
- `packages/openai-computer-use/src/index.ts`
- `packages/openai-computer-use/README.md`

## Files updated
- `package.json`
- `docs/CHANGELOG.md`
- `pnpm-lock.yaml`

## Commands run

### 1) Install workspace deps
```bash
pnpm install
```

Key output:
```text
Scope: all 10 workspace projects
Packages: +6 -5
Done in 4.3s
```

### 2) Install Chromium for the harness
```bash
pnpm computer:browser:install
```

Key output:
```text
> pnpm --filter @uprise/openai-computer-use install:chromium
Chrome for Testing ... downloaded to /home/baris/.cache/ms-playwright/chromium-1208
Chrome Headless Shell ... downloaded to /home/baris/.cache/ms-playwright/chromium_headless_shell-1208
```

### 3) Typecheck the new package
```bash
pnpm computer:browser:typecheck
```

Expected output:
```text
> pnpm --filter @uprise/openai-computer-use typecheck
> tsc --noEmit
```

## Root commands
- Install browser binary:
  - `pnpm computer:browser:install`
- Run the harness:
  - `OPENAI_API_KEY=... pnpm computer:browser --url http://127.0.0.1:3000 --allow-host 127.0.0.1 --task "Check the page and summarize UI regressions"`
- Typecheck only:
  - `pnpm computer:browser:typecheck`

## Notes
- The package is browser-only for now. It does not attempt OS-wide desktop control.
- Top-level navigation can be constrained with repeated `--allow-host`.
- Screenshots are written under `artifacts/computer-use/`.
- For login flows, destructive actions, CAPTCHAs, browser safety warnings, or anything that would represent the user to a third party, keep a human in the loop.
