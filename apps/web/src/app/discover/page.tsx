'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@uprise/ui';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { useOnboardingStore } from '@/store/onboarding';
import SceneContextBadge from '@/components/plot/SceneContextBadge';

type TierScope = 'city' | 'state' | 'national';

type DiscoverCitySceneItem = {
  entryType: 'city_scene';
  sceneId: string;
  name: string;
  city: string | null;
  state: string | null;
  musicCommunity: string | null;
  memberCount: number;
  isActive: boolean;
  isHomeScene: boolean;
};

type DiscoverStateRollupItem = {
  entryType: 'state_rollup';
  state: string;
  musicCommunity: string;
  citySceneCount: number;
  totalMembers: number;
  representativeSceneId: string | null;
  isHomeSceneState: boolean;
};

type DiscoverItem = DiscoverCitySceneItem | DiscoverStateRollupItem;

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

  useEffect(() => {
    async function fetchContext() {
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
        // Keep persisted client context when fetch fails.
      }
    }

    fetchContext();
  }, [token, setDiscoveryContext]);

  useEffect(() => {
    async function fetchScenes() {
      if (!token || !canSearch) return;

      const params = new URLSearchParams({
        tier,
        musicCommunity: musicCommunity.trim(),
      });

      if (stateFilter.trim()) params.set('state', stateFilter.trim());
      if (tier === 'city' && cityFilter.trim()) params.set('city', cityFilter.trim());

      setLoading(true);
      setError(null);

      try {
        const response = await api.get<DiscoverItem[]>(`/discover/scenes?${params.toString()}`, {
          token,
        });
        setItems(response.data ?? []);
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
      const response = await api.post<{
        tunedScene: {
          id: string;
          name: string;
          city: string | null;
          state: string | null;
          musicCommunity: string | null;
          tier: string;
          isActive: boolean;
        };
        isVisitor: boolean;
        homeScene: {
          city: string | null;
          state: string | null;
          musicCommunity: string | null;
        };
        tunedSceneId: string;
      }>('/discover/set-home-scene', { sceneId: item.sceneId }, { token });

      setHomeScene({
        city: response.data?.homeScene?.city ?? item.city ?? '',
        state: response.data?.homeScene?.state ?? item.state ?? '',
        musicCommunity: response.data?.homeScene?.musicCommunity ?? item.musicCommunity ?? musicCommunity,
        tasteTag: homeScene?.tasteTag,
      });
      setDiscoveryContext({
        tunedSceneId: response.data?.tunedSceneId ?? item.sceneId,
        tunedScene: response.data?.tunedScene ?? null,
        isVisitor: response.data?.isVisitor ?? null,
      });

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
      const response = await api.post<{ tunedSceneId: string; isVisitor: boolean }>(
        '/discover/tune',
        { sceneId: item.sceneId },
        { token }
      );
      const context = await api.get<{
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
        tunedSceneId: context.data?.tunedSceneId ?? response.data?.tunedSceneId ?? item.sceneId,
        tunedScene: context.data?.tunedScene ?? null,
        isVisitor: context.data?.isVisitor ?? response.data?.isVisitor ?? null,
      });
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
              <label className="text-xs uppercase tracking-[0.2em] text-black/60">Music Community</label>
              <input
                value={musicCommunity}
                onChange={(e) => setMusicCommunity(e.target.value)}
                placeholder="e.g. Punk"
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm"
              />
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

        {error && (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </section>
        )}

        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-lg font-semibold text-black">Results</h2>
          <p className="mt-1 text-sm text-black/60">
            Scope: <span className="capitalize">{tier}</span> · Community: {musicCommunity || 'Not set'}
          </p>

          {!token ? (
            <p className="mt-4 text-sm text-black/60">Sign in to load discovery results.</p>
          ) : loading ? (
            <p className="mt-4 text-sm text-black/60">Loading scenes...</p>
          ) : items.length === 0 ? (
            <p className="mt-4 text-sm text-black/60">No scenes found for this scope/filter.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {items.map((item) =>
                item.entryType === 'city_scene' ? (
                  <li key={item.sceneId} className="rounded-xl border border-black/10 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-black">{item.name}</p>
                        <p className="text-sm text-black/60">
                          {item.city}, {item.state} · {item.memberCount.toLocaleString()} members
                        </p>
                        <p className="mt-1 text-xs text-black/50">
                          {item.isHomeScene ? 'Current Home Scene' : item.isActive ? 'Active scene' : 'Inactive scene'}
                        </p>
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
                    <p className="text-sm text-black/60">
                      {item.citySceneCount} city scenes · {item.totalMembers.toLocaleString()} members
                    </p>
                    <p className="mt-1 text-xs text-black/50">
                      {item.isHomeSceneState ? 'Contains your Home Scene state' : 'State-level rollup'}
                    </p>
                  </li>
                )
              )}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
