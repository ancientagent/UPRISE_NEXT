# 2026-06-24 — upriseauditor Methodology Calibration

Date: 2026-06-24
Author lane: upriseauditor (Hermes)
Branch: `docs/abacus-fusion-swarm-strategy` @ 27898c5
Mode: read-only self-correction. No edits. No stages. No commits.

Source files reviewed:

  - `docs/handoff/2026-06-24_documentation-authority-audit-upriseauditor.md`
    (my original audit)
  - `docs/handoff/2026-06-24_documentation-authority-audit-codex.md`
    (parallel codex lane)
  - `docs/handoff/2026-06-24_documentation-authority-inconsistencies.md`
    (consolidated inconsistency list, 23 numbered items)
  - `docs/handoff/2026-06-24_documentation-authority-master-review.md`
    (master review queue, 27 M-items with classification legend)

Purpose:
  Calibrate my audit methodology against the merged master review.
  Identify which items I overstated, which classifications I used
  too loosely, and which evidence claims need softening. Do not
  rewrite the audit. Do not edit product docs.

================================================================
1. SUMMARY OF CALIBRATION CORRECTIONS
================================================================

Five calibration corrections are needed:

  C1. Authority handling — older canon wording can be superseded by
      newer active specs, briefs, runtime, and explicit stale markers.
      My report called several canon items "contradictions" when they
      were already explicitly marked stale/deferred or annotated with
      runtime overrides. The correct classification is "stale wording"
      or "guardrail reinforcement," not "true contradiction."

  C2. Classification discipline — the master review uses six classes:
      true contradiction, stale wording, ambiguous wording, future-
      scope/deferred model, guardrail reinforcement, founder decision.
      My audit mixed these and sometimes used "drift," "conflict," or
      "contradiction" when a softer class was correct.

  C3. Context-loading framing — the goal is layered context, not "read
      less." My audit's recommendation section said "what gets removed
      from default agent loading" in addition to the new orientation
      doc. The removal list was over-broad and should be reframed as
      "what should not be default-loaded for lean task work, but
      remains available for heavy curated context."

  C4. Evidence discipline — my audit cited `apps/web/__tests__/engagement-
      wheel-contract.test.ts` and `apps/web/src/store/onboarding.ts`
      as "verified current file evidence." For the test file, I only
      confirmed the file existed via search; I did not run the test
      and did not read its assertions. That claim should be reclassified
      as "handoff evidence" (test referenced in
      `2026-06-24_radiyo-space-action-contract.md`) rather than
      "verified current file evidence."

  C5. Stale canon handling — my audit's Tone toward stale canon language
      was correct (must be reconciled) but the framing implied canon was
      "wrong." Canon is not wrong; it is the doctrinal layer. Where
      active specs/briefs/runtime override canon, the override is the
      rule, but the canon file is still canon and should be annotated,
      not contradicted.

================================================================
2. ITEMS FROM MY AUDIT THAT SHOULD BE SOFTENED OR RECLASSIFIED
================================================================

The master review's M-numbering is the reference. My audit's numbering
(R1-R5 risks, T1-T5 truths, Lane 1 Conflicts 1-6, Lane 2 Spec Conflicts,
Lane 5 doc contradictions, Fix 1-12) maps to the master items below.

