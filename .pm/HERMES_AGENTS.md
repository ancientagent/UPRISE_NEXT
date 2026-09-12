# UPRISE Hermes Agents

Hermes profiles are durable CLI worker identities. They do not own UPRISE
canon, priority, or project management, and they are not sandboxes.

## Identity and pairing

Name every worker `uprise-<harness>-<role>-<nn>` and pair it in
`.pm/HERMES_AGENT_REGISTRY.md` to one desktop room named
`UPRISE • <seat> • <state>`, one owner-routed task packet, and one checkout.
Unpaired agents are read-only.

Do not reuse a profile across projects. If an approved worker must move to a
new checkout or branch, export it, archive or clear location-specific memory
with manager approval, set the new absolute cwd, and repeat onboarding. The
agent returns to probation. Never carry old-path or old-project memory forward.

- Desktop path: `\\wsl$\Ubuntu-24.04\home\baris\UPRISE_NEXT`
- WSL CLI path: `/home/baris/UPRISE_NEXT`

These paths are two views of the same checkout. Verify Git inside WSL and never
copy work between them. One manager-approved writer may use the shared branch.
Normal agents do not create branches, worktrees, or delegates.

## Presets

- `upriseauditorminus`: existing limited HY3/OpenRouter audit profile.
- `uprisereviewerminus`: existing limited HY3/OpenRouter review profile.
- `uprisewebscout`: UPRISE-only web research helper; never run
  `gisterwebscout` from this checkout.
- Use Codex for implementation by default. DeepSeek/GLM Hermes implementation
  agents are exceptions requiring manager approval and a recorded reason. HY3
  is reserved for low-cost audit/review, not coding.

## Creation checklist

1. Read `AGENTS.md`, `docs/PLATFORM_START_HERE.md`, the context router, owner
   spec, `.pm/EXECUTOR_CONTRACT.md`, this file, and the task packet.
2. Record `hermes version` and `hermes update --check`. Back up first and update
   deliberately only when no gateway/project agent is live.
3. Query OpenRouter's current model catalog and record model ID, date,
   capabilities, cost rationale, and review date.
4. Create with `hermes profile create <profile> --no-skills`, explicit
   `terminal.cwd=/home/baris/UPRISE_NEXT`, and OpenRouter.
5. Inspect all skills and add only the role-required set. Omit delegation,
   worktree, browser, and computer-control capabilities unless the task packet
   explicitly authorizes them.
6. Identity/voice belongs in the profile's active `SOUL.md`. The repo-root
   `SOUL.md` is a template/reference; it is not automatically the active
   profile SOUL. Authority and safety remain in `AGENTS.md` and `.pm/`.
7. Set `memory.write_approval: true` and `skills.write_approval: true` during
   probation. Export without secrets and register the agent.
8. Verify profile/config/cwd/enabled skills. Briefly review the first three
   substantive results before approval.

When wrong, the same named profile receives the exact mistake, evidence,
correct rule, and repair request. It repairs and proposes a memory/skill patch;
the manager approves durable learning only after checking owner specs and repo
evidence.

States: `candidate`, `probation`, `approved`, `parked`, `retired`.

## Teaching skills between agents

An agent proposes a skill improvement; a manager/reviewer checks it; the
approved version is promoted into a project skill library; then a receiving
profile imports it. Record teacher, reviewer, source project, version,
evidence, approved roles, and recipients. Never allow direct edits to another
agent's profile or a shared writable live skill directory. Cross-project
promotion requires a fresh UPRISE owner-spec review.
