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

10) Model assignment / reasoning policy
- Current AI/tool routing is owned by `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`.
- Basic/small review or audit:
  - model: `gpt-5.3-codex-spark`
  - use for docs drift, stale branch checks, changed-file sanity, PM packet checks, low-risk UI/test/docs PRs, and test-output summaries
- Heavy/final review or audit:
  - model: `gpt-5.5`
  - reasoning_effort: `xhigh`
  - use for high-impact merges, branch deletion, schema/provider/database/security/canon/owner-spec changes, broad cleanup audits, closeout gates, and any pass that can approve/block action
- Hermes reviewer/auditor profiles are manual fallback only; `uprisewatchdog` is heartbeat-only.
- Implementation/planning model choices should use the fastest available model that still fits the role, but do not override the current AI stack doc for review/audit gates.

11) Tooling baseline and context compaction guard
- Assume `python3` as the canonical Python command. Do not assume `python` alias exists.
- Prefer existing local tools first (`pnpm`, `rg`, `jq`, workspace scripts) before introducing new tooling.
- If new skills/tooling are installed during session, record them in:
  - `docs/CHANGELOG.md`
  - a dated handoff note under `docs/handoff/`
- After installing Codex skills, note that a Codex restart is required for skill pickup.
- Keep tooling changes non-global and non-destructive; avoid admin/system-level install changes.

12) QA gate discipline
- QA runs only against committed local `HEAD` or pushed branch state.
- Every QA finding must include:
  - commit/branch state
  - route/surface
  - signed-in or signed-out state
  - fixture/setup used
  - exact repro steps
  - clean-session/storage status
- Classify each finding before acting:
  - `bug`
  - `stale`
  - `environment`
  - `fixture/data`
  - `product decision`

13) Context refresh discipline
- Use refresh triggers, not a blind token-count rule.
- Immediate refresh required when:
  - `HEAD` changes materially,
  - another agent lands overlapping work,
  - a new checkpoint commit becomes the source of truth,
  - docs/runtime/handoffs conflict,
  - stale findings are cited as current.
- Soft refresh required after roughly 8-10 substantial turns on the same slice:
  - restate current source of truth,
  - re-check committed `HEAD`,
  - re-scope remaining work.
- Hard refresh required after roughly 15 substantial turns on the same slice, or sooner if drift signals appear.
- Refresh means:
  - re-anchor to current authority order,
  - confirm current branch state,
  - discard stale handoff/chat assumptions that conflict with current evidence.

14) Browser tooling standard
- Treat browser contexts as separate by default:
  - Windows/native Chrome = user-visible browsing and shared visual reference
  - Playwright harness = deterministic app QA only
  - DevTools MCP = single-owner debugging tool only when a smoke test passes
- Default browser roles:
  - `google-chrome` = normal visible browsing
  - `chromium` / `chromium-browser` with an explicit `--user-data-dir` = isolated manual session when separation is needed
- Do not assume browser login/cookie state is shared across:
  - Windows Chrome,
  - WSL-launched Chrome/Chromium,
  - Playwright,
  - DevTools MCP targets.
- DevTools MCP is opt-in, not default:
  - assign one explicit owner at a time,
  - smoke-test it first (`list_pages`, then `new_page`),
  - if the smoke test fails, treat MCP as unavailable for that session and fall back to normal Chrome + screenshots + Playwright.
- Use Playwright for local app QA, not for "look at my already-open tab" collaboration.
- Use screenshots from the user's normal browser for shared visual review on external/logged-in sites.
- Opera is not part of the default workflow. Only consider it as a manual fallback if it is already installed and explicitly chosen; do not add it as a setup dependency.
- Current preferred shared MCP browser command:
  - from WSL repo root, run `pnpm run browser:mcp:launch:wsl`
  - this launches the persistent shared WSL Chrome profile used for MCP attachment on `127.0.0.1:9222`
