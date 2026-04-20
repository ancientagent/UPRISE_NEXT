'use client';

import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@uprise/ui';
import type { BroadcastRotation, BroadcastRotationMeta, Track } from '@uprise/types';
import { api } from '@/lib/api';
import { getActiveBroadcastRotation } from '@/lib/broadcast/client';
import { normalizeBroadcastRuntimeError } from '@/lib/broadcast/runtime';
import { useOnboardingStore } from '@/store/onboarding';
import type { CommunityWithDistance } from '@/lib/types/community';
import { useAuthStore } from '@/store/auth';
import TopSongsPanel from '@/components/plot/TopSongsPanel';
import SeedFeedPanel from '@/components/plot/SeedFeedPanel';
import PlotEventsPanel from '@/components/plot/PlotEventsPanel';
import PlotPromotionsPanel from '@/components/plot/PlotPromotionsPanel';
import RadiyoPlayerPanel, { type PlayerMode, type PlayerTier, type RotationPool } from '@/components/plot/RadiyoPlayerPanel';
import { SourceAccountSwitcher } from '@/components/source/SourceAccountSwitcher';
import { getEngagementWheelActions } from '@/components/plot/engagement-wheel';
import {
  buildRadiyoBroadcastLabel,
  getMvpPlayerTier,
  shouldUseTunedSceneAsDefaultPlotAnchor,
} from '@/components/plot/tier-guard';
import { getDiscoveryContext } from '@/lib/discovery/client';
import { mergeDiscoveryContextPatch } from '@/lib/discovery/context';
import {
  getCommunityById,
  getCommunityStatistics,
  resolveHomeCommunity,
  type CommunityStatisticsResponse,
} from '@/lib/communities/client';
import { listArtistBandRegistrations, listPromoterRegistrations, type RegistrarPromoterEntry } from '@/lib/registrar/client';
import { formatRegistrarEntryStatus, getRegistrarPlotSummary, type RegistrarPlotSummary } from '@/lib/registrar/entryStatus';

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

interface PlotCollectionShelfItem {
  signalId: string;
  type: string;
  createdAt: string;
  metadata: Record<string, unknown> | null;
}

interface PlotCollectionShelf {
  shelf: string;
  itemCount: number;
  items: PlotCollectionShelfItem[];
}

interface PlotProfileRead {
  canViewCollection: boolean;
  collectionShelves: PlotCollectionShelf[];
  managedArtistBands: Array<{
    id: string;
    name: string;
    slug: string;
    entityType: string;
    membershipRole: string | null;
  }>;
}

