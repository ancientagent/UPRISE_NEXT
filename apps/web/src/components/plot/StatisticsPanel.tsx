'use client';

import { useState, useEffect } from 'react';
import { useOnboardingStore } from '@/store/onboarding';
import { useAuthStore } from '@/store/auth';
import type { CommunityWithDistance } from '@/lib/types/community';
import SceneMap from '@/components/plot/SceneMap';
import { shouldFetchNearbyForTier } from '@/components/plot/tier-guard';
import {
  findNearbyCommunities,
  getActiveCommunityStatistics,
  getCommunitySceneMap,
  getCommunityStatistics,
  type CommunitySceneMapResponse,
  type CommunityStatisticsResponse,
} from '@/lib/communities/client';
import {
  resolveSceneMapRequest,
  resolveStatisticsEndpoint,
  type TierScope,
} from '@/components/plot/statistics-request';

interface StatisticsPanelProps {
  selectedTier: TierScope;
  selectedCommunity: CommunityWithDistance | null;
  onCommunitySelect?: (community: CommunityWithDistance) => void;
  onCommunitiesUpdate?: (communities: CommunityWithDistance[]) => void;
}

export default function StatisticsPanel({
  selectedTier,
  selectedCommunity,
  onCommunitySelect,
  onCommunitiesUpdate,
}: StatisticsPanelProps) {
  const { gpsCoords } = useOnboardingStore();
  const { token } = useAuthStore();

  const [communities, setCommunities] = useState<CommunityWithDistance[]>([]);
  const [statistics, setStatistics] = useState<CommunityStatisticsResponse | null>(null);
  const [sceneMap, setSceneMap] = useState<CommunitySceneMapResponse | null>(null);
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const cityRadiusMeters = 10000;

  useEffect(() => {
    async function fetchNearbyCommunities() {
      if (!token) {
        setCommunities([]);
        onCommunitiesUpdate?.([]);
        return;
      }

      if (!shouldFetchNearbyForTier(selectedTier)) {
        setCommunities([]);
        onCommunitiesUpdate?.([]);
        return;
      }

      if (!gpsCoords) {
        const fallbackCommunities = selectedCommunity ? [selectedCommunity] : [];
        setCommunities(fallbackCommunities);
        onCommunitiesUpdate?.(fallbackCommunities);
        return;
      }

      try {
        const response = await findNearbyCommunities(
          {
            lat: gpsCoords.latitude,
            lng: gpsCoords.longitude,
            radius: cityRadiusMeters,
            limit: 50,
          },
          token || undefined,
        );

        const nextCommunities = response ?? [];
        setCommunities(nextCommunities);
        onCommunitiesUpdate?.(nextCommunities);

        if (nextCommunities.length > 0) {
          const currentStillExists = selectedCommunity
            ? nextCommunities.some((c) => c.id === selectedCommunity.id)
            : false;

          if (!currentStillExists) {
            onCommunitySelect?.(nextCommunities[0]);
          }
        }
      } catch {
        setError('Unable to load nearby communities');
      }
    }

    fetchNearbyCommunities();
  }, [selectedTier, gpsCoords, cityRadiusMeters, token, selectedCommunity, onCommunitySelect, onCommunitiesUpdate]);

  useEffect(() => {
    async function fetchStatistics() {
      if (!token) {
        setStatistics(null);
        setActiveSceneId(null);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const resolution = resolveStatisticsEndpoint(selectedCommunity?.id ?? null, selectedTier);
        if (resolution.source === 'anchored' && selectedCommunity?.id) {
          const data = await getCommunityStatistics(selectedCommunity.id, selectedTier, token || undefined);
          setStatistics(data);
          setActiveSceneId(selectedCommunity.id);
          return;
        }

        const activeResult = await getActiveCommunityStatistics(selectedTier, token || undefined);
        setStatistics(activeResult.data);
        if (resolution.source === 'anchored') {
          setActiveSceneId(selectedCommunity?.id ?? null);
        } else {
          const fallbackSceneId = activeResult.sceneId ?? activeResult.data?.community?.id ?? null;
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
      if (!token) {
        setSceneMap(null);
        setMapError(null);
        return;
      }

      const request = resolveSceneMapRequest(
        selectedCommunity?.id ?? null,
        activeSceneId,
        selectedTier,
      );

      if (!request.anchorId) {
        setSceneMap(null);
        setMapError(null);
        return;
      }

      try {
        setMapError(null);
        const response = await getCommunitySceneMap(request.anchorId, selectedTier, token || undefined);
        setSceneMap(response);
      } catch {
        setSceneMap(null);
        setMapError('Scene map is unavailable for the current statistics scope.');
      }
    }

    fetchSceneMap();
  }, [selectedCommunity, activeSceneId, selectedTier, token]);

  const handleCommunitySelect = (community: CommunityWithDistance) => {
    onCommunitySelect?.(community);
  };

  if (loading && !statistics) {
    return (
      <div className="plot-wire-panel h-full">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded bg-black/10" />
          <div className="h-64 w-full rounded-[1rem] bg-black/5" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[1rem] border border-red-300 bg-red-50 p-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!selectedCommunity && !activeSceneId) {
    if (!token) {
      return (
        <div className="rounded-[1rem] border border-amber-300 bg-amber-50 p-4">
          <p className="text-sm text-amber-900">Sign in is required to load scene statistics.</p>
        </div>
      );
    }

    return (
      <div className="plot-wire-card-muted p-6 text-center">
        <p className="text-4xl mb-3">🧭</p>
        <h3 className="font-semibold text-black mb-1">Select a community</h3>
        <p className="text-sm text-black/60">
          Choose a local community in city view to anchor state statistics.
        </p>
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
  const sceneMapRequest = resolveSceneMapRequest(
    selectedCommunity?.id ?? null,
    activeSceneId,
    selectedTier,
  );
  const sceneMapScopeCopy =
    selectedTier === 'city'
      ? 'City view keeps local scene-map detail for the active Plot context.'
      : 'State view keeps the same parent context and rolls the map up to city-level macro reads.';

  return (
    <div className="space-y-4">
      <div className="rounded-[1rem] border border-black bg-[#efefe2] px-4 py-3">
        <h2 className="text-lg font-semibold text-black">Scene Statistics</h2>
        <p className="text-sm capitalize text-black/60">
          {selectedTier} scope • rollup: {statistics?.rollupUnit ?? 'local_sect'}
        </p>
        <p className="mt-1 text-xs text-black/50">{sceneMapScopeCopy}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="plot-wire-card-muted bg-white p-3">
          <p className="text-xl font-semibold text-black">{metrics.totalMembers.toLocaleString()}</p>
          <p className="text-xs text-black/60">Members</p>
        </div>
        <div className="plot-wire-card-muted bg-white p-3">
          <p className="text-xl font-semibold text-black">{metrics.activeSects}</p>
          <p className="text-xs text-black/60">Active Sects</p>
        </div>
        <div className="plot-wire-card-muted bg-white p-3">
          <p className="text-xl font-semibold text-black">{metrics.eventsThisWeek}</p>
          <p className="text-xs text-black/60">Events (7d)</p>
        </div>
        <div className="plot-wire-card-muted bg-white p-3">
          <p className="text-xl font-semibold text-black">{metrics.activityScore}</p>
          <p className="text-xs text-black/60">Activity (7d)</p>
        </div>
      </div>

      {selectedTier === 'city' ? (
        <>
          <div className="h-52 w-full">
            <SceneMap
              points={sceneMap?.points ?? []}
              selectedPointId={selectedCommunity?.id ?? null}
              onSelectPoint={(point) => {
                const matched = communities.find((c) => c.id === point.id);
                if (matched) handleCommunitySelect(matched);
              }}
            />
          </div>
          {mapError ? <p className="text-xs text-red-600">{mapError}</p> : null}

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {communities.map((community, index) => (
              <button
                key={community.id}
                onClick={() => handleCommunitySelect(community)}
                className={`plot-wire-list-item w-full text-left transition-colors ${
                  selectedCommunity?.id === community.id
                    ? 'bg-[#dfe8b4]'
                    : 'hover:bg-[#efefe2]'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-black bg-black text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-xs font-medium text-black">{community.name}</p>
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
          <div className="h-52 w-full">
            <SceneMap points={sceneMap?.points ?? []} />
          </div>
          {mapError ? <p className="text-xs text-red-600">{mapError}</p> : null}
          <div className="plot-wire-card-muted p-4">
            <p className="text-sm text-black/70">
              State tier aggregates city-scoped scenes in this parent music community context.
            </p>
            <p className="mt-2 text-xs text-black/50">
              Scope communities: {metrics.scopeCommunityCount.toLocaleString()} • Active tracks:{' '}
              {metrics.activeTracks.toLocaleString()}
            </p>
            <p className="mt-2 text-[11px] text-black/45">
              Map anchor source:{' '}
              {sceneMapRequest.source === 'selected_community'
                ? 'selected community'
                : sceneMapRequest.source === 'active_scene'
                  ? 'active scene fallback'
                  : 'unresolved'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
