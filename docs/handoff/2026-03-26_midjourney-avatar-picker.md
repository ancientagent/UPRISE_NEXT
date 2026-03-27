# 2026-03-26 Midjourney Avatar Picker

## Summary
- Added a browser-native Midjourney avatar picker as an unpacked Chrome extension under `tools/midjourney-avatar-picker/`.
- The extension runs directly on the Midjourney Create page, overlays `Pick avatars` buttons on result cards, opens a crop-selection modal, and exports selected avatar crops plus a JSON manifest.
- Added a WSL shared-browser launcher that preloads the extension: `pnpm run browser:mcp:launch:wsl:avatars`. The launcher now prefers Chromium because Google Chrome ignores the extension-restriction flags needed for reliable autoload.

## Files
- `tools/midjourney-avatar-picker/manifest.json`
- `tools/midjourney-avatar-picker/content-script.js`
- `tools/midjourney-avatar-picker/background.js`
- `tools/midjourney-avatar-picker/README.md`
- `scripts/launch-chrome-mcp-wsl-avatar-picker.sh`
- `package.json`

## Behavior
- Click the floating `Avatar Picker` button to open the picker on the first visible Midjourney sheet and reveal per-card `Pick avatars` buttons.
- Use `Magic Wand` to auto-tighten each cell around non-background avatar art when a sheet is uneven.
- Use `Pick avatars` on any result card if you want to open a specific sheet directly.
- Adjust rows/columns and crop spacing if the default split is off.
- Click desired tiles.
- Export selected PNGs plus one manifest into `midjourney-avatar-picker/` downloads.

## Verification
- `node --check tools/midjourney-avatar-picker/content-script.js`
- `node --check tools/midjourney-avatar-picker/background.js`
- Live MCP validation against `https://www.midjourney.com/imagine`:
  - floating launcher rendered
  - result-card `Pick avatars` buttons rendered
  - clicking `Pick avatars` opened the modal on a real Midjourney result card
  - `Magic Wand` rendered in the modal
  - grid selection worked on live page
  - `Magic Wand` fetches CDN sheets without credentialed CORS requests

## Notes
- Grid controls now commit on `blur` / `Enter` and select their existing value on focus, so typing a replacement value no longer appends digits into the old number and immediately clamps to the max.
- The picker now surfaces explicit auto-fit feedback (`Running auto-fit...`, `Auto-fit applied.`, or `No tighter fit detected for this sheet.`) so `Magic Wand` no longer feels dead on sheets where the change is subtle.
- Grid controls now normalize to valid minimums so the visible inputs cannot drift to `0` while the internal crop engine clamps to `1`.
- Live export was validated through the extension download path in code, but the shared browser session used for MCP testing was script-injected rather than fully reloaded with the unpacked extension. The intended daily-use path is the preloaded launcher command, not manual injection.
