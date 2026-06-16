'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@uprise/ui';
import type { AdminAnalyticsQueryData } from '@uprise/types';
import { useAuthStore } from '@/store/auth';
import { getAdminAnalytics } from '@/lib/admin/client';

const metricLabels: Record<keyof AdminAnalyticsQueryData['retainedMetrics'], string> = {
  listenCountAllTime: 'Listen Count All Time',
  mostListenedSignals: 'Most Listened Signals',
  mostUpvotedSignals: 'Most Upvoted Signals',
  mixtapeAppearanceCount: 'Mixtape Appearance Count',
  appearanceCountByTier: 'Appearance Count By Tier',
};

export default function AdminPage() {
  const { token } = useAuthStore();
  const [analytics, setAnalytics] = useState<AdminAnalyticsQueryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!token) {
        setAnalytics(null);
        setLoading(false);
        setError('Sign in is required to view admin analytics.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getAdminAnalytics(token);
        setAnalytics(response.data ?? null);
      } catch (nextError) {
        setAnalytics(null);
        setError(nextError instanceof Error ? nextError.message : 'Failed to load admin analytics.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f5ef] px-6 py-12">
        <div className="mx-auto max-w-6xl rounded-2xl border border-black/10 bg-white p-6">
          <p className="text-sm text-black/60">Loading admin analytics...</p>
        </div>
      </main>
    );
  }

  if (error || !analytics) {
    return (
      <main className="min-h-screen bg-[#f7f5ef] px-6 py-12">
        <div className="mx-auto max-w-4xl rounded-2xl border border-black/10 bg-white p-6">
          <p className="text-sm text-red-700">{error ?? 'Admin analytics unavailable.'}</p>
          <div className="mt-4">
            <Link href="/plot">
              <Button variant="outline">Back to Plot</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-black/50">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold text-black">Retained Analytics</h1>
          <p className="mt-2 max-w-3xl text-sm text-black/65">
            Read-only MVP admin view for platform totals and retained metrics that may stay hidden from public MVP surfaces.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {Object.entries(analytics.platformTotals).map(([key, value]) => (
            <div key={key} className="rounded-2xl border border-black/10 bg-white p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-black/45">{key}</p>
              <p className="mt-2 text-2xl font-semibold text-black">{value.toLocaleString()}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-lg font-semibold text-black">Signal Action Totals</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {Object.entries(analytics.signalActionTotals).map(([key, value]) => (
              <div key={key} className="rounded-xl border border-black/10 bg-black/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-black/45">{key}</p>
                <p className="mt-2 text-xl font-semibold text-black">{value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          {Object.entries(analytics.retainedMetrics).map(([key, metric]) => (
            <div key={key} className="rounded-2xl border border-black/10 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-black">
                    {metricLabels[key as keyof AdminAnalyticsQueryData['retainedMetrics']]}
                  </h2>
                  <p className="mt-1 text-sm text-black/60">
                    {metric.tracked ? 'Tracked in current MVP runtime.' : metric.reason ?? 'Not currently tracked.'}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                    metric.tracked ? 'bg-[#b8d63b] text-black' : 'bg-black/10 text-black/60'
                  }`}
                >
                  {metric.tracked ? 'Tracked' : 'Unavailable'}
                </span>
              </div>

              {typeof metric.total === 'number' ? (
                <p className="mt-4 text-2xl font-semibold text-black">{metric.total.toLocaleString()}</p>
              ) : null}

              {metric.counts ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {Object.entries(metric.counts).map(([countKey, value]) => (
                    <div key={countKey} className="rounded-xl border border-black/10 bg-black/[0.03] p-4">
                      <p className="text-xs uppercase tracking-[0.14em] text-black/45">{countKey}</p>
                      <p className="mt-2 text-xl font-semibold text-black">{value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {metric.items && metric.items.length > 0 ? (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-black/50">
                      <tr>
                        <th className="pb-2 pr-4 font-medium">Title</th>
                        <th className="pb-2 pr-4 font-medium">Artist</th>
                        <th className="pb-2 pr-4 font-medium">Community</th>
                        <th className="pb-2 pr-4 font-medium">Tier</th>
                        <th className="pb-2 font-medium">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metric.items.map((item) => (
                        <tr key={`${key}-${item.trackId}`} className="border-t border-black/8">
                          <td className="py-2 pr-4 text-black">{item.title}</td>
                          <td className="py-2 pr-4 text-black/70">{item.artist}</td>
                          <td className="py-2 pr-4 text-black/70">{item.communityName ?? 'Unscoped'}</td>
                          <td className="py-2 pr-4 text-black/70">{item.communityTier ?? 'n/a'}</td>
                          <td className="py-2 font-medium text-black">{item.value.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
