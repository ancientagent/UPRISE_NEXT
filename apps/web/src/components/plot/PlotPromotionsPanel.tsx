'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@uprise/ui';
import {
  getActiveCommunityPromotions,
  getCommunityPromotions,
  type CommunityPromotionItem,
} from '@/lib/communities/client';
import { useAuthStore } from '@/store/auth';

interface PlotPromotionsPanelProps {
  communityId: string | null;
  communityLabel?: string | null;
}

function metadataText(metadata: CommunityPromotionItem['metadata']): string {
  if (!metadata) return 'No details provided.';
  const title = typeof metadata.title === 'string' ? metadata.title : null;
  const summary = typeof metadata.summary === 'string' ? metadata.summary : null;
  const cta = typeof metadata.callToAction === 'string' ? metadata.callToAction : null;
  return title ?? summary ?? cta ?? 'Promotion posted.';
}

function metadataValue(metadata: CommunityPromotionItem['metadata'], keys: string[]): string | null {
  if (!metadata) return null;

  for (const key of keys) {
    const value = metadata[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

function PromotionsSkeletonRows() {
  return (
    <div className="mt-4 space-y-2" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <div key={index} className="rounded-xl border border-black/10 p-3">
          <div className="h-4 w-48 animate-pulse rounded bg-black/10" />
          <div className="mt-2 h-3 w-40 animate-pulse rounded bg-black/5" />
        </div>
      ))}
    </div>
  );
}

export default function PlotPromotionsPanel({ communityId, communityLabel }: PlotPromotionsPanelProps) {
  const { token } = useAuthStore();
  const [items, setItems] = useState<CommunityPromotionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPromotions = useCallback(async () => {
    if (!token) {
      setItems([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = communityId
        ? await getCommunityPromotions(communityId, { limit: 20 }, token || undefined)
        : await getActiveCommunityPromotions({ limit: 20 }, token || undefined);

      setItems(response);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unable to load promotions.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [communityId, token]);

  useEffect(() => {
    setItems([]);
    fetchPromotions();
  }, [fetchPromotions]);

  return (
    <div className="plot-zine-card plot-record-sleeve rounded-[1.45rem] p-6">
      <p className="plot-annotation-note inline-block text-lg">
        Promotions{communityLabel ? ` • ${communityLabel}` : ''}
      </p>
      <p className="mt-2 text-xs plot-ink-muted">
        Explicit local offers surface only. No Fair Play, governance, or recommendation effects.
      </p>

      {!token && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <p>Sign in is required to load promotions for this scene context.</p>
        </div>
      )}

      {token && loading && items.length === 0 ? <PromotionsSkeletonRows /> : null}

      {token && error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <p>Promotions read failed for this scene context. {error}</p>
          <Button
            className="mt-3 h-8 text-xs"
            size="sm"
            variant="outline"
            onClick={() => fetchPromotions()}
          >
            Retry Promotions
          </Button>
        </div>
      )}

      {token && !loading && !error && items.length === 0 && (
        <div className="plot-ledger-card mt-4 rounded-xl p-4">
          <p className="text-sm font-medium text-[var(--ink-main)]">No local offers are active for this scene context.</p>
          <p className="mt-1 text-xs plot-ink-muted">
            Promotions stay explicit and scoped here. They do not imply hidden boosts or feed ranking changes.
          </p>
        </div>
      )}

      {token && !loading && !error && items.length > 0 && (
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="plot-ledger-card rounded-xl p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-[var(--ink-main)]">{metadataText(item.metadata)}</p>
                  <p className="mt-1 text-xs plot-ink-muted">
                    {item.actor?.displayName || item.actor?.username || 'Scene Publisher'} • {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="plot-embossed-label px-3 py-1 text-[10px] font-semibold">
                  {metadataValue(item.metadata, ['status']) ?? item.type}
                </span>
              </div>
              {metadataValue(item.metadata, ['summary', 'description']) ? (
                <p className="mt-2 text-sm plot-ink-muted">{metadataValue(item.metadata, ['summary', 'description'])}</p>
              ) : null}
              <p className="mt-2 text-xs plot-ink-muted">
                {metadataValue(item.metadata, ['callToAction']) ?? 'Promotion posted.'}
                {metadataValue(item.metadata, ['expiresAt', 'expiration'])
                  ? ` • Expires ${metadataValue(item.metadata, ['expiresAt', 'expiration'])}`
                  : ''}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