Items to soften or reclassify:

  Item R2 (Top Risk — "Power flows downward only" canon sentence
  contradicts hierarchy).
    Master classification: M-16 (P2 docs-cleanup). Class: canon wording
    conflict.
    My audit: Top Risk R2 + Lane 1 Conflict 1.
    Calibration: this is canon wording conflict at P2, not a Top Risk.
    The Glossary dual-state framing is consistent and the master review
    treats it as low-risk wording cleanup, not a contradiction.
    Reclassify as "ambiguous wording" with low risk. Keep the fix.

  Item R3 (project vs cause terminology is a Top Risk).
    Master classification: M-10 (P1 product-decision, founder decision
    yes).
    My audit: Top Risk R3 + Fix 11.
    Calibration: this is correct in substance but the priority is P1,
    not Top Risk. The terminology debt is acknowledged, founder has
    not yet decided migration vs annotation, and the runtime still
    works. Reclassify from Top Risk to P1 product-decision.

  Item R4 (Uprise has no Prisma model is a Top Risk).
    Master classification: M-05 (P0 docs-cleanup, founder decision
    yes for long-term model).
    My audit: Top Risk R4 + Fix in strategy.
    Calibration: substance is correct, classification severity was
    over-stated. M-05 is P0 docs-cleanup, not a Top Risk in the sense
    of "codex #1 risk." Reclassify as "canon/runtime model gap"
    consistent with M-05. Keep the recommendation: document current
    runtime explicitly, defer dedicated Uprise model.

  Item R5 (Old legacy canon still contains stale current-MVP tab
  language — Top Risk).
    Master classification: M-06 (P1 docs-cleanup) for tab language,
    M-17 (P2 docs-cleanup) for Pioneer framing.
    My audit: Top Risk R5 + Lane 1 Conflict 4 + Conflict 5.
    Calibration: this is two separate items, both P1/P2, not a Top
    Risk. The 2026-06-24 canon annotation already covers the Plot tab
    language; the bigger risk is the Narrative canon body (line 114
    RADIYO wheel, §1.5 Pioneer bonuses) which the master review places
    in M-07 (action grammar) and M-17 (legacy Pioneer framing).
    Reclassify from Top Risk to M-06 / M-07 / M-17 P1-P2 cleanup.

  Item Lane 1 Conflict 3 (Master Narrative §3.2 actions list vs
  Matrix).
    Master classification: M-07 (P1 docs-cleanup, action grammar drift).
    My audit: Lane 1 Conflict 3.
    Calibration: classification is "stale canon/action language" not
    "canon conflict." Same finding, softer classification. Keep the fix.

  Item Lane 1 Conflict 6 (Master Identity and Philosophy Canon §6.2
  vs Rock action).
    Master classification: M-18 (P2 docs-cleanup, maybe).
    My audit: Lane 1 Conflict 6 + Fix in strategy.
    Calibration: master review classifies this as P2 wording ambiguity,
    not a contradiction. Keep the fix, soften the framing.

  Item Lane 2 Spec Conflict 1 (project vs cause).
    Master classification: M-10 (P1 product-decision).
    My audit: Lane 2 Spec Conflict 1 + Fix 11.
    Calibration: classification is correct. Priority is P1, not
    contradicted in master review. Keep.

  Item Lane 2 Spec Conflict 2 (ADD vs Collect internal naming).
    Master classification: not explicitly in master review; falls under
    M-07 (action grammar drift).
    My audit: Lane 2 Spec Conflict 2.
    Calibration: classification is "stale spec wording + runtime
    backward-compat," not "spec contradiction." Soften.

  Item Lane 5 Doc Contradiction 2 (scenes-uprises-sects says create
  inactive Community).
    Master classification: M-03 (P0 docs-cleanup, founder decision
    no).
    My audit: Lane 5 Doc Contradiction 2.
    Calibration: codex is correct that this is a real doc-vs-runtime
    mismatch, not just wording. Master review places it at P0. Keep
    severity, soften framing from "contradiction" to "active spec
    drift" per master review's classification legend.

  Item Lane 5 Doc Contradiction 6 (registrar.md reads as changelog).
    Master classification: not in master review. Falls under M-15
    registrar copy + general "stop bulk-renaming canon" guidance.
    My audit: Lane 5 Doc Contradiction 6.
    Calibration: this is a doc-style complaint, not a contradiction.
    Reclassify as "documentation drift" or "doc-style debt." Lower
    priority.

  Item Lane 2 Missing spec — Prime model.
    Master classification: M-24 (P2 future-scope).
    My audit: Lane 2 Missing spec + Fix recommendation.
    Calibration: this is "future-scope/deferred model," not "missing
    spec." Keep the recommendation: stub `docs/specs/future/prime-
    model.md`. Soften the "missing spec" wording.

  Item Strategy §"What is removed from default agent loading".
    Master framing: layered context, not removal.
    My audit: included a removal list (Operational Getting Started,
    v2 specs, legacy handoffs older than 2026-04-01, etc.).
    Calibration: master review's strategy is layered, not minimal.
    The removal list should be reframed as "do not auto-load by
    default for lean task work; remain available for heavy curated
    context when audit/architecture work is in scope." My specific
    removal items are not wrong but the framing was.

  Item Evidence claim — `apps/web/__tests__/engagement-wheel-contract.test.ts`
  covered.
    Master classification: not classified; this is a method claim.
    My audit: "Action wheel contract: tests apps/web/__tests__/
    engagement-wheel-contract.test.ts (referenced in 2026-06-24_
    radiyo-space-action-contract.md) lock RADIYO/SPACE split."
    Calibration: I confirmed the file exists via search but did not
    read its assertions or run it. The test passing is "handoff
    evidence" (referenced in 2026-06-24_radiyo-space-action-contract.md),
    not "verified current file evidence." Reclassify. Same applies to
    my claim that onboarding-page-lock.test.ts / plot-ux-regression-
    lock.test.ts / registrar-source-context-lock.test.ts exist and
    pass — those are handoff evidence, not directly verified.

  Item Lane 2 Missing spec — "SPACE" as personal-player stand-in.
    Not in master review.
    My audit: Lane 2 Missing spec.
    Calibration: this is "ambiguous wording / undocumented surface,"
    not "missing spec." Action Matrix §10.1 names SPACE explicitly.
    Lower priority. Recommend a one-line note in UI_CURRENT.md, not a
    new spec.

  Item Lane 1 Dangling reference — Master Revenue Strategy references
  `+UPRISE Signal System & Print Shop Specification.md`.
    Not in master review.
    My audit: Lane 1 dangling reference.
    Calibration: this is a "stale cross-reference" not a
    "contradiction." Lower priority. Note for cleanup, not for a
    master review item.

================================================================
3. ITEMS FROM MY AUDIT THAT REMAIN VALID (NO RECLASSIFICATION)
================================================================

These items appear in the master review with the same classification
and the same winning truth. Keep as-is.

  Top Truths T1-T5 — fully preserved by master review Winning Truths
  1-10. No reclassification needed.

  Risk R1 — Agent reading strategy conflict. Master M-01 P0 docs-
  strategy. Classification preserved.

  Lane 1 Conflict 2 — Master Narrative §6.3 Plot surfaces table. Master
  M-06 P1 docs-cleanup. Substance and severity preserved (P1, not Top
  Risk).

  Lane 1 Conflict 4 — Legacy Narrative line 114 RADIYO wheel. Master
  M-07 P1 docs-cleanup. Substance preserved.

  Lane 1 Conflict 5 — Legacy Narrative Pioneer framing. Master M-17
  P2 docs-cleanup. Substance preserved.

  Lane 1 Conflict 6 — Master Identity and Philosophy §6.2 vs Rock.
  Master M-18 P2 docs-cleanup. Substance preserved; only severity
  softened (see Section 2).

  Lane 2 Spec Conflicts (project vs cause, scenes-uprises-sects
  inactive row wording). Master M-10 and M-03. Substance preserved.

  Lane 2 Missing spec — Print Shop spec cross-check with Business
  boundary. Master M-08. Substance preserved.

  Lane 4 Historical docs list. Master M-26 (mark superseded) and
  M-12 (handoff index stale). Substance preserved.

  Lane 5 Runtime/test cross-check — community architecture, launch
  matrix, Plot tabs, source dashboard, Artist Profile direct listen,
  Registrar Home Scene scope, business/media boundary. All match
  master review's runtime truth claims.

  Fix 1 — Create PLATFORM_START_HERE.md. Master M-02 P0. Substance
  preserved.

  Fix 7 — docs-lint extensions. Master M-06 / M-07 / M-20 imply lint
  additions. Substance preserved (lane consistency check is also
  M-04 docs-cleanup). Path for the new doc is still in
  Disagreement 1 territory (use `docs/PLATFORM_START_HERE.md` per
  master review §M-02).

  Fix 8 — phase index. Master review's proposed walkthrough order
  implicitly assumes a phase-style organization; M-24 "Prime model
  references" is also phase-like. Substance preserved.

  Fix 9 — mark Operational/Expanded Getting Started superseded. Not
  explicitly in master review. Substance preserved as low-risk
  cleanup.

  Fix 10 — Specifications/README cleanup. Master M-25. Substance
  preserved.

  Fix 11 — annotate registrar.md / identity-roles-capabilities.md
  for project vs cause. Master M-10. Substance preserved.

  Fix 12 — move v2 specs to `_v2/` folder. Not explicitly in master
  review. Substance preserved as low-risk cleanup.

================================================================
4. HOW FUTURE upriseauditor RUNS SHOULD CLASSIFY DOC CONFLICTS
================================================================

For each finding, future upriseauditor runs should:

  4.1. Apply the master review's classification legend:
    - true contradiction: doc A and doc B both assert conflicting
      truths about the SAME current MVP behavior, both have current
      authority, and no founder decision has resolved them.
    - stale wording: doc asserts older or doctrinal language that
      has been superseded by active spec/brief/runtime/lock with
      explicit marker.
    - ambiguous wording: doc asserts language that can be read
      multiple ways; clarity is the only action item.
    - future-scope/deferred model: doc asserts something that is
      doctrine / future / deferred but reads as current; correct
      action is annotation, not removal.
    - guardrail reinforcement: a current rule needs repeated
      reinforcement across multiple docs.
    - founder decision: no current MVP behavior change is needed;
      the choice between alternatives requires product input.

  4.2. Apply AGENTS.md authority order without elevating canon over
  active MVP locks. Canon is doctrinal; active MVP locks define
  current MVP behavior. Where canon and active MVP lock differ,
  the active MVP lock wins for MVP scope, and the canon file gets
  an annotation. Canon is never "wrong" — it is the semantic layer.

  4.3. Distinguish evidence sources:
    - "verified current file evidence": I directly read or ran the
      file and confirmed the claim.
    - "handoff evidence": the claim was referenced in a dated
      handoff I read, but I did not directly verify the file.
    - "spec/lock evidence": the claim was read from an active spec
      or lock document.
    Default to handoff evidence unless I personally opened the file
    and ran/inspected it.

  4.4. State severity by class, not by headline:
    - P0 = current MVP behavior is at risk if this is not resolved.
    - P1 = current MVP behavior is correct but adjacent docs/locks
      create material confusion for the next implementer.
    - P2 = wording / metadata / future-scope / staged cleanup.

  4.5. Frame context-loading recommendations as layered, not minimal:
    - Tier 0: non-negotiables and repo rules (always).
    - Tier 1: short platform orientation + context router + lane
      brief (default for meaningful work).
    - Tier 2: lane brief + active spec + relevant lock (default for
      focused implementation).
    - Tier 3: heavy curated authority pack (default for audit,
      architecture, planning).
    Do not propose "remove from default loading" as the primary
    direction. Propose "do not auto-load by default for lean task
    work; remain available for heavy curated context."

  4.6. Do not invent founders-decision items where the master
  review or active lock has already resolved them. If a finding is
  resolved by a recent active lock or implementation, classify it
  as "docs-cleanup" not "product-decision."

================================================================
5. CALIBRATION ITEMS I WOULD PRESENT DIFFERENTLY NEXT TIME
================================================================

  - I would not have called R2, R3, R4, R5 "Top Risks." They are
    P0/P1 items but not Top Risks in the same sense as R1 (agent
    reading strategy conflict), which directly blocks new agents
    from understanding the app.
  - I would not have framed the strategy as "what gets removed from
    default loading." Master review correctly reframes it as layered
    context with optional heavy mode.
  - I would not have asserted test files "covered" anything without
    reading the file or running it. Handoff reference is enough; it
    just needs to be labeled as handoff evidence.
  - I would have separated "canon wording conflict" from "canon
    concept gap" (e.g., R4 Uprise concept is canon-vs-runtime model
    gap, not canon-vs-runtime contradiction).
  - I would have softened the "missing spec" wording for Prime
    model and SPACE; they are documented in places (Prime model in
    ONBOARDING_HOME_SCENE and launch-community-city-matrix;
    SPACE in MVP_ACTION_SYSTEM_MATRIX §10.1).

================================================================
6. WHAT THIS NOTE DOES NOT CHANGE
================================================================

  - No product spec or runtime file was edited.
  - The original audit file remains untracked on disk for the
    founder and codex lane to read as-is.
  - The classification softening here is method-only; the
    recommendations themselves (Fix 1-12) are largely preserved,
    with severity adjustments noted in Section 2.
  - The 8 truths listed in the calibration request remain
    authoritative and are not disputed.

================================================================
7. NO-EDIT CONFIRMATION
================================================================

No files were modified during this self-correction. This file is
the only output. Original audit, codex audit, inconsistencies list,
and master review remain untracked on disk and unchanged.

================================================================
END OF METHODOLOGY CALIBRATION
================================================================