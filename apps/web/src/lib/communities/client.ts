import { api } from '@/lib/api';
import type { CommunityWithDistance } from '@/lib/types/community';
import type { TierScope } from '@/lib/discovery/client';

export interface ResolveHomeCommunityParams {
  city: string;
  state: string;
  musicCommunity: string;
}

export interface CommunityFeedActor {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
}

export interface CommunityFeedEntity {
  type: 'signal' | 'track' | 'event' | string;
  id: string;
}

export interface CommunityFeedItem {
  id: string;
  type: 'blast' | 'track_release' | 'event_created' | 'signal_created' | string;
  occurredAt: string;
  actor: CommunityFeedActor | null;
  entity: CommunityFeedEntity;
  metadata?: Record<string, unknown>;
}

export interface CommunityFeedResponse {
  items: CommunityFeedItem[];
  nextCursor: string | null;
  limit: number;
  sceneId: string | null;
}

export interface CommunityEventItem {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  locationName: string;
  address: string;
  attendeeCount: number;
  maxAttendees: number | null;
}

export interface CommunityPromotionItem {
  id: string;
  type: string;
  createdAt: string;
  actor: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
  } | null;
  metadata: Record<string, unknown> | null;
}

export interface CommunityStatisticsResponse {
  community: {
    id: string;
    name: string;
    city: string | null;
    state: string | null;
    musicCommunity: string | null;
    tier: string;
    isActive: boolean;
  };
  tierScope: TierScope;
  rollupUnit: 'local_sect' | 'city' | 'state';
  metrics: {
    totalMembers: number;
    activeSects: number;
    eventsThisWeek: number;
    activityScore: number;
    activeTracks: number;
    gpsVerifiedUsers: number;
    votingEligibleUsers: number;
    scopeCommunityCount: number;
  };
  topSongs: Array<{
    trackId: string;
    title: string;
    artist: string;
    duration: number;
    playCount: number;
    communityId: string | null;
    communityName: string | null;
  }>;
  timeWindow: {
    days: number;
    asOf: string;
  };
}

export interface CommunitySceneMapPoint {
  id: string;
  label: string;
  lat: number | null;
  lng: number | null;
  memberCount: number;
  activeTracks: number;
  activeSects: number;
  eventsThisWeek: number;
  kind: 'community' | 'city' | 'state';
}

export interface CommunitySceneMapResponse {
  tierScope: TierScope;
  rollupUnit: 'local_sect' | 'city' | 'state';
  center: { lat: number; lng: number } | null;
  points: CommunitySceneMapPoint[];
}

export async function resolveHomeCommunity(
  params: ResolveHomeCommunityParams,
  token?: string,
): Promise<CommunityWithDistance | null> {
  const query = new URLSearchParams({
    city: params.city,
    state: params.state,
    musicCommunity: params.musicCommunity,
  });

  const response = await api.get<CommunityWithDistance | null>(
    `/communities/resolve-home?${query.toString()}`,
    { token },
  );
  return response.data ?? null;
}

export async function getCommunityById(
  communityId: string,
  token?: string,
): Promise<CommunityWithDistance | null> {
  const response = await api.get<CommunityWithDistance | null>(`/communities/${communityId}`, { token });
  return response.data ?? null;
}

export interface NearbyCommunitiesParams {
  lat: number;
  lng: number;
  radius: number;
  limit: number;
}

export async function findNearbyCommunities(
  params: NearbyCommunitiesParams,
  token?: string,
): Promise<CommunityWithDistance[]> {
  const query = new URLSearchParams({
    lat: String(params.lat),
    lng: String(params.lng),
    radius: String(params.radius),
    limit: String(params.limit),
  });
  const response = await api.get<CommunityWithDistance[]>(`/communities/nearby?${query.toString()}`, { token });
  return response.data ?? [];
}

export async function getCommunityStatistics(
  communityId: string,
  tier: TierScope,
  token?: string,
): Promise<CommunityStatisticsResponse | null> {
  const response = await api.get<CommunityStatisticsResponse>(
    `/communities/${communityId}/statistics?tier=${tier}`,
    { token },
  );
  return response.data ?? null;
}

