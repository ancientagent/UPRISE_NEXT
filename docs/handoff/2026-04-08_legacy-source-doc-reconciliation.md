# Legacy Source Document Reconciliation

Date: 2026-04-08
Branch: feat/ux-founder-locks-and-harness

## Source documents reviewed
- `uprise narrative rewrite.docx`
- `Uprise Concept Document 3.3.21 (1).docx`

## Purpose
Record what from those older source documents remains active repo understanding, what was narrowed for MVP, and where that understanding now lives durably.

## Preserved as current repo truth
### Structural / product understanding
- `city`, `state`, `national` remain valid platform scopes.
- Follow-driven updates remain part of product truth.
- Calendar remains important platform infrastructure.
- Add / propagation separation remains valid.
- Artist / song metrics remain a real system, even when the current MVP display surface is narrower.

### Current durable destinations
- stats contract:
  - `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`
- discover contract:
  - `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- later-version domains:
  - `docs/solutions/LATER_VERSION_DOMAIN_UNDERSTANDINGS_R1.md`
- super-admin metrics visibility:
  - `docs/specs/admin/super-admin-controls.md`

## Narrowed for current MVP
- Discover currently operates at `city` + `state` scope only.
- `national` is deferred from the current Discover MVP surface.
- current public MVP stats/display remains narrower than the broader retained analytics layer.
- current profile surfaces do not automatically inherit every field named in older documents.

## Preserved as retained analytics, not necessarily surfaced
The older documents clearly support a broader analytics layer than the current MVP UI.

Retained metrics now explicitly preserved include:
- `listenCountAllTime`
- `mostListenedSignals`
- `mostUpvotedSignals`
- `mixtapeAppearanceCount`
- `appearanceCountByTier`

Rules now locked:
- these metrics may exist per tier
- these metrics may exist platform-wide
- these metrics may feed future analytics add-ons
- Super Admin should retain access even when the metrics are not publicly surfaced

Authority:
- `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`
- `docs/specs/admin/super-admin-controls.md`

## Preserved as later-version domains
The source documents confirmed these domains are legitimate and should not be discarded:
- ambassadors
- venues
- mixologists
- mixes

Current durable destination:
- `docs/solutions/LATER_VERSION_DOMAIN_UNDERSTANDINGS_R1.md`

Boundary:
- these domains remain real
- they do not silently widen the active MVP Discover / Stats / profile work unless explicitly reactivated

## Preserved as later-version profile understanding
The source documents include richer profile-data inventories than current MVP profile locks.

Those are now preserved as later-version understanding for:
- artist profiles
- listener profiles
- venue profiles

Current durable destinations:
- `docs/solutions/LATER_VERSION_DOMAIN_UNDERSTANDINGS_R1.md`
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`

## Explicitly not promoted from the source docs into current MVP by default
- paid listener 20-second-preview mechanics
- blank-tape / mixtape economy details
- yearly album / 3-single system in legacy form
- ratings/reviews as current MVP requirement
- generic messaging as current MVP requirement
- venue / ambassador / mixologist mechanics as active MVP surface requirements
- national top-40 style public surface behavior as current MVP requirement

## Outcome
The two older source documents are no longer carrying unique critical product truth by themselves.

Their important surviving content has now been redistributed into:
- current MVP locks
- retained analytics rules
- Super Admin visibility rules
- later-version domain understanding
- later-version profile-data understanding
