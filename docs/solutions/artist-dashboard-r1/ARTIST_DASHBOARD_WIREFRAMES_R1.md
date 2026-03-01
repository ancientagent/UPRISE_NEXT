# Artist Dashboard Wireframes (R1, Low-Fi)

## Goal
Define low-fi content/layout for each menu before visual polish or component implementation.

## Global Shell
- Left rail nav (desktop) / bottom tab + drawer (mobile).
- Header:
  - current artist/band entity selector
  - scene context chip
  - entitlement chip (Standard/Premium)
- Right utility area:
  - notifications
  - account menu

## Screen 1: Overview
### Blocks
1. Entity Status strip
2. Slot usage card
3. Recent release health card
4. Events snapshot card
5. Registrar action-required card

### Primary actions
- Open Catalog
- Open Events
- Open Registrar

## Screen 2: Catalog
### Blocks
1. Filters row (status, release window)
2. Track table/list
3. Track detail side panel
4. Rotation context module (descriptive only)

### Primary actions
- Open track detail
- Open scene playback context

## Screen 3: Audience (Analytics)
### Blocks
1. KPI row (descriptive metrics)
2. Geography section (city/state/national)
3. Trend charts section
4. Premium-only panel block (gated)

### Primary actions
- Change window (7/30/90)
- Export descriptive report (future)

## Screen 4: Events
### Blocks
1. Upcoming/Past segmented list
2. Event detail drawer/panel
3. Attendance/proof summary
4. Print Shop linkage panel

### Primary actions
- Create event (when write API available)
- Manage event

## Screen 5: Promotions
### Blocks
1. Active campaigns list
2. Scope targeting summary
3. Spend/status summary
4. Offer preview module

### Primary actions
- Create campaign (planned)
- Edit campaign (planned)

## Screen 6: Registrar
### Blocks
1. Registration status timeline
2. Invite/member status table
3. Sync/finalize operational panel
4. Audit/status messages

### Primary actions
- Continue registration steps
- Resolve invite/member actions

## Screen 7: Team & Access
### Blocks
1. Linked members list
2. Role labels (read-only until contract lock)
3. Invite/access requests queue (planned)

### Primary actions
- View member details

## Screen 8: Settings
### Blocks
1. Profile and identity settings
2. Visibility/privacy settings
3. Entitlement/billing status section
4. Connected services (planned)

## State Specs (all screens)
- `loading`
- `empty`
- `error`
- `not_enabled` (planned feature / capability-gated)

## Mobile Notes
- Prioritize Overview, Catalog, Registrar as top tabs.
- Charts collapse into stacked cards.
- Long lists use paginated/incremental load.

## Immediate Next UX Slice Set
1. Build clickable low-fi prototypes in web route sandbox.
2. Founder walkthrough for content order and action priority.
3. Lock copy + field inventory before high-fidelity visual pass.
