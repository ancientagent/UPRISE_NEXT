set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

# Show available repo command shortcuts.
default:
    @just --list

# Deprecated for UPRISE review/audit gates.
# Use Codex subagents instead:
# - light: GPT-5.3 Codex Spark
# - normal: GPT-5.5 high
# - heavy/final: GPT-5.5 extra-high
# These Hermes recipes are kept only as manual fallback affordances.
hermes-watchdog prompt_file:
    scripts/agent-bridge/ask-hermes.sh --agent "uprisewatchdog" "{{prompt_file}}"

hermes-review-heavy prompt:
    @echo "Deprecated: use Codex GPT-5.5 extra-high for heavy/final UPRISE review. Manual Hermes fallback: scripts/agent-bridge/ask-hermes.sh --agent uprisereviewer+ '{{prompt}}'" >&2
    @exit 2

# Deprecated manual fallback.
hermes-review-basic prompt:
    @echo "Deprecated: use Codex GPT-5.3 Codex Spark for basic UPRISE review. Manual Hermes fallback: scripts/agent-bridge/ask-hermes.sh --agent uprisereviewer- '{{prompt}}'" >&2
    @exit 2

# Deprecated manual fallback alias.
hermes-review-light prompt:
    @just hermes-review-basic "{{prompt}}"

# Deprecated manual fallback.
hermes-audit-heavy prompt:
    @echo "Deprecated: use Codex GPT-5.5 extra-high for heavy/final UPRISE audit. Manual Hermes fallback: scripts/agent-bridge/ask-hermes.sh --agent upriseauditor+ '{{prompt}}'" >&2
    @exit 2

# Deprecated manual fallback.
hermes-audit-basic prompt:
    @echo "Deprecated: use Codex GPT-5.3 Codex Spark for basic UPRISE audit. Manual Hermes fallback: scripts/agent-bridge/ask-hermes.sh --agent upriseauditor- '{{prompt}}'" >&2
    @exit 2

# Deprecated manual fallback alias.
hermes-audit-light prompt:
    @just hermes-audit-basic "{{prompt}}"
