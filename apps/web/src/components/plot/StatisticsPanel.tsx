'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { useOnboardingStore } from '@/store/onboarding';
import { useAuthStore } from '@/store/auth';
import type { CommunityWithDistance } from '@/lib/types/community';
import SceneMap, { type SceneMapPoint } from '@/components/plot/SceneMap';
import { shouldFetchNearbyForTier } from '@/components/plot/tier-guard';
import {
  resolveSceneMapAnchorId,
  resolveStatisticsEndpoint,
  type TierScope,
} from '@/components/plot/statistics-request';

interface CommunityStatisticsResponse {
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

interface CommunitySceneMapResponse {
  tierScope: TierScope;
  rollupUnit: 'local_sect' | 'city' | 'state';
  center: { lat: number; lng: number } | null;
  points: SceneMapPoint[];
}

interface StatisticsPanelProps {
  selectedTier: TierScope;
  onCommunitySelect?: (community: CommunityWithDistance) => void;
  onCommunitiesUpdate?: (communities: CommunityWithDistance[]) => void;
}

export default function StatisticsPanel({
  selectedTier,
  onCommunitySelect,
  onCommunitiesUpdate,
}: StatisticsPanelProps) {
  const { homeScene, gpsCoords } = useOnboardingStore();
  const { token } = useAuthStore();

  const [communities, setCommunities] = useState<CommunityWithDistance[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityWithDistance | null>(null);
  const [statistics, setStatistics] = useState<CommunityStatisticsResponse | null>(null);
  const [sceneMap, setSceneMap] = useState<CommunitySceneMapResponse | null>(null);
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cityRadiusMeters = 10000;

  const mapCenter = useMemo(() => {
    if (gpsCoords) {
      return { lat: gpsCoords.latitude, lng: gpsCoords.longitude };
    }

    return homeScene
      ? { lat: 40.7128, lng: -74.006 }
      : { lat: 39.8283, lng: -98.5795 };
  }, [gpsCoords, homeScene]);

  // City-only: fetch nearby communities for local map.
  useEffect(() => {
    async function fetchNearbyCommunities() {
      if (!shouldFetchNearbyForTier(selectedTier)) {
        setCommunities([]);
        onCommunitiesUpdate?.([]);
        return;
      }

      if (!mapCenter.lat || !mapCenter.lng) {
        setError('Location not available');
        return;
      }

      try {
        const response = await api.get<CommunityWithDistance[]>(
          `/communities/nearby?lat=${mapCenter.lat}&lng=${mapCenter.lng}&radius=${cityRadiusMeters}&limit=50`,
          { token: token || undefined }
        );

        const nextCommunities = response.data ?? [];
        setCommunities(nextCommunities);
        onCommunitiesUpdate?.(nextCommunities);

        if (nextCommunities.length > 0) {
          const currentStillExists = selectedCommunity
            ? nextCommunities.some((c) => c.id === selectedCommunity.id)
            : false;

          if (!currentStillExists) {
            setSelectedCommunity(nextCommunities[0]);
            onCommunitySelect?.(nextCommunities[0]);
          }
        }
      } catch {
        setError('Unable to load nearby communities');
      }
    }

    fetchNearbyCommunities();
  }, [selectedTier, mapCenter, cityRadiusMeters, token, selectedCommunity, onCommunitySelect, onCommunitiesUpdate]);

  // Tier-scoped statistics use explicit community anchor when selected, otherwise active-scene fallback.
  useEffect(() => {
    async function fetchStatistics() {
      setLoading(true);
      setError(null);

      try {
        const resolution = resolveStatisticsEndpoint(selectedCommunity?.id ?? null, selectedTier);
        const response = await api.get<CommunityStatisticsResponse>(
          resolution.endpoint,
          { token: token || undefined },
        );

        setStatistics(response.data ?? null);
        if (resolution.source === 'anchored') {
          setActiveSceneId(selectedCommunity?.id ?? null);
        } else {
          const fallbackSceneId =
            (response as { meta?: { sceneId?: string } }).meta?.sceneId ??
            response.data?.community?.id ??
            null;
          setActiveSceneId(fallbackSceneId);
        }
      } catch {
        setError('Unable to load scene statistics');
        setStatistics(null);
        setActiveSceneId(null);
      } finally {
        setLoading(false);
      }
    }

    fetchStatistics();
  }, [selectedCommunity, selectedTier, token]);

  useEffect(() => {
    async function fetchSceneMap() {
      const anchorId = resolveSceneMapAnchorId(selectedCommunity?.id ?? null, activeSceneId);
      if (!anchorId) {
        setSceneMap(null);
        return;
      }

      try {
        const response = await api.get<CommunitySceneMapResponse>(
          `/communities/${anchorId}/scene-map?tier=${selectedTier}`,
          { token: token || undefined },
        );
        setSceneMap(response.data ?? null);
      } catch {
        setSceneMap(null);
      }
    }

    fetchSceneMap();
  }, [selectedCommunity, activeSceneId, selectedTier, token]);

  const handleCommunitySelect = (community: CommunityWithDistance) => {
    setSelectedCommunity(community);
    onCommunitySelect?.(community);
  };

  if (loading && !statistics) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 h-full">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-black/10 rounded" />
          <div className="h-64 w-full bg-black/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 h-full">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!selectedCommunity && !activeSceneId) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 h-full">
        <div className="text-center py-8">
          <p className="text-4xl mb-3">🧭</p>
          <h3 className="font-semibold text-black mb-1">Select a community</h3>
          <p className="text-sm text-black/60">
            Choose a local community in city view to anchor state/national statistics.
          </p>
        </div>
      </div>
    );
  }

  const metrics = statistics?.metrics ?? {
    totalMembers: 0,
    activeSects: 0,
    eventsThisWeek: 0,
    activityScore: 0,
    activeTracks: 0,
    gpsVerifiedUsers: 0,
    votingEligibleUsers: 0,
    scopeCommunityCount: 0,
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-black">Scene Statistics</h2>
        <p className="text-sm text-black/60 capitalize">
          {selectedTier} scope • rollup: {statistics?.rollupUnit ?? 'local_sect'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-3 rounded-xl bg-black/5">
          <p className="text-xl font-semibold text-black">{metrics.totalMembers.toLocaleString()}</p>
          <p className="text-xs text-black/60">Members</p>
        </div>
        <div className="p-3 rounded-xl bg-black/5">
          <p className="text-xl font-semibold text-black">{metrics.activeSects}</p>
          <p className="text-xs text-black/60">Active Sects</p>
        </div>
        <div className="p-3 rounded-xl bg-black/5">
          <p className="text-xl font-semibold text-black">{metrics.eventsThisWeek}</p>
          <p className="text-xs text-black/60">Events (7d)</p>
        </div>
        <div className="p-3 rounded-xl bg-black/5">
          <p className="text-xl font-semibold text-black">{metrics.activityScore}</p>
          <p className="text-xs text-black/60">Activity (7d)</p>
        </div>
      </div>

      {selectedTier === 'city' ? (
        <>
          <div className="h-48 w-full mb-4">
            <SceneMap
              points={sceneMap?.points ?? []}
              selectedPointId={selectedCommunity?.id ?? null}
              onSelectPoint={(point) => {
                const matched = communities.find((c) => c.id === point.id);
                if (matched) handleCommunitySelect(matched);
              }}
            />
          </div>

          <div className="space-y-1 max-h-40 overflow-y-auto">
            {communities.map((community, index) => (
              <button
                key={community.id}
                onClick={() => handleCommunitySelect(community)}
                className={`w-full text-left p-2 rounded-lg transition-colors ${
                  selectedCommunity?.id === community.id
                    ? 'border border-black bg-black/5'
                    : 'border border-transparent hover:bg-black/5'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-black text-white text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-black text-xs">{community.name}</p>
                      <p className="text-[10px] text-black/60">
                        {community.memberCount?.toLocaleString()} members
                      </p>
                    </div>
                  </div>
                  {community.distance && (
                    <span className="text-[10px] text-black/50">
                      {community.distance < 1000
                        ? `${Math.round(community.distance)}m`
                        : `${(community.distance / 1000).toFixed(1)}km`}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <div className="h-48 w-full">
            <SceneMap points={sceneMap?.points ?? []} />
          </div>
          <div className="rounded-xl border border-black/10 p-4">
            <p className="text-sm text-black/70">
              {selectedTier === 'state'
                ? 'State tier aggregates city-scoped scenes in this parent music community context.'
                : 'National tier aggregates state-level macro context in this parent music community.'}
            </p>
            <p className="text-xs text-black/50 mt-2">
              Scope communities: {metrics.scopeCommunityCount.toLocaleString()} • Active tracks:{' '}
              {metrics.activeTracks.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
