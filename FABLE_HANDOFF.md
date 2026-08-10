# Fable Handoff — UPRISE_NEXT

Written 2026-08-10 by Fable with the founder. Replaces the empty
FABLE-RECON_2026-08-07.md stub. HONESTY NOTE: unlike the GISTer and Close
to Home handoffs, this one was written from a bounded survey, not a full
working session — the deep triage this repo has been owed since 2026-08-07
still hasn't happened. VERIFIED marks what was read/checked on 2026-08-10;
everything else inherits from repo docs and may be stale.

## What this is (VERIFIED from docs/PLATFORM_START_HERE.md, 2026-08-01)

UPRISE: a music-community platform organized around local **Home Scenes**
(`city + state + music community`). Same screens/player/routing everywhere;
the scene changes the data. Listeners live in Home/Plot/player; artists,
bands, promoters are separate managed source entities. North star: **a
viable, community-powered music industry maturing toward self-governance
via the Proof of Support protocol** — explicitly NOT another streaming app,
NOT a crypto/financial scheme. Rallying frame: "Blueprints for the next
DIY revolution."

**This is the founder's legacy project** (portfolio: "The legacy.
Reverence protocol"). Treat its history with more care than GISTer's —
the reverence protocol means the archaeology IS the value; do not bulldoze
old decisions as "strata" here without founder review.

## Authority order (from AGENTS.md + repo convention — VERIFIED to exist)

1. Founder's dated words
2. `AGENTS.md` — required agent checklist and guardrails
3. `docs/canon/` — canonical product semantics (source of truth)
4. Specs / lane briefs / `docs/PLATFORM_START_HERE.md`
5. `docs/legacy/uprise_mob*` — legacy references, explicitly NON-canon

Standing repo rules (VERIFIED in SOUL.md): **pnpm only**; no scope drift
across tiers (web-only task never touches API/types); **never guess
unresolved canon decisions — stop and ask**; small verifiable slices;
restate allowed/forbidden files before editing.

## Repo shape (VERIFIED 2026-08-10)

- Turborepo monorepo: `apps/web` (Next.js 15, Vercel), `apps/api`
  (NestJS, Fly.io), `apps/socket` (Socket.IO), `apps/workers/transcoder`.
  Shared: `packages/ui|config|types`.
- Last commit 2026-08-09 (radiyo lifecycle handoff docs). Checkout was
  sitting on `codex/classic-avatar-asset-production` — codex agents work
  here too; check `git branch -a` for in-flight lanes before starting.
- A `uprise-telegram-watchdog` systemd user timer runs every ~60s on this
  machine (`~/.local/bin/uprise-telegram-watchdog.sh`) — a Telegram bridge
  liveness check. Nobody has audited it recently.
- `docs/` is rich: RUNBOOK, sprint plans, phase-1 completion report,
  deploy matrices, agent briefs, architecture. None of it re-verified in
  this survey.

## Mission for the dedicated session: M1 — TRIAGE FIRST

This repo's pending debt (portfolio, 2026-08-07: "Triage session
pending"). Before building anything:

1. Read `AGENTS.md`, `docs/canon/`, `docs/PLATFORM_START_HERE.md`,
   `docs/RUNBOOK.md`, and the newest handoff docs (radiyo lifecycle,
   avatar assets). Establish what is actually LIVE (deploys, CI state,
   the staging Fly config) vs. documented-but-dead.
2. Inventory in-flight branches (multiple codex/* lanes exist) — which
   are mergeable, which are abandoned strata.
3. Audit the telegram watchdog + any other running automation touching
   this repo.
3b. RESCUE THE STASHES (VERIFIED 2026-08-10): `git stash list` holds at
   least two entries, including `stash@{1}` on main dated 2026-07-13
   labeled "preserve community-powered purpose founder capture" — founder
   words trapped in a stash are one `git stash drop` from oblivion.
   Recover, commit somewhere durable, and show the founder.
4. Produce the real state document (the equivalent of GISTer's
   `docs/state/` system — clone that pattern if it fits, it proved itself
   2026-08-10) and a bounded plan, then STOP for founder priorities.

Deliverable: a triage report the founder can act on, not code.

## How the founder works (proven across GISTer + Close to Home)

- Founder steers and gut-checks; Fable architects and executes; cheap
  models (Hermes via OpenRouter — always `--provider openrouter`, trimmed
  `-t` toolsets, `--yolo` for one-shots) do volume; Codex profiles
  (sol/terra/luna, ChatGPT subscription, approval policy baked in configs)
  do heavier lifting; every claimed fix gets a different-vendor read-only
  review; founder is the only merge gate.
- Hermes profiles for this repo already exist: uprise, upriseauditor(+/-),
  uprisereviewer(+/-), uprisedeepcoder, uprisedeepscout, uprisewatchdog.
  Audit their configs before trusting them (GISTer lesson: agents pull
  too many tools by default).
- Commit everything; dated founder words are citations; update the front
  door in the same commit as the work.
- One partner, one session per repo per sitting. Cross-repo lessons live
  in `~/.claude/projects/-home-baris-record/memory/` and each repo's
  FABLE_HANDOFF.md (GISTer: enable-first; CTH: the gates are the product;
  UPRISE: reverence — know which reflex you're in).
