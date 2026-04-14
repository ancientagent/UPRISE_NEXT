# MVP Action + System Matrix R1

 Status: Active
 Owner: Founder + product engineering
 Last updated: 2026-04-14

 Classification status: locked, spec/runtime reconciliation pending

 ## 1) Purpose
 Capture the current founder-locked action grammar and system map in one place so future work stops re-deriving:
 - what kind of thing a surface/entity/output is,
 - which actions apply to it,
 - which actions are live-platform actions versus Registrar-only prerequisites,
 - which known domains are current MVP, later-version, or still unresolved.

 This document is the current controlling lock for:
 - source families and source subtypes,
 - signal vs artifact vs event/object classification,
 - listener direct-action grammar,
 - Registrar-only prerequisite actions,
 - support/activity interpretation,
 - version-scoped known instances.

 ## 2) Authority And Reconciliation Rule
 For action grammar, ontology, and cross-system classification, apply this order:
 1. this document
 2. `docs/canon/*`
 3. active `docs/specs/*`
 4. older founder locks under `docs/solutions/*`
 5. current runtime/code evidence
 6. dated handoffs

 This override is necessary because several older active docs still reflect transitional assumptions, including:
 - `docs/solutions/MVP_SIGNAL_SYSTEM_CONTRACT_R1.md`
 - `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
 - `docs/specs/core/signals-and-universal-actions.md`
 - `docs/specs/events/events-and-flyers.md`
 - `docs/specs/system/registrar.md`

 ## 3) Core Model
 The system should be reasoned through these layers:

 ### 3.1 Identity / actor layers
 - `listener`
 - `source`

 ### 3.2 Source families
 - `creator`
 - `organizer`
 - `entity`
 - `scene body`

 ### 3.3 Output / object classes
 - `signal`
 - `artifact`
 - `event`
 - `social post`

 ### 3.4 Procedural / non-public system layers
 - `registrar prerequisite action`
 - `listener capability profile`
 - `derived support/backing state`

 ## 4) Source Family Matrix

 | Family | Current MVP subtypes | Later-version known subtypes | Notes |
 | --- | --- | --- | --- |
 | `creator` | `artist` | `ambassador` | Current version keeps active public creative source behavior under `artist`. `ambassador` is legitimate later-version scope, not current MVP. |
 | `organizer` | `promoter`, `organizing group` | — | Organizers are followable source identities that run events, updates, and donation lanes. |
 | `entity` | `business` | `venue` | Business exists as a known source type; wider business promo runtime remains deferred. |
 | `scene body` | `community`, `sect` | — | `community` is the broad place-level scene container. `sect` is the inner microgenre/microcurrent source inside a community. |

 ## 5) Source Subtype Rules

 ### 5.1 `community`
 - place-level scene source
 - broad genre/subgenre container
 - travelable/discoverable through the scene system
 - outer scene identity

 ### 5.2 `sect`
 - artist-based microcurrent source inside a community
 - not travel-targeted in the same way as a community
 - discovered after arrival / within the broader scene
 - recognition should be treated as status/lifecycle, not as a separate class

 ### 5.3 `artist`
 - current MVP creator subtype
 - exact cultural boundary beyond music is not fully locked
 - spoken word / poetry may fit here, but that should be validated with beta-community feedback rather than over-locked now

 ### 5.4 `organizing group`
 - followable source behind organizer-led efforts
 - donation lane belongs here
 - events or civic efforts should not be mistaken for the source itself when the organizing body is the ongoing identity

 ### 5.5 `business`
 - known source subtype
 - broader promo/offer runtime remains later-version
 - business-source mechanics should not be widened back into current MVP without an explicit activation pass

 ## 6) Output / Object Class Matrix

 | Class | Current MVP instances | Current meaning | Notes |
 | --- | --- | --- | --- |
 | `signal` | `single`, `Uprise` | broadcast/distribution outputs carried through explicit listener action | `Blast` is reserved to music-distribution signals. |
 | `artifact` | `flyer`, `poster`, `gear`, collectible visual outputs | collectible/displayable outputs | Some artifacts are displayable (`Rock`), some are redeemable/claim-shaped later. |
 | `event` | show, benefit show, afterparty, meet-and-greet | scene-bound scheduled object with calendar semantics | `Add` means add to calendar. Events are not sources. |
 | `social post` | posts, comments, replies | expressive social surfaces | `React` applies here. |

 ## 7) Current MVP Known Instances By Version

 ### 7.1 Current MVP active
 - `source > creator > artist`
 - `source > organizer > promoter`
 - `source > organizer > organizing group`
 - `source > entity > business`
 - `source > scene body > community`
 - `source > scene body > sect`
 - `signal > single`
 - `signal > Uprise`
 - `artifact > flyer`
 - `artifact > poster`
 - `artifact > gear`
 - `event > show`
 - `event > benefit show`
 - `event > afterparty`
 - `event > meet-and-greet`
 - `social post > post / comment / reply`

### 7.2 Later-version known
- `source > creator > ambassador`
- `source > entity > venue`
- business promo / redeemable offer artifacts
- civic / cause registrar lanes beyond current MVP activation
- wider non-music public creator source taxonomy
- profile-wall / artifact-grid expansion details

### 7.3 Current unresolved / beta-validated later
- exact boundary of `artist` beyond music
- whether spoken word / poetry should remain inside `artist` or receive a more explicit subtype in later taxonomy
- public-source promotion path for non-music contributors who currently start as listener-side capability profiles
- final public-model shape for causes once civic/cause work is reactivated beyond current MVP

 ## 8) Direct Listener Action Matrix

 | Action | Class targets | Current rule | Relationship required first? | Notes |
 | --- | --- | --- | --- | --- |
 | `Follow` | sources | direct live action | no | Source action only. |
 | `Donate` | source pages | direct live action | no | Donation belongs to the source page, not the event page. |
 | `Collect` | signals, artifacts | direct live action | no | General keep/save action. Acquisition method may vary by class or subtype. |
 | `Blast` | music-distribution signals | direct live action | no | Current blastable classes are `single` and `Uprise` only. |
 | `Recommend` | anything recommendable that the listener already genuinely holds in the system | direct live action | yes | For example: collected signals/artifacts, added events, followed sources where recommendation is allowed. No drive-by recommendation. |
 | `Rock` | collected displayable artifacts | direct live action | yes | Means public display on avatar/body or wall/grid, not mere possession. |
 | `Add` | events | direct live action | no | Event-specific only. Means add to calendar. |
 | `React` | posts, comments, replies | direct live action | no | Lightweight social response. Not a signal action. Not a source action. |

 ## 9) Registrar-Only Procedural Actions

 | Action | Applies to | Scope | Rule |
 | --- | --- | --- | --- |
 | `Back` | registrar-stage proposals / prerequisites | Registrar only | Procedural prerequisite action, not a permanent live-platform action. |

`Back` must not be confused with:
- source following,
- event-page interaction,
- feed/post reaction,
- support/backing as a durable public metric.

Current version note:
- civic/cause flows remain deferred from active MVP runtime even though the prerequisite/backing pattern is preserved here as part of the system map

 ## 10) Derived State

 ### `Support`
 `Support` is not a direct button in the intended model.

 `Support` should be treated as:
 - a tracked backing/activity state,
 - derived from meaningful participation over time,
 - useful for descriptive scene insight and fun statistics,
 - more meaningful than lightweight reaction counts.

 Inputs that can contribute to support later may include:
 - attendance
 - recommendation impact
 - blasts that lead to downstream listening/action
 - collected and rocked gear/artifacts
 - other verified participation and backing signals

 Current runtime note:
 - the repo still contains direct `SUPPORT` actions and counters
 - that is terminology/runtime debt against this lock

 ## 11) Artifact Rules

 ### 11.1 General artifact rule
 Artifacts are collectible outputs. They are not default music-distribution signals.

 ### 11.2 Flyer rule
 Flyers are:
 - `artifact`
 - event-bound
 - promoter-controlled in how they are obtained

 Flyers are collected through a claim/acquisition flow, commonly:
 - QR code at the stage
 - QR code at the bar
 - QR code at the door
 - other promoter-defined physical claim point

 Listener-facing action label remains:
 - `Collect`

 After collection:
 - flyer can enter the user’s artifact holdings
 - later wall/grid display may allow it to be `Rock`ed

 Flyer implication:
 - do not treat flyer as a default current MVP signal class
 - do not widen flyer into blast parity

 ## 12) Event Rules

 Events are:
 - objects, not sources
 - scene-bound scheduled things with their own page/lifecycle
 - calendar-oriented, not blast-oriented

 Current event-type examples:
 - show
 - benefit show
 - afterparty
 - meet-and-greet

 Shared event rule:
 - event subtype changes access rules and emitted artifacts
 - event subtype does not require a new top-level class

 Example:
 - afterparty and meet-and-greet remain `event` types
 - what changes is access, collectible output, and event details

 ## 13) Registrar Boundary

 Registrar is listener-side.

 That means:
 - listeners use Registrar as themselves
 - listeners who are also in bands still use Registrar as their listener/base identity
 - there is no reason for a band/source account to treat Registrar as its native operating surface

 Current runtime/spec drift:
 - the repo still contains source-facing registrar bridge language and route access
 - that should be treated as transitional/runtime drift to reconcile, not as the target system model

 ## 14) Listener Capability Layer

 Current intended listener-side capability examples:
 - instruments played
 - what kind of music they want to play
 - whether they want to:
   - start a band
   - join a band
   - record
   - fill in

 Current intended non-music contributor capability examples:
 - photography
 - videography
 - design
 - other service/help roles

 Rule:
 - these capability declarations begin on the listener side
 - do not prematurely force every contributor role into an active source account in current MVP

 ## 15) Feed / Update Matrix

 | Surface type | What action belongs there | What does not belong there |
 | --- | --- | --- |
 | source pages | `Follow`, `Donate` | source-level `Blast`, source-level generic signal buttons |
 | signal rows/cards | `Collect`, `Blast`, `Recommend` where allowed | source-follow grammar |
 | event surfaces | `Add` to calendar | blast semantics |
 | artifact surfaces | `Collect`, `Rock` where displayable, `Recommend` if genuinely held | default blast semantics |
 | posts/comments/replies | `React` | do not use `Support` to stand in for lightweight response behavior |

 ## 16) Versioned Action / Domain Notes

 ### 16.1 Current MVP
 - `Blast` is music-only.
 - `Collect` is the general keep/save verb for signals and artifacts.
 - `Add` is reserved to calendar/event behavior.
 - `React` belongs to feed-style social expression.
 - `Support` is not a direct action in the intended model.
 - `flyer` is artifact-first and event-bound.
 - business promo/offer mechanics are not part of the current active version.

 ### 16.2 Later-version known
 - business redeemable promo artifacts
 - `creator > ambassador`
 - `entity > venue`
 - expanded visual contributor source lanes
 - richer artifact wall/grid systems

 ## 17) Current Repo Drift Audit
 These are the biggest known mismatches between current intended truth and existing repo surfaces/contracts.

 1. `support` is still implemented as a direct runtime action in multiple places.
 2. active signal docs still describe `flyer` as a confirmed signal class.
 3. older docs still describe events as sources in some places.
 4. older founder locks still carry the earlier `cause` lifecycle framing.
 5. Registrar docs/runtime still imply source-side bridge ownership that conflicts with the intended listener-side model.
 6. current runtime/spec language still uses `ADD` where the intended long-term verb is `Collect` for signals/artifacts.

 ## 18) Reconciliation Order
 Future implementation/doc reconciliation should proceed in this order:
 1. direct action grammar (`Collect`, `React`, `Support` debt)
 2. source vs signal vs artifact vs event taxonomy in active specs
 3. Registrar actor-boundary cleanup
 4. flyer/event collection and artifact language
 5. later-version contributor/ambassador/business promo expansion

 ## 19) What This Document Explicitly Does Not Imply
 - it does not mean all terminology debt is already implemented
 - it does not activate business promos in current MVP
 - it does not activate ambassador runtime in current MVP
 - it does not fully settle spoken word taxonomy beyond “do not over-lock before beta feedback”
 - it does not make `Support` a finished metric system yet

 ## 20) Where Future Agents Should Look First
 For this topic, start here before using older specs:
 - `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`

 Then reconcile against:
 - `docs/solutions/MVP_SIGNAL_SYSTEM_CONTRACT_R1.md`
 - `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
 - `docs/specs/core/signals-and-universal-actions.md`
 - `docs/specs/events/events-and-flyers.md`
 - `docs/specs/system/registrar.md`
