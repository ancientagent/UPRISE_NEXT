# Source Dashboard Design Tool Loader

Status: active routing note
Date: 2026-07-06
Package: `artist-profile-source-dashboard`
Screen/section: `source-dashboard`

## Purpose

Route design, image, and external-tool work for the Source Dashboard report-paper package without letting tools create product doctrine, runtime behavior, or unapproved repo assets.

This note is a workflow aid only. It does not authorize implementation, routes, permissions, billing, upload/storage, metrics runtime, calendar publishing, messaging, or placeholder CTAs.

## Current Authority Packet

Use this package before any visual generation or design handoff:

- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `docs/screen-packages/README.md`
- `docs/screen-packages/artist-profile-source-dashboard/README.md`
- `docs/screen-packages/artist-profile-source-dashboard/instruction-packet.md`
- `docs/screen-packages/artist-profile-source-dashboard/source-map.md`
- `docs/screen-packages/artist-profile-source-dashboard/design-spec/source-dashboard-management-shell-layout-brief.md`
- `docs/screen-packages/artist-profile-source-dashboard/spec/source-dashboard-management-shell-dev-spec.md`
- `docs/screen-packages/artist-profile-source-dashboard/spec/source-dashboard-release-deck-readiness-dev-spec.md`
- `docs/screen-packages/artist-profile-source-dashboard/art-handoff/source-dashboard/spec/2026-07-06_source-dashboard-creative-brief-v01.md`
- `docs/screen-packages/artist-profile-source-dashboard/art-handoff/source-dashboard/spec/2026-07-06_source-dashboard-asset-contract-v01.md`
- `docs/screen-packages/artist-profile-source-dashboard/art-handoff/source-dashboard/prompts/2026-07-06_source-dashboard-report-paper_prompt-v01.md`
- `docs/screen-packages/artist-profile-source-dashboard/art-handoff/source-dashboard/approved/2026-07-06_source-dashboard-report-paper_approval-v01.md`
- `docs/screen-packages/artist-profile-source-dashboard/art-handoff/source-dashboard/approved/2026-07-06_source-dashboard-report-paper_desktop-1487x1058_v01.png`

Known authority note: `2026-07-06_source-dashboard-asset-contract-v01.md` says no mockup was approved when that file was written. The later adjacent approval note in `approved/` now marks the desktop PNG as an approved implementation visual target. Treat the approval note plus PNG as the current specific asset authority, while preserving the asset contract's storage and approval rules for future assets.

## Storage Rules

- Approved implementation targets: `docs/screen-packages/artist-profile-source-dashboard/art-handoff/source-dashboard/approved/`
- Working mockups: `docs/screen-packages/artist-profile-source-dashboard/art-handoff/source-dashboard/mockups/` only after explicit user approval for repo storage.
- Prompts: `docs/screen-packages/artist-profile-source-dashboard/art-handoff/source-dashboard/prompts/`
- Creative and asset specs: `docs/screen-packages/artist-profile-source-dashboard/art-handoff/source-dashboard/spec/`
- Tooling notes: `docs/screen-packages/artist-profile-source-dashboard/art-handoff/source-dashboard/tooling/`
- Do not store generated image cache files unless the exact image is approved and has an adjacent approval note.
- Every approved asset needs an adjacent approval note with filename, date, approver, source prompt/reference, role, rights/privacy notes, linked specs, and known design-only/future/do-not-build boundaries.

## Tool Routing

