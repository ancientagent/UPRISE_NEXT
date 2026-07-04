# UPRISE Codex Skill Snapshots

Status: active local-skill distribution snapshot
Owner: context-steward

This folder stores repo-controlled snapshots of UPRISE-specific local Codex skills. The runtime copies live under `/home/baris/.codex/skills/`, but repo-visible snapshots prevent local skill behavior from drifting silently across agents or machines.

## Install / Refresh

From repo root:

```bash
for d in docs/solutions/codex-skills/uprise-*; do
  name="$(basename "$d")"
  mkdir -p "/home/baris/.codex/skills/$name"
  cp "$d/SKILL.md" "/home/baris/.codex/skills/$name/SKILL.md"
  if [ -d "$d/agents" ]; then
    mkdir -p "/home/baris/.codex/skills/$name/agents"
    cp "$d/agents/openai.yaml" "/home/baris/.codex/skills/$name/agents/openai.yaml"
  fi
done
```

Validate after copying:

```bash
for d in /home/baris/.codex/skills/uprise-*; do
  python3 /home/baris/.codex/skills/.system/skill-creator/scripts/quick_validate.py "$d"
done
```

## Snapshots

- `uprise-skill-router/SKILL.md`
- `uprise-lane-loader/SKILL.md`
- `uprise-founder-clarification-capture/SKILL.md`
- `uprise-founder-session-capture/SKILL.md`
- `uprise-branch-pr-hygiene/SKILL.md`
- `uprise-hermes-session-routing/SKILL.md`

The broad/noisy routing snapshots also include `agents/openai.yaml` with
`policy.allow_implicit_invocation: false`, so they stay explicitly available
without auto-triggering by default.

Update this folder whenever a local UPRISE skill change is meant to become durable team behavior.
