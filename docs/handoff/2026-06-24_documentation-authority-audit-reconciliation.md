# 2026-06-24 — Documentation Authority Audit Reconciliation (upriseauditor ↔ codex)

Date: 2026-06-24
Branch: `docs/abacus-fusion-swarm-strategy` @ 27898c5
Mode: read-only comparison. No edits. No stages. No commits.

## Purpose

Two parallel audit lanes ran on the same repo at the same commit:

  - upriseauditor (Hermes):
    `docs/handoff/2026-06-24_documentation-authority-audit-upriseauditor.md`
    (1185 lines, 68682 bytes)
  - codex:
    `docs/handoff/2026-06-24_documentation-authority-audit-codex.md`
    (589 lines, 24179 bytes)

This document lists every disagreement between the two lanes and every
consensus finding where they overlap. The point is to make sure both lanes
agree on the same winning truth before the founder sees the merged result.

## Comparison method

For each topic, the lanes are scored on:

  - same conclusion, same evidence
  - same conclusion, different evidence
  - different conclusion
  - one lane covers, the other does not
  - terminology / naming difference only

Disagreements are listed in §3. Consensus items are listed in §2. Items
only one lane raised are listed in §4. Founder-decision deltas are listed
in §5. Strategy / scope deltas are listed in §6.

No files were modified during this comparison.

================================================================
1. STRUCTURAL DIFFERENCES BETWEEN THE TWO REPORTS
================================================================

| Axis                         | upriseauditor                                  | codex                                                  |
|------------------------------|------------------------------------------------|--------------------------------------------------------|
| Length                       | 1185 lines                                     | 589 lines                                              |
| Lane split                   | 6 named lanes + executive + cross-lane + strategy | 4 delegated lanes + main-thread synthesis              |
| Number of immediate fixes    | 12                                             | 12                                                     |
| Top-N risks enumerated       | 5 risks + 5 truths                             | 5 problems + 9 "winning truth" claims                   |
| Cross-lane inconsistency table | 20-row table with Founder Decision column     | 12-row table with Founder Decision column               |
| Strategy proposal            | PLATFORM_START_HERE.md + PHASE_INDEX.md + 3 small briefs + lint extensions + folder reorg | Layered Tier 0/1/2/3 strategy; PLATFORM_START_HERE.md; heavy mode for audits |
| Place for new START_HERE     | docs/agent-briefs/PLATFORM_START_HERE.md (proposed) | docs/PLATFORM_START_HERE.md (proposed)                |
| Runtime cross-check          | Prisma schema, onboarding.service.ts, plot/page.tsx, onboarding store | delegated runtime lane (11 API suites / 45 tests, 12 web suites / 54 tests passed) |
| Evidence citations           | heavy on file:line citations                   | heavy on section anchors + delegated evidence          |

The two reports are structurally compatible: 12 immediate fixes each, similar
risk counts, similar lane breakdown. Codex is more compressed; upriseauditor
is more granular. They differ on emphases and on a small number of
conclusions (see §3).

================================================================
2. CONSENSUS FINDINGS (both lanes agree)
================================================================

