'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

type TierScope = 'city' | 'state' | 'national';

interface StatisticsTopSong {
  trackId: string;
  artistBandId: string | null;
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
      if (!token) {
        setSongs([]);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const path = communityId
          ? `/communities/${communityId}/statistics?tier=${selectedTier}`
          : `/communities/active/statistics?tier=${selectedTier}`;
        const response = await api.get<CommunityStatisticsResponse>(
          path,
          { token }
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
      <div className="plot-wire-panel h-full">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded bg-black/10" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-full rounded bg-black/5" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="rounded-[1rem] border border-amber-300 bg-amber-50 p-4">
        <p className="text-sm text-amber-900">Sign in is required to load Top 40 songs for this scene context.</p>
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

  if (tracks.length === 0) {
    return (
      <div className="plot-wire-card-muted p-4">
        <h3 className="font-semibold text-black">No Top Songs Yet</h3>
        <p className="mt-1 text-sm text-black/60">No tracks available in this scope.</p>
      </div>
    );
  }

  return (
    <div className="plot-wire-panel h-full">
      <div className="mb-4 rounded-[1rem] border border-black bg-[#efefe2] px-4 py-3">
        <h2 className="text-lg font-semibold text-black">Top 40</h2>
        <p className="text-sm capitalize text-black/60">{selectedTier} scope</p>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {tracks.map((track, index) => (
          <div key={track.trackId} className="plot-wire-list-item">
            {track.artistBandId ? (
              <Link
                href={`/artist-bands/${track.artistBandId}?trackId=${track.trackId}`}
                className="flex items-center gap-3"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-black bg-[#e3e3d2] text-xs font-medium text-black/70">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-black">{track.title || 'Untitled Track'}</p>
                  <p className="truncate text-xs text-black/60">{track.artist || 'Unknown Artist'}</p>
                </div>
                <span className="shrink-0 text-xs text-black/50">{formatDuration(track.duration)}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-black bg-[#e3e3d2] text-xs font-medium text-black/70">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-black">{track.title || 'Untitled Track'}</p>
                  <p className="truncate text-xs text-black/60">{track.artist || 'Unknown Artist'}</p>
                </div>
                <span className="shrink-0 text-xs text-black/50">{formatDuration(track.duration)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
