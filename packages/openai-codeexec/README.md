# @uprise/openai-codeexec

Dev-only OpenAI code-execution harness for browser workflows.

This package is the third harness path alongside:
- `@uprise/openai-computer-use` for the built-in screenshot/action loop
- `@uprise/openai-computer-desktop` for isolated desktop automation

This runner is for cases where the model should write and run short scripts against a live Playwright page instead of only returning click/type/scroll actions.

## What it does

- launches Chromium with Playwright
- keeps a live `browser`, `context`, and `page` available across steps
- sends the task plus the latest screenshot to the OpenAI Responses API
- expects the model to return short JavaScript snippets in a strict JSON envelope
- executes the snippet locally, captures logs/result/error, then sends the next screenshot back

This matches the "code-execution harness" shape described in the OpenAI computer-use guide, adapted for a repo-local Playwright runtime.

## Install

From the repo root:

```bash
pnpm install
pnpm computer:codeexec:install
```

## Environment

- `OPENAI_API_KEY` required
- `OPENAI_COMPUTER_USE_MODEL` optional, default `gpt-5.4`

## Run

```bash
OPENAI_API_KEY=... pnpm computer:codeexec --url http://127.0.0.1:3000 --allow-host 127.0.0.1 --task "Open the page and summarize the hero UI"
```

Useful flags:

- `--headed` or `--headless`
- `--viewport 1440x900`
- `--max-steps 12`
- `--artifact-dir artifacts/codeexec/manual-run`

## Runtime helpers exposed to model code

- `page`, `context`, `browser`, `playwright`
- `helpers.log(...args)`
- `helpers.sleep(ms)`
- `helpers.snapshot(label?)`

## Safety notes

- This runner executes model-generated JavaScript locally. Keep it dev-only.
- Use repeated `--allow-host` flags to constrain top-level navigation.
- Keep a human in the loop for destructive actions, account changes, third-party posting, or anything involving secrets.
