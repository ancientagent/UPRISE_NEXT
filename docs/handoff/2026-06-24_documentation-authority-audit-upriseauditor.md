# 2026-06-24 — Documentation Authority Audit (upriseauditor lane)

Date: 2026-06-24
Branch: `docs/abacus-fusion-swarm-strategy`
Mode: read-only audit. No edits. No stages. No commits. No pushes. No migrations, seeds, deploys, provider CLIs, or DB writes.
Author lane: upriseauditor (parallel to codex lane audits).
Companion lanes (per founder direction):
  - Canon / specs lane
  - Agent briefs / solutions / handoffs lane
  - Runtime / test cross-check lane
  - Documentation strategy lane

## Status

This file is the upriseauditor lane's full audit deliverable for the parallel codex
agent to pull. It is intentionally one self-contained markdown file so the codex
agent does not need to walk back through the full chat transcript.

It is not a handoff that requires follow-up implementation. It is a
recommendation pack. Each Immediate Fix in §5 is sized to be a single PR.

## Environment baseline

  pwd                            /home/baris/UPRISE_NEXT
  git branch --show-current      docs/abacus-fusion-swarm-strategy
  git rev-parse --short HEAD     27898c5
  git status --short             only pre-existing untracked art/ files; no tracked-file drift

## Purpose of this audit

The founder reported that the app is not being understood well enough by
agents. The documentation system may be too scattered, stale, or
phase-mismatched. The audit identifies inconsistencies, stale docs, current
truths, and a better documentation strategy for agents learning/building the
app.

