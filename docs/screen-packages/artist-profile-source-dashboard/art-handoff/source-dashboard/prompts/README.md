# Source Dashboard Prompts

Status: active prompt handoff folder
Package: `artist-profile-source-dashboard`
Screen/section: `source-dashboard`

This folder stores text prompts and source-reference notes for Source Dashboard
visual exploration. It does not store generated mockups.

Current rule: do not generate new images from this handoff and do not copy
Codex generated image cache files into the repo. Existing generated images stay
in Codex cache unless the user explicitly approves a specific image as a durable
repo asset.

Prompt files in this folder should:

- name the source docs used;
- preserve the selected visual direction;
- include target dimensions;
- list negative constraints and do-not-build boundaries;
- state whether the prompt is for desktop, mobile, or both;
- avoid introducing runtime behavior not authorized by owner specs.

Use the screen/section folder name rule from `docs/screen-packages/README.md`:
the main asset handoff folder is named for the screen or section covered, not a
generator ID, agent name, date-only label, or vague description.
