'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent, type PointerEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@uprise/ui';
import type { BroadcastRotation, BroadcastRotationMeta, Track } from '@uprise/types';
import { api } from '@/lib/api';
import { MUSIC_COMMUNITIES } from '@/data/music-communities';
import { getActiveBroadcastRotation } from '@/lib/broadcast/client';
import { normalizeBroadcastRuntimeError } from '@/lib/broadcast/runtime';
import { useOnboardingStore } from '@/store/onboarding';
import type { CommunityWithDistance } from '@/lib/types/community';
import { useAuthStore } from '@/store/auth';
import HomeSceneSelector from '@/components/plot/HomeSceneSelector';
import PlotListenerProfile, {
  type ExpandedProfileSection,
  type PlotProfileRead,
} from '@/components/plot/PlotListenerProfile';
import PlotPrimaryTabBody from '@/components/plot/PlotPrimaryTabBody';
import RadiyoPlayerPanel, {
  type PlayerMode,
  type PlayerTier,
  type RotationPool,
} from '@/components/plot/RadiyoPlayerPanel';
import { SourceAccountSwitcher } from '@/components/source/SourceAccountSwitcher';
import { getEngagementWheelActions } from '@/components/plot/engagement-wheel';
import {
  buildRadiyoBroadcastLabel,
  getMvpPlayerTier,
  shouldUseTunedSceneAsDefaultPlotAnchor,
} from '@/components/plot/tier-guard';
import { getDiscoveryContext, tuneDiscoverScene } from '@/lib/discovery/client';
import { mergeDiscoveryContextPatch } from '@/lib/discovery/context';
import {
  getCommunityById,
  getCommunityStatistics,
  resolveHomeCommunity,
  type CommunityStatisticsResponse,
} from '@/lib/communities/client';
import {
  listArtistBandRegistrations,
  listPromoterRegistrations,
  type RegistrarPromoterEntry,
} from '@/lib/registrar/client';
import {
  formatRegistrarEntryStatus,
  getRegistrarPlotSummary,
  type RegistrarPlotSummary,
} from '@/lib/registrar/entryStatus';
import {
  addMusicCommunityPreference,
  getHomeSceneSelector,
  getMusicCommunityPreferences,
  setDefaultMusicCommunityPreference,
  type HomeSceneSelector as HomeSceneSelectorReadModel,
  type HomeSceneSelectorItem,
  type MusicCommunityPreference,
} from '@/lib/users/client';

const tabs = ['Feed', 'Events', 'Archive'] as const;
type PlotTab = (typeof tabs)[number];

