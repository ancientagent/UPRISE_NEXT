'use client';

import type { KeyboardEvent } from 'react';
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
  const handleModeToggleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      onModeChange('RADIYO');
      return;
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      onModeChange('Collection');
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      onModeChange('RADIYO');
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      onModeChange('Collection');
    }
  };

  return (
    <section className="mt-5 rounded-2xl border border-black/15 bg-black px-5 py-4 text-white shadow-sm transition-all">
      <div className="mb-4 flex flex-wrap items-center gap-4 rounded-xl border border-white/15 bg-white/5 px-4 py-3">
        {(['city', 'state', 'national'] as PlayerTier[]).map((tier) => (
          <button
            key={tier}
            type="button"
            onClick={() => onTierChange(tier)}
            className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium text-white transition-opacity hover:opacity-80"
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

      <div className="flex flex-wrap items-center justify-between gap-4">
        {isRadiyoMode ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={rotationPool === 'new_releases' ? 'default' : 'outline'}
              className="h-8 text-xs"
              onClick={() => onRotationPoolChange('new_releases')}
            >
              New Releases
            </Button>
            <Button
              size="sm"
              variant={rotationPool === 'main_rotation' ? 'default' : 'outline'}
              className="h-8 text-xs"
              onClick={() => onRotationPoolChange('main_rotation')}
            >
              Main Rotation
            </Button>
          </div>
        ) : (
          <div className="text-xs font-medium text-white/70">Collection playback</div>
        )}

        <div className="min-w-0 flex items-center gap-2 px-1.5">
          <span className="text-xs text-lime-300" aria-hidden>
            📡
          </span>
          <p className="truncate text-xs font-medium text-white/80">{broadcastLabel}</p>
        </div>

        <div
          className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 p-1.5"
          role="radiogroup"
          aria-label="Player mode"
          onKeyDown={handleModeToggleKeyDown}
        >
          <Button
            size="sm"
            variant={isRadiyoMode ? 'default' : 'outline'}
            className={isRadiyoMode ? 'h-8 bg-[#b7d43f] text-xs text-black hover:bg-[#a8c63a]' : 'h-8 text-xs text-white'}
            onClick={() => onModeChange('RADIYO')}
            aria-label="Switch to RADIYO mode"
            role="radio"
            aria-checked={isRadiyoMode}
          >
            RADIYO
          </Button>
          <Button
            size="sm"
            variant={mode === 'Collection' ? 'default' : 'outline'}
            className={mode === 'Collection' ? 'h-8 bg-[#5da9ff] text-xs text-black hover:bg-[#499cf5]' : 'h-8 text-xs text-white'}
            onClick={() => onModeChange('Collection')}
            aria-label="Switch to Collection mode"
            role="radio"
            aria-checked={mode === 'Collection'}
          >
            Collection
          </Button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/5 p-4">
        <div className="min-w-0 flex-1">
          {isRadiyoMode ? (
            <>
              <p className="truncate text-sm font-semibold leading-tight">Now Broadcasting</p>
              <p className="truncate text-xs text-white/75">{rotationPool === 'new_releases' ? 'New Releases' : 'Main Rotation'}</p>
            </>
          ) : (
            <>
              <p className="truncate text-sm font-semibold leading-tight">Collection Player</p>
              <p className="truncate text-xs text-white/75">Use shelves from expanded profile</p>
            </>
          )}
        </div>

        {isRadiyoMode ? (
          <div className="flex items-center gap-2 text-lime-300">
            <button
              type="button"
              className="h-8 rounded-md border border-white/20 px-3 text-xs text-lime-300 hover:bg-white/10"
              aria-label="Play"
            >
              ▶
            </button>
            <button
              type="button"
              className="h-8 rounded-md border border-white/20 px-3 text-xs text-lime-300 hover:bg-white/10"
              aria-label="Pause"
            >
              ⏸
            </button>
            <button
              type="button"
              className="h-8 rounded-md border border-white/20 px-3 text-xs text-lime-300 hover:bg-white/10"
              aria-label="Add to collection"
            >
              +
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-blue-300">
            <button
              type="button"
              className="h-8 rounded-md border border-white/20 px-3 text-xs text-blue-300 hover:bg-white/10"
              aria-label="Back track"
            >
              ⏮
            </button>
            <button
              type="button"
              className="h-8 rounded-md border border-white/20 px-3 text-xs text-blue-300 hover:bg-white/10"
              aria-label="Shuffle collection"
            >
              🔀
            </button>
            <button
              type="button"
              className="h-8 rounded-md border border-white/20 px-3 text-xs text-blue-300 hover:bg-white/10"
              aria-label="Play"
            >
              ▶
            </button>
            <button
              type="button"
              className="h-8 rounded-md border border-white/20 px-3 text-xs text-blue-300 hover:bg-white/10"
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
