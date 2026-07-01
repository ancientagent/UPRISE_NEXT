import Link from 'next/link';
import type { CommunityStatisticsResponse } from '@/lib/communities/client';
import type { PlayerTier } from '@/components/plot/RadiyoPlayerPanel';
import type { RegistrarPromoterEntry } from '@/lib/registrar/client';
import type { RegistrarPlotSummary } from '@/lib/registrar/entryStatus';
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
  registrarSummary: RegistrarPlotSummary | null;
  registrarSummaryLoading: boolean;
  registrarSummaryError: string | null;
  latestPromoterEntry: RegistrarPromoterEntry | null;
  formatRegistrarStatus: (status: string) => string;
}

export default function PlotPrimaryTabBody({
  activeTab,
  communityId,
  communityLabel,
  selectedTier,
  metrics,
  registrarSummary,
  registrarSummaryLoading,
  registrarSummaryError,
  latestPromoterEntry,
  formatRegistrarStatus,
}: PlotPrimaryTabBodyProps) {
  if (activeTab === 'Archive') {
    const artistRegistrarStatus = registrarSummaryLoading
      ? 'Loading...'
      : registrarSummaryError
        ? 'Unavailable'
        : registrarSummary?.latestStatus
          ? formatRegistrarStatus(registrarSummary.latestStatus)
          : 'No artist/band filings yet';
    const promoterRegistrarStatus = latestPromoterEntry
      ? latestPromoterEntry.promoterCapability.granted
        ? 'Capability granted'
        : formatRegistrarStatus(latestPromoterEntry.status)
      : 'No promoter filings yet';

    return (
      <div className="space-y-4">
        <section
          data-slot="archive-community-information"
          className="rounded-2xl border border-black/10 bg-[#f7f1df] p-6"
        >
          <div
            data-slot="archive-registrar-entry"
            className="rounded-2xl border border-black bg-white p-4 shadow-[3px_3px_0_rgba(0,0,0,0.16)]"
          >
            <p className="plot-wire-label">Community Information</p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-black">Registrar</h3>
                <p className="mt-1 text-sm text-black/65">
                  Home Scene-bound civic registration for artist/band and promoter filings.
                  {communityLabel && <span> Current archive scope: {communityLabel}.</span>}
                </p>
              </div>
              <Link
                href="/registrar"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-black bg-[#b8d63b] px-4 text-xs font-semibold uppercase tracking-[0.12em] text-black shadow-[2px_2px_0_rgba(0,0,0,0.25)]"
              >
                Open Registrar
              </Link>
            </div>
          </div>

          <div data-slot="archive-registrar-records" className="mt-4">
            <p className="plot-wire-label">Records / Status History</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-black/10 bg-white p-4">
                <p className="text-sm font-semibold text-black">Artist/Band Filings</p>
                <p className="mt-2 text-xl font-semibold text-black">
                  {registrarSummaryLoading ? '...' : (registrarSummary?.totalEntries ?? 0)}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-black/55">
                  Latest: {artistRegistrarStatus}
                </p>
                <p className="mt-2 text-xs text-black/55">
                  Materialized: {registrarSummary?.materializedCount ?? 0} / Submitted:{' '}
                  {registrarSummary?.submittedCount ?? 0}
                </p>
              </div>

              <div className="rounded-xl border border-black/10 bg-white p-4">
                <p className="text-sm font-semibold text-black">Promoter Filings</p>
                <p className="mt-2 text-xl font-semibold text-black">{promoterRegistrarStatus}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-black/55">
                  {latestPromoterEntry?.payload.productionName ?? 'No production identity on file'}
                </p>
                <p className="mt-2 text-xs text-black/55">
                  Registrar records stay Home Scene-bound; event creation remains source-facing.
                </p>
              </div>
            </div>

            {registrarSummaryError ? (
              <p className="mt-3 text-xs text-red-700">
                Registrar status could not be loaded: {registrarSummaryError}
              </p>
            ) : null}
          </div>
        </section>

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
