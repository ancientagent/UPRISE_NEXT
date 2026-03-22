# @uprise/openai-computer-desktop

Dev-only OpenAI computer-use desktop harness for an isolated Linux GUI container.

This package is the desktop counterpart to `@uprise/openai-computer-use`. It is intended for local verification flows where a plain Playwright browser is not enough and the model needs a desktop surface.

## Host prerequisite

This runner depends on Docker. In this repo, the expected host setup is:

- Docker Desktop on Windows
- WSL integration enabled for this distro

That matches the repo environment policy in `docs/ENVIRONMENTS.md`.

## What it does

- builds or reuses a Docker image with `Xvfb`, `openbox`, `x11vnc`, `xdotool`, `imagemagick`, and `firefox-esr`
- starts an isolated Linux desktop container
- sends your task to the OpenAI Responses API with the `computer` tool enabled
- executes returned desktop actions with `xdotool`
- captures fresh screenshots from the virtual display and sends them back as `computer_call_output`
- optionally exposes VNC so you can watch the desktop yourself

The loop follows the OpenAI computer-use guide:

- https://developers.openai.com/api/docs/guides/tools-computer-use

## Build the image

```bash
pnpm computer:desktop:image:build
```

## Run

```bash
OPENAI_API_KEY=... pnpm computer:desktop --url http://host.docker.internal:3000 --task "Open the app and verify the desktop flow"
```

Publish VNC on port `5900` if you want to watch the container:

```bash
OPENAI_API_KEY=... pnpm computer:desktop --url http://host.docker.internal:3000 --vnc-port 5900 --task "Check the onboarding flow"
```

Useful flags:

- `--size 1440x900`
- `--max-steps 20`
- `--container-name uprise-computer-desktop`
- `--image uprise-computer-desktop:latest`
- `--artifact-dir artifacts/computer-desktop/manual-run`

## Safety notes

- The harness runs in a disposable container and deletes the container on exit.
- Keep a human in the loop for login flows, third-party posting, destructive actions, CAPTCHAs, or browser safety prompts.
- Use `host.docker.internal` when the container needs to reach services running on the Windows host.