Both lanes converge on every major current platform truth:

  C1. Community identity is `city + state + music community`.
      - codex §"Community Architecture" + upriseauditor Top Truth T1.

  C2. Community architecture is invariant across launch communities and
      future ones.
      - codex §"Community Architecture" + upriseauditor Top Truth T2.

  C3. Launch communities are seeded instances, not architectural variants.
      - codex §"Community Architecture" + upriseauditor Lane 2 (Prime model
        spec gap).

  C4. Sects, channels, sub-communities happen later via the Prime model, not
      as launch seed variants.
      - codex §"Community Architecture" + upriseauditor Lane 2 same.

  C5. Plot is inside Home, not a peer route.
      - codex §"Plot / Events / Archive" + upriseauditor Top Truth T5.

  C6. Current MVP Plot tabs are `Feed`, `Events`, `Archive`.
      - codex §"Plot / Events / Archive" + upriseauditor Top Truth T3 +
        Risk R5.

  C7. `Archive` is the descriptive stats/history lane; no current
      `Statistics` tab.
      - codex §"Plot / Events / Archive" + upriseauditor Top Truth T3.

  C8. `Promotions` and `Social` are deferred from current MVP Plot tabs.
      - codex §"Plot / Events / Archive" + upriseauditor Top Truth T3.

  C9. Current Plot Events rows are read-only; no inline calendar mutation.
      - codex "Calendar/Event behavior" row + upriseauditor Lane 4.

  C10. Listener profile, Artist Profile, Source Dashboard, Registrar, and
       business surfaces are separate concepts.
      - codex §"Source / Artist / Registrar Separation" + upriseauditor
        Top Truth T5.

  C11. Source Dashboard is the monorepo stand-in for future separate
       source/admin web tooling.
      - codex §"Source / Artist / Registrar Separation" + upriseauditor
        Top Truth T5.

  C12. GPS gates voting only, not general participation.
      - codex §"Onboarding / Home Scene" + upriseauditor Top Truth T1.

  C13. Pioneer fallback preserves submitted city/state intent and routes to
       nearest active community for the same parent music community.
      - codex §"Onboarding / Home Scene" + upriseauditor Top Truth T1 +
        Risk R5 conflict item.

  C14. Missing music-community requests are intake only, not selectable
       scenes until review.
      - codex §"Onboarding / Home Scene" + upriseauditor Lane 4.

  C15. `RADIYO` wheel excludes `Blast`; `Blast` belongs to the personal
       player / `SPACE`.
      - codex §"Codex Lane Split" / implicit throughout + upriseauditor
        Top Truth T4 + Risk R2 (both call out Blast on the wheel as
        canon drift).

  C16. Artist Profile is no-wheel and no-`Blast`.
      - codex "docs match runtime" + upriseauditor Top Truth T4.

  C17. Business / monetization / billing runtime is deferred; doctrine only.
      - codex §"Business / Media / Monetization" + upriseauditor
        Top Risk + Lane 2.

  C18. Registrar is listener-side / Home Scene-bound; source routes may
       bridge into it without changing that model.
      - codex §"Source / Artist / Registrar Separation" + upriseauditor
        Lane 3 + Lane 4.

  C19. The docs system is more clearly defined than the agent loading
       path. Both lanes call out that scattered truth is the actual
       problem.
      - codex §"Executive Summary" + upriseauditor §1 Top Risk R1.

  C20. The founder's stated concern (agents not understanding the app) is
       structural, not content.
      - both lanes.

Both lanes also agree on these fix recommendations:

  F1. Create a single platform orientation doc (PLATFORM_START_HERE.md).
      - upriseauditor Fix 1, codex Fix 1.
      - Path disagreement: upriseauditor proposed
        `docs/agent-briefs/PLATFORM_START_HERE.md`; codex proposed
        `docs/PLATFORM_START_HERE.md`. See §3.

  F2. Reconcile pioneer community creation language in
      `scenes-uprises-sects.md`.
      - upriseauditor Lane 2 Spec Conflict #5 + codex Fix 4.

  F3. Clarify Print Shop placement.
      - upriseauditor Lane 2 + codex Fix 7.

  F4. Clarify calendar / event read-only boundary.
      - upriseauditor Lane 2 + codex Fix 6.

  F5. Patch stale runtime comments / UI copy (Plot Promotions tab comment,
      Registrar "Print Shop event creation pending" copy).
      - upriseauditor Lane 5 doc contradiction #6 + codex Fix 9.

  F6. Refresh handoff index so 2026-06-24 work is discoverable.
      - upriseauditor Lane 4 historical-load concern + codex Fix 10.

  F7. Mark old execution plans historical / superseded.
      - upriseauditor Lane 4 historical docs list + codex Fix 12.

  F8. Remove stale Hermes auditor branch defaults.
      - upriseauditor Lane 3 EXTERNAL_TOOLS reference +
        codex Fix 11.

Both lanes propose 12 fixes each. Most fixes overlap. A combined fix list
is provided in §7.

================================================================
3. DISAGREEMENTS / CONTRADICTIONS BETWEEN LANES
================================================================

