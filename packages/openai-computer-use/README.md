# @uprise/openai-computer-use

Dev-only OpenAI computer-use harness for driving a local browser with the Responses API and Playwright.

This package is meant for repo-local verification work such as opening the web app, navigating flows, and checking rendered UI. It is not part of the production stack.

## What it does

- launches a local Chromium browser with Playwright
- sends your task to the OpenAI Responses API with the `computer` tool enabled
- executes returned `actions[]` batches in the browser
- sends fresh screenshots back as `computer_call_output`
- stores per-step screenshots under `artifacts/computer-use/`

The implementation follows the current OpenAI computer-use guide:

- built-in computer loop: https://developers.openai.com/api/docs/guides/tools-computer-use
- the guide’s loop is request -> inspect `computer_call` -> run `actions[]` -> send `computer_call_output` -> repeat

## Install

From the repo root:

```bash
pnpm install
pnpm computer:browser:install
```

## Environment

- `OPENAI_API_KEY` required
- `OPENAI_COMPUTER_USE_MODEL` optional, default `gpt-5.4`

## Run

```bash
OPENAI_API_KEY=... pnpm computer:browser --task "Open localhost and verify the onboarding page loads"
```

Start from a known URL and keep navigation constrained:

```bash
OPENAI_API_KEY=... pnpm computer:browser --url http://127.0.0.1:3000 --allow-host 127.0.0.1 --task "Check the /plot shell and summarize any obvious UI regressions"
```

Useful flags:

- `--headed` or `--headless`
- `--viewport 1440x900`
- `--max-steps 20`
- `--artifact-dir artifacts/computer-use/manual-run`

## Safety defaults

- top-level navigation can be restricted with repeated `--allow-host`
- screenshots and page content are treated as untrusted input
- the harness instructions tell the model to stop on suspicious content, CAPTCHAs, browser safety barriers, or blocked navigations

For authenticated, destructive, or third-party posting flows, keep a human in the loop. That matches the OpenAI guide’s recommendation for risky actions.

## Current scope

This package currently targets browser automation. If you later want full desktop control, the same guide supports an isolated VM/container path; wire that as a separate dev harness instead of broadening this browser runner in-place.
