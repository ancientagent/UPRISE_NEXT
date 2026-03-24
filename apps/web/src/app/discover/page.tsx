'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@uprise/ui';
import type { CommunityDiscoverHighlights, CommunityDiscoverSearchResult } from '@uprise/types';
import SceneContextBadge from '@/components/plot/SceneContextBadge';
import SceneMap from '@/components/plot/SceneMap';
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

function CarouselSection({
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
        <h3 className="text-lg font-semibold text-black">{title}</h3>
        <p className="text-sm text-black/60">{subtitle}</p>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">{children}</div>
    </section>
  );
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

export default function DiscoverPage() {
  const { token } = useAuthStore();
  const {
    homeScene,
    tunedSceneId,
    tunedScene,
    isVisitor,
    setHomeScene,
    setDiscoveryContext,
  } = useOnboardingStore();

  const [tier, setTier] = useState<TierScope>('city');
  const [locationQuery, setLocationQuery] = useState(
    getDefaultLocationQueryForTier('city', homeScene, tunedScene),
  );
  const [travelItems, setTravelItems] = useState<DiscoverItem[]>([]);
  const [travelLoading, setTravelLoading] = useState(false);
  const [travelError, setTravelError] = useState<string | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
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
      : 'RaDIYo retunes here first.';
  const emptyHighlights: CommunityDiscoverHighlights = useMemo(
    () => ({
      community: {
        id: activeSceneId ?? 'unresolved-home-scene',
        name: activeSceneName,
        city: tunedScene?.city ?? homeScene?.city ?? null,
        state: tunedScene?.state ?? homeScene?.state ?? null,
        musicCommunity: tunedScene?.musicCommunity ?? homeScene?.musicCommunity ?? null,
        tier: 'city',
        isActive: Boolean(tunedScene?.isActive),
      },
      recommendations: [],
      trending: [],
      topArtists: [],
    }),
    [
      activeSceneId,
      activeSceneName,
      homeScene?.city,
      homeScene?.musicCommunity,
      homeScene?.state,
      tunedScene?.city,
      tunedScene?.isActive,
      tunedScene?.musicCommunity,
      tunedScene?.state,
    ],
  );

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

    fetchContext();
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
          const message = e instanceof Error ? e.message : 'Unable to load Uprises.';
          setTravelError(message);
          setTravelItems([]);
        }
      } finally {
        if (!ignore) {
          setTravelLoading(false);
        }
      }
    }

    fetchTravel();
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
        const response = await getCommunityDiscoverHighlights(activeSceneId, token || undefined, 8);
        if (!ignore) {
          setHighlights(response);
        }
      } catch (e) {
        if (!ignore) {
          const message = e instanceof Error ? e.message : 'Unable to load Discover highlights.';
          setHighlightsError(message);
          setHighlights(null);
        }
      } finally {
        if (!ignore) {
          setHighlightsLoading(false);
        }
      }
    }

    fetchHighlights();
    return () => {
      ignore = true;
    };
  }, [activeSceneId, emptyHighlights, localContextReady, token]);

  useEffect(() => {
    let ignore = false;

    async function fetchSceneMapData() {
      if (!activeSceneId || !token || !mapOpen) {
        if (!mapOpen) {
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

    fetchSceneMapData();
    return () => {
      ignore = true;
    };
  }, [activeSceneId, mapOpen, tier, token]);

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
        const response = await searchCommunityDiscover(activeSceneId, query, token || undefined, 8);
        if (!ignore) {
          setLocalSearchResult(response);
        }
      } catch (e) {
        if (!ignore) {
          const message = e instanceof Error ? e.message : 'Unable to search this community.';
          setLocalSearchError(message);
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
  }, [activeSceneId, emptyHighlights.community, localContextReady, localSearchQuery, token]);

  const resultSummary = useMemo(() => {
    if (!hasOriginContext) {
      return {
        title: 'Community context required',
        body: 'Discover travel inherits the full community identity you already left from. Open Discover from a real community context before trying to travel.',
      };
    }

    if (travelLoading) {
      return {
        title: 'Loading Uprises',
        body: 'Loading contextual Uprise results for the current travel scope.',
      };
    }

    if (travelError) {
      return {
        title: 'Discover unavailable',
        body: travelError,
      };
    }

    if (travelItems.length === 0) {
      return {
        title: 'No matching Uprise',
        body: 'No matching Uprise was found for this location. Open the map and continue exploration manually.',
      };
    }

    return {
      title: 'Uprises ready',
      body: 'Retune first, then explicitly visit the community when you want to enter it.',
    };
  }, [hasOriginContext, travelError, travelItems.length, travelLoading]);

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
      const message = e instanceof Error ? e.message : 'Unable to tune to Uprise.';
      setTravelError(message);
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
      const message = e instanceof Error ? e.message : 'Unable to set Home Scene.';
      setTravelError(message);
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
        const response = await getCommunityDiscoverHighlights(activeSceneId, token, 8);
        setHighlights(response);
      }
    } catch (e) {
      setHighlightsError(e instanceof Error ? e.message : `Unable to ${action} signal.`);
    }
  };

  const currentCityScenes = travelItems.filter(isCityScene);

  const handleChangeTier = (nextTier: TierScope) => {
    setTier(nextTier);
    setLocationQuery(getDefaultLocationQueryForTier(nextTier, homeScene, tunedScene));
    setTravelError(null);
  };

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-black/10 bg-white/80 p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-black/50">Discover</p>
          <h1 className="mt-3 text-3xl font-semibold text-black">Discover Uprises, Artists, and Songs</h1>
          <p className="mt-2 text-sm text-black/60">
            Travel starts from the community you are already in. Discover keeps that current community context and changes geography.
          </p>
          <SceneContextBadge homeScene={homeScene} tunedScene={tunedScene} isVisitor={isVisitor} />
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/plot">Back to Plot</Link>
            </Button>
            {token && activeSceneId ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/community/${activeSceneId}`}>Visit {activeSceneName}</Link>
              </Button>
            ) : null}
          </div>
          {actionMessage ? (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {actionMessage}
            </div>
          ) : null}
        </header>

        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-black/50">Uprise Travel</p>
              <h2 className="mt-2 text-lg font-semibold text-black">Search by city or state</h2>
              <p className="mt-1 text-sm text-black/60">
                Travel keeps your current community context fixed and changes geography around it.
              </p>
            </div>
            <div className="rounded-xl border border-black/10 bg-[#f7f5ef] px-4 py-3 text-sm text-black/60">
              <p>
                Origin community:{' '}
                {formatCommunityIdentity(
                  originScene?.city ?? null,
                  originScene?.state ?? null,
                  originMusicCommunity,
                )}
              </p>
              <p>Scope: <span className="capitalize">{tier}</span></p>
            </div>
          </div>

          {!hasOriginContext ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Discover travel needs an active community context so the city, state, and music community are already known.
            </div>
          ) : null}

          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              value={locationQuery}
              onChange={(event) => setLocationQuery(event.target.value)}
              placeholder={tier === 'city' ? 'Search city' : tier === 'state' ? 'Search state' : 'Browse nationwide'}
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm"
              disabled={!hasOriginContext}
            />
            <Button variant="outline" size="sm" onClick={() => setMapOpen((value) => !value)} disabled={!hasOriginContext}>
              {mapOpen ? 'Hide Map' : 'Map View'}
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(['city', 'state', 'national'] as TierScope[]).map((value) => (
              <Button
                key={value}
                size="sm"
                variant={tier === value ? 'default' : 'outline'}
                onClick={() => handleChangeTier(value)}
                disabled={!hasOriginContext}
              >
                {value}
              </Button>
            ))}
          </div>

          {mapOpen ? (
            <div className="mt-5 rounded-2xl border border-black/10 bg-[#f7f5ef] p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-black">Map Explorer</p>
                  <p className="text-xs text-black/50">
                    Drag across the scene map and click a community point to retune directly from Discover.
                  </p>
                </div>
                {sceneMapError ? <p className="text-xs text-red-600">{sceneMapError}</p> : null}
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
          ) : null}
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <div
            className={`rounded-2xl border p-4 ${travelError ? 'border-red-200 bg-red-50 text-red-700' : 'border-black/10 bg-[#f7f5ef] text-black/60'}`}
          >
            <p className="text-sm font-medium">{resultSummary.title}</p>
            <p className="mt-1 text-sm">{resultSummary.body}</p>
          </div>

          {currentCityScenes.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {currentCityScenes.map((item) => (
                <li key={item.sceneId} className="rounded-xl border border-black/10 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-black">{item.name}</p>
                        <span className="rounded-full border border-black/10 bg-[#f7f5ef] px-3 py-1 text-xs text-black/60">
                          {getCitySceneStatusLabel(item, tunedSceneId)}
                        </span>
                        <span className="rounded-full border border-black/10 bg-[#f7f5ef] px-3 py-1 text-xs text-black/60">
                          {formatMusicCommunityLabel(item.musicCommunity, originMusicCommunity)}
                        </span>
                      </div>
                      <dl className="mt-3 grid gap-1 text-sm text-black/60">
                        <div className="flex flex-wrap gap-2">
                          <dt className="font-medium text-black/70">Location</dt>
                          <dd>{formatSceneLocation(item.city, item.state)}</dd>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <dt className="font-medium text-black/70">Members</dt>
                          <dd>{item.memberCount.toLocaleString()}</dd>
                        </div>
                      </dl>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant={tunedSceneId === item.sceneId ? 'default' : 'outline'}
                        disabled={!token || tuningSceneId === item.sceneId}
                        onClick={() => void handleTuneSceneById(item.sceneId)}
                      >
                        {tuningSceneId === item.sceneId ? 'Retuning...' : tunedSceneId === item.sceneId ? 'Listening' : 'Retune'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!token || savingUpriseSceneId === item.sceneId}
                        onClick={() => void handleSaveUprise(item.sceneId)}
                      >
                        {savingUpriseSceneId === item.sceneId ? 'Adding...' : 'Add'}
                      </Button>
                      {token ? (
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/community/${item.sceneId}`}>Visit {item.name}</Link>
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          Visit {item.name}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!token || item.isHomeScene || savingHomeSceneId === item.sceneId}
                        onClick={() => void handleSetHomeScene(item)}
                      >
                        {savingHomeSceneId === item.sceneId ? 'Saving...' : item.isHomeScene ? 'Home Scene' : 'Set Home'}
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
                <div key={item.state} className="rounded-xl border border-black/10 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-black">{item.state} {item.musicCommunity}</p>
                      <p className="mt-1 text-sm text-black/60">
                        {item.citySceneCount} city scenes • {item.totalMembers.toLocaleString()} total members
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
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
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-black/50">Current Community Discover</p>
              <h2 className="mt-2 text-lg font-semibold text-black">{activeSceneName}</h2>
              <p className="mt-1 text-sm text-black/60">
                Search artists and songs inside the current community, then explore the community-driven carousels below.
              </p>
            </div>
            <div className="rounded-xl border border-black/10 bg-[#f7f5ef] px-4 py-3 text-sm text-black/60">
              <p>Visitor mode: {isVisitor ? 'Active' : 'Off'}</p>
              <p>{localDiscoverLockedReason}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              value={localSearchQuery}
              onChange={(event) => setLocalSearchQuery(event.target.value)}
              placeholder={
                localContextReady
                  ? `Search artists and songs in ${activeSceneName}`
                  : 'Home Scene or tuned community required'
              }
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm"
              disabled={!localContextReady}
            />
            {activeSceneId ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/community/${activeSceneId}`}>Visit {activeSceneName}</Link>
              </Button>
            ) : null}
          </div>

          {localSearchLoading ? (
            <p className="mt-3 text-sm text-black/60">Searching this community...</p>
          ) : null}
          {localSearchError ? <p className="mt-3 text-sm text-red-700">{localSearchError}</p> : null}
          {localSearchResult ? (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <section className="rounded-2xl border border-black/10 p-4">
                <h3 className="text-sm font-semibold text-black">Artists</h3>
                {localSearchResult.artists.length === 0 ? (
                  <p className="mt-2 text-sm text-black/50">No artists matched this search.</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {localSearchResult.artists.map((artist) => (
                      <li key={artist.artistBandId} className="rounded-xl bg-black/5 px-3 py-2">
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
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              <section className="rounded-2xl border border-black/10 p-4">
                <h3 className="text-sm font-semibold text-black">Songs</h3>
                {localSearchResult.songs.length === 0 ? (
                  <p className="mt-2 text-sm text-black/50">No songs matched this search.</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {localSearchResult.songs.map((song) => (
                      <li key={song.trackId} className="rounded-xl bg-black/5 px-3 py-2">
                        {song.artistBandId ? (
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
          ) : null}

          <div className="mt-6 space-y-6">
            {highlightsLoading ? <p className="text-sm text-black/60">Loading community highlights...</p> : null}
            {highlightsError ? <p className="text-sm text-red-700">{highlightsError}</p> : null}

            {highlights ? (
              <>
                <CarouselSection
                  title="Recommendations"
                  subtitle="Signals recommended by listeners in this community."
                >
                  {highlights.recommendations.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-black/10 bg-[#f7f5ef] px-4 py-6 text-sm text-black/50">
                      No recommended signals yet.
                    </div>
                  ) : (
                    highlights.recommendations.map((signal) => (
                      <article key={signal.signalId} className="min-w-[260px] rounded-2xl border border-black/10 bg-[#f7f5ef] p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-black/50">Signal</p>
                        <h4 className="mt-2 text-base font-semibold text-black">{String(signal.metadata?.title ?? signal.metadata?.name ?? signal.type)}</h4>
                        <p className="mt-1 text-xs text-black/60">{signal.actionCounts.recommend} recommends</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" disabled={!token} onClick={() => void handleSignalAction(signal.signalId, 'add', 'Signal added to your collection.')}>Add</Button>
                          <Button size="sm" variant="outline" disabled={!token} onClick={() => void handleSignalAction(signal.signalId, 'blast', 'Signal blasted to your community.')}>Blast</Button>
                          <Button size="sm" variant="outline" disabled={!token} onClick={() => void handleSignalAction(signal.signalId, 'recommend', 'Signal recommended.')}>Recommend</Button>
                        </div>
                      </article>
                    ))
                  )}
                </CarouselSection>

                <CarouselSection
                  title="Trending"
                  subtitle="Current signal momentum in this community, driven by blast counts."
                >
                  {highlights.trending.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-black/10 bg-[#f7f5ef] px-4 py-6 text-sm text-black/50">
                      No trending signals yet.
                    </div>
                  ) : (
                    highlights.trending.map((signal) => (
                      <article key={signal.signalId} className="min-w-[260px] rounded-2xl border border-black/10 bg-[#f7f5ef] p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-black/50">Trending</p>
                        <h4 className="mt-2 text-base font-semibold text-black">{String(signal.metadata?.title ?? signal.metadata?.name ?? signal.type)}</h4>
                        <p className="mt-1 text-xs text-black/60">{signal.actionCounts.blast} blasts</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" disabled={!token} onClick={() => void handleSignalAction(signal.signalId, 'add', 'Signal added to your collection.')}>Add</Button>
                          <Button size="sm" variant="outline" disabled={!token} onClick={() => void handleSignalAction(signal.signalId, 'blast', 'Signal blasted to your community.')}>Blast</Button>
                          <Button size="sm" variant="outline" disabled={!token} onClick={() => void handleSignalAction(signal.signalId, 'recommend', 'Signal recommended.')}>Recommend</Button>
                        </div>
                      </article>
                    ))
                  )}
                </CarouselSection>

                <CarouselSection
                  title="Top Artists"
                  subtitle="Community-leading artists gathered from listener stats in this Uprise."
                >
                  {highlights.topArtists.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-black/10 bg-[#f7f5ef] px-4 py-6 text-sm text-black/50">
                      No top artists yet.
                    </div>
                  ) : (
                    highlights.topArtists.map((artist) => (
                      <article key={artist.artistBandId} className="min-w-[240px] rounded-2xl border border-black/10 bg-[#f7f5ef] p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-black/50">Artist</p>
                        <Link
                          href={`/artist-bands/${artist.artistBandId}`}
                          className="mt-2 block rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                        >
                          <h4 className="text-base font-semibold text-black">{artist.name}</h4>
                          <p className="mt-1 text-xs text-black/60">
                            {artist.followCount} followers • {artist.memberCount} members
                          </p>
                          <p className="mt-1 text-xs text-black/50">
                            {formatCommunityIdentity(
                              artist.homeSceneCity,
                              artist.homeSceneState,
                              artist.homeSceneMusicCommunity,
                            )}
                          </p>
                        </Link>
                      </article>
                    ))
                  )}
                </CarouselSection>
              </>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
