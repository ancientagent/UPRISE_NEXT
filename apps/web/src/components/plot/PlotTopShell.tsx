import type { PointerEvent, ReactNode } from 'react';
import { Button } from '@uprise/ui';
import type {
  HomeSceneSelector as HomeSceneSelectorReadModel,
  HomeSceneSelectorItem,
} from '@/lib/users/client';
import type { HomeSceneSelection } from '@/store/onboarding';
import HomeSceneSelector from '@/components/plot/HomeSceneSelector';

interface PlotTopShellUser {
  displayName?: string | null;
  username?: string | null;
}

interface PlotTopShellProps {
  user: PlotTopShellUser | null;
  homeScene: HomeSceneSelection | null;
  selectedCommunityId: string | null;
  selectedCommunityLabel: string | null;
  homeCityLabel: string;
  listenerRecommendationLabel: string;
  profilePanelState: 'collapsed' | 'peek' | 'expanded';
  isProfileExpanded: boolean;
  seamLabel: string;
  hasPioneerFollowUp: boolean;
  isNotificationPanelOpen: boolean;
  pioneerNotificationHomeScene: HomeSceneSelection | null;
  homeSceneSelector: HomeSceneSelectorReadModel;
  homeSceneSelectorLoading: boolean;
  homeSceneSelectorError: string | null;
  homeSceneSelectorSelectingSceneId: string | null;
  playerPanel: ReactNode;
  onProfilePointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  onProfilePointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  onProfilePointerUp: () => void;
  onToggleProfilePanel: () => void;
  onToggleNotificationPanel: () => void;
  onHomeSceneSelect: (item: HomeSceneSelectorItem) => void;
}

