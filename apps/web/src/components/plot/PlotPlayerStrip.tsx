'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@uprise/ui';
import { api } from '@/lib/api';
import type { PlotPlayerMode } from '@/store/plot-ui';
import { useAuthStore } from '@/store/auth';

interface CollectionTrack {
  id: string;
  title: string;
  artist: string;
  shelf: string;
}

type PoolKey = 'new' | 'main';

interface BroadcastTrack {
  id: string;
  title: string;
  artist: string;
  duration: number | null;
  community: string | null;
}

interface BroadcastPools {
  newReleases: BroadcastTrack[];
  mainRotation: BroadcastTrack[];
}

function toTrack(value: unknown, index: number): BroadcastTrack {
  const item = (value ?? {}) as Record<string, unknown>;
  const id =
    (item.trackId as string | undefined) ||
    (item.id as string | undefined) ||
    `track-${index}`;

  return {
    id,
    title: ((item.title as string | undefined) || (item.trackTitle as string | undefined) || 'Untitled Track').trim(),
    artist: ((item.artist as string | undefined) || (item.artistName as string | undefined) || 'Unknown Artist').trim(),
    duration: typeof item.duration === 'number' ? item.duration : null,
    community:
      (item.communityName as string | undefined) ||
      (item.sceneName as string | undefined) ||
      null,
  };
}

function normalizePools(payload: unknown): BroadcastPools {
  const root = (payload ?? {}) as Record<string, unknown>;

  const newSource =
    (root.newReleases as unknown[]) ||
    (root.newPool as unknown[]) ||
    (root.new_releases as unknown[]) ||
    [];

  const mainSource =
    (root.mainRotation as unknown[]) ||
    (root.mainPool as unknown[]) ||
    (root.main_rotation as unknown[]) ||
    [];

  return {
    newReleases: Array.isArray(newSource) ? newSource.map(toTrack) : [],
    mainRotation: Array.isArray(mainSource) ? mainSource.map(toTrack) : [],
  };
}

function formatDuration(duration: number | null): string {
  if (!duration || duration <= 0) return '--:--';
  const mins = Math.floor(duration / 60);
  const secs = Math.floor(duration % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

interface PlotPlayerStripProps {
  playerMode: PlotPlayerMode;
  selectedCollectionTrack: CollectionTrack | null;
  onSwitchToRadiyo: () => void;
}

export default function PlotPlayerStrip({
  playerMode,
  selectedCollectionTrack,
  onSwitchToRadiyo,
}: PlotPlayerStripProps) {
  const { token } = useAuthStore();
  const [activePool, setActivePool] = useState<PoolKey>('new');
  const [pools, setPools] = useState<BroadcastPools>({ newReleases: [], mainRotation: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;

    async function loadRotation() {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get<unknown>('/broadcast/rotation', { token: token || undefined });
        if (canceled) return;
        setPools(normalizePools(response.data));
      } catch {
        if (canceled) return;
        setPools({ newReleases: [], mainRotation: [] });
        setError('Broadcast rotation is unavailable right now.');
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    }

    loadRotation();

    return () => {
      canceled = true;
    };
  }, [token]);

  const radiyoTracks = useMemo(
    () => (activePool === 'new' ? pools.newReleases : pools.mainRotation),
    [activePool, pools.mainRotation, pools.newReleases],
  );

  const radiyoNowPlaying = radiyoTracks[0] ?? null;

  return (
    <section className="rounded-2xl border border-black/15 bg-black p-4 text-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/70">Player</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] ${
              playerMode === 'radiyo' ? 'bg-lime-400 text-black' : 'bg-blue-400 text-black'
            }`}
          >
            {playerMode}
          </span>
        </div>

        {playerMode === 'radiyo' ? (
          <div className="flex gap-2">
            <Button size="sm" variant={activePool === 'new' ? 'default' : 'outline'} onClick={() => setActivePool('new')}>
              New Releases
            </Button>
            <Button
              size="sm"
              variant={activePool === 'main' ? 'default' : 'outline'}
              onClick={() => setActivePool('main')}
            >
              Main Rotation
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={onSwitchToRadiyo}>
            Back to RaDIYo
          </Button>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/5 p-3">
        {playerMode === 'radiyo' ? (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{radiyoNowPlaying?.title ?? 'No track in pool'}</p>
            <p className="truncate text-xs text-white/75">{radiyoNowPlaying?.artist ?? '—'}</p>
            <p className="text-[11px] text-white/60">
              {activePool === 'new' ? 'New Releases' : 'Main Rotation'} • {formatDuration(radiyoNowPlaying?.duration ?? null)}
              {radiyoNowPlaying?.community ? ` • ${radiyoNowPlaying.community}` : ''}
            </p>
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{selectedCollectionTrack?.title ?? 'Select a collection track'}</p>
            <p className="truncate text-xs text-white/75">{selectedCollectionTrack?.artist ?? 'Collection Mode'}</p>
            <p className="text-[11px] text-white/60">
              {selectedCollectionTrack ? `Shelf: ${selectedCollectionTrack.shelf}` : 'Choose a track from your collection'}
            </p>
          </div>
        )}

        {playerMode === 'radiyo' ? (
          <div className="flex items-center gap-2 text-lime-300">
            <button
              type="button"
              className="rounded-md border border-white/20 px-2 py-1 text-xs text-lime-300 hover:bg-white/10"
              aria-label="Play"
            >
              ▶
            </button>
            <button
              type="button"
              className="rounded-md border border-white/20 px-2 py-1 text-xs text-lime-300 hover:bg-white/10"
              aria-label="Pause"
            >
              ⏸
            </button>
            <button
              type="button"
              className="rounded-md border border-white/20 px-2 py-1 text-xs text-lime-300 hover:bg-white/10"
              aria-label="Add to collection"
            >
              +
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-blue-300">
            <button
              type="button"
              className="rounded-md border border-white/20 px-2 py-1 text-xs text-blue-300 hover:bg-white/10"
              aria-label="Back track"
            >
              ⏮
            </button>
            <button
              type="button"
              className="rounded-md border border-white/20 px-2 py-1 text-xs text-blue-300 hover:bg-white/10"
              aria-label="Shuffle collection"
            >
              🔀
            </button>
            <button
              type="button"
              className="rounded-md border border-white/20 px-2 py-1 text-xs text-blue-300 hover:bg-white/10"
              aria-label="Play"
            >
              ▶
            </button>
            <button
              type="button"
              className="rounded-md border border-white/20 px-2 py-1 text-xs text-blue-300 hover:bg-white/10"
              aria-label="Pause"
            >
              ⏸
            </button>
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-amber-300">{error}</p>}
      {loading && <p className="mt-2 text-xs text-white/60">Loading player data...</p>}
    </section>
  );
}

export type { CollectionTrack };
