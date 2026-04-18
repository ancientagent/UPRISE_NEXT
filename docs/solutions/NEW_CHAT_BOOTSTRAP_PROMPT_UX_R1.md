# New Chat Bootstrap Prompt (UX R1)

Status: Historical bootstrap prompt

Historical note:
- This bootstrap prompt targets an older UX/tooling phase.
- Do not use it as the default entrypoint for current UPRISE surface/design work.
- Current assistants should instead read:
  - `AGENTS.md`
  - `.deepagent-desktop/rules/uprise_next_rules.md`
  - `docs/solutions/EXTERNAL_ASSISTANT_REPO_BRIEF_R1.md`
  - `docs/solutions/REPO_AUTHORITY_MAP_R1.md`
  - task-relevant current founder locks and specs


Paste this into a brand-new chat/session.

---

Read `AGENTS.md` required docs first (in listed order), then continue.

Working directory: `/home/baris/UPRISE_NEXT`

Primary objective:
- Continue MVP mobile-first UX/UI mockup and implementation planning with no feature drift.
- Default design platform: Figma via MCP (OAuth session required and must be validated first).

Required context files:
1. `AGENTS.md`
2. The exact active founder locks or `docs/specs/` files for the assigned UX task
3. The latest relevant dated handoff only if current work depends on prior slice context

Optional historical appendix only when needed:
- `docs/handoff/2026-03-05_context-reset-handoff-ux-uizard.md`
- `docs/solutions/MVP_UIZARD_PROMPT_PACK_R2_STRICT.md`
- `docs/solutions/MVP_FIGMA_EXECUTION_PACK_R1.md`
- `docs/solutions/MVP_FIGMA_EXECUTION_PACK_R2_STRICT.md`

Hard constraints:
- No speculative redesign.
- No placeholder CTAs.
- Implement/document MVP-now only; keep future features as deferred notes.
- Do not override locked UX decisions in handoff without explicit founder confirmation.

What to do first:
1. Report current locked UX decisions from the active founder locks/specs actually loaded for the task.
2. Report any contradictions across those active context files.
3. Validate Figma MCP access (list file/project + fetch one frame).
4. If no contradictions and MCP is valid, produce:
   - Figma page-by-page execution plan for the active task
   - strict gates and stop conditions from the active founder locks/specs
   - lane prompts/tasks (A-E)
   - one checklist mapping each screen/frame to locked MVP decisions

Fallback:
- If Figma MCP fails, stop and return exact auth/tooling blocker.
- Do not silently switch platforms without explicit approval.

If contradictions exist:
- stop and list exact file/line conflicts, then ask for one-by-one confirmation before changing docs.

Output format:
- concise, implementation-focused, with file references.

---