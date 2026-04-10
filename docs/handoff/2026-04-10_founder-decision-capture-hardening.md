# 2026-04-10 — Founder Decision Capture Hardening

## Why this note exists
A recurring failure mode surfaced in April doctrine work:
- important founder clarifications were discussed live
- some were promoted quickly, some lagged
- later in the thread the founder had to verify that the decisions were actually saved

This was not mainly a product-truth problem.
It was an operational capture problem.

## Correction
The repo now has an explicit capture rule:
- `docs/solutions/FOUNDER_DECISION_CAPTURE_PROTOCOL_R1.md`

## What the protocol does
- requires same-pass promotion of founder decisions that change product truth or scope
- prefers updating the narrowest existing founder lock instead of leaving decisions in chat
- requires changelog updates for meaningful promotions
- requires a dated handoff note when reconciliation or implementation follow-up is needed
- forces explicit labeling when doctrine is locked but runtime/spec work is still pending

## Expected effect
Future sessions should no longer depend on the founder reasserting the same ontology/scope decision simply because a dense chat thread consumed context.

## Carry-forward rule
When a founder indicates a repeated clarification should already have been saved, treat that as an immediate salvage trigger rather than a normal discussion turn.
