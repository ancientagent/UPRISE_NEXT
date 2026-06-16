# Midjourney Avatar Picker

Unpacked Chrome extension that lets you pick individual avatar tiles from Midjourney result sheets directly on the Create page.

## Load it
1. Open `chrome://extensions`
2. Enable `Developer mode`
3. Click `Load unpacked`
4. Select `tools/midjourney-avatar-picker`

## Use it
1. Open Midjourney Create
2. Click `Avatar Picker`
3. Click `Pick avatars` on a result card
4. Adjust grid controls if needed
5. Click the tiles you want
6. Click `Export Selected`
7. The source card will be marked `Picked` after export

## Output
- Individual PNG downloads for each selected tile
- One `manifest.json` download with source URL, crop bounds, and selected cells
