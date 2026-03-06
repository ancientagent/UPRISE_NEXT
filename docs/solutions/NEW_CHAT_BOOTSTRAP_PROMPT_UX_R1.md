# New Chat Bootstrap Prompt (UX R1)

Paste this into a brand-new chat/session.

---

Read `AGENTS.md` required docs first (in listed order), then continue.

Working directory: `/home/baris/UPRISE_NEXT`

Primary objective:
- Continue MVP mobile-first UX/UI mockup and implementation planning with no feature drift.
- Default design platform: Figma via MCP (OAuth session required and must be validated first).

Required context files:
1. `docs/handoff/2026-03-05_context-reset-handoff-ux-uizard.md`
2. `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`
3. `docs/solutions/MVP_PROFILE_EXPANDED_MOCKUP_R1.md`
4. `docs/solutions/MVP_PLAYER_PROFILE_INTERACTION_R1.md`
5. `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
6. `docs/solutions/MVP_UIZARD_PROMPT_PACK_R2_STRICT.md`
7. `docs/solutions/MVP_FIGMA_EXECUTION_PACK_R1.md`
8. `docs/solutions/MVP_FIGMA_EXECUTION_PACK_R2_STRICT.md`

Hard constraints:
- No speculative redesign.
- No placeholder CTAs.
- Implement/document MVP-now only; keep future features as deferred notes.
- Do not override locked UX decisions in handoff without explicit founder confirmation.

What to do first:
1. Report current locked UX decisions from the handoff file.
2. Report any contradictions across the required context files.
3. Validate Figma MCP access (list file/project + fetch one frame).
4. If no contradictions and MCP is valid, produce:
   - Figma page-by-page execution plan (matching `MVP_FIGMA_EXECUTION_PACK_R1.md`)
   - strict gates and stop conditions from `MVP_FIGMA_EXECUTION_PACK_R2_STRICT.md`
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
