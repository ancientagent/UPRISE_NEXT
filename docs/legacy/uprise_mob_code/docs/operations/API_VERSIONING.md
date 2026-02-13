# API Versioning & Deprecation Policy

- Current version: v1 (implicit)
- Breaking changes require a `/v2` route namespace or backward-compatibility shims.
- Prefer additive changes in v1 (new fields/params) over breaking changes.
- Mark deprecated fields in responses and document removal timelines in `docs/specs/*`.
- Communicate deprecations:
  - Add a “Deprecations” note in the affected spec and CHANGELOG.md.
  - Include a `deprecation` object in responses when feasible: `{ field: 'oldName', removeAfter: '2025-12-31' }`.
- Version bump triggers:
  - Contract shape change (rename/remove fields), auth header changes, path/param breakage.
- Testing:
  - Keep v1 smokes green until removal date; add v2 smokes alongside when introduced.
