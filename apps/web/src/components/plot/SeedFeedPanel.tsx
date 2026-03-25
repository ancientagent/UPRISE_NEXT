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

function FeedSkeletonRows() {
  return (
    <div className="mt-4 space-y-2" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <div key={index} className="rounded-xl border border-black/10 p-3">
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
    <div className="plot-zine-card plot-record-sleeve rounded-[1.45rem] p-6">
      <p className="plot-annotation-note inline-block text-lg">{title}</p>
      <p className="mt-2 text-xs plot-ink-muted">
        Support, Explore, Engage, Distribute. Scene-scoped, reverse-chronological, and non-personalized.
      </p>
      <p className="plot-embossed-label mt-3 px-3 py-1 text-[11px]">{contextLabel}</p>

      {!token ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <p>Sign in is required to load the S.E.E.D feed for this scene context.</p>
        </div>
      ) : null}

      {token && error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <p>Feed read failed for this scene context. {error}</p>
          <Button
            className="mt-3 h-8 text-xs"
            size="sm"
            variant="outline"
            onClick={() => fetchPage(null)}
          >
            Retry Feed
          </Button>
        </div>
      )}

      {token && !error && loading && items.length === 0 ? (
        <FeedSkeletonRows />
      ) : null}

      {token && !error && items.length === 0 && !loading ? (
        <div className="plot-ledger-card mt-4 rounded-xl p-4">
          <p className="text-sm font-medium text-[var(--ink-main)]">No current scene activity for this context.</p>
          <p className="mt-1 text-xs plot-ink-muted">
            When explicit community actions land here, every listener in the same scene sees the same feed.
          </p>
        </div>
      ) : token ? (
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="plot-ledger-card rounded-xl p-3">
              <p className="text-sm text-[var(--ink-main)]">
                <span className="font-medium">{formatTypeLabel(item.type)}</span>
                <span className="plot-ink-muted">
                  {' '}
                  by{' '}
                  {item.actor ? (
                    <Link className="underline underline-offset-2" href={`/users/${item.actor.id}`}>
                      {formatActor(item.actor)}
                    </Link>
                  ) : (
                    formatActor(item.actor)
                  )}
                </span>
              </p>
              <p className="mt-2 text-xs plot-ink-muted">
                {new Date(item.occurredAt).toLocaleString()} • {item.entity.type}
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="plot-divider-tab text-[var(--ink-main)]"
          disabled={!token || loading || !nextCursor}
          onClick={() => fetchPage(nextCursor)}
        >
          <span>{loading ? 'Loading...' : 'Load More'}</span>
        </Button>
      </div>
    </div>
  );
}
