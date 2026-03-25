'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@uprise/ui';
import { api } from '@/lib/api';
import { tuneDiscoverScene } from '@/lib/discovery/client';
import type { CommunityWithDistance } from '@/lib/types/community';
import { useAuthStore } from '@/store/auth';
import { useOnboardingStore } from '@/store/onboarding';
import SceneContextBadge from '@/components/plot/SceneContextBadge';

type CommunityFeedItem = {
  id: string;
  type: 'blast' | 'track_release' | 'event_created' | 'signal_created' | string;
  occurredAt: string;
  metadata?: Record<string, unknown>;
};

export default function CommunityProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { token } = useAuthStore();
  const { homeScene, tunedScene, isVisitor, setDiscoveryContext } = useOnboardingStore();

  const [community, setCommunity] = useState<CommunityWithDistance | null>(null);
  const [feedItems, setFeedItems] = useState<CommunityFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visitingScene, setVisitingScene] = useState(false);

  const communityId = useMemo(() => {
    const raw = params?.id;
    return typeof raw === 'string' ? raw : '';
  }, [params]);

  async function withTimeout<T>(promise: Promise<T>, timeoutMessage: string, timeoutMs = 8000): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = window.setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
      promise.then(
        (value) => {
          window.clearTimeout(timer);
          resolve(value);
        },
        (reason) => {
          window.clearTimeout(timer);
          reject(reason);
        },
      );
    });
  }

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!communityId) {
        if (isMounted) {
          setError('Invalid community id.');
          setLoading(false);
        }
        return;
      }

      if (!token) {
        if (isMounted) {
          setError('You must be signed in to view community details.');
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [communityRes, feedRes] = await withTimeout(
          Promise.all([
            api.get<CommunityWithDistance>(`/communities/${communityId}`, { token }),
            api.get<CommunityFeedItem[]>(`/communities/${communityId}/feed?limit=10`, { token }),
          ]),
          'Timed out while loading community profile.',
        );

        if (!isMounted) return;

        setCommunity(communityRes.data ?? null);
        setFeedItems(feedRes.data ?? []);
      } catch (e) {
        if (!isMounted) return;
        const message = e instanceof Error ? e.message : 'Failed to load community profile.';
        setError(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [communityId, token]);

  if (loading) {
    return (
      <main className="plot-wire-page pb-10">
        <div className="plot-wire-frame max-w-5xl">
          <div className="plot-wire-card p-6">
            <p className="plot-wire-label">Community Profile</p>
            <p className="mt-2 text-sm text-black/60">Loading community profile...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !community) {
    return (
      <main className="plot-wire-page pb-10">
        <div className="plot-wire-frame max-w-5xl">
          <div className="plot-wire-card p-6">
            <p className="plot-wire-label">Community Profile</p>
            <p className="mt-2 text-sm text-red-700">{error ?? 'Community not found.'}</p>
          </div>
          <div className="mt-4">
            <Button variant="outline" className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black" onClick={() => router.push('/plot')}>
              Back to Plot
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const members = community._count?.members ?? community.memberCount ?? 0;
  const tracks = community._count?.tracks ?? 0;
  const events = community._count?.events ?? 0;
  const handleVisitSceneInPlot = async () => {
    const matchesHomeScene = Boolean(
      homeScene?.city === community.city &&
        homeScene?.state === community.state &&
        homeScene?.musicCommunity === community.musicCommunity,
    );

    const localPatch = {
      tunedSceneId: community.id,
      tunedScene: {
        id: community.id,
        name: community.name,
        city: community.city ?? null,
        state: community.state ?? null,
        musicCommunity: community.musicCommunity ?? null,
        tier: community.tier === 'state' || community.tier === 'national' ? community.tier : 'city',
        isActive: Boolean(community.isActive),
      },
      isVisitor: matchesHomeScene ? false : true,
    };

    setVisitingScene(true);

    try {
      if (token) {
        const response = await tuneDiscoverScene(community.id, token);
        setDiscoveryContext({
          tunedSceneId: response.tunedSceneId,
          tunedScene: response.tunedScene,
          isVisitor: response.isVisitor,
        });
      } else {
        setDiscoveryContext(localPatch);
      }
      router.push('/plot');
    } catch {
      setDiscoveryContext(localPatch);
      router.push('/plot');
    } finally {
      setVisitingScene(false);
    }
  };

  return (
    <main className="plot-wire-page pb-10">
      <div className="plot-wire-frame max-w-5xl space-y-4">
        <section className="plot-wire-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="plot-wire-label">Community Profile</p>
              <h1 className="mt-2 text-3xl font-semibold text-black">{community.name}</h1>
              <p className="mt-1 text-sm text-black/60">
                {community.city && community.state && community.musicCommunity
                  ? `${community.city}, ${community.state} • ${community.musicCommunity}`
                  : 'Community identity unavailable.'}
              </p>
              <p className="mt-2 text-sm text-black/70">{community.description ?? 'No description yet.'}</p>
            </div>
            <div className="plot-wire-toolbar min-w-[240px]">
              <p className="plot-wire-label">Community State</p>
              <p className="mt-1 text-sm text-black/70">{community.isActive ? 'Active scene' : 'Inactive scene'}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-black/55">
                Tier <span className="font-semibold capitalize text-black">{community.tier ?? 'city'}</span>
              </p>
            </div>
          </div>
          <SceneContextBadge homeScene={homeScene} tunedScene={tunedScene} isVisitor={isVisitor} />

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="plot-wire-card-muted p-3">
              <p className="plot-wire-label">Members</p>
              <p className="mt-1 text-lg font-semibold text-black">{members.toLocaleString()}</p>
            </div>
            <div className="plot-wire-card-muted p-3">
              <p className="plot-wire-label">Tracks</p>
              <p className="mt-1 text-lg font-semibold text-black">{tracks.toLocaleString()}</p>
            </div>
            <div className="plot-wire-card-muted p-3">
              <p className="plot-wire-label">Events</p>
              <p className="mt-1 text-lg font-semibold text-black">{events.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="plot-wire-card-muted p-4">
              <p className="plot-wire-label">About This Community</p>
              <div className="mt-3 space-y-2 text-sm text-black/70">
                <p>Slug: {community.slug}</p>
                {community.radius ? <p>Geofence radius: {community.radius}m</p> : null}
                {community.coordinates ? (
                  <p>
                    Coordinates: {community.coordinates.lat.toFixed(4)}, {community.coordinates.lng.toFixed(4)}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="plot-wire-card-muted p-4">
              <p className="plot-wire-label">Actions</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black" onClick={() => router.push('/plot')}>
                  Back to Plot
                </Button>
                <Button variant="outline" className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black" onClick={() => void handleVisitSceneInPlot()} disabled={visitingScene}>
                  {visitingScene ? 'Opening Scene...' : 'Visit Scene in Plot'}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="plot-wire-panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="plot-wire-label">Recent Activity</p>
              <h2 className="mt-1 text-lg font-semibold text-black">Recent S.E.E.D Activity</h2>
            </div>
            <span className="plot-wire-chip">{feedItems.length} items</span>
          </div>
          {feedItems.length === 0 ? (
            <p className="mt-3 text-sm text-black/60">No recent activity yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {feedItems.map((item) => (
                <li key={item.id} className="plot-wire-list-item">
                  <p className="text-sm text-black">
                    <span className="font-medium">{item.type}</span>
                    <span className="text-black/50"> · {new Date(item.occurredAt).toLocaleString()}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
