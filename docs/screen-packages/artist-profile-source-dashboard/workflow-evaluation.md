# Artist Profile / Source Dashboard Workflow Evaluation

## Score

**8/10**

This is a strong workflow with fixable gaps. It is much safer than jumping directly from a screen idea to UI/code because it starts from one shared instruction packet, separates dev-owned and design-owned work, reviews the spec package before implementation, and reserves final hardening for tests, accessibility, edge states, and regression locks.

It is not quite production-grade as written because role ownership, gate order, branch/worktree handling, authority promotion, and risk scaling need to be explicit. Without those patches, agents could still duplicate work, let design outputs imply new contracts, implement over stale runtime paths, or apply the full workflow to small fixes that should use the lean path.

## What Works

- One shared instruction packet gives the Dev Spec Agent and Design Spec Agent the same source of context, which reduces divergence between implementation planning and UX/design planning.
- Separating Dev Spec from Design Spec is the right division for this package because Artist Profile / Source Dashboard crosses runtime, state, role, and visual hierarchy boundaries.
- Requiring both spec agents to read the same packet helps keep source/listener/admin boundaries, deferred features, and forbidden actions consistent.
- Dev Spec tracing docs/runtime/tests/contracts before implementation directly addresses stale context risk.
- Design Spec owning UX/design for design-owned parts avoids premature UI/code work while still giving Product Design a clear lane.
- Reviewing Dev Spec and Design Spec together before implementation is better than reviewing only the dev spec because the screen can fail through UX-contract mismatch even when code scope looks correct.
- Sending failed review findings back to the responsible spec agent creates a practical correction loop without forcing one agent to own all fixes.
- Splitting Dev Implementation Agent and Design Implementation Agent can work if file ownership and responsibility boundaries are explicit.
- Joint review after implementation/design integration catches mismatches that neither lane can see alone.
- Final Hardening Agent is valuable for this package because missing tests, accessibility, empty/error states, copy consistency, and regression locks are likely to fall between dev and design lanes.
- Final closeout after validation, docs/changelog/handoff requirements, and PR metadata matches the repo's process model for meaningful behavior-changing work.

## Holes / Risks

- Missing role ownership: the workflow implies a manager but does not name one accountable owner for the package, gate status, file ownership, branch/worktree registration, and conflict resolution.
- Missing authority owner: it does not explicitly state that durable product truth must live in `docs/specs/**`, with package docs serving as execution artifacts only.
- Unclear gate order: implementation should not begin until the shared packet is accepted, both specs are reviewed as a package, and blockers are resolved.
- Unclear review authority: the reviewer needs pass/fail authority over spec-package readiness, but advisory visual preferences should not block unless they affect product boundaries, accessibility, or implementation feasibility.
- Duplicated work risk: Dev Spec and Design Spec can both define states, actions, and edge cases unless the packet assigns ownership for behavior contracts versus UX presentation.
- Handoff ambiguity: the workflow does not say what each agent produces, where it goes, or which artifact the next agent reads.
- Stale context risk: the packet must include starting branch/HEAD, current owner specs, runtime files, tests, and stop-if-mismatch instructions.
- Design agent overreach: Product Design may invent actions, navigation, source-admin capabilities, or data states unless the packet clearly forbids contract invention.
- Implementation agent overreach: Dev or design implementation agents may expand scope to adjacent surfaces, add placeholder CTAs, or revive deferred source tools unless the package names hard out-of-scope items.
- Product truth stored in the wrong place: if the screen package becomes the only place a decision exists, future agents may miss it or treat temporary package notes as canon.
- Too much process for small tasks: this full workflow is excessive for copy fixes, test-only locks, small docs patches, or isolated non-behavior refactors.
- Not enough review for high-risk tasks: schema, provider, auth, source ownership, API contracts, or cross-lane runtime changes may need heavier review than one combined spec review and one integration review.
- Asset/art timing issues: Art / Creative Studio should not start from raw packet alone if the Design Spec is still unstable; otherwise assets may encode the wrong hierarchy.
- Test/QA gaps: the workflow names missing tests generally, but the packet needs a validation seed and expected regression locks before implementation starts.
- Branch/worktree issues: the workflow does not mention branch/workspace registration, one implementation owner, dirty worktree policy, or avoiding mixed uncommitted work from multiple agents.
- File collision risk: Dev Implementation and Design Implementation can overwrite each other if they share routes/components without a file-level ownership split.
- Cross-spec mismatch ownership is underdefined: manager resolution should include authority lookup and founder clarification rules, not just compromise between agents.
- Closeout ambiguity: final closeout should require current commit/branch evidence, validation output, changed-file summary, and PR metadata, not just a qualitative statement that work is done.

## Drift Risks

