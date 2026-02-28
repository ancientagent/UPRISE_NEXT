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
  deferredAdminLifecycle?: 'action_gated';
  notes: string;
}

export interface RegistrarWebFieldGap {
  id: string;
  endpointId: string;
  fieldPath: string;
  gapKind: Extract<RegistrarGapKind, 'field_not_rendered'>;
  notes: string;
}

export interface MvpFlowRouteContract {
  id: 'onboarding_home_scene' | 'plot_scene_dashboard' | 'registrar_scene_actions';
  webRoute: '/onboarding' | '/plot' | '/registrar';
  apiDependencies: readonly string[];
  notes: string;
}

const APP_REGISTRAR_PAGE = 'apps/web/src/app/registrar/page.tsx';
const ACTION_GATED_API_AVAILABLE_NOTE = 'API available; web surface remains action-gated.';
const ACTION_GATED_API_READ_IMPLEMENTED_NOTE =
  'API read path implemented; web surface remains action-gated with typed client scaffolding only.';
const ACTION_GATED_ADMIN_READ_NOTE =
  'API available; deferred admin-lifecycle read surface remains action-gated on web.';
const ACTION_GATED_ADMIN_AUDIT_NOTE =
  'API available; deferred admin-lifecycle audit read surface remains action-gated on web.';