export async function getActiveCommunityStatistics(
  tier: TierScope,
  token?: string,
): Promise<{ sceneId: string | null; data: CommunityStatisticsResponse | null }> {
  const response = await api.get<CommunityStatisticsResponse>(
    `/communities/active/statistics?tier=${tier}`,
    { token },
  );
  return {
    sceneId: (response as { meta?: { sceneId?: string } }).meta?.sceneId ?? null,
    data: response.data ?? null,
  };
}

export async function getCommunityFeed(
  communityId: string,
  params: { limit: number; before?: string | null },
  token?: string,
): Promise<CommunityFeedResponse> {
  const query = new URLSearchParams({
    limit: String(params.limit),
  });

  if (params.before) {
    query.set('before', params.before);
  }

  const response = await api.get<CommunityFeedItem[]>(
    `/communities/${communityId}/feed?${query.toString()}`,
    { token },
  );

  return {
    items: response.data ?? [],
    nextCursor: (response as { meta?: { nextCursor?: string | null } }).meta?.nextCursor ?? null,
    limit: (response as { meta?: { limit?: number } }).meta?.limit ?? params.limit,
    sceneId: communityId,
  };
}

export async function getActiveCommunityFeed(
  params: { limit: number; before?: string | null },
  token?: string,
): Promise<CommunityFeedResponse> {
  const query = new URLSearchParams({
    limit: String(params.limit),
  });

  if (params.before) {
    query.set('before', params.before);
  }

  const response = await api.get<CommunityFeedItem[]>(`/communities/active/feed?${query.toString()}`, {
    token,
  });

  return {
    items: response.data ?? [],
    nextCursor: (response as { meta?: { nextCursor?: string | null } }).meta?.nextCursor ?? null,
    limit: (response as { meta?: { limit?: number } }).meta?.limit ?? params.limit,
    sceneId: (response as { meta?: { sceneId?: string | null } }).meta?.sceneId ?? null,
  };
}

export async function getCommunityEvents(
  communityId: string,
  params: { limit: number; includePast: boolean },
  token?: string,
): Promise<CommunityEventItem[]> {
  const query = new URLSearchParams({
    limit: String(params.limit),
    includePast: String(params.includePast),
  });

  const response = await api.get<CommunityEventItem[]>(
    `/communities/${communityId}/events?${query.toString()}`,
    { token },
  );

  return response.data ?? [];
}

export async function getActiveCommunityEvents(
  params: { limit: number; includePast: boolean },
  token?: string,
): Promise<CommunityEventItem[]> {
  const query = new URLSearchParams({
    limit: String(params.limit),
    includePast: String(params.includePast),
  });

  const response = await api.get<CommunityEventItem[]>(`/communities/active/events?${query.toString()}`, {
    token,
  });

  return response.data ?? [];
}

export async function getCommunityPromotions(
  communityId: string,
  params: { limit: number },
  token?: string,
): Promise<CommunityPromotionItem[]> {
  const query = new URLSearchParams({
    limit: String(params.limit),
  });

  const response = await api.get<CommunityPromotionItem[]>(
    `/communities/${communityId}/promotions?${query.toString()}`,
    { token },
  );

  return response.data ?? [];
}

export async function getActiveCommunityPromotions(
  params: { limit: number },
  token?: string,
): Promise<CommunityPromotionItem[]> {
  const query = new URLSearchParams({
    limit: String(params.limit),
  });

  const response = await api.get<CommunityPromotionItem[]>(
    `/communities/active/promotions?${query.toString()}`,
    { token },
  );

  return response.data ?? [];
}

export async function getCommunitySceneMap(
  communityId: string,
  tier: TierScope,
  token?: string,
): Promise<CommunitySceneMapResponse | null> {
  const response = await api.get<CommunitySceneMapResponse>(
    `/communities/${communityId}/scene-map?tier=${tier}`,
    { token },
  );
  return response.data ?? null;
}
