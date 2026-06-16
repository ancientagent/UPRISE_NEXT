# 2026-04-11 Source Dashboard Print Shop Language Lock

## Summary
- Locked the top-down language for creator tooling more explicitly.
- Print Shop should now be described as an item/tool inside the source dashboard system.

## Core Wording
- a user signs into one account
- from that account they access the source accounts/entities they are attached to
- source tools and features live in the source dashboard layer
- Print Shop is one source-facing tool inside that layer

## Why
- this keeps implementation thinking system-first instead of route-first
- it reduces drift where Print Shop gets described as a standalone public utility or listener-facing tool
- it aligns better with how artists/promoters should mentally experience event creation

## Implementation Note
- current MVP still uses bridging routes (`/artist-bands/[id]`, `/plot`, `/registrar`, `/print-shop`)
- those routes should be treated as access points into the source-dashboard system, not as the conceptual model themselves
