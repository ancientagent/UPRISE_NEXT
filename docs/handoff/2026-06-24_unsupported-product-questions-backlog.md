# Unsupported Product Questions Backlog

Status: working backlog / not product authority
Date: 2026-06-24
Branch context: docs/abacus-fusion-swarm-strategy

## Purpose

This note keeps open UPRISE product/architecture questions handy while founder clarification is still in progress.

These questions are not implementation permission. If an item is answered later, promote the answer into the active owning spec/brief and remove or mark the question resolved in this backlog.

## Recently Resolved In Active Docs

- New Home Scene activation requires at least `45` minutes of approved playable music from at least `5` distinct registered source accounts.
- No single source may occupy more than `20` minutes of any one Uprise rotation at a time.
- Artist/Band source registration requires the registering user to be GPS-verified.
- Same-state proxy assignment is required when any same-state active major-node exists for the selected music community.
- Proxy votes/history stay with the proxy scene/tier where they occurred.
- Existing proxy-scene songs finish their current lifecycle; songs cannot be actively listed in multiple Uprise rotations at once.
- Sect affiliation belongs in Registrar, not loose profile tags.
- Official Sects are pre-Uprise Registrar-recognized subcommunities.
- Official Sect update channels are source/system update channels, not open member chat.
- Sect Uprises mirror Home Scene behavior wherever possible while staying inside the parent Home Scene/music community.
- Sect members can vote in their Sect Uprise; listening access alone does not grant sect voting authority.

## Home Scene Activation / Proxy Assignment

1. What is the exact Registrar approval/confirmation path after a natural Home Scene reaches the `45` minute / `5` source threshold?
2. Who can approve or finalize the new Home Scene activation: automated system, registrar admin, local source operators, founder/admin, or a combination?
3. What source/operator notification fires when a natural Home Scene reaches activation threshold?
4. What listener notification fires when their natural Home Scene becomes active and they are transferred from a proxy scene?
5. Should the transfer happen immediately at activation or at the next rotation boundary?
6. Should users be able to decline transfer to their natural Home Scene, or is transfer mandatory with the proxy scene retained as a saved/visitor scene?
7. Should source operators be able to delay new-scene activation if their active songs are still in proxy lifecycle?
8. What exact state names should replace legacy `pioneer` / `pioneerHomeScene` runtime terminology?
9. What UI copy should explain proxy assignment without implying a listener activation queue?
10. What is the edge-case policy for statewide origin/identity when cross-state proxy assignment was unavoidable?
11. If a cross-state proxy source/song advances to statewide, which state owns the statewide identity for that lifecycle?
12. Should cross-state proxy assignment require an explicit warning to the user/source operator?
13. Should cross-state proxy assignment be logged as an auditable exception?

## Source / Release Deck / Rotation Inclusion

14. What is the exact lifecycle length for a proxy-scene song before it can be reused in the new natural Home Scene?
15. What counts as "currently listed anywhere else" for the no-double-active-listing rule: New Releases pool only, Main Rotation pool, state/national tiers, archived lifecycle entries, or all active rotation entries?
16. Can an artist/source swap active songs before lifecycle end, or is removal/cooldown required?
17. If a song is removed mid-lifecycle, when can it be listed again in any Uprise rotation?
18. How should source active-catalog selection be represented in the Source Dashboard UI?
19. Does the `20` minute per-source rotation cap apply separately per Uprise rotation, per tier, or globally across active rotations?
20. Should source profile only show active rotation songs, or can it show non-rotation catalog in a future separate section?
21. What moderation/quality approval state is required before a song counts toward `45` minutes?
22. What happens if an active source is suspended after its songs helped activate a Home Scene?

## Official Sects / Sect Affiliation

23. What exact threshold makes a sect an Official Sect?
24. Is the Official Sect threshold purely member-affiliation count, source-affiliation count, moderator approval, or a hybrid?
25. Should Official Sect creation require name moderation before appearing in Registrar?
26. Are Official Sect names free-form, selected from a taxonomy, or proposed with alias/merge review?
27. How are duplicate Official Sect proposals merged?
28. Can a user affiliate with multiple Official Sects in the same Home Scene?
29. Can a source account affiliate with multiple Official Sects in the same Home Scene?
30. Should Official Sect affiliation be limited to rooted Home Scene members, or can visitors affiliate as non-voting followers?
31. Can a user leave/unaffiliate from an Official Sect freely?
32. Is there a cooldown for joining/leaving Official Sects to prevent spam?
33. What visible profile/identity marker, if any, shows a user's Official Sect affiliations?
34. Should Official Sect affiliation affect recommendations/discovery labels, or only Registrar/community identity?
35. What happens if an Official Sect drops below its official threshold?
36. Can an Official Sect be retired, merged, renamed, or archived?

## Sect Uprises / Sect Broadcast

