import { api } from '@/lib/api';
import type { ArtistBandRegistrationPayload } from '@/lib/registrar/artistRegistration';
import {
  registrarArtistEndpoints,
  registrarCodeEndpoints,
  registrarProjectEndpoints,
  registrarPromoterEndpoints,
  registrarSectMotionEndpoints,
} from '@/lib/registrar/contractInventory';

export interface RegistrarSceneSummary {
  id: string;
  name: string;
  city: string;
  state: string;
  musicCommunity: string;
  tier: 'city' | 'state' | 'national';
}

type RegistrarEntryStatus = 'submitted' | 'approved' | 'rejected' | 'materialized' | string;
type RegistrarInviteMemberStatus = 'pending_email' | 'queued' | 'sent' | 'failed' | 'claimed' | 'existing_user';
type RegistrarInviteDeliveryStatus = 'queued' | 'sent' | 'failed';

export interface RegistrarArtistEntry {
  id: string;
  type: 'artist_band_registration';
  status: RegistrarEntryStatus;
  sceneId: string;
  artistBandId: string | null;
  payload: {
    name: string | null;
    slug: string | null;
    entityType: 'artist' | 'band' | null;
  };
  scene: RegistrarSceneSummary;
  artistBand: {
    id: string;
    name: string;
    slug: string;
    entityType: 'artist' | 'band';
  } | null;
  memberCount: number;
  pendingInviteCount: number;
  queuedInviteCount: number;
  sentInviteCount: number;
  failedInviteCount: number;
  claimedCount: number;
  existingUserCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrarArtistEntriesResponse {
  total: number;
  entries: RegistrarArtistEntry[];
}

export interface RegistrarArtistRegistrationResponse {
  id: string;
  memberCount: number;
  pendingInviteCount: number;
  existingMemberCount: number;
}
export type RegistrarArtistRegistrationResult = RegistrarArtistRegistrationResponse;

export interface RegistrarProjectRegistrationPayload {
  sceneId: string;
  projectName: string;
}

export interface RegistrarProjectRegistrationResponse {
  id: string;
  type: 'project_registration';
  status: RegistrarEntryStatus;
  sceneId: string;
  createdById: string;
  payload: {
    projectName: string | null;
  };
  createdAt: string;
}
export type RegistrarProjectRegistrationResult = RegistrarProjectRegistrationResponse;

export interface RegistrarProjectEntry {
  id: string;
  type: 'project_registration';
  status: RegistrarEntryStatus;
  sceneId: string;
  payload: {
    projectName: string | null;
  };
  scene: RegistrarSceneSummary | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrarProjectEntriesResponse {
  total: number;
  countsByStatus: Record<string, number>;
  entries: RegistrarProjectEntry[];
}

export interface RegistrarSectMotionEntry {
  id: string;
  type: 'sect_motion';
  status: RegistrarEntryStatus;
  sceneId: string;
  payload: Record<string, unknown>;
  scene: RegistrarSceneSummary | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrarSectMotionEntriesResponse {
  total: number;
  countsByStatus: Record<string, number>;
  entries: RegistrarSectMotionEntry[];
}

export interface RegistrarArtistInviteStatusMember {
  id: string;
  name: string;
  email: string;
  city: string;
  instrument: string;
  inviteStatus: RegistrarInviteMemberStatus;
  existingUserId: string | null;
  claimedUserId: string | null;
  inviteTokenExpiresAt: string | null;
  deliveryStatus: RegistrarInviteDeliveryStatus | null;
  sentAt: string | null;
  failedAt: string | null;
}

export interface RegistrarArtistInviteStatusResponse {
  registrarEntryId: string;
  totalMembers: number;
  countsByStatus: Partial<Record<RegistrarInviteMemberStatus, number>>;
  members: RegistrarArtistInviteStatusMember[];
}

export interface RegistrarArtistDispatchInvitesResponse {
  registrarEntryId: string;
  queuedCount: number;
}
export type RegistrarArtistDispatchInvitesResult = RegistrarArtistDispatchInvitesResponse;

export interface RegistrarArtistSyncMembersResponse {
  registrarEntryId: string;
  artistBandId: string;
  eligibleMemberCount: number;
  createdMemberCount: number;
  skippedMemberCount: number;
}
export type RegistrarArtistSyncMembersResult = RegistrarArtistSyncMembersResponse;

export interface RegistrarPromoterEntry {
  id: string;
  type: 'promoter_registration';
  status: RegistrarEntryStatus;
  sceneId: string;
  payload: {
    productionName: string | null;
  };
  promoterCapability: {
    codeIssuedCount: number;
    latestCodeStatus: string | null;
    latestCodeIssuedAt: string | null;
    latestCodeRedeemedAt: string | null;
    granted: boolean;
    grantedAt: string | null;
  };
  scene: RegistrarSceneSummary | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrarPromoterEntriesResponse {
  total: number;
  countsByStatus: Record<string, number>;
  entries: RegistrarPromoterEntry[];
}

export interface RegistrarPromoterRegistrationPayload {
  sceneId: string;
  productionName: string;
}

export interface RegistrarPromoterRegistrationResponse {
  id: string;
  type: 'promoter_registration';
  status: RegistrarEntryStatus;
  sceneId: string;
  createdById: string;
  payload: {
    productionName: string | null;
  };
  createdAt: string;
}
export type RegistrarPromoterRegistrationResult = RegistrarPromoterRegistrationResponse;

export interface RegistrarPromoterCapabilityAuditEvent {
  id: string;
  action: string;
  actorType: string;
  targetUserId: string | null;
  actorUserId: string | null;
  registrarCodeId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface RegistrarPromoterCapabilityAuditResponse {
  registrarEntryId: string;
  total: number;
  events: RegistrarPromoterCapabilityAuditEvent[];
}

export interface RegistrarCodeIssueResponse {
  id: string;
  registrarEntryId: string;
  capability: string;
  issuerType: 'system';
  status: 'issued' | string;
  expiresAt: string | null;
  createdAt: string;
  code: string;
}
export type RegistrarCodeIssueRecord = RegistrarCodeIssueResponse;

export interface RegistrarCodeVerifyResponse {
  id: string;
  registrarEntryId: string;
  capability: string;
  issuerType: 'system';
  status: 'issued' | string;
  expiresAt: string | null;
  createdAt: string;
  redeemable: boolean;
}
export type RegistrarCodeVerifyRecord = RegistrarCodeVerifyResponse;

export interface RegistrarCodeRedeemResponse {
  id: string;
  registrarEntryId: string;
  capability: string;
  issuerType: 'system';
  status: 'redeemed' | string;
  expiresAt: string | null;
  redeemedAt: string | null;
  createdAt: string;
}
export type RegistrarCodeRedeemRecord = RegistrarCodeRedeemResponse;

export interface RegistrarCodeApiScaffold {
  issueForApprovedPromoterEntryEndpoint: string | null;
  redeemEndpoint: string | null;
  verifyEndpoint: string | null;
}

export const REGISTRAR_CODE_API_SCAFFOLD: RegistrarCodeApiScaffold = {
  issueForApprovedPromoterEntryEndpoint: null,
  redeemEndpoint: registrarCodeEndpoints.redeem(),
  verifyEndpoint: registrarCodeEndpoints.verify(),
};

export async function submitArtistBandRegistration(
  payload: ArtistBandRegistrationPayload,
  token: string,
): Promise<RegistrarArtistRegistrationResponse> {
  const response = await api.post<RegistrarArtistRegistrationResponse>(registrarArtistEndpoints.submit(), payload, {
    token,
  });
  if (!response.data) {
    throw new Error('Registrar submission returned no data.');
  }
  return response.data;
}

export async function submitPromoterRegistration(
  payload: RegistrarPromoterRegistrationPayload,
  token: string,
): Promise<RegistrarPromoterRegistrationResponse> {
  const response = await api.post<RegistrarPromoterRegistrationResponse>(registrarPromoterEndpoints.submit(), payload, {
    token,
  });

  if (!response.data) {
    throw new Error('Promoter registration response returned no data.');
  }

  return response.data;
}

export async function submitProjectRegistration(
  payload: RegistrarProjectRegistrationPayload,
  token: string,
): Promise<RegistrarProjectRegistrationResponse> {
  const response = await api.post<RegistrarProjectRegistrationResponse>(registrarProjectEndpoints.submit(), payload, {
    token,
  });

  if (!response.data) {
    throw new Error('Project registration response returned no data.');
  }

  return response.data;
}

export async function listProjectRegistrations(token: string): Promise<RegistrarProjectEntriesResponse> {
  const response = await api.get<RegistrarProjectEntriesResponse>(registrarProjectEndpoints.listEntries(), { token });
  return response.data ?? { total: 0, countsByStatus: {}, entries: [] };
}

export async function getProjectRegistration(entryId: string, token: string): Promise<RegistrarProjectEntry> {
  const response = await api.get<RegistrarProjectEntry>(registrarProjectEndpoints.detail(entryId), { token });
  if (!response.data) {
    throw new Error('Project registration response was empty.');
  }
  return response.data;
}

export async function listSectMotionRegistrations(token: string): Promise<RegistrarSectMotionEntriesResponse> {
  const response = await api.get<RegistrarSectMotionEntriesResponse>(registrarSectMotionEndpoints.listEntries(), {
    token,
  });
  return response.data ?? { total: 0, countsByStatus: {}, entries: [] };
}

export async function getSectMotionRegistration(entryId: string, token: string): Promise<RegistrarSectMotionEntry> {
  const response = await api.get<RegistrarSectMotionEntry>(registrarSectMotionEndpoints.detail(entryId), { token });
  if (!response.data) {
    throw new Error('Sect-motion registration response was empty.');
  }
  return response.data;
}

export async function listArtistBandRegistrations(token: string): Promise<RegistrarArtistEntriesResponse> {
  const response = await api.get<RegistrarArtistEntriesResponse>(registrarArtistEndpoints.listEntries(), { token });
  return response.data ?? { total: 0, entries: [] };
}

export async function materializeArtistBandRegistration(entryId: string, token: string): Promise<void> {
  await api.post(registrarArtistEndpoints.materialize(entryId), {}, { token });
}

export async function dispatchArtistBandInvites(
  entryId: string,
  links: { mobileAppUrl: string; webAppUrl: string },
  token: string,
): Promise<RegistrarArtistDispatchInvitesResult> {
  const response = await api.post<RegistrarArtistDispatchInvitesResponse>(
    registrarArtistEndpoints.dispatchInvites(entryId),
    links,
    { token },
  );

  return (
    response.data ?? {
      registrarEntryId: entryId,
      queuedCount: 0,
    }
  );
}

export async function loadArtistBandInviteStatus(
  entryId: string,
  token: string,
): Promise<RegistrarArtistInviteStatusResponse> {
  const response = await api.get<RegistrarArtistInviteStatusResponse>(registrarArtistEndpoints.inviteStatus(entryId), {
    token,
  });

  if (!response.data) {
    throw new Error('Invite status response was empty.');
  }

  return response.data;
}

export async function syncArtistBandMembers(
  entryId: string,
  token: string,
): Promise<RegistrarArtistSyncMembersResult> {
  const response = await api.post<RegistrarArtistSyncMembersResponse>(
    registrarArtistEndpoints.syncMembers(entryId),
    {},
    { token },
  );

  return (
    response.data ?? {
      registrarEntryId: entryId,
      artistBandId: '',
      eligibleMemberCount: 0,
      createdMemberCount: 0,
      skippedMemberCount: 0,
    }
  );
}

export async function listPromoterRegistrations(token: string): Promise<RegistrarPromoterEntriesResponse> {
  const response = await api.get<RegistrarPromoterEntriesResponse>(registrarPromoterEndpoints.listEntries(), { token });
  return response.data ?? { total: 0, countsByStatus: {}, entries: [] };
}

export async function getPromoterRegistration(entryId: string, token: string): Promise<RegistrarPromoterEntry> {
  const response = await api.get<RegistrarPromoterEntry>(registrarPromoterEndpoints.detail(entryId), { token });
  if (!response.data) {
    throw new Error('Promoter registration response was empty.');
  }
  return response.data;
}

export async function getPromoterCapabilityAudit(
  entryId: string,
  token: string,
): Promise<RegistrarPromoterCapabilityAuditResponse> {
  const response = await api.get<RegistrarPromoterCapabilityAuditResponse>(
    registrarPromoterEndpoints.capabilityAudit(entryId),
    { token },
  );
  if (!response.data) {
    throw new Error('Promoter capability audit response was empty.');
  }
  return response.data;
}

export async function verifyRegistrarCode(code: string, token: string): Promise<RegistrarCodeVerifyResponse> {
  const response = await api.post<RegistrarCodeVerifyResponse>(registrarCodeEndpoints.verify(), { code }, { token });
  if (!response.data) {
    throw new Error('Registrar code verify response was empty.');
  }
  return response.data;
}

export async function redeemRegistrarCode(code: string, token: string): Promise<RegistrarCodeRedeemResponse> {
  const response = await api.post<RegistrarCodeRedeemResponse>(registrarCodeEndpoints.redeem(), { code }, { token });
  if (!response.data) {
    throw new Error('Registrar code redeem response was empty.');
  }
  return response.data;
}
