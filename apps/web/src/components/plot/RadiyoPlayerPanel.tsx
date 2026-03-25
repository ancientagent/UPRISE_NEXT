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
      className="plot-zine-card plot-record-sleeve plot-paper-clip mt-4 rounded-[1.35rem] px-3 py-3 text-[var(--ink-main)] shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="plot-embossed-label px-3 py-1 text-[10px] font-semibold">
            {isRadiyoMode ? 'Scene Context' : 'Collection Context'}
          </p>
          <p className="mt-2 truncate text-sm font-semibold leading-tight text-[var(--ink-main)]">{broadcastLabel}</p>
        </div>

        <div
          className="plot-embossed-label shrink-0 px-2 py-[0.3rem] text-[10px] font-semibold"
          aria-label="Player mode summary"
        >
          {mode}
        </div>
      </div>

      <div
        data-slot="player-track-row"
        className="plot-ledger-card mt-3 flex items-stretch gap-2 rounded-[1rem] p-3"
      >
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[1.05rem] border ${
              isRadiyoMode
                ? 'border-[rgba(183,212,63,0.5)] bg-[radial-gradient(circle_at_top,_rgba(243,224,96,0.72),_rgba(255,255,255,0.2)_45%,_rgba(142,45,37,0.15)_88%)]'
                : 'border-[rgba(142,45,37,0.35)] bg-[radial-gradient(circle_at_top,_rgba(240,210,156,0.85),_rgba(255,255,255,0.16)_45%,_rgba(35,24,15,0.18)_88%)]'
            }`}
            aria-label={isRadiyoMode ? 'Current track art thumbnail' : 'Collection track art thumbnail'}
          >
            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-main)]/72">Art</span>
          </div>

          <div className="min-w-0 flex-1">
            {isRadiyoMode ? (
              <>
                <p className="truncate text-sm font-semibold leading-tight text-[var(--ink-main)]">Now Broadcasting</p>
                <p className="mt-1 truncate text-xs plot-ink-muted">
                  {rotationPool === 'new_releases' ? 'New Releases' : 'Main Rotation'}
                </p>
              </>
            ) : (
              <>
                <p className="truncate text-sm font-semibold leading-tight text-[var(--ink-main)]">
                  {collectionTitle ?? 'Collection Player'}
                </p>
                <p className="mt-1 truncate text-xs plot-ink-muted">Selection-driven collection queue</p>
              </>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-1">
              {isRadiyoMode ? (
                <>
                  <Button
                    size="sm"
                    variant={rotationPool === 'new_releases' ? 'default' : 'outline'}
                    className={
                      rotationPool === 'new_releases'
                        ? 'plot-divider-tab h-6 px-2.5 text-[10px] text-[var(--ink-main)]'
                        : 'plot-divider-tab h-6 bg-transparent px-2.5 text-[10px] text-[var(--ink-main)]'
                    }
                    onClick={() => onRotationPoolChange('new_releases')}
                  >
                    <span>New</span>
                  </Button>
                  <Button
                    size="sm"
                    variant={rotationPool === 'main_rotation' ? 'default' : 'outline'}
                    className={
                      rotationPool === 'main_rotation'
                        ? 'plot-divider-tab h-6 px-2.5 text-[10px] text-[var(--ink-main)]'
                        : 'plot-divider-tab h-6 bg-transparent px-2.5 text-[10px] text-[var(--ink-main)]'
                    }
                    onClick={() => onRotationPoolChange('main_rotation')}
                  >
                    <span>Current</span>
                  </Button>
                </>
              ) : (
                <p className="text-[11px] font-medium plot-ink-muted">Selection-driven queue</p>
              )}

              <div className="min-w-0 flex items-center gap-1 rounded-full border border-[rgba(92,68,45,0.18)] bg-white/60 px-1.5 py-[0.3rem]">
                <span className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${activeBroadcastTier ? 'text-[var(--red-pen)]' : 'plot-ink-muted'}`}>
                  {activeBroadcastTier ? 'Live' : 'Stopped'}
                </span>
                <p className="truncate text-[11px] plot-ink-muted">{broadcastLabel}</p>
              </div>
            </div>
          </div>
        </div>

        {isRadiyoMode ? (
          <div
            data-slot="player-tier-stack"
            className="flex w-[3.65rem] shrink-0 flex-col gap-1 rounded-[0.95rem] border border-[rgba(92,68,45,0.18)] bg-white/60 p-1.5"
          >
            {tierOptions.map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => onTierChange(tier)}
                className={`rounded-[0.9rem] border px-2 py-1.25 text-[10px] font-semibold capitalize transition-colors ${
                  activeBroadcastTier === tier
                    ? 'border-[var(--red-pen)] bg-[rgba(243,224,96,0.68)] text-[var(--ink-main)]'
                    : 'border-[rgba(92,68,45,0.18)] bg-[rgba(255,255,255,0.78)] text-[var(--ink-main)] hover:bg-[rgba(243,224,96,0.3)]'
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
              className="plot-divider-tab h-8 px-2 text-xs font-medium text-[var(--ink-main)]"
              aria-label="Eject to RADIYO"
              onClick={onCollectionEject}
            >
              <span>Eject</span>
            </button>
            <button
              type="button"
              className="plot-divider-tab h-8 px-2 text-xs font-medium text-[var(--ink-main)]"
              aria-label="Shuffle collection"
            >
              <span>Shuffle</span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-[0.9rem] border border-[rgba(92,68,45,0.18)] bg-white/60 px-3 py-2">
        <div className="text-[11px] font-medium plot-ink-muted">
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