Disagreement 1 — Recommended path for the new START_HERE doc.

  upriseauditor: `docs/agent-briefs/PLATFORM_START_HERE.md`
    - Rationale: lives next to the agent briefs that already route work,
      visible to agents that already load `agent-briefs/`.
  codex: `docs/PLATFORM_START_HERE.md`
    - Rationale: lives at top-level of docs so any reader (incl. external
      agents, designer prompts, NotebookLM) finds it without having to
      know about `agent-briefs/`.
  Resolution: pick one. Codex path is more discoverable for external tools
    and matches the founder's "agents don't understand the app" complaint
    (the doc needs to be the first hit for someone landing in `docs/`).
    Recommended winner: `docs/PLATFORM_START_HERE.md` (codex). Update
    upriseauditor Fix 1 to match. Low-risk founder call if desired.

Disagreement 2 — Strategy structure.

  upriseauditor: PHASE_INDEX.md + 3 small new briefs
    (SURFACES_THAT_ARE_NOT_THE_SAME, WHATS_DEFERRED) + docs-lint extensions
    (4 new patterns) + folder reorg for v2 specs + lint rules.
  codex: Layered Tier 0/1/2/3 strategy with a "heavy mode" for audits;
    PLATFORM_START_HERE.md; documentation-framework.md rewrite; no
    docs-lint extension; no folder reorg.
  Resolution: both strategies are compatible. Codex's Tier model is
    actually a superset of upriseauditor's phase model because each tier
    can contain multiple phases. Recommended winner: codex Tier model as
    the umbrella; upriseauditor's phase index and lint additions stay
    useful as concrete deliverables inside Tier 1 (PLATFORM_START_HERE)
    and the docs-lint gate. Founder call: accept layered Tier model and
    treat phase index as a doc inside Tier 1.

Disagreement 3 — Whether AGENTS.md and CONTEXT_ROUTER.md actually conflict.

  upriseauditor: lists CONTEXT_ROUTER.md as a working routing system that
    complements AGENTS.md. No direct "disagreement" claim.
  codex: Top Risk #1 explicitly states "AGENTS.md and CONTEXT_ROUTER.md
    disagree about how much context agents should load by default."
  Resolution: this is a real disagreement. AGENTS.md "Always Read"
    requires 6 docs in order; CONTEXT_ROUTER.md says "load for the lane,
    not for the whole platform." Both lanes converge on the need to
    reconcile; only codex names it as the #1 risk. Recommended winner:
    codex's framing is more accurate. This is Fix 2 in both lanes.

Disagreement 4 — Whether `tasteTag` API field is a bug, a debt, or a
legacy-compat seam.

  upriseauditor: notes in Lane 5 that `tasteTag` is still accepted
    optionally by the API and persisted via `homeSceneTag`; lists it as
    runtime/spec inconsistency.
  codex: Fix 8 proposes three options explicitly: remove now, ignore
    silently, or preserve as legacy-compatible debt; flags this as a
    founder decision.
  Resolution: codex is more precise about the choice space.
    upriseauditor treats it as drift; codex treats it as a product call.
    Recommended winner: keep codex Fix 8 framing; make founder call on
    remove/ignore/debt.

Disagreement 5 — Whether pioneer "create inactive Community row" is
runtime behavior or only spec drift.

  upriseauditor: Lane 2 Spec Conflict #5 says scenes-uprises-sects.md
    and onboarding-home-scene-resolution.md are functionally equivalent
    even though the wording differs.
  codex: Top Risk #2 + Fix 4 says the scenes-uprises-sects.md claim is
    "create inactive Community row" and that runtime + USER-ONBOARDING
    spec do not do this. Codex treats this as a high-risk doc-to-runtime
    conflict.
  Resolution: codex is more accurate. The onboarding spec's actual
    resolution logic finds an existing city-tier `Community` and, if not
    found or not active, marks the user as pioneer and resolves the
    nearest active community. The scenes-uprises-sects.md line that
    says "the system creates it as inactive" is stale wording that an
    agent could read and try to implement. Recommended winner: codex
    Fix 4 framing (mark lines superseded by onboarding spec/runtime).

