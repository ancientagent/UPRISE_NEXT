'use client';

import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Button } from '@uprise/ui';
import { useOnboardingStore } from '@/store/onboarding';
import type { CommunityWithDistance } from '@/lib/types/community';
import { useAuthStore } from '@/store/auth';
import { usePlotUiStore } from '@/store/plot-ui';
import { api } from '@/lib/api';
import TopSongsPanel from '@/components/plot/TopSongsPanel';
import SeedFeedPanel from '@/components/plot/SeedFeedPanel';
import PlotEventsPanel from '@/components/plot/PlotEventsPanel';
import PlotPromotionsPanel from '@/components/plot/PlotPromotionsPanel';
import PlotPlayerStrip, { type CollectionTrack } from '@/components/plot/PlotPlayerStrip';
import ProfileExpansionPanel from '@/components/plot/ProfileExpansionPanel';

// Dynamic imports for client components
const StatisticsPanel = dynamic(
  () => import('@/components/plot/StatisticsPanel'),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-black/10 bg-white p-6 h-full">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-black/10 rounded" />
          <div className="h-64 w-full bg-black/5 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 mx-auto mb-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              <p className="text-sm text-black/50">Loading statistics...</p>
            </div>
          </div>
        </div>
      </div>
    ),
  }
);

const tabs = ['Feed', 'Events', 'Promotions', 'Statistics', 'Social'];

