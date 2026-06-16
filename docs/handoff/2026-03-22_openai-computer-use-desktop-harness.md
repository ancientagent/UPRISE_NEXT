# 2026-03-22 — OpenAI Computer Use Desktop Harness

## Scope
- Add a repo-local, dev-only desktop computer-use harness using an isolated Docker GUI container.
- Keep it separate from the browser-only Playwright harness so desktop-specific dependencies stay isolated.

## Official guidance used
- OpenAI computer-use guide:
  - use the built-in computer loop
  - operate in an isolated environment
  - keep a human in the loop for risky actions
  - treat on-screen content as untrusted

Source:
- https://developers.openai.com/api/docs/guides/tools-computer-use

## Files added
- `packages/openai-computer-desktop/package.json`
- `packages/openai-computer-desktop/tsconfig.json`
- `packages/openai-computer-desktop/src/index.ts`
- `packages/openai-computer-desktop/README.md`
- `packages/openai-computer-desktop/docker/Dockerfile`
- `packages/openai-computer-desktop/docker/start-desktop.sh`

## Files updated
- `package.json`
- `docs/CHANGELOG.md`
- `pnpm-lock.yaml`

## Commands run

### 1) Refresh workspace metadata
```bash
pnpm install
```

Key output:
```text
Scope: all 11 workspace projects
Already up to date
Done in 3.2s
```

### 2) Help smoke test
```bash
pnpm computer:desktop --help
```

Key output:
```text
Usage:
  pnpm computer:desktop --task "Open the app and verify the desktop flow"
...
```

### 3) Typecheck
```bash
pnpm computer:desktop:typecheck
```

Output:
```text
> pnpm --filter @uprise/openai-computer-desktop typecheck
> tsc --noEmit
```

### 4) Docs lint
```bash
pnpm run docs:lint
```

Output:
```text
[docs:lint] ✅ docs:lint passed
[canon:lint] OK: Checked 10 canon markdown files
```

## Host prerequisite
- Docker is required for the desktop harness.
- In this repo, the intended host setup is Docker Desktop with WSL integration enabled, matching `docs/ENVIRONMENTS.md`.

## Session limitation
- `docker` was not available in this WSL session, so the image build and container boot were not executed here.
- The harness code, CLI wiring, typecheck, and docs validation were completed successfully.

## Root commands
- Build the desktop image:
  - `pnpm computer:desktop:image:build`
- Run the desktop harness:
  - `OPENAI_API_KEY=... pnpm computer:desktop --url http://host.docker.internal:3000 --task "Check the desktop flow"`
- Run with VNC published:
  - `OPENAI_API_KEY=... pnpm computer:desktop --url http://host.docker.internal:3000 --vnc-port 5900 --task "Check the desktop flow"`

## Notes
- The container is disposable and is removed on exit.
- Firefox is opened inside the container; screenshots are written under `artifacts/computer-desktop/`.
- `host.docker.internal` is the expected target when the container needs to reach services running on the Windows host.
