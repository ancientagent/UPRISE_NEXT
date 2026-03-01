'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@uprise/ui';
import { useOnboardingStore } from '@/store/onboarding';
import type { CommunityWithDistance } from '@/lib/types/community';
import { useAuthStore } from '@/store/auth';
import { usePlotUiStore } from '@/store/plot-ui';
import { api } from '@/lib/api';
import TierToggle from '@/components/plot/TierToggle';
import TopSongsPanel from '@/components/plot/TopSongsPanel';
import SeedFeedPanel from '@/components/plot/SeedFeedPanel';
import PlotEventsPanel from '@/components/plot/PlotEventsPanel';
import PlotPromotionsPanel from '@/components/plot/PlotPromotionsPanel';
import SceneContextBadge from '@/components/plot/SceneContextBadge';
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
  const { homeScene, gpsCoords, tunedSceneId, tunedScene, isVisitor, setDiscoveryContext } = useOnboardingStore();
  const { token, user } = useAuthStore();
  const {
    panelState,
    playerMode,
    plotSnapshot,
    setPanelState,
    setPlotSnapshot,
    clearPlotSnapshot,
    switchToCollection,
    switchToRadiyo,
  } = usePlotUiStore();
  const [activeTab, setActiveTab] = useState('Feed');
  const [selectedTier, setSelectedTier] = useState<'city' | 'state' | 'national'>('city');
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityWithDistance | null>(null);
  const [selectedCollectionTrack, setSelectedCollectionTrack] = useState<CollectionTrack | null>(null);

  const mapCenter = useMemo(() => {
    if (gpsCoords) {
      return { lat: gpsCoords.latitude, lng: gpsCoords.longitude };
    }
    return null;
  }, [gpsCoords]);

  const collectionTitle = useMemo(() => {
    const base = user?.displayName || user?.username || 'My';
    return `${base}'s Collection`;
  }, [user?.displayName, user?.username]);

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

  const isProfileExpanded = panelState === 'expanded';

  const handleExpandProfile = () => {
    if (!plotSnapshot) {
      setPlotSnapshot({
        activeTab,
        selectedTier,
        selectedCommunityId: selectedCommunity?.id ?? null,
      });
    }
    setPanelState('expanded');
  };

  const handleCollapseProfile = async () => {
    if (plotSnapshot) {
      setActiveTab(plotSnapshot.activeTab);
      setSelectedTier(plotSnapshot.selectedTier);

      if (plotSnapshot.selectedCommunityId) {
        try {
          const response = await api.get<CommunityWithDistance | null>(
            `/communities/${plotSnapshot.selectedCommunityId}`,
            { token: token || undefined },
          );
          if (response.data) {
            setSelectedCommunity(response.data);
          }
        } catch {
          // Keep current selection if restore fetch fails.
        }
      }
    }
    clearPlotSnapshot();
    setPanelState('collapsed');
  };

  const handleSelectCollectionTrack = (track: CollectionTrack) => {
    setSelectedCollectionTrack(track);
    switchToCollection();
  };

  const handleHeaderModeSwitch = () => {
    if (playerMode === 'radiyo') {
      switchToCollection();
      return;
    }
    switchToRadiyo();
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
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-black/20 bg-black/5 text-sm font-semibold text-black">
                {user?.displayName?.[0] || user?.username?.[0] || 'U'}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-black">
                  {user?.displayName || user?.username || 'User'}
                </p>
                <p className="truncate text-xs text-black/60">@{user?.username || 'listener'}</p>
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

        {/* Header */}
        <header className="rounded-3xl border border-black/10 bg-white/80 p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-black/50">The Plot</p>
          <h1 className="mt-3 text-3xl font-semibold text-black">
            {homeScene ? `${homeScene.city}, ${homeScene.state}` : 'Your Home Scene'}
          </h1>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-black/60">
              {playerMode === 'collection'
                ? collectionTitle
                : homeScene?.musicCommunity ?? 'Select a Home Scene to anchor this dashboard.'}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/artist-dashboard-r1">Artist Dashboard</Link>
              </Button>
              <Button size="sm" variant="outline" onClick={handleHeaderModeSwitch}>
                {playerMode === 'radiyo' ? 'Collection Mode' : 'RaDIYo Mode'}
              </Button>
            </div>
          </div>
          {homeScene?.tasteTag && (
            <p className="mt-1 text-sm text-black/50">Taste tag: {homeScene.tasteTag}</p>
          )}
          <SceneContextBadge homeScene={homeScene} tunedScene={tunedScene} isVisitor={isVisitor} />
          <p className="mt-3 text-xs text-black/50">
            Player mode is explicit in Plot header and player strip.
          </p>
        </header>

        {/* Tier Toggle */}
        <div className="mt-6">
          <TierToggle value={selectedTier} onChange={setSelectedTier} />
        </div>

        {!isProfileExpanded ? (
          <div className="mt-6">
            <PlotPlayerStrip
              playerMode={playerMode}
              selectedCollectionTrack={selectedCollectionTrack}
              onSwitchToRadiyo={switchToRadiyo}
            />
          </div>
        ) : null}

        <ProfileExpansionPanel
          panelState={panelState}
          onExpand={handleExpandProfile}
          onCollapse={() => {
            void handleCollapseProfile();
          }}
          onPeek={() => setPanelState('peek')}
          onSelectCollectionTrack={handleSelectCollectionTrack}
        />

        {isProfileExpanded ? (
          <div className="mt-6">
            <PlotPlayerStrip
              playerMode={playerMode}
              selectedCollectionTrack={selectedCollectionTrack}
              onSwitchToRadiyo={switchToRadiyo}
            />
          </div>
        ) : null}

        {!isProfileExpanded ? (
          <>
            {/* Tab Navigation */}
            <section className="mt-6 flex flex-wrap gap-3">
              {tabs.map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? 'default' : 'outline'}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Button>
              ))}
            </section>

            {/* Main Content Grid */}
            <section className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Left Panel - Statistics & Map */}
          <div className="rounded-2xl border border-black/10 bg-white p-6">
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

          {/* Right Panel - Top Songs & Community Info */}
          <div className="space-y-6">
            {/* Selected Community Info */}
            {selectedCommunity && (
              <div className="rounded-2xl border border-black/10 bg-white p-6">
                <h3 className="font-semibold text-black mb-3">Selected Community</h3>
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
              </div>
            )}

          </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
