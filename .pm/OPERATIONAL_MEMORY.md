# UPRISE Operational Memory Contract

Perseus Vault is the small, encrypted journal for a stable project seat. It
helps a replacement or night crew resume work; it does not replace specs,
Git/PR state, Codebase Memory, Mem MCP, or `.pm/checkins/`.

- Project key: `uprise`
- Vault: `C:\Users\baris\.perseus-vault\projects\uprise.db`
- Key: machine-local `C:\Users\baris\.perseus-vault\project-keys\uprise.key`; never commit it.
- Never cross the project wall. Memory belongs to the stable seat, not a model.

At startup verify repo/branch/HEAD/upstream, registered writer, and dirty state;
read the routed authority; then recall only the assigned project and seat.
Verify each recalled claim. If unavailable, report `OPERATIONAL MEMORY:
DEGRADED` and continue from repo evidence without guessing.

At meaningful closeout, write the append-only check-in first, then exactly one
concise event keyed `<seat-id>/<YYYYMMDD-HHMM-short-task>`. Include runtime
agent, disposition, check-in, revision/environment, artifacts, corrections,
blockers, and next safe step; confirm recall. Never store secrets, identity
data, raw DOM, full transcripts, guesses, or uncited QA. Corrections are new
linked events, never silent overwrites. Night crews use the same closeout.
