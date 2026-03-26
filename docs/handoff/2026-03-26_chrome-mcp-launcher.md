# 2026-03-26 Chrome MCP Launcher

## What was added
- `scripts/windows/launch-chrome-mcp.ps1`
- `scripts/launch-chrome-mcp.sh`
- `scripts/launch-chrome-mcp-wsl.sh`
- `package.json` scripts:
  - `browser:mcp:launch`
  - `browser:mcp:launch:wsl`

## Purpose
- Start a dedicated Chrome instance for shared MCP debugging without depending on the user's daily browser profile.

## Launch paths
- Windows Chrome manual/debug profile:
  - `pnpm run browser:mcp:launch`
- WSL Chrome shared MCP browser (attach-only path):
  - `pnpm run browser:mcp:launch:wsl`

## Quick reference
- If you want the shared browser that MCP can actually attach to reliably, run:
  - `pnpm run browser:mcp:launch:wsl`
- Then restart Codex only when MCP config has changed, or smoke-test MCP directly if Codex is already on the correct attach config.

## Current preferred path
- Preferred shared MCP browser: WSL Chrome launched by `browser:mcp:launch:wsl`
- Expected debug endpoint: `http://127.0.0.1:9222`
- MCP config should point at that endpoint with `--browser-url=http://127.0.0.1:9222`

## Why WSL is preferred right now
- Windows Chrome can be launched with the correct `ChromeMCP` profile and `9222` flag.
- But WSL/Codex attach to the Windows-side debug endpoint is still unreliable because the Windows-to-WSL bridge resets the DevTools connection.
- WSL Chrome exposes `127.0.0.1:9222` directly inside the Codex runtime, which avoids the bridge problem entirely.

## Verified behavior
- `scripts/launch-chrome-mcp-wsl.sh` successfully launches Chrome on WSL with:
  - `--remote-debugging-address=127.0.0.1`
  - `--remote-debugging-port=9222`
  - a dedicated profile under `~/.cache/chrome-devtools-mcp/shared-profile`
- `curl http://127.0.0.1:9222/json/version` returns a valid DevTools endpoint after launch.
