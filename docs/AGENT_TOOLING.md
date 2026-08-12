---
title: Agent Tooling — codebase-memory-mcp and skills
status: reference · created 2026-08-12
summary: What every agent working in this repo should know about the code graph, the invocation that actually works, and which Claude skills genuinely exist.
---

# Agent tooling in this repo

Read this before planning work here. It changes how you should search, and it
tells you which tools are real versus assumed.

## 1 · This repo is indexed in a code graph — use it instead of grepping

`codebase-memory-mcp` is **installed once, globally**, at
`/home/baris/.local/bin/codebase-memory-mcp` and shared by every one of Baris's
repos. **Do not download or install another copy.** Each repo is a separate entry
keyed by path, so indexing one cannot disturb another.

**This project's key:** `home-baris-UPRISE_NEXT`
(≈44,028 nodes / 54,764 edges — the largest of the active repos; branch
`fable/handoff`)

Other indexed projects: `home-baris-record`, `home-baris-resist-list`,
`home-baris-gist_list_reconcile_main`,
`home-baris-gist_list_server_browser_jws_isolation`.

Because this graph is large, prefer targeted `search_graph` / `trace_path` calls
over `get_architecture` with `aspects:["all"]`, which returns a very long tree.

### The invocation that works — pipe JSON on stdin

```bash
echo '{"repo_path":"/home/baris/UPRISE_NEXT"}' \
  | /home/baris/.local/bin/codebase-memory-mcp cli --progress index_repository
```

```bash
echo '{"query":"functionName","project":"home-baris-UPRISE_NEXT"}' \
  | /home/baris/.local/bin/codebase-memory-mcp cli search_graph
```

**Why stdin and not command-line flags:** passing `--path=` fails with a
misleading *"Indexing worker crashed on a file"* message. The real cause is only
visible in `~/.cache/codebase-memory-mcp/logs/.worker-*.log` and reads
`repo_path is required`. Arguments also get mangled because the Claude Code Bash
tool runs Git Bash, which rewrites POSIX-looking arguments into Windows paths.
stdin avoids both problems. Loop variables (`$r`) are stripped in transit too —
use explicit paths.

### Commands

| Command | Use it for |
|---|---|
| `search_graph` | Find a function/class by name |
| `search_code` | Full-text search across indexed code |
| `get_code_snippet` | Pull source without reading whole files |
| `trace_path` | **What calls what** — check blast radius before changing something |
| `query_graph` | Structured graph queries |
| `get_architecture` | How the codebase is organised (`aspects:["all"]`) |
| `get_graph_schema` | Available node/edge types |
| `index_status`, `check_index_coverage`, `detect_changes` | Freshness; re-index only what changed |
| `manage_adr` | **Persist architectural findings into the graph** — see §2 |
| `list_projects`, `delete_project` | Housekeeping |

It auto-excludes `node_modules`, `.git`, `dist`, `__pycache__`, `data/private`
and honours `.gitignore`, so large data dumps are skipped without configuration.

### Re-index when the code has moved on

The index is a snapshot. If the branch or HEAD has changed since it was built,
run `detect_changes` or re-index before trusting structural answers.

## 2 · Shared code-knowledge loop — required for code work

`manage_adr` stores an Architecture Decision Record **inside the graph**, so the
next code-working agent can retrieve verified architectural knowledge without
rediscovering it. This is the shared code-knowledge mechanism; it replaces the
planned Perseus dependency for architecture continuity.

For every Codex, Claude, or Hermes role that plans, changes, reviews, or hands
off code:

1. Confirm this checkout and the full project key above.
2. Run `detect_changes` or `index_repository` after a branch change or when the
   graph is stale.
3. Read `manage_adr` before making structural claims or selecting a shared
   implementation surface.
4. Verify decisive claims in current source, tests, and authority documents.
5. At closeout, update the ADR only when the work produced a verified, durable
   architectural insight. A no-learning closeout leaves it unchanged.

Completion criterion: the handoff names the project key, the graph freshness
check, whether the ADR was read, and either the durable ADR update or `no ADR
update needed`.

Read the current ADR:

