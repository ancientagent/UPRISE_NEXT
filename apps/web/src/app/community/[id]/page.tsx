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
      <main className="min-h-screen bg-[#f7f5ef] px-6 py-12">
        <div className="mx-auto max-w-4xl rounded-2xl border border-black/10 bg-white p-6">
          <p className="text-sm text-black/60">Loading community profile...</p>
        </div>
      </main>
    );
  }

  if (error || !community) {
    return (
      <main className="min-h-screen bg-[#f7f5ef] px-6 py-12">
        <div className="mx-auto max-w-4xl rounded-2xl border border-black/10 bg-white p-6">
          <p className="text-sm text-red-700">{error ?? 'Community not found.'}</p>
          <div className="mt-4">
            <Button variant="outline" onClick={() => router.push('/plot')}>
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
    <main className="min-h-screen bg-[#f7f5ef] px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-black/50">Community Profile</p>
          <h1 className="mt-2 text-3xl font-semibold text-black">{community.name}</h1>
          <p className="mt-1 text-sm text-black/60">
            {community.city && community.state && community.musicCommunity
              ? `${community.city}, ${community.state} • ${community.musicCommunity}`
              : 'Community identity unavailable.'}
          </p>
          <p className="mt-2 text-sm text-black/70">{community.description ?? 'No description yet.'}</p>
          <SceneContextBadge homeScene={homeScene} tunedScene={tunedScene} isVisitor={isVisitor} />

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-black/5 p-3">
              <p className="text-xs text-black/50">Members</p>
              <p className="text-lg font-semibold text-black">{members.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-black/5 p-3">
              <p className="text-xs text-black/50">Tracks</p>
              <p className="text-lg font-semibold text-black">{tracks.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-black/5 p-3">
              <p className="text-xs text-black/50">Events</p>
              <p className="text-lg font-semibold text-black">{events.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-5 text-xs text-black/50">
            <p>Slug: {community.slug}</p>
            {community.radius ? <p>Geofence radius: {community.radius}m</p> : null}
            {community.coordinates ? (
              <p>
                Coordinates: {community.coordinates.lat.toFixed(4)}, {community.coordinates.lng.toFixed(4)}
              </p>
            ) : null}
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={() => router.push('/plot')}>
              Back to Plot
            </Button>
            <Button variant="outline" onClick={() => void handleVisitSceneInPlot()} disabled={visitingScene}>
              {visitingScene ? 'Opening Scene...' : 'Visit Scene in Plot'}
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-lg font-semibold text-black">Recent S.E.E.D Activity</h2>
          {feedItems.length === 0 ? (
            <p className="mt-3 text-sm text-black/60">No recent activity yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {feedItems.map((item) => (
                <li key={item.id} className="rounded-xl border border-black/10 p-3">
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
