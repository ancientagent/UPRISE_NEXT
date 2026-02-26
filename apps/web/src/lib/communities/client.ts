import { api } from '@/lib/api';
import type { CommunityWithDistance } from '@/lib/types/community';
import type { TierScope } from '@/lib/discovery/client';

export interface ResolveHomeCommunityParams {
  city: string;
  state: string;
  musicCommunity: string;
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
