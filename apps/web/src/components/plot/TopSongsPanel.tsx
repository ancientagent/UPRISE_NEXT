'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

type TierScope = 'city' | 'state' | 'national';

interface StatisticsTopSong {
  trackId: string;
  title: string;
  artist: string;
  duration: number;
  playCount: number;
  communityId: string | null;
  communityName: string | null;
}

interface CommunityStatisticsResponse {
  topSongs: StatisticsTopSong[];
}

interface TopSongsPanelProps {
  communityId: string | null;
  selectedTier: TierScope;
}

export default function TopSongsPanel({ communityId, selectedTier }: TopSongsPanelProps) {
  const { token } = useAuthStore();
  const [songs, setSongs] = useState<StatisticsTopSong[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopSongs() {
      if (!communityId) {
        setSongs([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await api.get<CommunityStatisticsResponse>(
          `/communities/${communityId}/statistics?tier=${selectedTier}`,
          { token: token || undefined }
        );

        setSongs((response.data?.topSongs ?? []).slice(0, 40));
      } catch {
        setError('Unable to load top songs');
        setSongs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTopSongs();
  }, [communityId, selectedTier, token]);

  const tracks = useMemo(() => songs.slice(0, 40), [songs]);

  const formatDuration = (seconds?: number): string => {
    if (!seconds || seconds <= 0) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 h-full">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!communityId) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 h-full">
        <div className="text-center py-8">
          <p className="text-4xl mb-3">🎵</p>
          <h3 className="font-semibold text-black mb-1">No Anchor Community</h3>
          <p className="text-sm text-black/60">
            Select a city community first to view {selectedTier} Top 40.
          </p>
        </div>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 h-full">
        <div className="text-center py-8">
          <p className="text-4xl mb-3">🎵</p>
          <h3 className="font-semibold text-black mb-1">No Top Songs Yet</h3>
          <p className="text-sm text-black/60">No tracks available in this scope.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-black">Top 40</h2>
        <p className="text-sm text-black/60 capitalize">{selectedTier} scope</p>
      </div>

      <div className="space-y-1 max-h-[400px] overflow-y-auto">
        {tracks.map((track, index) => (
          <div
            key={track.trackId}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 transition-colors"
          >
            <span className="w-6 h-6 rounded-full bg-black/10 text-black/60 text-xs flex items-center justify-center font-medium">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-black text-sm truncate">{track.title || 'Untitled Track'}</p>
              <p className="text-xs text-black/60 truncate">{track.artist || 'Unknown Artist'}</p>
            </div>
            <span className="text-xs text-black/50 whitespace-nowrap">{formatDuration(track.duration)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
