'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@uprise/ui';
import type {
  BroadcastRotation,
  BroadcastRotationMeta,
  CommunityDiscoverHighlights,
  CommunityDiscoverSearchResult,
  DiscoverRecommendationResult,
  DiscoverSignalResult,
  Track,
} from '@uprise/types';
import { getActiveBroadcastRotation } from '@/lib/broadcast/client';
import { normalizeBroadcastRuntimeError } from '@/lib/broadcast/runtime';
import RadiyoPlayerPanel, {
  type PlayerTier,
  type RotationPool,
} from '@/components/plot/RadiyoPlayerPanel';
import SceneContextBadge from '@/components/plot/SceneContextBadge';
import SceneMap from '@/components/plot/SceneMap';
import { getMvpPlayerTier } from '@/components/plot/tier-guard';
import {
  getCommunitySceneMap,
  type CommunitySceneMapResponse,
} from '@/lib/communities/client';
import {
  getCommunityDiscoverHighlights,
  getDiscoveryContext,
  listDiscoverScenes,
  saveDiscoverUprise,
  searchCommunityDiscover,
  setDiscoverHomeScene,
  tuneDiscoverScene,
  type DiscoverCitySceneItem,
  type DiscoverItem,
  type DiscoverStateRollupItem,
  type TierScope,
} from '@/lib/discovery/client';
import { getDefaultLocationQueryForTier } from '@/lib/discovery/query-state';
import { api } from '@/lib/api';
import {
  mergeDiscoveryContextPatch,
  toDiscoveryContextPatch,
} from '@/lib/discovery/context';
import { useAuthStore } from '@/store/auth';
import { useOnboardingStore } from '@/store/onboarding';

type PopularSinglesLens = 'mostAdded' | 'recentRises';
const DISCOVER_TIER_OPTIONS: TierScope[] = ['city', 'state'];

function formatSceneLocation(city: string | null, state: string | null) {
  if (city && state) return `${city}, ${state}`;
  if (city) return city;
  if (state) return state;
  return 'Unlisted';
}

function formatMusicCommunityLabel(value: string | null | undefined, fallback?: string) {
  return value?.trim() || fallback?.trim() || 'Unlisted';
}

function getCitySceneStatusLabel(item: DiscoverCitySceneItem, tunedSceneId: string | null) {
  if (item.isHomeScene) return 'Home Scene';
  if (tunedSceneId === item.sceneId) return 'Tuned Scene';
  return item.isActive ? 'Active' : 'Inactive';
}

function parseLocationQuery(query: string, tier: TierScope, fallbackState: string | null | undefined) {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      state: tier === 'national' ? undefined : fallbackState?.trim() || undefined,
      city: undefined,
    };
  }

  const [first, second] = trimmed.split(',').map((value) => value.trim()).filter(Boolean);
  if (tier === 'city') {
    return {
      city: first || trimmed,
      state: second || fallbackState?.trim() || undefined,
    };
  }

  return {
    state: second || first || trimmed,
    city: undefined,
  };
}

function isCityScene(item: DiscoverItem): item is DiscoverCitySceneItem {
  return item.entryType === 'city_scene';
}

function isStateRollup(item: DiscoverItem): item is DiscoverStateRollupItem {
  return item.entryType === 'state_rollup';
}

async function postSignalAction(
  signalId: string,
  action: 'add' | 'blast' | 'recommend',
  token: string,
) {
  const response = await api.post<{ id: string }>(`/signals/${signalId}/${action}`, {}, { token });
  if (!response.data) {
    throw new Error(`Signal ${action} response was empty.`);
  }
  return response.data;
}

function extractSignalTitle(signal: DiscoverSignalResult) {
  const metadata = signal.metadata ?? {};
  const title = metadata.title;
  if (typeof title === 'string' && title.trim()) return title.trim();
  const name = metadata.name;
  if (typeof name === 'string' && name.trim()) return name.trim();
  return signal.type;
}

function extractSignalSubtitle(signal: DiscoverSignalResult) {
  const metadata = signal.metadata ?? {};
  const artist =
    typeof metadata.artist === 'string'
      ? metadata.artist.trim()
      : typeof metadata.artistName === 'string'
        ? metadata.artistName.trim()
        : '';

  if (artist) return artist;
  return signal.type.toUpperCase();
}

function formatCommunityIdentity(
  city: string | null | undefined,
  state: string | null | undefined,
  musicCommunity: string | null | undefined,
) {
  const cityLabel = city?.trim();
  const stateLabel = state?.trim();
  const communityLabel = musicCommunity?.trim();
  if (cityLabel && stateLabel && communityLabel) return `${cityLabel}, ${stateLabel} • ${communityLabel}`;
  return 'Community identity unavailable.';
}

function formatLensMetric(signal: DiscoverSignalResult) {
  if (signal.highestScopeReached && signal.lastRiseAt) {
    const riseDate = new Date(signal.lastRiseAt);
    const formattedDate = Number.isNaN(riseDate.getTime())
      ? signal.lastRiseAt
      : new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
        }).format(riseDate);

    return `Entered ${signal.highestScopeReached} player • ${formattedDate}`;
  }

  if (!signal.lensMetricLabel) return null;
  return `${signal.lensMetricValue ?? 0} ${signal.lensMetricLabel}`;
}

function formatSignalOrigin(signal: DiscoverSignalResult) {
  if (!signal.communityCity && !signal.communityState && !signal.communityMusicCommunity) {
    return null;
  }

  return formatCommunityIdentity(
    signal.communityCity ?? null,
    signal.communityState ?? null,
    signal.communityMusicCommunity ?? null,
  );
}

