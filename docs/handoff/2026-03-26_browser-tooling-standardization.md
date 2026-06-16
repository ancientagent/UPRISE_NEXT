# 2026-03-26 Browser Tooling Standardization

## Why this was needed
- Browser work was repeatedly confused by mixing:
  - Windows/native Chrome,
  - WSL-launched Chrome/Chromium,
  - Playwright harness sessions,
  - DevTools MCP targets.
- Agents were treating these contexts as if they shared cookies, focus, and login state.
- DevTools MCP was also intermittently unhealthy, which made ad hoc retries waste time.

## Standard browser roles
- `google-chrome`
  - default for visible/shared browsing and user-led inspection
- `chromium` / `chromium-browser` with explicit `--user-data-dir`
  - default for isolated manual clean sessions when separation is needed
- Playwright harness
  - default for deterministic local app QA and route verification
- DevTools MCP
  - debug-only path with one explicit owner per session
  - must pass a smoke test before use

## Required assumptions
- Do not assume shared session state between:
  - Windows Chrome
  - WSL-launched Chrome/Chromium
  - Playwright
  - DevTools MCP targets
- Logged-in external-site visual review should use the user's normal browser plus screenshots unless a dedicated isolated session is intentionally prepared.

## DevTools MCP rule
- DevTools MCP is not the default browser path.
- Before relying on MCP in a session:
  1. assign one owner
  2. run a smoke test (`list_pages`, then `new_page`)
- If the smoke test fails:
  - stop using MCP for that session
  - do not keep retrying as a normal workflow
  - fall back to:
    - normal Chrome + screenshots for shared visual review
    - Playwright for deterministic app QA

## Opera note
- Opera is not part of the default workflow.
- Only consider it as a manual fallback if it is already installed and explicitly chosen.
- Do not add it as a dependency or standing setup requirement.