37. What exact maturity milestone must a parent Home Scene meet before Sect Uprise creation can unlock?
38. Does the Sect Uprise `45` minute threshold require the same `5` distinct registered-source account minimum as city Home Scene activation?
39. Does the `20` minute per-source cap apply to Sect Uprise rotations exactly as it does to parent Uprise rotations?
40. Can a song be active in the parent Uprise and Sect Uprise at the same time?
41. If a song moves from parent Uprise to Sect Uprise, does it finish parent lifecycle first?
42. Can a Sect Uprise advance to state/national tiers?
43. If Sect Uprises advance, do they advance inside a sect-specific tier path or through the parent music-community tier path?
44. Does voting in a Sect Uprise require GPS plus sect membership, or sect membership alone?
45. If Sect voting mirrors Home Scene voting, what location/geofence anchors the sect vote?
46. Can non-members listen to Sect Uprises through Discover if they cannot vote?
47. What happens if a Sect Uprise drops below the `45` minute playable threshold?
48. Does a Sect Uprise pause, enter low-catalog state, or continue until a defined lifecycle boundary?
49. Can a Sect Uprise become a full parent music community later?
50. If multiple cities have the same Official Sect, when does that sect become cross-scene/cross-city visible?

## Official Sect Channels / Updates

51. What surfaces show Official Sect updates: Registrar only, Feed, dedicated channel view, source dashboard, notifications, or some combination?
52. What source accounts can post in an Official Sect updates channel: any source affiliated with the sect, only sources with active songs, or only approved moderators/source operators?
53. What system updates appear in an Official Sect channel?
54. Are Official Sect updates visible to all Home Scene members or only sect affiliates?
55. Can non-member listeners see Official Sect updates when listening to a Sect Uprise?
56. What moderation model applies to Official Sect source updates?
57. Do Official Sect updates appear in the main Feed, or would that overload the parent Home Scene?
58. Are Official Sect channels part of the current MVP, beta-only, or post-beta social work?
59. How do Official Sect update channels relate to the deferred source posts/messages system?
60. Should Official Sect updates have notification controls per user?

## Registrar / Governance

61. What Registrar entry types are needed for Official Sect affiliation, Official Sect recognition, Sect Uprise motion, and new Home Scene activation?
62. Which Registrar actions are user-owned versus source-owned versus system/admin-owned?
63. What records must be auditable for Home Scene activation and Sect Uprise activation?
64. Should Registrar show active official sects only in the current Home Scene or globally by parent music community?
65. Should Registrar show where a sect has already uprisen even outside the user's current scene?
66. What does Registrar show for inactive/proxy users whose natural Home Scene is not active yet?
67. What are the status states for Official Sect and Sect Uprise flows?
68. What appeal/moderation path exists for rejected sect names, duplicate merges, or abusive affiliation?
69. Can source operators trigger Registrar actions from Source Dashboard, or must they return to listener-side Registrar?

## Discovery / Archive / Metrics

70. Should Discover expose Official Sects, Sect Uprises, or only active Uprises?
71. Should Archive display Official Sect growth milestones?
72. Should Archive display Sect Uprise launch history and threshold history?
73. What metrics show Home Scene activation readiness?
74. What metrics show Sect readiness?
75. Which readiness metrics are public, admin-only, source-only, or hidden?
76. What privacy floor applies before member/source counts are shown for Official Sects?
77. Should users see "near threshold" prompts for Home Scene activation or Sect activation?
78. Should source operators see more readiness detail than listeners?
79. How are proxy-scene historical votes displayed after a natural Home Scene activates?
80. How are songs that advanced from proxy lifecycle represented in Archive?

## Fair Play / Tier Propagation

81. What is the final City -> State propagation threshold formula?
82. What is the final State -> National propagation threshold formula?
83. What is the minimum active lifecycle age before any song can graduate tiers?
84. What cap applies to how many songs can graduate per run?
85. What happens to tied songs at Top 40 or threshold boundaries?
86. What is the low-performing song floor/removal policy?
87. How does lifecycle handling differ between New Releases and Main Rotation?
88. Should Sect Uprises use the exact same Fair Play two-pool model?
89. What recurrence-weight mapping is final for Main Rotation?
90. What lifecycle/cooldown applies when a source removes and re-adds songs?

## Business / Paid Capability Boundaries

91. **Superseded:** the corrected Sect model has listener requests and
    Registrar-held Artist/Band membership, not purchasable per-song or
    source-capacity backing. Do not build the former paid-backing premise.
92. **Superseded with 91.**
93. **Superseded with 91.**
94. Is the paid `4th` Release Deck ad slot ever allowed inside Sect Uprise contexts?
95. Can businesses sponsor Official Sect update channels without affecting Fair Play?
96. What paid visibility is allowed around sects without becoming pay-for-placement?

## Runtime / Data Model

97. What concrete models represent Official Sect, sect affiliation, sect source backing, readiness minutes, update channels, and Sect Uprise lifecycle?
98. Does `Community` remain the only active city-tier scene model, or do Sect Uprises need separate persistence before beta?
99. How should legacy `SectTag` / `UserTag` tables be migrated or wrapped so they are not mistaken for official affiliation?
100. What background job computes Home Scene activation readiness?
101. What background job computes Sect readiness?
102. What events should be emitted when thresholds are reached?
103. What data must be backfilled when a proxy scene splits into a natural Home Scene?
104. How do we avoid one-off logic for specific genres or cities while supporting niche sect behavior?

## Build / Phase Questions

105. What parts of sect readiness should be built now but hidden?
106. What parts should wait until beta-community calibration?
107. What test fixtures are safe for sect readiness without creating fake product truth?
108. What minimum implementation is needed to avoid painting the architecture into a corner?
109. What design-agent screens need to understand Official Sect versus Sect Uprise?
110. What should Cloud Codex audit next: Registrar IA, Fair Play tier propagation, or source/Sect data modeling?
