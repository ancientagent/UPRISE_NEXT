'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

interface PromotionItem {
  id: string;
  type: string;
  createdAt: string;
  actor: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
  } | null;
  metadata: Record<string, unknown> | null;
}

interface PlotPromotionsPanelProps {
  communityId: string | null;
  communityName?: string | null;
}

function metadataText(metadata: Record<string, unknown> | null): string {
  if (!metadata) return 'No details provided.';
  const title = typeof metadata.title === 'string' ? metadata.title : null;
  const summary = typeof metadata.summary === 'string' ? metadata.summary : null;
  const cta = typeof metadata.callToAction === 'string' ? metadata.callToAction : null;
  return title ?? summary ?? cta ?? 'Promotion posted.';
}

export default function PlotPromotionsPanel({ communityId, communityName }: PlotPromotionsPanelProps) {
  const { token } = useAuthStore();
  const [items, setItems] = useState<PromotionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPromotions() {
      if (!communityId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get<PromotionItem[]>(`/communities/${communityId}/promotions?limit=20`, {
          token: token || undefined,
        });
        setItems(response.data ?? []);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unable to load promotions.';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    setItems([]);
    fetchPromotions();
  }, [communityId, token]);

  if (!communityId) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-lg font-semibold text-black">Promotions</h2>
        <p className="mt-2 text-sm text-black/60">
          Select a community in Statistics to anchor scene promotions.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6">
      <h2 className="text-lg font-semibold text-black">
        Promotions{communityName ? ` • ${communityName}` : ''}
      </h2>
      <p className="mt-1 text-xs text-black/50">
        Paid/local offers surface only. No Fair Play or governance effects.
      </p>

      {loading && <p className="mt-4 text-sm text-black/60">Loading promotions...</p>}

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="mt-4 text-sm text-black/60">No promotions posted for this scene.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="rounded-xl border border-black/10 p-3">
              <p className="text-sm font-medium text-black">{metadataText(item.metadata)}</p>
              <p className="mt-1 text-xs text-black/60">
                {item.actor?.displayName || item.actor?.username || 'Scene Publisher'} •{' '}
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
