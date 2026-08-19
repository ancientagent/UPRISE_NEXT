# UPRISE Agent Registry

| Agent ID | Harness/profile | Desktop room | Task/session ID | Role | Model | Skills | Authority | State |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `uprise-codex-oss-audit-01` | Codex CLI | Unpaired legacy session | `01a012ca-dd14-7470-850a-7058e7c6330d` | OSS fit audit | Codex subscription | CLI defaults | Read-only | Complete/parked |
| `uprise-hermes-auditor-01` | Hermes `upriseauditorminus` | Pair when dispatched | — | Evidence/canon/authority audit | `tencent/hy3-preview`, checked 2026-08-18 | 4-profile limited set | Read-only | Probation |
| `uprise-hermes-reviewer-01` | Hermes `uprisereviewerminus` | Pair when dispatched | — | Bounded result/diff review | `tencent/hy3-preview`, checked 2026-08-18 | 6-profile limited set | Read-only | Probation |
| `uprise-webscout-01` | Hermes `uprisewebscout` | Pair when dispatched | — | UPRISE-only web research | `z-ai/glm-5.3`, checked 2026-08-18 | 4 verified web-research skills | Read-only | Probation |

All active CLI rows use `/home/baris/UPRISE_NEXT`; desktop view is
`\\wsl$\Ubuntu-24.04\home\baris\UPRISE_NEXT`. Branch/upstream/dirty state must
be reverified at dispatch.

Current limited profile sets:

- Auditor: `codebase-inspection`, `evidence-based-audit`,
  `systematic-debugging`, `uprise-doc-authority-audit`.
- Reviewer: `codebase-inspection`, `github-code-review`,
  `evidence-based-audit`, `requesting-code-review`, `simplify-code`,
  `uprise-doc-authority-audit`.
