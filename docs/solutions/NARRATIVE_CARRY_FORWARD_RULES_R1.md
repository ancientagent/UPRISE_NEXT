# Narrative Carry-Forward Rules R1

Purpose: keep future sessions from narrowing product understanding below what is already present in repo narrative canon and legacy-canon carry-forward sources.

Status: operational guidance derived from `docs/solutions/NARRATIVE_RECONCILIATION_GAP_REPORT_R1.md`.

## Use This When
- reconciling specs against canon
- preparing UX prompts
- reviewing whether a behavior is truly new, or simply omitted from a narrow working summary
- checking whether a current implementation assumption became too narrow

## Carry Forward As Already Known

These points should be treated as part of working understanding unless a newer repo-canon source explicitly narrows them:

### Structural locks from repo canon
- nearest-active onboarding fallback and preserved pioneer intent
- users tune into Uprises through RaDIYo; do not collapse `Scene` and `Uprise` into the same thing
- Fair Play is Two-Pool Broadcast V1, with recurrence and propagation separated
- Registrar scope includes artist, promoter, and project activation
- Events, Proof-of-Support, and Print Shop issuance remain linked
- Activity Points are descriptive participation metrics only, not authority or visibility controls

### Legacy-canon carry-forward items that still matter unless contradicted
- Discover access mechanics and Discovery Pass gating
- Personal Play / collection listening is distinct from Fair Play
- communication model:
  - public discussion belongs in Social/message-board surfaces
  - group communication is private
  - sect communication is scoped, not generic DM
- named V2 collaborative constructs such as Search Parties / Listening Rooms remain part of background product understanding

## Do Not Narrow Into These Mistakes

- Do not treat nearest-active routing as optional if the main repo canon already locks it.
- Do not reduce the Registrar to artist intake only.
- Do not treat Print Shop as a generic store/promotions surface if canon keeps it event-bound.
- Do not let Activity Points drift into ranking, authority, or feed-placement semantics.
- Do not discard legacy-canon discovery/personal-play details merely because newer summaries are thinner.

## External Comparison Rule

External narrative files can be used to:
- detect omissions
- clarify wording
- highlight contradiction risk

They cannot be used to:
- silently settle unresolved behavior
- override repo canon
- import richer UI semantics as if already approved

## Founder-Decision Boundary

If a behavior is:
- absent from current repo canon,
- only present in external comparison material,
- or explicitly marked unresolved,

do not treat it as active behavior. Escalate it as founder-decision-required.

## Prompt Rule For Future UX Sessions

When preparing UX or implementation prompts, explicitly remind the agent:
- carry forward repo-canon structural locks even if not restated in the task prompt
- use legacy repo canon when newer canon is silent and not contradictory
- do not derive behavior from philosophy or anti-trope framing
- do not use external narrative comparison files as automatic product authority

## Source
- `docs/solutions/NARRATIVE_RECONCILIATION_GAP_REPORT_R1.md`
