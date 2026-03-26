# 2026-03-26 Midjourney Avatar Picker

## Summary
- Added a browser-native Midjourney avatar picker as an unpacked Chrome extension under `tools/midjourney-avatar-picker/`.
- The extension runs directly on the Midjourney Create page, overlays `Pick avatars` buttons on result cards, opens a crop-selection modal, and exports selected avatar crops plus a JSON manifest.
- Added a WSL shared-browser launcher that preloads the extension: `pnpm run browser:mcp:launch:wsl:avatars`.

## Files
- `tools/midjourney-avatar-picker/manifest.json`
- `tools/midjourney-avatar-picker/content-script.js`
- `tools/midjourney-avatar-picker/background.js`
- `tools/midjourney-avatar-picker/README.md`
- `scripts/launch-chrome-mcp-wsl-avatar-picker.sh`
- `package.json`

## Behavior
- Toggle picker mode with the floating `Avatar Picker` button.
- Use `Magic Wand` to auto-tighten each cell around non-background avatar art when a sheet is uneven.
- Click `Pick avatars` on a Midjourney result card.
- Adjust rows/columns and crop spacing if the default split is off.
- Click desired tiles.
- Export selected PNGs plus one manifest into `midjourney-avatar-picker/` downloads.

## Verification
- `node --check tools/midjourney-avatar-picker/content-script.js`
- `node --check tools/midjourney-avatar-picker/background.js`
- Live MCP validation against `https://www.midjourney.com/imagine`:
  - floating launcher rendered
  - result-card `Pick avatars` buttons rendered
  - modal opened on a real Midjourney result card
  - grid selection worked on live page

## Notes
- Live export was validated through the extension download path in code, but the shared browser session used for MCP testing was script-injected rather than fully reloaded with the unpacked extension. The intended daily-use path is the preloaded launcher command, not manual injection.
