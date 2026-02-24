type RegistrarHttpMethod = 'GET' | 'POST';

type RegistrarContractStatus = 'implemented' | 'gap';

type RegistrarGapKind = 'web_surface_missing' | 'api_not_available' | 'field_not_rendered';

export interface RegistrarWebEndpointContract {
  id: string;
  method: RegistrarHttpMethod;
  pathTemplate: string;
  status: RegistrarContractStatus;
  webConsumerPath: string | null;
  gapKind: RegistrarGapKind | null;
  notes: string;
}

export interface RegistrarWebFieldGap {
  id: string;
  endpointId: string;
  fieldPath: string;
  gapKind: Extract<RegistrarGapKind, 'field_not_rendered'>;
  notes: string;
}

const APP_REGISTRAR_PAGE = 'apps/web/src/app/registrar/page.tsx';

export const REGISTRAR_WEB_ENDPOINT_CONTRACTS: readonly RegistrarWebEndpointContract[] = [
  {
    id: 'registrar.artist.submit',
    method: 'POST',
    pathTemplate: '/registrar/artist',
    status: 'implemented',
    webConsumerPath: APP_REGISTRAR_PAGE,
    gapKind: null,
    notes: 'Artist/Band registration submit flow.',
  },
  {
    id: 'registrar.artist.entries.list',
    method: 'GET',
    pathTemplate: '/registrar/artist/entries',
    status: 'implemented',
    webConsumerPath: APP_REGISTRAR_PAGE,
    gapKind: null,
    notes: 'Submitter-owned Artist/Band registration list.',
  },
  {
    id: 'registrar.artist.entry.materialize',
    method: 'POST',
    pathTemplate: '/registrar/artist/:entryId/materialize',
    status: 'implemented',
    webConsumerPath: APP_REGISTRAR_PAGE,
    gapKind: null,
    notes: 'Explicit registrar materialization action.',
  },
  {
    id: 'registrar.artist.entry.dispatch_invites',
    method: 'POST',
    pathTemplate: '/registrar/artist/:entryId/dispatch-invites',
    status: 'implemented',
    webConsumerPath: APP_REGISTRAR_PAGE,
    gapKind: null,
    notes: 'Queues invite delivery rows for non-platform members.',
  },
  {
    id: 'registrar.artist.entry.sync_members',
    method: 'POST',
    pathTemplate: '/registrar/artist/:entryId/sync-members',
    status: 'implemented',
    webConsumerPath: APP_REGISTRAR_PAGE,
    gapKind: null,
    notes: 'Submitter-driven canonical member sync action.',
  },
  {
    id: 'registrar.artist.entry.invites',
    method: 'GET',
    pathTemplate: '/registrar/artist/:entryId/invites',
    status: 'implemented',
    webConsumerPath: APP_REGISTRAR_PAGE,
    gapKind: null,
    notes: 'Invite lifecycle summary and member roster read.',
  },
  {
    id: 'registrar.promoter.submit',
    method: 'POST',
    pathTemplate: '/registrar/promoter',
    status: 'gap',
    webConsumerPath: null,
    gapKind: 'web_surface_missing',
    notes: 'API exists; web registrar surface does not yet expose promoter registration.',
  },
  {
    id: 'registrar.promoter.entries.list',
    method: 'GET',
    pathTemplate: '/registrar/promoter/entries',
    status: 'gap',
    webConsumerPath: null,
    gapKind: 'web_surface_missing',
    notes: 'API exists; submitter-owned promoter status list is not wired on web.',
  },
  {
    id: 'registrar.promoter.entry.detail',
    method: 'GET',
    pathTemplate: '/registrar/promoter/:entryId',
    status: 'gap',
    webConsumerPath: null,
    gapKind: 'web_surface_missing',
    notes: 'API exists; promoter detail read is not wired on web.',
  },
  {
    id: 'registrar.promoter.entry.capability_audit',
    method: 'GET',
    pathTemplate: '/registrar/promoter/:entryId/capability-audit',
    status: 'gap',
    webConsumerPath: null,
    gapKind: 'web_surface_missing',
    notes: 'API exists; promoter capability audit read is not wired on web.',
  },
  {
    id: 'auth.invite.preview',
    method: 'POST',
    pathTemplate: '/auth/invite-preview',
    status: 'gap',
    webConsumerPath: null,
    gapKind: 'web_surface_missing',
    notes: 'Invite claim preview exists in API; no web claim flow uses it yet.',
  },
  {
    id: 'auth.invite.register',
    method: 'POST',
    pathTemplate: '/auth/register-invite',
    status: 'gap',
    webConsumerPath: null,
    gapKind: 'web_surface_missing',
    notes: 'Invite-token registration exists in API; no web claim flow uses it yet.',
  },
  {
    id: 'registrar.project.submit',
    method: 'POST',
    pathTemplate: '/registrar/project',
    status: 'gap',
    webConsumerPath: null,
    gapKind: 'api_not_available',
    notes: 'Spec-authorized endpoint remains deferred and unavailable for web wiring.',
  },
  {
    id: 'registrar.sect_motion.submit',
    method: 'POST',
    pathTemplate: '/registrar/sect-motion',
    status: 'gap',
    webConsumerPath: null,
    gapKind: 'api_not_available',
    notes: 'Spec-authorized endpoint remains deferred and unavailable for web wiring.',
  },
  {
    id: 'registrar.code.issue',
    method: 'POST',
    pathTemplate: 'TBD_REGISTRAR_CODE_ISSUE_ENDPOINT',
    status: 'gap',
    webConsumerPath: null,
    gapKind: 'api_not_available',
    notes: 'RegistrarCode issue endpoint path is not published yet; web keeps typed scaffolding only.',
  },
  {
    id: 'registrar.code.verify',
    method: 'POST',
    pathTemplate: '/registrar/code/verify',
    status: 'gap',
    webConsumerPath: null,
    gapKind: 'web_surface_missing',
    notes: 'API exists; web registrar surface does not yet expose code verification flow.',
  },
  {
    id: 'registrar.code.redeem',
    method: 'POST',
    pathTemplate: '/registrar/code/redeem',
    status: 'gap',
    webConsumerPath: null,
    gapKind: 'web_surface_missing',
    notes: 'API exists; web registrar surface does not yet expose code redemption flow.',
  },
];

