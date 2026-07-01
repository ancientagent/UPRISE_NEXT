import type { CommunityStatisticsResponse } from '@/lib/communities/client';
import type { PlayerTier } from '@/components/plot/RadiyoPlayerPanel';
import TopSongsPanel from '@/components/plot/TopSongsPanel';
import SeedFeedPanel from '@/components/plot/SeedFeedPanel';
import PlotEventsPanel from '@/components/plot/PlotEventsPanel';

type PlotPrimaryTab = 'Feed' | 'Events' | 'Archive';

interface PlotPrimaryTabBodyProps {
  activeTab: PlotPrimaryTab;
  communityId: string | null;
  communityLabel: string | null;
  selectedTier: PlayerTier;
  metrics: CommunityStatisticsResponse['metrics'] | null;
}

export default function PlotPrimaryTabBody({
  activeTab,
  communityId,
  communityLabel,
  selectedTier,
  metrics,
}: PlotPrimaryTabBodyProps) {
  if (activeTab === 'Archive') {
    return (
      <div className="space-y-4">
        <TopSongsPanel communityId={communityId} selectedTier={selectedTier} />
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <h3 className="mb-2 font-semibold text-black">Scene Activity Snapshot</h3>
          <p className="text-sm text-black/60">
            Descriptive context for the current archive scope. This is not a ranking or authority
            signal.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Members', metrics?.totalMembers ?? 0],
              ['Active Sects', metrics?.activeSects ?? 0],
              ['Events This Week', metrics?.eventsThisWeek ?? 0],
              ['Active Tracks', metrics?.activeTracks ?? 0],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-black/10 bg-black/[0.02] p-3">
                <p className="text-lg font-semibold text-black">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
                <p className="text-xs uppercase tracking-[0.12em] text-black/55">{label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-black/50">
            Archive is read-only descriptive history for the current Plot context.
            {communityLabel && <span> Selected: {communityLabel}.</span>}
          </p>
        </div>
      </div>
    );
  }

  if (activeTab === 'Feed') {
    return (
      <SeedFeedPanel
        communityId={communityId}
        communityLabel={communityLabel}
        selectedTier={selectedTier}
      />
    );
  }

  if (activeTab === 'Events') {
    return <PlotEventsPanel communityId={communityId} communityLabel={communityLabel} />;
  }

  return null;
}
