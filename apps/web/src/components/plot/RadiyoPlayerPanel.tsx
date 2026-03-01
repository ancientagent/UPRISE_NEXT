'use client';

import { Button } from '@uprise/ui';

export type PlayerMode = 'RADIYO' | 'Collection';
export type RotationPool = 'new_releases' | 'main_rotation';
export type PlayerTier = 'city' | 'state' | 'national';

interface RadiyoPlayerPanelProps {
  mode: PlayerMode;
  onModeChange: (mode: PlayerMode) => void;
  rotationPool: RotationPool;
  onRotationPoolChange: (pool: RotationPool) => void;
  selectedTier: PlayerTier;
  onTierChange: (tier: PlayerTier) => void;
  broadcastLabel: string;
}

export default function RadiyoPlayerPanel({
  mode,
  onModeChange,
  rotationPool,
  onRotationPoolChange,
  selectedTier,
  onTierChange,
  broadcastLabel,
}: RadiyoPlayerPanelProps) {
  const isRadiyoMode = mode === 'RADIYO';

  return (
    <section className="mt-4 rounded-2xl border border-black/15 bg-black p-4 text-white shadow-sm transition-all">
      <div className="mb-3 flex flex-wrap items-center gap-5 rounded-xl border border-white/15 bg-white/5 px-3 py-2">
        {(['city', 'state', 'national'] as PlayerTier[]).map((tier) => (
          <button
            key={tier}
            type="button"
            onClick={() => onTierChange(tier)}
            className="inline-flex items-center gap-2 text-xs font-medium text-white transition-opacity hover:opacity-80"
            aria-pressed={selectedTier === tier}
          >
            <span
              className={`h-3 w-3 rounded-full border ${
                selectedTier === tier ? 'border-[#b7d43f] bg-[#b7d43f]' : 'border-white/70 bg-transparent'
              }`}
              aria-hidden
            />
            <span className="capitalize">{tier}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {isRadiyoMode ? (
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

        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 p-1">
          <Button
            size="sm"
            variant={isRadiyoMode ? 'default' : 'outline'}
            className={isRadiyoMode ? 'bg-[#b7d43f] text-black hover:bg-[#a8c63a]' : 'text-white'}
            onClick={() => onModeChange('RADIYO')}
          >
            RADIYO
          </Button>
          <Button
            size="sm"
            variant={mode === 'Collection' ? 'default' : 'outline'}
            className={mode === 'Collection' ? 'bg-[#5da9ff] text-black hover:bg-[#499cf5]' : 'text-white'}
            onClick={() => onModeChange('Collection')}
          >
            Collection
          </Button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/5 p-3">
        <div className="min-w-0 flex-1">
          {isRadiyoMode ? (
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

        {isRadiyoMode ? (
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
