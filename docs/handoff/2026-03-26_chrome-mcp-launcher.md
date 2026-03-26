# 2026-03-26 Chrome MCP Launcher

## What was added
- `scripts/windows/launch-chrome-mcp.ps1`
- `scripts/launch-chrome-mcp.sh`
- `package.json` script: `browser:mcp:launch`

## Purpose
- Start a dedicated Windows Chrome instance for shared MCP debugging with:
  - remote debugging on port `9222`
  - dedicated profile `ChromeMCP`
  - no dependency on the user's daily browser profile

## Launch paths
- From WSL / repo root:
  - `pnpm run browser:mcp:launch`
- Direct PowerShell launch:
  - `powershell.exe -NoProfile -ExecutionPolicy Bypass -File <repo>\scripts\windows\launch-chrome-mcp.ps1`

## Current limitation
- The launcher correctly starts the Windows Chrome MCP profile and exposes `9222` on the Windows side.
- WSL/Codex attachment to that Windows debug endpoint is still a separate bridge issue and is not solved by the launcher alone.
- So this utility solves the browser-launch side of the workflow, not the WSL-to-Windows DevTools transport issue by itself.
