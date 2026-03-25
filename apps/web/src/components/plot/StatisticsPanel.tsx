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

  // City-only: fetch nearby communities for local map.
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

  // Tier-scoped statistics use explicit community anchor when selected, otherwise active-scene fallback.
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
      <div className="plot-zine-card rounded-2xl p-6 h-full">
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
    if (!token) {
      return (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 h-full">
          <p className="text-sm text-amber-900">Sign in is required to load scene statistics.</p>
        </div>
      );
    }

    return (
      <div className="plot-zine-card rounded-2xl p-6 h-full">
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
  const sceneMapRequest = resolveSceneMapRequest(
    selectedCommunity?.id ?? null,
    activeSceneId,
    selectedTier,
  );
  const sceneMapScopeCopy =
    selectedTier === 'city'
      ? 'City view keeps local scene-map detail for the active Plot context.'
      : selectedTier === 'state'
        ? 'State view keeps the same parent context and rolls the map up to city-level macro reads.'
        : 'National view keeps the same parent context and rolls the map up to state-level macro reads.';

  return (
    <div className="plot-zine-card plot-record-sleeve rounded-[1.45rem] p-6 h-full">
      <div className="mb-4">
        <p className="plot-annotation-note inline-block text-lg">Scene Statistics</p>
        <p className="mt-2 text-sm plot-ink-muted capitalize">
          {selectedTier} scope • rollup: {statistics?.rollupUnit ?? 'local_sect'}
        </p>
        <p className="mt-1 text-xs plot-ink-muted">{sceneMapScopeCopy}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="plot-ledger-card rounded-xl p-3">
          <p className="text-xl font-semibold text-[var(--ink-main)]">{metrics.totalMembers.toLocaleString()}</p>
          <p className="text-xs plot-ink-muted">Members</p>
        </div>
        <div className="plot-ledger-card rounded-xl p-3">
          <p className="text-xl font-semibold text-[var(--ink-main)]">{metrics.activeSects}</p>
          <p className="text-xs plot-ink-muted">Active Sects</p>
        </div>
        <div className="plot-ledger-card rounded-xl p-3">
          <p className="text-xl font-semibold text-[var(--ink-main)]">{metrics.eventsThisWeek}</p>
          <p className="text-xs plot-ink-muted">Events (7d)</p>
        </div>
        <div className="plot-ledger-card rounded-xl p-3">
          <p className="text-xl font-semibold text-[var(--ink-main)]">{metrics.activityScore}</p>
          <p className="text-xs plot-ink-muted">Activity (7d)</p>
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
          {mapError ? <p className="mb-4 text-xs text-red-600">{mapError}</p> : null}

          <div className="space-y-1 max-h-40 overflow-y-auto">
            {communities.map((community, index) => (
              <button
                key={community.id}
                onClick={() => handleCommunitySelect(community)}
                className={`w-full rounded-lg p-2 text-left transition-colors ${
                  selectedCommunity?.id === community.id
                    ? 'plot-ledger-card border-[var(--red-pen)] bg-[rgba(243,224,96,0.28)]'
                    : 'plot-ledger-card hover:bg-[rgba(243,224,96,0.18)]'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="plot-embossed-label h-6 w-6 justify-center px-0 text-[10px]">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-xs font-medium text-[var(--ink-main)]">{community.name}</p>
                      <p className="text-[10px] plot-ink-muted">
                        {community.memberCount?.toLocaleString()} members
                      </p>
                    </div>
                  </div>
                  {community.distance && (
                    <span className="text-[10px] plot-ink-muted">
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
          {mapError ? <p className="text-xs text-red-600">{mapError}</p> : null}
          <div className="plot-ledger-card rounded-xl p-4">
            <p className="text-sm plot-ink-muted">
              {selectedTier === 'state'
                ? 'State tier aggregates city-scoped scenes in this parent music community context.'
                : 'National tier aggregates state-level macro context in this parent music community.'}
            </p>
            <p className="mt-2 text-xs plot-ink-muted">
              Scope communities: {metrics.scopeCommunityCount.toLocaleString()} • Active tracks:{' '}
              {metrics.activeTracks.toLocaleString()}
            </p>
            <p className="mt-2 text-[11px] plot-ink-muted">
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
