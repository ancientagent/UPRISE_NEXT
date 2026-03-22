'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@uprise/ui';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { formatArtistBandEntityType } from '@/lib/registrar/artistBandLabels';

interface ShelfItem {
  signalId: string;
  type: string;
  createdAt: string;
  metadata: Record<string, unknown> | null;
}

interface Shelf {
  shelf: string;
  itemCount: number;
  items: ShelfItem[];
}

interface UserProfileData {
  user: {
    id: string;
    username: string;
    displayName: string;
    bio: string | null;
    avatar: string | null;
    city: string | null;
    country: string | null;
    collectionDisplayEnabled: boolean;
  };
  canViewCollection: boolean;
  collectionShelves: Shelf[];
  managedArtistBands: Array<{
    id: string;
    name: string;
    slug: string;
    entityType: string;
    membershipRole: string | null;
  }>;
}

const shelfLabel: Record<string, string> = {
  singles: 'Singles',
  uprises: 'Uprises',
  posters: 'Posters',
  fliers: 'Fliers',
  merch_buttons: 'Merch Buttons',
  merch_patches: 'Merch Patches',
  merch_shirts: 'Merch Shirts',
};

export default function UserProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { token, user: authUser } = useAuthStore();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = useMemo(() => (typeof params?.id === 'string' ? params.id : ''), [params]);
  const isOwner = authUser?.id === userId;

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

  async function loadProfile() {
    if (!userId) {
      setProfile(null);
      setError('Invalid user id.');
      setLoading(false);
      return;
    }

    if (!token) {
      setProfile(null);
      setError('You must be signed in to view user profiles.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const profileResponse = await withTimeout(
        api.get<UserProfileData>(`/users/${userId}/profile`, { token }),
        'Timed out while loading user profile.',
      );
      setProfile(profileResponse.data ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load user profile.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userId]);

  async function toggleCollectionDisplay() {
    if (!profile || !token || !isOwner) return;
    setSaving(true);

    try {
      await api.post('/users/me/collection-display', {
        enabled: !profile.user.collectionDisplayEnabled,
      }, { token });
      await loadProfile();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update collection visibility.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f5ef] px-6 py-12">
        <div className="mx-auto max-w-5xl rounded-2xl border border-black/10 bg-white p-6">
          <p className="text-sm text-black/60">Loading user profile...</p>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-[#f7f5ef] px-6 py-12">
        <div className="mx-auto max-w-5xl rounded-2xl border border-black/10 bg-white p-6">
          <p className="text-sm text-red-700">{error ?? 'User not found.'}</p>
          <div className="mt-4">
            <Button variant="outline" onClick={() => router.push('/plot')}>
              Back to Plot
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-black/50">User Profile</p>
          <h1 className="mt-2 text-3xl font-semibold text-black">{profile.user.displayName}</h1>
          <p className="mt-1 text-sm text-black/60">@{profile.user.username}</p>
          {profile.user.bio ? <p className="mt-3 text-sm text-black/70">{profile.user.bio}</p> : null}
          <p className="mt-2 text-xs text-black/50">
            {profile.user.city ?? 'Unknown City'}{profile.user.country ? `, ${profile.user.country}` : ''}
          </p>

          {isOwner ? (
            <div className="mt-5 rounded-xl border border-black/10 bg-black/5 p-4">
              <p className="text-sm font-medium text-black">Collection Display</p>
              <p className="mt-1 text-xs text-black/60">
                {profile.user.collectionDisplayEnabled
                  ? 'Your collection is visible on your public profile.'
                  : 'Your collection is hidden from other users.'}
              </p>
              <Button
                className="mt-3"
                size="sm"
                variant="outline"
                onClick={toggleCollectionDisplay}
                disabled={saving}
              >
                {saving
                  ? 'Saving...'
                  : profile.user.collectionDisplayEnabled
                    ? 'Hide Collection'
                    : 'Display Collection'}
              </Button>
            </div>
          ) : null}
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-lg font-semibold text-black">Collection</h2>
          {!profile.canViewCollection ? (
            <p className="mt-3 text-sm text-black/60">This user has not enabled collection display.</p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {profile.collectionShelves.map((shelf) => (
                <div key={shelf.shelf} className="rounded-xl border border-black/10 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-black">{shelfLabel[shelf.shelf] ?? shelf.shelf}</p>
                    <span className="text-xs text-black/50">{shelf.itemCount}</span>
                  </div>

                  {shelf.itemCount === 0 ? (
                    <p className="mt-2 text-xs text-black/50">No items yet.</p>
                  ) : (
                    <ul className="mt-3 space-y-2">
                      {shelf.items.slice(0, 8).map((item) => (
                        <li key={`${shelf.shelf}-${item.signalId}`} className="rounded-lg bg-black/5 px-3 py-2">
                          <p className="text-xs font-medium text-black">{item.type}</p>
                          <p className="text-[11px] text-black/50">{new Date(item.createdAt).toLocaleString()}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-lg font-semibold text-black">Linked Artist/Band Entities</h2>
          <p className="mt-1 text-sm text-black/60">
            Canonical registrar-linked entities managed by this user account.
          </p>
          {profile.managedArtistBands.length === 0 ? (
            <p className="mt-3 text-sm text-black/60">No linked Artist/Band entities.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {profile.managedArtistBands.map((entity) => (
                <li key={entity.id} className="rounded-lg border border-black/10 bg-black/[0.03] px-3 py-2">
                  <p className="text-sm font-medium text-black">{entity.name}</p>
                  <p className="text-xs text-black/60">
                    {formatArtistBandEntityType(entity.entityType)} • {entity.slug}
                    {entity.membershipRole ? ` • ${entity.membershipRole}` : ''}
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
