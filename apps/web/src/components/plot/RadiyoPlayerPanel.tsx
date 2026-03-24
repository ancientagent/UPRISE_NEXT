'use client';

import { Button } from '@uprise/ui';
import { getEngagementWheelActions } from '@/components/plot/engagement-wheel';

export type PlayerMode = 'RADIYO' | 'Collection';
export type RotationPool = 'new_releases' | 'main_rotation';
export type PlayerTier = 'city' | 'state' | 'national';

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
}: RadiyoPlayerPanelProps) {
  const isRadiyoMode = mode === 'RADIYO';
  const tierOptions: PlayerTier[] = ['national', 'state', 'city'];
  const wheelActions = getEngagementWheelActions(mode);

  return (
    <section
      data-slot="compact-player-shell"
      className="mt-4 rounded-[0.95rem] border border-black/15 bg-black px-2 py-[0.4rem] text-white shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
            {isRadiyoMode ? 'Scene Context' : 'Collection Context'}
          </p>
          <p className="mt-1 truncate text-sm font-semibold leading-tight text-white">{broadcastLabel}</p>
        </div>

        <div
          className="shrink-0 rounded-full border border-white/15 bg-white/5 px-1.5 py-[0.3rem] text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75"
          aria-label="Player mode summary"
        >
          {mode}
        </div>
      </div>

      <div
        data-slot="player-track-row"
        className="mt-2 flex items-stretch gap-1 rounded-[0.75rem] border border-white/12 bg-white/[0.04] p-[0.4rem]"
      >
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[1.05rem] border ${
              isRadiyoMode
                ? 'border-lime-300/35 bg-[radial-gradient(circle_at_top,_rgba(183,212,63,0.45),_rgba(255,255,255,0.08)_55%,_rgba(0,0,0,0.55))]'
                : 'border-sky-300/35 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.45),_rgba(255,255,255,0.08)_55%,_rgba(0,0,0,0.55))]'
            }`}
            aria-label={isRadiyoMode ? 'Current track art thumbnail' : 'Collection track art thumbnail'}
          >
            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/72">Art</span>
          </div>

          <div className="min-w-0 flex-1">
            {isRadiyoMode ? (
              <>
                <p className="truncate text-sm font-semibold leading-tight">Now Broadcasting</p>
                <p className="mt-1 truncate text-xs text-white/72">
                  {rotationPool === 'new_releases' ? 'New Releases' : 'Main Rotation'}
                </p>
              </>
            ) : (
              <>
                <p className="truncate text-sm font-semibold leading-tight">
                  {collectionTitle ?? 'Collection Player'}
                </p>
                <p className="mt-1 truncate text-xs text-white/72">Selection-driven collection queue</p>
              </>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-1">
              {isRadiyoMode ? (
                <>
                  <Button
                    size="sm"
                    variant={rotationPool === 'new_releases' ? 'default' : 'outline'}
                    className="h-6 rounded-full px-2.5 text-[10px]"
                    onClick={() => onRotationPoolChange('new_releases')}
                  >
                    New
                  </Button>
                  <Button
                    size="sm"
                    variant={rotationPool === 'main_rotation' ? 'default' : 'outline'}
                    className="h-6 rounded-full px-2.5 text-[10px]"
                    onClick={() => onRotationPoolChange('main_rotation')}
                  >
                    Current
                  </Button>
                </>
              ) : (
                <p className="text-[11px] font-medium text-white/60">Selection-driven queue</p>
              )}

              <div className="min-w-0 flex items-center gap-1 rounded-full border border-white/12 bg-white/[0.03] px-1.5 py-[0.3rem]">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-lime-300">
                  {activeBroadcastTier ? 'Live' : 'Stopped'}
                </span>
                <p className="truncate text-[11px] text-white/72">{broadcastLabel}</p>
              </div>
            </div>
          </div>
        </div>

        {isRadiyoMode ? (
          <div
            data-slot="player-tier-stack"
            className="flex w-[3.35rem] shrink-0 flex-col gap-1 rounded-[0.65rem] border border-white/12 bg-black/20 p-1"
          >
            {tierOptions.map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => onTierChange(tier)}
                className={`rounded-[0.8rem] border px-2 py-1.25 text-[10px] font-semibold capitalize transition-colors ${
                  activeBroadcastTier === tier
                    ? 'border-[#b7d43f] bg-[#b7d43f] text-black'
                    : 'border-white/12 bg-white/[0.03] text-white/82 hover:bg-white/[0.08]'
                }`}
                aria-pressed={activeBroadcastTier === tier}
              >
                {tier}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex w-20 shrink-0 flex-col items-stretch gap-1.5">
            <button
              type="button"
              className="h-8 rounded-xl border border-white/20 px-2 text-xs font-medium text-blue-100 hover:bg-white/10"
              aria-label="Eject to RADIYO"
              onClick={onCollectionEject}
            >
              Eject
            </button>
            <button
              type="button"
              className="h-8 rounded-xl border border-white/20 px-2 text-xs font-medium text-blue-100 hover:bg-white/10"
              aria-label="Shuffle collection"
            >
              Shuffle
            </button>
          </div>
        )}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-[0.9rem] border border-white/12 bg-white/[0.03] px-2 py-2">
        <div className="text-[11px] font-medium text-white/58">
          <p>
            {isRadiyoMode
              ? 'Tap City, State, or National to start that broadcast. Tap the active tier again to stop.'
              : 'Collection mode stays selection-driven. Use eject to return to RADIYO.'}
          </p>
          <p className="mt-1">
            Wheel: {wheelActions.map((action) => (action.position ? `${action.position} ${action.label}` : action.label)).join(' • ')}
          </p>
        </div>
      </div>
    </section>
  );
}
