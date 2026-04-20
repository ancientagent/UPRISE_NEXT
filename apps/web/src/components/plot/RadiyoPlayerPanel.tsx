'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Track } from '@uprise/types';
import { Button } from '@uprise/ui';
import { getEngagementWheelActions } from '@/components/plot/engagement-wheel';

export type PlayerMode = 'RADIYO' | 'SPACE';
export type RotationPool = 'new_releases' | 'main_rotation';
export type PlayerTier = 'city' | 'state' | 'national';
const MVP_PLAYER_TIER_OPTIONS: PlayerTier[] = ['state', 'city'];

interface RadiyoPlayerPanelProps {
  mode: PlayerMode;
  onCollectionEject: () => void;
  rotationPool: RotationPool;
  onRotationPoolChange: (pool: RotationPool) => void;
  selectedTier: PlayerTier;
  activeBroadcastTier: PlayerTier | null;
  onTierChange: (tier: PlayerTier) => void;
  broadcastLabel: string;
  collectionTitle?: string | null;
  trackQueue?: Track[];
  currentTrack?: Track | null;
  currentTrackCount?: number;
  isBroadcastLoading?: boolean;
  broadcastError?: string | null;
  broadcastEmptyMessage?: string | null;
  radiyoFooter?: ReactNode;
}