Authority order used (per AGENTS.md + docs/AGENT_STRATEGY_AND_HANDOFF.md):
  1. AGENTS.md
  2. docs/canon/**
  3. active docs/specs/**
  4. active docs/agent-briefs/**
  5. active docs/solutions/**
  6. current runtime code/tests only when needed to verify doc truth
  7. docs/handoff/**
  8. legacy docs / prior exports

The audit is organized in the six lanes the founder requested.

================================================================
1. EXECUTIVE SUMMARY
================================================================

Top 5 documentation risks

  R1. Three-layer canon / spec / brief drift with no single getting-started doc.
      AGENTS.md forces reading 6+ docs in order before any lane work, but a new
      agent has no single "what is UPRISE in 5 minutes" entry. Every founder
      correction lives in a different doc (harness lock, brief, handoff), so an
      agent that picks the wrong starting point can still be wrong about canon.

  R2. "Power flows downward only" appears in Master Narrative Canon §1.4
      (docs/canon/Master Narrative Canon.md:51) but contradicts the hierarchy
      defined immediately above it (Scene > Uprise > Community > Plot > RaDIYo).
      The Narrative Canon itself says "power flows downward only" while the
      Glossary treats Uprise as the bridge between structure and content.
      Confusing on first read.

  R3. `project` vs `cause` terminology debt is now wired into runtime contracts.
        - Runtime: `apps/api/src/registrar/*` persists `type = "project_registration"`.
        - Founder lock: `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
          lines 273-336 say `cause` is the product term going forward.
      Matrix §17.4 + §18.2 explicitly flag this as item 2 on the reconciliation
      order, but no rename has been done. An agent reading either side without
      the other will produce inconsistent UI copy.

  R4. `Uprise` does not exist as a Prisma model.
        - Canonical canon treats Uprise as a dual-state object
          (broadcast station + signal).
        - Runtime uses `Community` (with `tier`) as the Uprise container and
          `Signal` rows as the carried signal. No dedicated `Uprise` model.
          comm-scenes spec §"Deferred Behavior" admits this is deferred.
      An agent looking for `Uprise` in the schema will not find it; nothing in
      the agent briefs warns them explicitly.

  R5. Old legacy canon (docs/canon/Legacy Narrative plus Context .md) still
      contains stale current-MVP tab language ("Promotions", "Statistics",
      "Social" as Plot tabs at lines 122-143), still names "Action Wheel:
      Upvote, Add, Blast, Skip, Report" at line 114, and still calls Sects
      "taste tags". Even after the 2026-06-24 canon annotation (handoff
      2026-06-24_plot-tab-canon-annotations.md), the override note is one
      paragraph at the top of a 1037-line file — easy to miss when an agent
      scans a section in isolation.

Top 5 current platform truths (verified against runtime + active docs)

  T1. Every community is `city + state + music community`. Launch matrix is
      6 cities × 8 communities = 48 active city-tier scenes
      (docs/specs/seed/launch-community-city-matrix.json,
      apps/api/src/onboarding/onboarding.service.ts, schema.prisma:106-140).

  T2. Community architecture is invariant: city/music-community identity only
      changes scene data, membership, content, activity, and later Prime-model
      structures — never screens, menus, tabs, actions, player behavior, or
      routing. (launch-community-city-matrix.json:5, ONBOARDING_HOME_SCENE.md:72,
      brief Canon Anchors cross-check.)

  T3. Current MVP Plot tabs are `Feed`, `Events`, `Archive`. No Statistics
      tab, no Promotions tab, Social is V2/hidden.
      (verified: apps/web/src/app/plot/page.tsx:48
      `const tabs = ['Feed', 'Events', 'Archive'] as const`;
      MVP_HOME_PLOT_FEED_COMPOSITION_LOCK_R1.md; plot-and-scene-plot.md;
      canon annotations 2026-06-24.)

  T4. `RADIYO` wheel = `Report, Skip, Play It Loud, Collect, Upvote`.
      `SPACE` (personal-player stand-in) wheel = `Back, Pause, Blast,
      Recommend, Next`. Artist Profile is no-wheel, no-Blast.
      (MVP_ACTION_SYSTEM_MATRIX_R1.md §10.1; locked by tests
      apps/web/__tests__/engagement-wheel-contract.test.ts per handoff
      2026-06-24_radiyo-space-action-contract.md.)

  T5. Listener profile, public Artist Profile, and Source Dashboard are three
      distinct surfaces. Source Dashboard is the monorepo stand-in for the
      future separate source/admin web domain. Registrar is listener-owned;
      Print Shop and Release Deck are source-facing.
      (2026-04-26_listener-profile-source-management-separation.md;
      MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md;
      ARTIST_PROFILE_SOURCE_DASHBOARD.md; UI_CURRENT.md.)

Is the current doc set sufficient for a new agent?
  Marginal. A new agent that follows AGENTS.md verbatim will read 6 docs
  before touching any product lane. AGENT_STRATEGY_AND_HANDOFF.md and
  CONTEXT_ROUTER.md reduce repeated reading, but a true getting-started
  orientation doc is missing. The agent-brief system is good for routing once
  a lane is chosen but not for orientation. The founder's "app not being
  understood" complaint is structural: there is no single document that says
  "here is UPRISE in 5 minutes + here's exactly which 4 docs to read next for
  any task".

================================================================
2. LANE FINDINGS
================================================================

----------------------------------------------------------------------
LANE 1 — Canon / Platform Truth
----------------------------------------------------------------------

Scope: docs/canon/**, docs/README.md, docs/specs/README.md.

Current truths (verified, dominant in current docs + runtime):
  - Scene is geographic container (City/State/National). Only City has civic
    infrastructure. (canon/Master Narrative Canon.md §1.1,
    Master Glossary Canon.md §2.)
  - Uprise is dual-state: broadcast station + Signal. (Master Narrative
    Canon.md §1.2, Master Glossary Canon.md §1.)
  - Community = people in a Scene; Music Community = people + practice; both
    are not interchangeable with Scene. (Master Glossary Canon.md.)
  - Home Scene = city+state+music community; civic anchor for voting, civic
    actions, registrar filings. (Master Narrative Canon.md §1.3.)
  - Plot = Home Scene dashboard inside Home, not a peer route. Current tabs =
    Feed, Events, Archive. (Master Narrative Canon.md §6.3 with 2026-06-24
    runtime override; Master Glossary Canon.md The Plot entry;
    docs/canon/Legacy Narrative plus Context .md top-of-file override.)
  - Two-Pool Fair Play (New Releases / Main Rotation) is locked. (Master
    Narrative Canon.md §4, Master Glossary Canon.md §4,
    How Uprise Works — Canon Audit (working).md.)
  - GPS gates voting only, not general participation. (Master Glossary
    Canon.md Locally Affiliated entry; USER-ONBOARDING spec;
    ONBOARDING_HOME_SCENE brief.)
  - Pioneer fallback preserves submitted city/state as intent, routes to
    nearest active community for the same parent music community, shows
    pioneer notification in profile-strip icon. (USER-ONBOARDING spec,
    ONBOARDING_HOME_SCENE brief, 2026-06-19_distance-based-pioneer-fallback.md.)
  - Sects/Uprises are sub-community motion outcomes via Prime model, not
    launch seed variants. (USER-ONBOARDING; ONBOARDING_HOME_SCENE.)

Inconsistencies (canon-internal or canon-vs-recent-locks):
  - Conflict 1: "Power flows downward only" in Master Narrative Canon.md §1.4
    contradicts the Scene > Uprise > Community > Plot > RaDIYo hierarchy
    stated in the same paragraph. The Glossary is consistent with the
    hierarchy but the Narrative is not. Recommend clarifying or removing that
    sentence in favor of the Glossary's "dual-state" framing.
  - Conflict 2: Master Narrative Canon.md §6.3 lists Plot surfaces as
    "Activity Feed (S.E.E.D Feed) / Events / Promotions / Statistics, Scene
    Map / Social (V2)". The 2026-06-24 canon annotation block adds the
    runtime override, but the original section body is preserved verbatim.
    An agent that skims §6.3 and stops at the first table will still see the
    four-tab story. The override is one paragraph above the table; easy to
    miss.
  - Conflict 3: Master Narrative Canon.md §3.2 still names the four universal
    actions as `ADD, FOLLOW, BLAST, SUPPORT`. Master Glossary Canon.md already
    aligns with `Collect` over `ADD` and removes `SUPPORT` from the live
    action vocabulary. The Narrative Canon predates the Action Matrix lock
    (2026-04-14). Recommend a single-pass reconciliation in the Narrative
    Canon §3.2 to use Collect/Blast/Skip and to mark Support as derived state.
  - Conflict 4: Legacy Narrative plus Context .md line 114 still names
    "Action Wheel: Upvote, Add, Blast, Skip, Report". This contradicts
    MVP_ACTION_SYSTEM_MATRIX_R1.md §10.1 which excludes Blast from RADIYO
    wheel. The 2026-06-24 top-of-file annotation is one paragraph; the body
    still says Blast is on the wheel.
  - Conflict 5: Legacy Narrative plus Context .md §1.5 still describes early
    adopters as "Pioneers" who get "large activity point bonuses" and a
    Pioneer recruitment tool. The current implementation has a thinner
    pioneer notification (profile-strip icon, no recruitment tooling or
    activity-point bonuses). Treat the Legacy Pioneer framing as doctrine
    direction, not current implementation.
  - Conflict 6: Master Identity and Philosohpy Canon.md §6.2 lists "No
    'featured' or 'staff picks' or 'editor's choice'" as architectural
    enforcement. The MVP_ACTION_SYSTEM_MATRIX_R1.md introduces the `Rock`
    action on collected displayable artifacts (matrix §8 row 6). The two are
    not contradictory at a literal level (Rock is user-driven not
    staff-driven) but a careless reader could misread "no editorial curation"
    as forbidding artifact display styling. Recommend a one-line
    clarification that Rock is user-display, not platform-display.

Stale canon language that could mislead agents:
  - "Parent Genre / Child Genre" still appears as legacy in Master Glossary
    Canon.md Audit Notes.
  - "S.E.E.D stands for Support, Explore, Engage, Distribute" — fine canon,
    but live code path uses `SeedFeedPanel.tsx` and brief
    `ACTIONS_AND_SIGNALS.md` never explains the S.E.E.D acronym explicitly.
  - Canon references "+UPRISE Signal System & Print Shop Specification.md"
    (canon/Master Revenue Strategy Canonon.md line 44) but that file does
    not exist in docs/canon. The Print Shop spec is at
    docs/specs/economy/print-shop-and-promotions.md. Dangling reference.
  - Canon file `How Uprise Works — Canon Audit (working).md` is marked
    "working" but is not annotated as working-only in CONTEXT_ROUTER.md's
    current canon list. New agents may treat it as final.

Recommended canon handling:
  - Keep: Master Narrative, Master Glossary, Master Identity & Philosophy,
    Master Application Surfaces & Capabilities & Lifecycle,
    UPRISE_VOICE_MESSAGING_CANONICAL, Master Revenue Strategy.
  - Annotate (status header + runtime override note only): Legacy Narrative
    plus Context .md (already annotated for tabs; needs annotation for
    RADIYO wheel + Pioneer framing + Sects-as-taste-tags).
  - Reconcile (single-pass surgical edit, not bulk overwrite, per AGENTS.md
    canon-import rule):
      - Master Narrative Canon.md §3.2 actions list;
      - Master Narrative Canon.md §1.4 power-flow direction statement;
      - Master Narrative Canon.md §6.3 Plot surfaces table to mark
        Promotions/Statistics/Social as deferred.
  - Move toward `docs/legacy/canon/` after reconciliation: only the Legacy
    Narrative should migrate; canon folder should remain the active semantic
    layer.
  - Working file: rename `How Uprise Works — Canon Audit (working).md` to
    `..._WORKING.md` suffix and add to CONTEXT_ROUTER.md "do not load as
    final" note.

----------------------------------------------------------------------
LANE 2 — Active Specs
----------------------------------------------------------------------

Scope: docs/specs/**.

Current active truths (across docs/specs + runtime):
  - Onboarding resolves Home Scene tuple → nearest active fallback →
    preserves pioneer intent. (users/onboarding-home-scene-resolution.md;
    runtime onboarding.service.ts.)
  - Communities spec treats Scene as container and Sect as artist-driven
    motion; realization requires threshold.
    (communities/scenes-uprises-sects.md §"Implemented Behavior" — currently
    threshold validation is deferred.)
  - Plot spec: tabs Feed/Events/Archive; Archive renders read-only Top Songs
    + Scene Activity Snapshot; Promotions is not a current MVP tab.
    (communities/plot-and-scene-plot.md §"Implemented Behavior";
    apps/web/src/app/plot/page.tsx.)
  - Statistics spec is marked "active design backlog; not current MVP Plot
    tab". (communities/statistics-page-design-task-list.md line 4.)
  - Identity/roles spec defines base User + linked ArtistBand entity +
    additive capability grants. (users/identity-roles-capabilities.md.)
  - Registrar spec is listener-owned civic/formalization; Artist/Band +
    Promoter + Project + Sect-Motion submission primitives are implemented.
    (system/registrar.md.)
  - Fair Play two-pool spec, weighted recurrence, 48-hour recompute,
    14-day rolling window, 60-min repeat cap.
    (broadcast/radiyo-and-fair-play.md.)
  - Signals and Universal Actions spec: Collect replaces ADD in public verb,
    Blast belongs to personal player, Recommend requires holding, Support is
    derived state. (core/signals-and-universal-actions.md.)
  - Revenue spec is doctrine; current MVP has no billing, no Discovery Pass
    purchase, no ad purchase, no promo runtime.
    (economy/revenue-and-pricing.md.)
  - Events spec: events are scene-bound, source-facing creation through
    Print Shop, listener-facing read-only on Plot.
    (events/events-and-flyers.md.)
  - Scene Map spec: descriptive only; current Plot Archive body is Top Songs
    + Scene Activity Snapshot, not interactive StatisticsPanel.
    (communities/scene-map-and-metrics.md.)
  - Seed launch matrix: 6 cities × 8 music communities = 48 active city-tier
    scenes; 50km geofence per launch city inherited by all 8 community
    scenes. (seed/launch-community-city-matrix.json;
    seed/music-communities.json.)

Inconsistencies between specs:
  - Spec 1: `system/registrar.md:58` persists `type = "project_registration"`
    and runs as implemented. Spec 2:
    `MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md:273-336` says the canonical
    product term is `cause` and projects is terminology debt to reconcile.
    Spec 3: `MVP_ACTION_SYSTEM_MATRIX_R1.md §17.4` flags this as item 2 on
    the reconciliation order. Conflict is acknowledged but unresolved.
  - Spec 1: `core/signals-and-universal-actions.md` still lists `ADD` as the
    live action type in SignalAction rows (line 36, "live signal action
    rows still use ADD"). Spec 2: `MVP_ACTION_SYSTEM_MATRIX_R1.md §6.5 / §8
    / §10.1` says the public verb is Collect and ADD is name debt. Same
    debt, different terminology. Status: spec-confirmed debt.
  - Spec 1: `core/signals-and-universal-actions.md` line 51 lists blastable
    signals as "single, Uprise". Spec 2:
    `MVP_ACTION_SYSTEM_MATRIX_R1.md §10` says the RADIYO wheel excludes
    Blast, but Blast in personal player still applies to singles and
    Uprises. The Matrix is the controlling lock per its own precedence note
    §2; signals spec is partially superseded.
  - Spec 1: `communities/discovery-scene-switching.md` says community-native
    lookup should live on a `community` page. Spec 2:
    `SURFACE_CONTRACT_HOME_R1.md §"Current Relationship To Other Surfaces"`
    says "Community is entered explicitly through community links/visit
    flows, not as a bottom-nav peer". Two consistent statements but no spec
    defines the canonical `community` page in MVP.
  - Spec 1: `communities/scenes-uprises-sects.md` §"Implemented Behavior"
    says "If the city-tier community does not exist, the system creates it
    as inactive (`isActive=false`) and marks the user as pioneer". Spec 2:
    `users/onboarding-home-scene-resolution.md` "Implemented Resolution
    Logic" says find existing; if not found or not active, mark pioneer and
    resolve nearest active. These are functionally equivalent but the
    wording differs. Recommend a single canonical phrasing.
  - Spec 1: `core/terminology-and-taxonomy.md` says `Observer` is
    deprecated. Spec 2: Master Glossary Canon.md Visitor entry says
    "Observer is deprecated and must not appear". Consistent, but no
    `docs:lint` rule enforces `Observer` prohibition (only People Are Saying
    / Promotions-Statistics / Blast-on-wheel / Follow-Add-Support patterns
    per scripts/docs-lint.mjs:81-110).
  - Spec 1: `users/identity-roles-capabilities.md §"Founder Lock
    (2026-04-10)"` says business accounts are deferred. Spec 2:
    `BUSINESS_MONETIZATION_BOUNDARY_R1.md` is the boundary packet.
    Consistent but the spec is 8+ months older than the boundary packet;
    the spec should defer to the boundary packet explicitly or link it.
  - Spec 1: `users/identity-roles-capabilities.md` describes `hasArtistBand`
    as a transitional bridge derived from canonical membership graph. Spec
    2: action matrix §17.1 calls this out as drift. Status: reconciliation
    in flight per slice 33.

Missing or under-specified specs for current runtime:
  - No active spec covers Prime model mechanics (referenced in
    launch-community-city-matrix.json:5, ONBOARDING_HOME_SCENE.md:73,
    USER-ONBOARDING spec, USER-IDENTITY spec). Every reference defers to
    "later". A spec skeleton would help; even just
    `docs/specs/future/prime-model.md` as a placeholder.
  - No active spec covers `SPACE` as a personal-player web stand-in. Matrix
    §10.1 names it; UI_CURRENT.md mentions it; nothing defines its screen
    boundaries.
  - No active spec defines what `Featured / Staff picks / Editor's choice`
    enforcement looks like in code (Identity & Philosophy Canon §6.2 /
    §7.4). Mostly enforced by absence.
  - `economy/print-shop-and-promotions.md` was referenced in
    MVP_ACTION_SYSTEM_MATRIX_R1.md but is not in this audit's read queue.
    Recommend cross-checking that it aligns with
    BUSINESS_MONETIZATION_BOUNDARY_R1.md.
  - `social/message-boards-groups-blast.md` and `v2/*.md` specs are
    V2-locked but no spec says "no current MVP runtime for these". They
    rely on MVP_EXPLICIT_DEFERRED_LIST_R1.md cross-reference rather than
    being explicit.

Specs that should become phase-specific:
  - All `docs/specs/v2/*.md` (search-parties, listening-rooms,
    mixologist-and-mixes, ambassador-system) are explicit V2 but currently
    sit alongside current specs in the same folder. Recommend
    `docs/specs/_v2/` or `docs/specs/future/` prefix so `Find ... docs/specs`
    does not surface them by default.
  - `docs/specs/admin/super-admin-controls.md` is current-MVP for the
    read-only /admin route (verified implemented) but most of the spec is
    deferred (RBAC, audit log, moderation queue, pricing config). The doc
    reads as if all of it were active. Recommend a single-pass split:
    implemented-now section retained, deferred section explicitly marked.
  - `docs/specs/discovery/vibe-check-and-taste-profiles.md` — recommend a
    current-MVP-truth header.

Product decisions still needed (not locked):
  - Pricing finalization for Discovery Pass / Play Pass / promotional slots
    (DECISIONS_REQUIRED.md §5).
  - Propagation threshold formulas (DECISIONS_REQUIRED.md §1-2).
  - Activity Points scoring table (DECISIONS_REQUIRED.md §3).
  - Privacy floor for geo aggregation (DECISIONS_REQUIRED.md §7).
  - Sect Uprise activation motion schema (registrar.md §Future Work;
    identity-roles-capabilities.md §Future Work).
  - The "Three slots or four" exact source profile wording: Matrix says 3 +
    4th ad slot, source lock says same. These are aligned but the canonical
    "release deck has 3 + 1" wording varies across docs.

----------------------------------------------------------------------
LANE 3 — Agent Briefs / Context Router
----------------------------------------------------------------------

Scope: docs/agent-briefs/**.

Correct routing that already works:
  - CONTEXT_ROUTER.md has clear lane definitions
    (UX_UI, ACTIONS_SIGNALS, ARTIST_SOURCE, EVENTS_ARCHIVE,
    BUSINESS_MONETIZATION, ONBOARDING_HOME_SCENE, REGISTRAR_GOVERNANCE,
    EXTERNAL_TOOLS, INFRA_RUNTIME_QA) with explicit default +
    companion-load rules.
  - ONBOARDING_HOME_SCENE.md, ARTIST_PROFILE_SOURCE_DASHBOARD.md,
    ACTIONS_AND_SIGNALS.md, EVENTS_ARCHIVE.md, BUSINESS_MONETIZATION.md,
    REGISTRAR_GOVERNANCE.md, EXTERNAL_TOOLS.md, UI_CURRENT.md are all dated
    within the last ~60 days and align with current locks.
  - Companion Brief Decision Table in CONTEXT_ROUTER.md maps surface →
    brief cleanly.

Misleading routing or wording:
  - CONTEXT_ROUTER.md "Current canon set" (lines 35-46) lists 9 canon docs.
    `How Uprise Works — Canon Audit (working).md` is one of them without a
    "working only" warning. An agent that loads it as final canon will read
    its engagement score audit table (3/2/1/0 verbatim) which is partially
    superseded by MVP_ACTION_SYSTEM_MATRIX_R1.md and BROADCAST-FP spec.
  - `agent-briefs/UPRISE_UI_UX_FOCUS_PACKET_R1.md` and
    `agent-briefs/UPRISE_DESIGN_HANDOFF_SCREEN_PACKAGE_R1.md` and
    `agent-briefs/UPRISE_HERMES_*` are listed in agent-briefs/README.md
    but not in CONTEXT_ROUTER.md lane list. Their role is unclear; some
    may be stale.
  - `agent-briefs/EXTERNAL_TOOLS.md` references `.devin/wiki.json` and
    `.deepagent-desktop/rules/uprise_next_rules.md`. These are external
    tool files, not repo docs; if they drift, an agent may rely on stale
    guidance. Recommend a single in-repo pointer + a generation note.

Missing briefs:
  - No brief for `Prime model` future scope. Even a stub pointing to "Prime
    model is future scope, see [references]" would help agents avoid being
    confused when every docs/seed/ONBOARDING file mentions Prime.
  - No brief for backend data-model primer. A new agent looking at
    schema.prisma has no narrative doc to interpret `Community` vs `Uprise`
    vs `Track`.
  - No brief for `Defer-list / V2 future-domain`. Agents reading
    MVP_EXPLICIT_DEFERRED_LIST_R1.md have to internalize what is active vs
    not. A `docs/agent-briefs/WHATS_DEFERRED.md` would consolidate.
  - No brief for the source-vs-listener profile separation that is the
    most common confusion in this audit (3 distinct surfaces: listener
    profile / Artist Profile / Source Dashboard). This is covered in three
    different docs (listener-profile-source-management-separation handoff;
    ARTIST_PROFILE_SOURCE_DASHBOARD brief; USER-IDENTITY spec) but no
    single entry doc.

Briefs needing stronger "current truth" sections:
  - UI_CURRENT.md is good but its "Home / Plot Top-To-Bottom Composition"
    duplicates SURFACE_CONTRACT_HOME_R1.md and
    MVP_HOME_PLOT_FEED_COMPOSITION_LOCK_R1.md verbatim. Recommend the
    brief cross-link rather than restate, so the canonical lock wins on
    next update.
  - ONBOARDING_HOME_SCENE.md §"Current Truth" duplicates
    onboarding-home-scene-resolution.md §"Implemented Resolution Logic".
    Recommend a summary block + pointer.
  - BUSINESS_MONETIZATION.md is short and good, but its "Current Runtime
    Pointers" line "/communities/:id/promotions may remain as
    retained/deferred runtime surface" can be misread. Recommend a
    one-line "this is not a current active tab" callout before the
    pointer.

Is a new START_HERE doc needed?
  Yes. A new `docs/agent-briefs/PLATFORM_START_HERE.md` (or
  `docs/START_HERE.md`) is needed. Even a 1-2 page orientation doc that
  says "here is UPRISE in 5 minutes, here are 5 truths that contradict
  common assumptions, here is the exact read order for any lane" would
  reduce agent confusion and address the founder's stated concern.

----------------------------------------------------------------------
LANE 4 — Solutions / Handoffs / Historical Drift
----------------------------------------------------------------------

Scope: docs/solutions/**, docs/handoff/README.md, latest relevant
docs/handoff/2026-*.md, docs/legacy/** only as needed.

Active solution docs that are still useful (keep as active):
  - SURFACE_CONTRACT_HOME_R1, SURFACE_CONTRACT_PLOT_R1,
    SURFACE_CONTRACT_DISCOVER_R1, SURFACE_CONTRACT_COMMUNITY_R1 — locked
    per-surface contracts referenced by every brief.
  - MVP_HOME_PLOT_FEED_COMPOSITION_LOCK_R1 — current Plot composition.
  - MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1 — current Artist Profile.
  - MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1 — current
    source/feed/profile; intentional transitional framing.
  - MVP_ACTION_SYSTEM_MATRIX_R1 — current action grammar. Highest
    authority short of canon for actions.
  - MVP_DISCOVER_FOUNDER_LOCK_R1 — Discover deferral.
  - MVP_STATS_FOUNDER_LOCK_R1 — statistics framing.
  - BUSINESS_MONETIZATION_BOUNDARY_R1 — current commercial boundary.
  - MVP_EXPLICIT_DEFERRED_LIST_R1 — current deferral list.
  - MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1 — Source Dashboard truth.
  - FIRST_STAGING_TARGET_VERCEL_FLY_NEON_R1 — staging boundary.
  - DEPLOY_TARGET_READINESS_R1 — deploy readiness.
  - ABACUS_FUSION_AGENT_SWARM_STRATEGY_R1 — current external agent
    strategy.
  - EXTERNAL_AGENT_HARDENING_R1 / EXTERNAL_ASSISTANT_REPO_BRIEF_R1 —
    external agent guardrails.
  - SESSION_STANDING_DIRECTIVES, PHASE_STOP_GATE_PLAYBOOK,
    ROLLBACK_CHECKPOINT_CHEATSHEET — operational guardrails.
  - AGENT_WIKI_STEERING_R1, REPO_AUTHORITY_MAP_R1 — generated-wiki
    steering.

Historical docs being treated like current truth (mark as historical):
  - docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md (UI_CURRENT.md already
    flags historical).
  - docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md (UI_CURRENT.md
    already flags historical).
  - docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md (UI_CURRENT.md
    already flags legacy).
  - docs/solutions/MVP_SIGNAL_SYSTEM_CONTRACT_R1.md (action matrix
    §17.1 explicitly says transitional).
  - docs/solutions/MVP_FIGMA_AGENT_PROMPTS_R1.md /
    MVP_UIZARD_PROMPT_PACK_R1.md / R2_STRICT.md — likely historical; not
    in any brief's default load.
  - docs/solutions/MVP_UX_BATCH16_DRIFT_WATCHLIST.md,
    MVP_UX_BATCH16_EXECUTION_PLAN.md, MVP_UX_BATCH27_EXECUTION_PLAN.md —
    execution plans, retain as carry-forward but not as current truth.
  - docs/solutions/MVP_PLOT_UX_QA_REPORT_R1.md — QA report, dated.
  - docs/solutions/MVP_HARD_ROADMAP_EXECUTION_PLAN.md,
    MVP_PHASE1_PHASE2_ACTION_BOARD_R1.md,
    MVP_CURRENT_EXECUTION_ROADMAP_R1.md,
    MVP_R2_UX_PHASE_CLOSEOUT_READINESS_R1.md — execution planning docs;
    risk of being read as spec.

Duplicate or conflicting locks:
  - None of the active locks directly contradict each other in their
    current state, but each lock overlaps in scope with at least one
    other lock. The PRECEDENCE notes inside each lock make the hierarchy
    clear; an agent that doesn't read the precedence note will not know
    that MVP_ACTION_SYSTEM_MATRIX_R1 outranks
    docs/specs/core/signals-and-universal-actions.md. Recommend each
    lock's "Authority And Precedence" section be referenced from the brief
    for that lane.
  - The `docs/solutions/UPRISE_AUTOHARNESS_R1.md` doc and the
    `agent-briefs/UPRISE_HERMES_AUDITOR_AGENT.md` /
    `UPRISE_HERMES_LAUNCH_REVIEWER.md` exist as separate prompt-harness
    definitions. These do not conflict but their roles partially overlap;
    their authority chain should be made explicit.

Places where future agents might read too much:
  - docs/canon/Legacy Narrative plus Context .md — long, full of
    plausible-but-stale current-MVP language.
  - docs/legacy/uprise_mob/ and docs/legacy/uprise_mob_code/ — explicitly
    non-canon but heavily detailed; agents may load them if the search
    tool surfaces matches.
  - docs/Specifications/ — references to legacy canonical IDs that no
    longer exist in the folder. README points to files that aren't there.
  - docs/handoff/2026-02-22_plot_promotions_surface_wiring.md — references
    Signal types PROMOTION/OFFER that aren't in MVP_ACTION_SYSTEM_MATRIX_R1
    or signals spec.

Current high-risk stale terms (run a docs:lint pass to confirm):
  - "Add" (action verb) outside event-calendar context — Matrix says this
    is name debt.
  - "Support" (action verb) — Matrix says derived state only.
  - "Promotions" / "Statistics" as Plot tab labels — already covered by
    docs-lint.mjs:84.
  - "Action Wheel: Upvote, Add, Blast, Skip, Report" — still in
    canon/Legacy Narrative plus Context .md:114.
  - "Follow / Add / Support" pattern — already covered by docs-lint.
  - "Blast" on RADIYO wheel — already covered.
  - "Genre Selection" — referenced in onboarding/terminology as forbidden
    but no lint rule.
  - "Observer" — glossary says deprecated, no lint rule.
  - "project_registration" — runtime term vs founder-locked "cause" term.

----------------------------------------------------------------------
LANE 5 — Runtime / Test Cross-Check
----------------------------------------------------------------------

Scope: only used code/tests to verify documentation claims. No full code
audit.

Docs that match runtime:
  - Onboarding/Home Scene resolution:
    docs/specs/users/onboarding-home-scene-resolution.md aligns with
    apps/api/src/onboarding/onboarding.service.ts and
    apps/web/src/store/onboarding.ts. GPS recheck logic, pioneer fallback,
    manual-first location authority all match.
  - Launch matrix 6 × 8 = 48: docs/specs/seed/launch-community-city-matrix.json
    matches seed/music-communities.json, matches 48-tuple seed verifier in
    seed/README.md.
  - Plot tab labels: apps/web/src/app/plot/page.tsx:48
    `const tabs = ['Feed', 'Events', 'Archive']` matches
    plot-and-scene-plot.md and
    MVP_HOME_PLOT_FEED_COMPOSITION_LOCK_R1.md.
  - Identity/ArtistBand migration: apps/api/prisma/schema.prisma:64-104 has
    ArtistBand + ArtistBandMember + registrar linkages matching
    identity-roles-capabilities.md; User.isArtist has been dropped
    (slice 33).
  - Web-tier boundary: apps/web/src/lib/web-tier-guard.ts and
    scripts/infra-policy-check.ts match RUNBOOK.md + PROJECT_STRUCTURE.md.
  - Action wheel contract: tests
    apps/web/__tests__/engagement-wheel-contract.test.ts (referenced in
    2026-06-24_radiyo-space-action-contract.md) lock RADIYO/SPACE split.

Docs that contradict runtime:
  - Doc: docs/specs/admin/super-admin-controls.md says
    GET /admin/config/fair-play and POST /admin/config/fair-play exist
    with `JwtAuthGuard`. Runtime: needs to be verified (not in scope of
    this audit). The spec claims these exist and the broader RBAC
    enforcement is deferred.
  - Doc: docs/specs/communities/scenes-uprises-sects.md §"Implemented
    Behavior" says unknown city/community creates inactive pioneer Scene
    and auto-joins user. Runtime + USER-ONBOARDING spec says find existing;
    if not found or not active, mark pioneer and resolve nearest active.
    These are compatible in behavior but the wording in scenes-uprises-sects
    can mislead an agent to think a brand new Community row is created,
    which the runtime does not do in the city-inactive case.
  - Doc: docs/specs/broadcast/radiyo-and-fair-play.md says engagement
    recompute cadence is 48 hours, rolling window 14 days, Main Rotation
    max repeat 60 minutes. Runtime not verified in this audit (out of
    scope).
  - Doc: docs/specs/communities/discovery-scene-switching.md says
    community-native lookup should live on a `community` page. Runtime
    has /community/[id] but its content
    (apps/web/src/app/community/[id]/page.tsx) is not deeply audited here;
    the spec asserts a contract that may not have a strict current-MVP
    enforcement.
  - Doc: docs/specs/core/signals-and-universal-actions.md §"Implemented
    Now" lists POST /signals/:id/blast as an implemented endpoint.
    Runtime existence not verified. If implemented, it must align with
    MVP_ACTION_SYSTEM_MATRIX_R1.md (Blast belongs to personal player only,
    never to RADIYO). Action matrix is the controlling lock per its own
    precedence rule.
  - Doc: docs/specs/system/registrar.md §"Implemented Now" lists dozens of
    slices (1-7, 10-14, 22, 26, 33, 42-43, 64, 66-67, 70-75, 78-84, 95-99A,
    114A/B, 121-124, 152A, 270A-273A, 330A-333A, 360A-363A, 390A-393A,
    420A-423A). That number of slice IDs is implementation-traceability
    that probably belongs in a CHANGELOG/handoff rather than in a spec.
    The spec starts to read as a changelog.

Runtime gaps that docs imply should exist:
  - No `Uprise` model in Prisma (schema.prisma searched, only `Community`,
    `Track`, `Signal`). Spec `communities/scenes-uprises-sects.md` says
    "Dedicated Uprise persistence model and one-to-one Scene/Uprise
    lifecycle management" is deferred. Brief should warn explicitly:
    "Uprise is a semantic concept; runtime stores it as
    `Community.tier = city` + carried `Signal` rows; do not look for an
    `Uprise` table."
  - Spec `core/signals-and-universal-actions.md` mentions flyer as a
    confirmed signal class; `MVP_ACTION_SYSTEM_MATRIX_R1.md §6.5 / §11.2`
    says flyer is artifact, not signal. Runtime has `Signal.type` as a
    string column with no constraint enforcing "flyer" vs "single"
    semantics. This is exactly the kind of place a new agent could add
    wrong code.
  - docs/specs/admin/super-admin-controls.md mentions `AdminActionLog`,
    `FeatureFlag`, `PricingConfig` as planned. Runtime has none. An agent
    reading this spec will not know they're planned vs implemented without
    reading the "Deferred" section.
  - docs/specs/communities/discovery-scene-switching.md mentions
    `community` page as canonical place for community-native lookup.
    Runtime page exists; brief coverage in agent-briefs is sparse.
  - `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md` exists (not read in
    this audit but referenced) — recommend cross-check that its claims
    match /discover runtime placeholder state.

Test guard gaps:
  - docs-lint.mjs covers 4 stale patterns. Missing lint rules:
    "Genre Selection" copy, "Observer" terminology,
    "Power flows downward only" canon sentence, "Action Wheel: Upvote, Add,
    Blast, Skip, Report" exact pattern, project_registration vs cause
    terminology.
  - onboarding-page-lock.test.ts / onboarding-regression-lock.test.ts /
    onboarding-pioneer-follow-up.test.ts /
    plot-ux-regression-lock.test.ts /
    registrar-source-context-lock.test.ts /
    plot-statistics-request.test.ts / communities-client.test.ts — all
    referenced by briefs. Good coverage of the major slices, but no
    cross-lane test that locks the four agent-brief truths simultaneously.
  - No test referenced that locks "Plot tabs render as Feed/Events/Archive,
    never Statistics/Promotions". The plot-ux-regression-lock.test.ts is
    described as covering this but a search-confirm is recommended.
  - No test that enforces the source-account-context hardening
    (signed-in user owns the source ID, stale context cleared) at the
    brief level.

----------------------------------------------------------------------
LANE 6 — Documentation Strategy Recommendation
----------------------------------------------------------------------

Proposed read order for any new agent (replace "Always Read" in AGENTS.md
with a shorter list):

  1. `AGENTS.md` (repo root) — non-negotiables, package manager, web-tier
     boundary, rollback policy.
  2. `docs/AGENT_STRATEGY_AND_HANDOFF.md` — authority order, handoff rules.
  3. `docs/agent-briefs/PLATFORM_START_HERE.md` (NEW) — 5 truths + 4
     contradictions + 4 read paths.
  4. `docs/agent-briefs/CONTEXT_ROUTER.md` — pick lane.
  5. The lane brief.
  6. Companion briefs only if the task crosses lanes.
  7. Exact runtime/spec/lock files when editing or auditing that surface.

Proposed new docs/indexes:
  - `docs/agent-briefs/PLATFORM_START_HERE.md` (new, ~2 pages). Purpose:
    founder-corrected orientation. Contains:
      - One paragraph: UPRISE = scene-centered broadcast platform with
        listener-governed distribution.
      - The 5 truths that contradict common assumptions.
      - The 4 lanes + 4 canonical docs to know exist.
      - The 5 most common agent mistakes (treat Plot as Home, put Blast on
        RADIYO, treat source-management as part of listener profile, build
        business/billing runtime, treat launch communities as one-offs).
  - `docs/agent-briefs/SURFACES_THAT_ARE_NOT_THE_SAME.md` (new, ~1 page).
    Three-surface distinction: listener profile vs public Artist Profile
    vs Source Dashboard.
  - `docs/agent-briefs/WHATS_DEFERRED.md` (new, ~1 page). One-page summary
    of MVP_EXPLICIT_DEFERRED_LIST_R1.md +
    LATER_VERSION_DOMAIN_UNDERSTANDINGS_R1.md + business boundary.
  - `docs/PHASE_INDEX.md` (new). One-page index of phases vs lane docs:
      - Phase 1 (Launch correctness): onboarding, Home Scene resolution,
        GPS verification, launch community seed, registrar basic flows.
      - Phase 2 (UX shell): Plot shell, Feed/Events/Archive, player profile
        interaction, source dashboard shell, release deck URL-only.
      - Phase 3 (source entities): Artist/Band, Release Deck URL-only,
        Print Shop event creation, source attribution.
      - Phase 4 (events/archive/community history): read-only events,
        archive descriptive, future Archive/community information.
      - Phase 5 (hosted stack): Vercel/Fly/Neon staging, deploy matrix,
        env ownership.
      - Phase 6 (business/monetization): DEFERRED.
  - Move all `docs/specs/v2/*.md` to `docs/specs/_v2/` or
    `docs/specs/future/` (folder reorg, no content changes).
  - Rename `How Uprise Works — Canon Audit (working).md` to
    `..._WORKING.md` and add CONTEXT_ROUTER note that it is working.

Proposed phasing of what gets phased out:
  - docs/canon/Legacy Narrative plus Context .md — keep file but add status
    header marking as "historical/canon context, current MVP overrides are
    listed below". Already has 2026-06-24 top-of-file annotation; extend it.
  - docs/Specifications/ — consider freezing the README to say "legacy
    canonical IDs are retired; see docs/specs/". Remove the file
    references to non-existent 01_UPRISE_Master_Overview.md etc.
    (none of these IDs exist in the folder — only FRESH_READINESS_REPORT.md
    and README.md).
  - docs/handoff/ older than 2026-04-01 — bulk move to
    docs/handoff/_historical/ or mark each as historical inline. Currently
    every handoff is listed in handoff/README.md which makes the
    high-value set harder to find.
  - docs/solutions/MVP_UX_BATCH*_EXECUTION_PLAN.md and
    MVP_HARD_ROADMAP_EXECUTION_PLAN.md and
    MVP_PHASE1_PHASE2_ACTION_BOARD_R1.md — move to
    docs/solutions/_execution_plans/ subfolder.
  - docs/legacy/uprise_mob/ and docs/legacy/uprise_mob_code/ — already
    marked non-canon. Recommend an explicit top-of-folder warning that
    search results from these folders are NOT current.
  - docs/canon/Operational Getting Started.md and docs/canon/Expanded
    Getting Started.md — these duplicate AGENTS.md + RUNBOOK.md content.
    Risk: an agent that lands on `docs/canon/` will read Operational
    Getting Started before AGENTS.md. Recommend marking these as
    superseded and pointing to AGENTS.md.

What gets phased out later:
  - docs/specs/v2/* — keep but only surface under /future/ index.
  - docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md — once RN app work is
    settled, this loses relevance.
  - Old handoffs older than 2026-04-01 once their reconciliation is
    locked into a single doc.

================================================================
3. CROSS-LANE INCONSISTENCY TABLE
================================================================

| Topic                       | Current winning truth                          | Conflicting docs                                                                                          | Risk                                                       | Recommended fix                                                | Founder decision needed? |
|-----------------------------|------------------------------------------------|-----------------------------------------------------------------------------------------------------------|------------------------------------------------------------|----------------------------------------------------------------|--------------------------|
| Plot tab labels             | Feed / Events / Archive                         | canon/Master Narrative Canon.md §6.3 (pre-override), Legacy Narrative §2.3, plot-and-scene-plot.md older revisions, MVP_PLOT_UX_QA_REPORT_R1.md | New agent re-introduces Statistics/Promotions tabs         | Reconcile Narrative Canon §6.3 inline; tighten docs-lint pattern | no                       |
| RADIYO wheel actions        | Report/Skip/Play It Loud/Collect/Upvote         | canon/Master Narrative Canon.md §3.2 (ADD/FOLLOW/BLAST/SUPPORT), Legacy Narrative line 114, signals spec endpoint list | Wheel UI re-introduces Blast                                | Reconcile Narrative Canon §3.2; add docs-lint rule for Blast-in-wheel | no                       |
| Home Scene identity         | city + state + music community, invariant arch | MVP_HOME_PLOT_FEED_COMPOSITION_LOCK_R1 / ONBOARDING_HOME_SCENE.md consistent; Legacy Narrative Pioneer framing + Activity Point bonuses | New agent implements a one-off for one launch community    | Reinforce in PLATFORM_START_HERE; add system-scale lint          | no                       |
| Pioneer fallback            | Preserve submitted city/state, route to nearest active for same parent music community, no Pioneer recruitment tooling | Legacy Narrative §1.5 ("large activity point bonuses", Pioneer recruitment tools), some old handoffs | Agent implements Pioneer Activity Point bonuses or recruitment tool | Mark Legacy §1.5 as historical-only; spec current behavior       | no (already founder-locked) |
| Uprise persistence          | Concept lives in Community.tier + Signal rows; no Uprise model | canon says Uprise is a dual-state object; comm-scenes spec calls it deferred; runtime has no Uprise table | Agent looks for Uprise table and adds ad-hoc persistence    | Brief note: Uprise is semantic only; runtime = Community + Signal | yes (long-term)          |
| Business/billing runtime    | Deferred; doctrine only                          | canon/Master Revenue Strategy Canonon.md describes full revenue model                                     | Agent builds billing flow from spec alone                   | BUSINESS_MONETIZATION_BOUNDARY_R1 already covers; add docs-lint for "Billing" / "Subscribe" CTAs in current docs | no                       |
| Action verb: Add vs Collect | Collect for signals/artifacts, Add for events   | core/signals-and-universal-actions.md still uses ADD internally                                            | UI says "Add" instead of "Collect"                          | Already flagged in matrix §17.6; small lint addition            | no                       |
| Support button              | Derived state, not a button                      | canon/Master Narrative §3.2 still lists SUPPORT as action; old stats docs                                | Agent adds Support button                                   | Reconcile Narrative §3.2; extend docs-lint                        | no                       |
| project vs cause            | cause is canonical product term                  | runtime uses type=project_registration; registrar.md uses project                                          | Agent uses project in new user-facing copy                  | Migrate in single bounded pass or annotate registrar.md that cause is forward term | yes                     |
| Promotional slot            | 4th paid ad-attachment slot in Release Deck, not extra song | canon Revenue Strategy §"4th Release Deck Slot" vs identity spec §4.2 "3 + 4th"; some docs read "3 OR 4" | Agent models slot as alternate music slot                    | Spec-side reconciliation; brief summary                          | no                       |
| Stats/Scene Map as Plot tab | Descriptive only, no interactive StatisticsPanel | statistics-page-design-task-list.md is "active design backlog"; SceneMap spec has interactive StatisticsPanel as future Archive/community information | Agent tries to reactivate Statistics tab                    | plot-and-scene-plot.md + scene-map-and-metrics.md alignment is good; brief note | no                       |
| Genre Selection copy        | "Music Community" required                       | Glossary says deprecated; no enforcement                                                                   | Agent writes "Genre Selection" in onboarding                | Add docs-lint rule for "Genre Selection" / "genre selection"      | no                       |
| Observer term               | Deprecated; use Visitor                         | Glossary says deprecated; no enforcement                                                                   | Agent uses Observer                                          | Add docs-lint rule                                              | no                       |
| Print Shop as source-facing | Print Shop is source-facing                     | MVP_SOURCE_AND_FEED_RULES calls it out; spec/business-monetization boundary packet says it's the only source-facing event lane | Agent models listener-facing event creation in Plot          | Already covered; reinforce in WHATS_DEFERRED                     | no                       |
| Prime model                 | Future, post-launch                              | Referenced in launch-community-city-matrix, ONBOARDING_HOME_SCENE, USER-IDENTITY spec, seed comments; no spec | Agent tries to scaffold Prime model now                     | Create stub docs/specs/future/prime-model.md                     | yes (post-MVP scope)     |
| Print Shop event locality   | Print Shop event writes must attach to active city-tier Home Scene community anchor | events-and-flyers.md says require active city-tier anchor; MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT says reject inactive anchors | Agent models listener-anchored or city-defaulted events    | Already enforced at runtime; reinforce in brief                 | no                       |
| GPS semantics               | GPS verifies voting only, not general participation | USER-ONBOARDING spec, ONBOARDING_HOME_SCENE brief, glossary Locally Affiliated entry consistent          | Agent requires GPS for non-vote actions                     | Reinforce in PLATFORM_START_HERE                                 | no                       |
| Discovery Pass              | Doctrine: tiered subscription                    | canon Revenue describes $5.99/mo + bundled Premium; revenue-and-pricing spec says deferred                | Agent implements subscription                                 | Already covered by business boundary                              | no                       |
| Sect realization            | Realized Sects become source-like sub-community profiles; sect motion is artist-backing driven | MVP_SOURCE_AND_FEED_RULES §9 lock; comm-scenes spec says threshold-validation deferred; tag-era substrate still present in schema | Agent treats SectTag as sufficient to realize a sect       | Already covered in brief                                          | no                       |
| Registrability surfaces     | Registrar is listener-side; source-facing routes only bridge | registrar spec + MVP_SOURCE_AND_FEED_RULES consistent; some handoff notes may still describe source-side registrar as primary | Agent treats Registrar as a source-side tool                | Brief covers; reinforce in PLATFORM_START_HERE                    | no                       |

================================================================
4. DOCUMENTATION STRATEGY RECOMMENDATION
================================================================

What every agent reads:
  - AGENTS.md (repo root) — non-negotiables.
  - docs/AGENT_STRATEGY_AND_HANDOFF.md — authority + reading model.
  - docs/agent-briefs/PLATFORM_START_HERE.md (NEW) — orientation +
    common contradictions.
  - docs/agent-briefs/CONTEXT_ROUTER.md — pick lane.
  - The lane brief for the active focus.
  - Companion briefs only if the task crosses lanes.
  - Exact runtime/spec/lock files only when editing or auditing that
    surface.

What is phase-specific:
  - Phase 1 (Launch correctness / Home Scene / community instances):
    Required: docs/specs/users/onboarding-home-scene-resolution.md,
    docs/specs/communities/scenes-uprises-sects.md,
    docs/specs/seed/launch-community-city-matrix.json,
    docs/specs/seed/music-communities.json,
    docs/agent-briefs/ONBOARDING_HOME_SCENE.md.
    Index entry: docs/PHASE_INDEX.md (NEW).
  - Phase 2 (UX shell / Plot / player / profile):
    Required: docs/solutions/SURFACE_CONTRACT_HOME_R1.md,
    SURFACE_CONTRACT_PLOT_R1.md,
    MVP_HOME_PLOT_FEED_COMPOSITION_LOCK_R1.md,
    MVP_PLAYER_PROFILE_INTERACTION_R1.md,
    docs/specs/communities/plot-and-scene-plot.md,
    docs/agent-briefs/UI_CURRENT.md.
  - Phase 3 (source entities / Source Dashboard / Registrar):
    Required: docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md,
    MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md,
    MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md,
    docs/specs/users/identity-roles-capabilities.md,
    docs/specs/system/registrar.md,
    docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md,
    docs/agent-briefs/REGISTRAR_GOVERNANCE.md.
  - Phase 4 (events / archive / community history):
    Required: docs/specs/events/events-and-flyers.md,
    docs/specs/communities/scene-map-and-metrics.md,
    docs/agent-briefs/EVENTS_ARCHIVE.md.
  - Phase 5 (hosted stack / media / workers):
    Required: docs/RUNBOOK.md, docs/STRATEGY_CRITICAL_INFRA_NOTE.md,
    docs/DEPLOY_ENV_MATRIX_R1.md,
    docs/solutions/FIRST_STAGING_TARGET_VERCEL_FLY_NEON_R1.md,
    docs/solutions/DEPLOY_TARGET_READINESS_R1.md,
    docs/solutions/MEDIA_STORAGE_DECISION_PACKET_R1.md.
  - Phase 6 (business / monetization):
    Required: docs/solutions/BUSINESS_MONETIZATION_BOUNDARY_R1.md,
    docs/solutions/MVP_EXPLICIT_DEFERRED_LIST_R1.md,
    docs/canon/Master Revenue Strategy Canonon.md,
    docs/agent-briefs/BUSINESS_MONETIZATION.md. Defer everything in this
    phase; do not default-load unless the task explicitly reactivates it.

What is lane-specific:
  - UX_UI → UI_CURRENT.md + relevant surface contracts.
  - ACTIONS_SIGNALS → MVP_ACTION_SYSTEM_MATRIX_R1.md + signals spec.
  - ARTIST_SOURCE → MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md +
    MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md.
  - EVENTS_ARCHIVE → events spec + scene-map-and-metrics + Archive runtime
    handoff.
  - BUSINESS_MONETIZATION → BUSINESS_MONETIZATION_BOUNDARY_R1.md +
    MVP_EXPLICIT_DEFERRED_LIST_R1.md.
  - ONBOARDING_HOME_SCENE → USER-ONBOARDING spec + ONBOARDING_HOME_SCENE
    brief + seed launch matrix.
  - REGISTRAR_GOVERNANCE → registrar spec + identity-roles-capabilities +
    REGISTRAR_GOVERNANCE brief.
  - EXTERNAL_TOOLS → EXTERNAL_TOOLS brief +
    ABACUS_FUSION_AGENT_SWARM_STRATEGY_R1.md.
  - INFRA_RUNTIME_QA → RUNBOOK.md + STRATEGY_CRITICAL_INFRA_NOTE.md +
    DEPLOY_TARGET_READINESS_R1.md.

What is historical / reference-only:
  - docs/canon/Legacy Narrative plus Context .md (read only when
    reconciling historical claims).
  - docs/canon/Operational Getting Started.md and Expanded Getting
    Started.md (superseded by AGENTS.md; mark or move to legacy).
  - docs/Specifications/ (legacy canonical IDs; references to non-existent
    files).
  - docs/legacy/uprise_mob/, docs/legacy/uprise_mob_code/ (explicit
    non-canon; do not default-load).
  - docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md,
    MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md,
    MVP_SCREENSHOT_ELEMENT_SPEC_R1.md,
    MVP_SIGNAL_SYSTEM_CONTRACT_R1.md (historical refs).
  - All handoffs older than 2026-04-01 unless explicitly required.
  - docs/specs/v2/* (deferred to V2; move to docs/specs/_v2/).
  - docs/specs/discovery/vibe-check-and-taste-profiles.md (current-MVP-
    truth header needed).
  - docs/specs/admin/super-admin-controls.md (mostly deferred; split
    implemented-now vs deferred).

Should PLATFORM_START_HERE.md exist?
  Yes.

Should phase folders exist?
  Not as folders. As an index doc `docs/PHASE_INDEX.md` that points to
  existing canonical docs. Folder move is a heavier change; the index doc
  captures the same value without disrupting docs/ tooling.

What gets phased out later:
  - Operational Getting Started + Expanded Getting Started after
    PLATFORM_START_HERE is established.
  - All docs/specs/v2/* after future-specs subfolder exists.
  - Historical handoffs older than 2026-04-01 once reconciled into current
    docs.
  - docs/Specifications/ after legacy IDs are fully retired.

What is intentionally deferred:
  - Implementing billing, subscriptions, entitlements.
  - Implementing business dashboards, promo purchase, offer/coupon.
  - Implementing full Uprise model in DB.
  - Implementing causes in user-facing surface (term migration still
    required).
  - Implementing national Plot Archive tier.
  - Implementing Top 40 / billboard-style ranking.
  - Implementing predictive / leaderboard analytics.
  - Implementing Search Parties / Listening Rooms / Mixologist / Ambassador.
  - Implementing Print Shop Run purchase + flyer minting pipeline (event
    creation is in; full artifact issuance is not).

What is removed from default agent loading:
  - docs/canon/Operational Getting Started.md and Expanded Getting
    Started.md once PLATFORM_START_HERE exists.
  - All docs/specs/v2/* unless explicitly requested.
  - All docs/legacy/* files.
  - All docs/handoff/ older than 2026-04-01.
  - All docs/solutions/* that are execution plans or QA reports unless
    tied to active work.

================================================================
5. IMMEDIATE FIX LIST (12 actionable issues)
================================================================

Issue 1 — Add a single getting-started orientation doc.
  Problem: AGENTS.md forces reading 6 docs before any lane work; new agents
  don't have a 5-minute orientation.
  Files: docs/agent-briefs/PLATFORM_START_HERE.md (NEW);
  docs/agent-briefs/README.md (link); AGENTS.md (replace "Always Read"
  list).
  Acceptance criteria:
    - One paragraph orientation.
    - 5 truths that contradict common assumptions.
    - 4 read paths by lane.
    - 5 most common agent mistakes.
    - Links to CONTEXT_ROUTER.md and the 8 lane briefs.
  Priority: P0.

Issue 2 — Reconcile Master Narrative Canon §3.2 actions list with
MVP_ACTION_SYSTEM_MATRIX_R1.
  Problem: Narrative canon still says `ADD, FOLLOW, BLAST, SUPPORT`; matrix
  says `Collect, Follow, Blast, Back` and removes `Support` from the public
  action vocabulary.
  Files: docs/canon/Master Narrative Canon.md (lines 96-99 area).
  Acceptance criteria:
    - Section 3.2 actions list reads as `Collect, Follow, Blast, Back`.
    - `Support` explicitly marked as derived state.
    - `Back` marked as Registrar-only.
    - AGENTS.md canon-import rule followed (single-pass surgical edit, not
      bulk overwrite).
  Priority: P1.

Issue 3 — Reconcile Master Narrative Canon §6.3 Plot surfaces table inline.
  Problem: Annotation note is one paragraph above an outdated 4-tab table.
  Files: docs/canon/Master Narrative Canon.md §6.3; docs/CHANGELOG.md.
  Acceptance criteria:
    - Plot surfaces table reads as `Feed, Events, Archive` with
      Promotions/Statistics/Social marked as deferred/historical.
    - Changelog entry references this slice.
    - docs-lint continues to flag any doc that uses the old tab set.
  Priority: P1.

Issue 4 — Reconcile Master Narrative Canon §1.4 power-flow sentence.
  Problem: "Power flows downward only" contradicts the hierarchy stated
  immediately above.
  Files: docs/canon/Master Narrative Canon.md §1.4.
  Acceptance criteria:
    - Sentence is removed or rewritten to clarify hierarchy vs authority.
    - Master Glossary Canon.md dual-state framing is referenced.
  Priority: P2.

Issue 5 — Extend Legacy Narrative runtime override note to cover RADIYO
wheel + Pioneer framing + Sects-as-taste-tags.
  Problem: Annotation only covers Plot tabs; other stale language still in
  body (line 114 RADIYO wheel, §1.5 Pioneer framing, §1.6 Sects as taste
  tags).
  Files: docs/canon/Legacy Narrative plus Context .md (top-of-file override
  note extended); docs/CHANGELOG.md.
  Acceptance criteria:
    - Override note lists each stale region with the current truth.
    - One-line per region, not full rewrite.
  Priority: P1.

Issue 6 — Annotate `How Uprise Works — Canon Audit (working).md` as
working-only and rename for clarity.
  Problem: CONTEXT_ROUTER lists it as final canon; file body says
  "working"; engagement-score table is partially superseded by action
  matrix.
  Files: docs/canon/How Uprise Works — Canon Audit (working).md → rename
  to ..._WORKING.md; docs/agent-briefs/CONTEXT_ROUTER.md (note in canon set
  list).
  Acceptance criteria:
    - Filename ends in _WORKING.md.
    - First line of file states "working document, not final canon".
    - CONTEXT_ROUTER.md canon set list marks it as working-only.
  Priority: P1.

Issue 7 — Add docs-lint rules for genre-selection copy, Observer term,
project_registration term, and project-vs-cause.
  Problem: docs-lint.mjs currently checks 4 patterns; missing rules for 4
  known stale patterns.
  Files: scripts/docs-lint.mjs; test in scripts/reports/.
  Acceptance criteria:
    - Lint flags "Genre Selection" in active agent-facing context (briefs,
      specs, README).
    - Lint flags "Observer" in active agent-facing context.
    - Lint flags "project_registration" in active agent-facing context
      (not in runtime code).
    - Lint flags "Add" as action verb outside event-calendar context (only
      in active agent docs, not legacy).
    - All new patterns have at least one test sample flagged.
  Priority: P1.

Issue 8 — Create docs/PHASE_INDEX.md mapping phases to canonical docs.
  Problem: Phases 1-6 are referenced in many places but no index; new
  agents don't know which phase the task belongs to.
  Files: docs/PHASE_INDEX.md (NEW); docs/README.md (link);
  docs/agent-briefs/PLATFORM_START_HERE.md (link).
  Acceptance criteria:
    - 6 phases (1 launch correctness / 2 UX shell / 3 source entities /
      4 events archive / 5 hosted stack / 6 business).
    - Each phase lists 3-6 canonical docs by path.
    - Each phase lists the runtime evidence path (e.g. tests).
  Priority: P1.

Issue 9 — Mark / freeze Operational Getting Started.md and Expanded
Getting Started.md as superseded.
  Problem: Two "Getting Started" docs exist in docs/canon/ that duplicate
  AGENTS.md + RUNBOOK.md content; an agent landing in docs/canon/ reads
  these first.
  Files: docs/canon/Operational Getting Started.md; docs/canon/Expanded
  Getting Started.md.
  Acceptance criteria:
    - Top-of-file status header: "Superseded by AGENTS.md and RUNBOOK.md;
      kept for historical reference only."
    - Or: move to docs/legacy/canon/ with a same status header.
    - Either way, the doc is no longer the first stop a new agent reads.
  Priority: P1.

Issue 10 — Annotate docs/Specifications/README.md and remove references
to non-existent canonical IDs.
  Problem: README references 01_UPRISE_Master_Overview.md through
  09_UPRISE_Promotions_Business.md; none of these files exist in
  docs/Specifications/ (only FRESH_READINESS_REPORT.md and README.md).
  Files: docs/Specifications/README.md.
  Acceptance criteria:
    - Either the listed files are restored as content-bearing legacy IDs,
      or the README is rewritten to state "legacy canonical IDs are
      retired; module-organized specs live under docs/specs/".
    - All references to non-existent files are removed or marked as
      future-only.
  Priority: P2.

Issue 11 — Annotate registrar.md + identity-roles-capabilities.md +
User-identity runtime to make the project-vs-cause term visible at the
spec layer.
  Problem: runtime uses `type=project_registration`; founder lock says
  `cause` is canonical product term; matrix §17.4 acknowledges debt.
  Files: docs/specs/system/registrar.md (header note),
  docs/specs/users/identity-roles-capabilities.md (Future Work section),
  apps/api/src/registrar/registrar.service.ts (single-line comment).
  Acceptance criteria:
    - One-line note in each spec: "Runtime persists
      type=project_registration; canonical product term is `cause`;
      reconciliation pending per MVP_ACTION_SYSTEM_MATRIX_R1 §17.4."
    - No code or migration changes.
  Priority: P2.

Issue 12 — Move docs/specs/v2/*.md to docs/specs/_v2/ or
docs/specs/future/.
  Problem: V2 specs sit alongside active specs in the same folder;
  default `ls docs/specs` surfaces them.
  Files: docs/specs/v2/ → docs/specs/_v2/ (folder move);
  docs/specs/README.md (Phase 6 entry); docs/specs/system/README.md and
  other sub-readmes (link update).
  Acceptance criteria:
    - No content changes.
    - All cross-references to v2 specs (e.g. discovery v2 spec) continue
      to resolve via relative paths.
    - sub-readmes include a "V2 deferred specs" entry pointing to the
      moved folder.
  Priority: P2.

================================================================
6. EXACT COMMANDS RUN
================================================================

Read-only commands only. No writes, no stages, no migrations, no provider
CLI calls, no DB writes.

  pwd
  git branch --show-current
  git rev-parse --short HEAD
  git status --short
  git log --oneline -20
  ls /home/baris/UPRISE_NEXT/docs/handoff/2026-06-2*
  ls /home/baris/UPRISE_NEXT/scripts/ | head -30
  find /home/baris/UPRISE_NEXT -maxdepth 2 -name "docs-lint*" -type f
  wc -l /home/baris/UPRISE_NEXT/apps/api/prisma/schema.prisma

Read operations (file content reads; not edited):

  /home/baris/UPRISE_NEXT/AGENTS.md
  /home/baris/UPRISE_NEXT/docs/STRATEGY_CRITICAL_INFRA_NOTE.md
  /home/baris/UPRISE_NEXT/docs/RUNBOOK.md
  /home/baris/UPRISE_NEXT/docs/FEATURE_DRIFT_GUARDRAILS.md
  /home/baris/UPRISE_NEXT/docs/architecture/UPRISE_OVERVIEW.md
  /home/baris/UPRISE_NEXT/docs/PROJECT_STRUCTURE.md
  /home/baris/UPRISE_NEXT/docs/AGENT_STRATEGY_AND_HANDOFF.md
  /home/baris/UPRISE_NEXT/docs/agent-briefs/CONTEXT_ROUTER.md
  /home/baris/UPRISE_NEXT/docs/README.md
  /home/baris/UPRISE_NEXT/docs/specs/README.md
  /home/baris/UPRISE_NEXT/docs/specs/DECISIONS_REQUIRED.md
  All 10 files in docs/canon/ (full reads or substantial extracts)
  Major docs/specs/** reads:
    users/onboarding-home-scene-resolution.md
    communities/scenes-uprises-sects.md
    communities/plot-and-scene-plot.md
    communities/statistics-page-design-task-list.md
    communities/scene-map-and-metrics.md
    communities/discovery-scene-switching.md (partial)
    users/identity-roles-capabilities.md
    system/registrar.md
    system/web-tier-contract-guard.md
    system/documentation-framework.md
    admin/super-admin-controls.md
    seed/README.md
    seed/launch-community-city-matrix.json
    seed/music-communities.json
    core/terminology-and-taxonomy.md
    core/signals-and-universal-actions.md
    broadcast/radiyo-and-fair-play.md
    economy/revenue-and-pricing.md
    events/events-and-flyers.md
    v2/search-parties.md (partial)
    engagement/activity-points-and-analytics.md (partial)
    All sub-readmes (users, communities, system)
  Major docs/agent-briefs/** reads:
    UI_CURRENT.md, ONBOARDING_HOME_SCENE.md,
    ARTIST_PROFILE_SOURCE_DASHBOARD.md,
    ACTIONS_AND_SIGNALS.md, EVENTS_ARCHIVE.md,
    BUSINESS_MONETIZATION.md,
    REGISTRAR_GOVERNANCE.md, EXTERNAL_TOOLS.md, README.md
  Major docs/solutions/** reads:
    SURFACE_CONTRACT_HOME_R1.md, SURFACE_CONTRACT_PLOT_R1.md,
    SURFACE_CONTRACT_DISCOVER_R1.md,
    BUSINESS_MONETIZATION_BOUNDARY_R1.md,
    MVP_EXPLICIT_DEFERRED_LIST_R1.md,
    MVP_ACTION_SYSTEM_MATRIX_R1.md,
    MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md,
    MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md,
    MVP_HOME_PLOT_FEED_COMPOSITION_LOCK_R1.md,
    MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md,
    ABACUS_FUSION_AGENT_SWARM_STRATEGY_R1.md,
    solutions/README.md
  Major docs/handoff/** reads:
    README.md,
    2026-06-24_abacus-fusion-agent-swarm-strategy.md,
    2026-06-24_plot-tab-canon-annotations.md,
    2026-06-24_radiyo-space-action-contract.md,
    2026-04-25_section-briefs-and-stale-term-guard.md,
    2026-06-17_archive-runtime-contract.md,
    2026-06-16_archive-event-terminology-cleanup.md,
    2026-04-26_listener-profile-source-management-separation.md
  Runtime reads:
    /home/baris/UPRISE_NEXT/apps/api/prisma/schema.prisma
      (partial: Community, User, ArtistBand, RegistrarEntry, Event,
      Signal, Track, RotationEntry)
    /home/baris/UPRISE_NEXT/apps/api/src/onboarding/onboarding.service.ts
      (first 120 lines)
    /home/baris/UPRISE_NEXT/apps/web/src/store/onboarding.ts
    /home/baris/UPRISE_NEXT/apps/web/src/app/plot/page.tsx
      (tab labels + render code)
    /home/baris/UPRISE_NEXT/scripts/docs-lint.mjs (rules)
    /home/baris/UPRISE_NEXT/docs/Specifications/README.md
    /home/baris/UPRISE_NEXT/docs/canon/Legacy Narrative plus Context .md
      (lines 1-161)

================================================================
7. NO-EDIT CONFIRMATION
================================================================

No files were modified, staged, committed, or pushed. No migrations,
seeds, deploys, provider CLI calls, or database writes were executed.
Only read operations (read_file, search_files, terminal ls/git
status/git log/wc -l/find) were used during the audit.

The single write that produced this file was the user's explicit
request to "create a markdown file in the repo for the codex agent to
pull." It is placed under docs/handoff/ following the existing dated
handoff convention so the parallel codex agent can locate it via the
handoff index.

================================================================
END OF AUDIT
================================================================