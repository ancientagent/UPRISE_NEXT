# 2026-04-01 WSL Chromium WebGL

## What changed
- Updated `scripts/launch-chrome-mcp-wsl.sh`
- Updated `scripts/launch-chrome-mcp-wsl-avatar-picker.sh`
- Added WSL Chromium WebGL flags:
  - `--ignore-gpu-blocklist`
  - `--enable-webgl`
  - `--enable-unsafe-swiftshader`
  - `--use-gl=angle`
  - `--use-angle=gl`

## Why
- The shared WSL Chromium browser was running on Mesa llvmpipe and Chromium blocklisted WebGL.
- `chrome://gpu` showed `WebGL: Unavailable` and `GPU compositing: disabled`.
- WSL still cannot provide true hardware acceleration in this path, but trusted shared-browser work can use software WebGL.

## Expected behavior
- After relaunching the shared browser with the updated scripts, WebGL should be available in Chromium-backed app surfaces.
- This is software WebGL via SwiftShader / ANGLE fallback, not true hardware GPU acceleration.

## Verification note
- Headless Chromium in this environment can create a WebGL context when launched with the new flags.
- The existing shared browser must be relaunched for the new flags to take effect.
