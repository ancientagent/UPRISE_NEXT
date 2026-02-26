import { api } from '@/lib/api';
import type { ArtistBandRegistrationPayload } from '@/lib/registrar/artistRegistration';
import {
  registrarArtistEndpoints,
  registrarCodeEndpoints,
  registrarProjectEndpoints,
  registrarPromoterEndpoints,
} from '@/lib/registrar/contractInventory';

export interface RegistrarSceneSummary {
  id: string;
  name: string;
  city: string;
  state: string;
  musicCommunity: string;
  tier: 'city' | 'state' | 'national';
}

export interface RegistrarArtistEntry {
  id: string;
  type: string;
  status: string;
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

export interface RegistrarArtistRegistrationResult {
  id: string;
  memberCount: number;
  pendingInviteCount: number;
  existingMemberCount: number;
}

export interface RegistrarProjectRegistrationPayload {
  sceneId: string;
  projectName: string;
}

export interface RegistrarProjectRegistrationResult {
  id: string;
  type: string;
  status: string;
  sceneId: string;
  createdById: string;
  payload: {
    projectName: string | null;
  };
  createdAt: string;
}

export interface RegistrarArtistInviteStatusMember {
  id: string;
  name: string;
  email: string;
  city: string;
  instrument: string;
  inviteStatus: string;
  existingUserId: string | null;
  claimedUserId: string | null;
  inviteTokenExpiresAt: string | null;
  deliveryStatus: 'queued' | 'sent' | 'failed' | null;
  sentAt: string | null;
  failedAt: string | null;
}

export interface RegistrarArtistInviteStatusResponse {
  registrarEntryId: string;
  totalMembers: number;
  countsByStatus: Record<string, number>;
  members: RegistrarArtistInviteStatusMember[];
}

export interface RegistrarArtistDispatchInvitesResult {
  registrarEntryId: string;
  queuedCount: number;
}

export interface RegistrarArtistSyncMembersResult {
  registrarEntryId: string;
  artistBandId: string;
  eligibleMemberCount: number;
  createdMemberCount: number;
  skippedMemberCount: number;
}

export interface RegistrarPromoterEntry {
  id: string;
  type: string;
  status: string;
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
  scene: RegistrarSceneSummary;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrarPromoterEntriesResponse {
  total: number;
  countsByStatus: Record<string, number>;
  entries: RegistrarPromoterEntry[];
}

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

export interface RegistrarCodeIssueRecord {
  id: string;
  registrarEntryId: string;
  capability: string;
  issuerType: 'system';
  status: 'issued' | string;
  expiresAt: string | null;
  createdAt: string;
  code: string;
}

export interface RegistrarCodeVerifyRecord {
  id: string;
  registrarEntryId: string;
  capability: string;
  issuerType: 'system';
  status: 'issued' | string;
  expiresAt: string | null;
  createdAt: string;
  redeemable: boolean;
}

export interface RegistrarCodeRedeemRecord {
  id: string;
  registrarEntryId: string;
  capability: string;
  issuerType: 'system';
  status: 'redeemed' | string;
  expiresAt: string | null;
  redeemedAt: string | null;
  createdAt: string;
}

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
): Promise<RegistrarArtistRegistrationResult> {
  const response = await api.post<RegistrarArtistRegistrationResult>(registrarArtistEndpoints.submit(), payload, { token });
  if (!response.data) {
    throw new Error('Registrar submission returned no data.');
  }
  return response.data;
}

export async function submitProjectRegistration(
  payload: RegistrarProjectRegistrationPayload,
  token: string,
): Promise<RegistrarProjectRegistrationResult> {
  const response = await api.post<RegistrarProjectRegistrationResult>(registrarProjectEndpoints.submit(), payload, {
    token,
  });

  if (!response.data) {
    throw new Error('Project registration response returned no data.');
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
  const response = await api.post<RegistrarArtistDispatchInvitesResult>(
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
  const response = await api.post<RegistrarArtistSyncMembersResult>(
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

export async function verifyRegistrarCode(code: string, token: string): Promise<RegistrarCodeVerifyRecord> {
  const response = await api.post<RegistrarCodeVerifyRecord>(registrarCodeEndpoints.verify(), { code }, { token });
  if (!response.data) {
    throw new Error('Registrar code verify response was empty.');
  }
  return response.data;
}

export async function redeemRegistrarCode(code: string, token: string): Promise<RegistrarCodeRedeemRecord> {
  const response = await api.post<RegistrarCodeRedeemRecord>(registrarCodeEndpoints.redeem(), { code }, { token });
  if (!response.data) {
    throw new Error('Registrar code redeem response was empty.');
  }
  return response.data;
}