function SearchResultsSection({
  localSearchResult,
  localSearchLoading,
  localSearchError,
  token,
}: {
  localSearchResult: CommunityDiscoverSearchResult | null;
  localSearchLoading: boolean;
  localSearchError: string | null;
  token: string | null;
}) {
  if (localSearchLoading) {
    return <p className="mt-4 text-sm text-black/60">Searching this listening scope...</p>;
  }

  if (localSearchError) {
    return <p className="mt-4 text-sm text-red-700">{localSearchError}</p>;
  }

  if (!localSearchResult) {
    return null;
  }

  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <section className="plot-wire-list-item">
        <p className="plot-wire-label">Artists</p>
        <h3 className="mt-1 text-sm font-semibold text-black">Artists</h3>
        {localSearchResult.artists.length === 0 ? (
          <p className="mt-2 text-sm text-black/50">No artists matched this search.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {localSearchResult.artists.map((artist) => (
              <li key={artist.artistBandId} className="plot-wire-card-muted px-3 py-3">
                {token ? (
                  <Link
                    href={`/artist-bands/${artist.artistBandId}`}
                    className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                  >
                    <p className="text-sm font-medium text-black">{artist.name}</p>
                    <p className="text-xs text-black/60">
                      {artist.entityType} • {artist.followCount} followers • {artist.memberCount} members
                    </p>
                    <p className="text-xs text-black/50">
                      {formatCommunityIdentity(
                        artist.homeSceneCity,
                        artist.homeSceneState,
                        artist.homeSceneMusicCommunity,
                      )}
                    </p>
                  </Link>
                ) : (
                  <>
                    <p className="text-sm font-medium text-black">{artist.name}</p>
                    <p className="text-xs text-black/60">
                      {artist.entityType} • {artist.followCount} followers • {artist.memberCount} members
                    </p>
                    <p className="text-xs text-black/50">
                      {formatCommunityIdentity(
                        artist.homeSceneCity,
                        artist.homeSceneState,
                        artist.homeSceneMusicCommunity,
                      )}
                    </p>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="plot-wire-list-item">
        <p className="plot-wire-label">Songs</p>
        <h3 className="mt-1 text-sm font-semibold text-black">Songs</h3>
        {localSearchResult.songs.length === 0 ? (
          <p className="mt-2 text-sm text-black/50">No songs matched this search.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {localSearchResult.songs.map((song) => (
              <li key={song.trackId} className="plot-wire-card-muted px-3 py-3">
                {song.artistBandId && token ? (
                  <Link
                    href={`/artist-bands/${song.artistBandId}?trackId=${song.trackId}`}
                    className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                  >
                    <p className="text-sm font-medium text-black">{song.title}</p>
                    <p className="text-xs text-black/60">
                      {song.artist} • {song.playCount} plays • {song.likeCount} likes
                    </p>
                    <p className="text-xs text-black/50">
                      {formatCommunityIdentity(
                        song.communityCity,
                        song.communityState,
                        song.communityMusicCommunity,
                      )}
                    </p>
                  </Link>
                ) : (
                  <>
                    <p className="text-sm font-medium text-black">{song.title}</p>
                    <p className="text-xs text-black/60">
                      {song.artist} • {song.playCount} plays • {song.likeCount} likes
                    </p>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function SignalCard({
  signal,
  token,
  onSignalAction,
}: {
  signal: DiscoverSignalResult;
  token: string | null;
  onSignalAction: (
    signalId: string,
    action: 'add' | 'blast' | 'recommend',
    successMessage: string,
  ) => void;
}) {
  const title = extractSignalTitle(signal);
  const subtitle = extractSignalSubtitle(signal);
  const metric = formatLensMetric(signal);
  const origin = formatSignalOrigin(signal);

  return (
    <article className="plot-wire-list-item min-w-[260px]">
      <p className="plot-wire-label">Single</p>
      <h4 className="mt-2 text-base font-semibold text-black">{title}</h4>
      <p className="mt-1 text-xs text-black/60">{subtitle}</p>
      {origin ? <p className="mt-1 text-xs text-black/50">{origin}</p> : null}
      {metric ? <p className="mt-2 text-xs text-black/55">{metric}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          className="plot-wire-chip h-auto rounded-full bg-white px-3 py-2 text-[11px] text-black"
          disabled={!token}
          onClick={() => void onSignalAction(signal.signalId, 'add', 'Signal added to your collection.')}
        >
          Add
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="plot-wire-chip h-auto rounded-full bg-white px-3 py-2 text-[11px] text-black"
          disabled={!token}
          onClick={() => void onSignalAction(signal.signalId, 'blast', 'Signal blasted to your community.')}
        >
          Blast
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="plot-wire-chip h-auto rounded-full bg-white px-3 py-2 text-[11px] text-black"
          disabled={!token}
          onClick={() => void onSignalAction(signal.signalId, 'recommend', 'Signal recommended.')}
        >
          Recommend
        </Button>
      </div>
    </article>
  );
}

function RecommendationCard({
  recommendation,
  token,
  onSignalAction,
}: {
  recommendation: DiscoverRecommendationResult;
  token: string | null;
  onSignalAction: (
    signalId: string,
    action: 'add' | 'blast' | 'recommend',
    successMessage: string,
  ) => void;
}) {
  const title = extractSignalTitle(recommendation.signal);

  return (
    <article className="plot-wire-list-item min-w-[300px]">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-black bg-[#efefe2] text-sm font-semibold text-black">
          {recommendation.actor.displayName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="plot-wire-label">Recommendation</p>
          <p className="mt-1 text-sm font-semibold text-black">{recommendation.actor.displayName}</p>
          <div className="mt-2 rounded-[1rem] border border-black bg-white px-3 py-3 text-sm text-black shadow-[2px_2px_0_rgba(0,0,0,0.16)]">
            Check out "{title}"
          </div>
          <p className="mt-2 text-xs text-black/55">{extractSignalSubtitle(recommendation.signal)}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          className="plot-wire-chip h-auto rounded-full bg-white px-3 py-2 text-[11px] text-black"
          disabled={!token}
          onClick={() => void onSignalAction(recommendation.signal.signalId, 'add', 'Signal added to your collection.')}
        >
          Add
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="plot-wire-chip h-auto rounded-full bg-white px-3 py-2 text-[11px] text-black"
          disabled={!token}
          onClick={() => void onSignalAction(recommendation.signal.signalId, 'blast', 'Signal blasted to your community.')}
        >
          Blast
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="plot-wire-chip h-auto rounded-full bg-white px-3 py-2 text-[11px] text-black"
          disabled={!token}
          onClick={() => void onSignalAction(recommendation.signal.signalId, 'recommend', 'Signal recommended.')}
        >
          Recommend
        </Button>
      </div>
    </article>
  );
}

function HorizontalRail({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <p className="plot-wire-label">{title}</p>
        <h2 className="mt-1 text-lg font-semibold text-black">{title}</h2>
        <p className="mt-1 text-sm text-black/60">{subtitle}</p>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">{children}</div>
    </section>
  );
}

export default function DiscoverPage() {
  const { token } = useAuthStore();
  const {
    homeScene,
    playerTier,
    tunedSceneId,
    tunedScene,
    isVisitor,
    setHomeScene,
    setDiscoveryContext,
    setPlayerTier,
  } = useOnboardingStore();

  const initialTier = useMemo<PlayerTier>(() => playerTier ?? getMvpPlayerTier(tunedScene?.tier), [playerTier, tunedScene?.tier]);

  const [tier, setTier] = useState<TierScope>(initialTier);
  const [rotationPool, setRotationPool] = useState<RotationPool>('main_rotation');
  const [broadcastRotation, setBroadcastRotation] = useState<BroadcastRotation | null>(null);
  const [broadcastMeta, setBroadcastMeta] = useState<BroadcastRotationMeta | null>(null);
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [broadcastError, setBroadcastError] = useState<string | null>(null);
  const [broadcastEmptyMessage, setBroadcastEmptyMessage] = useState<string | null>(null);
  const [locationQuery, setLocationQuery] = useState(
    getDefaultLocationQueryForTier(initialTier, homeScene, tunedScene),
  );
  const [travelItems, setTravelItems] = useState<DiscoverItem[]>([]);
  const [travelLoading, setTravelLoading] = useState(false);
  const [travelError, setTravelError] = useState<string | null>(null);
  const [travelOpen, setTravelOpen] = useState(false);
  const [savingHomeSceneId, setSavingHomeSceneId] = useState<string | null>(null);
  const [tuningSceneId, setTuningSceneId] = useState<string | null>(null);
  const [savingUpriseSceneId, setSavingUpriseSceneId] = useState<string | null>(null);
  const [sceneMap, setSceneMap] = useState<CommunitySceneMapResponse | null>(null);
  const [sceneMapError, setSceneMapError] = useState<string | null>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [localSearchLoading, setLocalSearchLoading] = useState(false);
  const [localSearchError, setLocalSearchError] = useState<string | null>(null);
  const [localSearchResult, setLocalSearchResult] = useState<CommunityDiscoverSearchResult | null>(null);
  const [highlights, setHighlights] = useState<CommunityDiscoverHighlights | null>(null);
  const [highlightsLoading, setHighlightsLoading] = useState(false);
  const [highlightsError, setHighlightsError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [selectedLens, setSelectedLens] = useState<PopularSinglesLens>('mostAdded');

  const originScene = tunedScene ?? homeScene;
  const originMusicCommunity = useMemo(
    () => tunedScene?.musicCommunity?.trim() || homeScene?.musicCommunity?.trim() || '',
    [homeScene?.musicCommunity, tunedScene?.musicCommunity],
  );
  const hasOriginContext = Boolean(originMusicCommunity && (tunedScene || homeScene));

  const travelParams = useMemo(() => {
    const parsed = parseLocationQuery(locationQuery, tier, tunedScene?.state ?? homeScene?.state ?? null);
    return {
      tier,
      musicCommunity: originMusicCommunity,
      state: parsed.state,
      city: parsed.city,
    };
  }, [homeScene?.state, locationQuery, originMusicCommunity, tier, tunedScene?.state]);

  const activeSceneId = tunedSceneId ?? tunedScene?.id ?? null;
  const localContextReady = Boolean(activeSceneId || hasOriginContext);
  const activeSceneName =
    tunedScene?.name ??
    (homeScene ? `${homeScene.city}, ${homeScene.state} ${homeScene.musicCommunity}` : 'current community');
  const localDiscoverLockedReason = !localContextReady
    ? 'Home Scene or tuned community context is required to search locally.'
    : !activeSceneId
      ? 'This Home Scene does not have a live city-scene anchor yet. Local discovery is available in empty-state mode until the scene resolves.'
      : 'Search, Popular Singles, and Recommendations all follow the current player scope.';

  const emptyHighlights: CommunityDiscoverHighlights = useMemo(
    () => ({
      community: {
        id: activeSceneId ?? 'unresolved-home-scene',
        name: activeSceneName,
        city: tunedScene?.city ?? homeScene?.city ?? null,
        state: tunedScene?.state ?? homeScene?.state ?? null,
        musicCommunity: tunedScene?.musicCommunity ?? homeScene?.musicCommunity ?? null,
        tier,
        isActive: Boolean(tunedScene?.isActive),
      },
      popularSingles: {
        mostAdded: [],
        recentRises: [],
      },
      recommendations: [],
    }),
    [
      activeSceneId,
      activeSceneName,
      homeScene?.city,
      homeScene?.musicCommunity,
      homeScene?.state,
      tier,
      tunedScene?.city,
      tunedScene?.isActive,
      tunedScene?.musicCommunity,
      tunedScene?.state,
    ],
  );

  const popularSingles = highlights?.popularSingles ?? emptyHighlights.popularSingles;
  const selectedPopularSingles = popularSingles[selectedLens];
  const currentRotationTracks =
    rotationPool === 'new_releases'
      ? broadcastRotation?.newReleases ?? []
      : broadcastRotation?.mainRotation ?? [];
  const currentBroadcastTrack: Track | null = currentRotationTracks[0] ?? null;
  const currentBroadcastLabel = broadcastMeta?.sceneName ?? `${activeSceneName} • ${tier}`;

  useEffect(() => {
    setTier(initialTier);
    setLocationQuery(getDefaultLocationQueryForTier(initialTier, homeScene, tunedScene));
  }, [homeScene, initialTier, tunedScene]);

  useEffect(() => {
    let ignore = false;

    async function fetchBroadcastRotation() {
      if (!token) {
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
        const response = await getActiveBroadcastRotation(tier, token);
        if (!ignore) {
          setBroadcastRotation(response.data ?? { newReleases: [], mainRotation: [] });
          setBroadcastMeta(response.meta ?? null);
          setBroadcastEmptyMessage(
            tier === 'state' && response.meta?.sceneId.startsWith('state-unavailable:')
              ? 'No state scene is active for this community yet.'
              : null,
          );
        }
      } catch (error: unknown) {
        if (!ignore) {
          const message = error instanceof Error ? error.message : 'Unable to load the active broadcast rotation.';
          const normalized = normalizeBroadcastRuntimeError(message, tier);

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
        }
      } finally {
        if (!ignore) {
          setBroadcastLoading(false);
        }
      }
    }

    void fetchBroadcastRotation();
    return () => {
      ignore = true;
    };
  }, [tier, token]);

  useEffect(() => {
    async function fetchContext() {
      if (!token) return;
      try {
        const response = await getDiscoveryContext(token);
        setDiscoveryContext(toDiscoveryContextPatch(response));
      } catch {
        // Keep persisted client context when fetch fails.
      }
    }

    void fetchContext();
  }, [token, setDiscoveryContext]);

  useEffect(() => {
    let ignore = false;

    async function resolveHomeSceneFallback() {
      if (activeSceneId) return;
      if (!homeScene?.city || !homeScene?.state || !homeScene?.musicCommunity) return;

      try {
        const exactResponse = await listDiscoverScenes(
          {
            tier: 'city',
            city: homeScene.city,
            state: homeScene.state,
            musicCommunity: homeScene.musicCommunity,
          },
          token || undefined,
        );

        const exactMatch = exactResponse.find(
          (item): item is DiscoverCitySceneItem =>
            item.entryType === 'city_scene' &&
            item.city?.trim().toLowerCase() === homeScene.city.trim().toLowerCase() &&
            item.state?.trim().toLowerCase() === homeScene.state.trim().toLowerCase() &&
            item.musicCommunity?.trim().toLowerCase() ===
              homeScene.musicCommunity.trim().toLowerCase(),
        );

        const stateResponse =
          exactMatch && exactMatch.isActive
            ? []
            : await listDiscoverScenes(
                {
                  tier: 'city',
                  state: homeScene.state,
                  musicCommunity: homeScene.musicCommunity,
                },
                token || undefined,
              );

        const sameStateActiveMatch = stateResponse.find(
          (item): item is DiscoverCitySceneItem =>
            item.entryType === 'city_scene' &&
            item.isActive &&
            item.state?.trim().toLowerCase() === homeScene.state.trim().toLowerCase() &&
            item.musicCommunity?.trim().toLowerCase() ===
              homeScene.musicCommunity.trim().toLowerCase(),
        );

        const communityResponse =
          exactMatch || sameStateActiveMatch
            ? []
            : await listDiscoverScenes(
                {
                  tier: 'city',
                  musicCommunity: homeScene.musicCommunity,
                },
                token || undefined,
              );

        const anyActiveMatch = communityResponse.find(
          (item): item is DiscoverCitySceneItem =>
            item.entryType === 'city_scene' &&
            item.isActive &&
            item.musicCommunity?.trim().toLowerCase() ===
              homeScene.musicCommunity.trim().toLowerCase(),
        );

        const resolvedMatch = exactMatch ?? sameStateActiveMatch ?? anyActiveMatch;

        if (!resolvedMatch || ignore) return;

        setDiscoveryContext({
          tunedSceneId: resolvedMatch.sceneId,
          tunedScene: {
            id: resolvedMatch.sceneId,
            name: resolvedMatch.name,
            city: resolvedMatch.city ?? null,
            state: resolvedMatch.state ?? null,
            musicCommunity: resolvedMatch.musicCommunity ?? null,
            tier: 'city',
            isActive: resolvedMatch.isActive,
          },
          isVisitor: Boolean(
            resolvedMatch.city?.trim().toLowerCase() !== homeScene.city.trim().toLowerCase() ||
              resolvedMatch.state?.trim().toLowerCase() !== homeScene.state.trim().toLowerCase() ||
              resolvedMatch.musicCommunity?.trim().toLowerCase() !==
                homeScene.musicCommunity.trim().toLowerCase(),
          ),
        });
      } catch {
        // Keep Discover in the explicit locked state if home-scene resolution fails.
      }
    }

    void resolveHomeSceneFallback();

    return () => {
      ignore = true;
    };
  }, [
    activeSceneId,
    homeScene?.city,
    homeScene?.musicCommunity,
    homeScene?.state,
    setDiscoveryContext,
    token,
  ]);

  useEffect(() => {
    let ignore = false;

    async function fetchTravel() {
      if (!hasOriginContext || !originMusicCommunity) {
        setTravelItems([]);
        setTravelLoading(false);
        setTravelError(null);
        return;
      }

      setTravelLoading(true);
      setTravelError(null);

      try {
        const response = await listDiscoverScenes(travelParams, token || undefined);
        if (!ignore) {
          setTravelItems(response);
        }
      } catch (e) {
        if (!ignore) {
          setTravelError(e instanceof Error ? e.message : 'Unable to load Uprises.');
          setTravelItems([]);
        }
      } finally {
        if (!ignore) {
          setTravelLoading(false);
        }
      }
    }

    void fetchTravel();
    return () => {
      ignore = true;
    };
  }, [hasOriginContext, originMusicCommunity, token, travelParams]);

  useEffect(() => {
    let ignore = false;

    async function fetchHighlights() {
      if (!localContextReady) {
        setHighlights(null);
        setHighlightsError(null);
        return;
      }

      if (!activeSceneId) {
        setHighlights(emptyHighlights);
        setHighlightsError(null);
        setHighlightsLoading(false);
        return;
      }

      setHighlightsLoading(true);
      setHighlightsError(null);

      try {
        const response = await getCommunityDiscoverHighlights(
          activeSceneId,
          token || undefined,
          8,
          tier,
        );
        if (!ignore) {
          setHighlights(response);
        }
      } catch (e) {
        if (!ignore) {
          setHighlightsError(e instanceof Error ? e.message : 'Unable to load Discover highlights.');
          setHighlights(null);
        }
      } finally {
        if (!ignore) {
          setHighlightsLoading(false);
        }
      }
    }

    void fetchHighlights();
    return () => {
      ignore = true;
    };
  }, [activeSceneId, emptyHighlights, localContextReady, tier, token]);

  useEffect(() => {
    let ignore = false;

    async function fetchSceneMapData() {
      if (!activeSceneId || !token || !travelOpen) {
        if (!travelOpen) {
          setSceneMap(null);
          setSceneMapError(null);
        }
        return;
      }

      try {
        setSceneMapError(null);
        const response = await getCommunitySceneMap(activeSceneId, tier, token);
        if (!ignore) {
          setSceneMap(response);
        }
      } catch (e) {
        if (!ignore) {
          setSceneMap(null);
          setSceneMapError(e instanceof Error ? e.message : 'Scene map is unavailable.');
        }
      }
    }

    void fetchSceneMapData();
    return () => {
      ignore = true;
    };
  }, [activeSceneId, tier, token, travelOpen]);

  useEffect(() => {
    let ignore = false;

    async function fetchLocalSearch() {
      if (!localContextReady) {
        setLocalSearchResult(null);
        setLocalSearchError(null);
        setLocalSearchLoading(false);
        return;
      }

      const query = localSearchQuery.trim();
      if (!query) {
        setLocalSearchResult(null);
        setLocalSearchError(null);
        setLocalSearchLoading(false);
        return;
      }

      if (!activeSceneId) {
        setLocalSearchResult({
          community: emptyHighlights.community,
          query,
          artists: [],
          songs: [],
        });
        setLocalSearchError(null);
        setLocalSearchLoading(false);
        return;
      }

      setLocalSearchLoading(true);
      setLocalSearchError(null);

      try {
        const response = await searchCommunityDiscover(
          activeSceneId,
          query,
          token || undefined,
          8,
          tier,
        );
        if (!ignore) {
          setLocalSearchResult(response);
        }
      } catch (e) {
        if (!ignore) {
          setLocalSearchError(e instanceof Error ? e.message : 'Unable to search this listening scope.');
          setLocalSearchResult(null);
        }
      } finally {
        if (!ignore) {
          setLocalSearchLoading(false);
        }
      }
    }

    const timer = window.setTimeout(fetchLocalSearch, 250);
    return () => {
      ignore = true;
      window.clearTimeout(timer);
    };
  }, [activeSceneId, emptyHighlights.community, localContextReady, localSearchQuery, tier, token]);

  const handleTuneSceneById = async (sceneId: string) => {
    if (!token) return;
    setTuningSceneId(sceneId);
    setTravelError(null);

    try {
      const response = await tuneDiscoverScene(sceneId, token);
      const context = await getDiscoveryContext(token);
      setDiscoveryContext(
        mergeDiscoveryContextPatch(context, {
          tunedSceneId: response.tunedSceneId ?? sceneId,
          tunedScene: response.tunedScene ?? null,
          isVisitor: response.isVisitor ?? null,
        }),
      );
      setActionMessage('RaDIYo retuned to the selected Uprise.');
    } catch (e) {
      setTravelError(e instanceof Error ? e.message : 'Unable to tune to Uprise.');
    } finally {
      setTuningSceneId(null);
    }
  };

  const handleSetHomeScene = async (item: DiscoverCitySceneItem) => {
    if (!token) return;

    const proceed = window.confirm(
      `Set Home Scene to ${item.name}? This changes your civic anchor and voting authority context.`,
    );
    if (!proceed) return;

    setSavingHomeSceneId(item.sceneId);
    setTravelError(null);

    try {
      const response = await setDiscoverHomeScene(item.sceneId, token);
      setHomeScene({
        city: response.homeScene?.city ?? item.city ?? '',
        state: response.homeScene?.state ?? item.state ?? '',
        musicCommunity: response.homeScene?.musicCommunity ?? item.musicCommunity ?? originMusicCommunity,
        tasteTag: homeScene?.tasteTag,
      });
      setDiscoveryContext(
        mergeDiscoveryContextPatch(response, {
          tunedSceneId,
          tunedScene,
          isVisitor,
        }),
      );
      setTravelItems((prev) =>
        prev.map((entry) =>
          isCityScene(entry)
            ? {
                ...entry,
                isHomeScene: entry.sceneId === item.sceneId,
              }
            : entry,
        ),
      );
      setActionMessage(`${item.name} is now your Home Scene.`);
    } catch (e) {
      setTravelError(e instanceof Error ? e.message : 'Unable to set Home Scene.');
    } finally {
      setSavingHomeSceneId(null);
    }
  };

  const handleSaveUprise = async (sceneId: string) => {
    if (!token) return;
    setSavingUpriseSceneId(sceneId);
    try {
      await saveDiscoverUprise(sceneId, token);
      setActionMessage('Uprise saved to your profile presets.');
    } catch (e) {
      setTravelError(e instanceof Error ? e.message : 'Unable to save Uprise.');
    } finally {
      setSavingUpriseSceneId(null);
    }
  };

  const handleSignalAction = async (
    signalId: string,
    action: 'add' | 'blast' | 'recommend',
    successMessage: string,
  ) => {
    if (!token) return;
    try {
      await postSignalAction(signalId, action, token);
      setActionMessage(successMessage);
      if (activeSceneId) {
        const response = await getCommunityDiscoverHighlights(activeSceneId, token, 8, tier);
        setHighlights(response);
      }
    } catch (e) {
      setHighlightsError(e instanceof Error ? e.message : `Unable to ${action} signal.`);
    }
  };

  const handleChangeTier = (nextTier: PlayerTier) => {
    const persistedTier = nextTier === 'national' ? 'state' : nextTier;

    setTier(persistedTier);
    setPlayerTier(persistedTier);
    setLocationQuery(getDefaultLocationQueryForTier(persistedTier, homeScene, tunedScene));
    setTravelError(null);
  };

  const currentCityScenes = travelItems.filter(isCityScene);

  return (
    <main className="plot-wire-page pb-10">
      <div className="plot-wire-frame max-w-6xl space-y-5">
        <header className="plot-wire-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="plot-wire-label">Discover</p>
              <h1 className="mt-2 text-3xl font-semibold text-black">Discover Uprises, Artists, and Songs</h1>
              <p className="mt-2 text-sm text-black/60">
                One listening scope governs search, Popular Singles, Recommendations, and Travel. Change the player
                tier when you want the scope to widen.
              </p>
            </div>
            <div className="plot-wire-toolbar min-w-[240px]">
              <p className="plot-wire-label">Current Listening Scope</p>
              <p className="mt-1 text-sm text-black/70 capitalize">{tier}</p>
              <p className="mt-2 text-sm text-black/70">
                {formatCommunityIdentity(
                  originScene?.city ?? null,
                  originScene?.state ?? null,
                  originMusicCommunity,
                )}
              </p>
            </div>
          </div>
          <SceneContextBadge homeScene={homeScene} tunedScene={tunedScene} isVisitor={isVisitor} />
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black">
              <Link href="/plot">Back to Plot</Link>
            </Button>
            {token && activeSceneId ? (
              <Button asChild variant="outline" size="sm" className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black">
                <Link href={`/community/${activeSceneId}`}>Visit {activeSceneName}</Link>
              </Button>
            ) : null}
          </div>
          {actionMessage ? (
            <div className="mt-4 rounded-[1rem] border border-black bg-[#b8d63b] px-4 py-3 text-sm text-black shadow-[3px_3px_0_rgba(0,0,0,0.2)]">
              {actionMessage}
            </div>
          ) : null}
        </header>

        <section className="plot-wire-panel">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="plot-wire-label">Search</p>
              <h2 className="mt-1 text-lg font-semibold text-black">Artist and song search</h2>
              <p className="mt-1 text-sm text-black/60">
                The single Discover search bar stays anchored to the current player scope.
              </p>
            </div>
            <div className="plot-wire-toolbar min-w-[280px]">
              <p className="plot-wire-label">Scope State</p>
              <p className="text-sm text-black/70">Visitor mode: {isVisitor ? 'Active' : 'Off'}</p>
              <p className="mt-2 text-sm text-black/70">{localDiscoverLockedReason}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="plot-wire-toolbar">
              <p className="plot-wire-label">Search Bar</p>
              <input
                value={localSearchQuery}
                onChange={(event) => setLocalSearchQuery(event.target.value)}
                placeholder={
                  localContextReady
                    ? `Search artists and songs in the current ${tier} listening scope`
                    : 'Home Scene or tuned community required'
                }
                className="mt-2 w-full border-0 bg-transparent px-0 py-0 text-base text-black placeholder:text-black/35 focus:outline-none focus:ring-0"
                disabled={!localContextReady}
              />
            </div>
            {activeSceneId ? (
              <Button asChild variant="outline" size="sm" className="plot-wire-chip h-auto rounded-full bg-white px-4 py-3 text-[11px] text-black">
                <Link href={`/community/${activeSceneId}`}>Visit {activeSceneName}</Link>
              </Button>
            ) : null}
          </div>
          {!token ? (
            <p className="mt-3 text-xs text-black/50">
              Sign in is required to open artist pages and change Home Scene from Discover.
            </p>
          ) : null}

          <SearchResultsSection
            localSearchResult={localSearchResult}
            localSearchLoading={localSearchLoading}
            localSearchError={localSearchError}
            token={token}
          />
        </section>

        <section className="plot-wire-panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="plot-wire-label">Popular Singles</p>
              <h2 className="mt-1 text-lg font-semibold text-black">Popular Singles</h2>
              <p className="mt-1 text-sm text-black/60">
                Descriptive signal discovery inside the current player scope. No `Popular Now`, no recommendation engine.
              </p>
              <p className="mt-1 text-xs text-black/50">
                MVP Discover currently widens from city to state. National is deferred until population justifies it.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className={selectedLens === 'mostAdded'
                  ? 'plot-wire-chip h-auto rounded-full bg-[#b8d63b] px-4 py-2 text-[11px] text-black'
                  : 'plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black'}
                onClick={() => setSelectedLens('mostAdded')}
              >
                Most Added
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={selectedLens === 'recentRises'
                  ? 'plot-wire-chip h-auto rounded-full bg-[#b8d63b] px-4 py-2 text-[11px] text-black'
                  : 'plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black'}
                onClick={() => setSelectedLens('recentRises')}
              >
                Recent Rises
              </Button>
            </div>
          </div>

          {highlightsLoading ? <p className="mt-4 text-sm text-black/60">Loading Popular Singles...</p> : null}
          {highlightsError ? <p className="mt-4 text-sm text-red-700">{highlightsError}</p> : null}

          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {selectedPopularSingles.length === 0 ? (
              <div className="plot-wire-card-muted min-w-[280px] border-dashed px-4 py-6 text-sm text-black/50">
                {selectedLens === 'recentRises'
                  ? tier === 'state'
                    ? 'No recent city-to-state promotions are available yet.'
                    : 'Recent Rises appear when Discover is widened to the state scope.'
                  : 'No singles available for this lens yet.'}
              </div>
            ) : (
              selectedPopularSingles.map((signal) => (
                <SignalCard
                  key={`${selectedLens}-${signal.signalId}`}
                  signal={signal}
                  token={token}
                  onSignalAction={handleSignalAction}
                />
              ))
            )}
          </div>
        </section>

        <section className="plot-wire-panel">
          <HorizontalRail
            title="Recommendations"
            subtitle="Listener-to-listener discovery using the fixed avatar and recommendation-balloon grammar."
          >
            {highlightsLoading ? (
              <div className="plot-wire-card-muted min-w-[280px] border-dashed px-4 py-6 text-sm text-black/50">
                Loading recommendations...
              </div>
            ) : highlights?.recommendations.length ? (
              highlights.recommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.recommendationId}
                  recommendation={recommendation}
                  token={token}
                  onSignalAction={handleSignalAction}
                />
              ))
            ) : (
              <div className="plot-wire-card-muted min-w-[280px] border-dashed px-4 py-6 text-sm text-black/50">
                No listener recommendations are active in this scope yet.
              </div>
            )}
          </HorizontalRail>
        </section>

        <section className="space-y-0">
          <RadiyoPlayerPanel
            mode="RADIYO"
            onCollectionEject={() => undefined}
            rotationPool={rotationPool}
            onRotationPoolChange={setRotationPool}
            selectedTier={tier}
            activeBroadcastTier={tier}
            onTierChange={handleChangeTier}
            broadcastLabel={currentBroadcastLabel}
            collectionTitle={null}
            trackQueue={currentRotationTracks}
            currentTrack={currentBroadcastTrack}
            currentTrackCount={currentRotationTracks.length}
            isBroadcastLoading={broadcastLoading}
            broadcastError={broadcastError}
            broadcastEmptyMessage={broadcastEmptyMessage}
          />

          <div className="mt-[-1px] rounded-b-[1rem] border border-t-0 border-black bg-[#161616] px-4 py-4 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/52">Travel</p>
                <p className="mt-1 text-sm text-white/82">
                  Travel stays attached to the player. Open it when you want the map and retune controls to drop below the current scope.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-auto rounded-full border-white/18 bg-white/8 px-4 py-2 text-[11px] text-white hover:bg-white/12"
                onClick={() => setTravelOpen((value) => !value)}
                disabled={!hasOriginContext}
              >
                {travelOpen ? 'Hide Travel' : 'Open Travel'}
              </Button>
            </div>
          </div>

          {travelOpen ? (
            <div className="mt-[-1px] rounded-b-[1.2rem] border border-t-0 border-black bg-[#efefe2] p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <p className="plot-wire-label">Travel Panel</p>
                  <h2 className="mt-1 text-lg font-semibold text-black">Move the scope without breaking community identity</h2>
                  <p className="mt-1 text-sm text-black/60">
                    Travel keeps the parent music community fixed and changes geography under the current player tier.
                  </p>
                </div>
                <div className="plot-wire-toolbar min-w-[260px]">
                  <p className="plot-wire-label">Origin Community</p>
                  <p className="mt-1 text-sm text-black/70">
                    {formatCommunityIdentity(
                      originScene?.city ?? null,
                      originScene?.state ?? null,
                      originMusicCommunity,
                    )}
                  </p>
                </div>
              </div>

              {!hasOriginContext ? (
                <div className="mt-4 rounded-[1rem] border border-black bg-[#f5e8bf] px-4 py-3 text-sm text-black">
                  Discover travel needs an active community context so the city, state, and music community are already known.
                </div>
              ) : null}

              <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
                <div className="plot-wire-toolbar">
                  <p className="plot-wire-label">Travel Search</p>
                  <input
                    value={locationQuery}
                    onChange={(event) => setLocationQuery(event.target.value)}
                    placeholder={tier === 'city' ? 'Search city' : tier === 'state' ? 'Search state' : 'Browse nationwide'}
                    className="mt-2 w-full border-0 bg-transparent px-0 py-0 text-base text-black placeholder:text-black/35 focus:outline-none focus:ring-0"
                    disabled={!hasOriginContext}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {DISCOVER_TIER_OPTIONS.map((value) => (
                    <Button
                      key={value}
                      size="sm"
                      variant="outline"
                      className={
                        tier === value
                          ? 'plot-wire-chip h-auto rounded-full bg-[#b8d63b] px-4 py-3 text-[11px] text-black'
                          : 'plot-wire-chip h-auto rounded-full bg-white px-4 py-3 text-[11px] text-black'
                      }
                      onClick={() => handleChangeTier(value)}
                      disabled={!hasOriginContext}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="plot-wire-card-muted plot-wire-grid-bg mt-5 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="plot-wire-label">Map View</p>
                    <p className="mt-1 text-xs text-black/55">
                      The visual map drops from the Travel bar and follows the same player scope.
                    </p>
                  </div>
                  {sceneMapError ? <p className="text-xs text-red-700">{sceneMapError}</p> : null}
                </div>
                <div className="h-56">
                  <SceneMap
                    points={sceneMap?.points ?? []}
                    selectedPointId={activeSceneId}
                    onSelectPoint={(point) => {
                      if (point.kind === 'community') {
                        void handleTuneSceneById(point.id);
                      }
                    }}
                  />
                </div>
              </div>

              {travelLoading ? <p className="mt-4 text-sm text-black/60">Loading Uprises for this scope...</p> : null}
              {travelError ? <p className="mt-4 text-sm text-red-700">{travelError}</p> : null}
              {token && isVisitor && activeSceneId ? (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[1rem] border border-black bg-[#b8d63b] px-4 py-3 text-sm text-black shadow-[3px_3px_0_rgba(0,0,0,0.2)]">
                  <p>
                    Travel active. You are tuned to {activeSceneName} and can visit the community now.
                  </p>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black"
                  >
                    <Link href={`/community/${activeSceneId}`}>Visit {activeSceneName}</Link>
                  </Button>
                </div>
              ) : null}

              {currentCityScenes.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {currentCityScenes.map((item) => (
                    <li key={item.sceneId} className="plot-wire-list-item">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="max-w-2xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-base font-semibold text-black">{item.name}</p>
                            <span className="plot-wire-chip">{getCitySceneStatusLabel(item, tunedSceneId)}</span>
                            <span className="plot-wire-chip">{formatMusicCommunityLabel(item.musicCommunity, originMusicCommunity)}</span>
                          </div>
                          <dl className="mt-3 grid gap-1 text-sm text-black/60">
                            <div className="flex flex-wrap gap-2">
                              <dt className="plot-wire-label">Location</dt>
                              <dd>{formatSceneLocation(item.city, item.state)}</dd>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <dt className="plot-wire-label">Members</dt>
                              <dd>{item.memberCount.toLocaleString()}</dd>
                            </div>
                          </dl>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className={
                              tunedSceneId === item.sceneId
                                ? 'plot-wire-chip h-auto rounded-full bg-[#b8d63b] px-4 py-2 text-[11px] text-black'
                                : 'plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black'
                            }
                            disabled={!token || tuningSceneId === item.sceneId}
                            onClick={() => void handleTuneSceneById(item.sceneId)}
                          >
                            {tuningSceneId === item.sceneId ? 'Retuning...' : tunedSceneId === item.sceneId ? 'Listening' : 'Retune'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black"
                            disabled={!token || savingUpriseSceneId === item.sceneId}
                            onClick={() => void handleSaveUprise(item.sceneId)}
                          >
                            {savingUpriseSceneId === item.sceneId ? 'Adding...' : 'Add'}
                          </Button>
                          {token ? (
                            <Button asChild size="sm" variant="outline" className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black">
                              <Link href={`/community/${item.sceneId}`}>Visit {item.name}</Link>
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black" disabled>
                              Visit {item.name}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black"
                            disabled={!token || item.isHomeScene || savingHomeSceneId === item.sceneId}
                            onClick={() => void handleSetHomeScene(item)}
                          >
                            {savingHomeSceneId === item.sceneId ? 'Saving...' : item.isHomeScene ? 'Home Scene' : 'Set as Home Scene'}
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}

              {travelItems.some(isStateRollup) ? (
                <div className="mt-4 space-y-3">
                  {travelItems.filter(isStateRollup).map((item) => (
                    <div key={item.state} className="plot-wire-list-item">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-base font-semibold text-black">{item.state} {item.musicCommunity}</p>
                          <p className="mt-1 text-sm text-black/60">
                            {item.citySceneCount} city scenes • {item.totalMembers.toLocaleString()} total members
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black"
                          onClick={() => {
                            handleChangeTier('state');
                            setLocationQuery(item.state);
                          }}
                        >
                          Browse {item.state}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