const readMetadataString = (
  metadata: Record<string, unknown> | null | undefined,
  keys: string[],
): string | null => {
  if (!metadata) return null;

  for (const key of keys) {
    const value = metadata[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
};

const formatShelfItemPrimaryLabel = (item: PlotCollectionShelfItem): string => {
  const metadata = item.metadata;

  const sceneCity = readMetadataString(metadata, ['city']);
  const sceneState = readMetadataString(metadata, ['state']);
  const sceneMusicCommunity = readMetadataString(metadata, ['musicCommunity', 'community']);

  if (sceneCity && sceneState && sceneMusicCommunity) {
    return `${sceneCity}, ${sceneState} • ${sceneMusicCommunity}`;
  }

  return (
    readMetadataString(metadata, ['title', 'name', 'label', 'summary', 'productionName']) ??
    item.type.replace(/_/g, ' ')
  );
};

const formatShelfItemSecondaryLabel = (item: PlotCollectionShelfItem): string => {
  const metadata = item.metadata;

  return (
    readMetadataString(metadata, ['callToAction', 'status', 'expiresAt', 'expiration']) ??
    new Date(item.createdAt).toLocaleDateString()
  );
};

const formatPlotCommunityLabel = (community: Pick<CommunityWithDistance, 'city' | 'state' | 'musicCommunity' | 'name'> | null): string | null => {
  if (!community) return null;

  if (community.city && community.state && community.musicCommunity) {
    return `${community.city}, ${community.state} • ${community.musicCommunity}`;
  }

  return community.name ?? null;
};

export default function PlotPage() {
  const router = useRouter();
  const {
    homeScene,
    pioneerFollowUp,
    playerTier,
    tunedSceneId,
    tunedScene,
    isVisitor,
    setDiscoveryContext,
    setPlayerTier,
  } = useOnboardingStore();
  const { token, user } = useAuthStore();
  const initialPlayerTier = useMemo<PlayerTier>(
    () => playerTier ?? getMvpPlayerTier(tunedScene?.tier),
    [playerTier, tunedScene?.tier],
  );
  const [activeTab, setActiveTab] = useState<PlotTab>('Feed');
  const [selectedTier, setSelectedTier] = useState<PlayerTier>(initialPlayerTier);
  const [activeBroadcastTier, setActiveBroadcastTier] = useState<PlayerTier | null>(initialPlayerTier);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityWithDistance | null>(null);
  const [profilePanelState, setProfilePanelState] = useState<'collapsed' | 'peek' | 'expanded'>('collapsed');
  const [playerMode, setPlayerMode] = useState<PlayerMode>('RADIYO');
  const [rotationPool, setRotationPool] = useState<RotationPool>('new_releases');
  const [broadcastRotation, setBroadcastRotation] = useState<BroadcastRotation | null>(null);
  const [broadcastMeta, setBroadcastMeta] = useState<BroadcastRotationMeta | null>(null);
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [broadcastError, setBroadcastError] = useState<string | null>(null);
  const [broadcastEmptyMessage, setBroadcastEmptyMessage] = useState<string | null>(null);
  const [activeProfileSection, setActiveProfileSection] = useState<ExpandedProfileSection>('Singles/Playlists');
  const [selectedCollectionItem, setSelectedCollectionItem] = useState<{
    id: string;
    label: string;
    kind: 'track' | 'playlist';
  } | null>(null);
  const [expandedProfileStats, setExpandedProfileStats] = useState<CommunityStatisticsResponse | null>(null);
  const [isEngagementWheelOpen, setIsEngagementWheelOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [registrarSummary, setRegistrarSummary] = useState<RegistrarPlotSummary | null>(null);
  const [registrarSummaryLoading, setRegistrarSummaryLoading] = useState(false);
  const [registrarSummaryError, setRegistrarSummaryError] = useState<string | null>(null);
  const [plotProfile, setPlotProfile] = useState<PlotProfileRead | null>(null);
  const [plotProfileLoading, setPlotProfileLoading] = useState(false);
  const [plotProfileError, setPlotProfileError] = useState<string | null>(null);
  const [promoterEntries, setPromoterEntries] = useState<RegistrarPromoterEntry[]>([]);
  const [promoterEntriesLoading, setPromoterEntriesLoading] = useState(false);
  const [promoterEntriesError, setPromoterEntriesError] = useState<string | null>(null);
  const hasHomeScene =
    Boolean(homeScene?.city) && Boolean(homeScene?.state) && Boolean(homeScene?.musicCommunity);
  const dragStartY = useRef<number | null>(null);
  const dragDelta = useRef(0);

  const discoveryContextFallback = useMemo(
    () => ({
      tunedSceneId,
      tunedScene,
      isVisitor,
    }),
    [
      isVisitor,
      tunedSceneId,
      tunedScene?.city,
      tunedScene?.id,
      tunedScene?.isActive,
      tunedScene?.musicCommunity,
      tunedScene?.name,
      tunedScene?.state,
      tunedScene?.tier,
    ],
  );
  const selectedCommunityLabel = useMemo(() => formatPlotCommunityLabel(selectedCommunity), [selectedCommunity]);

  useEffect(() => {
    async function fetchDiscoveryContext() {
      if (!token) return;
      try {
        const response = await getDiscoveryContext(token);
        setDiscoveryContext(mergeDiscoveryContextPatch(response, discoveryContextFallback));
      } catch {
        // Keep local state if context fetch fails.
      }
    }
    fetchDiscoveryContext();
  }, [discoveryContextFallback, setDiscoveryContext, token]);

  useEffect(() => {
    async function resolveDefaultCommunity() {
      if (selectedCommunity) return;
      if (!hasHomeScene) return;
      if (!token) return;

      try {
        if (tunedSceneId && shouldUseTunedSceneAsDefaultPlotAnchor(tunedScene)) {
          const tunedResponse = await getCommunityById(tunedSceneId, token);
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
            token,
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
    setSelectedTier(initialPlayerTier);
    setActiveBroadcastTier((current) => (current === null ? null : initialPlayerTier));
  }, [initialPlayerTier]);

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

  useEffect(() => {
    let cancelled = false;

    async function loadBroadcastRotation() {
      if (!token || playerMode !== 'RADIYO' || !activeBroadcastTier) {
        setBroadcastRotation(null);
        setBroadcastMeta(null);
        setBroadcastError(null);
        setBroadcastEmptyMessage(null);
        setBroadcastLoading(false);
        return;
      }

      setBroadcastLoading(true);
      setBroadcastError(null);
      setBroadcastEmptyMessage(null);

      try {
        const response = await getActiveBroadcastRotation(activeBroadcastTier, token);

        if (cancelled) return;

        setBroadcastRotation(response.data ?? { newReleases: [], mainRotation: [] });
        setBroadcastMeta(response.meta ?? null);
        setBroadcastEmptyMessage(
          activeBroadcastTier === 'state' && response.meta?.sceneId.startsWith('state-unavailable:')
            ? 'No state scene is active for this community yet.'
            : null,
        );
      } catch (error: unknown) {
        if (cancelled) return;

        const message = error instanceof Error ? error.message : 'Unable to load the active broadcast rotation.';
        const normalized = normalizeBroadcastRuntimeError(message, activeBroadcastTier);

        if (normalized.treatAsEmptyState) {
          setBroadcastRotation({ newReleases: [], mainRotation: [] });
          setBroadcastMeta(null);
          setBroadcastError(null);
          setBroadcastEmptyMessage(normalized.userMessage);
        } else {
          setBroadcastRotation(null);
          setBroadcastMeta(null);
          setBroadcastError(normalized.userMessage);
          setBroadcastEmptyMessage(null);
        }
      } finally {
        if (!cancelled) {
          setBroadcastLoading(false);
        }
      }
    }

    loadBroadcastRotation();

    return () => {
      cancelled = true;
    };
  }, [activeBroadcastTier, playerMode, token]);

  useEffect(() => {
    let cancelled = false;

    async function loadRegistrarSummary() {
      if (!token || !hasHomeScene) {
        setRegistrarSummary(null);
        setRegistrarSummaryError(null);
        setRegistrarSummaryLoading(false);
        return;
      }

      setRegistrarSummaryLoading(true);
      setRegistrarSummaryError(null);

      try {
        const response = await listArtistBandRegistrations(token);

        if (cancelled) return;

        setRegistrarSummary(getRegistrarPlotSummary(response.entries ?? []));
      } catch (error: unknown) {
        if (cancelled) return;

        const message = error instanceof Error ? error.message : 'Unable to load registrar status.';
        setRegistrarSummary(null);
        setRegistrarSummaryError(message);
      } finally {
        if (!cancelled) {
          setRegistrarSummaryLoading(false);
        }
      }
    }

    loadRegistrarSummary();

    return () => {
      cancelled = true;
    };
  }, [hasHomeScene, token]);

  useEffect(() => {
    let cancelled = false;

    async function loadPlotProfile() {
      if (!token || !user?.id) {
        setPlotProfile(null);
        setPlotProfileError(null);
        setPlotProfileLoading(false);
        return;
      }

      setPlotProfileLoading(true);
      setPlotProfileError(null);

      try {
        const response = await api.get<PlotProfileRead>(`/users/${user.id}/profile`, { token });

        if (cancelled) return;

        setPlotProfile(response.data ?? { canViewCollection: true, collectionShelves: [], managedArtistBands: [] });
      } catch (error: unknown) {
        if (cancelled) return;

        const message = error instanceof Error ? error.message : 'Unable to load collection shelves.';
        setPlotProfile(null);
        setPlotProfileError(message);
      } finally {
        if (!cancelled) {
          setPlotProfileLoading(false);
        }
      }
    }

    loadPlotProfile();

    return () => {
      cancelled = true;
    };
  }, [token, user?.id]);

  useEffect(() => {
    let cancelled = false;

    async function loadPromoterEntries() {
      if (!token) {
        setPromoterEntries([]);
        setPromoterEntriesError(null);
        setPromoterEntriesLoading(false);
        return;
      }

      setPromoterEntriesLoading(true);
      setPromoterEntriesError(null);

      try {
        const response = await listPromoterRegistrations(token);

        if (cancelled) return;

        setPromoterEntries(response.entries ?? []);
      } catch (error: unknown) {
        if (cancelled) return;

        const message = error instanceof Error ? error.message : 'Unable to load promoter status.';
        setPromoterEntries([]);
        setPromoterEntriesError(message);
      } finally {
        if (!cancelled) {
          setPromoterEntriesLoading(false);
        }
      }
    }

    loadPromoterEntries();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleCommunitySelect = (community: CommunityWithDistance) => {
    setSelectedCommunity(community);
  };

  const handleCollectionSelection = (item: { id: string; label: string; kind: 'track' | 'playlist' }) => {
    setSelectedCollectionItem(item);
    setPlayerMode('SPACE');
  };

  const handleCollectionEject = () => {
    setPlayerMode('RADIYO');
    setActiveBroadcastTier((current) => current ?? selectedTier);
  };

  const handleTierChange = (tier: PlayerTier) => {
    const nextTier = tier === 'national' ? 'state' : tier;

    setSelectedTier(nextTier);
    setPlayerTier(nextTier);
    setPlayerMode('RADIYO');
    setActiveBroadcastTier((current) => (current === nextTier ? null : nextTier));
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
  const currentRotationTracks =
    rotationPool === 'new_releases'
      ? broadcastRotation?.newReleases ?? []
      : broadcastRotation?.mainRotation ?? [];
  const currentBroadcastTrack: Track | null = currentRotationTracks[0] ?? null;
  const radiyoBroadcastLabel = buildRadiyoBroadcastLabel(selectedTier, selectedCommunity, homeScene);
  const currentBroadcastLabel =
    broadcastMeta?.sceneName ?? radiyoBroadcastLabel;
  const collectionBroadcastLabel = selectedCollectionItem?.label ?? `${user?.displayName || user?.username || 'Your'} Space`;
  const pioneerNotificationHomeScene = pioneerFollowUp?.homeScene ?? null;
  const hasPioneerFollowUp = Boolean(pioneerNotificationHomeScene && hasHomeScene);
  const collectionShelves = plotProfile?.collectionShelves ?? [];
  const canViewCollection = Boolean(plotProfile?.canViewCollection);
  const managedArtistBands = plotProfile?.managedArtistBands ?? [];
  const singlesShelf = collectionShelves.find((shelf) => shelf.shelf === 'singles') ?? null;
  const fliersShelf = collectionShelves.find((shelf) => shelf.shelf === 'fliers') ?? null;
  const uprisesShelf = collectionShelves.find((shelf) => shelf.shelf === 'uprises') ?? null;
  const posterShelf = collectionShelves.find((shelf) => shelf.shelf === 'posters') ?? null;
  const merchButtonShelf = collectionShelves.find((shelf) => shelf.shelf === 'merch_buttons') ?? null;
  const merchPatchShelf = collectionShelves.find((shelf) => shelf.shelf === 'merch_patches') ?? null;
  const merchShirtShelf = collectionShelves.find((shelf) => shelf.shelf === 'merch_shirts') ?? null;
  const singlesCollectionItems =
    singlesShelf?.items.map((item) => ({
      id: item.signalId,
      label: formatShelfItemPrimaryLabel(item),
      kind: 'track' as const,
    })) ?? [];
  const latestPromoterEntry = promoterEntries[0] ?? null;
  const canOpenPrintShop = Boolean(latestPromoterEntry?.promoterCapability.granted || managedArtistBands.length > 0);
  const bandStatusCard =
    managedArtistBands.length > 0 || (registrarSummary?.totalEntries ?? 0) > 0
      ? {
          label: 'Band Status',
          value:
            managedArtistBands.length > 0
              ? managedArtistBands.length === 1
                ? '1 linked entity'
                : `${managedArtistBands.length} linked entities`
              : registrarSummary?.latestStatus
                ? formatRegistrarEntryStatus(registrarSummary.latestStatus)
                : 'No recent status',
          detail:
            managedArtistBands.length > 0
              ? managedArtistBands
                  .slice(0, 2)
                  .map((artistBand) => artistBand.name)
                  .join(' • ')
              : 'Registrar-linked identity status',
        }
      : null;
  const promoterStatusCard =
    latestPromoterEntry || promoterEntriesLoading || promoterEntriesError
      ? {
          label: 'Promoter Status',
          value: promoterEntriesLoading
            ? 'Loading...'
            : promoterEntriesError
              ? 'Unavailable'
              : latestPromoterEntry?.promoterCapability.granted
                ? 'Capability granted'
                : latestPromoterEntry
                  ? formatRegistrarEntryStatus(latestPromoterEntry.status)
                  : 'No recent status',
          detail: latestPromoterEntry?.payload.productionName ?? 'Promoter registrar lifecycle',
        }
      : null;
  const profileStatusCards = [bandStatusCard, promoterStatusCard].filter(
    (card): card is { label: string; value: string; detail: string } => Boolean(card),
  );
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
  const wheelActions = getEngagementWheelActions(playerMode);
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

  const renderBottomNav = () => (
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
                onClick={() => setIsEngagementWheelOpen(false)}
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
            onClick={() => setIsEngagementWheelOpen((value) => !value)}
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
          communityLabel={selectedCommunityLabel}
          selectedTier={selectedTier}
        />
      );
    }

    if (activeTab === 'Events') {
      return (
        <PlotEventsPanel
          communityId={selectedCommunity?.id ?? null}
          communityLabel={selectedCommunityLabel}
        />
      );
    }

    if (activeTab === 'Promotions') {
      return (
        <PlotPromotionsPanel
          communityId={selectedCommunity?.id ?? null}
          communityLabel={selectedCommunityLabel}
        />
      );
    }

    return null;
  };

  if (!hasHomeScene) {
    return (
      <main className="plot-wire-page">
        <div className="plot-wire-frame max-w-5xl space-y-4">
          <section className="plot-wire-card p-6">
            <p className="plot-wire-label">The Plot</p>
            <h1 className="mt-2 text-2xl font-semibold text-black">Home Scene setup required</h1>
            <p className="mt-3 max-w-2xl text-sm text-black/70">
              Complete onboarding to anchor your Home Scene and unlock Plot context.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button className="rounded-full border border-black bg-[#b8d63b] text-black hover:bg-[#b8d63b]/90" onClick={() => router.push('/onboarding')}>Complete Onboarding</Button>
            </div>
          </section>

          <section className="plot-wire-panel plot-wire-grid-bg p-6">
            <h2 className="text-lg font-semibold text-black">Plot surfaces unlock after Home Scene resolution</h2>
            <p className="mt-2 max-w-2xl text-sm text-black/65">
              Feed, Events, Promotions, Statistics, and scene-scoped profile context remain unavailable until your
              Home Scene is set.
            </p>
          </section>
        </div>
        {renderBottomNav()}
      </main>
    );
  }

  return (
    <main className="plot-wire-page">
      <div className="plot-wire-frame">
        <section className="plot-wire-card px-4 py-3 transition-all">
          <div
            className="flex items-center justify-between gap-3 rounded-[1rem] border border-black bg-[#dfdfcf] px-3 py-2.5"
            onPointerDown={handleProfilePointerDown}
            onPointerMove={handleProfilePointerMove}
            onPointerUp={handleProfilePointerUp}
          >
            <div className="min-w-0 flex-1">
              <p className="plot-wire-label">User dashboard</p>
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
                    setIsNotificationPanelOpen((open) => !open);
                  }}
                >
                  🔔
                  {hasPioneerFollowUp ? (
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#b7d43f]" aria-hidden />
                  ) : null}
                </Button>
                {hasPioneerFollowUp && isNotificationPanelOpen && pioneerNotificationHomeScene ? (
                  <div
                    id="plot-pioneer-follow-up"
                    className="absolute right-0 top-10 z-20 w-72 rounded-[1.1rem] border border-black bg-[#f7f7ef] p-4 text-left shadow-[4px_4px_0_rgba(0,0,0,0.3)]"
                  >
                    <p className="plot-wire-label">Pioneer Follow-up</p>
                    <p className="mt-2 text-sm font-medium text-black">
                      {pioneerNotificationHomeScene.city}, {pioneerNotificationHomeScene.state} •{' '}
                      {pioneerNotificationHomeScene.musicCommunity}
                    </p>
                    <p className="mt-2 text-sm text-black/70">
                      Your Home Scene is still pioneering. You are temporarily routed through the nearest active city
                      scene for {pioneerNotificationHomeScene.musicCommunity} while your city builds.
                    </p>
                    <p className="mt-2 text-sm text-black/70">
                      Once enough local users join, you can establish or uprise your own city scene.
                    </p>
                  </div>
                ) : null}
              </div>
              <Button size="sm" variant="outline" className="h-8 rounded-full border-black bg-white text-xs" aria-label="More menu">
                ⋯
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              id="plot-profile-seam-toggle"
              className="mx-auto flex w-full items-center justify-center gap-2 rounded-[0.95rem] border border-black bg-[#efefe2] px-4 py-2.5 text-xs font-medium text-black/70"
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
          activeBroadcastTier={activeBroadcastTier}
          onTierChange={handleTierChange}
          broadcastLabel={playerMode === 'RADIYO' ? currentBroadcastLabel : collectionBroadcastLabel}
          collectionTitle={selectedCollectionItem?.label ?? null}
          trackQueue={playerMode === 'RADIYO' ? currentRotationTracks : []}
          currentTrack={playerMode === 'RADIYO' ? currentBroadcastTrack : null}
          currentTrackCount={currentRotationTracks.length}
          isBroadcastLoading={playerMode === 'RADIYO' ? broadcastLoading : false}
          broadcastError={playerMode === 'RADIYO' ? broadcastError : null}
          broadcastEmptyMessage={playerMode === 'RADIYO' ? broadcastEmptyMessage : null}
        />

        {isProfileExpanded ? (
          <section
            id="plot-profile-panel"
            className="mt-4 space-y-4 rounded-[1.4rem] border border-black bg-[#f7f7ef] p-4 shadow-[3px_3px_0_rgba(0,0,0,0.3)] transition-all duration-200"
            aria-labelledby="plot-profile-seam-toggle"
          >
            <header className="grid gap-4 rounded-[1.15rem] border border-black bg-[#efefe2] p-4 lg:grid-cols-[minmax(0,1.6fr)_240px]">
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/55">Profile Summary</p>
                  <h2 className="mt-1 text-lg font-semibold leading-tight text-black">
                    {user?.displayName || user?.username || 'User'}
                  </h2>
                  <p className="mt-1 text-sm text-black/60">@{user?.username || 'listener'}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="plot-wire-card-muted bg-white p-3">
                    <p className="plot-wire-label">Activity Score</p>
                    <p className="mt-1 text-lg font-semibold text-black">{activityScore}</p>
                  </div>
                  {profileStatusCards.map((card) => (
                    <div key={card.label} className="plot-wire-card-muted bg-white p-3">
                      <p className="plot-wire-label">{card.label}</p>
                      <p className="mt-1 text-sm font-medium text-black">{card.value}</p>
                      <p className="mt-1 text-xs text-black/55">{card.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="plot-wire-card-muted bg-white p-4">
                <p className="plot-wire-label">Calendar</p>
                <p className="mt-2 text-2xl font-semibold text-black">{calendarDate}</p>
                <p className="mt-1 text-sm text-black/60">
                  {eventsThisWeek} event{eventsThisWeek === 1 ? '' : 's'} this week
                </p>
                <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-black/55">Scene Context</p>
                <p className="mt-1 text-sm font-medium text-black">
                  {selectedCommunityLabel ??
                    (homeScene?.city && homeScene?.state && homeScene?.musicCommunity
                      ? `${homeScene.city}, ${homeScene.state} • ${homeScene.musicCommunity}`
                      : 'No scene selected')}
                </p>
              </div>
            </header>

            <div className="plot-wire-card-muted p-4">
              <p className="plot-wire-label">Player Context</p>
              <p className="mt-1 text-sm font-medium text-black">
                {playerMode === 'RADIYO' ? 'RADIYO' : 'SPACE'} • <span className="capitalize">{selectedTier}</span> • {rotationPool === 'new_releases' ? 'New Releases' : 'Main Rotation'}
              </p>
            </div>

            <div className="plot-wire-card-muted p-4">
              <div className="flex flex-wrap gap-2">
                {expandedProfileSections.map((section) => (
                  <Button
                    key={section}
                    size="sm"
                    variant={activeProfileSection === section ? 'default' : 'outline'}
                    className={activeProfileSection === section ? 'h-8 rounded-full border-black bg-[#b8d63b] text-xs font-semibold uppercase tracking-[0.1em] text-black hover:bg-[#b8d63b]/90' : 'h-8 rounded-full border-black bg-white text-xs font-semibold uppercase tracking-[0.1em] text-black hover:bg-black/5'}
                    onClick={() => setActiveProfileSection(section)}
                  >
                    {section}
                  </Button>
                ))}
              </div>

              <div className="mt-4 rounded-[1rem] border border-black bg-white p-4">
                <p className="text-sm font-medium text-black">{activeProfileSection}</p>
                {activeProfileSection === 'Singles/Playlists' ? (
                  <div className="mt-3 space-y-3">
                    {!token ? (
                      <p className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                        Sign in to view saved singles and playlist groupings.
                      </p>
                    ) : plotProfileLoading ? (
                      <p className="text-sm text-black/60">Loading collection shelves...</p>
                    ) : plotProfileError ? (
                      <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {plotProfileError}
                      </p>
                    ) : !canViewCollection ? (
                      <p className="text-sm text-black/60">Collection visibility is disabled for this profile.</p>
                    ) : singlesCollectionItems.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {singlesShelf?.items.map((item) => {
                          const collectionItem = {
                            id: item.signalId,
                            label: formatShelfItemPrimaryLabel(item),
                            kind: 'track' as const,
                          };

                          return (
                            <button
                              key={item.signalId}
                              type="button"
                              className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors ${
                                selectedCollectionItem?.id === collectionItem.id
                                  ? 'border-black bg-black text-white'
                                  : 'border-black/10 bg-black/[0.02] text-black hover:bg-black/[0.05]'
                              }`}
                              onClick={() => handleCollectionSelection(collectionItem)}
                            >
                              <span>
                                <span className="block text-sm font-medium">{collectionItem.label}</span>
                                <span className={`block text-[11px] uppercase tracking-[0.12em] ${
                                  selectedCollectionItem?.id === collectionItem.id ? 'text-white/75' : 'text-black/55'
                                }`}>
                                  Track • {formatShelfItemSecondaryLabel(item)}
                                </span>
                              </span>
                              <span className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${
                                selectedCollectionItem?.id === collectionItem.id ? 'text-white/75' : 'text-black/55'
                              }`}>
                                {selectedCollectionItem?.id === collectionItem.id && playerMode === 'SPACE'
                                  ? 'Live in space'
                                  : 'Select to enter your space'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-black/60">No saved singles yet.</p>
                    )}

                    <div className="plot-wire-card-muted p-3">
                      <p className="plot-wire-label">Playlist Groupings</p>
                      <p className="mt-1 text-sm text-black/70">
                        Saved playlist groupings appear here when they are available in your collection.
                      </p>
                    </div>
                  </div>
                ) : activeProfileSection === 'Events' ? (
                  <div className="mt-3 space-y-3">
                    {!token ? (
                      <p className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                        Sign in to view saved event artifacts and fliers.
                      </p>
                    ) : plotProfileLoading ? (
                      <p className="text-sm text-black/60">Loading collection shelves...</p>
                    ) : plotProfileError ? (
                      <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {plotProfileError}
                      </p>
                    ) : (fliersShelf?.items.length ?? 0) > 0 ? (
                      <ul className="space-y-2">
                        {fliersShelf?.items.slice(0, 6).map((item) => (
                          <li key={item.signalId} className="plot-wire-card-muted p-3">
                            <p className="text-sm font-medium text-black">{formatShelfItemPrimaryLabel(item)}</p>
                            <p className="mt-1 text-xs text-black/55">{formatShelfItemSecondaryLabel(item)}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-black/60">No saved event artifacts or fliers yet.</p>
                    )}
                  </div>
                ) : activeProfileSection === 'Photos' ? (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="plot-wire-card-muted p-3">
                      <p className="plot-wire-label">Scene Photography</p>
                      <p className="mt-1 text-sm text-black/70">Saved event and scene photography artifacts appear in this workspace.</p>
                    </div>
                    <div className="plot-wire-card-muted p-3">
                      <p className="plot-wire-label">Current Scene</p>
                      <p className="mt-1 text-sm font-medium text-black">{selectedCommunityLabel ?? 'No scene selected'}</p>
                    </div>
                  </div>
                ) : activeProfileSection === 'Merch' ? (
                  <div className="mt-3 space-y-3">
                    {!token ? (
                      <p className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                        Sign in to view saved merch items.
                      </p>
                    ) : plotProfileLoading ? (
                      <p className="text-sm text-black/60">Loading collection shelves...</p>
                    ) : plotProfileError ? (
                      <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {plotProfileError}
                      </p>
                    ) : (
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                        {[
                          { label: 'Posters', shelf: posterShelf },
                          { label: 'Shirts', shelf: merchShirtShelf },
                          { label: 'Patches', shelf: merchPatchShelf },
                          { label: 'Buttons', shelf: merchButtonShelf },
                          { label: 'Special Items', shelf: null },
                        ].map((item) => (
                          <div key={item.label} className="plot-wire-card-muted p-3">
                            <p className="text-sm font-medium text-black">{item.label}</p>
                            <p className="mt-1 text-xs text-black/55">
                              {item.shelf ? `${item.shelf.itemCount} saved item${item.shelf.itemCount === 1 ? '' : 's'}` : 'No saved items yet.'}
                            </p>
                            {item.shelf?.items[0] ? (
                              <p className="mt-2 text-xs text-black/60">{formatShelfItemPrimaryLabel(item.shelf.items[0])}</p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : activeProfileSection === 'Saved Uprises' ? (
                  <div className="mt-3 space-y-3">
                    {!token ? (
                      <p className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                        Sign in to view saved/followed Uprises.
                      </p>
                    ) : plotProfileLoading ? (
                      <p className="text-sm text-black/60">Loading collection shelves...</p>
                    ) : plotProfileError ? (
                      <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {plotProfileError}
                      </p>
                    ) : (uprisesShelf?.items.length ?? 0) > 0 ? (
                      <ul className="space-y-2">
                        {uprisesShelf?.items.slice(0, 6).map((item) => (
                          <li key={item.signalId} className="plot-wire-card-muted p-3">
                            <p className="text-sm font-medium text-black">{formatShelfItemPrimaryLabel(item)}</p>
                            <p className="mt-1 text-xs text-black/55">{formatShelfItemSecondaryLabel(item)}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-black/60">No saved Uprises yet.</p>
                    )}
                  </div>
                ) : (
                  <div className="mt-3 plot-wire-card-muted p-3">
                    <p className="plot-wire-label">Saved Promos/Coupons</p>
                    <p className="mt-1 text-sm text-black/70">
                      Saved promos and coupons appear here with status and expiration when collection support is available.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Button size="sm" variant="outline" className="h-8 rounded-full border-black bg-white text-xs font-semibold uppercase tracking-[0.12em]" onClick={toggleProfilePanel}>
                Return to Plot Tabs
              </Button>
            </div>
          </section>
        ) : (
          <>
            {/* Tab Navigation */}
            <section className="mt-4 flex flex-wrap items-end justify-start gap-2 overflow-x-auto px-2 pt-1">
              {tabs.map((tab) => (
                <Button
                  key={tab}
                  size="sm"
                  variant={activeTab === tab ? 'default' : 'outline'}
                  className={
                    activeTab === tab
                      ? 'plot-wire-tab plot-wire-tab-active h-auto'
                      : 'plot-wire-tab h-auto hover:bg-[#e7e7d8]'
                  }
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Button>
              ))}
            </section>

            {/* Main Content Grid */}
            <section className="grid gap-4 border border-black bg-[#d8d8c8] p-3 lg:grid-cols-[minmax(0,1.75fr)_300px]">
              {/* Left Panel - Statistics & Map */}
              <div className="plot-wire-panel">
                <div className="mb-4 rounded-[1rem] border border-black bg-[#efefe2] px-4 py-3">
                  <p className="plot-wire-label">Active Surface</p>
                  <h2 className="mt-1 text-lg font-semibold text-black">{plotTabHeading}</h2>
                  <p className="mt-1 text-sm text-black/65">
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
              <div className="space-y-4">
                {token && managedArtistBands.length > 0 ? (
                  <SourceAccountSwitcher
                    sources={managedArtistBands}
                    onSelectListener={() => router.push('/plot')}
                    onSelectSource={() => router.push('/source-dashboard')}
                  />
                ) : null}

                <div className="plot-wire-panel">
                  <h3 className="mb-2 font-semibold text-black">Registrar Access</h3>
                  <p className="text-sm text-black/65">
                    Artist/Band registration status stays visible here so Plot keeps registrar access inside the civic workflow.
                  </p>

                  {!token ? (
                    <p className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                      Sign in to view registrar status and continue registration work.
                    </p>
                  ) : registrarSummaryLoading ? (
                    <p className="mt-4 text-sm text-black/60">Loading registrar status...</p>
                  ) : registrarSummaryError ? (
                    <p className="mt-4 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {registrarSummaryError}
                    </p>
                  ) : registrarSummary && registrarSummary.totalEntries > 0 ? (
                    <div className="mt-4 plot-wire-card-muted p-4">
                      <p className="plot-wire-label">Latest Status</p>
                      <p className="mt-1 text-sm font-medium text-black">
                        {registrarSummary.latestStatus ? formatRegistrarEntryStatus(registrarSummary.latestStatus) : 'No recent status'}
                      </p>
                      <p className="mt-3 text-sm text-black/70">
                        Entries: {registrarSummary.totalEntries} • Submitted: {registrarSummary.submittedCount} • Materialized:{' '}
                        {registrarSummary.materializedCount}
                      </p>
                      <p className="mt-1 text-xs text-black/55">
                        Invites pending: {registrarSummary.pendingInviteCount} • queued: {registrarSummary.queuedInviteCount} •
                        sent: {registrarSummary.sentInviteCount} • failed: {registrarSummary.failedInviteCount}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-black/60">No Artist/Band registrar entries yet.</p>
                  )}

                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" className="rounded-full border-black bg-white text-xs font-semibold uppercase tracking-[0.12em]" onClick={() => router.push('/registrar')}>
                        Open Registrar
                      </Button>
                      {canOpenPrintShop ? (
                        <Button size="sm" variant="outline" className="rounded-full border-black bg-white text-xs font-semibold uppercase tracking-[0.12em]" onClick={() => router.push('/print-shop')}>
                          Open Print Shop
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>

                {selectedCommunity && (
                  <div className="plot-wire-panel">
                    <h3 className="mb-3 font-semibold text-black">Selected Community</h3>
                    <div className="plot-wire-card-muted p-4">
                      <p className="font-medium text-black">{selectedCommunityLabel ?? selectedCommunity.name}</p>
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
                          className="rounded-full border-black bg-white text-xs font-semibold uppercase tracking-[0.12em]"
                          onClick={() => router.push(`/community/${selectedCommunity.id}`)}
                        >
                          Open Community
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
      <div id="plot-engagement-wheel">{renderBottomNav()}</div>
    </main>
  );
}
