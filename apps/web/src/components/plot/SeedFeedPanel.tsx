'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@uprise/ui';
import {
  getActiveCommunityFeed,
  getCommunityFeed,
  type CommunityFeedActor,
  type CommunityFeedItem,
} from '@/lib/communities/client';
import { useAuthStore } from '@/store/auth';

type FeedItemType = CommunityFeedItem['type'];

interface SeedFeedPanelProps {
  communityId: string | null;
  communityLabel?: string | null;
  selectedTier: 'city' | 'state' | 'national';
}

function formatTypeLabel(type: FeedItemType): string {
  switch (type) {
    case 'blast':
      return 'Blast';
    case 'track_release':
      return 'Track Release';
    case 'event_created':
      return 'Event Created';
    case 'signal_created':
      return 'Signal Created';
    default:
      return type;
  }
}

function formatActor(actor: CommunityFeedActor | null): string {
  if (!actor) return 'Community';
  return actor.displayName || actor.username || 'Community';
}

function sourceFromMetadata(item: CommunityFeedItem): { id: string; name: string } | null {
  const artistBand = item.metadata?.artistBand;
  if (!artistBand || typeof artistBand !== 'object') return null;

  const id = 'id' in artistBand && typeof artistBand.id === 'string' ? artistBand.id : null;
  const name = 'name' in artistBand && typeof artistBand.name === 'string' ? artistBand.name : null;

  if (!id || !name) return null;
  return { id, name };
}

function FeedSkeletonRows() {
  return (
    <div className="mt-4 space-y-2" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <div key={index} className="plot-wire-list-item bg-[#efefe2] p-3">
          <div className="h-4 w-40 animate-pulse rounded bg-black/10" />
          <div className="mt-2 h-3 w-56 animate-pulse rounded bg-black/5" />
        </div>
      ))}
    </div>
  );
}

export default function SeedFeedPanel({
  communityId,
  communityLabel,
  selectedTier,
}: SeedFeedPanelProps) {
  const { token } = useAuthStore();
  const [items, setItems] = useState<CommunityFeedItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [resolvedSceneId, setResolvedSceneId] = useState<string | null>(communityId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => {
    if (!communityLabel) return 'S.E.E.D Feed';
    return `S.E.E.D Feed • ${communityLabel}`;
  }, [communityLabel]);

  const contextLabel = useMemo(() => {
    const tierLabel = selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1);
    if (communityLabel) {
      return `${tierLabel} scene anchor: ${communityLabel}`;
    }

    if (resolvedSceneId) {
      return `${tierLabel} active scene fallback loaded`;
    }

    return `${tierLabel} scene context is resolving`;
  }, [communityLabel, resolvedSceneId, selectedTier]);

  const fetchPage = useCallback(
    async (before?: string | null) => {
      if (!token) {
        setItems([]);
        setNextCursor(null);
        setResolvedSceneId(communityId);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = communityId
          ? await getCommunityFeed(
              communityId,
              { limit: 20, before },
              token || undefined,
            )
          : await getActiveCommunityFeed({ limit: 20, before }, token || undefined);

        setItems((prev) => (before ? [...prev, ...response.items] : response.items));
        setNextCursor(response.nextCursor);
        setResolvedSceneId(response.sceneId);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : 'Unable to load the scene feed right now.';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [communityId, token],
  );

  useEffect(() => {
    setItems([]);
    setNextCursor(null);
    fetchPage(null);
  }, [communityId, fetchPage]);

  return (
    <div className="space-y-4">
      <header className="plot-wire-card-muted bg-[#efefe2] px-4 py-3">
        <h2 className="text-lg font-semibold text-black">{title}</h2>
        <p className="mt-1 text-xs text-black/55">
          Support, Explore, Engage, Distribute. Scene-scoped, reverse-chronological, and non-personalized.
        </p>
        <p className="mt-2 text-[11px] text-black/62">{contextLabel}</p>
      </header>

      {!token ? (
        <div className="rounded-[1rem] border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p>Sign in is required to load the S.E.E.D feed for this scene context.</p>
        </div>
      ) : null}

      {token && error && (
        <div className="rounded-[1rem] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>Feed read failed for this scene context. {error}</p>
          <Button
            className="mt-3 h-8 rounded-full border-black bg-white text-xs font-semibold uppercase tracking-[0.12em]"
            size="sm"
            variant="outline"
            onClick={() => fetchPage(null)}
          >
            Retry Feed
          </Button>
        </div>
      )}

      {token && !error && loading && items.length === 0 ? <FeedSkeletonRows /> : null}

      {token && !error && items.length === 0 && !loading ? (
        <div className="plot-wire-card-muted border-dashed p-4">
          <p className="text-sm font-medium text-black">No current scene activity for this context.</p>
          <p className="mt-1 text-xs text-black/55">
            When explicit community actions land here, every listener in the same scene sees the same feed.
          </p>
        </div>
      ) : token ? (
        <ul className="space-y-2">
          {items.map((item) => {
            const source = sourceFromMetadata(item);

            return (
              <li key={item.id} className="plot-wire-list-item">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-black">
                      <span className="font-medium">{formatTypeLabel(item.type)}</span>
                      <span className="text-black/60">
                        {' '}
                        by{' '}
                        {source ? (
                          <Link className="underline underline-offset-2" href={`/artist-bands/${source.id}`}>
                            {source.name}
                          </Link>
                        ) : item.actor ? (
                          <Link className="underline underline-offset-2" href={`/users/${item.actor.id}`}>
                            {formatActor(item.actor)}
                          </Link>
                        ) : (
                          formatActor(item.actor)
                        )}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-black/50">
                      {new Date(item.occurredAt).toLocaleString()} • {item.entity.type}
                    </p>
                  </div>
                  <span className="plot-wire-chip shrink-0">{formatTypeLabel(item.type)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-black bg-white text-xs font-semibold uppercase tracking-[0.12em]"
          disabled={!token || loading || !nextCursor}
          onClick={() => fetchPage(nextCursor)}
        >
          {loading ? 'Loading...' : 'Load More'}
        </Button>
      </div>
    </div>
  );
}
