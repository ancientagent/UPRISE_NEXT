'use client';

import { useEffect, useState } from 'react';
import { Button } from '@uprise/ui';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

interface PlotEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  locationName: string;
  address: string;
  attendeeCount: number;
  maxAttendees: number | null;
}

interface PlotEventsPanelProps {
  communityId: string | null;
  communityName?: string | null;
}

export default function PlotEventsPanel({ communityId, communityName }: PlotEventsPanelProps) {
  const { token } = useAuthStore();
  const [items, setItems] = useState<PlotEvent[]>([]);
  const [includePast, setIncludePast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      if (!communityId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get<PlotEvent[]>(
          `/communities/${communityId}/events?limit=20&includePast=${includePast}`,
          { token: token || undefined },
        );

        setItems(response.data ?? []);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unable to load events.';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    setItems([]);
    fetchEvents();
  }, [communityId, includePast, token]);

  if (!communityId) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="text-lg font-semibold text-black">Events</h2>
        <p className="mt-2 text-sm text-black/60">
          Select a community in Statistics to anchor scene events.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-black">
            Events{communityName ? ` • ${communityName}` : ''}
          </h2>
          <p className="mt-1 text-xs text-black/50">Scene-scoped events. No personalized ranking.</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setIncludePast((prev) => !prev)}>
          {includePast ? 'Upcoming Only' : 'Include Past'}
        </Button>
      </div>

      {loading && <p className="mt-4 text-sm text-black/60">Loading events...</p>}

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="mt-4 text-sm text-black/60">No events found for this scene.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="rounded-xl border border-black/10 p-3">
              <p className="text-sm font-medium text-black">{item.title}</p>
              <p className="mt-1 text-xs text-black/60">
                {new Date(item.startDate).toLocaleString()} • {item.locationName}
              </p>
              <p className="mt-1 text-xs text-black/50">
                {item.attendeeCount}
                {item.maxAttendees ? ` / ${item.maxAttendees}` : ''} attending
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
