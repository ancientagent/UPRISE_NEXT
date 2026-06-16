# 2026-03-22 — OpenAI Code-Execution Browser Harness

## Scope
- Add a repo-local, dev-only code-execution harness for browser workflows.
- Keep it separate from the existing built-in computer-use harnesses.
- Favor persistent Playwright objects plus short model-written JavaScript snippets over screenshot-only click loops.

## Why this harness exists
- The OpenAI computer-use guide describes a third path: a code-execution harness.
- That path is a better fit for:
  - DOM inspection
  - loops and conditional logic
  - richer browser-library use
  - longer workflows where programmatic interaction is more reliable than coordinate clicking

## Files added
- `packages/openai-codeexec/package.json`
- `packages/openai-codeexec/tsconfig.json`
- `packages/openai-codeexec/src/index.ts`
- `packages/openai-codeexec/README.md`

## Files updated
- `package.json`
- `docs/CHANGELOG.md`

## Root commands
- Install Chromium:
  - `pnpm computer:codeexec:install`
- Run the harness:
  - `OPENAI_API_KEY=... pnpm computer:codeexec --url http://127.0.0.1:3000 --allow-host 127.0.0.1 --task "Open the page and summarize the hero UI"`
- Typecheck:
  - `pnpm computer:codeexec:typecheck`

## Runtime shape
- Launches Playwright Chromium locally.
- Keeps `browser`, `context`, and `page` alive across steps.
- Sends the latest screenshot plus execution context to the Responses API.
- Expects a strict JSON reply:
  - `status=run` with short JavaScript to execute
  - `status=done` with summary
  - `status=ask` when blocked on human input
- Executes the returned JavaScript locally with access to:
  - `page`
  - `context`
  - `browser`
  - `playwright`
  - `helpers.log(...)`
  - `helpers.sleep(ms)`
  - `helpers.snapshot(label?)`

## Notes
- This harness still requires `OPENAI_API_KEY` because the model loop runs through the Responses API.
- It is dev-only and should not be treated as production automation.
- The existing browser harness is still useful for validating the built-in computer loop.
- The existing desktop harness is still useful for isolated desktop-level testing once container reachability is cleaned up.
