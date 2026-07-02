set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

# Show available repo command shortcuts.
default:
    @just --list

# Register/audit UPRISE branch, worktree, and PR workspace state.
workspace-audit:
    node scripts/workspace-registry.mjs audit

workspace-register +args:
    node scripts/workspace-registry.mjs add {{args}}

# Deprecated for UPRISE review/audit gates.
# Use Codex subagents instead:
# - basic/small: gpt-5.3-codex-spark
# - heavy/final: gpt-5.5 with reasoning_effort=xhigh

# The watchdog is not a review/audit gate; it remains the only normal Hermes route.
hermes-watchdog prompt_file:
    scripts/agent-bridge/ask-hermes.sh --agent "uprisewatchdog" "{{prompt_file}}"

# These review/audit recipes are kept only as fail-closed manual fallback affordances.
hermes-review-heavy prompt:
    @echo "Deprecated: use Codex gpt-5.5 with reasoning_effort=xhigh for heavy/final UPRISE review. Manual Hermes fallback: scripts/agent-bridge/ask-hermes.sh --agent uprisereviewer+ '{{prompt}}'" >&2
    @exit 2

# Deprecated manual fallback.
hermes-review-basic prompt:
    @echo "Deprecated: use Codex gpt-5.3-codex-spark for basic UPRISE review. Manual Hermes fallback: scripts/agent-bridge/ask-hermes.sh --agent uprisereviewer- '{{prompt}}'" >&2
    @exit 2

# Deprecated manual fallback alias.
hermes-review-light prompt:
    @just hermes-review-basic "{{prompt}}"

# Deprecated manual fallback.
hermes-audit-heavy prompt:
    @echo "Deprecated: use Codex gpt-5.5 with reasoning_effort=xhigh for heavy/final UPRISE audit. Manual Hermes fallback: scripts/agent-bridge/ask-hermes.sh --agent upriseauditor+ '{{prompt}}'" >&2
    @exit 2

# Deprecated manual fallback.
hermes-audit-basic prompt:
    @echo "Deprecated: use Codex gpt-5.3-codex-spark for basic UPRISE audit. Manual Hermes fallback: scripts/agent-bridge/ask-hermes.sh --agent upriseauditor- '{{prompt}}'" >&2
    @exit 2

# Deprecated manual fallback alias.
hermes-audit-light prompt:
    @just hermes-audit-basic "{{prompt}}"
