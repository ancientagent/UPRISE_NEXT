'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { useOnboardingStore } from '@/store/onboarding';
import { useAuthStore } from '@/store/auth';
import type { CommunityWithDistance } from '@/lib/types/community';

interface CommunityFeedItem {
  id: string;
  type: 'blast' | 'track_release' | 'event_created' | 'signal_created';
  occurredAt: string;
  actor: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
  } | null;
  entity: {
    type: 'signal' | 'track' | 'event';
    id: string;
  };
  metadata?: {
    title?: string;
    artist?: string;
    duration?: number;
    signalType?: string;
    signalMetadata?: Record<string, unknown> | null;
    startDate?: string;
    locationName?: string;
  };
}

interface StatisticsPanelProps {
  selectedTier: 'city' | 'state' | 'national';
  onCommunitySelect?: (community: CommunityWithDistance) => void;
  onCommunitiesUpdate?: (communities: CommunityWithDistance[]) => void;
}

interface AggregatedMetrics {
  totalMembers: number;
  activeSects: number;
  eventsThisWeek: number;
  activityScore: number;
}

export default function StatisticsPanel({
  selectedTier,
  onCommunitySelect,
  onCommunitiesUpdate,
}: StatisticsPanelProps) {
  const { homeScene, gpsCoords } = useOnboardingStore();
  const { token } = useAuthStore();

  const [communities, setCommunities] = useState<CommunityWithDistance[]>([]);
  const [feedItems, setFeedItems] = useState<CommunityFeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityWithDistance | null>(null);

  // Determine radius based on tier
  const radius = useMemo(() => {
    switch (selectedTier) {
      case 'city':
        return 10000; // 10km
      case 'state':
        return 100000; // 100km
      case 'national':
        return 500000; // 500km
      default:
        return 10000;
    }
  }, [selectedTier]);

  // Map center coordinates
  const mapCenter = useMemo(() => {
    if (gpsCoords) {
      return { lat: gpsCoords.latitude, lng: gpsCoords.longitude };
    }
    // Fallback coordinates based on home scene
    return homeScene
      ? { lat: 40.7128, lng: -74.0060 } // Default NYC fallback
      : { lat: 39.8283, lng: -98.5795 }; // Center of USA
  }, [gpsCoords, homeScene]);

  // Fetch nearby communities
  useEffect(() => {
    async function fetchNearbyCommunities() {
      if (!mapCenter.lat || !mapCenter.lng) {
        setError('Location not available');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await api.get<CommunityWithDistance[]>(
          `/communities/nearby?lat=${mapCenter.lat}&lng=${mapCenter.lng}&radius=${radius}&limit=50`,
          { token: token || undefined }
        );

        if (response.success && response.data) {
          setCommunities(response.data);
          onCommunitiesUpdate?.(response.data);
          // Auto-select first community for city tier if none selected
          if (response.data.length > 0 && selectedTier === 'city' && !selectedCommunity) {
            setSelectedCommunity(response.data[0]);
          }
        } else {
          setError('Failed to load nearby communities');
        }
      } catch (err) {
        console.error('Error fetching communities:', err);
        setError('Unable to load scene data');
      } finally {
        setLoading(false);
      }
    }

    fetchNearbyCommunities();
  }, [mapCenter, radius, token, selectedTier, selectedCommunity, onCommunitiesUpdate]);

  // Fetch feed for selected community
  useEffect(() => {
    async function fetchCommunityFeed() {
      if (!selectedCommunity) {
        setFeedItems([]);
        return;
      }

      try {
        const response = await api.get<CommunityFeedItem[]>(
          `/communities/${selectedCommunity.id}/feed?limit=100`,
          { token: token || undefined }
        );

        if (response.success && response.data) {
          setFeedItems(response.data);
        }
      } catch (err) {
        console.error('Error fetching feed:', err);
        setFeedItems([]);
      }
    }

    fetchCommunityFeed();
  }, [selectedCommunity, token]);

  // Calculate aggregated metrics from nearby communities and feed
  const metrics: AggregatedMetrics = useMemo(() => {
    const totalMembers = communities.reduce((sum, c) => sum + (c.memberCount || 0), 0);
    // Estimate active sects based on communities count (each community could be a different sect/scene)
    const activeSects = communities.length;
    // Count events from feed (this is an approximation)
    const eventsThisWeek = feedItems.filter(
      (item) => item.type === 'event_created'
    ).length;
    // Activity score based on feed item count
    const activityScore = feedItems.length;

    return {
      totalMembers,
      activeSects,
      eventsThisWeek,
      activityScore,
    };
  }, [communities, feedItems]);

  const handleCommunitySelect = (community: CommunityWithDistance) => {
    setSelectedCommunity(community);
    onCommunitySelect?.(community);
  };

  // Loading state
  if (loading) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 h-full">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-black/10 rounded" />
          <div className="h-64 w-full bg-black/5 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 mx-auto mb-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              <p className="text-sm text-black/50">Finding nearby scenes...</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-black/5 rounded" />
            <div className="h-4 w-3/4 bg-black/5 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 h-full">
        <div className="text-center py-8">
          <p className="text-red-600 mb-2">⚠️</p>
          <p className="text-sm text-red-600">{error}</p>
          {!homeScene && (
            <p className="text-xs text-red-500 mt-2">Please complete onboarding first.</p>
          )}
        </div>
      </div>
    );
  }

  // Empty state
  if (communities.length === 0) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 h-full">
        <div className="text-center py-8">
          <p className="text-4xl mb-3">🗺️</p>
          <h3 className="font-semibold text-black mb-1">No nearby scenes found</h3>
          <p className="text-sm text-black/60">
            {!homeScene
              ? 'Select a Home Scene to see your local music community.'
              : `No communities within ${radius / 1000}km of your location.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-black">Scene Map</h2>
        <p className="text-sm text-black/60">
          {communities.length} communities within {radius / 1000}km
        </p>
      </div>

      {/* Metrics summary */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-3 rounded-xl bg-black/5">
          <p className="text-xl font-semibold text-black">{metrics.totalMembers.toLocaleString()}</p>
          <p className="text-xs text-black/60">Members</p>
        </div>
        <div className="p-3 rounded-xl bg-black/5">
          <p className="text-xl font-semibold text-black">{metrics.activeSects}</p>
          <p className="text-xs text-black/60">Sects</p>
        </div>
        <div className="p-3 rounded-xl bg-black/5">
          <p className="text-xl font-semibold text-black">{metrics.eventsThisWeek}</p>
          <p className="text-xs text-black/60">Events</p>
        </div>
        <div className="p-3 rounded-xl bg-black/5">
          <p className="text-xl font-semibold text-black">{metrics.activityScore}</p>
          <p className="text-xs text-black/60">Activity</p>
        </div>
      </div>

      {/* Map placeholder - visual indicator of map area */}
      <div className="h-48 w-full mb-4 rounded-2xl bg-gradient-to-br from-black/5 to-black/10 border border-black/10 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl mb-1">🗺️</p>
            <p className="text-xs text-black/50">Interactive map</p>
          </div>
        </div>
        {/* User location indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
          <div className="w-10 h-10 rounded-full bg-blue-500/20 absolute -top-3 -left-3 animate-ping" />
        </div>
        {/* Community markers */}
        {communities.slice(0, 8).map((community, index) => {
          const angle = (index / Math.min(communities.length, 8)) * 2 * Math.PI;
          const distance = 25 + (index * 10);
          const x = 50 + Math.cos(angle) * distance;
          const y = 50 + Math.sin(angle) * distance;
          const isSelected = selectedCommunity?.id === community.id;
          return (
            <button
              key={community.id}
              onClick={() => handleCommunitySelect(community)}
              className={`absolute w-3 h-3 rounded-full transition-all ${
                isSelected
                  ? 'bg-black scale-125'
                  : 'bg-black/40 hover:bg-black/60'
              } border border-white/50 shadow-sm`}
              style={{ left: `${x}%`, top: `${y}%` }}
              title={community.name}
            />
          );
        })}
      </div>

      {/* Community list */}
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

      {communities.length > 5 && (
        <p className="text-xs text-black/50 mt-2 text-center">
          +{communities.length - 5} more communities
        </p>
      )}
    </div>
  );
}
