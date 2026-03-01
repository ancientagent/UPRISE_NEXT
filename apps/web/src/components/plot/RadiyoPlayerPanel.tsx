'use client';

import { Button } from '@uprise/ui';

export type PlayerMode = 'RADIYO' | 'Collection';
export type RotationPool = 'new_releases' | 'main_rotation';

interface RadiyoPlayerPanelProps {
  mode: PlayerMode;
  onModeChange: (mode: PlayerMode) => void;
  rotationPool: RotationPool;
  onRotationPoolChange: (pool: RotationPool) => void;
  broadcastLabel: string;
}

export default function RadiyoPlayerPanel({
  mode,
  onModeChange,
  rotationPool,
  onRotationPoolChange,
  broadcastLabel,
}: RadiyoPlayerPanelProps) {
  return (
    <section className="mt-4 rounded-2xl border border-black/15 bg-black p-4 text-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {mode === 'RADIYO' ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={rotationPool === 'new_releases' ? 'default' : 'outline'}
              onClick={() => onRotationPoolChange('new_releases')}
            >
              New Releases
            </Button>
            <Button
              size="sm"
              variant={rotationPool === 'main_rotation' ? 'default' : 'outline'}
              onClick={() => onRotationPoolChange('main_rotation')}
            >
              Main Rotation
            </Button>
          </div>
        ) : (
          <div className="text-xs text-white/70">Collection playback</div>
        )}

        <div className="min-w-0 flex items-center gap-2 px-1">
          <span className="text-xs text-lime-300" aria-hidden>
            📡
          </span>
          <p className="truncate text-xs font-medium text-white/80">{broadcastLabel}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={mode === 'RADIYO' ? 'default' : 'outline'}
            onClick={() => onModeChange('RADIYO')}
          >
            RADIYO
          </Button>
          <Button
            size="sm"
            variant={mode === 'Collection' ? 'default' : 'outline'}
            onClick={() => onModeChange('Collection')}
          >
            Collection
          </Button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/5 p-3">
        <div className="min-w-0 flex-1">
          {mode === 'RADIYO' ? (
            <>
              <p className="truncate text-sm font-semibold">Now Broadcasting</p>
              <p className="truncate text-xs text-white/75">{rotationPool === 'new_releases' ? 'New Releases' : 'Main Rotation'}</p>
            </>
          ) : (
            <>
              <p className="truncate text-sm font-semibold">Collection Player</p>
              <p className="truncate text-xs text-white/75">Use shelves from expanded profile</p>
            </>
          )}
        </div>

        {mode === 'RADIYO' ? (
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
    </section>
  );
}
