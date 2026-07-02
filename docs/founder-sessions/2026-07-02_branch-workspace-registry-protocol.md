# Branch Workspace Registry Protocol Founder Session

Status: raw founder-session capture
Date: 2026-07-02
Source: current chat/session
Related lane(s): context-steward, agent/tooling, branch/worktree hygiene
Owner spec candidates: `docs/specs/system/documentation-framework.md`, `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`, `AGENTS.md`

## Raw Founder Notes

> as of now, we need to implement a worktree/ branch workspace etc management system so that anytime there is one created it MUST get added to a document along with whats on it, what agents were assigned to it etc.    we need to make sure this doesnt happen again how can we assure that

## Clarifications

- Branches, worktrees, PR workspaces, preserved prototype refs, and external-agent workspaces must be recorded in a repo-visible document when created or assigned.
- Type: settled workflow rule
- Likely owner: `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`, `docs/specs/system/documentation-framework.md`

- A registry entry must include what is on the branch/workspace and which agents are assigned to it.
- Type: settled workflow rule
- Likely owner: `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`

- The goal is preventing forgotten/off-book branches and avoiding another cleanup where agents have to rediscover what work exists where.
- Type: settled workflow rule
- Likely owner: `AGENTS.md`, `docs/AGENT_STRATEGY_AND_HANDOFF.md`, `docs/operations/ACTIVE_PM.md`

## Feature Sets

- Branch / Workspace Registry
- Raw basis: "anytime there is one created it MUST get added to a document"
- Included behavior:
  - active and preserved branch tracking
  - worktree path tracking
  - PR/Linear link tracking
  - owner and assigned agent tracking
  - concise "what is on it" summary
  - status and closeout plan
  - audit command to catch unregistered local branches, worktrees, and open PR heads
- Excluded / not activated:
  - provider or database state tracking
  - replacing Linear or owner specs
  - automatic branch deletion
- Status: implementation-ready

## Working Interpretation

- This is an operations/documentation control rule, not product doctrine.
- The durable system should be lightweight enough that agents actually use it.
- The registry must be machine-checkable for local branches, worktrees, and open PR heads.
- Remote-only historical branches should be inventory/report targets first, not automatic deletion targets.

## Promotion Targets

- Owner spec: `docs/specs/system/documentation-framework.md`
- Operations doc: `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`
- Primary agent entry: `AGENTS.md`
- Agent workflow: `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- Active execution snapshot: `docs/operations/ACTIVE_PM.md`
- Tooling: `scripts/workspace-registry.mjs`, `package.json`, `justfile`

## Do Not Drift

- Do not create off-book branches/worktrees.
- Do not rely on chat memory or one agent's summary to remember what a branch contains.
- Do not delete or merge branches just because they look stale; classify and register first.
- Do not treat the registry as product truth; it is execution state.