export default function RadiyoPlayerPanel({
  mode,
  onCollectionEject,
  rotationPool,
  onRotationPoolChange,
  selectedTier,
  activeBroadcastTier,
  onTierChange,
  broadcastLabel,
  collectionTitle,
  trackQueue = [],
  currentTrack = null,
  currentTrackCount = 0,
  isBroadcastLoading = false,
  broadcastError = null,
  broadcastEmptyMessage = null,
  radiyoFooter = null,
}: RadiyoPlayerPanelProps) {
  const isRadiyoMode = mode === 'RADIYO';
  const wheelActions = getEngagementWheelActions(mode);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const radiyoTrackQueue = useMemo(
    () => (trackQueue.length > 0 ? trackQueue : currentTrack ? [currentTrack] : []),
    [currentTrack, trackQueue],
  );
  const activeTrack = isRadiyoMode ? radiyoTrackQueue[currentTrackIndex] ?? null : currentTrack;
  const activeTrackCount = isRadiyoMode ? radiyoTrackQueue.length : currentTrackCount;

  useEffect(() => {
    setCurrentTrackIndex(0);
  }, [
    activeBroadcastTier,
    isRadiyoMode,
    rotationPool,
    radiyoTrackQueue.map((track) => track.id).join('|'),
  ]);

  useEffect(() => {
    if (currentTrackIndex < activeTrackCount) {
      return;
    }

    setCurrentTrackIndex(0);
  }, [activeTrackCount, currentTrackIndex]);

  const handleTrackEnded = () => {
    if (radiyoTrackQueue.length <= 1) {
      return;
    }

    setCurrentTrackIndex((current) => (current + 1) % radiyoTrackQueue.length);
  };

  const trackArtLabel = isRadiyoMode ? 'Current track art thumbnail' : 'Space track art thumbnail';
  const trackSubtitle = isRadiyoMode
    ? isBroadcastLoading
      ? 'Loading current broadcast...'
      : activeTrack
        ? activeTrack.artist
        : activeTrackCount > 0
          ? 'Select a tier to resume this broadcast.'
          : broadcastEmptyMessage ?? 'No tracks are available in this rotation yet.'
    : 'Selection-driven space queue';
  const queueLabel = isRadiyoMode
    ? activeTrackCount > 0
      ? `Track ${Math.min(currentTrackIndex + 1, activeTrackCount)} of ${activeTrackCount} in this rotation`
      : 'Waiting for the rotation to populate'
    : 'Selection-driven space queue';

  return (
    <section
      data-slot="compact-player-shell"
      className="plot-wire-card mt-3 overflow-hidden bg-[#202020] text-white"
    >
      <div className="grid gap-3 px-3 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="rounded-[1rem] border border-white/15 bg-[#2a2a2a] p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/52">
                {isRadiyoMode ? 'Now Playing' : 'Your Space'}
              </p>
              <p className="mt-1 truncate text-sm font-semibold leading-tight text-white">{broadcastLabel}</p>
              <p className="mt-1 text-[11px] text-white/68">
                {isRadiyoMode
                  ? rotationPool === 'new_releases'
                    ? 'New releases are cycling through this scene feed.'
                    : 'Current rotation is driving the active broadcast.'
                  : 'Selection-driven queue for your chosen collection item.'}
              </p>
            </div>

            <div className="plot-wire-chip bg-[#b8d63b] px-3 text-black">{mode}</div>
          </div>

          <div data-slot="player-track-row" className="mt-3 grid gap-2 sm:grid-cols-[70px_minmax(0,1fr)]">
            <div
              className="flex h-[70px] w-[70px] items-center justify-center rounded-[0.95rem] border border-white/18 bg-[linear-gradient(135deg,#111_0%,#444_100%)]"
              aria-label={trackArtLabel}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/66">
                {isRadiyoMode && currentTrack?.coverArt ? 'Cover' : 'Art'}
              </span>
            </div>

            <div className="min-w-0 rounded-[0.95rem] border border-white/12 bg-black/20 px-3 py-2">
              {isRadiyoMode ? (
                <>
                  <p className="truncate text-sm font-semibold">
                    {activeTrack?.title ?? 'Now Broadcasting'}
                  </p>
                  <p className="mt-1 truncate text-[11px] text-white/68">{trackSubtitle}</p>
                </>
              ) : (
                <>
                  <p className="truncate text-sm font-semibold">{collectionTitle ?? 'Space Player'}</p>
                  <p className="mt-1 truncate text-[11px] text-white/68">Selection-driven space queue</p>
                </>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {isRadiyoMode ? (
                  <>
                    <Button
                      size="sm"
                      variant={rotationPool === 'new_releases' ? 'default' : 'outline'}
                      className={rotationPool === 'new_releases' ? 'h-7 rounded-full border-black bg-[#b8d63b] px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-black hover:bg-[#b8d63b]/90' : 'h-7 rounded-full border-white/20 bg-transparent px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-white/10'}
                      onClick={() => onRotationPoolChange('new_releases')}
                    >
                      New
                    </Button>
                    <Button
                      size="sm"
                      variant={rotationPool === 'main_rotation' ? 'default' : 'outline'}
                      className={rotationPool === 'main_rotation' ? 'h-7 rounded-full border-black bg-[#b8d63b] px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-black hover:bg-[#b8d63b]/90' : 'h-7 rounded-full border-white/20 bg-transparent px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-white/10'}
                      onClick={() => onRotationPoolChange('main_rotation')}
                    >
                      Current
                    </Button>
                  </>
                ) : (
                  <p className="text-[11px] font-medium text-white/62">Selection-driven space queue</p>
                )}

                <div className="min-w-0 rounded-full border border-white/18 bg-white/6 px-3 py-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#b8d63b]">
                    {activeBroadcastTier ? 'Live' : 'Stopped'}
                  </span>
                  <p className="truncate text-[11px] text-white/72">
                    {isRadiyoMode ? queueLabel : broadcastLabel}
                  </p>
                </div>
              </div>

              {isRadiyoMode ? (
                <div className="mt-3 space-y-2">
                  {broadcastError ? (
                    <p className="rounded-lg border border-red-400/40 bg-red-950/30 px-3 py-2 text-[11px] text-red-100">
                      {broadcastError}
                    </p>
                  ) : null}
                  {activeTrack ? (
                    <audio
                      key={`${activeTrack.id}-${currentTrackIndex}`}
                      className="w-full"
                      controls
                      autoPlay
                      src={activeTrack.fileUrl}
                      onEnded={handleTrackEnded}
                    >
                      Your browser does not support audio playback.
                    </audio>
                  ) : (
                    <p className="text-[11px] text-white/60">
                      {isBroadcastLoading
                        ? 'Loading broadcast audio...'
                        : broadcastEmptyMessage ?? 'No broadcast audio is available for this tier and rotation yet.'}
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {isRadiyoMode ? (
            <div data-slot="player-tier-stack" className="grid grid-cols-3 gap-2 sm:grid-cols-1 sm:grid-rows-3">
            {MVP_PLAYER_TIER_OPTIONS.map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => onTierChange(tier)}
                className={`min-w-[72px] rounded-[1rem] border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                  activeBroadcastTier === tier
                    ? 'border-black bg-[#b8d63b] text-black'
                    : 'border-white/16 bg-[#2a2a2a] text-white/82 hover:bg-white/10'
                }`}
                aria-pressed={activeBroadcastTier === tier}
              >
                {tier}
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
            <button
              type="button"
              className="rounded-[1rem] border border-white/18 bg-[#2a2a2a] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-white/10"
              aria-label="Return to RADIYO"
              onClick={onCollectionEject}
            >
              Eject
            </button>
            <button
              type="button"
              className="rounded-[1rem] border border-white/18 bg-[#2a2a2a] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-white/10"
              aria-label="Shuffle space"
            >
              Shuffle
            </button>
          </div>
        )}
      </div>

      {isRadiyoMode && radiyoFooter ? (
        <div className="border-t border-white/12 bg-[#161616] px-3 py-3 text-[11px] text-white/64">{radiyoFooter}</div>
      ) : (
        <div className="border-t border-white/12 bg-[#161616] px-3 py-2.5 text-[11px] text-white/64">
          <p>
            {isRadiyoMode
              ? 'Tap City or State to start that broadcast. Tap the active tier again to stop.'
              : 'SPACE stays selection-driven. Use return to go back to RADIYO.'}
          </p>
          <p className="mt-1">
            Wheel: {wheelActions.map((action) => (action.position ? `${action.position} ${action.label}` : action.label)).join(' • ')}
          </p>
        </div>
      )}
    </section>
  );
}
