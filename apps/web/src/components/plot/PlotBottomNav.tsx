import Link from 'next/link';
import { Button } from '@uprise/ui';
import type { PlayerMode } from '@/components/plot/RadiyoPlayerPanel';
import type { EngagementWheelAction } from '@/components/plot/engagement-wheel';

interface PlotBottomNavProps {
  isEngagementWheelOpen: boolean;
  playerMode: PlayerMode;
  wheelActions: EngagementWheelAction[];
  onToggleEngagementWheel: () => void;
  onCloseEngagementWheel: () => void;
}

export default function PlotBottomNav({
  isEngagementWheelOpen,
  playerMode,
  wheelActions,
  onToggleEngagementWheel,
  onCloseEngagementWheel,
}: PlotBottomNavProps) {
  return (
    <>
      {isEngagementWheelOpen ? (
        <div className="fixed inset-x-0 bottom-24 z-40 px-4 sm:px-6">
          <div className="mx-auto max-w-3xl rounded-[1.25rem] border border-black bg-[#efefe4] p-4 shadow-[4px_4px_0_rgba(0,0,0,0.35)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="plot-wire-label">UPRISE Wheel</p>
                <p className="mt-1 text-sm text-black/70">
                  {playerMode === 'RADIYO'
                    ? 'RADIYO actions stay deterministic for the current scene context.'
                    : 'SPACE actions stay deterministic for the selected listening context.'}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 text-xs"
                onClick={onCloseEngagementWheel}
                aria-label="Close engagement wheel"
              >
                Close
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {wheelActions.map((action) => (
                <span
                  key={`${action.label}-${action.position ?? 'center'}`}
                  className="plot-wire-chip bg-white px-3 py-2 text-[11px]"
                >
                  {action.position ? `${action.position} ${action.label}` : action.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <nav
        aria-label="Plot bottom navigation"
        data-slot="plot-bottom-nav"
        className="plot-wire-nav"
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <Link
            href="/plot"
            className="plot-wire-nav-button inline-flex min-h-11 items-center justify-center px-4"
          >
            Home
          </Link>

          <button
            type="button"
            className="plot-wire-nav-center inline-flex min-h-11 items-center justify-center px-5 hover:bg-[#b8d63b]/90"
            onClick={onToggleEngagementWheel}
            aria-expanded={isEngagementWheelOpen}
            aria-controls="plot-engagement-wheel"
            aria-label="Open UPRISE engagement wheel"
          >
            UPRISE
          </button>

          <button
            type="button"
            className="plot-wire-nav-button inline-flex min-h-11 items-center justify-center gap-2 px-4 opacity-55"
            aria-disabled="true"
            title="Discover is coming soon while MVP stays local-community-only."
          >
            <span>Discover</span>
            <span className="plot-wire-chip bg-[#d9d9d1] text-black/70">Soon</span>
          </button>
        </div>
      </nav>
    </>
  );
}