export default function PlotPage() {
  const router = useRouter();
  const { homeScene, gpsCoords, tunedSceneId, setDiscoveryContext } = useOnboardingStore();
  const { token, user } = useAuthStore();
  const {
    panelState,
    playerMode,
    setPanelState,
    switchToCollection,
    switchToRadiyo,
  } = usePlotUiStore();
  const [activeTab, setActiveTab] = useState('Feed');
  const [selectedTier, setSelectedTier] = useState<'city' | 'state' | 'national'>('city');
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityWithDistance | null>(null);
  const [selectedCollectionTrack, setSelectedCollectionTrack] = useState<CollectionTrack | null>(null);
  const dragStartY = useRef<number | null>(null);
  const dragDelta = useRef(0);

  const mapCenter = useMemo(() => {
    if (gpsCoords) {
      return { lat: gpsCoords.latitude, lng: gpsCoords.longitude };
    }
    return null;
  }, [gpsCoords]);

  const homeSceneTitle = useMemo(() => {
    if (!homeScene) return 'Home Scene not set';
    return `${homeScene.city}, ${homeScene.state} — ${homeScene.musicCommunity}`;
  }, [homeScene]);

  useEffect(() => {
    async function fetchDiscoveryContext() {
      if (!token) return;
      try {
        const response = await api.get<{
          tunedSceneId: string | null;
          tunedScene: {
            id: string;
            name: string;
            city: string | null;
            state: string | null;
            musicCommunity: string | null;
            tier: string;
            isActive: boolean;
          } | null;
          homeSceneId: string | null;
          isVisitor: boolean;
        }>('/discover/context', { token });
        setDiscoveryContext({
          tunedSceneId: response.data?.tunedSceneId ?? null,
          tunedScene: response.data?.tunedScene ?? null,
          isVisitor: response.data?.isVisitor ?? null,
        });
      } catch {
        // Keep local state if context fetch fails.
      }
    }
    fetchDiscoveryContext();
  }, [token, setDiscoveryContext]);

  useEffect(() => {
    async function resolveDefaultCommunity() {
      if (selectedCommunity) return;

      try {
        if (tunedSceneId) {
          const tunedResponse = await api.get<CommunityWithDistance | null>(
            `/communities/${tunedSceneId}`,
            { token: token || undefined },
          );
          if (tunedResponse.data) {
            setSelectedCommunity(tunedResponse.data);
            return;
          }
        }

        // Canon anchor: exact Home Scene tuple first.
        if (homeScene?.city && homeScene?.state && homeScene?.musicCommunity) {
          const homeParams = new URLSearchParams({
            city: homeScene.city,
            state: homeScene.state,
            musicCommunity: homeScene.musicCommunity,
          });

          const homeResponse = await api.get<CommunityWithDistance | null>(
            `/communities/resolve-home?${homeParams.toString()}`,
            { token: token || undefined },
          );

          if (homeResponse.data) {
            setSelectedCommunity(homeResponse.data);
            return;
          }
        }

        // Fallback: nearest community from GPS when available.
        if (mapCenter) {
          const nearbyResponse = await api.get<CommunityWithDistance[]>(
            `/communities/nearby?lat=${mapCenter.lat}&lng=${mapCenter.lng}&radius=10000&limit=1`,
            { token: token || undefined },
          );
          const closest = nearbyResponse.data?.[0];
          if (closest) setSelectedCommunity(closest);
        }
      } catch {
        // Leave unselected; Feed/Stats panels render guidance states.
      }
    }

    resolveDefaultCommunity();
  }, [selectedCommunity, mapCenter, token, homeScene, tunedSceneId]);

  const handleCommunitySelect = (community: CommunityWithDistance) => {
    setSelectedCommunity(community);
  };

  const handleSelectCollectionTrack = (track: CollectionTrack) => {
    setSelectedCollectionTrack(track);
    switchToCollection();
  };

  const handleProfilePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragStartY.current = event.clientY;
    dragDelta.current = 0;
    (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);
  };

  const handleProfilePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartY.current === null) return;
    dragDelta.current = event.clientY - dragStartY.current;
  };

  const handleProfilePointerUp = () => {
    const delta = dragDelta.current;
    dragStartY.current = null;
    dragDelta.current = 0;

    if (panelState !== 'expanded' && delta > 50) {
      setPanelState('expanded');
      return;
    }

    if (panelState === 'expanded' && delta < -50) {
      setPanelState('collapsed');
    }
  };

  // Callback to update nearby communities from StatisticsPanel
  const handleCommunitiesUpdate = (_communities: CommunityWithDistance[]) => {
    // Communities are managed within StatisticsPanel
    // This callback exists for potential future use
  };

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <section className="mb-4 rounded-2xl border border-black/10 bg-white/85 px-4 py-3 shadow-sm">
          <div
            className="flex items-center justify-between gap-3"
            onPointerDown={handleProfilePointerDown}
            onPointerMove={handleProfilePointerMove}
            onPointerUp={handleProfilePointerUp}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className={`flex items-center justify-center rounded-full border border-black/20 bg-black/5 font-semibold text-black transition-all ${panelState === 'expanded' ? 'h-14 w-14 text-lg' : 'h-9 w-9 text-sm'}`}>
                {user?.displayName?.[0] || user?.username?.[0] || 'U'}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-black">
                  {user?.displayName || user?.username || 'User'}
                </p>
                <p className="truncate text-xs text-black/60">@{user?.username || 'listener'}</p>
                <p className="text-[11px] text-black/45 md:hidden">
                  {panelState === 'expanded' ? 'Swipe up to collapse profile' : 'Pull down to open profile'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" aria-label="Notifications">
                🔔
              </Button>
              <Button size="sm" variant="outline" aria-label="More menu">
                ⋯
              </Button>
            </div>
          </div>
        </section>

        <div className="md:hidden">
          <ProfileExpansionPanel
            panelState={panelState}
            onExpand={() => setPanelState('expanded')}
            onCollapse={() => setPanelState('collapsed')}
            onPeek={() => setPanelState('peek')}
            onSelectCollectionTrack={handleSelectCollectionTrack}
            hideHandle
          />
        </div>

        <div className="md:hidden mb-2">
          <button
            type="button"
            className="mx-auto flex items-center gap-2 rounded-full border border-black/15 bg-white/90 px-3 py-1 text-[11px] font-medium text-black/70 shadow-sm"
            onClick={() => setPanelState(panelState === 'expanded' ? 'collapsed' : 'expanded')}
            aria-label={panelState === 'expanded' ? 'Collapse profile panel' : 'Expand profile panel'}
          >
            <span className="block h-1.5 w-8 rounded-full bg-black/30" aria-hidden />
            <span>{panelState === 'expanded' ? 'Pull Up' : 'Pull Down'}</span>
          </button>
        </div>

        <div className="mt-6">
          <PlotPlayerStrip
            playerMode={playerMode}
            selectedCollectionTrack={selectedCollectionTrack}
            selectedTier={selectedTier}
            onTierChange={setSelectedTier}
            broadcastName={homeSceneTitle}
            onSwitchToRadiyo={switchToRadiyo}
          />
        </div>

        <>
            <section className="mt-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-black/60">The Plot</p>
            </section>

            {/* Tab Navigation */}
            <section className="mt-3 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-black/10 bg-white/85 px-4 py-3 shadow-sm">
              {tabs.map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? 'default' : 'outline'}
                  className={
                    activeTab === tab
                      ? 'rounded-full bg-black text-white'
                      : 'rounded-full border-black/20 bg-white text-black hover:bg-black/5'
                  }
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Button>
              ))}
            </section>

            {/* Main Content Grid */}
            <section className="mt-6 space-y-6">
          <div className="rounded-2xl border border-black/10 bg-white/92 p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-black">
                {activeTab === 'Statistics' ? 'Scene Statistics' : activeTab}
              </h2>
              <p className="text-sm text-black/60">
                {activeTab === 'Feed' && 'Community actions appear here.'}
                {activeTab === 'Events' && 'Scene events listing from your selected community anchor.'}
                {activeTab === 'Promotions' && 'Scene-scoped promotions and offers from your selected anchor.'}
                {activeTab === 'Statistics' && (
                  <>
                    Scene metrics and activity from{' '}
                    <span className="capitalize">{selectedTier}</span> tier
                    {!homeScene && '. Complete onboarding to see your local scene.'}
                  </>
                )}
                {activeTab === 'Social' && 'Message boards and listening rooms.'}
              </p>
            </div>

            {/* Statistics Panel */}
            {activeTab === 'Statistics' ? (
              <div className="space-y-4">
                <StatisticsPanel
                  selectedTier={selectedTier}
                  onCommunitySelect={handleCommunitySelect}
                  onCommunitiesUpdate={handleCommunitiesUpdate}
                />
                <TopSongsPanel communityId={selectedCommunity?.id ?? null} selectedTier={selectedTier} />
                <div className="rounded-2xl border border-black/10 bg-white p-6">
                  <h3 className="font-semibold text-black mb-2">Scene Activity Snapshot</h3>
                  <p className="text-sm text-black/60">
                    Descriptive context for the current statistics scope. This is not a ranking or authority signal.
                  </p>
                  <p className="text-xs text-black/50 mt-2">
                    Current tier: <span className="capitalize">{selectedTier}</span>
                    {selectedCommunity && <span> • Selected: {selectedCommunity.name}</span>}
                  </p>
                </div>
              </div>
            ) : activeTab === 'Feed' ? (
              <SeedFeedPanel
                communityId={selectedCommunity?.id ?? null}
                communityName={selectedCommunity?.name ?? null}
              />
            ) : activeTab === 'Events' ? (
              <PlotEventsPanel
                communityId={selectedCommunity?.id ?? null}
                communityName={selectedCommunity?.name ?? null}
              />
            ) : activeTab === 'Promotions' ? (
              <PlotPromotionsPanel
                communityId={selectedCommunity?.id ?? null}
                communityName={selectedCommunity?.name ?? null}
              />
            ) : (
              <div className="text-center py-12 border border-dashed border-black/20 rounded-2xl">
                <p className="text-4xl mb-3">
                  {activeTab === 'Social' && '💬'}
                </p>
                <p className="text-sm text-black/60">
                  {activeTab} content will appear here.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-black/10 bg-white/92 p-6 shadow-sm">
            <h3 className="font-semibold text-black mb-3">Selected Community</h3>
            {selectedCommunity && (
              <div className="p-4 rounded-xl bg-black/5">
                <p className="font-medium text-black">{selectedCommunity.name}</p>
                <p className="text-sm text-black/60 mt-1">
                  {selectedCommunity.memberCount?.toLocaleString()} members
                </p>
                {selectedCommunity.distance && (
                  <p className="text-xs text-black/50 mt-1">
                    Distance:{' '}
                    {selectedCommunity.distance < 1000
                      ? `${Math.round(selectedCommunity.distance)}m`
                      : `${(selectedCommunity.distance / 1000).toFixed(1)}km`}
                  </p>
                )}
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/community/${selectedCommunity.id}`)}
                  >
                    Open Profile
                  </Button>
                </div>
              </div>
            )}
            {!selectedCommunity && (
              <div className="rounded-xl border border-dashed border-black/20 px-4 py-6 text-sm text-black/60">
                Select a community from Statistics to view details here.
              </div>
            )}
          </div>
            </section>
        </>
      </div>
    </main>
  );
}
