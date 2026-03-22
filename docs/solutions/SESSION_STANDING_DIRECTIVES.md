# Session Standing Directives

Use this block at the start of each execution session.

1) Scope lock first
- Before coding, restate requested scope in 5 bullets.
- Also list explicit out-of-scope items.
- Do not implement beyond that scope.

2) Canon/spec authority
- Canon + approved specs are the only source of product truth.
- If canon/spec conflict or ambiguity appears, stop and ask one precise question.
- Do not infer policy from platform norms.
- Do not derive new product behavior from canon philosophy, narrative tone, or abstract product framing alone.
- If a behavior has not been directly confirmed by founder instruction or explicitly locked in a concrete spec/decision doc, do not treat philosophical language as implementation authority.
- Founder-confirmed behavior overrides philosophical interpretation. When in doubt, escalate instead of interpreting.

3) UI action gate
- For every new user-facing action/button/CTA, cite the exact spec/canon authorization before implementation.
- If no authorization exists, do not add the action.

4) Branch/PR safety
- Never commit directly to `main`.
- Always branch from `origin/main` for new work.
- If local main diverges, create a fresh branch from `origin/main` (no destructive reset/rebase).

5) Slice discipline
- Work in small PR-safe slices.
- Prefer additive schema/API changes first.
- Reserve destructive migrations/removals for explicit deprecation slices.

6) Validation gate per slice
- Run and report exact commands/results:
  - `pnpm run docs:lint`
  - `pnpm run infra-policy-check`
  - targeted tests for touched area
  - relevant typecheck/build step
- Do not present work as done until these pass (or clearly report failures).

7) Drift prevention
- Run a quick drift scan before commit for unauthorized wording/actions (for example unapproved Join/Coming Soon/Upgrade semantics).
- Keep no platform-trope behavior unless explicitly specified.
- Guard against over-interpretation drift: do not convert anti-trope or anti-platform guidance into product-removal decisions unless the founder has directly confirmed that exact removal.

8) Docs/handoff required
- For meaningful changes, update:
  - touched specs,
  - `docs/CHANGELOG.md`,
  - a dated handoff note under `docs/handoff/`.

9) Parallel execution
- Proactively use parallel agents/lanes when tasks are parallelizable.
- Consolidate and review outputs into one coherent result before commit.
- Skip parallelization only for tightly-coupled or order-dependent edits.

10) Reasoning/model intensity
- Increase reasoning intensity for high-risk work (schema migrations, cross-module refactors, failing CI/debug loops, canon-sensitive logic).
- Use medium/low intensity for routine edits.
- Explicitly announce when changing intensity and why.

11) Tooling baseline and context compaction guard
- Assume `python3` as the canonical Python command. Do not assume `python` alias exists.
- Prefer existing local tools first (`pnpm`, `rg`, `jq`, workspace scripts) before introducing new tooling.
- If new skills/tooling are installed during session, record them in:
  - `docs/CHANGELOG.md`
  - a dated handoff note under `docs/handoff/`
- After installing Codex skills, note that a Codex restart is required for skill pickup.
- Keep tooling changes non-global and non-destructive; avoid admin/system-level install changes.