- One-off city/community/source behavior: the workflow helps only if the shared packet includes the systems-scale rule and requires full `city + state + music community` compatibility. Add this explicitly.
- Duplicated source/profile/dashboard features: the shared packet and joint spec review reduce this risk, but the package must name source-dashboard, public Artist Profile, listener profile, Registrar, Release Deck, and Print Shop boundaries directly.
- Listener/source/admin boundary leaks: the workflow is well suited to prevent leaks if Dev Spec owns contracts and Design Spec owns presentation without redefining source/admin capability.
- Product Design inventing actions/contracts: this remains a material risk unless the packet says Product Design cannot add actions, CTAs, data fields, auth roles, source tools, or navigation that are not authorized by owner specs.
- Implementation building over stale paths: Dev Spec tracing runtime/tests/contracts is a strong guard, but the packet should require branch/HEAD verification and current file inspection before planning.
- Old docs/handoffs overriding current owner specs: this workflow prevents that only if the packet states authority order and links handoffs as context, not product truth.
- Deferred feature revival: Source posts/messages, analytics, billing, growth, upgrades, full catalogue expansion, DM/contact actions, `Blast` on Artist Profile, and engagement wheels must be explicitly forbidden in the packet.
- Platform-trope drift: Design and art agents need anti-platform-trope constraints so the screen does not become a generic Spotify/Instagram/TikTok/Facebook or creator-SaaS dashboard.

## Better Workflow If Needed

Patch the proposed workflow rather than reject it:

1. Manager verifies branch/HEAD, current dirty state, owner spec, lane briefs, runtime files, tests, and package folder before dispatch.
2. Manager creates one shared instruction packet with scope, out-of-scope, authority order, branch/HEAD, file ownership expectations, validation seed, stop conditions, and pass/fail gates.
3. Dev Spec Agent and Design Spec Agent read the same packet.
4. Dev Spec Agent writes dev spec from current owner specs, runtime, tests, contracts, stale path checks, and validation requirements.
5. Design Spec Agent writes UX/design plan for design-owned parts only, including states, hierarchy, accessibility expectations, responsive behavior, and art needs.
6. Reviewer reviews Dev Spec + Design Spec together as a spec package and classifies findings as dev, design, cross-spec, product decision, stale, or environment.
7. Failed findings return to the responsible spec agent; cross-spec conflicts go to Manager, who resolves by owner specs or stops for founder clarification.
8. If review passes, Manager assigns implementation lanes with explicit file/surface ownership and confirms whether one branch owner or separate branches/worktrees are required.
9. Dev Implementation Agent builds dev-owned work from the approved Dev Spec and does not implement design-only assets or invent UI actions.
10. Design Implementation Agent builds design-owned work from the approved Design Spec and does not alter data contracts, auth rules, API behavior, or action grammar.
11. Art / Creative Studio receives the approved Design Spec and `art-handoff/` brief after the design direction is stable enough to avoid asset rework.
12. Dev and design work are reviewed together after integration, with findings returned to the responsible implementation agent.
13. Final Hardening Agent runs the package hardening pass: tests, accessibility, edge states, copy consistency, integration cleanup, regression locks, and polish.
14. Final closeout happens only after validation, docs/changelog/handoff requirements, branch/worktree state, and PR metadata are complete.
15. Use the lean path instead of this workflow for tiny docs-only, copy-only, test-only, or isolated low-risk fixes.

This patched workflow stays practical for Codex/subagents/Product Design/Creative Studio because it keeps one shared packet, two spec lanes, one package review, bounded implementation ownership, one integrated review, and one final hardening pass.

## Recommended Folder Structure

Recommended package folder:

```text
docs/screen-packages/artist-profile-source-dashboard/
  README.md
  instruction-packet.md
  source-map.md
  workflow-evaluation.md
  spec/
    dev-spec.md
    dev-spec-review.md
  design-spec/
    ux-plan.md
    state-map.md
    design-review.md
  art-handoff/
    creative-brief.md
    asset-inventory.md
    art-review.md
  implementation/
    implementation-plan.md
    file-ownership.md
    validation-log.md
  review/
    spec-package-review.md
    implementation-integration-review.md
    findings.md
  hardening/
    hardening-plan.md
    accessibility.md
    edge-states.md
    regression-locks.md
    closeout.md
```

Rules for this folder:

- Store the shared instruction packet and produced artifacts here.
- Do not duplicate raw authority docs into the package.
- Link to owner specs, lane briefs, runtime files, tests, and handoffs through `source-map.md`.
- Keep durable product truth under `docs/specs/**`.
- Promote accepted product decisions back into the appropriate owner spec, then keep package artifacts as execution history.
- Keep Art / Creative Studio outputs in `art-handoff/` as design assets or asset instructions, not product authority.
- Keep validation and closeout evidence in `implementation/`, `review/`, and `hardening/` so future agents can see what was actually checked.

## Pass / Patch / Reject

**patch**

Exact changes required:

- Add a named Dev Team Manager / package owner with authority over sequencing, scope, gate status, and conflict routing, but not product truth.
- Add explicit authority language: durable product truth remains in `docs/specs/**`; screen-package artifacts are execution workspace outputs.
- Add branch/HEAD verification, dirty-worktree awareness, and branch/workspace registry requirements before assigning agents or implementation work.
- Add explicit inputs and outputs for each agent.
- Add file/surface ownership before Dev Implementation and Design Implementation begin.
- Make spec-package review pass/fail before implementation.
- Classify review findings by owner: dev, design, cross-spec, product decision, stale, environment.
- Route cross-spec conflicts through owner specs first and founder clarification only when product truth is unresolved.
- Delay Art / Creative Studio until the Design Spec is stable enough to avoid asset rework.
- Add risk scaling: use this major-screen workflow for complex screen packages, and use the lean path for small low-risk tasks.
- Add validation seed and expected regression locks before implementation starts.
- Add explicit anti-drift constraints for source/listener/admin boundaries, no one-off city/community/source behavior, no platform-trope imports, no unapproved CTAs, and no design-agent contract invention.