export default function PlotTopShell({
  user,
  homeScene,
  selectedCommunityId,
  selectedCommunityLabel,
  homeCityLabel,
  listenerRecommendationLabel,
  profilePanelState,
  isProfileExpanded,
  seamLabel,
  hasPioneerFollowUp,
  isNotificationPanelOpen,
  pioneerNotificationHomeScene,
  homeSceneSelector,
  homeSceneSelectorLoading,
  homeSceneSelectorError,
  homeSceneSelectorSelectingSceneId,
  playerPanel,
  onProfilePointerDown,
  onProfilePointerMove,
  onProfilePointerUp,
  onToggleProfilePanel,
  onToggleNotificationPanel,
  onHomeSceneSelect,
}: PlotTopShellProps) {
  return (
    <section
      data-slot="plot-top-shell"
      className="rounded-[1.35rem] border border-black bg-[linear-gradient(180deg,#f5f1dd_0%,#dfdfcf_100%)] p-2 shadow-[3px_3px_0_rgba(0,0,0,0.22)]"
    >
      <section className="rounded-[1.15rem] border border-black bg-[#dfdfcf] px-3 py-3 transition-all">
        <div
          data-slot="home-identity-layer"
          className="flex flex-wrap items-end justify-between gap-3 rounded-[1.15rem] border border-black bg-[#f2f0df] px-3 py-3 sm:flex-nowrap"
          onPointerDown={onProfilePointerDown}
          onPointerMove={onProfilePointerMove}
          onPointerUp={onProfilePointerUp}
        >
          <div className="flex min-w-0 flex-1 basis-full items-end gap-3 sm:basis-auto">
            <div
              data-slot="listener-avatar-bust"
              className="flex h-16 w-14 shrink-0 items-end justify-center rounded-t-full border border-black bg-[#b8d63b] shadow-[2px_2px_0_rgba(0,0,0,0.28)]"
              aria-label="Listener avatar bust"
            >
              <span className="mb-2 h-8 w-8 rounded-full border border-black bg-[#efefe2]" aria-hidden />
            </div>

            <div data-slot="home-identity-copy" className="min-w-0 flex-1">
              <div
                data-slot="listener-recommendation-bubble"
                className="mb-2 max-w-full rounded-[1rem] border border-black bg-white px-3 py-2 shadow-[2px_2px_0_rgba(0,0,0,0.22)] sm:max-w-[18rem]"
              >
                <p className="plot-wire-label">Current recommendation</p>
                <p className="truncate text-xs font-semibold text-black">
                  {listenerRecommendationLabel}
                </p>
              </div>
              <p className="plot-wire-label">UPRISE {homeCityLabel}</p>
              <p className="truncate text-sm font-semibold leading-tight text-black">
                {user?.displayName || user?.username || 'User'}
              </p>
              <p className="mt-1 truncate text-[11px] text-black/60">
                {selectedCommunityLabel ??
                  (homeScene?.city && homeScene?.state && homeScene?.musicCommunity
                    ? `${homeScene.city}, ${homeScene.state} • ${homeScene.musicCommunity}`
                    : 'No scene selected')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="relative h-8 rounded-full border-black bg-white text-xs"
                aria-label="Notifications"
                aria-controls={hasPioneerFollowUp ? 'plot-pioneer-follow-up' : undefined}
                aria-expanded={hasPioneerFollowUp ? isNotificationPanelOpen : undefined}
                onPointerDown={(event) => {
                  event.stopPropagation();
                }}
                onPointerUp={(event) => {
                  event.stopPropagation();
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  if (!hasPioneerFollowUp) return;
                  onToggleNotificationPanel();
                }}
              >
                🔔
                {hasPioneerFollowUp ? (
                  <span
                    className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#b7d43f]"
                    aria-hidden
                  />
                ) : null}
              </Button>
              {hasPioneerFollowUp && isNotificationPanelOpen && pioneerNotificationHomeScene ? (
                <div
                  id="plot-pioneer-follow-up"
                  className="absolute right-0 top-10 z-20 w-72 rounded-[1.1rem] border border-black bg-[#f7f7ef] p-4 text-left shadow-[4px_4px_0_rgba(0,0,0,0.3)]"
                >
                  <p className="plot-wire-label">Proxy Scene Notice</p>
                  <p className="mt-2 text-sm font-medium text-black">
                    {pioneerNotificationHomeScene.city}, {pioneerNotificationHomeScene.state} •{' '}
                    {pioneerNotificationHomeScene.musicCommunity}
                  </p>
                  <p className="mt-2 text-sm text-black/70">
                    Your submitted Home Scene is not active yet. You are temporarily routed through the
                    nearest active city scene for {pioneerNotificationHomeScene.musicCommunity}.
                  </p>
                  <p className="mt-2 text-sm text-black/70">
                    To help that scene open, tell local bands and artists to register with UPRISE.
                  </p>
                </div>
              ) : null}
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-8 rounded-full border-black bg-white text-xs"
              aria-label="More menu"
            >
              ⋯
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            id="plot-profile-seam-toggle"
            className="mx-auto flex w-full items-center justify-center gap-2 rounded-[0.95rem] border border-black bg-[#efefe2] px-4 py-2.5 text-xs font-medium text-black/70"
            onClick={onToggleProfilePanel}
            aria-controls="plot-profile-panel"
            aria-expanded={isProfileExpanded}
            aria-label={profilePanelState === 'expanded' ? 'Collapse profile panel' : 'Expand profile panel'}
          >
            <span className="block h-1.5 w-8 rounded-full bg-black/30" aria-hidden />
            <span>{seamLabel}</span>
          </button>
        </div>
      </section>

      <div data-slot="plot-top-shell-selector-player" className="space-y-3">
        <HomeSceneSelector
          selector={homeSceneSelector}
          selectedCommunityId={selectedCommunityId}
          selectedCommunityLabel={selectedCommunityLabel}
          loading={homeSceneSelectorLoading}
          error={homeSceneSelectorError}
          selectingSceneId={homeSceneSelectorSelectingSceneId}
          onSelect={onHomeSceneSelect}
        />

        {isProfileExpanded ? null : playerPanel}
      </div>
    </section>
  );
}