```bash
echo '{"project":"home-baris-UPRISE_NEXT"}' \
  | /home/baris/.local/bin/codebase-memory-mcp cli manage_adr
```

> **Status 2026-08-12: this repo has no ADR yet.** The first agent to close
> verified architecture work here should create one.

Sections: `PURPOSE`, `STACK`, `ARCHITECTURE`, `PATTERNS`, `TRADEOFFS`,
`PHILOSOPHY`. Write with `mode:"update"`. Preserve all still-current sections
when updating; the tool replaces the stored ADR content. Build JSON with a
proper serializer rather than hand-escaping multiline text.

**The ADR does not outrank founder direction or this repo's canon.** Founder
decisions, lane assignments, public-communication posture, blockers, and plans
stay in their authority files. The ADR records durable code architecture,
patterns, tradeoffs, and philosophy — not product truth and not an activity log.

Read-only roles may retrieve the ADR; only an agent closing verified architecture
work should update it.

## 3 · Skills — each agent family has its own set

> **Claude agents** — run **`ListSkills`** for the live set. The table below was
> observed 2026-08-12 and can go stale; treat it as a hint, not truth.
>
> **Codex agents** — you have your **own** skills in `~/.codex/skills/` (44 as of
> 2026-08-12), including several built for **this project**: `uprise-lane-loader`,
> `uprise-skill-router`, `uprise-pr-reviewer`, `uprise-doc-drift-audit`,
> `uprise-branch-pr-hygiene`, `uprise-founder-clarification-capture`,
> `uprise-founder-session-capture`, `uprise-hermes-session-routing`,
> `uprise-external-agent-prompt`. **Start with `uprise-skill-router`.** The Claude
> table below does not apply to you. §1 and §2 above fully apply — Codex has
> `codebase-memory-mcp` registered in `~/.codex/config.toml` pointing at the same
> binary, plus a SessionStart hook that already tells you to prefer the graph over
> grep.
>
> **Hermes agents (DeepSeek / hy3 via OpenRouter)** — no skills of any kind. §1 and
> §2 still apply if you can call the binary.

Claude skills observed 2026-08-12:

| Skill | When it applies |
|---|---|
| `web-artifacts-builder` | Multi-component React/Tailwind artifacts and prototypes |
| `doc-coauthoring` | Structured specs, proposals, decision docs |
| `code-review` | Review a diff/branch for correctness and simplification |
| `exa:exa-agent` | Multi-step web research, list-building, enrichment |
| `mcp-builder` | Only if wrapping something as its own MCP server |
| `skill-creator` | Authoring new skills |
| `xlsx` · `pptx` · `pdf` · `docx` | When the deliverable is that file type |
| `canvas-design` · `algorithmic-art` · `brand-guidelines` | Visual output (note: `brand-guidelines` is *Anthropic's* brand, not this project's) |
| `learn` · `morning` | Not build-related |

### Skills that do NOT exist — stop planning around them

There is **no `dataviz`, `graphing`, `frontend-design`, or `artifact-design`
skill**, despite those names appearing in some older planning documents across
these projects. `web-artifacts-builder` is the only real front-end skill. Any
plan that assigns work to the missing ones needs re-pointing.

## 4 · Subagents worth dispatching

`Explore` (broad read-only search fan-out) · `Plan` (implementation strategy) ·
`feature-dev:code-architect` · `feature-dev:code-explorer` ·
`feature-dev:code-reviewer` · `code-simplifier:code-simplifier` ·
`general-purpose`.

Prefer the code graph over spawning a search agent: a `search_graph` call is far
cheaper than an agent that re-derives context from cold.

## 5 · Harmless noise you can ignore

Every WSL command prints:

```
/c/Users/baris/.bashrc: line 1: $'\377\376eval': command not found
```

That is a malformed UTF-16 file belonging to **Windows Git Bash** — note the
`/c/` path form, not `/mnt/c/`. It is not WSL, not this project, and it already
fails to execute; its only content is `uv` tab-completion. Ignore it.

**Do not "fix" it by disabling WSL's `appendWindowsPath`** — that is a
system-wide `/etc/wsl.conf` change requiring a WSL restart (which would kill
running dev servers), and it is not the cause of anything.