Disagreement 6 — Print Shop placement.

  upriseauditor: in Lane 2 and the cross-lane table says "Print Shop is
    source-facing" and that current-MVP is event-write only; recommends
    only "reinforce in WHATS_DEFERRED".
  codex: Top Risk #4 says "Print Shop placement is mixed across
    canon/specs/briefs: Events, Promotions, and source-dashboard language
    all appear" and Fix 7 calls for clarification across 4 docs.
  Resolution: codex is more accurate. upriseauditor under-counts the
    surface area: canon/Master Application Surfaces & Lifecycle §1.2
    places Print Shop inside Events surface; identity-roles-capabilities
    §"Promoter Policy" calls it source-facing; the source-dashboard
    surface contract says Print Shop is "inside the source dashboard";
    spec/economy/print-shop-and-promotions.md exists separately.
    Recommended winner: codex Fix 7 framing; expand to 4-5 docs.

Disagreement 7 — Founder decision scope.

  upriseauditor: lists 4 founder decisions (Phase A: long-term Uprise
    model, Phase B: post-MVP Prime model, "cause" rename, founder pricing).
  codex: lists 5 founder decisions (default read path lean vs heavy,
    missing-community threshold, tasteTag disposition, calendar timing,
    long-term Print Shop IA wording).
  Resolution: the two lists are non-overlapping. upriseauditor's
    founder-decision items are about future scope and renames. codex's
    founder-decision items are about current-state product calls. Both
    sets are valid; the merged list should include both. Recommended
    winner: combined. See §5.

Disagreement 8 — Scope of "what to phase out" for canonical docs.

  upriseauditor: keeps Master Narrative, Glossary, Identity, Application
    Surfaces, Voice & Messaging, Revenue canon. Marks Legacy Narrative
    as historical. Recommends moving Operational / Expanded Getting
    Started out of canon to legacy. Wants canon folder to remain active.
  codex: does not enumerate canon-by-canon handling. Says "preserve a
    heavy platform knowledge layer" + Tier 3 heavy authority pack can
    include canon.
  Resolution: upriseauditor is more specific. Recommended winner:
    upriseauditor's canon handling list, since codex doesn't enumerate.

Disagreement 9 — Uprise persistence in Prisma.

  upriseauditor: Top Risk R4 + Lane 5 — "Uprise does not exist as a
    Prisma model" and recommends a brief note to warn agents.
  codex: does not list this as a separate risk; treats Uprise as part
    of generic Community instance architecture.
  Resolution: upriseauditor is more accurate. Runtime stores Uprise as
    `Community.tier = city` + carried `Signal` rows; agents looking for
    `Uprise` table will not find it. Recommended winner: upriseauditor
    framing; add a brief / spec note.

Disagreement 10 — Whether to phase out `docs/Specifications/`.

  upriseauditor: Lane 4 + Fix 10 — `docs/Specifications/README.md`
    references non-existent canonical IDs and should be rewritten or
    frozen.
  codex: does not address Specifications folder directly.
  Resolution: upriseauditor is more accurate. The README references
    01_UPRISE_Master_Overview.md through 09_UPRISE_Promotions_Business.md;
    none of those files exist in the folder. Recommended winner:
    upriseauditor Fix 10.

Disagreement 11 — Whether Plot calendar wording is a high-risk doc
contradiction.

  upriseauditor: Lane 2 lists it but does not flag it as a top risk.
  codex: Top Risk #3 calls "Plot calendar wording is broader than the
    current read-only Plot Events implementation" a high-risk issue.
  Resolution: codex is more accurate. plot-and-scene-plot.md §"Calendar
    rule" says "users add events directly to calendar" while the spec
    itself later says current Plot Events is read-only. Recommended
    winner: codex Top Risk #3 + Fix 6.

Disagreement 12 — Whether `docs/canon/Operational Getting Started.md` and
`Expanded Getting Started.md` are problems.

  upriseauditor: Lane 4 + Fix 9 — "These duplicate AGENTS.md + RUNBOOK.md
    content. Risk: an agent that lands on `docs/canon/` will read
    Operational Getting Started before AGENTS.md."
  codex: does not call these out.
  Resolution: upriseauditor is correct. The Operational / Expanded
    Getting Started docs in docs/canon/ duplicate AGENTS.md content and
    can misroute a new agent. Recommended winner: upriseauditor Fix 9.

