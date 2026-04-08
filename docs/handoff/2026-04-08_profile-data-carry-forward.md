# Profile Data Carry-Forward

Date: 2026-04-08
Branch: feat/ux-founder-locks-and-harness

## Summary
- Preserved legacy profile-field inventories as later-version understanding instead of leaving them in old source docs only.
- Kept those inventories out of the current MVP profile contract unless a later profile slice explicitly promotes them.

## Locked handling
- `docs/solutions/LATER_VERSION_DOMAIN_UNDERSTANDINGS_R1.md`
  - now preserves retained profile-data inventories for:
    - artist profiles
    - listener profiles
    - venue profiles
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
  - now explicitly points future sessions to the later-version carry-forward doc instead of silently dropping richer artist-profile field inventories

## Boundary
- This does not widen current MVP profile rendering.
- It preserves future-version profile understanding so later profile work can reconcile against retained field inventories intentionally.
