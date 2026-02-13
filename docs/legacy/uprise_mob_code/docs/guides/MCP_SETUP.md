# MCP (Model Context Protocol) Setup for Supabase

This guide explains how to connect Cursor's Codex to Supabase via the Model Context Protocol (MCP).

## What is MCP?

The Model Context Protocol allows AI assistants to call external services. With the Supabase MCP server, Codex can:
- Inspect database schemas and tables
- Run read-only SQL queries
- Review migrations and project metadata
- Help reason about Supabase configuration alongside the codebase

## Prerequisites
- Node.js 18+
- pnpm or npm (examples below use pnpm)
- Supabase Personal Access Token with access to the target project

## 1. Generate a Supabase Personal Access Token
1. Open the [Supabase Dashboard](https://supabase.com/dashboard/account/tokens)
2. Click **Generate new token** (e.g., "Cursor MCP Server")
3. Copy the token somewhere secure (it will not be shown again)

## 2. Install the Supabase MCP server (local clone)
The Supabase team publishes the MCP server as open source. To keep this repo lean we do **not** vendor the source or node_modules. Clone it locally beside the project:

```bash
cd /path/to/uprise_mob
git clone https://github.com/supabase-community/model-context-protocol supabase-mcp
cd supabase-mcp
pnpm install
pnpm build
```

> The directory can live anywhere on your machine. Update paths below if you place it somewhere else. Do **not** commit the clone to git; `.gitignore` already excludes `supabase-mcp/`.

## 3. Create a local `.mcp.json`
Create `.mcp.json` at the repo root (this file is ignored by git). Replace the token and project reference with your own values.

```json
{
  "mcpServers": {
    "supabase": {
      "command": "node",
      "args": [
        "./supabase-mcp/packages/mcp-server-supabase/dist/transports/stdio.js",
        "--read-only",
        "--project-ref=mjqsdpuemmsmtjyazfhl"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "<your-personal-access-token>"
      }
    }
  }
}
```

### Alternative: use the published NPM package
If you prefer not to clone locally, you can invoke the published package with `npx`:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=mjqsdpuemmsmtjyazfhl"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "<your-personal-access-token>"
      }
    }
  }
}
```

Keep the `.mcp.json` file untracked. If you need to share configuration, create a redacted copy (e.g., `.mcp.example.json`).

## 4. Configure Cursor
1. Open Cursor Settings (`Ctrl+,`)
2. Find **Model Context Protocol (MCP)**
3. Point Cursor to the repository's `.mcp.json`, or paste the configuration into the global MCP settings
4. Restart Cursor so it reloads the MCP server

## 5. Validate the connection
Ask Codex to run a quick check once Cursor restarts:
- "List tables from the Supabase project"
- "Show project info via MCP"

If the response succeeds, the server is connected. Errors usually indicate an invalid token or project reference.

## Available MCP tools
(When running in read-only mode)
- `list_tables` – list tables in the connected database
- `get_table_info` – inspect schema details
- `execute_sql` – run SELECT statements
- `list_migrations` – show migration history
- `get_project_info` / `list_projects` – surface Supabase metadata

## Security notes
- Keep the MCP token out of version control ( `.mcp.json` is git-ignored )
- Use the `--read-only` flag unless you explicitly need write access
- Rotate tokens if they are exposed

## Troubleshooting
| Issue | Fix |
| --- | --- |
| MCP server fails to start | Ensure Node ≥ 18 and the build step succeeded |
| Cursor cannot connect | Restart Cursor and confirm the `.mcp.json` path |
| Auth errors | Verify the personal access token and project ref |
| Windows npx errors | Use the `cmd /c npx ...` form as shown above |

## Clean-up checklist
- `.mcp.json` (local secrets) – **untracked**
- `supabase-mcp/` – local clone only (ignored by git)
- `docs/guides/MCP_SETUP.md` – this guide

Once MCP is configured you can safely involve Codex in Supabase reads, schema exploration, and migration audits without bloating the repository.
