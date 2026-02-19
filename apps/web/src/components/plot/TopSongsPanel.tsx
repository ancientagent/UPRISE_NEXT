'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

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

interface TopSongsPanelProps {
  communityId: string | null;
}

export default function TopSongsPanel({ communityId }: TopSongsPanelProps) {
  const { token } = useAuthStore();
  const [feedItems, setFeedItems] = useState<CommunityFeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch feed when community changes
  useEffect(() => {
    async function fetchFeed() {
      if (!communityId) {
        setFeedItems([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await api.get<CommunityFeedItem[]>(
          `/communities/${communityId}/feed?limit=100`,
          { token: token || undefined }
        );

        if (response.success && response.data) {
          setFeedItems(response.data);
        } else {
          setError('Failed to load feed');
        }
      } catch (err) {
        console.error('Error fetching feed:', err);
        setError('Unable to load feed data');
      } finally {
        setLoading(false);
      }
    }

    fetchFeed();
  }, [communityId, token]);

  // Extract track_release items and sort deterministically by occurredAt (descending)
  const trackReleases = useMemo(() => {
    return feedItems
      .filter((item) => item.type === 'track_release')
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
      .slice(0, 40); // Limit to 40 items
  }, [feedItems]);

  // Format duration from seconds to mm:ss
  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 h-full">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-black/10 rounded" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-full bg-black/5 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 h-full">
        <div className="text-center py-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // No community selected
  if (!communityId) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 h-full">
        <div className="text-center py-8">
          <p className="text-4xl mb-3">🎵</p>
          <h3 className="font-semibold text-black mb-1">Select a Community</h3>
          <p className="text-sm text-black/60">
            Choose a community from the scene map to see top tracks.
          </p>
        </div>
      </div>
    );
  }

  // Empty state - no tracks
  if (trackReleases.length === 0) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 h-full">
        <div className="text-center py-8">
          <p className="text-4xl mb-3">🎵</p>
          <h3 className="font-semibold text-black mb-1">No Tracks Yet</h3>
          <p className="text-sm text-black/60">
            No track releases found in this community feed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-black">Top Songs</h2>
        <p className="text-sm text-black/60">
          {trackReleases.length} track{trackReleases.length !== 1 ? 's' : ''} from feed
        </p>
      </div>

      <div className="space-y-1 max-h-[400px] overflow-y-auto">
        {trackReleases.map((track, index) => (
          <div
            key={track.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 transition-colors"
          >
            <span className="w-6 h-6 rounded-full bg-black/10 text-black/60 text-xs flex items-center justify-center font-medium">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-black text-sm truncate">
                {track.metadata?.title || 'Untitled Track'}
              </p>
              <p className="text-xs text-black/60 truncate">
                {track.metadata?.artist || 'Unknown Artist'}
              </p>
            </div>
            <span className="text-xs text-black/50 whitespace-nowrap">
              {formatDuration(track.metadata?.duration)}
            </span>
          </div>
        ))}
      </div>

      {trackReleases.length === 40 && (
        <p className="text-xs text-black/50 mt-3 text-center">
          Showing 40 latest tracks
        </p>
      )}
    </div>
  );
}
