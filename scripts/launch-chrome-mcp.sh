#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
WIN_SCRIPT=$(wslpath -w "$SCRIPT_DIR/windows/launch-chrome-mcp.ps1")

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$WIN_SCRIPT" "$@"