export const REGISTRAR_WEB_FIELD_GAPS: readonly RegistrarWebFieldGap[] = [
  {
    id: 'registrar.artist.entries.sentInviteCount',
    endpointId: 'registrar.artist.entries.list',
    fieldPath: 'entries[].sentInviteCount',
    gapKind: 'field_not_rendered',
    notes: 'API includes sent invite counts; current web summary does not render them.',
  },
  {
    id: 'registrar.artist.entries.failedInviteCount',
    endpointId: 'registrar.artist.entries.list',
    fieldPath: 'entries[].failedInviteCount',
    gapKind: 'field_not_rendered',
    notes: 'API includes failed invite counts; current web summary does not render them.',
  },
  {
    id: 'registrar.artist.entry.invites.delivery_status',
    endpointId: 'registrar.artist.entry.invites',
    fieldPath: 'members[].deliveryStatus | members[].sentAt | members[].failedAt',
    gapKind: 'field_not_rendered',
    notes: 'Invite member delivery outcomes are available but not surfaced in current web UI.',
  },
];

function requireEntryId(entryId: string): string {
  const normalized = entryId.trim();
  if (!normalized) {
    throw new Error('Registrar entryId is required');
  }
  return normalized;
}

export const registrarArtistEndpoints = {
  submit: () => '/registrar/artist',
  listEntries: () => '/registrar/artist/entries',
  materialize: (entryId: string) => `/registrar/artist/${requireEntryId(entryId)}/materialize`,
  dispatchInvites: (entryId: string) => `/registrar/artist/${requireEntryId(entryId)}/dispatch-invites`,
  syncMembers: (entryId: string) => `/registrar/artist/${requireEntryId(entryId)}/sync-members`,
  inviteStatus: (entryId: string) => `/registrar/artist/${requireEntryId(entryId)}/invites`,
} as const;

export const registrarCodeEndpoints = {
  verify: () => '/registrar/code/verify',
  redeem: () => '/registrar/code/redeem',
} as const;

export const registrarPromoterEndpoints = {
  submit: () => '/registrar/promoter',
  listEntries: () => '/registrar/promoter/entries',
  detail: (entryId: string) => `/registrar/promoter/${requireEntryId(entryId)}`,
  capabilityAudit: (entryId: string) => `/registrar/promoter/${requireEntryId(entryId)}/capability-audit`,
} as const;

export function getRegistrarWebGapContracts(): RegistrarWebEndpointContract[] {
  return REGISTRAR_WEB_ENDPOINT_CONTRACTS.filter((contract) => contract.status === 'gap');
}

export function getRegistrarWebImplementedContracts(): RegistrarWebEndpointContract[] {
  return REGISTRAR_WEB_ENDPOINT_CONTRACTS.filter((contract) => contract.status === 'implemented');
}
