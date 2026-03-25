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
        <div key={index} className="plot-wire-list-item bg-[#efefe2] p-3">
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
    <div className="space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3 rounded-[1rem] border border-black bg-[#efefe2] px-4 py-3">
        <div>
          <h2 className="text-lg font-semibold text-black">
            Events{communityLabel ? ` • ${communityLabel}` : ''}
          </h2>
          <p className="mt-1 text-xs text-black/55">
            Scene-scoped events ordered by canonical start time. No personalized ranking.
          </p>
        </div>
        <Button size="sm" variant="outline" className="rounded-full border-black bg-white text-xs font-semibold uppercase tracking-[0.12em]" onClick={() => setIncludePast((prev) => !prev)}>
          {includePast ? 'Upcoming Only' : 'Include Past'}
        </Button>
      </header>

      {!token && (
        <div className="rounded-[1rem] border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p>Sign in is required to load scene events for this context.</p>
        </div>
      )}

      {token && loading && items.length === 0 ? <EventsSkeletonRows /> : null}

      {token && error && (
        <div className="rounded-[1rem] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>Events read failed for this scene context. {error}</p>
          <Button
            className="mt-3 h-8 rounded-full border-black bg-white text-xs font-semibold uppercase tracking-[0.12em]"
            size="sm"
            variant="outline"
            onClick={() => fetchEvents()}
          >
            Retry Events
          </Button>
        </div>
      )}

      {token && !loading && !error && items.length === 0 && (
        <div className="plot-wire-card-muted border-dashed p-4">
          <p className="text-sm font-medium text-black">No scene events are scheduled for this context.</p>
          <p className="mt-1 text-xs text-black/55">
            This panel stays descriptive and locality-bound. It does not hide ranked or promoted events.
          </p>
        </div>
      )}

      {token && !loading && !error && items.length > 0 && (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="plot-wire-list-item">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-black">{item.title}</p>
                  <p className="mt-1 text-xs text-black/60">
                    {new Date(item.startDate).toLocaleString()} • {item.locationName}
                  </p>
                </div>
                <span className="plot-wire-chip bg-[#d8e79a]">{formatEventStatus(item.startDate, item.endDate)}</span>
              </div>
              <p className="mt-2 text-xs text-black/55">
                Published by {item.createdBy?.displayName || item.createdBy?.username || 'Scene organizer'} • {new Date(item.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-1 text-xs text-black/50">
                {item.attendeeCount}
                {item.maxAttendees ? ` / ${item.maxAttendees}` : ''} attending
              </p>
              {item.description ? (
                <p className="mt-2 text-sm text-black/65">{item.description}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
