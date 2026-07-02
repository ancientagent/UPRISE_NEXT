# UPRISE Hermes Basic/Heavy Routing

Date: 2026-07-01
Branch: `chore/uprise-hermes-heavy-light-routing`
Mode: docs/tooling setup only

## Summary

UPRISE now preserves Hermes only as watchdog/manual specialist fallback, while review/audit routing and final gates are Codex-first:

- `gpt-5.3-codex-spark`: basic/small review or audit, packet sanity, stale/fixed-work checks, changed-file skims, and test-output summaries.
- `gpt-5.5` with `reasoning_effort=xhigh`: heavy/final review or audit, provider/db/security risk, branch absorption, owner-spec promotion risk, closeout gates, and layered/drift-prone cleanup.

The Hermes lanes remain, but only in these roles:

- `uprisewatchdog`: low-cost heartbeat/wake-up checks with `hermes-cli` only. It is not a review/audit gate.
- `uprisereviewer+` / profile `uprisereviewerplus`: heavy manual fallback review opinion only when PM names Hermes-specific value.
- `upriseauditor+` / profile `upriseauditorplus`: heavy manual fallback audit opinion only when PM names Hermes-specific value.
- `uprisereviewer-` / profile `uprisereviewerminus`: basic non-approving review evidence pass only when PM names Hermes-specific value.
- `upriseauditor-` / profile `upriseauditorminus`: basic non-approving audit evidence pass only when PM names Hermes-specific value.

Hermes reviewer/auditor lanes gather, classify, sanity-check, and recommend. They do not independently approve safety, merge, branch cleanup, owner-spec promotion, provider/db risk, or closeout. Those gates route to Codex by task risk.

Current cost override: ordinary UPRISE audits and reviews are Codex-first. Use Hermes only when the packet names the specialist value: profile memory, owner-spec/docs specialization, QA planning state, second opinion, synthesis across worker outputs, or feedback/profile-skill learning. Heavy Hermes is not a gate by default.

## Repo Changes

- Added `scripts/agent-bridge/ask-hermes.sh` for file-backed one-shot Hermes runs with response/stderr/metadata artifacts.
- Added `justfile` shortcuts:
  - `just hermes-watchdog <prompt-file>` as the only normal Hermes recipe.
  - Deprecated review/audit shortcuts, now fail-closed as Hermes fallback pointers:
  - `just hermes-review-heavy <prompt>`
  - `just hermes-review-basic <prompt>`
  - `just hermes-audit-heavy <prompt>`
  - `just hermes-audit-basic <prompt>`
- Kept `hermes-review-light` and `hermes-audit-light` as backward-compatible aliases.
- Updated `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md` with the Hermes watchdog/manual-fallback rule.
- Updated `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md` with the Codex-first audit rule so Hermes basic/heavy lanes are specialist escalations rather than the default review path.
- Updated `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md` with the Codex model split: `gpt-5.3-codex-spark` for basic/small and `gpt-5.5` with `reasoning_effort=xhigh` for heavy/final.
- Updated `docs/CHANGELOG.md`.

## Local Machine Changes

- Created Hermes profiles:
  - `uprisewatchdog`
  - `uprisereviewerplus`
  - `uprisereviewerminus`
  - `upriseauditorplus`
  - `upriseauditorminus`
- Created shell wrappers:
  - `uprisewatchdog`
  - `uprisereviewer+`
  - `uprisereviewer-`
  - `upriseauditor+`
  - `upriseauditor-`
- Installed the current MiniMax key into the watchdog and two minus profiles at setup time.
- Copied existing UPRISE OpenRouter auth state into the plus profiles at setup time without printing secrets.
- Current routing does not depend on these Hermes profile model choices because reviewer/auditor gates are Codex-first.
- Added local Codex skill: `/home/baris/.codex/skills/uprise-hermes-session-routing/SKILL.md`.

## Operating Rule

Before each new Hermes fallback review/audit, prefer a fresh one-shot worker. In a persistent Hermes chat, `/clear` clears the screen and starts a new session by discarding conversation history; it is not a mid-task context compactor. Keep context only when the same profile is intentionally continuing one larger sequential investigation and the prompt says so. Every packet should include repo path, branch, short HEAD, lane, owner spec, changed files/artifacts, expected profile, and a requirement to verify repo state before reviewing.

Hermes prompts should tell workers to use bounded subagents or an agent swarm when independent read-only lanes can lower context, wall time, or model spend. Subagents must have one lane, named docs/files, no edits, no secrets, no provider mutation, no branch deletion, and concise output caps. Disagreements must be preserved for synthesis.

## Skill Recreation For New Agent Hosts

If a new Codex host does not already have the local skill, create it with:

```bash
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/init_skill.py" \
  uprise-hermes-session-routing \
  --path "${CODEX_HOME:-$HOME/.codex}/skills" \
  --interface display_name="UPRISE Hermes Routing" \
  --interface short_description="Route UPRISE Codex-first reviews and Hermes fallback/watchdog use." \
  --interface default_prompt="Use this skill when deciding UPRISE review/audit routing. Apply Codex-first model routing, keep Hermes reviewer/auditor profiles advisory unless explicitly approved as manual fallback, preserve uprisewatchdog for heartbeat checks, prefer fresh one-shot sessions, treat /clear as a persistent-session reset, and preserve bounded read-only subagent or swarm splits."
```

Then replace the generated `SKILL.md` with the current local rules:

- Start with Codex for ordinary audits/reviews and final gates: `gpt-5.3-codex-spark` for basic/small and `gpt-5.5` with `reasoning_effort=xhigh` for heavy/final.
- Use `uprisewatchdog` for heartbeat/wake-up checks only. It should not review code, approve safety, mutate Linear, edit repo files, or inspect secrets.
- Use `uprisereviewer-` and `upriseauditor-` only for non-final Hermes fallback evidence gathering, packet sanity, stale/duplicate checks, and second opinions when PM names Hermes-specific value.
- Use `uprisereviewer+` and `upriseauditor+` only for heavy manual fallback opinions when PM names Hermes-specific value. Codex remains the approving/blocking gate.
- Prefer a fresh one-shot before each new audit/review. Treat `/clear` as a persistent-session reset that discards conversation history, not as a mid-task compactor. Keep context only for an explicitly declared sequential continuation.
- Direct Hermes to use bounded subagents or an agent swarm when independent read-only lanes can save context, time, or model budget.
- Never let a Hermes profile approve safety, merge, branch deletion, product truth, provider/db mutation, or closeout by itself.

## Boundaries

- No product behavior changed.
- No runtime code changed.
- No provider/database/schema/app deployment behavior changed.
- Linear remains execution state only, not product truth.
