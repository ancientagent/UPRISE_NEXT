# 2026-04-11 Source Account Context Switch Lock

## Summary
- Locked the post-mobile/web replacement model more explicitly.
- UPRISE now treats listener and source use as layers inside one signed-in web platform, not as separate apps with separate logins.

## Core Rule
- a user signs into one account
- if that user is attached to one or more managed sources, they should be able to switch into those source accounts/entities
- this switch happens inside the same web app/session

## Mental Model
- the intended interaction is closer to switching into a managed page/business account than opening a different product
- listener identity remains the base account
- source tools/features become available through source-account context

## Why
- the original listener-mobile / source-web split no longer maps cleanly to the rebuilt single-web-app product
- this lock keeps the system top-down and prevents route-by-route hacks from becoming the conceptual model
