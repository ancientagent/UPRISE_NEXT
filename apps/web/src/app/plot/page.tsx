'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Button } from '@uprise/ui';
import { useOnboardingStore } from '@/store/onboarding';
import type { CommunityWithDistance } from '@/lib/types/community';
import { useAuthStore } from '@/store/auth';
import TopSongsPanel from '@/components/plot/TopSongsPanel';
import SeedFeedPanel from '@/components/plot/SeedFeedPanel';
import PlotEventsPanel from '@/components/plot/PlotEventsPanel';
import PlotPromotionsPanel from '@/components/plot/PlotPromotionsPanel';
import RadiyoPlayerPanel, { type PlayerMode, type RotationPool } from '@/components/plot/RadiyoPlayerPanel';
import { buildRadiyoBroadcastLabel } from '@/components/plot/tier-guard';
import { getDiscoveryContext } from '@/lib/discovery/client';
import { toDiscoveryContextPatch } from '@/lib/discovery/context';
import {
  getCommunityById,
  getCommunityStatistics,
  resolveHomeCommunity,
  type CommunityStatisticsResponse,
} from '@/lib/communities/client';

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

const tabs = ['Feed', 'Events', 'Promotions', 'Statistics'] as const;
type PlotTab = (typeof tabs)[number];
const expandedProfileSections = [
  'Singles/Playlists',
  'Events',
  'Photos',
  'Merch',
  'Saved Uprises',
  'Saved Promos/Coupons',
] as const;
type ExpandedProfileSection = (typeof expandedProfileSections)[number];
const singlesAndPlaylistsItems: Array<{ id: string; label: string; kind: 'track' | 'playlist' }> = [
  { id: 'track-south-side-signal', label: 'South Side Signal', kind: 'track' },
  { id: 'track-lakefront-lights', label: 'Lakefront Lights', kind: 'track' },
  { id: 'playlist-city-after-hours', label: 'City After Hours', kind: 'playlist' },
  { id: 'playlist-state-line-set', label: 'State Line Set', kind: 'playlist' },
];

