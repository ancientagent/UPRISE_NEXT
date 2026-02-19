'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@uprise/ui';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

type FeedItemType = 'blast' | 'track_release' | 'event_created' | 'signal_created' | string;

interface FeedActor {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
}

interface FeedEntity {
  type: 'signal' | 'track' | 'event' | string;
  id: string;
}

interface FeedItem {
  id: string;
  type: FeedItemType;
  occurredAt: string;
  actor: FeedActor | null;
  entity: FeedEntity;
  metadata?: Record<string, unknown>;
}

interface FeedMeta {
  limit: number;
  nextCursor: string | null;
}

interface SeedFeedPanelProps {
  communityId: string | null;
  communityName?: string | null;
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

function formatActor(actor: FeedActor | null): string {
  if (!actor) return 'Community';
  return actor.displayName || actor.username || 'Community';
}

export default function SeedFeedPanel({ communityId, communityName }: SeedFeedPanelProps) {
  const { token } = useAuthStore();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => {
    if (!communityName) return 'S.E.E.D Feed';
    return `S.E.E.D Feed • ${communityName}`;
  }, [communityName]);

  const fetchPage = useCallback(
    async (before?: string | null) => {
      if (!communityId) return;

      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams();
        query.set('limit', '20');
        if (before) query.set('before', before);

        const response = await api.get<FeedItem[]>(
          `/communities/${communityId}/feed?${query.toString()}`,
          { token: token || undefined },
        );

        const pageItems = response.data ?? [];
        const meta = response.meta as FeedMeta | undefined;

        setItems((prev) => (before ? [...prev, ...pageItems] : pageItems));
        setNextCursor(meta?.nextCursor ?? null);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unable to load S.E.E.D feed.';
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
    if (!communityId) return;
    fetchPage(null);
  }, [communityId, fetchPage]);

  if (!communityId) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-lg font-semibold text-black">S.E.E.D Feed</h2>
        <p className="mt-2 text-sm text-black/60">
          Select a community in Statistics to anchor scene feed activity.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6">
      <h2 className="text-lg font-semibold text-black">{title}</h2>
      <p className="mt-1 text-xs text-black/50">
        Support, Explore, Engage, Distribute. Scene-scoped and non-personalized.
      </p>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!error && items.length === 0 && !loading ? (
        <p className="mt-4 text-sm text-black/60">No scene activity yet.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="rounded-xl border border-black/10 p-3">
              <p className="text-sm text-black">
                <span className="font-medium">{formatTypeLabel(item.type)}</span>
                <span className="text-black/60"> by {formatActor(item.actor)}</span>
              </p>
              <p className="mt-1 text-xs text-black/50">
                {new Date(item.occurredAt).toLocaleString()} • {item.entity.type}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={loading || !nextCursor}
          onClick={() => fetchPage(nextCursor)}
        >
          {loading ? 'Loading...' : 'Load More'}
        </Button>
      </div>
    </div>
  );
}
