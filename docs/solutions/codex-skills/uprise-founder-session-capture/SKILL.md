---
name: uprise-founder-session-capture
description: Use when material UPRISE founder wording, exact bug-fix instructions, feature requirements, product-rule clarifications, UI/architecture decisions, or long Q&A must be preserved verbatim before summarizing or implementation.
---

# UPRISE Founder Session Capture

## Core Rule

Capture the raw founder wording first. Summaries, owner-spec patches, handoffs, Linear notes, and memory are secondary artifacts.

This is not only for feature brainstorms. Use it for any founder-provided implementation detail that future agents could lose, compress incorrectly, or reinterpret later.

Do not use it for routine confirmations, simple preferences, or facts already
settled in current owner specs unless the user asks to preserve the wording or
the current docs contain stale/conflicting language.

Trigger when the founder says any equivalent of:

- "record this"
- "make sure this is documented"
- "from now on"
- "we should not have to revisit this"
- "this is how it works"
- "this needs to happen exactly"
- precise bug-fix behavior, edge-case rules, UI behavior, workflow requirements, or acceptance details
- a long brainstorming or clarification thread is producing product truth

## Required Output Shape

Create or update a dated founder-session note in the repo before relying on memory:

`docs/founder-sessions/YYYY-MM-DD_<short-topic>.md`

Use this structure:

```md
# <Topic> Founder Session

Status: raw founder-session capture
Date: YYYY-MM-DD
Source: current chat/session
Related lane(s): <lane names>
Owner spec candidates: <docs/specs/... paths>

## Raw Founder Notes

> <verbatim founder wording, preserving important phrasing>

## Clarifications

Use this for exact behavior corrections, bug-fix instructions, edge cases, terminology corrections, acceptance details, and "do this exactly" statements.

- <raw-backed clarification>
- Type: settled | open | deferred | implementation detail | stale correction | already documented
- Likely owner: <owner spec / runtime / test / docs path>

## Feature Sets

Use this for larger feature concepts, UI systems, architecture ideas, workflow designs, and future build packages.

- <feature set name>
- Raw basis: <short quote or pointer to Raw Founder Notes>
- Included behavior:
  - <specific behavior>
- Excluded / not activated:
  - <boundary>
- Status: settled | open | deferred | design-only | implementation-ready

## Working Interpretation

- <short distilled points; mark uncertainty explicitly>

## Promotion Targets

- Owner spec: <path/section>
- Lane brief: <path if agents need routing help>
- Tests/runtime: <paths if implementation likely changes>
- Linear/PM: <issue or ACTIVE_PM pointer if execution state is affected>

## Do Not Drift

- <stale wording or bad assumptions this clarification rules out>
```

## Workflow

1. Preserve exact wording from the current session. Do not paraphrase first.
2. Sort captured material into `Clarifications` or `Feature Sets`.
3. Add a concise interpretation below the raw notes.
4. Classify each item as settled, open, deferred, already documented, stale correction, or implementation detail.
5. Identify owner spec candidates using `uprise-founder-clarification-capture` when product behavior changes.
6. Patch owner specs only after the founder approves the interpretation or explicitly says to handle it.
7. Keep lane briefs short; link to the owner spec or founder-session note instead of duplicating micro-rules.
8. Add `docs/CHANGELOG.md` and a dated `docs/handoff/` note only when the session results in repo-doc changes beyond founder-session capture.

## Clarifications vs Feature Sets

| Section | Use For | Typical Risk |
| --- | --- | --- |
| `Clarifications` | bug fixes, exact behavior, acceptance criteria, terminology, edge cases, corrections | agents summarize too aggressively and implement the wrong thing |
| `Feature Sets` | larger concepts, future screens, architecture packages, UX systems, multi-step product ideas | agents overbuild or treat brainstorming as approved implementation |

When unsure, put the raw wording in `Clarifications` first and reference it from a `Feature Sets` item later.

## Guardrails

- Do not turn brainstorming into implementation scope automatically.
- Do not omit exact bug-fix instructions just because they are small.
- Do not treat the founder-session note as higher authority than an updated owner spec after promotion.
- Do not rewrite canon wholesale from a session note.
- Do not ask repeated micro-questions if the owner spec or founder-session note already answers the point.
- Do not store secrets, provider credentials, private personal data, or browser auth artifacts in founder-session notes.

## Quick Status Block Before Editing Owner Docs

```md
Founder session captured: docs/founder-sessions/YYYY-MM-DD_<topic>.md
Clarifications captured: yes/no
Feature sets captured: yes/no
Decision status: settled | open | deferred | mixed
Owner spec patch needed: yes/no
Founder approval needed before implementation: yes/no
```