const formatPlotCommunityLabel = (
  community: Pick<CommunityWithDistance, 'city' | 'state' | 'musicCommunity' | 'name'> | null
): string | null => {
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
    [playerTier, tunedScene?.tier]
  );
  const [activeTab, setActiveTab] = useState<PlotTab>('Feed');
  const [selectedTier, setSelectedTier] = useState<PlayerTier>(initialPlayerTier);
  const [activeBroadcastTier, setActiveBroadcastTier] = useState<PlayerTier | null>(
    initialPlayerTier
  );
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityWithDistance | null>(null);
  const [homeSceneSelector, setHomeSceneSelector] = useState<HomeSceneSelectorReadModel>({
    currentLocation: null,
    items: [],
  });
  const [homeSceneSelectorLoading, setHomeSceneSelectorLoading] = useState(false);
  const [homeSceneSelectorError, setHomeSceneSelectorError] = useState<string | null>(null);
  const [homeSceneSelectorSelectingSceneId, setHomeSceneSelectorSelectingSceneId] =
    useState<string | null>(null);
  const [profilePanelState, setProfilePanelState] = useState<'collapsed' | 'peek' | 'expanded'>(
    'collapsed'
  );
  const [playerMode, setPlayerMode] = useState<PlayerMode>('RADIYO');
  const [rotationPool, setRotationPool] = useState<RotationPool>('new_releases');
  const [broadcastRotation, setBroadcastRotation] = useState<BroadcastRotation | null>(null);
  const [broadcastMeta, setBroadcastMeta] = useState<BroadcastRotationMeta | null>(null);
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [broadcastError, setBroadcastError] = useState<string | null>(null);
  const [broadcastEmptyMessage, setBroadcastEmptyMessage] = useState<string | null>(null);
  const [activeProfileSection, setActiveProfileSection] =
    useState<ExpandedProfileSection>('Singles/Playlists');
  const [selectedCollectionItem, setSelectedCollectionItem] = useState<{
    id: string;
    label: string;
    kind: 'track' | 'playlist';
  } | null>(null);
  const [expandedProfileStats, setExpandedProfileStats] =
    useState<CommunityStatisticsResponse | null>(null);
  const [isEngagementWheelOpen, setIsEngagementWheelOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [registrarSummary, setRegistrarSummary] = useState<RegistrarPlotSummary | null>(null);
  const [registrarSummaryLoading, setRegistrarSummaryLoading] = useState(false);
  const [registrarSummaryError, setRegistrarSummaryError] = useState<string | null>(null);
  const [plotProfile, setPlotProfile] = useState<PlotProfileRead | null>(null);
  const [plotProfileLoading, setPlotProfileLoading] = useState(false);
  const [plotProfileError, setPlotProfileError] = useState<string | null>(null);
  const [musicCommunityPreferences, setMusicCommunityPreferences] = useState<
    MusicCommunityPreference[]
  >([]);
  const [musicCommunityPreferencesLoading, setMusicCommunityPreferencesLoading] = useState(false);
  const [musicCommunityPreferencesError, setMusicCommunityPreferencesError] =
    useState<string | null>(null);
  const [musicCommunityPreferenceDraft, setMusicCommunityPreferenceDraft] = useState('');
  const [musicCommunityPreferenceSaving, setMusicCommunityPreferenceSaving] = useState(false);
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
    ]
  );
  const selectedCommunityLabel = useMemo(
    () => formatPlotCommunityLabel(selectedCommunity),
    [selectedCommunity]
  );
  const resolvedSelectorMusicCommunities = useMemo(
    () => new Set(homeSceneSelector.items.map((item) => item.musicCommunity.trim().toLowerCase())),
    [homeSceneSelector.items]
  );

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
            token
          );

          if (homeResponse) {
            setSelectedCommunity(homeResponse);
            return;
          }
        }
      } catch {
        // Leave unselected; Feed/Archive panels render guidance states.
      }
    }

    resolveDefaultCommunity();
  }, [selectedCommunity, token, homeScene, tunedSceneId, hasHomeScene]);

  useEffect(() => {
    let cancelled = false;

    async function loadHomeSceneSelector() {
      if (!token || !hasHomeScene) {
        setHomeSceneSelector({ currentLocation: null, items: [] });
        setHomeSceneSelectorError(null);
        setHomeSceneSelectorLoading(false);
        return;
      }

      setHomeSceneSelectorLoading(true);
      setHomeSceneSelectorError(null);

      try {
        const selector = await getHomeSceneSelector(token);
        if (cancelled) return;
        setHomeSceneSelector(selector);
      } catch (error: unknown) {
        if (cancelled) return;
        const message =
          error instanceof Error ? error.message : 'Unable to load Home Scene options.';
        setHomeSceneSelector({ currentLocation: null, items: [] });
        setHomeSceneSelectorError(message);
      } finally {
        if (!cancelled) {
          setHomeSceneSelectorLoading(false);
        }
      }
    }

    loadHomeSceneSelector();

    return () => {
      cancelled = true;
    };
  }, [hasHomeScene, token]);

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
        const stats = await getCommunityStatistics(
          selectedCommunity.id,
          selectedTier,
          token || undefined
        );
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
            : null
        );
      } catch (error: unknown) {
        if (cancelled) return;

        const message =
          error instanceof Error ? error.message : 'Unable to load the active broadcast rotation.';
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

        setPlotProfile(
            response.data ?? {
              canViewCollection: true,
              collectionShelves: [],
              savedAwayScenes: [],
              activationNotices: [],
              managedArtistBands: [],
            }
          );
      } catch (error: unknown) {
        if (cancelled) return;

        const message =
          error instanceof Error ? error.message : 'Unable to load collection shelves.';
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

    async function loadMusicCommunityPreferences() {
      if (!token) {
        setMusicCommunityPreferences([]);
        setMusicCommunityPreferencesError(null);
        setMusicCommunityPreferencesLoading(false);
        return;
      }

      setMusicCommunityPreferencesLoading(true);
      setMusicCommunityPreferencesError(null);

      try {
        const preferences = await getMusicCommunityPreferences(token);
        if (cancelled) return;
        setMusicCommunityPreferences(preferences);
      } catch (error: unknown) {
        if (cancelled) return;
        const message =
          error instanceof Error ? error.message : 'Unable to load music-community preferences.';
        setMusicCommunityPreferences([]);
        setMusicCommunityPreferencesError(message);
      } finally {
        if (!cancelled) {
          setMusicCommunityPreferencesLoading(false);
        }
      }
    }

    loadMusicCommunityPreferences();

    return () => {
      cancelled = true;
    };
  }, [token]);

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

  const handleCollectionSelection = (item: {
    id: string;
    label: string;
    kind: 'track' | 'playlist';
  }) => {
    setSelectedCollectionItem(item);
    setPlayerMode('SPACE');
  };

  const handleCollectionEject = () => {
    setPlayerMode('RADIYO');
    setActiveBroadcastTier((current) => current ?? selectedTier);
  };

  const handleAddMusicCommunityPreference = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !musicCommunityPreferenceDraft.trim()) return;

    setMusicCommunityPreferenceSaving(true);
    setMusicCommunityPreferencesError(null);

    try {
      const preferences = await addMusicCommunityPreference(musicCommunityPreferenceDraft, token);
      setMusicCommunityPreferences(preferences);
      setMusicCommunityPreferenceDraft('');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unable to add music-community preference.';
      setMusicCommunityPreferencesError(message);
    } finally {
      setMusicCommunityPreferenceSaving(false);
    }
  };

  const handleSetDefaultMusicCommunityPreference = async (musicCommunity: string) => {
    if (!token) return;

    setMusicCommunityPreferenceSaving(true);
    setMusicCommunityPreferencesError(null);

    try {
      const preferences = await setDefaultMusicCommunityPreference(musicCommunity, token);
      setMusicCommunityPreferences(preferences);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unable to set default music-community preference.';
      setMusicCommunityPreferencesError(message);
    } finally {
      setMusicCommunityPreferenceSaving(false);
    }
  };

  const handleHomeSceneSelectorSelect = async (item: HomeSceneSelectorItem) => {
    if (!token) return;
    if (homeSceneSelectorSelectingSceneId) return;

    setHomeSceneSelectorSelectingSceneId(item.sceneId);
    setHomeSceneSelectorError(null);

    try {
      const nextCommunity = await getCommunityById(item.sceneId, token);

      if (!nextCommunity) {
        throw new Error('Selected Home Scene is unavailable.');
      }

      const context = await tuneDiscoverScene(item.sceneId, token);

      setDiscoveryContext(context);
      setSelectedCommunity(nextCommunity);
      setSelectedCollectionItem(null);
      setPlayerMode('RADIYO');
      setHomeSceneSelector((current) => ({
        ...current,
        items: current.items.map((selectorItem) => ({
          ...selectorItem,
          isCurrent: selectorItem.sceneId === item.sceneId,
        })),
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to switch Home Scene.';
      setHomeSceneSelectorError(message);
    } finally {
      setHomeSceneSelectorSelectingSceneId(null);
    }
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

  const isProfileExpanded = profilePanelState === 'expanded';
  const currentRotationTracks =
    rotationPool === 'new_releases'
      ? (broadcastRotation?.newReleases ?? [])
      : (broadcastRotation?.mainRotation ?? []);
  const currentBroadcastTrack: Track | null = currentRotationTracks[0] ?? null;
  const radiyoBroadcastLabel = buildRadiyoBroadcastLabel(
    selectedTier,
    selectedCommunity,
    homeScene
  );
  const currentBroadcastLabel = broadcastMeta?.sceneName ?? radiyoBroadcastLabel;
  const collectionBroadcastLabel =
    selectedCollectionItem?.label ?? `${user?.displayName || user?.username || 'Your'} Space`;
  const homeCityLabel = selectedCommunity?.city ?? homeScene?.city ?? 'CITY';
  const listenerRecommendationLabel =
    selectedCollectionItem?.label ??
    currentBroadcastTrack?.title ??
    'No current recommendation yet';
  const pioneerNotificationHomeScene = pioneerFollowUp?.homeScene ?? null;
  const hasPioneerFollowUp = Boolean(pioneerNotificationHomeScene && hasHomeScene);
  const collectionShelves = plotProfile?.collectionShelves ?? [];
  const canViewCollection = Boolean(plotProfile?.canViewCollection);
  const savedAwayScenes = plotProfile?.savedAwayScenes ?? [];
  const activationNotices = plotProfile?.activationNotices ?? [];
  const managedArtistBands = plotProfile?.managedArtistBands ?? [];
  const availableMusicCommunityPreferences = MUSIC_COMMUNITIES.filter(
    (musicCommunity) =>
      !musicCommunityPreferences.some(
        (preference) =>
          preference.musicCommunity.trim().toLowerCase() === musicCommunity.trim().toLowerCase()
      )
  );
  const latestPromoterEntry = promoterEntries[0] ?? null;
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
    (card): card is { label: string; value: string; detail: string } => Boolean(card)
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
  const plotTabHeading = activeTab === 'Archive' ? 'Scene Archive' : activeTab;
  const wheelActions = getEngagementWheelActions(playerMode);
  const plotTabDescription =
    activeTab === 'Feed'
      ? 'Community actions appear here.'
      : activeTab === 'Events'
        ? 'Scene events listing from your selected community anchor.'
        : activeTab === 'Archive'
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
    return (
      <PlotPrimaryTabBody
        activeTab={activeTab}
        communityId={selectedCommunity?.id ?? null}
        communityLabel={selectedCommunityLabel}
        selectedTier={selectedTier}
        metrics={expandedProfileStats?.metrics ?? null}
      />
    );
  };

  const playerPanel = (
    <RadiyoPlayerPanel
      mode={playerMode}
      placement={isProfileExpanded ? 'profile-bottom' : 'top'}
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
  );

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
              <Button
                className="rounded-full border border-black bg-[#b8d63b] text-black hover:bg-[#b8d63b]/90"
                onClick={() => router.push('/onboarding')}
              >
                Complete Onboarding
              </Button>
            </div>
          </section>

          <section className="plot-wire-panel plot-wire-grid-bg p-6">
            <h2 className="text-lg font-semibold text-black">
              Plot surfaces unlock after Home Scene resolution
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-black/65">
              Feed, Events, Archive, and scene-scoped profile context remain unavailable until your
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
            data-slot="home-identity-layer"
            className="flex flex-wrap items-end justify-between gap-3 rounded-[1.15rem] border border-black bg-[#dfdfcf] px-3 py-3 sm:flex-nowrap"
            onPointerDown={handleProfilePointerDown}
            onPointerMove={handleProfilePointerMove}
            onPointerUp={handleProfilePointerUp}
          >
            <div className="flex min-w-0 flex-1 basis-full items-end gap-3 sm:basis-auto">
              <div
                data-slot="listener-avatar-bust"
                className="flex h-16 w-14 shrink-0 items-end justify-center rounded-t-full border border-black bg-[#b8d63b] shadow-[2px_2px_0_rgba(0,0,0,0.28)]"
                aria-label="Listener avatar bust"
              >
                <span
                  className="mb-2 h-8 w-8 rounded-full border border-black bg-[#efefe2]"
                  aria-hidden
                />
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
                    setIsNotificationPanelOpen((open) => !open);
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
                      Your submitted Home Scene is not active yet. You are temporarily routed
                      through the nearest active city scene for{' '}
                      {pioneerNotificationHomeScene.musicCommunity}.
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
              onClick={toggleProfilePanel}
              aria-controls="plot-profile-panel"
              aria-expanded={isProfileExpanded}
              aria-label={
                profilePanelState === 'expanded' ? 'Collapse profile panel' : 'Expand profile panel'
              }
            >
              <span className="block h-1.5 w-8 rounded-full bg-black/30" aria-hidden />
              <span>{seamLabel}</span>
            </button>
          </div>
        </section>

        <HomeSceneSelector
          selector={homeSceneSelector}
          selectedCommunityId={selectedCommunity?.id ?? null}
          selectedCommunityLabel={selectedCommunityLabel}
          loading={homeSceneSelectorLoading}
          error={homeSceneSelectorError}
          selectingSceneId={homeSceneSelectorSelectingSceneId}
          onSelect={handleHomeSceneSelectorSelect}
        />

        {isProfileExpanded ? null : playerPanel}

        {isProfileExpanded ? (
          <PlotListenerProfile
            user={user}
            homeScene={homeScene}
            selectedCommunityLabel={selectedCommunityLabel}
            activityScore={activityScore}
            eventsThisWeek={eventsThisWeek}
            calendarDate={calendarDate}
            profileStatusCards={profileStatusCards}
            activationNotices={activationNotices}
            token={token}
            musicCommunityPreferenceDraft={musicCommunityPreferenceDraft}
            musicCommunityPreferenceSaving={musicCommunityPreferenceSaving}
            musicCommunityPreferencesLoading={musicCommunityPreferencesLoading}
            musicCommunityPreferencesError={musicCommunityPreferencesError}
            musicCommunityPreferences={musicCommunityPreferences}
            availableMusicCommunityPreferences={availableMusicCommunityPreferences}
            resolvedSelectorMusicCommunities={resolvedSelectorMusicCommunities}
            activeProfileSection={activeProfileSection}
            plotProfileLoading={plotProfileLoading}
            plotProfileError={plotProfileError}
            canViewCollection={canViewCollection}
            collectionShelves={collectionShelves}
            savedAwayScenes={savedAwayScenes}
            selectedCollectionItem={selectedCollectionItem}
            playerMode={playerMode}
            playerPanel={playerPanel}
            onAddMusicCommunityPreference={handleAddMusicCommunityPreference}
            onMusicCommunityPreferenceDraftChange={setMusicCommunityPreferenceDraft}
            onSetDefaultMusicCommunityPreference={handleSetDefaultMusicCommunityPreference}
            onActiveProfileSectionChange={setActiveProfileSection}
            onCollectionSelection={handleCollectionSelection}
            onReturnToPlotTabs={toggleProfilePanel}
          />
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
              {/* Left Panel - Active Plot Surface */}
              <div className="plot-wire-panel">
                <div className="mb-4 rounded-[1rem] border border-black bg-[#efefe2] px-4 py-3">
                  <p className="plot-wire-label">Active Surface</p>
                  <h2 className="mt-1 text-lg font-semibold text-black">{plotTabHeading}</h2>
                  <p className="mt-1 text-sm text-black/65">
                    {plotTabDescription}
                    {activeTab === 'Archive' && (
                      <>
                        Descriptive scene history and activity from{' '}
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
                    currentUserId={user?.id ?? null}
                    onSelectListener={() => router.push('/plot')}
                    onSelectSource={() => router.push('/source-dashboard')}
                  />
                ) : null}

                <div className="plot-wire-panel">
                  <h3 className="mb-2 font-semibold text-black">Registrar Access</h3>
                  <p className="text-sm text-black/65">
                    Artist/Band registration status stays visible here so Plot keeps registrar
                    access inside the civic workflow.
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
                    <div className="plot-wire-card-muted mt-4 p-4">
                      <p className="plot-wire-label">Latest Status</p>
                      <p className="mt-1 text-sm font-medium text-black">
                        {registrarSummary.latestStatus
                          ? formatRegistrarEntryStatus(registrarSummary.latestStatus)
                          : 'No recent status'}
                      </p>
                      <p className="mt-3 text-sm text-black/70">
                        Entries: {registrarSummary.totalEntries} • Submitted:{' '}
                        {registrarSummary.submittedCount} • Materialized:{' '}
                        {registrarSummary.materializedCount}
                      </p>
                      <p className="mt-1 text-xs text-black/55">
                        Invites pending: {registrarSummary.pendingInviteCount} • queued:{' '}
                        {registrarSummary.queuedInviteCount} • sent:{' '}
                        {registrarSummary.sentInviteCount} • failed:{' '}
                        {registrarSummary.failedInviteCount}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-black/60">
                      No Artist/Band registrar entries yet.
                    </p>
                  )}

                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full border-black bg-white text-xs font-semibold uppercase tracking-[0.12em]"
                        onClick={() => router.push('/registrar')}
                      >
                        Open Registrar
                      </Button>
                    </div>
                  </div>
                </div>

                {selectedCommunity && (
                  <div className="plot-wire-panel">
                    <h3 className="mb-3 font-semibold text-black">Selected Community</h3>
                    <div className="plot-wire-card-muted p-4">
                      <p className="font-medium text-black">
                        {selectedCommunityLabel ?? selectedCommunity.name}
                      </p>
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