export default function PlotPage() {
  const router = useRouter();
  const { homeScene, tunedSceneId, setDiscoveryContext } = useOnboardingStore();
  const { token, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<PlotTab>('Feed');
  const [selectedTier, setSelectedTier] = useState<'city' | 'state' | 'national'>('city');
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityWithDistance | null>(null);
  const [profilePanelState, setProfilePanelState] = useState<'collapsed' | 'peek' | 'expanded'>('collapsed');
  const [playerMode, setPlayerMode] = useState<PlayerMode>('RADIYO');
  const [rotationPool, setRotationPool] = useState<RotationPool>('new_releases');
  const [activeProfileSection, setActiveProfileSection] = useState<ExpandedProfileSection>('Singles/Playlists');
  const [selectedCollectionItem, setSelectedCollectionItem] = useState<{
    id: string;
    label: string;
    kind: 'track' | 'playlist';
  } | null>(null);
  const [expandedProfileStats, setExpandedProfileStats] = useState<CommunityStatisticsResponse | null>(null);
  const hasHomeScene =
    Boolean(homeScene?.city) && Boolean(homeScene?.state) && Boolean(homeScene?.musicCommunity);
  const dragStartY = useRef<number | null>(null);
  const dragDelta = useRef(0);

  useEffect(() => {
    async function fetchDiscoveryContext() {
      if (!token) return;
      try {
        const response = await getDiscoveryContext(token);
        setDiscoveryContext(toDiscoveryContextPatch(response));
      } catch {
        // Keep local state if context fetch fails.
      }
    }
    fetchDiscoveryContext();
  }, [token, setDiscoveryContext]);

  useEffect(() => {
    async function resolveDefaultCommunity() {
      if (selectedCommunity) return;
      if (!hasHomeScene) return;

      try {
        if (tunedSceneId) {
          const tunedResponse = await getCommunityById(tunedSceneId, token || undefined);
          if (tunedResponse) {
            setSelectedCommunity(tunedResponse);
            return;
          }
        }

        // Canon anchor: exact Home Scene tuple first.
        if (homeScene?.city && homeScene?.state && homeScene?.musicCommunity) {
          const homeResponse = await resolveHomeCommunity(
            {
              city: homeScene.city,
              state: homeScene.state,
              musicCommunity: homeScene.musicCommunity,
            },
            token || undefined,
          );

          if (homeResponse) {
            setSelectedCommunity(homeResponse);
            return;
          }
        }
      } catch {
        // Leave unselected; Feed/Stats panels render guidance states.
      }
    }

    resolveDefaultCommunity();
  }, [selectedCommunity, token, homeScene, tunedSceneId, hasHomeScene]);

  useEffect(() => {
    async function loadExpandedProfileStats() {
      if (!selectedCommunity?.id) {
        setExpandedProfileStats(null);
        return;
      }

      try {
        const stats = await getCommunityStatistics(selectedCommunity.id, selectedTier, token || undefined);
        setExpandedProfileStats(stats);
      } catch {
        setExpandedProfileStats(null);
      }
    }

    loadExpandedProfileStats();
  }, [selectedCommunity?.id, selectedTier, token]);

  const handleCommunitySelect = (community: CommunityWithDistance) => {
    setSelectedCommunity(community);
  };

  const handleCollectionSelection = (item: { id: string; label: string; kind: 'track' | 'playlist' }) => {
    setSelectedCollectionItem(item);
    setPlayerMode('Collection');
  };

  const handleCollectionEject = () => {
    setPlayerMode('RADIYO');
  };

  const handleProfilePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragStartY.current = event.clientY;
    dragDelta.current = 0;
    (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);
  };

  const handleProfilePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartY.current === null) return;
    dragDelta.current = event.clientY - dragStartY.current;

    if (profilePanelState === 'collapsed' && dragDelta.current > 20) {
      setProfilePanelState('peek');
    }
  };

  const handleProfilePointerUp = () => {
    const delta = dragDelta.current;
    dragStartY.current = null;
    dragDelta.current = 0;

    if (profilePanelState !== 'expanded' && delta >= 50) {
      setProfilePanelState('expanded');
      return;
    }

    if (profilePanelState === 'expanded' && delta <= -50) {
      setProfilePanelState('collapsed');
      return;
    }

    if (profilePanelState === 'peek') {
      setProfilePanelState('collapsed');
    }
  };

  const toggleProfilePanel = () => {
    if (profilePanelState === 'expanded') {
      setProfilePanelState('collapsed');
      return;
    }
    setProfilePanelState('expanded');
  };

  // Callback to update nearby communities from StatisticsPanel
  const handleCommunitiesUpdate = (_communities: CommunityWithDistance[]) => {
    // Communities are managed within StatisticsPanel
    // This callback exists for potential future use
  };
  const isProfileExpanded = profilePanelState === 'expanded';
  const radiyoBroadcastLabel = buildRadiyoBroadcastLabel(selectedTier, selectedCommunity, homeScene);
  const collectionBroadcastLabel = selectedCollectionItem?.label ?? `${user?.displayName || user?.username || 'Your'} Collection`;
  const seamLabel =
    profilePanelState === 'expanded'
      ? 'Pull up or tap to collapse profile'
      : profilePanelState === 'peek'
        ? 'Release to collapse or keep pulling to expand'
        : 'Pull down profile';
  const calendarDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date());
  const activityScore = expandedProfileStats?.metrics.activityScore ?? 0;
  const eventsThisWeek = expandedProfileStats?.metrics.eventsThisWeek ?? 0;
  const plotTabHeading = activeTab === 'Statistics' ? 'Scene Statistics' : activeTab;
  const plotTabDescription =
    activeTab === 'Feed'
      ? 'Community actions appear here.'
      : activeTab === 'Events'
        ? 'Scene events listing from your selected community anchor.'
        : activeTab === 'Promotions'
          ? 'Scene-scoped promotions and offers from your selected anchor.'
          : activeTab === 'Statistics'
            ? null
            : 'Message boards and listening rooms.';

  const renderPrimaryPlotTabBody = () => {
    if (activeTab === 'Statistics') {
      return (
        <div className="space-y-4">
          <StatisticsPanel
            selectedTier={selectedTier}
            selectedCommunity={selectedCommunity}
            onCommunitySelect={handleCommunitySelect}
            onCommunitiesUpdate={handleCommunitiesUpdate}
          />
          <TopSongsPanel communityId={selectedCommunity?.id ?? null} selectedTier={selectedTier} />
          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <h3 className="mb-2 font-semibold text-black">Scene Activity Snapshot</h3>
            <p className="text-sm text-black/60">
              Descriptive context for the current statistics scope. This is not a ranking or authority signal.
            </p>
            <p className="mt-2 text-xs text-black/50">
              Current tier: <span className="capitalize">{selectedTier}</span>
              {selectedCommunity && <span> • Selected: {selectedCommunity.name}</span>}
            </p>
          </div>
        </div>
      );
    }

    if (activeTab === 'Feed') {
      return (
        <SeedFeedPanel
          communityId={selectedCommunity?.id ?? null}
          communityName={selectedCommunity?.name ?? null}
          selectedTier={selectedTier}
        />
      );
    }

    if (activeTab === 'Events') {
      return (
        <PlotEventsPanel
          communityId={selectedCommunity?.id ?? null}
          communityName={selectedCommunity?.name ?? null}
        />
      );
    }

    if (activeTab === 'Promotions') {
      return (
        <PlotPromotionsPanel
          communityId={selectedCommunity?.id ?? null}
          communityName={selectedCommunity?.name ?? null}
        />
      );
    }

    return null;
  };

  if (!hasHomeScene) {
    return (
      <main className="min-h-screen bg-[#f7f5ef] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <section className="rounded-2xl border border-black/10 bg-white/90 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.22em] text-black/50">The Plot</p>
            <h1 className="mt-2 text-2xl font-semibold text-black">Home Scene setup required</h1>
            <p className="mt-3 text-sm text-black/65">
              Complete onboarding to anchor your Home Scene, unlock Plot context, and satisfy Registrar prerequisites.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={() => router.push('/onboarding')}>Complete Onboarding</Button>
              <Button variant="outline" onClick={() => router.push('/discover')}>
                Browse Discover
              </Button>
            </div>
          </section>

          <section className="rounded-2xl border border-black/10 bg-white/85 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-black">Plot surfaces unlock after Home Scene resolution</h2>
            <p className="mt-2 text-sm text-black/60">
              Feed, Events, Promotions, Statistics, and scene-scoped profile context remain unavailable until your
              Home Scene is set.
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-2xl border border-black/10 bg-white/85 px-5 py-4 shadow-sm transition-all">
          <div
            className="flex items-center justify-between gap-3"
            onPointerDown={handleProfilePointerDown}
            onPointerMove={handleProfilePointerMove}
            onPointerUp={handleProfilePointerUp}
          >
            <div className="flex min-w-0 items-center gap-3.5">
              <div className={`flex items-center justify-center rounded-full border border-black/20 bg-black/5 font-semibold text-black transition-all duration-200 ${profilePanelState === 'expanded' ? 'h-14 w-14 text-lg' : 'h-11 w-11 text-sm'}`}>
                {user?.displayName?.[0] || user?.username?.[0] || 'U'}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold leading-tight text-black">
                  {user?.displayName || user?.username || 'User'}
                </p>
                <p className="truncate text-xs text-black/60">@{user?.username || 'listener'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                profilePanelState === 'expanded'
                  ? 'bg-[#b7d43f]/30 text-black'
                  : profilePanelState === 'peek'
                    ? 'bg-[#5da9ff]/20 text-black'
                    : 'bg-black/10 text-black/70'
              }`}>
                {profilePanelState}
              </span>
              <Button size="sm" variant="outline" className="h-8 text-xs" aria-label="Notifications">
                🔔
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs" aria-label="More menu">
                ⋯
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              id="plot-profile-seam-toggle"
              className="mx-auto flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-black/[0.03] px-4 py-2.5 text-xs font-medium text-black/70"
              onClick={toggleProfilePanel}
              aria-controls="plot-profile-panel"
              aria-expanded={isProfileExpanded}
              aria-label={profilePanelState === 'expanded' ? 'Collapse profile panel' : 'Expand profile panel'}
            >
              <span className="block h-1.5 w-8 rounded-full bg-black/30" aria-hidden />
              <span>{seamLabel}</span>
            </button>
          </div>
        </section>

        <RadiyoPlayerPanel
          mode={playerMode}
          onCollectionEject={handleCollectionEject}
          rotationPool={rotationPool}
          onRotationPoolChange={setRotationPool}
          selectedTier={selectedTier}
          onTierChange={setSelectedTier}
          broadcastLabel={playerMode === 'RADIYO' ? radiyoBroadcastLabel : collectionBroadcastLabel}
          collectionTitle={selectedCollectionItem?.label ?? null}
        />

        {isProfileExpanded ? (
          <section
            id="plot-profile-panel"
            className="mt-6 space-y-5 rounded-2xl border border-black/10 bg-white/92 p-6 shadow-sm transition-all duration-200"
            aria-labelledby="plot-profile-seam-toggle"
          >
            <header className="grid gap-4 rounded-2xl border border-black/10 bg-black/[0.02] p-4 lg:grid-cols-[minmax(0,1.6fr)_240px]">
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/55">Profile Summary</p>
                  <h2 className="mt-1 text-lg font-semibold leading-tight text-black">
                    {user?.displayName || user?.username || 'User'}
                  </h2>
                  <p className="mt-1 text-sm text-black/60">@{user?.username || 'listener'}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-black/10 bg-white p-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-black/55">Activity Score</p>
                    <p className="mt-1 text-lg font-semibold text-black">{activityScore}</p>
                  </div>
                  <div className="rounded-xl border border-black/10 bg-white p-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-black/55">Tier Snapshot</p>
                    <p className="mt-1 text-sm font-medium capitalize text-black">{selectedTier}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/55">Calendar</p>
                <p className="mt-2 text-2xl font-semibold text-black">{calendarDate}</p>
                <p className="mt-1 text-sm text-black/60">
                  {eventsThisWeek} event{eventsThisWeek === 1 ? '' : 's'} this week
                </p>
                <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-black/55">Scene Context</p>
                <p className="mt-1 text-sm font-medium text-black">
                  {selectedCommunity?.name ?? homeScene?.musicCommunity ?? 'No scene selected'}
                </p>
              </div>
            </header>

            <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-black/55">Player Context</p>
              <p className="mt-1 text-sm font-medium text-black">
                {playerMode} • <span className="capitalize">{selectedTier}</span> • {rotationPool === 'new_releases' ? 'New Releases' : 'Main Rotation'}
              </p>
            </div>

            <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4">
              <div className="flex flex-wrap gap-2">
                {expandedProfileSections.map((section) => (
                  <Button
                    key={section}
                    size="sm"
                    variant={activeProfileSection === section ? 'default' : 'outline'}
                    className={activeProfileSection === section ? 'h-8 rounded-full bg-black text-xs text-white' : 'h-8 rounded-full text-xs'}
                    onClick={() => setActiveProfileSection(section)}
                  >
                    {section}
                  </Button>
                ))}
              </div>

              <div className="mt-4 rounded-lg border border-black/10 bg-white p-4">
                <p className="text-sm font-medium text-black">{activeProfileSection}</p>
                {activeProfileSection === 'Singles/Playlists' ? (
                  <div className="mt-3 flex flex-col gap-2">
                    {singlesAndPlaylistsItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors ${
                          selectedCollectionItem?.id === item.id
                            ? 'border-black bg-black text-white'
                            : 'border-black/10 bg-black/[0.02] text-black hover:bg-black/[0.05]'
                        }`}
                        onClick={() => handleCollectionSelection(item)}
                      >
                        <span>
                          <span className="block text-sm font-medium">{item.label}</span>
                          <span className={`block text-[11px] uppercase tracking-[0.12em] ${
                            selectedCollectionItem?.id === item.id ? 'text-white/75' : 'text-black/55'
                          }`}>
                            {item.kind === 'track' ? 'Track' : 'Playlist'}
                          </span>
                        </span>
                        <span className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${
                          selectedCollectionItem?.id === item.id ? 'text-white/75' : 'text-black/55'
                        }`}>
                          {selectedCollectionItem?.id === item.id && playerMode === 'Collection'
                            ? 'Live in player'
                            : 'Select to enter Collection mode'}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : activeProfileSection === 'Events' ? (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-black/10 bg-black/[0.02] p-3">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-black/55">Saved Event Artifacts</p>
                      <p className="mt-1 text-sm text-black/70">
                        Event fliers and saved scene artifacts live here. Calendar stays in the header.
                      </p>
                    </div>
                    <div className="rounded-xl border border-black/10 bg-black/[0.02] p-3">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-black/55">Events This Week</p>
                      <p className="mt-1 text-lg font-semibold text-black">{eventsThisWeek}</p>
                    </div>
                  </div>
                ) : activeProfileSection === 'Photos' ? (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-black/10 bg-black/[0.02] p-3">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-black/55">Scene Photography</p>
                      <p className="mt-1 text-sm text-black/70">Saved event and scene photography artifacts appear in this workspace.</p>
                    </div>
                    <div className="rounded-xl border border-black/10 bg-black/[0.02] p-3">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-black/55">Current Scene</p>
                      <p className="mt-1 text-sm font-medium text-black">{selectedCommunity?.name ?? 'No scene selected'}</p>
                    </div>
                  </div>
                ) : activeProfileSection === 'Merch' ? (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                    {['Posters', 'Shirts', 'Patches', 'Buttons', 'Special Items'].map((item) => (
                      <div key={item} className="rounded-xl border border-black/10 bg-black/[0.02] p-3">
                        <p className="text-sm font-medium text-black">{item}</p>
                      </div>
                    ))}
                  </div>
                ) : activeProfileSection === 'Saved Uprises' ? (
                  <div className="mt-3 rounded-xl border border-black/10 bg-black/[0.02] p-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-black/55">Saved Scene Entries</p>
                    <p className="mt-1 text-sm text-black/70">
                      {selectedCommunity?.name ?? 'Current scene'} remains available as a saved scene anchor in this workspace.
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 rounded-xl border border-black/10 bg-black/[0.02] p-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-black/55">Saved Promos/Coupons</p>
                    <p className="mt-1 text-sm text-black/70">
                      Saved promos and coupons appear here with status and expiration when available for the active scene.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={toggleProfilePanel}>
                Return to Plot Tabs
              </Button>
            </div>
          </section>
        ) : (
          <>
            {/* Tab Navigation */}
            <section className="mt-6 flex flex-wrap items-center justify-center gap-2.5 rounded-2xl border border-black/10 bg-white/85 px-5 py-4 shadow-sm">
              {tabs.map((tab) => (
                <Button
                  key={tab}
                  size="sm"
                  variant={activeTab === tab ? 'default' : 'outline'}
                  className={
                    activeTab === tab
                      ? 'h-8 rounded-full bg-black px-4 text-xs text-white'
                      : 'h-8 rounded-full border-black/20 bg-white px-4 text-xs text-black hover:bg-black/5'
                  }
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Button>
              ))}
            </section>

            {/* Main Content Grid */}
            <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
              {/* Left Panel - Statistics & Map */}
              <div className="rounded-2xl border border-black/10 bg-white p-6 lg:p-7">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-black">{plotTabHeading}</h2>
                  <p className="text-sm text-black/60">
                    {plotTabDescription}
                    {activeTab === 'Statistics' && (
                      <>
                        Scene metrics and activity from{' '}
                        <span className="capitalize">{selectedTier}</span> tier
                        {!homeScene && '. Complete onboarding to see your local scene.'}
                      </>
                    )}
                  </p>
                </div>

                {renderPrimaryPlotTabBody()}
              </div>

              {/* Right Panel - Selected Community Info */}
              <div className="space-y-6">
                {selectedCommunity && (
                  <div className="rounded-2xl border border-black/10 bg-white p-6">
                    <h3 className="mb-3 font-semibold text-black">Selected Community</h3>
                    <div className="rounded-xl bg-black/5 p-4">
                      <p className="font-medium text-black">{selectedCommunity.name}</p>
                      <p className="mt-1 text-sm text-black/60">
                        {selectedCommunity.memberCount?.toLocaleString()} members
                      </p>
                      {selectedCommunity.distance && (
                        <p className="mt-1 text-xs text-black/50">
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
        )}
      </div>
    </main>
  );
}
