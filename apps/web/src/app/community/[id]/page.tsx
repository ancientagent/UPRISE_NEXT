'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@uprise/ui';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

type CommunityProfile = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  avatar?: string | null;
  coverImage?: string | null;
  memberCount?: number;
  radius?: number | null;
  coordinates?: { lat: number; lng: number } | null;
  _count?: {
    members?: number;
    tracks?: number;
    events?: number;
  };
};

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

  const [community, setCommunity] = useState<CommunityProfile | null>(null);
  const [feedItems, setFeedItems] = useState<CommunityFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const communityId = useMemo(() => {
    const raw = params?.id;
    return typeof raw === 'string' ? raw : '';
  }, [params]);

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

        const [communityRes, feedRes] = await Promise.all([
          api.get<CommunityProfile>(`/communities/${communityId}`, { token }),
          api.get<CommunityFeedItem[]>(`/communities/${communityId}/feed?limit=10`, { token }),
        ]);

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

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-black/50">Community Profile</p>
          <h1 className="mt-2 text-3xl font-semibold text-black">{community.name}</h1>
          <p className="mt-2 text-sm text-black/70">{community.description ?? 'No description yet.'}</p>

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
            <Button variant="outline" onClick={() => router.push('/plot')}>
              Visit Scene in Plot
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
