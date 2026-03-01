'use client';

import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { Button } from '@uprise/ui';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import type { PlotPanelState } from '@/store/plot-ui';
import type { CollectionTrack } from '@/components/plot/PlotPlayerStrip';

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

const TRACK_TITLE_KEYS = ['title', 'trackTitle', 'songTitle', 'name'];
const TRACK_ARTIST_KEYS = ['artist', 'artistName', 'band', 'bandName', 'creator'];

function pickMetadataString(metadata: Record<string, unknown> | null, keys: string[]): string | null {
  if (!metadata) return null;
  for (const key of keys) {
    const value = metadata[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

export function mapShelfItemToCollectionTrack(item: ShelfItem, shelf: string): CollectionTrack {
  const title = pickMetadataString(item.metadata, TRACK_TITLE_KEYS) ?? item.type;
  const artist = pickMetadataString(item.metadata, TRACK_ARTIST_KEYS) ?? 'Collection Item';

  return {
    id: item.signalId,
    title,
    artist,
    shelf,
  };
}

interface ProfileExpansionPanelProps {
  panelState: PlotPanelState;
  onExpand: () => void;
  onCollapse: () => void;
  onPeek: () => void;
  onSelectCollectionTrack: (track: CollectionTrack) => void;
}

export default function ProfileExpansionPanel({
  panelState,
  onExpand,
  onCollapse,
  onPeek,
  onSelectCollectionTrack,
}: ProfileExpansionPanelProps) {
  const { token, user } = useAuthStore();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeShelf, setActiveShelf] = useState<string | null>(null);
  const dragStartY = useRef<number | null>(null);
  const dragDelta = useRef(0);

  const isExpanded = panelState === 'expanded';

  useEffect(() => {
    async function loadProfile() {
      if (!token || !user?.id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<UserProfileData>(`/users/${user.id}/profile`, { token });
        const next = response.data ?? null;
        setProfile(next);
        if (next && !activeShelf) {
          const firstWithItems = next.collectionShelves.find((shelf) => shelf.itemCount > 0)?.shelf;
          setActiveShelf(firstWithItems || next.collectionShelves[0]?.shelf || null);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load profile collection.');
      } finally {
        setLoading(false);
      }
    }

    if (isExpanded) {
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded, token, user?.id]);

  const currentShelf = useMemo(
    () => profile?.collectionShelves.find((shelf) => shelf.shelf === activeShelf) ?? profile?.collectionShelves[0] ?? null,
    [activeShelf, profile?.collectionShelves],
  );

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragStartY.current = event.clientY;
    dragDelta.current = 0;
    (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartY.current === null) return;
    dragDelta.current = event.clientY - dragStartY.current;

    if (!isExpanded && dragDelta.current > 20) {
      onPeek();
    }
  };

  const onPointerUp = () => {
    const delta = dragDelta.current;
    dragStartY.current = null;
    dragDelta.current = 0;

    if (!isExpanded && delta > 50) {
      onExpand();
      return;
    }

    if (isExpanded && delta < -50) {
      onCollapse();
    }
  };

  return (
    <section className="mt-6 rounded-2xl border border-black/10 bg-white/90 p-4 shadow-sm">
      <div
        className="flex cursor-grab items-center justify-between gap-3 rounded-xl border border-black/10 bg-black/[0.03] px-3 py-3"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-black/55">Profile</p>
          <p className="truncate text-sm font-semibold text-black">
            {user?.displayName || user?.username || 'My Profile'}
          </p>
          <p className="text-xs text-black/60">Drag down to expand • drag up to collapse</p>
        </div>
        <div className="flex gap-2">
          {isExpanded ? (
            <Button size="sm" variant="outline" onClick={onCollapse}>Collapse</Button>
          ) : (
            <Button size="sm" variant="outline" onClick={onExpand}>Open Profile</Button>
          )}
        </div>
      </div>

      {isExpanded ? (
        <div className="mt-4 space-y-4">
          <section className="rounded-xl border border-black/10 bg-white p-4">
            {loading ? (
              <p className="text-sm text-black/60">Loading profile...</p>
            ) : error ? (
              <p className="text-sm text-red-700">{error}</p>
            ) : profile ? (
              <>
                <h2 className="text-xl font-semibold text-black">{profile.user.displayName}</h2>
                <p className="text-sm text-black/60">@{profile.user.username}</p>
                {profile.user.bio ? <p className="mt-2 text-sm text-black/70">{profile.user.bio}</p> : null}
                <p className="mt-1 text-xs text-black/55">
                  {profile.user.city ?? 'Unknown City'}{profile.user.country ? `, ${profile.user.country}` : ''}
                </p>
              </>
            ) : (
              <p className="text-sm text-black/60">Profile unavailable.</p>
            )}
          </section>

          <section className="rounded-xl border border-black/10 bg-white p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {(profile?.collectionShelves ?? []).map((shelf) => (
                <Button
                  key={shelf.shelf}
                  size="sm"
                  variant={currentShelf?.shelf === shelf.shelf ? 'default' : 'outline'}
                  onClick={() => setActiveShelf(shelf.shelf)}
                >
                  {shelfLabel[shelf.shelf] ?? shelf.shelf} ({shelf.itemCount})
                </Button>
              ))}
            </div>

            {!profile?.canViewCollection ? (
              <p className="text-sm text-black/60">Collection display is disabled.</p>
            ) : !currentShelf ? (
              <p className="text-sm text-black/60">No shelves available.</p>
            ) : currentShelf.items.length === 0 ? (
              <p className="text-sm text-black/60">No items in this shelf yet.</p>
            ) : (
              <ul className="space-y-2">
                {currentShelf.items.slice(0, 20).map((item) => {
                  const track = mapShelfItemToCollectionTrack(item, shelfLabel[currentShelf.shelf] ?? currentShelf.shelf);
                  return (
                    <li key={`${currentShelf.shelf}-${item.signalId}`} className="rounded-lg border border-black/10 bg-black/[0.02] p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-black">{track.title}</p>
                          <p className="truncate text-xs text-black/60">{track.artist}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => onSelectCollectionTrack(track)}>
                          Play
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      ) : null}
    </section>
  );
}