| Tool / skill | What it is for | Use it when | Do not use it when | May write to | Asset status | Approval step | Risks |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Product Design `get-context` | Confirms or plays back a design brief before Product Design ideation or implementation workflows. | A new Product Design pass, visual exploration, prototype, redesign, or image-to-code flow is requested. Use playback mode when the brief is already complete. | Do not use as implementation authority or to create files by itself. Do not re-ask already answered Source Dashboard facts. | Normally no repo writes. May support a later prompt/spec note if explicitly scoped. | No assets. | User must confirm the brief before Product Design `ideate` or `image-to-code`. | Can slow work or reopen settled scope if used as a broad questionnaire instead of playback. |
| Product Design `ideate` | Generates image-based UI direction options after `get-context` confirms the brief. | User explicitly reopens visual ideation or asks for new Source Dashboard visual options. | Do not run automatically from this package. Do not use when a visual target is already approved and only a handoff is needed. | Generated images should stay out of repo unless approved. Prompt references may go in `prompts/`. | Drafts only until selected and approved. | Generate options, wait for founder selection, then create/attach an approval note before repo storage. | Product-rule drift, fake controls, unapproved image storage, UI text hallucination, generic admin/SaaS trope drift. |
| Product Design `image-to-code` | Implements a selected image/mockup as responsive frontend code. | Only after the user explicitly asks for runtime implementation from a selected approved visual target. | Current task explicitly says do not implement runtime code. Do not use for this docs-only handoff. | Runtime source files and QA files if later approved; not in this task. | Not an asset-approval tool. | Requires confirmed brief, selected visual target, implementation approval, and design QA. | Directly violates this task if used now; can convert design-only/future controls into fake runtime. |
| Product Design `audit` | Captures screenshots and produces UX/design/accessibility findings tied to evidence. | User asks to audit/review a live product flow or screen evidence. | Do not use for prose-only review of the approved mockup unless the user asks for a formal screenshot audit destination. | Local audit folder or Figma if chosen. | Evidence captures only; not approved implementation assets by default. | Audit screenshots need explicit approval before becoming repo visual references. | Screenshot-only evidence cannot prove runtime accessibility or hidden states. |
| Figma `use_figma` | Creates, edits, inspects, or syncs editable Figma design files via Figma Plugin API. | User asks to create/update a Figma screen, inspect a Figma file, or build an editable design from this package. | Do not use without a target Figma file/key and the mandatory `figma-use` skill. Do not use to create repo assets silently. | External Figma file. Repo may receive a handoff link or spec note only if scoped. | External drafts unless explicitly exported, approved, and recorded. | Founder must approve the Figma frame/export before storing any image in repo. | Figma output can look authoritative while still showing design-only or future behavior. |
| Figma `figma-generate-design` | Builds or updates composed Figma screens/views from code or description while reusing design system components. | User wants an editable Figma version of the Source Dashboard screen package. | Do not use for final runtime code or product doctrine. Do not use without `figma-use` and a file key. | External Figma file. | Draft/proposal until approved. | Review frame against Source Dashboard specs; export/store only with approval note. | Can hardcode a design system or component language that does not exist in UPRISE. |
| Figma `figma-create-new-file` | Creates a blank Figma design/FigJam/Slides file before further Figma work. | A fresh Figma destination is explicitly requested or needed. | Do not create off-book Figma files just to park drafts. | External Figma drafts. | Draft only. | User/founder selects and approves any exported frame before repo storage. | Wrong workspace/team, untracked design source, duplicated authority outside repo. |
| Figma `figma-generate-library` | Builds or updates a Figma design system from a codebase. | Only if the user explicitly asks for a UPRISE design-system library. | Do not use for this focused Source Dashboard pass; do not create a huge design system. | External Figma library. | Not a Source Dashboard asset. | Requires separate scope approval. | Overbuilds the screen-package and can create a parallel design-system authority. |
| Figma `generate_deck` | Creates Figma Slides decks. | Founder/stakeholder readout decks, not implementation targets. | Do not use for app UI design or runtime handoff. | External Figma Slides. | Presentation draft. | Approved slides are still not implementation assets unless exported and recorded. | Slide polish can obscure design-only/future boundaries. |
| Canva connector | Creates/edits Canva documents, reports, posters, flyers, social designs, and image-to-design conversions. | Decks, reports, social collateral, or converting a flat approved image into an editable Canva artifact. | Do not use as Source Dashboard UI source of truth. Do not use for product screen implementation targets unless explicitly requested. | External Canva designs; optional repo notes/links if scoped. | Candidate/draft until founder-approved. | Exported Canva assets require explicit approval and adjacent repo approval note before storage. | Wrong brand kit/account, generated copy drift, editable elements implying unauthorized runtime. |
| Canva `canva-branded-presentation` | Creates branded presentation candidates from a brief/outline/source design. | A stakeholder presentation is requested from the Source Dashboard handoff. | Do not use to redesign the screen. | External Canva deck. | Draft deck until selected. | User selects candidate; final deck link can be referenced in handoff if requested. | Presentation narrative may turn design-only ideas into perceived commitments. |
| Canva `canva-resize-for-all-social-media` | Resizes an existing Canva design into social formats. | Only for approved marketing/social variants. | Do not resize Source Dashboard UI mockups as implementation assets without approval. | External Canva copies and exported PNGs. | Export drafts until approved. | Each exported PNG needs approval before repo storage. | Social crops may cut critical UI or imply public marketing approval. |
| Canva `canva-translate-design` | Creates translated copies of Canva designs. | Localization of approved collateral. | Not for Source Dashboard screen UI unless requested. | External Canva copy. | Draft until approved. | Save/commit after approval in the Canva workflow. | Text expansion/layout drift; translated copy may alter product meaning. |
| Built-in Image Generation / Image Creator | Generates or edits bitmap images from prompts and image references. OpenAI docs distinguish single-prompt generation/editing from conversational multi-turn image workflows. | New mockup options, localized edits, or approved asset generation after brief/target confirmation. | Do not run automatically. Do not generate assets for repo storage without approval. Do not use generated UI text as final product copy. | Generated image cache by default; repo only after approval. Prompt docs may go in `prompts/`. | Draft only until exact image is approved. | Founder selects exact image; create adjacent approval note before repo storage. | Hallucinated UI, wrong dimensions, fake controls, unreadable text, rights/privacy gaps, accidental cache-file commits. |
| OpenAI Image API / Responses image generation docs | Official API reference for image generation/editing capabilities and constraints. | When writing tool notes or planning a programmatic image workflow. | Not needed for simple local handoff edits that do not call image generation. | No repo writes by itself. | No assets. | N/A unless generated outputs are stored. | Current API behavior can change; re-check docs before automation. |
| Creative Production `explore` | Renders a compact creative path chooser for broad business creative briefs. | User wants a broad campaign/creative starting point. | Do not use for this focused Source Dashboard visual target unless broad exploration is explicitly reopened. | Widget state/external output folders when used. | Draft/proposal. | Selected outputs need approval before repo storage. | Broad creative paths can pull the package into marketing instead of source-dashboard UI. |
| Creative Production `moodboard-explorer` | Generates image-first mood boards and review widgets. | Visual territory exploration is explicitly requested. | Do not use to create final Source Dashboard UI assets without user selection and approval. | Durable moodboard output folders outside this package unless explicitly scoped. | Draft visual territory. | Selected image requires approval note before repo storage. | Moodboard imagery may not fit UI dimensions; widget previews are not implementation targets. |
| Creative Production `generative-polish` | Builds publish-safe visual polish by keeping exact text/data deterministic and using image generation for non-critical visual layers. | A selected approved asset needs final marketing/social polish. | Do not use to alter Source Dashboard UI labels, claims, charts, or controls. | Output folders for final assets/manifest when requested. | Draft until reviewed; publish-bound only after approval. | Review text, dimensions, provenance, and approval status before storage/use. | Image generation can distort text, charts, logos, UI, or claims if not kept out of critical layers. |
| Creative Production MCP widgets | Render style intake, shot intake, and mood-board review surfaces in-chat. | User needs interactive review of generated visual directions. | Do not treat a widget as the deliverable unless the backing assets/specs exist. | Widget state/run directory when generated workflows are used. | Review surface, not approval by itself. | User must explicitly approve exact output before repo storage. | Widget-safe previews can diverge from source images if not materialized correctly. |
| Repo skill `uprise-founder-session-capture` | Preserves material founder wording verbatim in `docs/founder-sessions/` before summarizing. | New founder wording changes or clarifies UI behavior, product rules, acceptance details, or future implementation. | Do not use for routine confirmations already covered by specs. | `docs/founder-sessions/YYYY-MM-DD_<topic>.md` and possibly handoff/changelog if promoted. | Text evidence only. | Founder approval required before promoting behavior into owner specs when interpretation is uncertain. | Raw session notes are not higher authority than later owner specs. |
| Repo skill `uprise-founder-clarification-capture` | Routes durable product clarifications into owner specs. | A design discussion changes product truth, terminology, lifecycle rules, action grammar, authority, or future implementation. | Do not use to promote speculative mockup details. | Owner specs, lane briefs, changelog, handoff when authorized. | No visual assets. | Restate classification and patch only when authorized. | Accidental doctrine changes from design-only visuals. |
| Repo skill `uprise-lane-loader` / `uprise-skill-router` | Chooses the smallest UPRISE lane packet and tool route. | Multi-lane or tool-routing work, external-agent prompt packets, or unclear authority. | Do not use as a reason to bulk-load the whole platform for exact-file edits. | Usually no writes; may inform routing notes. | No assets. | N/A. | Overloading context or treating the router as product authority. |

## Source Dashboard Defaults

- Preferred next visual work: refine the already approved report-paper/source-file direction.
- Default Product Design mode: playback, not new ideation, unless the user asks for new options.
- Default asset stance: no extraction, crop, generation, or repo storage until the user approves the asset request list.
- Default Figma/Canva stance: external editable drafts only; repo truth remains the docs/specs and approved PNG.
- Default implementation stance: no runtime code from this tooling pass.

## Official References Checked

- OpenAI image generation guide: `https://developers.openai.com/api/docs/guides/image-generation`
- OpenAI Codex AGENTS.md guide: `https://developers.openai.com/codex/guides/agents-md`
- OpenAI Skills overview: `https://help.openai.com/en/articles/20001066-skills-in-chatgpt`

