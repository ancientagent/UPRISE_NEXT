# Uizard MCP Server Setup

## Summary

No public, maintained `uizard-mcp` package was found during repository/package checks.
A minimal in-repo MCP server is provided at `packages/uizard-mcp`.

## What this server does

- Exposes `uizard_config` to confirm environment wiring.
- Exposes `uizard_request` to send authenticated requests to Uizard API.
- Uses stdio transport for MCP clients.

## Environment

- `UIZARD_API_KEY` (required)
- `UIZARD_API_BASE_URL` (optional, default `https://api.uizard.io`)

## Run locally

```bash
pnpm --filter @uprise/uizard-mcp start
```

## MCP client config

```json
{
  "mcpServers": {
    "uizard": {
      "command": "pnpm",
      "args": ["--filter", "@uprise/uizard-mcp", "start"],
      "env": {
        "UIZARD_API_KEY": "<your-uizard-api-key>",
        "UIZARD_API_BASE_URL": "https://api.uizard.io"
      }
    }
  }
}
```

## Notes

- This is intentionally generic because Uizard endpoint contracts may vary by account/product tier.
- Add focused tools (`list_projects`, `create_screen`, etc.) once endpoint contracts are confirmed.