================================================================
4. ITEMS ONLY ONE LANE RAISED
================================================================

Only upriseauditor raised:

  U1. Master Narrative Canon §1.4 "Power flows downward only" sentence
      contradicts the Scene > Uprise > Community > Plot > RaDIYo hierarchy
      stated immediately above. (Top Risk R2.)
  U2. Master Narrative Canon §3.2 still lists ADD / FOLLOW / BLAST /
      SUPPORT as the four universal actions; Action Matrix (2026-04-14)
      says public verb is Collect; SUPPORT is derived state. (Lane 1
      Conflict #3 + Fix 2.)
  U3. Master Narrative Canon §6.3 Plot surfaces table still lists
      Promotions / Statistics / Social alongside Feed / Events; the
      2026-06-24 annotation is one paragraph above a long, untouched
      body. (Lane 1 Conflict #2 + Fix 3.)
  U4. Legacy Narrative plus Context .md line 114 still names
      "Action Wheel: Upvote, Add, Blast, Skip, Report"; §1.5 still
      describes Pioneer recruitment tool + large Activity Point bonuses.
      (Lane 1 Conflict #4 + #5 + Fix 5.)
  U5. `How Uprise Works — Canon Audit (working).md` is listed as final
      canon in CONTEXT_ROUTER.md but file body says "working" and its
      engagement-score table is partially superseded by Action Matrix.
      (Lane 1 + Fix 6.)
  U6. `project_registration` runtime vs `cause` canonical term debt.
      (Top Risk R3 + Fix 11.)
  U7. Master Identity and Philosophy Canon §6.2 "no featured or staff
      picks" vs Rock action in Matrix §8 row 6 — possible reader
      confusion. (Lane 1 Conflict #6.)
  U8. docs/canon/Master Revenue Strategy Canonon.md references
      "+UPRISE Signal System & Print Shop Specification.md" which does
      not exist in docs/canon/. (Lane 1 dangling reference.)
  U9. docs/specs/Specifications/README.md references non-existent legacy
      canonical IDs. (Lane 4 + Fix 10.)
  U10. docs/specs/admin/super-admin-controls.md reads as fully active
      but most of it is deferred (RBAC, audit log, moderation queue,
      pricing config). (Lane 2.)
  U11. docs/specs/discovery/vibe-check-and-taste-profiles.md needs a
      current-MVP-truth header. (Lane 2.)
  U12. docs/specs/v2/*.md should move to docs/specs/_v2/ or
      docs/specs/future/ so they don't surface in default
      `ls docs/specs`. (Lane 2 + Fix 12.)
  U13. No active spec covers Prime model mechanics; recommend
      `docs/specs/future/prime-model.md` stub. (Lane 2.)
  U14. No active spec covers `SPACE` as personal-player web stand-in.
      (Lane 2.)
  U15. docs-lint.mjs is missing rules for: "Genre Selection" copy,
      "Observer" terminology, project_registration term, "Action Wheel"
      pattern. (Lane 5 + Fix 7 in upriseauditor.)
  U16. plot-ux-regression-lock.test.ts is described as covering
      "Feed/Events/Archive only" but no test confirmed in audit.
      (Lane 5 test gap.)
  U17. No test enforces source-account-context hardening at brief
      level. (Lane 5 test gap.)
  U18. "prime-model" / "prime model" search returns no docs file —
      "Prime model" is referenced everywhere but has no spec.
      (Confirmed during comparison: no `docs/specs/**prime-model**`
      file exists.)
  U19. docs/Specifications/ has only README.md and
      FRESH_READINESS_REPORT.md; the rest of the README is stale.
      (Confirmed during comparison.)

Only codex raised:

  C1. `AGENTS.md` and `CONTEXT_ROUTER.md` disagree on default context
      load (Top Risk #1). upriseauditor treats them as complementary;
      codex treats them as conflicting. See Disagreement #3.
  C2. Pioneer inactive Community creation language is a runtime
      contradiction, not just a wording difference. See Disagreement #5.
  C3. Plot calendar wording is broader than the read-only runtime
      implementation. See Disagreement #11.
  C4. Print Shop placement is mixed across canon / specs / briefs.
      See Disagreement #6.
  C5. Some active indexes and assistant briefs are stale enough to
      misroute agents. (No upriseauditor equivalent — although
      upriseauditor Lane 4 lists historical docs.)
  C6. API `tasteTag` field disposition needs explicit founder call
      (Fix 8). upriseauditor flags it as drift but doesn't ask the
      founder.
  C7. Hermes auditor brief should be branch-agnostic. (Fix 11.)
  C8. Plot Promotions API comment is stale and should be patched.
      (Fix 9.) upriseauditor's contradiction #6 captures this but
      doesn't recommend a patch in fixes.
  C9. "Founders must decide whether default read path stays lean
      or accepts a heavier curated primer." (Founder decision #1.)

================================================================
5. FOUNDER DECISION DELTAS
================================================================

Both lanes propose items that need founder input. The sets are
non-overlapping. Combined founder-decision list:

  FD1. Default agent read path: lean router only, or lean + heavy
       curated platform primer? (codex FD #1.)
       Both lanes: lean alone is insufficient. Codex suggests
       layered strategy (Tier 0/1/2/3). Recommended: lean default +
       heavy mode for audits, planning, architecture.

  FD2. Missing music-community request eligibility threshold. (codex
       FD #2, upriseauditor Phase D2.) Current docs say "repeated
       submissions from distinct people in distinct cities" but no
       number.

  FD3. API `tasteTag` field: remove now, ignore silently, or preserve
       as legacy-compatible debt? (codex FD #3.) upriseauditor flags
       this as drift; codex frames it as a product call.

  FD4. Calendar action surface timing. (codex FD #4.) Calendar is real
       and approved but not currently inline; when does it activate?

  FD5. Long-term Print Shop IA wording. (codex FD #5.) Events,
       Promotions, source-dashboard, artifacts, business surfaces all
       touch Print Shop canonically.

  FD6. `Uprise` model: keep as semantic-only concept stored as
       Community.tier + Signal rows, or build a dedicated Prisma model?
       (upriseauditor Top Risk R4 + Disagreement #9.) This is a
       long-term architecture call.

  FD7. `cause` vs `project_registration` term migration. (upriseauditor
       Top Risk R3 + Fix 11.) The product term is `cause` per
       MVP_SOURCE_AND_FEED_RULES; runtime persists
       `type=project_registration`. Migration timing + scope.

  FD8. Discovery Pass / Play Pass / promotional slot pricing.
       (upriseauditor Lane 2 product decisions.) Same DECISIONS_REQUIRED
       §5 items already documented; just confirming these remain
       founder-blocked.

  FD9. Propagation thresholds for City → State → National. (upriseauditor
       Lane 2 product decisions.) Same DECISIONS_REQUIRED §1 items.

  FD10. Activity Points scoring table, decay, seasonality.
        (upriseauditor Lane 2.) DECISIONS_REQUIRED §3 items.

================================================================
6. STRATEGY / SCOPE DELTAS
================================================================

The two strategies are largely compatible. The merged recommendation:

  Strategy element                          | Where it lives in merged plan
  ------------------------------------------|---------------------------------
  Layered context loading (Tier 0/1/2/3)    | codex (umbrella)
  Single platform orientation doc           | both; pick path (Disagreement #1)
  Phase index                               | upriseauditor (concrete deliverable in Tier 1)
  Surfaces-That-Are-Not-The-Same brief      | upriseauditor (in PLATFORM_START_HERE area)
  Whats-Deferred brief                      | upriseauditor (in PLATFORM_START_HERE area)
  Docs-lint extension (4 new patterns)      | upriseauditor (concrete gate)
  v2 specs folder move                      | upriseauditor (concrete cleanup)
  Operational / Expanded Getting Started    | upriseauditor (mark superseded, see U12)
  Specifications README freeze              | upriseauditor (Fix 10)
  Hermes auditor brief branch-agnostic      | codex (Fix 11)
  Handoff index refresh                     | both (Fix 6 in upriseauditor, Fix 10 in codex)

Recommended merged strategy structure:

  Tier 0 (always known): AGENTS.md non-negotiables.
  Tier 1 (default for meaningful work):
    - docs/PLATFORM_START_HERE.md (new; absorbs upriseauditor's
      SURFACES_THAT_ARE_NOT_THE_SAME + WHATS_DEFERRED as in-doc sections).
    - docs/PHASE_INDEX.md (new; upriseauditor proposal).
    - docs/agent-briefs/CONTEXT_ROUTER.md (existing; reconcile with AGENTS.md).
    - lane brief for active focus.
    - companion briefs only if task crosses lanes.
  Tier 2 (execution guidance):
    - active specs for touched domain.
    - active founder locks / solution docs for the topic.
  Tier 3 (heavy authority pack, audits/architecture/planning):
    - selected canon files.
    - relevant specs.
    - relevant founder locks.
    - latest relevant handoffs.
    - runtime/test evidence for verification.

Plus concrete gates:
    - docs-lint.mjs extension to add 4 new patterns (Fix 7).
    - v2 folder reorg (Fix 12).
    - Operational / Expanded Getting Started → marked superseded (Fix 9).
    - Specifications README → freeze or rewrite (Fix 10).
    - Hermes auditor brief → branch-agnostic (Fix 11).

================================================================
7. COMBINED IMMEDIATE FIX LIST (24 items, merged from 12+12)
================================================================

Items are ordered by lane dependency. Files in [brackets] are the union
of who proposed them.

  I1. Create docs/PLATFORM_START_HERE.md [both].
      P0. New doc. Explains UPRISE in one short platform mental model.
      Includes community identity, current MVP surfaces, deferred domains,
      and lane routing. States it is not a replacement for canon/specs.
      Path: docs/PLATFORM_START_HERE.md (use codex's path per
      Disagreement #1 resolution).

  I2. Reconcile AGENTS.md "Always Read" with CONTEXT_ROUTER.md [both].
      P0. One default reading strategy exists. Operational docs become
      conditional by task type. Heavy context mode is documented for
      audits/planning/architecture.

  I3. Rewrite docs/specs/system/documentation-framework.md [codex].
      P0. Reflects AGENTS.md + PLATFORM_START_HERE.md + lane briefs.
      Retires 2025-only "docs/README is single entrypoint" framing.
      Keeps <5 minute orientation goal.

  I4. Patch pioneer community creation docs [codex + upriseauditor].
      P0. No active spec says onboarding creates inactive pioneer
      Community rows. Current behavior is clearly fallback route +
      preserved pioneer intent.
      Files: scenes-uprises-sects.md lines 31 / 114; possibly
      edge-cases-and-compliance.md; possibly onboarding-home-scene-resolution.md.

  I5. Reconcile Master Narrative Canon §3.2 actions list [upriseauditor].
      P1. Use Collect / Follow / Blast / Back. Mark Support as derived
      state. Mark Back as Registrar-only.

  I6. Reconcile Master Narrative Canon §6.3 Plot surfaces table
      inline [upriseauditor].
      P1. Read Feed, Events, Archive with Promotions / Statistics /
      Social marked deferred/historical.

  I7. Reconcile Master Narrative Canon §1.4 power-flow sentence
      [upriseauditor].
      P2. Remove or rewrite. Reference Glossary dual-state framing.

  I8. Extend Legacy Narrative runtime override note [upriseauditor].
      P1. Cover RADIYO wheel, Pioneer framing, Sects-as-taste-tags.

  I9. Annotate How Uprise Works — Canon Audit (working).md as
      working-only [upriseauditor].
      P1. Rename to ..._WORKING.md; first line states working-only;
      CONTEXT_ROUTER.md marks as working-only.

  I10. Add docs-lint rules for genre-selection copy, Observer term,
       project_registration term, "Action Wheel" pattern [upriseauditor].
       P1. Extend scripts/docs-lint.mjs.

  I11. Create docs/PHASE_INDEX.md [upriseauditor].
       P1. Maps phases to canonical docs.

  I12. Mark / freeze Operational Getting Started.md and Expanded
       Getting Started.md as superseded [upriseauditor].
       P1. Top-of-file status header or move to legacy.

  I13. Annotate docs/Specifications/README.md [upriseauditor].
       P2. Remove references to non-existent legacy IDs.

  I14. Annotate registrar.md / identity-roles-capabilities.md for
       project-vs-cause term [upriseauditor].
       P2. Header note in each spec.

  I15. Move docs/specs/v2/*.md to docs/specs/_v2/ [upriseauditor].
       P2. Folder reorg; no content changes.

  I16. Clarify calendar / event current boundary [both].
       P1. Current Plot Events rows are explicitly read-only. Calendar
       is acknowledged as real/approved layer only where currently
       scoped.

  I17. Clarify Print Shop placement [codex + upriseauditor].
       P1. Current MVP Print Shop event-write lane is source-facing.
       Broader Print Shop artifacts / promos / business behavior remains
       deferred.

  I18. Patch stale comments / UI copy [codex + upriseauditor].
       P2. Promotions endpoint comment does not call it a current Plot
       Promotions tab. Registrar copy does not say Print Shop event
       creation is unpublished if event-write lane exists.
       Files: apps/api/src/communities/communities.controller.ts,
       apps/web/src/app/registrar/page.tsx.

  I19. Refresh handoff index [both].
       P2. New 2026-06-24 high-value docs are discoverable or the index
       says search latest by topic.

  I20. Remove stale Hermes branch defaults [codex + upriseauditor].
       P2. Hermes auditor brief is branch-agnostic.

  I21. Mark old execution plans historical / superseded [both].
       P2. Current active docs are not competing with old execution
       plans. Historical docs remain available but not default-loading.

  I22. Patch tasteTag API / docs mismatch [codex].
       P1. Founder call: remove now, ignore silently, or preserve as
       legacy-compatible debt.

  I23. Add Uprise persistence note to onboarding / comm-scenes brief
       [upriseauditor].
       P2. Brief warning that Uprise is semantic; runtime = Community +
       Signal.

  I24. Add Uprise model if founder decides [upriseauditor].
       Long-term. Wait for founder call (FD6) before any work.

================================================================
8. MERGED EXECUTIVE SUMMARY (one paragraph)
================================================================

Both Hermes (`upriseauditor`) and `codex` converge on every major current
platform truth (community identity, invariant architecture, Plot tabs,
three-surface source separation, GPS-votes-only, pioneer fallback, deferred
business runtime). They diverge in three ways: (a) Codex names
`AGENTS.md` vs `CONTEXT_ROUTER.md` conflict as the #1 risk; upriseauditor
treats them as complementary; (b) codex more precisely identifies
runtime-vs-doc contradictions (pioneer inactive Community creation, Plot
calendar wording, Print Shop placement, tasteTag API field, Hermes branch
defaults); (c) upriseauditor enumerates more canon-internal drift items
(Narrative §3.2 actions, §6.3 Plot surfaces, §1.4 power-flow, Legacy
line 114, working-vs-final canon status, project vs cause term). The two
strategies are compatible: Codex's Tier 0/1/2/3 is the umbrella; the
upriseauditor phase index, lint extensions, and v2 folder reorg are
concrete deliverables inside Tier 1. Both lanes propose 12 fixes each;
their sets overlap ~70%. The 24-item merged fix list (I1-I24) is the
final action set. Five founder decisions remain open (default read path,
missing-community threshold, tasteTag disposition, calendar timing, Print
Shop IA wording) plus three long-term architecture calls (Uprise model,
cause-vs-project migration, Discovery Pass pricing).

================================================================
9. NO-EDIT CONFIRMATION
================================================================

No files were modified during this comparison. This handoff file is the
only file created during this turn. The two source audit files
(`2026-06-24_documentation-authority-audit-upriseauditor.md` and
`2026-06-24_documentation-authority-audit-codex.md`) remain untracked on
disk, available for the founder and the next agent to pull.

================================================================
END OF RECONCILIATION
================================================================