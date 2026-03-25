'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@uprise/ui';
import {
  getActiveCommunityEvents,
  getCommunityEvents,
  type CommunityEventItem,
} from '@/lib/communities/client';
import { useAuthStore } from '@/store/auth';

interface PlotEventsPanelProps {
  communityId: string | null;
  communityLabel?: string | null;
}

function formatEventStatus(startDate: string, endDate: string): 'Upcoming' | 'Live now' | 'Ended' {
  const now = Date.now();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  if (Number.isFinite(end) && end < now) {
    return 'Ended';
  }

  if (Number.isFinite(start) && start <= now) {
    return 'Live now';
  }

  return 'Upcoming';
}

function EventsSkeletonRows() {
  return (
    <div className="mt-4 space-y-2" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <div key={index} className="rounded-xl border border-black/10 p-3">
          <div className="h-4 w-48 animate-pulse rounded bg-black/10" />
          <div className="mt-2 h-3 w-56 animate-pulse rounded bg-black/5" />
        </div>
      ))}
    </div>
  );
}

export default function PlotEventsPanel({ communityId, communityLabel }: PlotEventsPanelProps) {
  const { token } = useAuthStore();
  const [items, setItems] = useState<CommunityEventItem[]>([]);
  const [includePast, setIncludePast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
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
        ? await getCommunityEvents(
            communityId,
            { limit: 20, includePast },
            token || undefined,
          )
        : await getActiveCommunityEvents(
            { limit: 20, includePast },
            token || undefined,
          );

      setItems(response);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unable to load events.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [communityId, includePast, token]);

  useEffect(() => {
    setItems([]);
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="plot-zine-card plot-record-sleeve rounded-[1.45rem] p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="plot-annotation-note inline-block text-lg">
            Events{communityLabel ? ` • ${communityLabel}` : ''}
          </p>
          <p className="mt-2 text-xs plot-ink-muted">
            Scene-scoped events ordered by canonical start time. No personalized ranking.
          </p>
        </div>
        <Button size="sm" variant="outline" className="plot-divider-tab text-[var(--ink-main)]" onClick={() => setIncludePast((prev) => !prev)}>
          <span>{includePast ? 'Upcoming Only' : 'Include Past'}</span>
        </Button>
      </div>

      {!token && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <p>Sign in is required to load scene events for this context.</p>
        </div>
      )}

      {token && loading && items.length === 0 ? <EventsSkeletonRows /> : null}

      {token && error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <p>Events read failed for this scene context. {error}</p>
          <Button
            className="mt-3 h-8 text-xs"
            size="sm"
            variant="outline"
            onClick={() => fetchEvents()}
          >
            Retry Events
          </Button>
        </div>
      )}

      {token && !loading && !error && items.length === 0 && (
        <div className="plot-ledger-card mt-4 rounded-xl p-4">
          <p className="text-sm font-medium text-[var(--ink-main)]">No scene events are scheduled for this context.</p>
          <p className="mt-1 text-xs plot-ink-muted">
            This panel stays descriptive and locality-bound. It does not hide ranked or promoted events.
          </p>
        </div>
      )}

      {token && !loading && !error && items.length > 0 && (
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="plot-ledger-card rounded-xl p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-[var(--ink-main)]">{item.title}</p>
                  <p className="mt-1 text-xs plot-ink-muted">
                    {new Date(item.startDate).toLocaleString()} • {item.locationName}
                  </p>
                </div>
                <span className="plot-embossed-label px-3 py-1 text-[10px] font-semibold">
                  {formatEventStatus(item.startDate, item.endDate)}
                </span>
              </div>
              <p className="mt-2 text-xs plot-ink-muted">
                Published by {item.createdBy?.displayName || item.createdBy?.username || 'Scene organizer'} • {new Date(item.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-1 text-xs plot-ink-muted">
                {item.attendeeCount}
                {item.maxAttendees ? ` / ${item.maxAttendees}` : ''} attending
              </p>
              {item.description ? (
                <p className="mt-2 text-sm plot-ink-muted">{item.description}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