export const MVP_FLOW_ROUTE_CONTRACTS: readonly MvpFlowRouteContract[] = [
  {
    id: 'onboarding_home_scene',
    webRoute: '/onboarding',
    apiDependencies: ['/onboarding/home-scene', '/onboarding/gps-verify', '/communities/resolve-home'],
    notes: 'Home Scene resolution and GPS eligibility feed Plot and Registrar dependencies.',
  },
  {
    id: 'plot_scene_dashboard',
    webRoute: '/plot',
    apiDependencies: ['/communities/resolve-home'],
    notes: 'Plot route depends on resolved Home Scene context before scene-scoped reads.',
  },
  {
    id: 'registrar_scene_actions',
    webRoute: '/registrar',
    apiDependencies: ['/onboarding/home-scene', '/onboarding/gps-verify', '/registrar/artist'],
    notes: 'Registrar submit flow depends on scene-scoped onboarding + GPS eligibility context.',
  },
] as const;

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
    notes: ACTION_GATED_API_AVAILABLE_NOTE,
  },
  {
    id: 'registrar.promoter.entries.list',
    method: 'GET',
    pathTemplate: '/registrar/promoter/entries',
    status: 'gap',
    webConsumerPath: null,
    gapKind: 'web_surface_missing',
    deferredAdminLifecycle: 'action_gated',
    notes: ACTION_GATED_ADMIN_READ_NOTE,
  },
  {
    id: 'registrar.promoter.entry.detail',
    method: 'GET',
    pathTemplate: '/registrar/promoter/:entryId',
    status: 'gap',
    webConsumerPath: null,
    gapKind: 'web_surface_missing',
    deferredAdminLifecycle: 'action_gated',
    notes: ACTION_GATED_ADMIN_READ_NOTE,
  },
  {
    id: 'registrar.promoter.entry.capability_audit',
    method: 'GET',
    pathTemplate: '/registrar/promoter/:entryId/capability-audit',
    status: 'gap',
    webConsumerPath: null,
    gapKind: 'web_surface_missing',
    deferredAdminLifecycle: 'action_gated',
    notes: ACTION_GATED_ADMIN_AUDIT_NOTE,
  },
  {
    id: 'auth.invite.preview',
    method: 'POST',
    pathTemplate: '/auth/invite-preview',
    status: 'gap',
    webConsumerPath: null,
    gapKind: 'web_surface_missing',
    notes: ACTION_GATED_API_AVAILABLE_NOTE,
  },
  {
    id: 'auth.invite.register',
    method: 'POST',
    pathTemplate: '/auth/register-invite',
    status: 'gap',
    webConsumerPath: null,
    gapKind: 'web_surface_missing',
    notes: ACTION_GATED_API_AVAILABLE_NOTE,
  },
  {
    id: 'registrar.project.submit',
    method: 'POST',
    pathTemplate: '/registrar/project',
    status: 'gap',
    webConsumerPath: null,
    gapKind: 'web_surface_missing',
    notes: ACTION_GATED_API_AVAILABLE_NOTE,
  },
  {
    id: 'registrar.project.entries.list',
    method: 'GET',
    pathTemplate: '/registrar/project/entries',
    status: 'gap',
    webConsumerPath: null,
    gapKind: 'web_surface_missing',
    notes: ACTION_GATED_API_READ_IMPLEMENTED_NOTE,
  },
  {
    id: 'registrar.project.entry.detail',
    method: 'GET',
    pathTemplate: '/registrar/project/:entryId',
    status: 'gap',
    webConsumerPath: null,
    gapKind: 'web_surface_missing',
    notes: ACTION_GATED_API_READ_IMPLEMENTED_NOTE,
  },
  {
    id: 'registrar.sect_motion.submit',
    method: 'POST',
    pathTemplate: '/registrar/sect-motion',
    status: 'gap',
    webConsumerPath: null,
    gapKind: 'web_surface_missing',
    notes: ACTION_GATED_API_AVAILABLE_NOTE,
  },
  {
    id: 'registrar.sect_motion.entries.list',
    method: 'GET',
    pathTemplate: '/registrar/sect-motion/entries',
    status: 'gap',
    webConsumerPath: null,
    gapKind: 'web_surface_missing',
    notes: ACTION_GATED_API_READ_IMPLEMENTED_NOTE,
  },
  {
    id: 'registrar.sect_motion.entry.detail',
    method: 'GET',
    pathTemplate: '/registrar/sect-motion/:entryId',
    status: 'gap',
    webConsumerPath: null,
    gapKind: 'web_surface_missing',
    notes: ACTION_GATED_API_READ_IMPLEMENTED_NOTE,
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
    notes: ACTION_GATED_API_AVAILABLE_NOTE,
  },
  {
    id: 'registrar.code.redeem',
    method: 'POST',
    pathTemplate: '/registrar/code/redeem',
    status: 'gap',
    webConsumerPath: null,
    gapKind: 'web_surface_missing',
    notes: ACTION_GATED_API_AVAILABLE_NOTE,
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

function createRegistrarReadScopedEndpoints(scope: string) {
  const basePath = `/registrar/${scope}`;
  return {
    submit: () => basePath,
    listEntries: () => `${basePath}/entries`,
    detailPath: (entryId: string) => `${basePath}/${requireEntryId(entryId)}`,
  } as const;
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

const promoterScopedEndpoints = createRegistrarReadScopedEndpoints('promoter');
export const registrarPromoterEndpoints = {
  submit: promoterScopedEndpoints.submit,
  listEntries: promoterScopedEndpoints.listEntries,
  detail: promoterScopedEndpoints.detailPath,
  capabilityAudit: (entryId: string) => `/registrar/promoter/${requireEntryId(entryId)}/capability-audit`,
} as const;

const projectScopedEndpoints = createRegistrarReadScopedEndpoints('project');
export const registrarProjectEndpoints = {
  submit: projectScopedEndpoints.submit,
  listEntries: projectScopedEndpoints.listEntries,
  detail: projectScopedEndpoints.detailPath,
} as const;

const sectMotionScopedEndpoints = createRegistrarReadScopedEndpoints('sect-motion');
export const registrarSectMotionEndpoints = {
  submit: sectMotionScopedEndpoints.submit,
  listEntries: sectMotionScopedEndpoints.listEntries,
  detail: sectMotionScopedEndpoints.detailPath,
} as const;
export function getRegistrarWebGapContracts(): RegistrarWebEndpointContract[] {
  return REGISTRAR_WEB_ENDPOINT_CONTRACTS.filter((contract) => contract.status === 'gap');
}

export function getRegistrarWebImplementedContracts(): RegistrarWebEndpointContract[] {
  return REGISTRAR_WEB_ENDPOINT_CONTRACTS.filter((contract) => contract.status === 'implemented');
}
