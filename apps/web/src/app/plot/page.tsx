'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Button } from '@uprise/ui';
import { useOnboardingStore } from '@/store/onboarding';
import type { CommunityWithDistance } from '@/lib/types/community';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api';
import TierToggle from '@/components/plot/TierToggle';
import TopSongsPanel from '@/components/plot/TopSongsPanel';
import SeedFeedPanel from '@/components/plot/SeedFeedPanel';
import PlotEventsPanel from '@/components/plot/PlotEventsPanel';

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
  const { homeScene, gpsCoords } = useOnboardingStore();
  const { token } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Feed');
  const [selectedTier, setSelectedTier] = useState<'city' | 'state' | 'national'>('city');
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityWithDistance | null>(null);

  const mapCenter = useMemo(() => {
    if (gpsCoords) {
      return { lat: gpsCoords.latitude, lng: gpsCoords.longitude };
    }
    return null;
  }, [gpsCoords]);

  useEffect(() => {
    async function resolveDefaultCommunity() {
      if (selectedCommunity || !mapCenter) return;

      try {
        const response = await api.get<CommunityWithDistance[]>(
          `/communities/nearby?lat=${mapCenter.lat}&lng=${mapCenter.lng}&radius=10000&limit=1`,
          { token: token || undefined },
        );
        const closest = response.data?.[0];
        if (closest) setSelectedCommunity(closest);
      } catch {
        // Leave unselected; Feed/Stats panels render guidance states.
      }
    }

    resolveDefaultCommunity();
  }, [selectedCommunity, mapCenter, token]);

  const handleCommunitySelect = (community: CommunityWithDistance) => {
    setSelectedCommunity(community);
  };

  // Callback to update nearby communities from StatisticsPanel
  const handleCommunitiesUpdate = (_communities: CommunityWithDistance[]) => {
    // Communities are managed within StatisticsPanel
    // This callback exists for potential future use
  };

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="rounded-3xl border border-black/10 bg-white/80 p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-black/50">The Plot</p>
          <h1 className="mt-3 text-3xl font-semibold text-black">
            {homeScene ? `${homeScene.city}, ${homeScene.state}` : 'Your Home Scene'}
          </h1>
          <p className="mt-2 text-sm text-black/60">
            {homeScene?.musicCommunity ?? 'Select a Home Scene to anchor this dashboard.'}
          </p>
          {homeScene?.tasteTag && (
            <p className="mt-1 text-sm text-black/50">Taste tag: {homeScene.tasteTag}</p>
          )}
        </header>

        {/* Tier Toggle */}
        <div className="mt-6">
          <TierToggle value={selectedTier} onChange={setSelectedTier} />
        </div>

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
                {activeTab === 'Promotions' && 'Local offers and promotions.'}
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
              <StatisticsPanel
                selectedTier={selectedTier}
                onCommunitySelect={handleCommunitySelect}
                onCommunitiesUpdate={handleCommunitiesUpdate}
              />
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
            ) : (
              <div className="text-center py-12 border border-dashed border-black/20 rounded-2xl">
                <p className="text-4xl mb-3">
                  {activeTab === 'Promotions' && '🏷️'}
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
            {/* Top Songs Panel */}
            <TopSongsPanel communityId={selectedCommunity?.id ?? null} selectedTier={selectedTier} />

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

            {/* Scene Activity Summary */}
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <h3 className="font-semibold text-black mb-4">Scene Activity</h3>
              <p className="text-sm text-black/60">
                This panel shows community activity summaries, registrar access, and scene map data.
              </p>
              <p className="text-xs text-black/50 mt-2">
                Current tier: <span className="capitalize">{selectedTier}</span>
                {selectedCommunity && (
                  <span> • Selected: {selectedCommunity.name}</span>
                )}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
