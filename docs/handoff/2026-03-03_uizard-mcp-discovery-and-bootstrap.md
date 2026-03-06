# 2026-03-03 — Uizard MCP Discovery and Bootstrap

## Scope
- Determine whether a maintained public `uizard-mcp` server exists.
- If not, create a minimal in-repo MCP server scaffold.

## Commands + Outputs

### 1) npm search
```bash
npm search --long uizard mcp | head -n 40
```
Output:
```text
@modelcontextprotocol/sdk@modelcontextprotocol/sdk
Model Context Protocol implementation for TypeScriptModel Context Protocol implementation for TypeScript
Version 1.27.1 published 2026-02-24 by pcarleton
...
@langchain/mcp-adapters@langchain/mcp-adapters
...
@storybook/addon-mcp@storybook/addon-mcp
...
npm error A complete log of this run can be found in: /home/baris/.npm/_logs/2026-03-03T20_40_37_281Z-debug-0.log
```

### 2) GitHub repository search API
```bash
curl -s "https://api.github.com/search/repositories?q=uizard+mcp" | jq '.total_count, (.items[0:10] | map(.full_name))'
```
Output:
```json
0
[]
```

### 3) npm registry search API
```bash
curl -s "https://registry.npmjs.org/-/v1/search?text=uizard%20mcp&size=20" | jq '.total, (.objects | map(.package.name))'
```
Output:
```json
36392
[
  "@modelcontextprotocol/sdk",
  "@upstash/context7-mcp",
  "mcp-remote",
  "mcp-proxy",
  "@langchain/mcp-adapters",
  "@storybook/addon-mcp",
  "nx-mcp",
  "puppeteer",
  "@storybook/mcp",
  "@hexsleeves/tailscale-mcp-server",
  "@uizard/nx-fast-s3-cache",
  "mcp-framework",
  "n8n-mcp",
  "@playwright/mcp",
  "n8n-nodes-mcp",
  "@redocly/mcp-typescript-sdk",
  "chrome-devtools-mcp",
  "@modelcontextprotocol/ext-apps",
  "firebase-tools",
  "mcp-use"
]
```

### 4) Install deps
```bash
pnpm install
```
Output (key lines):
```text
Scope: all 9 workspace projects
...
Packages: +46
...
Done in 4.9s
```

### 5) Typecheck new package
```bash
pnpm --filter @uprise/uizard-mcp typecheck
```
Output:
```text
> @uprise/uizard-mcp@0.1.0 typecheck /home/baris/UPRISE_NEXT/packages/uizard-mcp
> tsc --noEmit
```

### 6) Docs lint
```bash
pnpm run docs:lint
```
Output:
```text
[docs:lint] ✅ docs:lint passed
[canon:lint] OK: Checked 10 canon markdown files
```

## Files Added
- `packages/uizard-mcp/package.json`
- `packages/uizard-mcp/tsconfig.json`
- `packages/uizard-mcp/src/index.ts`
- `packages/uizard-mcp/README.md`
- `docs/solutions/UIZARD_MCP_SERVER_SETUP.md`

## Files Updated
- `docs/solutions/README.md`
- `docs/CHANGELOG.md`
- `pnpm-lock.yaml`

## Result
- No maintained public `uizard-mcp` package was identified by the above checks.
- Added a minimal in-repo MCP server with:
  - `uizard_config` (config visibility)
  - `uizard_request` (authenticated generic Uizard HTTP bridge)
