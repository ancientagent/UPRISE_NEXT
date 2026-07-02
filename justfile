set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

# Show available repo command shortcuts.
default:
    @just --list

# Final GLM safety review gate.
hermes-review-heavy prompt:
    scripts/agent-bridge/ask-hermes.sh --agent "uprisereviewer+" "{{prompt}}"

# Basic non-approving reviewer pass.
hermes-review-basic prompt:
    scripts/agent-bridge/ask-hermes.sh --agent "uprisereviewer-" "{{prompt}}"

# Backward-compatible alias for older prompts.
hermes-review-light prompt:
    @just hermes-review-basic "{{prompt}}"

# Final GLM drift/source-boundary audit gate.
hermes-audit-heavy prompt:
    scripts/agent-bridge/ask-hermes.sh --agent "upriseauditor+" "{{prompt}}"

# Basic non-approving auditor pass.
hermes-audit-basic prompt:
    scripts/agent-bridge/ask-hermes.sh --agent "upriseauditor-" "{{prompt}}"

# Backward-compatible alias for older prompts.
hermes-audit-light prompt:
    @just hermes-audit-basic "{{prompt}}"
