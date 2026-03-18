'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@uprise/ui';
import { useAuthStore } from '@/store/auth';
import { useOnboardingStore } from '@/store/onboarding';
import SceneContextBadge from '@/components/plot/SceneContextBadge';
import {
  getDiscoveryContext,
  listDiscoverScenes,
  setDiscoverHomeScene,
  tuneDiscoverScene,
  type DiscoverCitySceneItem,
  type DiscoverItem,
  type TierScope,
} from '@/lib/discovery/client';
import {
  mergeDiscoveryContextPatch,
  toDiscoveryContextPatch,
} from '@/lib/discovery/context';

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
  const [musicCommunity, setMusicCommunity] = useState(homeScene?.musicCommunity ?? '');
  const [stateFilter, setStateFilter] = useState(homeScene?.state ?? '');
  const [cityFilter, setCityFilter] = useState(homeScene?.city ?? '');
  const [items, setItems] = useState<DiscoverItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingHomeSceneId, setSavingHomeSceneId] = useState<string | null>(null);
  const [tuningSceneId, setTuningSceneId] = useState<string | null>(null);

  const canSearch = useMemo(() => musicCommunity.trim().length > 0, [musicCommunity]);
  const normalizedMusicCommunity = musicCommunity.trim();

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
    async function fetchScenes() {
      if (!token || !canSearch) {
        setItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await listDiscoverScenes(
          {
            tier,
            musicCommunity,
            state: stateFilter,
            city: cityFilter,
          },
          token,
        );
        setItems(response);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unable to load discovery scenes.';
        setError(message);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    fetchScenes();
  }, [token, tier, musicCommunity, stateFilter, cityFilter, canSearch]);

  const resultSummary = useMemo(() => {
    if (!token) {
      return {
        title: 'Sign in required',
        body: 'Sign in to view Scene Discovery results for your selected scope.',
      };
    }

    if (!canSearch) {
      return {
        title: 'Select a music community',
        body: 'Enter a music community to load deterministic scene results for the current scope.',
      };
    }

    if (loading) {
      return {
        title: 'Loading scenes',
        body: 'Loading scene results for the current scope and music community.',
      };
    }

    if (error) {
      return {
        title: 'Discovery unavailable',
        body: error,
      };
    }

    if (items.length === 0) {
      return {
        title: 'No scenes found',
        body: 'No scenes were found for this scope and music community filter.',
      };
    }

    return {
      title: 'Scene results ready',
      body: 'Showing deterministic scene results for the current scope and music community.',
    };
  }, [token, canSearch, loading, error, items.length]);

  const handleSetHomeScene = async (item: DiscoverCitySceneItem) => {
    if (!token) return;

    const targetLabel = `${item.city ?? 'Unknown City'}, ${item.state ?? 'Unknown State'} — ${
      item.musicCommunity ?? musicCommunity
    }`;
    const proceed = window.confirm(
      `Set Home Scene to ${targetLabel}? This changes your civic anchor and voting authority context.`
    );
    if (!proceed) return;

    setSavingHomeSceneId(item.sceneId);
    setError(null);

    try {
      const response = await setDiscoverHomeScene(item.sceneId, token);

      setHomeScene({
        city: response.homeScene?.city ?? item.city ?? '',
        state: response.homeScene?.state ?? item.state ?? '',
        musicCommunity: response.homeScene?.musicCommunity ?? item.musicCommunity ?? musicCommunity,
        tasteTag: homeScene?.tasteTag,
      });
      setDiscoveryContext(
        mergeDiscoveryContextPatch(response, {
          tunedSceneId,
          tunedScene,
          isVisitor,
        }),
      );

      setItems((prev) =>
        prev.map((entry) =>
          entry.entryType === 'city_scene'
            ? {
                ...entry,
                isHomeScene: entry.sceneId === item.sceneId,
              }
            : entry
        )
      );
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unable to set Home Scene.';
      setError(message);
    } finally {
      setSavingHomeSceneId(null);
    }
  };

  const handleTuneScene = async (item: DiscoverCitySceneItem) => {
    if (!token) return;
    setTuningSceneId(item.sceneId);
    setError(null);
    try {
      const response = await tuneDiscoverScene(item.sceneId, token);
      const context = await getDiscoveryContext(token);
      setDiscoveryContext(
        mergeDiscoveryContextPatch(context, {
          tunedSceneId: response.tunedSceneId ?? item.sceneId,
          tunedScene: response.tunedScene ?? null,
          isVisitor: response.isVisitor ?? null,
        }),
      );
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unable to tune to scene.';
      setError(message);
    } finally {
      setTuningSceneId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-black/10 bg-white/80 p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-black/50">Discover</p>
          <h1 className="mt-3 text-3xl font-semibold text-black">Scene Discovery</h1>
          <p className="mt-2 text-sm text-black/60">
            Discover is explicit navigation. It does not auto-join communities or change your Home Scene unless you
            choose to set one.
          </p>
          <p className="mt-2 text-xs text-black/50">
            Home Scene changes are explicit civic-anchor changes. Tune is visitor-only and does not affect voting.
          </p>
          <p className="mt-2 text-xs text-black/50">
            If your selected city is inactive or unavailable, onboarding routes you to the nearest active city Scene for the
            selected parent community and tracks your pioneer intent via the top-right notification icon in the profile strip.
          </p>
          <SceneContextBadge homeScene={homeScene} tunedScene={tunedScene} isVisitor={isVisitor} />
          <div className="mt-4 flex gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/plot">Back to Plot</Link>
            </Button>
          </div>
        </header>

        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="music-community-search" className="text-xs uppercase tracking-[0.2em] text-black/60">
                Music Community
              </label>
              <input
                id="music-community-search"
                aria-describedby="discover-search-scope-note"
                value={musicCommunity}
                onChange={(e) => setMusicCommunity(e.target.value)}
                placeholder="e.g. Punk"
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm"
              />
              <p id="discover-search-scope-note" className="mt-2 text-xs text-black/50">
                Search is limited to Scene and Music Community scope in MVP. Artist and band lookup is not supported.
              </p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-black/60">State Filter (optional)</label>
              <input
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                placeholder="e.g. TX"
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm"
              />
            </div>
          </div>
          {tier === 'city' && (
            <div className="mt-4">
              <label className="text-xs uppercase tracking-[0.2em] text-black/60">City Filter (optional)</label>
              <input
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                placeholder="e.g. Austin"
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm"
              />
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {(['city', 'state', 'national'] as TierScope[]).map((value) => (
              <Button
                key={value}
                size="sm"
                variant={tier === value ? 'default' : 'outline'}
                onClick={() => setTier(value)}
              >
                {value}
              </Button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-black/50">Discovery Results</p>
              <h2 className="mt-2 text-lg font-semibold text-black">Scene Results</h2>
            </div>
            <div className="rounded-xl border border-black/10 bg-[#f7f5ef] px-4 py-3 text-sm text-black/60">
              <p>
                Scope: <span className="capitalize">{tier}</span>
              </p>
              <p>
                Community: {normalizedMusicCommunity || 'Unlisted'}
              </p>
            </div>
          </div>

          {resultSummary ? (
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              aria-relevant="text"
              data-discovery-state={error ? 'error' : items.length > 0 ? 'results' : loading ? 'loading' : token ? 'empty-or-idle' : 'auth'}
              className={`mt-4 rounded-2xl border p-4 ${
                error ? 'border-red-200 bg-red-50 text-red-700' : 'border-black/10 bg-[#f7f5ef] text-black/60'
              }`}
            >
              <p className="text-sm font-medium">{resultSummary.title}</p>
              <p className="mt-1 text-sm">{resultSummary.body}</p>
            </div>
          ) : null}

          {items.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {items.map((item) =>
                item.entryType === 'city_scene' ? (
                  <li key={item.sceneId} className="rounded-xl border border-black/10 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-black">{item.name}</p>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-black/60">
                          <span className="rounded-full border border-black/10 bg-[#f7f5ef] px-3 py-1">
                            {getCitySceneStatusLabel(item, tunedSceneId)}
                          </span>
                          <span className="rounded-full border border-black/10 bg-[#f7f5ef] px-3 py-1">
                            {formatMusicCommunityLabel(item.musicCommunity, normalizedMusicCommunity)}
                          </span>
                        </div>
                        <dl className="mt-3 grid gap-1 text-sm text-black/60">
                          <div className="flex flex-wrap gap-2">
                            <dt className="font-medium text-black/70">Scope</dt>
                            <dd>City Scene</dd>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <dt className="font-medium text-black/70">Location</dt>
                            <dd>{formatSceneLocation(item.city, item.state)}</dd>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <dt className="font-medium text-black/70">Music Community</dt>
                            <dd>{formatMusicCommunityLabel(item.musicCommunity, normalizedMusicCommunity)}</dd>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <dt className="font-medium text-black/70">Members</dt>
                            <dd>{item.memberCount.toLocaleString()}</dd>
                          </div>
                        </dl>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/community/${item.sceneId}`}>Open Scene</Link>
                        </Button>
                        <Button
                          size="sm"
                          variant={tunedSceneId === item.sceneId ? 'default' : 'outline'}
                          disabled={tuningSceneId === item.sceneId}
                          onClick={() => handleTuneScene(item)}
                        >
                          {tunedSceneId === item.sceneId
                            ? 'Tuned'
                            : tuningSceneId === item.sceneId
                            ? 'Tuning...'
                            : 'Tune to Scene'}
                        </Button>
                        <Button
                          size="sm"
                          variant={item.isHomeScene ? 'default' : 'outline'}
                          disabled={item.isHomeScene || savingHomeSceneId === item.sceneId}
                          onClick={() => handleSetHomeScene(item)}
                        >
                          {item.isHomeScene ? 'Home Scene' : savingHomeSceneId === item.sceneId ? 'Saving...' : 'Set as Home Scene'}
                        </Button>
                      </div>
                    </div>
                  </li>
                ) : (
                  <li key={`state-${item.state}`} className="rounded-xl border border-black/10 p-4">
                    <p className="font-medium text-black">{item.state}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-black/60">
                      <span className="rounded-full border border-black/10 bg-[#f7f5ef] px-3 py-1">
                        {item.isHomeSceneState ? 'Home State' : 'State'}
                      </span>
                      <span className="rounded-full border border-black/10 bg-[#f7f5ef] px-3 py-1">
                        {formatMusicCommunityLabel(item.musicCommunity)}
                      </span>
                    </div>
                    <dl className="mt-3 grid gap-1 text-sm text-black/60">
                      <div className="flex flex-wrap gap-2">
                        <dt className="font-medium text-black/70">Scope</dt>
                        <dd>State Rollup</dd>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <dt className="font-medium text-black/70">State</dt>
                        <dd>{item.state}</dd>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <dt className="font-medium text-black/70">Music Community</dt>
                        <dd>{formatMusicCommunityLabel(item.musicCommunity)}</dd>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <dt className="font-medium text-black/70">City Scenes</dt>
                        <dd>{item.citySceneCount}</dd>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <dt className="font-medium text-black/70">Members</dt>
                        <dd>{item.totalMembers.toLocaleString()}</dd>
                      </div>
                    </dl>
                  </li>
                )
              )}
            </ul>
          ) : null}
        </section>
      </div>
    </main>
  );
}
