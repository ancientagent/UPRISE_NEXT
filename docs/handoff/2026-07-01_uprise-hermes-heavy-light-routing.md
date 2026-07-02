# UPRISE Hermes Basic/Heavy Routing

Date: 2026-07-01
Branch: `chore/uprise-hermes-heavy-light-routing`
Mode: docs/tooling setup only

## Summary

UPRISE now mirrors the GISTer Hermes model-budget pattern with basic and heavy lanes:

- `uprisereviewer+` / profile `uprisereviewerplus`: GLM 5.2 heavy final review gate.
- `upriseauditor+` / profile `upriseauditorplus`: GLM 5.2 heavy final audit gate.
- `uprisereviewer-` / profile `uprisereviewerminus`: MiniMax-M3 basic non-approving review pass for now; planned Qwen 3.7 Plus replacement when the Qwen key is installed.
- `upriseauditor-` / profile `upriseauditorminus`: MiniMax-M3 basic non-approving audit pass for now; planned Qwen 3.7 Plus replacement when the Qwen key is installed.

Heavy lanes may approve or block safety, merge, branch cleanup, owner-spec promotion, provider/db risk, and closeout. Basic lanes gather, classify, sanity-check, and recommend; they must not approve final safety or closeout.

Current cost override: ordinary UPRISE audits and reviews are Codex-first. Use Codex for routine branch diffs, stale/fixed-work checks, changed-file review, test-output summaries, packet sanity, and first-pass implementation review. Use Hermes only when the packet names the specialist value: profile memory, owner-spec/docs specialization, QA planning state, second opinion, synthesis across worker outputs, feedback/profile-skill learning, or a heavy final safe/not-safe gate. Heavy Hermes is not a default scout.

## Repo Changes

- Added `scripts/agent-bridge/ask-hermes.sh` for file-backed one-shot Hermes runs with response/stderr/metadata artifacts.
- Added `justfile` shortcuts:
  - `just hermes-review-heavy <prompt>`
  - `just hermes-review-basic <prompt>`
  - `just hermes-audit-heavy <prompt>`
  - `just hermes-audit-basic <prompt>`
- Kept `hermes-review-light` and `hermes-audit-light` as backward-compatible aliases.
- Updated `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md` with the basic/heavy model-budget rule.
- Updated `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md` with the Codex-first audit rule so Hermes basic/heavy lanes are specialist escalations rather than the default review path.
- Updated `docs/CHANGELOG.md`.

## Local Machine Changes

- Created Hermes profiles:
  - `uprisereviewerplus`
  - `uprisereviewerminus`
  - `upriseauditorplus`
  - `upriseauditorminus`
- Created shell wrappers:
  - `uprisereviewer+`
  - `uprisereviewer-`
  - `upriseauditor+`
  - `upriseauditor-`
- Installed the current MiniMax key into the two minus profiles only.
- Copied existing UPRISE GLM/OpenRouter auth state into the plus profiles without printing secrets.
- Added local Codex skill: `/home/baris/.codex/skills/uprise-hermes-session-routing/SKILL.md`.

## Operating Rule

Before each new Hermes review/audit, prefer a fresh one-shot worker. In a persistent Hermes chat, `/clear` clears the screen and starts a new session by discarding conversation history; it is not a mid-task context compactor. Keep context only when the same profile is intentionally continuing one larger sequential investigation and the prompt says so. Every packet should include repo path, branch, short HEAD, lane, owner spec, changed files/artifacts, expected profile, and a requirement to verify repo state before reviewing.

Hermes prompts should tell workers to use bounded subagents or an agent swarm when independent read-only lanes can lower context, wall time, or model spend. Subagents must have one lane, named docs/files, no edits, no secrets, no provider mutation, no branch deletion, and concise output caps. Disagreements must be preserved for synthesis.

## Skill Recreation For New Agent Hosts

If a new Codex host does not already have the local skill, create it with:

```bash
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/init_skill.py" \
  uprise-hermes-session-routing \
  --path "${CODEX_HOME:-$HOME/.codex}/skills" \
  --interface display_name="UPRISE Hermes Routing" \
  --interface short_description="Route UPRISE Codex-first reviews and Hermes specialist gates." \
  --interface default_prompt="Use this skill when deciding whether UPRISE review/audit work should stay Codex-first or escalate to Hermes. Apply basic/heavy reviewer and auditor routing, prefer fresh one-shot sessions, treat /clear as a persistent-session reset, and preserve bounded read-only subagent or swarm splits."
```

Then replace the generated `SKILL.md` with the current local rules:

- Use `uprisereviewer-` and `upriseauditor-` for basic evidence gathering, packet sanity, stale/duplicate checks, and non-final second opinions.
- Use `uprisereviewer+` and `upriseauditor+` for heavy final safe/not-safe review, audit, merge, branch cleanup, owner-spec promotion, provider/db risk, and closeout gates.
- Start with Codex for ordinary audits/reviews. Escalate to Hermes only when profile memory, owner-spec/docs specialization, QA planning state, second opinion, synthesis, feedback/profile learning, or a heavy final gate is explicitly useful.
- Prefer a fresh one-shot before each new audit/review. Treat `/clear` as a persistent-session reset that discards conversation history, not as a mid-task compactor. Keep context only for an explicitly declared sequential continuation.
- Direct Hermes to use bounded subagents or an agent swarm when independent read-only lanes can save context, time, or model budget.
- Never let a basic profile approve safety, merge, branch deletion, product truth, provider/db mutation, or closeout.

## Boundaries

- No product behavior changed.
- No runtime code changed.
- No provider/database/schema/app deployment behavior changed.
- Linear remains execution state only, not product truth.
