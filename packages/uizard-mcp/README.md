# @uprise/uizard-mcp

Minimal MCP server for connecting agent tools to Uizard APIs over stdio.

## Environment

- `UIZARD_API_KEY` (required)
- `UIZARD_API_BASE_URL` (optional, default: `https://api.uizard.io`)

## Tools

- `uizard_config` - returns config/status for server wiring.
- `uizard_request` - generic authenticated HTTP request bridge.

## Run

```bash
pnpm --filter @uprise/uizard-mcp start
```

## MCP config snippet

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
